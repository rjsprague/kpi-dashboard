import fetchKPIs from "./api-utils";
import KPI_DEFINITIONS from "./kpi-definitions";
import kpiToEndpointMapping from "./kpiToEndpointMapping";
import apiEndpoints from "./apiEndpoints";
// import calculateTotalSalesCapacity from "./closers-sales-capacity";

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

        kpiData[kpiName] = {}; // Initialize kpiName as an object

        try {
            // Calculate and assign the main KPI value
            if (kpiDefinition.createFormula) {
                kpiData[kpiName]['current'] = kpiDefinition.createFormula(startDate, endDate)(endpointData);
            } else {
                kpiData[kpiName]['current'] = kpiDefinition.formula(endpointData);
            }

            // Calculate and assign redFlag and target
            if (kpiDefinition.createRedFlag) {
                kpiData[kpiName]['redFlag'] = kpiDefinition.createRedFlag(startDate, endDate)(endpointData);
            } else {
                kpiData[kpiName]['redFlag'] = kpiDefinition.redFlag;
            }
            if (kpiDefinition.createTarget) {
                kpiData[kpiName]['target'] = kpiDefinition.createTarget(startDate, endDate)(endpointData);
            } else {
                kpiData[kpiName]['target'] = kpiDefinition.target;
            }

        } catch (error) {
            console.error(`Error calculating ${kpiName}:`, error);
        }
    }
    return kpiData;
}

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

function createKpiObject(name, current, redFlag, target, data1, data2, data3, unit, kpiType, kpiFactors) {
    return {
        name,
        current,
        redFlag,
        target,
        data1,
        data2,
        data3,
        unit,
        kpiType,
        kpiFactors,
    };
}

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
        return calculatedKPIs["Pending Deals"].current;
    } else if (dataKey === 'lmStlMedian') {
        return calculatedKPIs["LM STL Median"].current;
    } else if (dataKey === 'amStlMedian') {
        return calculatedKPIs["AM STL Median"].current;
    } else if (dataKey === 'daStlMedian') {
        return calculatedKPIs["DA STL Median"].current;
    } else if (dataKey === 'setterStlMedian') {
        return calculatedKPIs["Setter STL Median"].current;
    } else if (dataKey === 'bigChecks') {
        return calculatedKPIs["BiG Checks"].current;
    } else if (dataKey === 'closersCashCollected') {
        return endpointData.cashCollectedUpFront;
    } else if (dataKey === 'closersRevenueContracted') {
        return endpointData.totalRevenueContracted;
    } else if (dataKey === 'closerCommission') {
        return calculatedKPIs["Closer Commission"].current;
    } else if (dataKey === 'setterCommission') {
        return calculatedKPIs["Setter Commission"].current;
    } else if (dataKey === 'currentPassiveIncome') {
        return calculatedKPIs["Current Passive Income"].current;
    } 
    else if (dataKey === 'closersDcOffers') {
        let uniqueOffers = Math.round(calculatedKPIs["Closers Offer Rate"].current * endpointData.closersUniqueAttended / 100);
        // console.log(closersDCOffers)
        return uniqueOffers;
    } 
    else {
        return data;
    }

}

async function fetchKpiData({ isStarter, isProfessional, clientSpaceId, view, kpiList, leadSources, gte, lte, departments, teamMembers, closers, setters, noSetter }) {

    // console.log(isStarter, clientSpaceId)
    // console.log(isProfessional, clientSpaceId)
    // console.log(kpiList)
    // console.log(leadSources)
    // console.log(gte)
    // console.log(lte)
    // console.log(departments)
    // console.log(teamMembers)
    // console.log(view)
    // console.log(closers)
    // console.log(setters)
    // console.log(noSetter)

    if (view === "Leaderboard") {
        return null;
    }

    if (isProfessional && clientSpaceId !== 8108305 || isStarter && clientSpaceId !== 8108305) {
        let emptyKpiData = [];

        if (view === "Team") {
            let teamKpiList = kpiList[departments[0]];
            emptyKpiData = teamKpiList.map((kpiName) => {
                const name = KPI_DEFINITIONS[kpiName].name;
                const current = 0;
                const { redFlag, target, dataLabels, kpiFactors, dataKeys, kpiType, unit } = KPI_DEFINITIONS[kpiName];
                const data1 = dataKeys.length > 0 && dataLabels[0] !== undefined ? createDataString(dataLabels[0], 0) : 0;
                const data2 = dataKeys.length > 1 && dataLabels[1] !== undefined ? createDataString(dataLabels[1], 0) : 0;
                const data3 = dataKeys.length > 2 && dataLabels[2] !== undefined ? createDataString(dataLabels[2], 0) : 0;
                return createKpiObject(name, current, redFlag, target, data1, data2, data3, unit, kpiType, kpiFactors);
            })
        } else {
            emptyKpiData = kpiList.map((kpiName) => {
                const name = KPI_DEFINITIONS[kpiName].name;
                const current = 0;
                const { redFlag, target, dataLabels, kpiFactors, dataKeys, kpiType, unit } = KPI_DEFINITIONS[kpiName];
                const data1 = dataKeys.length > 0 && dataLabels[0] !== undefined ? createDataString(dataLabels[0], 0) : 0;
                const data2 = dataKeys.length > 1 && dataLabels[1] !== undefined ? createDataString(dataLabels[1], 0) : 0;
                const data3 = dataKeys.length > 2 && dataLabels[2] !== undefined ? createDataString(dataLabels[2], 0) : 0;
                return createKpiObject(name, current, redFlag, target, data1, data2, data3, unit, kpiType, kpiFactors);
            })
        }

        return emptyKpiData
    }

    const teamMember = teamMembers.map(Number);
    const closer = closers.map(Number);
    const setter = setters.map(Number);

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

    // console.log(requestedKpiList)

    try {
        const startDate = gte ? formatDate(new Date(gte)) : null;
        const endDate = lte ? formatDate(new Date(lte)) : null;
        const apiEndpointsObj = apiEndpoints(startDate, endDate, leadSources, view, teamMember, closer, setter);

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
            return fetchKPIs(clientSpaceId, name, url, filters, view, noSetter);
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

        // console.log(endpointData)

        if (view === 'Financial' || view === 'Acquisitions') {

            // const closersSalesCapacity = calculateTotalSalesCapacity(startDate, endDate, closers);
            
            const allPreviousDcOffers = clientSpaceId === 8108305 && await fetchKPIs(clientSpaceId, apiEndpointsObj.allPreviousDcOffers.name, apiEndpointsObj.allPreviousDcOffers.url, apiEndpointsObj.allPreviousDcOffers.filters, "All Previous DC Offers", noSetter)

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

            const contractedProfit = endpointData.contractedProfit && Array.isArray(endpointData.contractedProfit) && endpointData.contractedProfit.reduce((acc, curr) => {
                if ("Expected Profit Center" in curr) {
                    return acc + parseInt(curr["Expected Profit Center"], 10);
                } else {
                    return acc;
                }
            }, 0);

            const cashCollectedUpFront = endpointData.closersPayments && Array.isArray(endpointData.closersPayments) && endpointData.closersPayments.reduce((acc, curr) => {
                if (curr["Cash Collected Up Front"]) {
                    acc += parseFloat(curr["Cash Collected Up Front"]);
                }
                return acc;
            }, 0);

            const totalRevenueContracted = endpointData.closersPayments && Array.isArray(endpointData.closersPayments) && endpointData.closersPayments.reduce((acc, curr) => {
                if ("Contract Total" in curr) {
                    acc += parseFloat(curr["Contract Total"]);
                }
                return acc;
            }, 0);

            const numPaymentPlans = endpointData.closersPayments && Array.isArray(endpointData.closersPayments) && endpointData.closersPayments.reduce((acc, curr) => {
                if (curr) {
                    acc += 1;
                }
                return acc;
            }, 0);

            // endpointData.closersSalesCapacity = closersSalesCapacity;
            endpointData.allPreviousDcOffers = allPreviousDcOffers && allPreviousDcOffers;
            endpointData.totalMarketingExpenses = totalMarketingExpenses;
            endpointData.totalClosersAdSpend = totalClosersAdSpend;
            endpointData.actualizedProfit = actualizedProfit;
            endpointData.projectedProfit = projectedProfit;
            endpointData.contractedProfit = contractedProfit;
            endpointData.totalProfit = actualizedProfit + projectedProfit + contractedProfit;
            endpointData.cashCollectedUpFront = cashCollectedUpFront;
            endpointData.totalRevenueContracted = totalRevenueContracted;
            endpointData.numPaymentPlans = numPaymentPlans;
        }

        const calculatedKPIs = calculateKPIs(startDate, endDate, endpointData, requestedKpiList);

        // Helper function for creating KPI objects
        const kpiObjects = requestedKpiList.map((kpiName) => {
            const name = KPI_DEFINITIONS[kpiName].name;
            const current = calculatedKPIs[kpiName].current;
            const redFlag = calculatedKPIs[kpiName].redFlag;
            const target = calculatedKPIs[kpiName].target;
            const { dataLabels, kpiFactors, dataKeys, kpiType, unit } = KPI_DEFINITIONS[kpiName];
            const data1 = dataKeys.length > 0 && dataLabels[0] !== undefined ? createDataString(dataLabels[0], getKpiValue(calculatedKPIs, endpointData, dataKeys[0])) : 0;
            const data2 = dataKeys.length > 1 && dataLabels[1] !== undefined ? createDataString(dataLabels[1], getKpiValue(calculatedKPIs, endpointData, dataKeys[1])) : 0;
            const data3 = dataKeys.length > 2 && dataLabels[2] !== undefined ? createDataString(dataLabels[2], getKpiValue(calculatedKPIs, endpointData, dataKeys[2])) : 0;
            return createKpiObject(name, current, redFlag, target, data1, data2, data3, unit, kpiType, kpiFactors);
        })

        // console.log("kpiObjects: ", kpiObjects);
        return kpiObjects;

    } catch (error) {
        console.error(error);
        return ("There was an error fetching the KPI data: ", error);
    }
}

export default fetchKpiData;