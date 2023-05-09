import fetchKPIs from "./api-utils";

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
  "Triage Approval": {
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
      const { deals } = apiData;
      return deals ? deals : 0;
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
      const { profit } = apiData;
      return profit && Array.isArray(profit) && profit.length > 0 ? profit.reduce((acc, curr) => {
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
  "LM STL Median": {
    name: "LM STL Median",
    dataKeys: ['lmStlMedian'],
    formula: (apiData) => {
      // Calculate the median Speed to Lead
      const { lmStlMedian } = apiData;
      let stlArray = lmStlMedian.reduce((acc, curr) => {
        if ('Speed to Lead Adjusted' in curr) {
          acc.push(curr['Speed to Lead Adjusted']);
        }
        return acc;
      }, []);
      stlArray.sort((a, b) => a - b);
      let lmStlMedianSorted = stlArray.length % 2 === 0 ? (stlArray[stlArray.length / 2 - 1] + stlArray[stlArray.length / 2]) / 2 : stlArray[(stlArray.length - 1) / 2];
      return lmStlMedianSorted / 60;
    },
    redFlag: 15,
    target: 5,
    dataLabels: [" minutes", "NA: "],
    kpiType: "STL",
    kpiFactors: [
      {
        id: 0,
        title: "TBD",
      },
    ],
  },
  "AM STL Median": {
    name: "AM STL Median",
    dataKeys: [],
    formula: (apiData) => {
      // Calculate the median Speed to Lead
      const { amStlMedian } = apiData;
      let stlArray = amStlMedian.reduce((acc, curr) => {
        if ('Speed to Lead Adjusted' in curr) {
          acc.push(curr['Speed to Lead Adjusted']);
        }
        return acc;
      }, []);
      stlArray.sort((a, b) => a - b);
      let amStlMedianSorted = stlArray.length % 2 === 0 ? (stlArray[stlArray.length / 2 - 1] + stlArray[stlArray.length / 2]) / 2 : stlArray[(stlArray.length - 1) / 2];
      return amStlMedianSorted / 3600;
    },
    redFlag: 8,
    target: 3,
    dataLabels: ["NA: ", "NA: "],
    kpiType: "STL",
    kpiFactors: [
      {
        id: 0,
        title: "TBD",
      },
    ],
  },
  "DA STL Median": {
    name: "DA STL Median",
    dataKeys: [],
    formula: (apiData) => {
      // Calculate the median Speed to Lead
      const { daStlMedian } = apiData;
      let stlArray = daStlMedian.reduce((acc, curr) => {
        if ('Speed to Lead Adjusted' in curr) {
          acc.push(curr['Speed to Lead Adjusted']);
        }
        return acc;
      }, []);
      stlArray.sort((a, b) => a - b);
      let daStlMedianSorted = stlArray.length % 2 === 0 ? (stlArray[stlArray.length / 2 - 1] + stlArray[stlArray.length / 2]) / 2 : stlArray[(stlArray.length - 1) / 2];
      return (daStlMedianSorted / 3600);
    },
    redFlag: 4,
    target: 1,
    dataLabels: ["NA: ", "NA: "],
    kpiType: "STL",
    kpiFactors: [
      {
        id: 0,
        title: "TBD",
      },
    ],
  },
  "BiG Checks": {
    name: "BiG Checks",
    dataKeys: [],
    formula: (apiData) => {
      // Calculate the median Speed to Lead
      const { bigChecks } = apiData;
      return bigChecks ? bigChecks.length : 0;
    },
    redFlag: 4,
    target: 5,
    dataLabels: ["NA: ", "NA: "],
    kpiType: "BigChecks",
    kpiFactors: [
      {
        id: 0,
        title: "TBD",
      },
    ],
  },
};

function calculateKPIs(endpointData) {
  const kpiData = {};
  for (const [kpiName, kpiDefinition] of Object.entries(KPI_DEFINITIONS)) {
    try {
      kpiData[kpiName] = kpiDefinition.formula(endpointData);
      //console.log("kpi data: ", kpiData)
    } catch (error) {
      console.error(`Error calculating ${kpiName}:`, error);
    }
  }
  //console.log("kpi data: ", kpiData)
  return kpiData;
}


function createKpiObject(name, current, redFlag, target, data1, data2, kpiType, kpiFactors) {
  return {
    name,
    current,
    redFlag,
    target,
    data1,
    data2,
    kpiType,
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
  'LM STL Median': ['lmStlMedian'],
  'AM STL Median': ['amStlMedian'],
  'DA STL Median': ['daStlMedian'],
  'BiG Checks': ['bigChecks'],
};

async function fetchKpiData(kpiView, kpiList, leadSource, gte, lte) {

  console.log("kpiView ", kpiView);
  //console.log("kpiList ", kpiList);
  //console.log("leadSource ", leadSource);
  //console.log("gte ", gte);
  //console.log("lte ", lte);

  try {

    const startDate = gte ? formatDate(new Date(gte)) : null;
    const endDate = lte ? formatDate(new Date(lte)) : null;

    //console.log("lead source length ", leadSource);

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
      },
      lmStlMedian: {
        name: "LM STL Median",
        url: "/api/acquisition-kpis",
        filters: generateFilters("Lead Source", "Timestamp", [
          {
            "type": "category",
            "fieldName": "Type",
            "values": ["LM Speed to Lead"]
          }
        ])
      },
      amStlMedian: {
        name: "AM STL Median",
        url: "/api/acquisition-kpis",
        filters: generateFilters("Lead Source", "Timestamp", [
          {
            "type": "category",
            "fieldName": "Type",
            "values": ["AM Speed to Lead"]
          }
        ])
      },
      daStlMedian: {
        name: "DA STL Median",
        url: "/api/acquisition-kpis",
        filters: generateFilters("Lead Source", "Timestamp", [
          {
            "type": "category",
            "fieldName": "Type",
            "values": ["DA Speed to Lead"]
          }
        ])
      },
      bigChecks: {
        name: "BiG Checks",
        url: "/api/acquisition-kpis",
        filters: generateFilters("Lead Source", "Timestamp", [
          {
            "type": "category",
            "fieldName": "Type",
            "values": ["BiG"]
          }
        ])
      },
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
      return fetchKPIs(name, url, filters, kpiView);
    });

    //console.log("KPI Promises: ", kpiPromises)

    const endpointData = {};

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

    if (kpiView === 'Acquisitions' && "marketingExpenses" in endpointData) {
      const totalMarketingExpenses = endpointData.marketingExpenses.reduce((acc, curr) => {
        if ("Amount" in curr) {
          return acc + parseInt(curr["Amount"], 10);
        } else {
          return acc;
        }
      }, 0);

      //console.log("Endpoint Data: ", endpointData)

      //console.log("Total Marketing Expenses: ", totalMarketingExpenses)
      endpointData.totalMarketingExpenses = totalMarketingExpenses;
    }

    const calculatedKPIs = calculateKPIs(endpointData);

    //console.log("Calculated KPIs: ", calculatedKPIs)

    function getKpiValue(calculatedKPIs, endpointData, dataKey) {
      const data = endpointData[dataKey];
      console.log("Endpoint Data: ", endpointData)
      console.log("Calculated KPIs: ", calculatedKPIs)
      console.log("Data: ", data)
      console.log("dataKey: ", dataKey)

      if (dataKey === 'marketingExpenses') {
        return endpointData.totalMarketingExpenses;
      } else if (dataKey === 'deals') {
        return calculatedKPIs.Deals;
      } else if (dataKey === 'profit') {
        return calculatedKPIs.Profit;
      } else if (dataKey === 'lmStlMedian') {
        return calculatedKPIs["LM STL Median"];
      } else if (dataKey === 'amStlMedian') {
        return calculatedKPIs["AM STL Median"];
      } else if (dataKey === 'daStlMedian') {
        return calculatedKPIs["DA STL Median"];
      } else if (dataKey === 'bigChecks') {
        return calculatedKPIs["BiG Checks"];
      } else {
        return data;
      }

    }

    const kpiDefinitionsArray = Object.values(KPI_DEFINITIONS);

    //console.log("KPI Definitions Array: ", kpiDefinitionsArray)

    // Helper function for creating data strings
    const createDataString = (dataLabel, value) => {
      console.log("value: ", value)
      // If there is a space before the data label, put the label AFTER the value, else put it BEFORE
      // Use regex to check for a space at the beginning of the string
      if (/^\s/.test(dataLabel)) {
        return value + dataLabel;
      }
      return dataLabel + (dataLabel.includes('$') ? '$' : '') + value;
    };

    const kpiObjects = kpiDefinitionsArray.filter((kpiDefinition) => kpiList.includes(kpiDefinition.name))
      .map((kpiDefinition) => {
        const current = calculatedKPIs[kpiDefinition.name];
        const { redFlag, target, dataLabels, kpiFactors, dataKeys, kpiType } = kpiDefinition;
        console.log("data keys: ", dataKeys)
        console.log("is data keys empty: ", dataKeys.length > 0)
        console.log("is data keys length > 1?: ", dataKeys.length > 1)
        console.log("data keys 0 is " + dataKeys[0] + " and data keys 1 is " + dataKeys[1])
        const data1 = dataKeys.length > 0 ? createDataString(dataLabels[0], getKpiValue(calculatedKPIs, endpointData, dataKeys[0])) : 0;
        const data2 = dataKeys.length > 1 ? createDataString(dataLabels[1], getKpiValue(calculatedKPIs, endpointData, dataKeys[1])) : 0;
        
        console.log("data1: ", data1)
        //console.log("data2: ", data2)

        return createKpiObject(kpiDefinition.name, current, redFlag, target, data1, data2, kpiType, kpiFactors);
      });

    console.log(kpiObjects);
    return kpiObjects;

  } catch (error) {
    console.error(error);
    return ("There was an error fetching the KPI data: ", error);
  }
}

export default fetchKpiData;
