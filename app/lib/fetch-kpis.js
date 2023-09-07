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
    // console.log("kpiData: ", kpiData)
    return kpiData;
}


async function fetchKpiData({ clientSpaceId, view, kpiList, leadSource, gte, lte, departments, teamMembers }) {

    if (view === "Leaderboard") {
        return null;
    }

    const teamMember = teamMembers.map(Number);

    let requestedKpiList = [];

    if (view === "Team" && departments[0] === "Lead Manager") {
        requestedKpiList = kpiList['Lead Manager']
    } else if (view === "Team" && departments[0] === "Acquisition Manager") {
        requestedKpiList = kpiList['Acquisition Manager']
    } else if (view === "Team" && departments[0] === "Deal Analyst") {
        requestedKpiList = kpiList['Deal Analyst']
    } else if (view === "Team" && departments[0] === "Transaction Coordinator") {
        requestedKpiList = kpiList['Transaction Coordinator']
    } else if (view === "Team" && departments[0] === "Setter") {
        requestedKpiList = kpiList['Setter']
    } else if (view === "Team" && departments[0] === "Closer") {
        requestedKpiList = kpiList['Closer']
    } else {
        requestedKpiList = kpiList
    }

    try {
        const startDate = gte ? formatDate(new Date(gte)) : null;
        const endDate = lte ? formatDate(new Date(lte)) : null;
        const apiEndpointsObj = apiEndpoints(startDate, endDate, leadSource, view, teamMember);

        const requiredEndpoints = new Set();

        requestedKpiList.forEach((kpi) => {
            const endpoints = kpiToEndpointMapping[kpi] || [];
            endpoints.forEach((endpoint) => {
                requiredEndpoints.add(endpoint);
            });
        });
        const uniqueEndpoints = Array.from(requiredEndpoints);
        const kpiPromises = uniqueEndpoints.map((endpointKey) => {
            if (!apiEndpointsObj[endpointKey]) {
                console.error(`apiEndpointsObj[endpointKey] is undefined for endpointKey: ${endpointKey}`);
            }
            const { name, url, filters } = apiEndpointsObj[endpointKey];
            return fetchKPIs(clientSpaceId, name, url, filters, view);
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

        if (view === 'Financial' || view === 'Acquisitions') {
            const totalMarketingExpenses = endpointData.marketingExpenses && Array.isArray(endpointData.marketingExpenses) && endpointData.marketingExpenses.reduce((acc, curr) => {
                if ("Amount" in curr) {
                    return acc + parseInt(curr["Amount"], 10);
                } else {
                    return acc;
                }
            }, 0);

            const totalClosersAdSpend = endpointData.closersAdSpend && Array.isArray(endpointData.closersAdSpend) && endpointData.closersAdSpend.reduce((acc, curr) => {
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

            const cashCollectedUpFront = endpointData.closersPayments && Array.isArray(endpointData.closersPayments) && endpointData.closersPayments.reduce((acc, curr) => {
                if ("Cash Collected Up Front" in curr && curr["Status"][0] !== "Canceled") {
                    acc += parseFloat(curr["Cash Collected Up Front"]);
                }
                return acc;
            }, 0);

            const totalRevenueContracted = endpointData.closersPayments && Array.isArray(endpointData.closersPayments) && endpointData.closersPayments.reduce((acc, curr) => {

                if ("Contract Total" in curr && curr["Status"][0] !== "Canceled") {
                    acc += parseFloat(curr["Contract Total"]);
                }
                return acc;
            }, 0);

            const numPaymentPlans = endpointData.closersPayments && Array.isArray(endpointData.closersPayments) && endpointData.closersPayments.reduce((acc, curr) => {
                if ("Closer Responsible" in curr && curr["Status"][0] !== "Canceled") {
                    acc += 1;
                }
                return acc;
            }, 0);

            endpointData.totalMarketingExpenses = totalMarketingExpenses;
            endpointData.totalClosersAdSpend = totalClosersAdSpend;
            endpointData.actualizedProfit = actualizedProfit;
            endpointData.projectedProfit = projectedProfit;
            endpointData.totalProfit = actualizedProfit + projectedProfit;
            endpointData.cashCollectedUpFront = cashCollectedUpFront;
            endpointData.totalRevenueContracted = totalRevenueContracted;
            endpointData.uncollectedRevenue = totalRevenueContracted - cashCollectedUpFront;
            endpointData.totalRevenue = totalRevenueContracted + cashCollectedUpFront;
            endpointData.numPaymentPlans = numPaymentPlans;
        }

        const calculatedKPIs = calculateKPIs(startDate, endDate, endpointData, requestedKpiList);

        function getKpiValue(calculatedKPIs, endpointData, dataKey) {
            const data = endpointData[dataKey];

            if (dataKey === 'marketingExpenses') {
                return endpointData.totalMarketingExpenses;
            } else if (dataKey === 'closersAdSpend') {
                return endpointData.totalClosersAdSpend;
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
            } else if (dataKey === 'closersCashCollected') {
                return endpointData.cashCollectedUpFront;
            } else if (dataKey === 'closersRevenueContracted') {
                return endpointData.totalRevenueContracted;
            } else {
                return data;
            }

        }
        // console.log("KPI Definitions Array: ", kpiDefinitionsArray)

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

        // console.log(requestedKpiList)

        // Helper function for creating KPI objects
        const kpiObjects = requestedKpiList.map((kpiName) => {
            const name = KPI_DEFINITIONS[kpiName].name;
            const current = calculatedKPIs[kpiName];
            const { redFlag, target, dataLabels, kpiFactors, dataKeys, kpiType, unit } = KPI_DEFINITIONS[kpiName];
            const data1 = dataKeys.length > 0 && dataLabels[0] !== undefined ? createDataString(dataLabels[0], getKpiValue(calculatedKPIs, endpointData, dataKeys[0])) : 0;
            const data2 = dataKeys.length > 1 && dataLabels[1] !== undefined ? createDataString(dataLabels[1], getKpiValue(calculatedKPIs, endpointData, dataKeys[1])) : 0;
            return createKpiObject(name, current, redFlag, target, data1, data2, unit, kpiType, kpiFactors);
        })

        // console.log(kpiObjects);
        return kpiObjects;

    } catch (error) {
        console.error(error);
        return ("There was an error fetching the KPI data: ", error);
    }
}

export default fetchKpiData;


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