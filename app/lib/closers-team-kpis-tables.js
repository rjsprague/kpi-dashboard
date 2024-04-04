// "use client";


function formatTime(milliseconds) {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
}

function extractLeadName(lead) {
    return lead["Contact Name"] || lead["Seller Contact Name"] ||
        (lead["First"] && lead["Last"] ? lead["First"] + " " + lead["Last"] :
            lead["First"] || lead["Last"] || lead.Title || "No Name");
}

export function calculateTeamKpiTables(lead, apiName, adminJson) {
    // console.log(lead)
    // console.log(apiName)
    // console.log(adminJson)

    const adminData = JSON.parse(adminJson); // Assuming adminJson is a JSON string.
    let result = {};

    switch (apiName) {
        case 'Team STL Median':
            result = calculateTeamStlTable(lead, adminData);
            break;
        case 'Setters STL Median':
            result = calculateSettersStlTable(lead, adminData);
            break;
        case 'Closers STL Median':
            result = calculateClosersStlTable(lead, adminData);
            break;
        case 'Team Effort':
            result = calculateTeamEffortTable(lead, adminData);
            break;
        default:
            console.log('Unknown API Name');
            return;
    }

    return result;
}

function calculateTeamStlTable(lead, data) {
    // Safely access properties with null checks
    const leadName = extractLeadName(lead)
    const leadCreatedTs = data.lead_created_ts || null;
    const finalOutboundCallTs = data.speed_to_lead && data.speed_to_lead.final_setter_first_outbound_call ? data.speed_to_lead.final_setter_first_outbound_call.created_on : null;
    const setterCallTs = data.setter_call && data.setter_call.created_on ? data.setter_call.created_on : null;
    const setterResponsible = data.setter_call && data.setter_call.setter_responsible && data.setter_call.setter_responsible.name ? data.setter_call.setter_responsible.name : "No Setter Call";

    // Calculate STL if dates are available, else indicate incomplete data
    let stl = "❌";
    let completed = "Someone didn’t call";
    if (leadCreatedTs && (finalOutboundCallTs || setterCallTs)) {
        const createdDate = new Date(leadCreatedTs);
        const completedDate = new Date(finalOutboundCallTs || setterCallTs);
        stl = formatTime(completedDate - createdDate)
        completed = finalOutboundCallTs || setterCallTs;
    }

    // Identify if all setters have made an outbound call
    const allSettersCalled = data.setters && data.setters.every(setter => setter.first_outbound_call && setter.first_outbound_call.created_on);
    const naughtyList = !allSettersCalled ? data.setters.filter(setter => !setter.first_outbound_call || !setter.first_outbound_call.created_on).map(setter => setter.name).join(', ') : '✅';

    return {
        Name: leadName, // Placeholder, actual name handling needed
        Created: leadCreatedTs,
        Completed: completed,
        STL: stl,
        "Setter Responsible": setterResponsible,
        "Naughty List": naughtyList
    };
}


function calculateSettersStlTable(lead, data) {
    // Extracting the name in the same manner as the calculateTeamStlTable function
    const leadName = extractLeadName(lead);
    const leadCreatedTs = data.lead_created_ts || null;
    const setterCallTs = data.setter_call && data.setter_call.created_on ? data.setter_call.created_on : null;
    const setterResponsible = data.setter_call && data.setter_call.setter_responsible && data.setter_call.setter_responsible.name ? data.setter_call.setter_responsible.name : "No Setter Call";

    // if no setter call, we don't want to include the lead in the table
    if (!setterCallTs) return null;


    // console.log(leadName)
    // console.log(leadCreatedTs)
    // console.log(setterCallTs)
    // console.log(setterResponsible)

    let stl = "❌";
    let completed = setterCallTs || "No Setter Call";
    if (leadCreatedTs && setterCallTs) {
        const createdDate = new Date(leadCreatedTs);
        const completedDate = new Date(setterCallTs);
        stl = formatTime(completedDate - createdDate);
    }

    return {
        Name: leadName,
        Created: leadCreatedTs,
        Completed: completed,
        STL: stl,
        SetterResponsible: setterResponsible
    };
}


function calculateClosersStlTable(lead, data) {
    const leadName = extractLeadName(lead);
    const created = data.discovery_call_booking && data.discovery_call_booking.created_on ? data.discovery_call_booking.created_on : null;
    const completed = data.discovery_call_booking && data.discovery_call_booking.closer_assigned && data.discovery_call_booking.closer_assigned.first_outbound_call ? data.discovery_call_booking.closer_assigned.first_outbound_call.created_on : "CALL NOW";

    if (!created) return null;

    let stl = "❌";
    if (created && completed !== "CALL NOW") {
        const createdDate = new Date(created);
        const completedDate = new Date(completed);
        stl = formatTime(completedDate - createdDate)
    }

    const closerAssigned = data.discovery_call_booking && data.discovery_call_booking.closer_assigned && data.discovery_call_booking.closer_assigned.name ? data.discovery_call_booking.closer_assigned.name : "No Closer Assigned";

    return {
        Name: leadName,
        Created: created,
        Completed: completed,
        STL: stl,
        CloserAssigned: closerAssigned
    };
}


function calculateTeamEffortTable(lead, data) {
    const leadName = extractLeadName(lead);
    const leadCreatedTs = data.lead_created_ts || null;
    const finalOutboundCallTs = data.speed_to_lead && data.speed_to_lead.final_setter_first_outbound_call ? data.speed_to_lead.final_setter_first_outbound_call.created_on : "❌";

    // Checking if every setter has attempted contact
    const allSettersCalled = data.setters && data.setters.every(setter => setter.first_outbound_call && setter.first_outbound_call.created_on);
    const effort = finalOutboundCallTs ? "✅" : allSettersCalled ? "✅" : "❌";

    return {
        Name: leadName,
        Created: leadCreatedTs,
        Complete: finalOutboundCallTs,
        Effort: effort
    };
}

