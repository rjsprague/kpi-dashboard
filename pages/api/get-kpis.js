import { useEffect, useState } from 'react';

export default async (req, res) => {

  const { leadSource, dateRange } = req.query;
  //console.log("leadSource ", leadSource);
  //console.log("dateRange ", dateRange);
  //console.log("data ", data);

  /* “Lead Created On”
    “First lead connection”
    “Lead Source Item” */

  //const [leads, setLeads] = useState([]);

  const response = await fetch('https://db.reiautomated.io/seller-leads/23642479');
  const text = await response.text();
  const data = JSON.parse(text);

  // Log every item's id with an undefined "Lead Created On"
  /*data.forEach(obj => {
    if (!obj['Lead Created On']) {
      console.log(obj);
    }
  });*/
 

  // Map data to object
  let leads = data.map(obj => {
    return {
      leadCreatedOn: obj['Lead Created On'] && new Date(obj['Lead Created On'].start_utc),
      firstLeadConnection: obj['First lead connection'] && new Date(obj['First lead connection'].start_utc),
      leadSourceItem: obj['Lead Source Item'] && obj['Lead Source Item'][0],
      connected: obj['First lead connection'] ? true : false,
    }
  });
  //console.log("leads ", leads);

  try {

    // narrow down leads by lead source and date range
    if (leadSource !== "All") {
      leads = leads.filter(lead => lead.leadSourceItem && lead.leadSourceItem == Number(leadSource));
      //console.log("leads after leadSource filter ", leads);
    }

    if (dateRange === "Last Week") {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      leads = leads.filter(lead => lead.leadCreatedOn && lead.leadCreatedOn > lastWeek);
    }
    if (dateRange === "Last Month") {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      leads = leads.filter(lead => lead.leadCreatedOn && lead.leadCreatedOn > lastMonth);
    }
    if (dateRange === "Last Quarter") {
      const lastQuarter = new Date();
      lastQuarter.setMonth(lastQuarter.getMonth() - 3);
      leads = leads.filter(lead => lead.leadCreatedOn && lead.leadCreatedOn > lastQuarter);
    }
    
    

    // Calculate percent of connected leads
    const connectedLeads = leads.filter(lead => lead.connected === true);
    const percentConnectedLeads = (connectedLeads.length / leads.length * 100);

    // Calculate percent of triage calls
    //const triageCalls = leads.filter(lead => lead.triageCall === true);
    //const percentTriageCalls = (triageCalls.length / connectedLeads.length * 100);

    // Calculate percent of qualified triage calls
    //const qualTriageCalls = leads.filter(lead => lead.triageCallQualified === true);
    //const percentQualTriageCalls = (qualTriageCalls.length / triageCalls.length * 100);

    // Calculate percent of qualified triage calls
    //const perfectPresentations = leads.filter(lead => lead.perfectPresentation === true);
    //const percentPerfectPresentations = (perfectPresentations.length / qualTriageCalls.length * 100);

    // Calculate percent of qualified triage calls
    //const contracted = leads.filter(lead => lead.contracted === true);
    //const percentContracted = (contracted.length / perfectPresentations.length * 100);

    // Calculate percent of qualified triage calls
    //const acquired = leads.filter(lead => lead.acquired === true);
    //const percentAcquired = (acquired.length / contracted.length * 100);

    // Calculate Cost per Acquisition
    //const costPerAcquisition = (marketingSpend / acquired.length);

    // 
    res.json([
      { name: "Cost Per Lead", current: (Math.floor(Math.random() * 60) + 20), redFlag: 60.00, target: 35.00, data1: "Marketing: $6600", data2: "Leads: 100" },
      { name: "Lead Connections", current: percentConnectedLeads, redFlag: 70, target: 80, data1: "Leads "+leads.length, data2: "Connections:"+connectedLeads.length },
      { name: "Triage Calls", current: (Math.floor(Math.random() * 50) + 40), redFlag: 60, target: 75, data1: "Connections: 60", data2: "Triages: 35" },
      { name: "Triage Qualification", current: (Math.floor(Math.random() * 60) + 30), redFlag: 50, target: 70, data1: "Triages: 35", data2: "Qualified: 28" },
      { name: "Deal Analysis", current: (Math.floor(Math.random() * 40) + 50), redFlag: 65, target: 80, data1: "Qualified: 28", data2: "Approvals: 20" },
      { name: "Perfect Presentations", current: (Math.floor(Math.random() * 40) + 50), redFlag: 65, target: 80, data1: "Approvals: 20", data2: "Presentations: 18" },
      { name: "Contracts", current: (Math.floor(Math.random() * 40)), redFlag: 10, target: 25, data1: "Presentations: 18", data2: "Contracts: 5" },
      { name: "Acquisitions", current: (Math.floor(Math.random() * 60) + 30), redFlag: 50, target: 75, data1: "Contracts: 5", data2: "Acquisitions: 4" }
    ]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching kpi");
  }
};
