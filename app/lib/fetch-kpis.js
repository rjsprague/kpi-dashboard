import fetchKPIs from "./api-utils";
import KPI_DEFINITIONS from "./kpi-definitions";
import kpiToEndpointMapping from "./kpiToEndpointMapping";
import apiEndpoints from "./apiEndpoints";

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

function createKpiObject(name, current, redFlag, target, data1, data2, unit, kpiType, kpiFactors) {
    return {
        name,
        current,
        redFlag,
        target,
        data1,
        data2,
        unit,
        kpiType,
        kpiFactors,
    };
}

async function fetchKpiData(clientSpaceId, kpiView, requestedKpiList, leadSource, gte, lte, department, teamMemberStrings) {

    //console.log(requestedKpiList)

    const teamMember = teamMemberStrings.map(Number);
    console.log(teamMember)
    let kpiList = [];

    if (kpiView === "Team" && department[0] === "Lead Manager") {
        kpiList = requestedKpiList['Lead Manager']
        //console.log("kpi list ", kpiList)
    } else if (kpiView === "Team" && department[0] === "Acquisition Manager") {
        kpiList = requestedKpiList['Acquisition Manager']
        //console.log("kpi list ", kpiList)
    } else {
        kpiList = requestedKpiList
    }

    try {

        const startDate = gte ? formatDate(new Date(gte)) : null;
        const endDate = lte ? formatDate(new Date(lte)) : null;
        const apiEndpointsObj = apiEndpoints(startDate, endDate, leadSource, kpiView, teamMember);
        //console.log("api endpoints obj: ", apiEndpointsObj)

        const requiredEndpoints = new Set();

        kpiList.forEach((kpi) => {
            const endpoints = kpiToEndpointMapping[kpi] || [];
            endpoints.forEach((endpoint) => {
                requiredEndpoints.add(endpoint);
            });
        });
        //console.log("required endpoints: ", requiredEndpoints)
        const uniqueEndpoints = Array.from(requiredEndpoints);
        //console.log("unique endpoints: ", uniqueEndpoints)
        const kpiPromises = uniqueEndpoints.map((endpointKey) => {
            const { name, url, filters } = apiEndpointsObj[endpointKey];
            return fetchKPIs(clientSpaceId, name, url, filters, kpiView);
        });

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

        //console.log("endpoint data: ", endpointData)

        if (kpiView === 'Financial' || kpiView === 'Acquisitions') {
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
                if ("Expected Profit Center" in curr && !curr.hasOwnProperty("*Deal")) {
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

        function getKpiValue(calculatedKPIs, endpointData, dataKey) {
            const data = endpointData[dataKey];

            if (dataKey === 'marketingExpenses') {
                return endpointData.totalMarketingExpenses;
            } else if (dataKey === 'deals') {
                return calculatedKPIs.Deals;
            } else if (dataKey === 'profit') {
                return calculatedKPIs.Profit;
            } else if (dataKey === 'pendingDeals') {
                return calculatedKPIs["Pending Deals"];
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
            if (value > 999) {
                value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
            if (!dataLabel) {
                return value;
            }
            if (/^\s/.test(dataLabel)) {
                return value + dataLabel;
            }
            return dataLabel + value;
        };

        const kpiObjects = kpiDefinitionsArray.filter((kpiDefinition) => kpiList.includes(kpiDefinition.name))
            .map((kpiDefinition) => {
                const current = calculatedKPIs[kpiDefinition.name];
                const { redFlag, target, dataLabels, kpiFactors, dataKeys, kpiType, unit } = kpiDefinition;
                // console.log("data keys: ", dataKeys)
                // console.log("is data keys empty: ", dataKeys.length > 0)
                // console.log("is data keys length > 1?: ", dataKeys.length > 1)
                // console.log("data keys 0 is " + dataKeys[0] + " and data keys 1 is " + dataKeys[1])
                const data1 = dataKeys.length > 0 && dataLabels[0] !== undefined ? createDataString(dataLabels[0], getKpiValue(calculatedKPIs, endpointData, dataKeys[0])) : 0;
                const data2 = dataKeys.length > 1 && dataLabels[1] !== undefined ? createDataString(dataLabels[1], getKpiValue(calculatedKPIs, endpointData, dataKeys[1])) : 0;

                // console.log("data1: ", data1)
                // console.log("data2: ", data2)

                return createKpiObject(kpiDefinition.name, current, redFlag, target, data1, data2, unit, kpiType, kpiFactors);
            });

        //console.log(kpiObjects);
        return kpiObjects;

    } catch (error) {
        console.error(error);
        return ("There was an error fetching the KPI data: ", error);
    }
}

export default fetchKpiData;
