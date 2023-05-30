import fetchKPIs from "./api-utils";
import KPI_DEFINITIONS from "./kpi-definitions";

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function calculateKPIs(startDate, endDate, endpointData) {
  const kpiData = {};
  for (const [kpiName, kpiDefinition] of Object.entries(KPI_DEFINITIONS)) {
    try {
      if (kpiDefinition.createFormula) {
        kpiData[kpiName] = kpiDefinition.createFormula(startDate, endDate)(endpointData);
      } else {
        kpiData[kpiName] = kpiDefinition.formula(endpointData);
      }
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
  'Ad Spend': ['marketingExpenses'],
  'Cost Per Contract': ['marketingExpenses', 'contracts'],
  'Cost Per Acquisition': ['marketingExpenses', 'acquisitions'],
  'Cost Per Deal': ['marketingExpenses', 'deals'],
  'Actualized Profit': ['profit'],
  'Projected Profit': ['projectedProfit'],
  'Total Profit': ['profit', 'projectedProfit'],
  'ROAS Actualized': ['profit', 'marketingExpenses'],
  'ROAS Projected': ['projectedProfit', 'marketingExpenses'],
  'ROAS Total': ['profit', 'projectedProfit', 'marketingExpenses'],
};

async function fetchKpiData(kpiView, kpiList, leadSource, gte, lte, teamMember) {

  //console.log("kpiView ", kpiView);
  //console.log("kpiList ", kpiList);
  //console.log("leadSource ", leadSource);
  //console.log("gte ", gte);
  //console.log("lte ", lte);
  //console.log("department ", department);
  console.log("teamMember ", teamMember);

  try {

    const startDate = gte ? formatDate(new Date(gte)) : null;
    const endDate = lte ? formatDate(new Date(lte)) : null;

    //console.log("lead source length ", leadSource);
    //console.log("start date ", startDate);
    //console.log("end date ", endDate);

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
      projectedProfit: {
        name: "Projected Profit",
        url: "/api/acquisitions",
        filters: generateFilters("Lead Source", "Date Acquired")
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

    if (kpiView === 'Acquisitions' && "marketingExpenses" in endpointData && endpointData.marketingExpenses.length > 0) {
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
    } else {
      endpointData.totalMarketingExpenses = 0;
    }

    // pre calculate totalMarketingExpenses, actualizedProfit, and projectedProfit for use in Financial KPIs
    if (kpiView === 'Financial') {
      const totalMarketingExpenses = endpointData.marketingExpenses && Array.isArray(endpointData.marketingExpenses) && endpointData.marketingExpenses.reduce((acc, curr) => {
        if ("Amount" in curr) {
          return acc + parseInt(curr["Amount"], 10);
        } else {
          return acc;
        }
      }, 0);

      const actualizedProfit = endpointData.profit && Array.isArray(endpointData.profit) && endpointData.profit.reduce((acc, curr) => {
        if ("Net Profit Center" in curr) {
          return acc + parseInt(curr["Net Profit Center"], 10);
        } else {
          return acc;
        }
      }, 0);

      const projectedProfit = endpointData.projectedProfit && Array.isArray(endpointData.projectedProfit) && endpointData.projectedProfit.reduce((acc, curr) => {
        if ("Expected Profit Center" in curr) {
          return acc + parseInt(curr["Expected Profit Center"], 10);
        } else {
          return acc;
        }
      }, 0);

      endpointData.totalMarketingExpenses = totalMarketingExpenses;
      endpointData.actualizedProfit = actualizedProfit;
      endpointData.projectedProfit = projectedProfit;
      endpointData.totalProfit = actualizedProfit + projectedProfit;

    }

    const calculatedKPIs = calculateKPIs(startDate, endDate, endpointData);

    //console.log("Calculated KPIs: ", calculatedKPIs)

    function getKpiValue(calculatedKPIs, endpointData, dataKey) {
      const data = endpointData[dataKey];
      //console.log("Endpoint Data: ", endpointData)
      //console.log("Calculated KPIs: ", calculatedKPIs)
      //console.log("Data: ", data)
      //console.log("dataKey: ", dataKey)

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
      //console.log("value: ", value)
      // If there is a space before the data label, put the label AFTER the value, else put it BEFORE
      // Use regex to check for a space at the beginning of the string
      if (!dataLabel) { // Add this line
        return value;
      }
      if (/^\s/.test(dataLabel)) {
        return value + dataLabel;
      }
      return dataLabel + (dataLabel.includes('$') ? '$' : '') + value;
    };

    const kpiObjects = kpiDefinitionsArray.filter((kpiDefinition) => kpiList.includes(kpiDefinition.name))
      .map((kpiDefinition) => {
        const current = calculatedKPIs[kpiDefinition.name];
        const { redFlag, target, dataLabels, kpiFactors, dataKeys, kpiType } = kpiDefinition;
        //console.log("data keys: ", dataKeys)
        //console.log("is data keys empty: ", dataKeys.length > 0)
        //console.log("is data keys length > 1?: ", dataKeys.length > 1)
        //console.log("data keys 0 is " + dataKeys[0] + " and data keys 1 is " + dataKeys[1])
        const data1 = dataKeys.length > 0 && dataLabels[0] !== undefined ? createDataString(dataLabels[0], getKpiValue(calculatedKPIs, endpointData, dataKeys[0])) : 0;
        const data2 = dataKeys.length > 1 && dataLabels[1] !== undefined ? createDataString(dataLabels[1], getKpiValue(calculatedKPIs, endpointData, dataKeys[1])) : 0;

        //console.log("data1: ", data1)
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
