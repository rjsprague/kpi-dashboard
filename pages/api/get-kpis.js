function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default async (req, res) => {

  try {
    const { leadSourceParam, gte, lte } = req.query;
    const startDate = gte ? formatDate(new Date(gte)) : null;
    const endDate = lte ? formatDate(new Date(lte)) : null;
    const leadSource = leadSourceParam !== "" ? leadSourceParam.split(',').map(str => parseInt(str, 10)) : null;


    const fetchAll = async (apiName, apiEndpoint, filters) => {
      /** a function to fetch all the data from the API based on filters defined by the user */
      try {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "filters": filters
          }),
        });

        if (!response.ok) {
          throw new Error(`Server responded with an error: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.total === 0) {
          return 0;
        } else if (apiName !== "Marketing Expenses" && apiName !== "Deals") {
          return data.total;
        } else {

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
            offset += moreData.data.length;
          }
          return fetchedResults;
        }
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

      if (leadSource && leadSource !== null && fieldName !== null) {
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

    // Define the endpoints and filters for each KPI
    const apiEndpoints = {
      marketingExpenses: {
        name: "Marketing Expenses",
        url: "https://db.reiautomated.io/marketing-expenses",
        filters: generateFilters("Lead Source", "Date")
      },
      leads: {
        name: "Leads",
        url: "https://db.reiautomated.io/seller-leads",
        filters: generateFilters("Lead Source Item", "Lead Created On")
      },
      connectedLeads: {
        name: "Connected Leads",
        url: "https://db.reiautomated.io/seller-leads",
        filters: generateFilters("Lead Source Item", "First lead connection")
      },
      triageCalls: {
        name: "Triage Calls",
        url: "https://db.reiautomated.io/seller-lead-sheets",
        filters: generateFilters("Lead Source", "SLS Created On")
      },
      qualifiedTriageCalls: {
        name: "Qualified Triage Calls",
        url: "https://db.reiautomated.io/seller-lead-sheets",
        filters: generateFilters("Lead Source", "SLS Created On", [
          {
            "type": "category",
            "fieldName": "Q or UNQ",
            "values": ["Q"]
          }
        ]),
      },
      approvedTriageCalls: {
        name: "Approved Triage Calls",
        url: "https://db.reiautomated.io/seller-lead-sheets",
        filters: generateFilters("Lead Source", "SLS Created On", [
          {
            "type": "category",
            "fieldName": "Q or UNQ",
            "values": ["Q"]
          },
          {
            "type": "category",
            "fieldName": "Qualified?",
            "values": ["Approve"]
          }
        ]),
      },
      dealsApproved: {
        name: "Deals Approved",
        url: "https://db.reiautomated.io/acquisition-kpis",
        filters: generateFilters(null, "Timestamp", [
          {
            "type": "category",
            "fieldName": "Type",
            "values": ["DA Speed to Lead"]
          }
        ])
      },
      perfectPresentations: {
        name: "Perfect Presentations",
        url: "https://db.reiautomated.io/acquisition-scripts",
        filters: generateFilters("Lead Source", "AS Created On")
      },
      contracts: {
        name: "Contracts",
        url: "https://db.reiautomated.io/contracts",
        filters: generateFilters("Lead Source", "*Date Ratified")
      },
      acquisitions: {
        name: "Acquisitions",
        url: "https://db.reiautomated.io/acquisitions",
        filters: generateFilters(null, "Date Acquired")
      },
      deals: {
        name: "Deals",
        url: "https://db.reiautomated.io/deals",
        filters: generateFilters("Lead Source", "Closing (Sell)")
      },
    };

    // Pull the data for each KPI
    const [marketingExpenses, leads, connectedLeads, triageCalls, qualifiedTriageCalls, approvedTriageCalls, dealsApproved, perfectPresentations, contracts, acquisitions, deals] = await Promise.all([
      fetchAll(apiEndpoints.marketingExpenses.name, apiEndpoints.marketingExpenses.url, apiEndpoints.marketingExpenses.filters).then((data) => data !== 0 ? data.reduce((acc, curr) => {
        if ("Amount" in curr) {
          return acc + parseInt(curr.Amount, 10);
        } else {
          return acc;
        }
      }, 0) : 0),
      fetchAll(apiEndpoints.leads.name, apiEndpoints.leads.url, apiEndpoints.leads.filters),
      fetchAll(apiEndpoints.connectedLeads.name, apiEndpoints.connectedLeads.url, apiEndpoints.connectedLeads.filters),
      fetchAll(apiEndpoints.triageCalls.name, apiEndpoints.triageCalls.url, apiEndpoints.triageCalls.filters),
      fetchAll(apiEndpoints.qualifiedTriageCalls.name, apiEndpoints.qualifiedTriageCalls.url, apiEndpoints.qualifiedTriageCalls.filters),
      fetchAll(apiEndpoints.approvedTriageCalls.name, apiEndpoints.approvedTriageCalls.url, apiEndpoints.approvedTriageCalls.filters),
      fetchAll(apiEndpoints.dealsApproved.name, apiEndpoints.dealsApproved.url, apiEndpoints.dealsApproved.filters),
      fetchAll(apiEndpoints.perfectPresentations.name, apiEndpoints.perfectPresentations.url, apiEndpoints.perfectPresentations.filters),
      fetchAll(apiEndpoints.contracts.name, apiEndpoints.contracts.url, apiEndpoints.contracts.filters),
      fetchAll(apiEndpoints.acquisitions.name, apiEndpoints.acquisitions.url, apiEndpoints.acquisitions.filters),
      fetchAll(apiEndpoints.deals.name, apiEndpoints.deals.url, apiEndpoints.deals.filters)
    ]);

    // Calculate the KPI values
    const costPerLead = leads !== 0 ? Math.round(marketingExpenses / leads) : 0;
    const connectedLeadRatio = leads !== 0 ? Math.round(connectedLeads / leads * 100) : 0;
    const triageCallRatio = connectedLeads !== 0 ? Math.round(triageCalls / connectedLeads * 100) : 0;
    const qualifiedTriageCallRatio = triageCalls !== 0 ? Math.round(qualifiedTriageCalls / triageCalls * 100) : 0;
    const approvedTriageCallRatio = qualifiedTriageCalls !== 0 ? Math.round(approvedTriageCalls / qualifiedTriageCalls * 100) : 0;
    const dealAnalysisRatio = approvedTriageCalls !== 0 ? Math.round(dealsApproved / approvedTriageCalls * 100) : 0;
    const perfectPresentationRatio = approvedTriageCalls !== 0 ? Math.round(perfectPresentations / approvedTriageCalls * 100) : 0;
    const contractRatio = perfectPresentations !== 0 ? Math.round(contracts / perfectPresentations * 100) : 0;
    const acquisitionRatio = acquisitions !== 0 ? Math.round(acquisitions / contracts * 100) : 0;
    const profit = deals !== 0 ? Math.round(deals.reduce((acc, curr) => {
      if ("Net Profit Center" in curr) {
        return acc + parseInt(curr["Net Profit Center"], 10);
      } else {
        return acc;
      }
    }, 0)) : 0;

    // Return the results   
    res.json(
      [
        {
          name: "Cost Per Lead",
          current: costPerLead,
          redFlag: 60,
          target: 35,
          data1: "Marketing: " + "$" + marketingExpenses,
          data2: "Leads: " + leads,
          kpiFactors: [
            {              
              id: 0,
              title: "How to Optimize Cost Per Lead",
            },
            {
              id: 1,
              desc: "Consider increasing your metro count. The more people you market to, the cheaper your leads will get. Disregard this if you are only marketing locally.",
              linkName: "Learn More: Choosing Your Metros", 
              link: "https://knowledge.reiautomated.io/courses/take/scaling/lessons/43155989-starting-your-marketing-choosing-your-metros" 
            },
          ]          
        },
        {
          name: "Lead Connections",
          current: connectedLeadRatio,
          redFlag: 70,
          target: 80,
          data1: "Leads " + leads,
          data2: "Connections:" + connectedLeads,
          kpiFactors: [
            {              
              id: 0,
              title: "How to Optimize Lead Connections",
            },
            {
              id: 1,
              desc: "1 of 2 things is wrong: Leads are giving you wrong numbers, or your phone number may be marked as 'Spam Risk'. Get a new phone number, or go through A2P/10DLC/Stirred & Shaken and register your numbers in a Campaign through Smrtphone.",
              linkName: "Learn More: smrtPhone Trust Center", 
              link: "https://knowledge.reiautomated.io/courses/take/scaling/multimedia/41192521-smrtphone-trust-center" 
            },
          ]
        },
        { 
          name: "Triage Calls", 
          current: triageCallRatio, 
          redFlag: 60, 
          target: 75, 
          data1: "Connections: " + connectedLeads, 
          data2: "Triages: " + triageCalls,
          kpiFactors: [
            {              
              id: 0,
              title: "How to Optimize Triage Calls",
            },
            {
              id: 1,
              desc: "Speed to Lead",
              linkName: "Learn More", 
              link: "https://knowledge.reiautomated.io/courses/take/scaling/lessons/40235788-speed-to-lead-the-most-important-metric" 
            },
            {
              id: 2,
              desc: "Big Checks",
              linkName: "Learn More", 
              link: "https://knowledge.reiautomated.io/courses/take/scaling/lessons/40235790-the-big-check-philosophy" 
            },
            {
              id: 3, 
              desc: "Crazy Ex-Girlfriend",
              linkName: "Learn More", 
              link: "https://knowledge.reiautomated.io/courses/take/scaling/lessons/40235793-best-practices-calling-using-the-crazy-ex-girlfriend-method" 
            },
            {
              id: 4,
              desc: "Not submitting SLS",
              linkName: "Learn More", 
              link: "https://knowledge.reiautomated.io/courses/take/scaling/lessons/42977333-how-to-fill-out-the-triage-call-formerly-the-sls" 
            },
          ]
        },
        { 
          name: "Triage Qualification", 
          current: qualifiedTriageCallRatio, 
          redFlag: 50, 
          target: 70, 
          data1: "Triages: " + triageCalls, 
          data2: "Qualified: " + qualifiedTriageCalls,
          kpiFactors: [
            {              
              id: 0,
              title: "How to Optimize Triage Qualifications",
            },
            {
              id: 1,
              desc: "Weekly Marketing Manager Reports",
              linkName: "Learn More", 
              link: "https://knowledge.reiautomated.io/courses/take/scaling/lessons/40235788-speed-to-lead-the-most-important-metric" 
            },
            {
              id: 1,
              desc: "Mislabeling 'Qualified' leads",
              linkName: "Learn More", 
              link: "#" 
            }
          ]
        },
        { 
          name: "Triage Approval", 
          current: approvedTriageCallRatio, 
          redFlag: 50, 
          target: 70, 
          data1: "Qualified: " + qualifiedTriageCalls, 
          data2: "Approved: " + approvedTriageCalls,
          kpiFactors: [
            {              
              id: 0,
              title: "How to Optimize Triage Approvals",
            },
            {
              id: 1,
              desc: "Speed to Lead",
              linkName: "Learn More", 
              link: "https://knowledge.reiautomated.io/courses/take/scaling/lessons/40235788-speed-to-lead-the-most-important-metric" 
            },
            {
              id: 2,
              desc: "Big Checks",
              linkName: "Learn More", 
              link: "https://knowledge.reiautomated.io/courses/take/scaling/lessons/40235790-the-big-check-philosophy" 
            }
          ]
        },
        { 
          name: "Deal Analysis", 
          current: dealAnalysisRatio, 
          redFlag: 65, 
          target: 80, 
          data1: "Approved: " + approvedTriageCalls, 
          data2: "Analyzed: " + dealsApproved,
          kpiFactors: [
            {              
              id: 0,
              title: "How to Optimize Deal Analysis",
            },
            {
              id: 1,
              desc: "Speed to Lead",
              linkName: "Learn More", 
              link: "https://knowledge.reiautomated.io/courses/take/scaling/lessons/40235788-speed-to-lead-the-most-important-metric" 
            },
            {
              id: 2,
              desc: "Big Checks",
              linkName: "Learn More", 
              link: "https://knowledge.reiautomated.io/courses/take/scaling/lessons/40235790-the-big-check-philosophy" 
            }
          ]
        },
        { 
          name: "Perfect Presentations", 
          current: perfectPresentationRatio, 
          redFlag: 65, 
          target: 80, 
          data1: "Analyzed: " + dealsApproved, 
          data2: "Presentations: " + perfectPresentations,
          kpiFactors: [
            {              
              id: 0,
              title: "How to Optimize Perfect Presentations",
            },
            { 
              id: 1,
              desc: "Speed to Lead",
              linkName: "Learn More", 
              link: "https://knowledge.reiautomated.io/courses/take/scaling/lessons/40235788-speed-to-lead-the-most-important-metric" 
            },
            {
              id: 2, 
              desc: "Big Checks",
              linkName: "Learn More", 
              link: "https://knowledge.reiautomated.io/courses/take/scaling/lessons/40235790-the-big-check-philosophy" 
            },
            {
              id: 3,
              desc: "Crazy Ex-Girlfriend",
              linkName: "Learn More", 
              link: "https://knowledge.reiautomated.io/courses/take/scaling/lessons/40235793-best-practices-calling-using-the-crazy-ex-girlfriend-method" 
            },
            {
              id: 4,
              desc: "Not submitting Perfect Presentation",
              linkName: "Learn More", 
              link: "https://knowledge.reiautomated.io/courses/take/scaling/lessons/42977390-the-perfect-presentation" 
            },
          ]
        },
        { 
          name: "Contracts", 
          current: contractRatio, 
          redFlag: 10, 
          target: 25, 
          data1: "Presentations: " + perfectPresentations, 
          data2: "Contracts: " + contracts,
          kpiFactors: [
            {              
              id: 0,
              title: "How to Optimize Contracts",
            },
            {
              id: 1,
              desc: "Negotiation/Sales Frame",
              linkName: "Learn More", 
              link: "https://knowledge.reiautomated.io/courses/take/scaling/lessons/40235788-speed-to-lead-the-most-important-metric" 
            },
            {
              id: 2,
              desc: "Deal Structure",
              linkName: "Learn More", 
              link: "https://knowledge.reiautomated.io/courses/take/scaling/lessons/40235790-the-big-check-philosophy" 
            },
            {
              id: 3,
              desc: "Stay on the phone for PSA Signing",
              linkName: "Learn More", 
              link: "https://knowledge.reiautomated.io/courses/take/scaling/lessons/40235793-best-practices-calling-using-the-crazy-ex-girlfriend-method" 
            }            
          ] 
        },
        { 
          name: "Acquisitions", 
          current: acquisitionRatio, 
          redFlag: 50, 
          target: 75, 
          data1: "Contracts: " + contracts, 
          data2: "Acquisitions: " + acquisitions,
          kpiFactors: [
            
            {              
              id: 0,
              title: "How to Optimize Acquisitions",
            },
            {              
              id: 1,
              desc: "Renegotiation after inspections.",
              linkName: "Learn More", 
              link: "https://knowledge.reiautomated.io/courses/take/scaling/lessons/40235788-speed-to-lead-the-most-important-metric" 
            },
            {
              id: 2,
              desc: "Regular Seller Update, Professionalism, Preparedness.",
              linkName: "Learn More", 
              link: "https://knowledge.reiautomated.io/courses/take/scaling/lessons/42976159-what-to-do-after-a-contract-is-signed-immediate-next-steps-video" 
            },
            {
              id: 3,
              desc: "Give the seller confidence in your ability to solve their problem.",
              linkName: "Learn More", 
              link: "https://knowledge.reiautomated.io/courses/take/scaling/lessons/40235793-best-practices-calling-using-the-crazy-ex-girlfriend-method" 
            }            
          ]
        },
        { 
          name: "Deals", 
          current: (deals !== 0 ? deals.length : 0), 
          redFlag: 0, target: 0, 
          data1: "Acquisitions: " + acquisitions, 
          data2: "Deals: " + (deals !== 0 ? deals.length : 0) 
        },
        { 
          name: "Profit", 
          current: profit, 
          redFlag: 0, 
          target: 0, 
          data1: "Deals: " + (deals !== 0 ? deals.length : 0), 
          data2: "Profit: " + "$" + profit 
        }
      ]
    );

  } catch (error) {
    console.error(error);
    res.status(500).send({ "Error": "Error fetching kpi" });
  }

};
