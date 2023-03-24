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
    const { leadSource, gte, lte } = req.query;
    const startDate = gte ? formatDate(new Date(gte)) : null;
    const endDate = lte ? formatDate(new Date(lte)) : null;

    console.log("leadSource", leadSource);

    const fetchAll = async (kpiEndpoint, filters) => {
      try {
        const response = await fetch(kpiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filters,
            limit: 100,
            offset: 0,
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
          const fetchMoreData = await fetch(kpiEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              filters,
              offset: offset,
              limit: 100,
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
          type: 'date',
          fieldName: dateFieldName,
          gte: startDate,
          lte: endDate,
        });
      }

      if (leadSource && leadSource !== 'All' && fieldName !== "All") {
        filters.push({
          fieldName: fieldName,
          value: leadSource,
        });
      }

      if (extraFilters) {
        filters.push(...extraFilters);
      }

      return filters;
    };

    // Define the endpoints for each KPI and the date filter to use
    const kpiEndpoints = {
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
      /*  qualifiedTriageCalls: {
          url: "https://db.reiautomated.io/seller-lead-sheets",
          filters: generateFilters("Lead Source", "SLS Created On", [
            {
              fieldName: "Q or UNQ",
              value: "Q",
            }
          ]),
        },
        approvedTriageCalls: {
          url: "https://db.reiautomated.io/seller-lead-sheets",
          filters: generateFilters("Lead Source", "SLS Created On", [
            {
              fieldName: "Q or UNQ",
              value: "Q",
            },
            {
              fieldName: "Qualified?",
              value: "Approved",
            }
          ]),
        }, */
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
        filters: generateFilters("All", "Date Acquired")
      }
    };

    // Pull the data for each KPI
    const marketingExpenses = await fetchAll(kpiEndpoints.marketingExpenses.url, kpiEndpoints.marketingExpenses.filters)
      .then(data => data.reduce((acc, curr) => acc + (curr.Amount).toNumber, 0));

    const leads = await fetchAll(kpiEndpoints.leads.url, kpiEndpoints.leads.filters);
    const connectedLeads = await fetchAll(kpiEndpoints.connectedLeads.url, kpiEndpoints.connectedLeads.filters);
    const triageCalls = await fetchAll(kpiEndpoints.triageCalls.url, kpiEndpoints.triageCalls.filters);
    /* const qualifiedTriageCalls = await fetchAll(
      kpiEndpoints.qualifiedTriageCalls.url,
      kpiEndpoints.qualifiedTriageCalls.filters
    );
    const approvedTriageCalls = await fetchAll(
      kpiEndpoints.approvedTriageCalls.url,
      kpiEndpoints.approvedTriageCalls.filters
    ); */
    const perfectPresentations = await fetchAll(kpiEndpoints.perfectPresentations.url, kpiEndpoints.perfectPresentations.filters);
    const contracts = await fetchAll(kpiEndpoints.contracts.url, kpiEndpoints.contracts.filters);
    const acquisitions = await fetchAll(kpiEndpoints.acquisitions.url, kpiEndpoints.acquisitions.filters);

    // Calculate the KPI values
    const costPerLead = (marketingExpenses / leads.length).toFixed(2);
    const connectedLeadRatio = (connectedLeads.length / leads.length * 100).toFixed(2);
    const triageCallRatio = (triageCalls.length / connectedLeads.length * 100).toFixed(2);

    /*const qualifiedTriageCallRatio = qualifiedTriageCalls.length / triageCalls.length
    const approvedTriageCallRatio = approvedTriageCalls.length / qualifiedTriageCalls.length */

    const perfectPresentationRatio = (perfectPresentations.length / triageCalls.length * 100).toFixed(2);
    const contractRatio = (contracts.length / perfectPresentations.length * 100).toFixed(2);
    const acquisitionRatio = (acquisitions.length / contracts.length * 100).toFixed(2);

    // Return the results   
    res.json(
      [
        { name: "Cost Per Lead", current: costPerLead, redFlag: 60.00, target: 35.00, data1: "Marketing: " + marketingExpenses, data2: "Leads: " + leads.length },
        { name: "Lead Connections", current: connectedLeadRatio, redFlag: 70, target: 80, data1: "Leads " + leads.length, data2: "Connections:" + connectedLeads.length },
        { name: "Triage Calls", current: triageCallRatio, redFlag: 60, target: 75, data1: "Connections: " + connectedLeads.length, data2: "Triages: " + triageCalls.length },
        { name: "Triage Qualification", current: 0, redFlag: 50, target: 70, data1: "Triages: " + triageCalls.length, data2: "Qualified: ?" },
        { name: "Deal Analysis", current: 0, redFlag: 65, target: 80, data1: "Qualified: ?", data2: "Approvals: ?" },
        { name: "Perfect Presentations", current: perfectPresentationRatio, redFlag: 65, target: 80, data1: "Approvals: ?", data2: "Presentations: " + perfectPresentations.length },
        { name: "Contracts", current: contractRatio, redFlag: 10, target: 25, data1: "Presentations: " + perfectPresentations.length, data2: "Contracts: " + contracts.length },
        { name: "Acquisitions", current: acquisitionRatio, redFlag: 50, target: 75, data1: "Contracts: " + contracts.length, data2: "Acquisitions: " + acquisitions.length },
      ]
    );
  } catch (error) {
    console.error(error);
    res.status(500).send({ "Error": "Error fetching kpi" });
  }

};
