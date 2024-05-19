import { Concert_One } from 'next/font/google';
import { calculateDelayedStart, convertTimestamp } from './date-utils';

// Helper functions
function formatTime(seconds) {
    let hours = Math.floor(seconds / (60 * 60));
    let minutes = Math.floor((seconds % (60 * 60)) / (60));
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;

    return `${hours}h ${minutes}m`;
}

function extractLeadName(lead) {
    return lead["Contact Name"] || lead["Seller Contact Name"] ||
        (lead["First"] && lead["Last"] ? lead["First"] + " " + lead["Last"] :
            lead["First"] || lead["Last"] || lead.Title || "No Name");
}


// Closers Acquisitions KPI calculation functions
export function calculateClosersAcquisitionTables(lead, apiEndpointKey, namesAddresses) {
    
    // This is only in REIA Leads API objects
    const adminData = lead.admin_json && JSON.parse(lead.admin_json);

    let result = {};

    switch (apiEndpointKey) {
        case 'closersLeadsTriaged':
            result = calculateLeadsTriagedTable(lead, namesAddresses);
            break;
        case 'closersLeadsConnected':
            result = calculateLeadsConnectedTable(lead, adminData);
            break;
    }
    return result;
}

function calculateLeadsConnectedTable(lead, data) {

    // console.log(lead)
    // console.log(data)
    if (!data) return null; // Skip if there's no data
    
    const firstConnection = data.first_connection && data.first_connection.timestamp ? data.first_connection.timestamp : null;

    if (!lead.contact_phones || !firstConnection) return null; // Skip if there's no phone number or first connection timestamp

    const leadName = extractLeadName(lead);
    const leadCreatedTs = lead["Lead Created On"] && lead["Lead Created On"].start ? lead["Lead Created On"].start : null;
    const leadStatus = lead["Lead Status"] ? lead["Lead Status"] : "❓";
    const leadSource = lead["Lead Source Item"] ? lead["Lead Source Item"] : "❓";
    const podio_item_id = lead.itemid ? lead.itemid : lead.podio_item_id;

    return {
        Date: leadCreatedTs,
        Name: leadName,
        "First Connection": firstConnection,
        "Lead Status": leadStatus,
        "Lead Source": leadSource,
        podio_item_id: podio_item_id,
        seller_id: podio_item_id
    };
}

function calculateLeadsTriagedTable(lead, namesAddresses) {

    console.log(namesAddresses)

    const triageCallDate = lead.created_on && lead.created_on.start ? lead.created_on.start : null;
    const leadName = namesAddresses[lead["Related Lead"][0]]?.Name ? namesAddresses[lead["Related Lead"][0]]?.Name : "❓";
    const leadStatus = namesAddresses[lead["Related Lead"][0]]?.Status ? namesAddresses[lead["Related Lead"][0]]?.Status : "❓";
    const leadSource = lead["Related Lead Source Item"] ? lead["Related Lead Source Item"] : "❓";
    const qualification = lead.Qualification ? lead.Qualification[0] : "❓";
    const setterResponsible = lead["Setter Responsible"] ? lead["Setter Responsible"] : "❓";
    const seller_id = namesAddresses[lead["Related Lead"]] ? namesAddresses[lead["Related Lead"]].seller_id : "No Seller ID"
    
    return {        
        Date: triageCallDate,
        Name: leadName,
        Qualification: qualification,        
        "Lead Status": leadStatus,
        "Lead Source": leadSource,
        "Setter": setterResponsible,
        podio_item_id: lead.itemid ? lead.itemid : lead.podio_item_id,
        seller_id: seller_id
    };
}



// Team KPI calculation functions
export function calculateTeamKpiTables(lead, apiName, adminJson) {

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
    }

    return result;
}

function calculateTeamStlTable(lead, data) {
    const leadName = extractLeadName(lead);
    const leadCreatedTs = data.lead_created_ts ? convertTimestamp(data.lead_created_ts, 'Pacific/Honolulu', 'America/New_York') : null;
    const finalOutboundCallTs = data.speed_to_lead && data.speed_to_lead.final_setter_first_outbound_call ? convertTimestamp(data.speed_to_lead.final_setter_first_outbound_call.created_on, 'Pacific/Honolulu', 'America/New_York') : null;
    const setterCallTs = data.setter_call && data.setter_call.created_on ? convertTimestamp(data.setter_call.created_on, 'Pacific/Honolulu', 'America/New_York') : null;

    let stl = "❌";
    let completed = "Someone didn't call";
    if (leadCreatedTs && (finalOutboundCallTs || setterCallTs)) {
        const diffInSeconds = calculateDelayedStart(leadCreatedTs, finalOutboundCallTs || setterCallTs, 'America/New_York');
        stl = formatTime(diffInSeconds);
        completed = finalOutboundCallTs || setterCallTs;
    }

    // console.log(data)

    const setterResponsible = data.setter_call && data.setter_call.setter_responsible && data.setter_call.setter_responsible.name ? data.setter_call.setter_responsible.name : "No Setter Call";
    const allSettersCalled = data?.setters && data?.setters?.every(setter => setter?.first_outbound_call && setter?.first_outbound_call?.created_on);
    const naughtyList = !allSettersCalled && data.setters ? data.setters.filter(setter => setter?.first_outbound_call === null).map(setter => setter.name).join(', ') : '✅';

    return {
        Name: leadName,
        Created: leadCreatedTs,
        Completed: completed,
        STL: stl,
        "Setter Responsible": setterResponsible,
        "Naughty List": naughtyList,
        podio_item_id: lead.itemid ? lead.itemid : lead.podio_item_id,
    };
}

function calculateSettersStlTable(lead, data) {
    // Extracting the name in the same manner as the calculateTeamStlTable function
    const leadName = extractLeadName(lead);
    const leadCreatedTs = convertTimestamp(data.lead_created_ts, 'Pacific/Honolulu', 'America/New_York') || null;
    const setterCallTs = data.setter_call && data.setter_call.created_on ? convertTimestamp(data.setter_call.created_on, 'Pacific/Honolulu', 'America/New_York') : null;
    const setterResponsible = data.setter_call && data.setter_call.setter_responsible && data.setter_call.setter_responsible.name ? data.setter_call.setter_responsible.name : "No Setter Call";

    console.log(leadCreatedTs)
    console.log(setterCallTs)
    // if no setter call, we don't want to include the lead in the table
    if (!setterCallTs) return null;

    let stl = "❌";
    let completed = setterCallTs || "No Setter Call";
    if (leadCreatedTs && setterCallTs) {
        const diffInSeconds = calculateDelayedStart(leadCreatedTs, setterCallTs, 'America/New_York');
        stl = formatTime(diffInSeconds);
    }

    return {
        Name: leadName,
        Created: leadCreatedTs,
        Completed: completed,
        STL: stl,
        SetterResponsible: setterResponsible,
        podio_item_id: lead.itemid ? lead.itemid : lead.podio_item_id,
    };
}

function calculateClosersStlTable(lead, data) {
    const leadName = extractLeadName(lead);

    // Ensure you're accessing properties through the `data` object
    const dcBookingCreated = data.discovery_call_booking && data.discovery_call_booking.created_on ?
        convertTimestamp(data.discovery_call_booking.created_on, 'Pacific/Honolulu', 'America/New_York') : null;

    const dcBookingCompleted = data.discovery_call_booking && data.discovery_call_booking.closer_assigned && data.discovery_call_booking.closer_assigned.first_outbound_call ?
        convertTimestamp(data.discovery_call_booking.closer_assigned.first_outbound_call.created_on, 'Pacific/Honolulu', 'America/New_York') : "CALL NOW";

    // Correcting the variable used for checking existence of the timestamp
    if (!dcBookingCreated) return null;

    let stl = "❌";
    if (dcBookingCreated && dcBookingCompleted !== "CALL NOW") {
        // Assuming `calculateDelayedStart` calculates the difference correctly and returns seconds
        const diffInSeconds = calculateDelayedStart(dcBookingCreated, dcBookingCompleted, 'America/New_York');
        stl = formatTime(diffInSeconds); // Make sure `formatTime` can handle the seconds correctly
    }

    const closerAssigned = data.discovery_call_booking && data.discovery_call_booking.closer_assigned && data.discovery_call_booking.closer_assigned.name ?
        data.discovery_call_booking.closer_assigned.name : "No Closer Assigned";

    return {
        Name: leadName,
        Created: dcBookingCreated,
        Completed: dcBookingCompleted,
        STL: stl,
        CloserAssigned: closerAssigned,
        podio_item_id: lead.itemid ? lead.itemid : lead.podio_item_id,
    };
}

function calculateTeamEffortTable(lead, data) {
    const leadName = extractLeadName(lead);

    // Convert leadCreatedTs from 'Pacific/Honolulu' to 'America/New_York'
    const leadCreatedTs = data.lead_created_ts ? convertTimestamp(data.lead_created_ts, 'Pacific/Honolulu', 'America/New_York') : null;

    // Check for finalOutboundCallTs and convert it if it exists
    const finalOutboundCallTsConverted = data.speed_to_lead && data.speed_to_lead.final_setter_first_outbound_call && data.speed_to_lead.final_setter_first_outbound_call.created_on ?
        convertTimestamp(data.speed_to_lead.final_setter_first_outbound_call.created_on, 'Pacific/Honolulu', 'America/New_York') : null;

    // Return null if there is a setter call
    if (data.setter_call && data.setter_call.created_on) return null;

    // Checking if every setter has attempted contact
    const allSettersCalled = data.setters && data.setters.every(setter => setter.first_outbound_call && setter.first_outbound_call.created_on);
    const effort = finalOutboundCallTsConverted ? "✅" : allSettersCalled ? "✅" : "❌";

    return {
        Name: leadName,
        Created: leadCreatedTs,
        Complete: finalOutboundCallTsConverted ? finalOutboundCallTsConverted : "❌",
        Effort: effort,
        podio_item_id: lead.itemid ? lead.itemid : lead.podio_item_id,
    };
}



// Individual KPI calculation functions
export function calculateIndividualKpiTables(lead, apiName, adminJson, selectedTeamMemberId) {

    const adminData = JSON.parse(adminJson); // Assuming adminJson is a JSON string.
    let result = {};

    switch (apiName) {
        case 'Individual STL Median':
            result = calculateIndividualStlTable(lead, adminData, selectedTeamMemberId);
            break;
        case 'Setter STL Median':
            result = calculateSetterStlTableForIndividual(lead, adminData, selectedTeamMemberId);
            break;
        case 'Individual Effort':
            result = calculateIndividualEffortTable(lead, adminData, selectedTeamMemberId);
            break;
        case 'Closer STL Median':
            result = calculateCloserStlTable(lead, adminData, selectedTeamMemberId);
            break;
        default:
            console.log('Unknown API Name');
            return;
    }

    return result;
}

function calculateIndividualStlTable(lead, data, selectedTeamMemberId) {

    const leadName = extractLeadName(lead);
    // Convert leadCreatedTs to 'America/New_York' timezone
    const leadCreatedTs = data.lead_created_ts ? convertTimestamp(data.lead_created_ts, 'Pacific/Honolulu', 'America/New_York') : null;

    const setterCall = data?.setters ? data.setters.find(setter => setter.item_id === selectedTeamMemberId && setter.first_outbound_call) : null;
    // Convert firstOutboundCallTs to 'America/New_York' timezone if exists
    const firstOutboundCallTs = setterCall ? convertTimestamp(setterCall.first_outbound_call.created_on, 'Pacific/Honolulu', 'America/New_York') :
        "Call the dang lead.";

    let stl = "❌";
    if (leadCreatedTs && setterCall) {
        let diffInSeconds = calculateDelayedStart(leadCreatedTs, firstOutboundCallTs, 'America/New_York');
        stl = formatTime(diffInSeconds);
    }

    return {
        Name: leadName,
        Created: leadCreatedTs,
        Complete: firstOutboundCallTs,
        STL: stl,
        podio_item_id: lead.itemid ? lead.itemid : lead.podio_item_id,
    };
}


function calculateSetterStlTableForIndividual(lead, data, selectedTeamMemberId) {
    const leadName = extractLeadName(lead);

    const leadCreatedTs = data.lead_created_ts ?
        convertTimestamp(data.lead_created_ts, 'Pacific/Honolulu', 'America/New_York') : null;

    const setterCallTs = data.setter_call && data.setter_call.created_on && data.setter_call.setter_responsible.item_id === selectedTeamMemberId ?
        convertTimestamp(data.setter_call.created_on, 'Pacific/Honolulu', 'America/New_York') : null;

    if (!setterCallTs || data.setter_call.setter_responsible.item_id !== selectedTeamMemberId) {
        return null; // Skip if there's no setter call or it's not by the selected setter
    }

    const setterResponsibleName = data.setters.find(setter => setter.item_id === selectedTeamMemberId)?.name || "No Setter";

    let stl = "❌";
    if (leadCreatedTs && setterCallTs) {
        let diffInSeconds = calculateDelayedStart(leadCreatedTs, setterCallTs, 'America/New_York');
        stl = formatTime(diffInSeconds);
    }

    return {
        Name: leadName,
        Created: leadCreatedTs,
        Completed: setterCallTs,
        STL: stl,
        Setter: setterResponsibleName,
        podio_item_id: lead.itemid ? lead.itemid : lead.podio_item_id,
    };
}


function calculateIndividualEffortTable(lead, data, selectedTeamMemberId) {
    // console.log(lead)
    // console.log(data)
    console.log(selectedTeamMemberId)

    if (data.setter_call && data.setter_call.created_on) return null; // Return null if there is a setter call

    // check if selectedTeamMemberId is in the setters array
    const setterCheck = data?.setters ? data.setters.filter(setter => setter.item_id === selectedTeamMemberId) : [];
    console.log(setterCheck)
    if (setterCheck.length < 1) return null; // Return null if the selectedTeamMemberId is not in the setters array

    const leadName = extractLeadName(lead);

    // Assuming leadCreatedTs is initially in 'Pacific/Honolulu' timezone
    const leadCreatedTs = data.lead_created_ts ?
        convertTimestamp(data.lead_created_ts, 'Pacific/Honolulu', 'America/New_York') : null;

    const setterCalls = data?.setters ? data.setters.filter(setter => setter.item_id === selectedTeamMemberId && setter.first_outbound_call) : [];
    const firstOutboundCallTs = setterCalls.length > 0 ?
        convertTimestamp(setterCalls[0].first_outbound_call.created_on, 'Pacific/Honolulu', 'America/New_York') :
        "CALL NOW";

    const effort = setterCalls.length > 0 ? "✅" : "❌";

    return {
        Name: leadName,
        Created: leadCreatedTs, // Already converted to 'America/New_York'
        Complete: firstOutboundCallTs,
        Effort: effort,
        podio_item_id: lead.itemid ? lead.itemid : lead.podio_item_id,
    };
}

function calculateCloserStlTable(lead, data, selectedTeamMemberId) {
    const leadName = extractLeadName(lead);

    // Ensure discovery call booking exists and closer assigned matches the selectedTeamMemberId
    const bookingData = data.discovery_call_booking;
    const closerAssigned = bookingData && bookingData.closer_assigned;

    if (!closerAssigned || closerAssigned.item_id !== selectedTeamMemberId) {
        return null; // Skip if no closer assigned or if the closer doesn't match the selectedTeamMemberId
    }

    // Convert bookingCreatedTs and firstOutboundCallTs to 'America/New_York' timezone
    const bookingCreatedTs = bookingData.created_on ?
        convertTimestamp(bookingData.created_on, 'Pacific/Honolulu', 'America/New_York') : null;

    const firstOutboundCallTs = closerAssigned.first_outbound_call ?
        convertTimestamp(closerAssigned.first_outbound_call.created_on, 'Pacific/Honolulu', 'America/New_York') :
        "CALL NOW";

    let stl = "❌";
    if (bookingCreatedTs && firstOutboundCallTs !== "CALL NOW") {
        let diffInSeconds = calculateDelayedStart(bookingCreatedTs, firstOutboundCallTs, 'America/New_York');
        stl = formatTime(diffInSeconds);
    }

    return {
        Name: leadName,
        Created: bookingCreatedTs,
        Completed: firstOutboundCallTs !== "CALL NOW" ? firstOutboundCallTs : "CALL NOW",
        STL: stl,
        CloserAssigned: closerAssigned.name,
        podio_item_id: lead.itemid ? lead.itemid : lead.podio_item_id,
    };
}



