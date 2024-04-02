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
    // console.log(kpiList)
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
    } else if (dataKey === 'closersDcOffers') {
        let uniqueOffers = Math.round(calculatedKPIs["Closers Offer Rate"].current * endpointData.closersUniqueAttended / 100);
        // console.log(closersDCOffers)
        return uniqueOffers;
    } else if (dataKey === 'closersLeadsConnected') {
        return endpointData.allLeadConnections;
    } else if (dataKey === 'teamStlMedian') {
        return calculatedKPIs["Team STL Median"].current;
    } else if (dataKey === 'settersStlMedian') {
        return calculatedKPIs["Setters STL Median"].current;
    } else if (dataKey === 'closersStlMedian') {
        return calculatedKPIs["Closers STL Median"].current;
    } else if (dataKey === 'individualStlMedian') {
        return calculatedKPIs["Individual STL Median"].current;
    } else if (dataKey === 'setterStlMedian') {
        return calculatedKPIs["Setter STL Median"].current;
    } else if (dataKey === 'closerStlMedian') {
        return calculatedKPIs["Closer STL Median"].current;
    } else {
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
    } else if (view === "Team" && departments[0] === "Team") {
        requestedKpiList = kpiList['Team']
    } else if (view === "Team" && departments[0] === "Individual") {
        requestedKpiList = kpiList['Individual']
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

            const allLeadConnections = endpointData.closersLeadsConnected && Array.isArray(endpointData.closersLeadsConnected) && endpointData.closersLeadsConnected.reduce((acc, curr) => {
                const adminObj = curr && curr["admin_json"] ? JSON.parse(curr["admin_json"]) : {};
                if (adminObj.hasOwnProperty("first_connection")) {
                    return acc += 1;
                } else {
                    return acc;
                }
            }, 0);

            // console.log(allLeadConnections)

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
            endpointData.allLeadConnections = allLeadConnections && allLeadConnections;
        } else if (view === 'Team') {
            if (departments[0] === "Team") {
                const teamStlMedian = endpointData.teamKpis && Array.isArray(endpointData.teamKpis) ? endpointData.teamKpis.reduce((acc, curr) => {
                    try {
                        const adminObj = curr && curr["admin_json"] ? JSON.parse(curr["admin_json"]) : {};

                        let lead_created_on = adminObj?.lead_created_ts ? new Date(adminObj.lead_created_ts) : null;
                        let finalSetterOutboundCall = adminObj?.speed_to_lead?.final_setter_first_outbound_call?.created_on ? new Date(adminObj.speed_to_lead.final_setter_first_outbound_call.created_on) : null;

                        if (lead_created_on && finalSetterOutboundCall) {
                            // Calculate the difference in seconds for each lead in the array and push it to the acc array
                            acc.push((finalSetterOutboundCall.getTime() - lead_created_on.getTime()) / 1000);
                        }
                    } catch (e) {
                        console.error("Error parsing JSON:", e);
                    }
                    return acc;
                }, []) : [];
                // console.log(teamStlMedian)
                const settersStlMedian = endpointData.teamKpis && Array.isArray(endpointData.teamKpis) ? endpointData.teamKpis.reduce((acc, curr) => {
                    try {
                        const adminObj = curr && curr["admin_json"] ? JSON.parse(curr["admin_json"]) : {};
                        let lead_created_on = adminObj?.lead_created_ts ? new Date(adminObj.lead_created_ts) : null;
                        let setters = adminObj?.setters || {};
                        let allSetterOutboundCalls = [];

                        for (let i = 0; i < setters.length; i++) {
                            let setter = setters[i];
                            let setterOutboundCall = setter.first_outbound_call && setter.first_outbound_call.created_on ? new Date(setter.first_outbound_call.created_on) : null;
                            if (setterOutboundCall) {
                                allSetterOutboundCalls.push(setterOutboundCall.getTime()); // Store timestamps instead of Date objects
                            }
                        }

                        if (allSetterOutboundCalls.length > 0) {
                            let fastestSetterOutboundCall = new Date(Math.min(...allSetterOutboundCalls)); // Convert the smallest timestamp back to a Date object
                            // Ensure lead_created_on is a valid Date object before calculating difference
                            if (lead_created_on) {
                                // Calculate the difference in seconds and push it to the accumulator array
                                acc.push((fastestSetterOutboundCall.getTime() - lead_created_on.getTime()) / 1000);
                            }
                        }
                    } catch (e) {
                        console.error("Error parsing JSON:", e);
                    }
                    return acc; // Make sure to return the accumulator
                }, []) : [];
                // console.log(settersStlMedian)
                const closersStlMedian = endpointData.teamKpis && Array.isArray(endpointData.teamKpis) ? endpointData.teamKpis.reduce((acc, curr) => {
                    try {
                        const adminObj = curr && curr["admin_json"] ? JSON.parse(curr["admin_json"]) : {};
                        let selfSet = adminObj?.discovery_call_booking && adminObj?.discovery_call_booking?.self_set && adminObj.discovery_call_booking.self_set
                        let dcBookingCreatedOn = adminObj?.discovery_call_booking && adminObj?.discovery_call_booking?.created_on ? new Date(adminObj.discovery_call_booking.created_on) : null;

                        let firstOutboundCloserCall = adminObj?.discovery_call_booking && adminObj?.discovery_call_booking?.closer_assigned && adminObj?.discovery_call_booking?.closer_assigned?.first_outbound_call && adminObj?.discovery_call_booking?.closer_assigned?.first_outbound_call?.created_on ? new Date(adminObj.discovery_call_booking.closer_assigned.first_outbound_call.created_on) : null;

                        if (selfSet) {
                            acc.push(1); // Push a placeholder value of 1 second for self-set leads
                        } else if (dcBookingCreatedOn && firstOutboundCloserCall) {
                            // Calculate the difference in seconds for each lead in the array and push it to the acc array
                            acc.push((firstOutboundCloserCall.getTime() - dcBookingCreatedOn.getTime()) / 1000);
                        }

                    } catch (e) {
                        console.error("Error parsing JSON:", e);
                    }
                    return acc;
                }, []) : [];
                // console.log(closersStlMedian)
                const teamEffort = endpointData.teamKpis && Array.isArray(endpointData.teamKpis) ? endpointData.teamKpis.reduce((acc, curr) => {
                    // How many leads all active setters attempted to contact during the date range
                    try {
                        const adminObj = curr && curr["admin_json"] ? JSON.parse(curr["admin_json"]) : {};
                        let setters = adminObj?.setters || {};

                        for (let i = 0; i < setters.length; i++) {

                            let setter = setters[i];
                            let setterOutboundCall = setter.first_outbound_call && setter.first_outbound_call.created_on ? 1 : 0;

                            if (setterOutboundCall) {
                                acc += setterOutboundCall;
                            }
                        }
                    } catch (e) {
                        console.error("Error parsing JSON:", e);
                    }
                    return acc;
                }, 0) : 0;
                // console.log(teamEffort)

                endpointData.teamStlMedian = teamStlMedian;
                endpointData.settersStlMedian = settersStlMedian;
                endpointData.closersStlMedian = closersStlMedian;
                endpointData.teamEffort = teamEffort;

            } else if (departments[0] === "Individual") {

                const individualStlMedian = endpointData.teamKpis && Array.isArray(endpointData.teamKpis) ? endpointData.teamKpis.reduce((acc, curr) => {
                    // The time it takes for the selected setter to contact a lead for the first time
                    try {
                        const adminObj = curr && curr["admin_json"] ? JSON.parse(curr["admin_json"]) : {};

                        let lead_created_on = adminObj?.lead_created_ts ? new Date(adminObj.lead_created_ts) : null;
                        let setters = adminObj?.setters || {};

                        for (let i = 0; i < setters.length; i++) {
                            let setterItemId = Number(setters[i].item_id);
                            if (teamMember[0] === setterItemId) {
                                let setterOutboundCall = setters[i].first_outbound_call && setters[i].first_outbound_call.created_on ? new Date(setters[i].first_outbound_call.created_on) : null;
                                if (lead_created_on && setterOutboundCall) {
                                    acc.push((setterOutboundCall.getTime() - lead_created_on.getTime()) / 1000);
                                }
                            }
                        }
                    } catch (e) {
                        console.error("Error parsing JSON:", e);
                    }
                    return acc;
                }, []) : [];

                const setterStlMedian = endpointData.teamKpis && Array.isArray(endpointData.teamKpis) ? endpointData.teamKpis.reduce((acc, curr) => {
                    // Time between when the lead is created and a Setter Call is submitted for the lead by the selected setter
                    try {
                        const adminObj = curr && curr["admin_json"] ? JSON.parse(curr["admin_json"]) : {};
                        // console.log(adminObj)
                        let lead_created_on = adminObj?.lead_created_ts ? new Date(adminObj.lead_created_ts) : null;
                        // console.log(lead_created_on)

                        // if setter_call.created_on is not null, then a setter call was submitted
                        let setterCall = adminObj.setter_call && adminObj.setter_call.created_on ? new Date(adminObj.setter_call.created_on) : null;
                        // console.log(setterCall)

                        if (setterCall) {
                            // if there is a setter_call, check if the setter_responsible is the same as the selected setter
                            let setterResponsible = Number(adminObj.setter_call?.setter_responsible?.item_id);
                            // console.log(setterResponsible)

                            if (teamMember[0] === setterResponsible) {
                                if (lead_created_on) {
                                    acc.push((setterCall.getTime() - lead_created_on.getTime()) / 1000);
                                }
                            }

                        }
                    } catch (e) {
                        console.error("Error parsing JSON:", e);
                    }
                    return acc;

                }, []) : [];

                const closerStlMedian = endpointData.teamKpis && Array.isArray(endpointData.teamKpis) ? endpointData.teamKpis.reduce((acc, curr) => {
                    // The time between when the lead books a call and the assigned closer calls the lead
                    // Only applicable if the setter and closer are not the same person
                    try {
                        const adminObj = curr && curr["admin_json"] ? JSON.parse(curr["admin_json"]) : {};

                        let selfSet = adminObj?.discovery_call_booking?.self_set && adminObj.discovery_call_booking.self_set                    
                        let dcBookingCreatedOn = adminObj?.discovery_call_booking?.created_on ? new Date(adminObj.discovery_call_booking.created_on) : null;                       
                        let closerAssigned = adminObj?.discovery_call_booking?.closer_assigned?.item_id ? Number(adminObj.discovery_call_booking.closer_assigned.item_id) : null;                        
                        let firstOutboundCloserCall = adminObj?.discovery_call_booking?.closer_assigned?.first_outbound_call && adminObj?.discovery_call_booking?.closer_assigned?.first_outbound_call?.created_on && new Date(adminObj.discovery_call_booking.closer_assigned.first_outbound_call.created_on);
                       
                        if (dcBookingCreatedOn && selfSet !== true && closerAssigned === teamMember[0] && firstOutboundCloserCall) {
                            // if there is a dc booking and it isn't a self-set booking and the closer assigned is the selected closer and there is a first outbound call from the closer
                            acc.push((firstOutboundCloserCall.getTime() - dcBookingCreatedOn.getTime()) / 1000);
                        } else if (dcBookingCreatedOn && selfSet === true && closerAssigned === teamMember[0]) {
                            // if there is a dc booking and it is a self-set booking and the closer assigned is the selected closer
                            acc.push(1);
                        }

                    } catch (e) {
                        console.error("Error parsing JSON:", e);
                    }
                    return acc;
                }, []) : [];

                const individualEffort = endpointData.teamKpis && Array.isArray(endpointData.teamKpis) ? endpointData.teamKpis.reduce((acc, curr) => {
                    // How many leads the selected setter attempted to contact during the date range
                    try {
                        const adminObj = curr && curr["admin_json"] ? JSON.parse(curr["admin_json"]) : {};
                        let setters = adminObj?.setters || {};

                        for (let i = 0; i < setters.length; i++) {
                            let setter = setters[i];
                            let setterOutboundCall = setter.first_outbound_call && setter.first_outbound_call.created_on ? 1 : 0;

                            if (setterOutboundCall && Number(setter.item_id) === teamMember[0]) {
                                acc += setterOutboundCall;
                            }
                        }
                    } catch (e) {
                        console.error("Error parsing JSON:", e);
                    }
                    return acc;
                }, 0) : 0;

                endpointData.individualStlMedian = individualStlMedian;
                endpointData.setterStlMedian = setterStlMedian;
                endpointData.closerStlMedian = closerStlMedian;
                endpointData.individualEffort = individualEffort;
            }

        }

        const calculatedKPIs = calculateKPIs(startDate, endDate, endpointData, requestedKpiList);

        // console.log(calculatedKPIs)

        // Helper function for creating KPI objects
        const kpiObjects = requestedKpiList.map((kpiName) => {
            // console.log(kpiName && KPI_DEFINITIONS[kpiName])
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