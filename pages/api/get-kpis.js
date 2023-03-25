function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default async (req, res) => {

  /* res.json(
     [
       { name: "Cost Per Lead", current: (Math.floor(Math.random() * 60) + 20), redFlag: 60.00, target: 35.00, data1: "Marketing: $6600", data2: "Leads: 100" },
       { name: "Lead Connections", current: (Math.floor(Math.random() * 60) + 20), redFlag: 70, target: 80, data1: "Leads 123" , data2: "Connections: 123" },
       { name: "Triage Calls", current: (Math.floor(Math.random() * 50) + 40), redFlag: 60, target: 75, data1: "Connections: 60", data2: "Triages: 35" },
       { name: "Triage Qualification", current: (Math.floor(Math.random() * 60) + 30), redFlag: 50, target: 70, data1: "Triages: 35", data2: "Qualified: 28" },
       { name: "Deal Analysis", current: (Math.floor(Math.random() * 40) + 50), redFlag: 65, target: 80, data1: "Qualified: 28", data2: "Approvals: 20" },
       { name: "Perfect Presentations", current: (Math.floor(Math.random() * 40) + 50), redFlag: 65, target: 80, data1: "Approvals: 20", data2: "Presentations: 18" },
       { name: "Contracts", current: (Math.floor(Math.random() * 40)), redFlag: 10, target: 25, data1: "Presentations: 18", data2: "Contracts: 5" },
       { name: "Acquisitions", current: (Math.floor(Math.random() * 60) + 30), redFlag: 50, target: 75, data1: "Contracts: 5", data2: "Acquisitions: 4" }
     ]) */

  try {
    const { leadSourceString, gte, lte } = req.query;
    const startDate = gte ? formatDate(new Date(gte)) : null;
    const endDate = lte ? formatDate(new Date(lte)) : null;
    const leadSource = leadSourceString !== "All" ? [parseInt(leadSourceString, 10)] : "All";

    const fetchAll = async (apiEndpoint, filters) => {
      try {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "filters": filters,
            "limit": 1000,
            "offset": 0,
          }),
        });

        if (!response.ok) {
          throw new Error(`Server responded with an error: ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.data || data.total === 0) {
          return [];
        }

        let fetchedResults = data.data ? data.data : [];
        let offset = fetchedResults.length;

        while (data.total > fetchedResults.length) {
          const fetchMoreData = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              "filters": filters,
              "offset": offset,
              "limit": 1000,
            }),
          });

          const moreData = await fetchMoreData.json();
          fetchedResults = fetchedResults.concat(moreData.data);
          offset += moreData.data.length; // Update the offset by adding the length of the fetched data
        }
        return fetchedResults;
      } catch (error) {
        console.error(error);
        throw new Error("Error fetching data. Please try again later.");
      }
    };


    const generateFilters = (fieldName, dateFieldName, extraFilters) => {
      const filters = [];

      if (startDate && endDate) {
        filters.push({
          "type": 'date',
          "fieldName": dateFieldName,
          "gte": startDate,
          "lte": endDate,
        });
      }

      if (leadSource && leadSource !== 'All' && fieldName !== null) {
        filters.push({
          "type": "app",
          "fieldName": fieldName,
          "values": leadSource,
        });
      }

      if (extraFilters) {
        filters.push(...extraFilters);
      }

      return filters;
    };

    // Define the endpoints for each KPI and the date filter to use
    const apiEndpoints = {
      marketingExpenses: {
        url: "https://db.reiautomated.io/marketing-expenses",
        filters: generateFilters("Lead Source", "Date")
      },
      leads: {
        url: "https://db.reiautomated.io/seller-leads",
        filters: generateFilters("Lead Source Item", "Lead Created On")
      },
      connectedLeads: {
        url: "https://db.reiautomated.io/seller-leads",
        filters: generateFilters("Lead Source Item", "First lead connection")
      },
      triageCalls: {
        url: "https://db.reiautomated.io/seller-lead-sheets",
        filters: generateFilters("Lead Source", "SLS Created On")
      },
      qualifiedTriageCalls: {
        url: "https://db.reiautomated.io/seller-lead-sheets",
        filters: generateFilters("Lead Source", "SLS Created On", [
          {
            "type": "category",
            "fieldName": "Q or UNQ",
            "values": ["Q"]
          }
        ]),
      },

      // Add a deal analysis endpoint when it is ready

      perfectPresentations: {
        url: "https://db.reiautomated.io/acquisition-scripts",
        filters: generateFilters("Lead Source", "AS Created On")
      },
      contracts: {
        url: "https://db.reiautomated.io/contracts",
        filters: generateFilters("Lead Source", "*Date Ratified")
      },
      acquisitions: {
        url: "https://db.reiautomated.io/acquisitions",
        filters: generateFilters(null, "Date Acquired")
      }
    };
    // Add a deals endpoint when it is ready


    // Pull the data for each KPI
    const marketingExpenses = await fetchAll(apiEndpoints.marketingExpenses.url, apiEndpoints.marketingExpenses.filters)
      .then((data) => data.reduce((acc, curr) => {
        if ("Amount" in curr) {
          return acc + parseInt(curr.Amount, 10);
        } else {
          return acc;
        }
      }, 0));

    const leads = await fetchAll(apiEndpoints.leads.url, apiEndpoints.leads.filters);
    const connectedLeads = await fetchAll(apiEndpoints.connectedLeads.url, apiEndpoints.connectedLeads.filters);
    const triageCalls = await fetchAll(apiEndpoints.triageCalls.url, apiEndpoints.triageCalls.filters);
    const qualifiedTriageCalls = await fetchAll(
      apiEndpoints.qualifiedTriageCalls.url,
      apiEndpoints.qualifiedTriageCalls.filters
    );

    const approvedTriageCalls = qualifiedTriageCalls.filter((lead) => {
      return lead["Qualified?"] && lead["Qualified?"].length > 0 && lead["Qualified?"][0] === "Approve";
    });
    
    // Add a deal analysis fetch when it is ready
    const perfectPresentations = await fetchAll(apiEndpoints.perfectPresentations.url, apiEndpoints.perfectPresentations.filters);
    const contracts = await fetchAll(apiEndpoints.contracts.url, apiEndpoints.contracts.filters);
    const acquisitions = await fetchAll(apiEndpoints.acquisitions.url, apiEndpoints.acquisitions.filters);

    // Calculate the KPI values
    const costPerLead = leads.length !== 0 ? (marketingExpenses / leads.length).toFixed(2) : 0;
    const connectedLeadRatio = leads.length !== 0 ? (connectedLeads.length / leads.length * 100).toFixed(2) : 0;
    const triageCallRatio = connectedLeads.length !== 0 ? (triageCalls.length / connectedLeads.length * 100).toFixed(2) : 0;
    const qualifiedTriageCallRatio = triageCalls.length !== 0 ? (qualifiedTriageCalls.length / triageCalls.length * 100).toFixed(2) : 0;
    const approvedTriageCallRatio = qualifiedTriageCalls.length !== 0 ? (approvedTriageCalls.length / qualifiedTriageCalls.length * 100).toFixed(2) : 0;
    const perfectPresentationRatio = approvedTriageCalls.length !== 0 ? (perfectPresentations.length / approvedTriageCalls.length * 100).toFixed(2) : 0;
    const contractRatio = perfectPresentations.length !== 0 ? (contracts.length / perfectPresentations.length * 100).toFixed(2) : 0;
    const acquisitionRatio = acquisitions.length !== 0 ? (acquisitions.length / contracts.length * 100).toFixed(2) : 0;

    // Return the results   
    res.json(
      [
        { name: "Cost Per Lead", current: costPerLead, redFlag: 60.00, target: 35.00, data1: "Marketing: " + marketingExpenses, data2: "Leads: " + leads.length },
        { name: "Lead Connections", current: connectedLeadRatio, redFlag: 70, target: 80, data1: "Leads " + leads.length, data2: "Connections:" + connectedLeads.length },
        { name: "Triage Calls", current: triageCallRatio, redFlag: 60, target: 75, data1: "Connections: " + connectedLeads.length, data2: "Triages: " + triageCalls.length },
        { name: "Triage Qualification", current: qualifiedTriageCallRatio, redFlag: 50, target: 70, data1: "Triages: " + triageCalls.length, data2: "Qualified: " + qualifiedTriageCalls.length },
        { name: "Triage Approval", current: approvedTriageCallRatio, redFlag: 50, target: 70, data1: "Qualified: " + qualifiedTriageCalls.length, data2: "Approved: " + approvedTriageCalls.length },
        { name: "Deal Analysis", current: 0, redFlag: 65, target: 80, data1: "Approved: " + approvedTriageCalls.length, data2: "Analyzed: ?" },
        { name: "Perfect Presentations", current: 0, redFlag: 65, target: 80, data1: "Analyzed: ?", data2: "Presentations: " + perfectPresentations.length },
        { name: "Contracts", current: contractRatio, redFlag: 10, target: 25, data1: "Presentations: " + perfectPresentations.length, data2: "Contracts: " + contracts.length },
        { name: "Acquisitions", current: acquisitionRatio, redFlag: 50, target: 75, data1: "Contracts: " + contracts.length, data2: "Acquisitions: " + acquisitions.length },
      ]
    );
  } catch (error) {
    console.error(error);
    res.status(500).send({ "Error": "Error fetching kpi" });
  }

};
