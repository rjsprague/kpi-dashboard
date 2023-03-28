

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function fetchKPIs(leadSource, gte, lte) {

  console.log("leadsource: ", leadSource[0])
  console.log("gte: ", gte)
  console.log("lte: ", lte)


  try {

    const startDate = gte ? formatDate(new Date(gte)) : null;
    const endDate = lte ? formatDate(new Date(lte)) : null;

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
      if (leadSource && leadSource[0] !== 'All' && fieldName !== null) {
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
      dealsApproved: {
        url: "https://db.reiautomated.io/acquisition-kpis",
        filters: generateFilters(null, "Timestamp", [
          {
            "type": "category",
            "fieldName": "Type",
            "values": ["DA Speed to Lead"]
          }
        ]),
      },
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
      },
      deals: {
        url: "https://db.reiautomated.io/deals",
        filters: generateFilters(null, "Closing (Sell)")
      }
    };

    const fetchLeads = fetchAll(apiEndpoints.leads.url, apiEndpoints.leads.filters);
    console.log("fetchLeads: ", fetchLeads);


    // Pull the data for each KPI
    const [marketingExpenses, leads, connectedLeads, triageCalls, qualifiedTriageCalls, dealsApproved, perfectPresentations, contracts, acquisitions, deals] = await Promise.all([
      fetchAll(apiEndpoints.marketingExpenses.url, apiEndpoints.marketingExpenses.filters).
        then((data) => {
          console.log("marketingExpenses: ", data)
          data.reduce((acc, curr) => {
            if ("Amount" in curr) {
              return acc + parseInt(curr.Amount, 10);
            } else {
              return acc;
            }
          }, 0)
        }),
      fetchAll(apiEndpoints.leads.url, apiEndpoints.leads.filters),
      fetchAll(apiEndpoints.connectedLeads.url, apiEndpoints.connectedLeads.filters),
      fetchAll(apiEndpoints.triageCalls.url, apiEndpoints.triageCalls.filters),
      fetchAll(apiEndpoints.qualifiedTriageCalls.url, apiEndpoints.qualifiedTriageCalls.filters),
      fetchAll(apiEndpoints.dealsApproved.url, apiEndpoints.dealsApproved.filters),
      fetchAll(apiEndpoints.perfectPresentations.url, apiEndpoints.perfectPresentations.filters),
      fetchAll(apiEndpoints.contracts.url, apiEndpoints.contracts.filters),
      fetchAll(apiEndpoints.acquisitions.url, apiEndpoints.acquisitions.filters),
      fetchAll(apiEndpoints.deals.url, apiEndpoints.deals.filters)
    ]);

    const approvedTriageCalls = qualifiedTriageCalls.filter((lead) => {
      return lead["Qualified?"] && lead["Qualified?"].length > 0 && lead["Qualified?"][0] === "Approve";
    });

    const profits = deals.reduce((acc, curr) => {
      if ("Net Profit Center" in curr) {
        return acc + parseInt(curr["Net Profit Center"], 10);
      } else {
        return acc;
      }
    }, 0);

    console.log("marketingExpenses", marketingExpenses)
    console.log("leads", leads)
    console.log("connectedLeads", connectedLeads)
    console.log("triageCalls", triageCalls)
    console.log("qualifiedTriageCalls", qualifiedTriageCalls)
    console.log("dealsApproved", dealsApproved)
    console.log("perfectPresentations", perfectPresentations)
    console.log("contracts", contracts)
    console.log("acquisitions", acquisitions)
    console.log("deals", deals)
    console.log("approvedTriageCalls", approvedTriageCalls)
    console.log("profits", profits)


    // Calculate the KPI values
    const costPerLead = leads.length !== 0 ? Math.floor(marketingExpenses / leads.length) : 0;
    const connectedLeadRatio = leads.length !== 0 ? Math.floor(connectedLeads.length / leads.length * 100) : 0;
    const triageCallRatio = connectedLeads.length !== 0 ? Math.floor(triageCalls.length / connectedLeads.length * 100) : 0;
    const qualifiedTriageCallRatio = triageCalls.length !== 0 ? Math.floor(qualifiedTriageCalls.length / triageCalls.length * 100) : 0;
    const approvedTriageCallRatio = qualifiedTriageCalls.length !== 0 ? Math.floor(approvedTriageCalls.length / qualifiedTriageCalls.length * 100) : 0;
    const dealsApprovedRatio = approvedTriageCalls.length !== 0 ? Math.floor(dealsApproved.length / approvedTriageCalls.length * 100) : 0;
    const perfectPresentationRatio = approvedTriageCalls.length !== 0 ? Math.floor(perfectPresentations.length / approvedTriageCalls.length * 100) : 0;
    const contractRatio = perfectPresentations.length !== 0 ? Math.floor(contracts.length / perfectPresentations.length * 100) : 0;
    const acquisitionRatio = contracts.length !== 0 ? Math.floor(acquisitions.length / contracts.length * 100) : 0;
    const dealsRatio = acquisitions.length !== 0 ? Math.floor(deals.length / acquisitions.length * 100) : 0;

    console.log("Cost Per Lead: " + costPerLead);
    console.log("Connected Lead Ratio: " + connectedLeadRatio);
    console.log("Triage Call Ratio: " + triageCallRatio);
    console.log("Qualified Triage Call Ratio: " + qualifiedTriageCallRatio);
    console.log("Approved Triage Call Ratio: " + approvedTriageCallRatio);
    console.log("Deals Approved Ratio: " + dealsApprovedRatio);
    console.log("Perfect Presentation Ratio: " + perfectPresentationRatio);
    console.log("Contract Ratio: " + contractRatio);
    console.log("Acquisition Ratio: " + acquisitionRatio);
    console.log("Deals Ratio: " + dealsRatio);

    // Return the results   
    const results = [
      { name: "Cost Per Lead", current: costPerLead, redFlag: 60.00, target: 35.00, data1: "Marketing: " + "$" + marketingExpenses, data2: "Leads: " + leads.length },
      { name: "Lead Connections", current: connectedLeadRatio, redFlag: 70, target: 80, data1: "Leads " + leads.length, data2: "Connections:" + connectedLeads.length },
      { name: "Triage Calls", current: triageCallRatio, redFlag: 60, target: 75, data1: "Connections: " + connectedLeads.length, data2: "Triages: " + triageCalls.length },
      { name: "Triage Qualification", current: qualifiedTriageCallRatio, redFlag: 50, target: 70, data1: "Triages: " + triageCalls.length, data2: "Qualified: " + qualifiedTriageCalls.length },
      { name: "Triage Approval", current: approvedTriageCallRatio, redFlag: 50, target: 70, data1: "Qualified: " + qualifiedTriageCalls.length, data2: "Approved: " + approvedTriageCalls.length },
      { name: "Deal Analysis", current: dealsApprovedRatio, redFlag: 65, target: 80, data1: "Approved: " + approvedTriageCalls.length, data2: "Analyzed: " + dealsApproved.length },
      { name: "Perfect Presentations", current: perfectPresentationRatio, redFlag: 65, target: 80, data1: "Analyzed: " + dealsApproved.length, data2: "Presentations: " + perfectPresentations.length },
      { name: "Contracts", current: contractRatio, redFlag: 10, target: 25, data1: "Presentations: " + perfectPresentations.length, data2: "Contracts: " + contracts.length },
      { name: "Acquisitions", current: acquisitionRatio, redFlag: 50, target: 75, data1: "Contracts: " + contracts.length, data2: "Acquisitions: " + acquisitions.length },
      { name: "Deals", current: dealsRatio, redFlag: 50, target: 75, data1: "Acquisitions: " + acquisitions.length, data2: "Deals: " + deals.length },
      { name: "Profits", current: profits, redFlag: 10, target: 50, data1: "Deals: " + deals.length, data2: "Profits: " + "$" + profits }
    ];

    console.log("Results: ", results);

    return results;

  } catch (error) {
    console.error(error);
  }

};

export default fetchKPIs;