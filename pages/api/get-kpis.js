function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default async (req, res) => {
  try {
    const { leadSource, gte, lte } = req.query;
    const startDate = gte ? formatDate(new Date(gte)) : null;
    const endDate = lte ? formatDate(new Date(lte)) : null;
    const results = { noData: false, data: []}

    const fetchSellerData = async () => {
      try {
        const response = await fetch(`https://db.reiautomated.io/seller-leads?leadSource=${leadSource}&gte[“Created On”]=${startDate}&lte[“Created On”]=${endDate}`);
        const sellerData = await response.json();
        
        if (!sellerData.data || sellerData.data.length === 0) {
          results.noData = true;
        }
      
        let fetchedResults = sellerData.data ? sellerData.data : [];
        let page = fetchedResults.length;
      
        while (sellerData.total > (fetchedResults.length || 0)) {
          const response = await fetch(`https://db.reiautomated.io/seller-leads?leadSource=${leadSource}&gte[“Created On”]=${startDate}&lte[“Created On”]=${endDate}&offset=${page}`);
          const moreSellerData = await response.json();
          page = moreSellerData.data.length;
          fetchedResults = fetchedResults.concat(moreSellerData.data);
          console.log("working hard ", fetchedResults.length);
        }
        return fetchedResults;
      } catch (error) {
        console.error(error);
        throw new Error("Error fetching seller data. Please try again later.");
      }
    };
    
      




    // Log every item's id with an undefined "Lead Created On"
    /*data.forEach(obj => {
      if (!obj['Lead Created On']) {
        console.log(obj);
      }
    });*/
    

    results.data = await fetchSellerData();

    // How can we determine if a lead was triaged?
    // How can we determine if a lead was qualified?
    // How can we determine if a lead received a perfect presentation?
    // How can we determine if a lead was contracted?
    // How can we determine if a lead was acquired?

    // Map data to object
    let leads = results.data.map(obj => {
      return {
        leadCreatedOn: obj['Lead Created On'] && new Date(obj['Lead Created On'].startdateutc),
        firstLeadConnection: obj['First lead connection'] && new Date(obj['First lead connection'].startdateutc),
        leadSourceItem: obj['Lead Source Item'] ? obj['Lead Source Item'][0] : null,
        connected: obj['First lead connection'] ? true : false,
      }
    });

    //console.log("leads", leads);

    // Calculate percent of connected leads
    const connectedLeads = leads.filter(lead => lead.connected === true);
    const percentConnectedLeads = (connectedLeads.length / leads.length * 100);

    // Calculate percent of triage calls
    //const triageCalls = leads.filter(lead => lead.triageCall === true);
    //const percentTriageCalls = (triageCalls.length / connectedLeads.length * 100);

    // Calculate percent of qualified triage calls    
    //const qualTriageCalls = leads.filter(lead => lead.triageCallQualified === true);
    //const percentQualTriageCalls = (qualTriageCalls.length / triageCalls.length * 100);

    // Calculate percent of perfect presentations
    //const perfectPresentations = leads.filter(lead => lead.perfectPresentation === true);
    //const percentPerfectPresentations = (perfectPresentations.length / qualTriageCalls.length * 100);

    // Calculate percent of contracted leads
    //const contracted = leads.filter(lead => lead.contracted === true);
    //const percentContracted = (contracted.length / perfectPresentations.length * 100);

    // Calculate percent of acquired leads
    //const acquired = leads.filter(lead => lead.acquired === true);
    //const percentAcquired = (acquired.length / contracted.length * 100);

    // Calculate Cost per Acquisition
    //const costPerAcquisition = (marketingSpend / acquired.length);

    // 
    if (results.noData) {
      res.json(
        [
          { name: "Cost Per Lead", current: 0, redFlag: 60.00, target: 35.00, data1: "Marketing: " + 0, data2: "Leads: " + 0 },
          { name: "Lead Connections", current: 0, redFlag: 70, target: 80, data1: "Leads " + 0, data2: "Connections:" + 0 },
          { name: "Triage Calls", current: 0, redFlag: 60, target: 75, data1: "Connections: " + 0, data2: "Triages: " + 0 },
          { name: "Triage Qualification", current: 0, redFlag: 50, target: 70, data1: "Triages: " + 0, data2: "Qualified: " + 0 },
          { name: "Deal Analysis", current: 0, redFlag: 65, target: 80, data1: "Qualified: " + 0, data2: "Approvals: " + 0 },
          { name: "Perfect Presentations", current: 0, redFlag: 65, target: 80, data1: "Approvals: " + 0, data2: "Presentations: " + 0 },
          { name: "Contracts", current: 0, redFlag: 10, target: 25, data1: "Presentations: " + 0, data2: "Contracts: " + 0 },
          { name: "Acquisitions", current: 0, redFlag: 50, target: 75, data1: "Contracts: " + 0, data2: "Acquisitions: " + 0 }
        ]
      );
    } else {
      res.json(
        [
          { name: "Cost Per Lead", current: (Math.floor(Math.random() * 60) + 20), redFlag: 60.00, target: 35.00, data1: "Marketing: $6600", data2: "Leads: 100" },
          { name: "Lead Connections", current: percentConnectedLeads, redFlag: 70, target: 80, data1: "Leads " + leads.length, data2: "Connections:" + connectedLeads.length },
          { name: "Triage Calls", current: (Math.floor(Math.random() * 50) + 40), redFlag: 60, target: 75, data1: "Connections: 60", data2: "Triages: 35" },
          { name: "Triage Qualification", current: (Math.floor(Math.random() * 60) + 30), redFlag: 50, target: 70, data1: "Triages: 35", data2: "Qualified: 28" },
          { name: "Deal Analysis", current: (Math.floor(Math.random() * 40) + 50), redFlag: 65, target: 80, data1: "Qualified: 28", data2: "Approvals: 20" },
          { name: "Perfect Presentations", current: (Math.floor(Math.random() * 40) + 50), redFlag: 65, target: 80, data1: "Approvals: 20", data2: "Presentations: 18" },
          { name: "Contracts", current: (Math.floor(Math.random() * 40)), redFlag: 10, target: 25, data1: "Presentations: 18", data2: "Contracts: 5" },
          { name: "Acquisitions", current: (Math.floor(Math.random() * 60) + 30), redFlag: 50, target: 75, data1: "Contracts: 5", data2: "Acquisitions: 4" }
        ]
      );
    }

  } catch (error) {
    console.error(error);
    res.status(500).send({"Error":"Error fetching kpi"});
  }
};
