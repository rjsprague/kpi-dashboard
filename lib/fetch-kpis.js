function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const KPI_DEFINITIONS = {
  "Cost Per Lead": {
    name: "Cost Per Lead",
    dataKeys: ["marketingExpenses", "leads"],
    formula: (apiData) => {
      const { totalMarketingExpenses, leads } = apiData;
      return leads !== 0 ? Math.round(totalMarketingExpenses / leads) : 0;
    },
    redFlag: 60,
    target: 35,
    dataLabels: ["Marketing: ", "Leads: "],
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
    ],
  },
  "Lead Connections": {
    name: "Lead Connections",
    dataKeys: ["leads", "leadConnections"],
    formula: (apiData) => {
      const { leads, leadConnections } = apiData;
      return leads !== 0 ? Math.round((leadConnections / leads) * 100) : 0;
    },
    redFlag: 70,
    target: 80,
    dataLabels: ["Leads: ", "Connections: "],
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
    ],
  },
  "Triage Calls": {
    name: "Triage Calls",
    dataKeys: ["leadConnections", "triageCalls"],
    formula: (apiData) => {
      const { leadConnections, triageCalls } = apiData;
      return leadConnections !== 0 ? Math.round((triageCalls / leadConnections) * 100) : 0;
    },
    redFlag: 60,
    target: 75,
    dataLabels: ["Connections: ", "Triages: "],
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
    ],
  },
  "Triage Qualifications": {
    name: "Triage Qualifications",
    dataKeys: ["triageCalls", "triageQualifications"],
    formula: (apiData) => {
      const { triageCalls, triageQualifications } = apiData;
      return triageCalls !== 0 ? Math.round((triageQualifications / triageCalls) * 100) : 0;
    },
    redFlag: 50,
    target: 70,
    dataLabels: ["Triages: ", "Qualified: "],
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
        id: 2,
        desc: "Mislabeling 'Qualified' leads",
        linkName: "Learn More",
        link: "#"
      }
    ],
  },
  "Triage Approvals": {
    name: "Triage Approval",
    dataKeys: ["triageQualifications", "triageApproval"],
    formula: (apiData) => {
      const { triageQualifications, triageApproval } = apiData;
      return triageQualifications !== 0 ? Math.round((triageApproval / triageQualifications) * 100) : 0;
    },
    redFlag: 50,
    target: 70,
    dataLabels: ["Qualified: ", "Approved: "],
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
    ],
  },
  "Deal Analysis": {
    name: "Deal Analysis",
    dataKeys: ["triageApproval", "dealAnalysis"],
    formula: (apiData) => {
      const { triageApproval, dealAnalysis } = apiData;
      return triageApproval !== 0 ? Math.round((dealAnalysis / triageApproval) * 100) : 0;
    },
    redFlag: 65,
    target: 80,
    dataLabels: ["Approved: ", "Analyzed: "],
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
    ],
  },
  "Perfect Presentations": {
    name: "Perfect Presentations",
    dataKeys: ["dealAnalysis", "perfectPresentations"],
    formula: (apiData) => {
      const { dealAnalysis, perfectPresentations } = apiData;
      return dealAnalysis !== 0 ? Math.round((perfectPresentations / dealAnalysis) * 100) : 0;
    },
    redFlag: 65,
    target: 80,
    dataLabels: ["Analyzed: ", "Presentations: "],
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
    ],
  },
  "Contracts": {
    name: "Contracts",
    dataKeys: ["perfectPresentations", "contracts"],
    formula: (apiData) => {
      const { perfectPresentations, contracts } = apiData;
      return perfectPresentations !== 0 ? Math.round((contracts / perfectPresentations) * 100) : 0;
    },
    redFlag: 10,
    target: 25,
    dataLabels: ["Presentations: ", "Contracts: "],
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
    ],
  },
  "Acquisitions": {
    name: "Acquisitions",
    dataKeys: ["contracts", "acquisitions"],
    formula: (apiData) => {
      const { contracts, acquisitions } = apiData;
      return contracts !== 0 ? Math.round((acquisitions / contracts) * 100) : 0;
    },
    redFlag: 50,
    target: 75,
    dataLabels: ["Contracts: ", "Acquisitions: "],
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
    ],
  },
  "Deals": {
    name: "Deals",
    dataKeys: ["acquisitions", "deals"],
    formula: (apiData) => {
      const { acquisitions, deals } = apiData;
      return deals ? deals.length : 0;
    },
    redFlag: 0,
    target: 0,
    dataLabels: ["Acquisitions: ", "Deals: "],
    kpiFactors: [
      {
        id: 0,
        title: "TBD",
      },
    ],
  },
  "Profit": {
    name: "Profit",
    dataKeys: ["deals", "profit"],
    formula: (apiData) => {
      const { deals } = apiData;
      return deals && Array.isArray(deals) && deals.length > 0 ? deals.reduce((acc, curr) => {
        if ("Net Profit Center" in curr) {
          return acc + parseInt(curr["Net Profit Center"], 10);
        } else {
          return acc;
        }
      }, 0) : 0;
    },
    redFlag: 0,
    target: 0,
    dataLabels: ["Deals: ", "Profit: "],
    kpiFactors: [
      {
        id: 0,
        title: "TBD",
      },
    ],
  },
};

function calculateKPIs(apiData) {
  // calculate total marketing expenses which is the sum of the 'Amount' field in the marketingExpenses array
  const totalMarketingExpenses = apiData.marketingExpenses.reduce((acc, curr) => {
    if ("Amount" in curr) {
      return acc + parseInt(curr["Amount"], 10);
    } else {
      return acc;
    }
  }, 0);

  // Use the totalMarketingExpenses in the apiData object
  apiData.totalMarketingExpenses = totalMarketingExpenses;

  // Calculate KPIs using the formulas from KPI_DEFINITIONS object
  const kpiData = {};
  for (const [kpiName, kpiDefinition] of Object.entries(KPI_DEFINITIONS)) {
    kpiData[kpiName] = kpiDefinition.formula(apiData);
  }

  return kpiData;
}

function createKpiObject(name, current, redFlag, target, data1, data2, kpiFactors) {
  return {
    name,
    current,
    redFlag,
    target,
    data1,
    data2,
    kpiFactors,
  };
}

const kpiToEndpointMapping = {
  'Cost Per Lead': ['marketingExpenses', 'leads'],
  'Lead Connections': ['leads', 'leadConnections'],
  'Triage Calls': ['leadConnections', 'triageCalls'],
  'Triage Qualifications': ['triageCalls', 'triageQualifications'],
  'Triage Approval': ['triageQualifications', 'triageApproval'],
  'Deal Analysis': ['triageApproval', 'dealAnalysis'],
  'Perfect Presentations': ['dealAnalysis', 'perfectPresentations'],
  'Contracts': ['perfectPresentations', 'contracts'],
  'Acquisitions': ['contracts', 'acquisitions'],
  'Deals': ['acquisitions', 'deals'],
  'Profit': ['deals', 'profit'],
};

async function fetchKpiData(view, kpiList, leadSource, gte, lte) {

  //console.log("view ", view);
  //console.log("kpiList ", kpiList);
  //console.log("leadSource ", leadSource);
  //console.log("gte ", gte);
  //console.log("lte ", lte);

  //console.log("KPI List: ", kpiList)

  try {

    const startDate = gte ? formatDate(new Date(gte)) : null;
    const endDate = lte ? formatDate(new Date(lte)) : null;

    //console.log("lead source length ", leadSource);

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
          console.error(`Error fetching data from ${apiEndpoint}: ${response.status} ${response.statusText}`);
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

      if (leadSource && leadSource.length > 0) {
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

    // Helper function for creating data strings
    const createDataString = (dataLabel, value) => {
      return dataLabel + (dataLabel.includes('$') ? '$' : '') + value;
    };

    // Define the endpoints and filters for each KPI
    const apiEndpoints = {
      marketingExpenses: {
        name: "Marketing Expenses",
        url: "/api/marketing-expenses",
        filters: generateFilters("Lead Source", "Date")
      },
      leads: {
        name: "Leads",
        url: "/api/seller-leads",
        filters: generateFilters("Lead Source Item", "Lead Created On")
      },
      leadConnections: {
        name: "Lead Connections",
        url: "/api/seller-leads",
        filters: generateFilters("Lead Source Item", "First lead connection")
      },
      triageCalls: {
        name: "Triage Calls",
        url: "/api/seller-lead-sheets",
        filters: generateFilters("Lead Source", "SLS Created On")
      },
      triageQualifications: {
        name: "Triage Qualifications",
        url: "/api/seller-lead-sheets",
        filters: generateFilters("Lead Source", "SLS Created On", [
          {
            "type": "category",
            "fieldName": "Q or UNQ",
            "values": ["Q"]
          }
        ]),
      },
      triageApproval: {
        name: "Triage Approval",
        url: "/api/seller-lead-sheets",
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
      dealAnalysis: {
        name: "Deal Analysis",
        url: "/api/acquisition-kpis",
        filters: generateFilters("Lead Source", "Timestamp", [
          {
            "type": "category",
            "fieldName": "Type",
            "values": ["DA Speed to Lead"]
          }
        ])
      },
      perfectPresentations: {
        name: "Perfect Presentations",
        url: "/api/acquisition-scripts",
        filters: generateFilters("Lead Source", "AS Created On")
      },
      contracts: {
        name: "Contracts",
        url: "/api/contracts",
        filters: generateFilters("Lead Source", "*Date Ratified")
      },
      acquisitions: {
        name: "Acquisitions",
        url: "/api/acquisitions",
        filters: generateFilters("Lead Source", "Date Acquired")
      },
      deals: {
        name: "Deals",
        url: "/api/deals",
        filters: generateFilters("Lead Source", "Closing (Sell)")
      },
      profit: {
        name: "Profit",
        url: "/api/deals",
        filters: generateFilters("Lead Source", "Closing (Sell)")
      }
    };

    const requiredEndpoints = new Set();

    kpiList.forEach((kpi) => {
      const endpoints = kpiToEndpointMapping[kpi] || [];
      endpoints.forEach((endpoint) => {
        requiredEndpoints.add(endpoint);
      });
    });

    //console.log("Required endpoints: ", requiredEndpoints);

    const uniqueEndpoints = Array.from(requiredEndpoints);

    //console.log("Unique endpoints: ", uniqueEndpoints)

    const kpiPromises = uniqueEndpoints.map((endpointKey) => {
      const { name, url, filters } = apiEndpoints[endpointKey];
      return fetchAll(name, url, filters);
    });

    //console.log("KPI Promises: ", kpiPromises)

    const endpointData = {};

    //console.log("Endpoint Data: ", endpointData)

    await Promise.all(kpiPromises)
      .then((results) => {
        uniqueEndpoints.forEach((endpointKey, index) => {
          endpointData[endpointKey] = results[index];
        });
      })
      .catch((error) => {
        console.error(error);
        throw new Error("Error fetching endpoint data. Please try again later.");
      });

    //console.log("Endpoint Data: ", endpointData)

    const calculatedKPIs = calculateKPIs(endpointData);

    //console.log("Calculated KPIs: ", calculatedKPIs)

    function getKpiValue(kpiName, endpointData, dataKey) {
      const data = endpointData[dataKey];
      console.log("Data: ", data)
      console.log("kpiName: ", kpiName)
      console.log("dataKey: ", dataKey)

      if (dataKey === 'marketingExpenses' || dataKey === 'deals') {
        return data.length;
      }

      return data;
    }

    const kpiDefinitionsArray = Object.values(KPI_DEFINITIONS);

    //console.log("KPI Definitions Array: ", kpiDefinitionsArray)

    const kpiObjects = kpiDefinitionsArray.filter((kpiDefinition) => kpiList.includes(kpiDefinition.name))
      .map((kpiDefinition) => {
        const current = calculatedKPIs[kpiDefinition.name];
        const { redFlag, target, dataLabels, kpiFactors } = kpiDefinition;

        const data1 = createDataString(dataLabels[0], getKpiValue(kpiDefinition.name, endpointData, kpiDefinition.dataKeys[0]));
        const data2 = createDataString(dataLabels[1], getKpiValue(kpiDefinition.name, endpointData, kpiDefinition.dataKeys[1]));

        return createKpiObject(kpiDefinition.name, current, redFlag, target, data1, data2, kpiFactors);
      });

    console.log(kpiObjects);
    return kpiObjects;

  } catch (error) {
    console.error(error);
    return ("There was an error fetching the KPI data: ", error);
  }
}

export default fetchKpiData;
