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

function calculateKPIs(startDate, endDate, endpointData, kpiList) {
    const kpiData = {};
    for (const kpiName of kpiList) {
        const kpiDefinition = KPI_DEFINITIONS[kpiName];
        if (!kpiDefinition) continue;
        try {
            if (kpiDefinition.createFormula) {
                kpiData[kpiName] = kpiDefinition.createFormula(startDate, endDate)(endpointData);
            } else {
                kpiData[kpiName] = kpiDefinition.formula(endpointData);
            }
        } catch (error) {
            console.error(`Error calculating ${kpiName}:`, error);
        }
    }
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

    const teamMember = teamMemberStrings.map(Number);
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

        //console.log("endpoint data: ", endpointData)

        const calculatedKPIs = calculateKPIs(startDate, endDate, endpointData, kpiList);
        //console.log("calculated kpis: ", calculatedKPIs)

        function getKpiValue(calculatedKPIs, endpointData, dataKey) {
            const data = endpointData[dataKey];
            if (dataKey === 'marketingExpenses') {
                return endpointData.totalMarketingExpenses;
            } else if (dataKey === 'deals') {
                return endpointData.deals;
            } else if (dataKey === 'profit') {
                return endpointData.actualizedProfit;
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
                const data1 = dataKeys.length > 0 && dataLabels[0] !== undefined ? createDataString(dataLabels[0], getKpiValue(calculatedKPIs, endpointData, dataKeys[0])) : 0;
                const data2 = dataKeys.length > 1 && dataLabels[1] !== undefined ? createDataString(dataLabels[1], getKpiValue(calculatedKPIs, endpointData, dataKeys[1])) : 0;
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
