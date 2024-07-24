import fetchKPIs from "./api-utils";
import KPI_DEFINITIONS from "./kpi-definitions";
import kpiToEndpointMapping from "./kpiToEndpointMapping";
import apiEndpoints from "./apiEndpoints";
import { calculateDelayedStart, calculateNormalStart, convertTimestamp, outsideBusinessHours } from "./date-utils";

import {
    calculateTeamKpiTables,
    calculateIndividualKpiTables,
    calculateClosersAcquisitionTables
} from './closers-team-kpis-tables';

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

                const firstConnection = adminObj["first_connection"] ? true : false;

                if (firstConnection) {
                    return acc += 1;
                } else {
                    return acc;
                }
            }, 0);

            console.log(allLeadConnections)

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

            // filter out leads that don't have a phone number
            endpointData.teamKpis = endpointData.teamKpis && Array.isArray(endpointData.teamKpis) ? endpointData.teamKpis.filter(lead => lead.contact_phones) : [];

            if (departments[0] === "Team") {

                const teamStlMedian = endpointData.teamKpis && Array.isArray(endpointData.teamKpis) ? endpointData.teamKpis.reduce((acc, curr) => {
                    try {
                        const adminObj = curr && curr["admin_json"] ? JSON.parse(curr["admin_json"]) : {};

                        let lead_created_on = adminObj?.lead_created_ts ? convertTimestamp(adminObj.lead_created_ts, 'Pacific/Honolulu', 'America/New_York') : null;
                        let finalSetterOutboundCall = adminObj?.speed_to_lead?.final_setter_first_outbound_call?.created_on ? convertTimestamp(adminObj.speed_to_lead.final_setter_first_outbound_call.created_on, 'Pacific/Honolulu', 'America/New_York') : null;

                        if (lead_created_on && finalSetterOutboundCall) {
                            // Calculate the difference in seconds for each lead in the array and push it to the acc array
                            const diffInSeconds = calculateDelayedStart(lead_created_on, finalSetterOutboundCall, "America/New_York");
                            acc.push(diffInSeconds);
                        }
                    } catch (e) {
                        console.error("Error parsing JSON:", e);
                    }
                    return acc;
                }, []) : [];

                // console.log(teamStlMedian)

                const settersStlMedian = endpointData.teamKpis && Array.isArray(endpointData.teamKpis) ? endpointData.teamKpis.reduce((acc, curr) => {
                    // The time between when the lead is created and a Setter Call is submitted for the lead
                    try {
                        const adminObj = curr && curr["admin_json"] ? JSON.parse(curr["admin_json"]) : {};
                        // console.log(adminObj)

                        let lead_created_on = adminObj?.lead_created_ts ? convertTimestamp(adminObj.lead_created_ts, 'Pacific/Honolulu', 'America/New_York') : null;
                        let setterCall = adminObj?.setter_call && adminObj?.setter_call?.created_on ? convertTimestamp(adminObj.setter_call.created_on, 'Pacific/Honolulu', 'America/New_York') : null;

                        // console.log(setterCall)

                        if (lead_created_on && setterCall) {
                            // Calculate the difference in seconds for each lead in the array and push it to the acc array
                            const diffInSeconds = calculateDelayedStart(lead_created_on, setterCall, "America/New_York");
                            acc.push(diffInSeconds);
                        }

                    } catch (e) {
                        console.error("Error parsing JSON:", e);
                    }
                    return acc; // Make sure to return the accumulator
                }, []) : [];

                // console.log(settersStlMedian)

                const closersStlMedian = Array.isArray(endpointData.teamKpis) ? endpointData.teamKpis.reduce((acc, curr) => {
                    try {
                        const adminObj = curr?.admin_json ? JSON.parse(curr.admin_json) : null;

                        // Early return if adminObj is null or if the lead is self-set
                        if (!adminObj || adminObj?.discovery_call_booking?.self_set) {
                            return acc;
                        }

                        const dcBooking = adminObj.discovery_call_booking;
                        const dcBookingCreatedOn = dcBooking?.created_on ? convertTimestamp(dcBooking.created_on, 'Pacific/Honolulu', 'America/New_York') : null;
                        const firstOutboundCloserCall = dcBooking?.closer_assigned?.first_outbound_call?.created_on ? convertTimestamp(dcBooking.closer_assigned.first_outbound_call.created_on, 'Pacific/Honolulu', 'America/New_York') : null;
                        // Proceed only if both dates are valid
                        if (dcBookingCreatedOn && firstOutboundCloserCall) {
                            // Calculate the difference in seconds and add to the accumulator
                            const diffInSeconds = calculateDelayedStart(dcBookingCreatedOn, firstOutboundCloserCall, "America/New_York");
                            acc.push(diffInSeconds);
                        }
                    } catch (e) {
                        console.error("Error parsing JSON:", e);
                    }
                    return acc;
                }, []) : [];

                // console.log(closersStlMedian)

                const teamEffort = Array.isArray(endpointData.teamKpis) ? endpointData.teamKpis.reduce((acc, curr) => {
                    // How many leads all active setters attempted to contact during the date range
                    try {
                        const adminObj = curr?.admin_json ? JSON.parse(curr.admin_json) : {};

                        // Checking if every setter has attempted contact
                        const allSettersCalled = adminObj.setters && adminObj.setters.every(setter => setter.first_outbound_call && setter.first_outbound_call.created_on);

                        if (allSettersCalled) {
                            acc += 1;
                        }
                    } catch (e) {
                        console.error("Error parsing JSON:", e);
                    }
                    return acc;
                }, 0) : 0;

                // console.log(teamEffort)

                const noSetterCallLeads = endpointData.teamKpis && Array.isArray(endpointData.teamKpis) ? endpointData.teamKpis.reduce((acc, curr) => {
                    try {
                        const adminObj = curr && curr["admin_json"] ? JSON.parse(curr["admin_json"]) : {};

                        if (adminObj.setter_call?.created_on) {
                            // skip the lead if a Setter Call has already happened
                            return acc;
                        } else {
                            acc += 1;
                        }
                    } catch (e) {
                        console.error("Error parsing JSON:", e);
                    }
                    return acc;
                }, 0) : 0;

                endpointData.teamStlMedian = teamStlMedian;
                endpointData.settersStlMedian = settersStlMedian;
                endpointData.closersStlMedian = closersStlMedian;
                endpointData.teamEffort = Math.floor(teamEffort);
                endpointData.noSetterCallLeads = noSetterCallLeads;

            } else if (departments[0] === "Individual") {


                const selectedTeamMemberId = teamMember[0];

                const individualStlMedian = Array.isArray(endpointData.teamKpis) ? endpointData.teamKpis.reduce((acc, curr) => {
                    try {
                        const adminObj = curr && curr["admin_json"] ? JSON.parse(curr["admin_json"]) : null;
                        if (!adminObj || !adminObj.lead_created_ts) return acc; // Skip if no adminObj or lead_created_ts

                        // Convert lead_created_ts directly to ISO string
                        let leadCreatedOn = adminObj.lead_created_ts ? convertTimestamp(adminObj.lead_created_ts, 'Pacific/Honolulu', 'America/New_York') : null;


                        // Ensure setters is treated as an array
                        let setters = Array.isArray(adminObj.setters) ? adminObj.setters : [];

                        setters.forEach(setter => {
                            let setterItemId = Number(setter.item_id);
                            if (selectedTeamMemberId === setterItemId && setter.first_outbound_call && setter.first_outbound_call.created_on) {
                                let setterOutboundCall = convertTimestamp(setter.first_outbound_call.created_on, 'Pacific/Honolulu', 'America/New_York');
                                let diffInSeconds = calculateDelayedStart(leadCreatedOn, setterOutboundCall, 'America/New_York');
                                acc.push(diffInSeconds);
                            }
                        });
                    } catch (e) {
                        console.error("Error parsing JSON:", e);
                    }
                    return acc;
                }, []) : [];

                // console.log(individualStlMedian)

                const stlUnder10 = endpointData.teamKpis && Array.isArray(endpointData.teamKpis) ? endpointData.teamKpis.reduce((acc, curr) => {
                    // the number of leads where the selected setter has a speed to lead under 10 minutes
                    try {
                        const adminObj = curr && curr["admin_json"] ? JSON.parse(curr["admin_json"]) : {};
                        if (!adminObj || !adminObj.lead_created_ts) return acc;

                        const leadCreatedOn = adminObj.lead_created_ts ? convertTimestamp(adminObj.lead_created_ts, 'Pacific/Honolulu', 'America/New_York') : null;
                        let setters = Array.isArray(adminObj.setters) ? adminObj.setters : [];

                        setters.forEach(setter => {
                            let setterItemId = Number(setter.item_id);
                            if (selectedTeamMemberId === setterItemId && setter.first_outbound_call && setter.first_outbound_call.created_on) {
                                let setterOutboundCall = convertTimestamp(setter.first_outbound_call.created_on, 'Pacific/Honolulu', 'America/New_York');
                                let diffInSeconds = calculateDelayedStart(leadCreatedOn, setterOutboundCall, 'America/New_York');
                                if (diffInSeconds < 600) {
                                    acc += 1;
                                }
                            }
                        });
                    } catch (e) {
                        console.error("Error parsing JSON:", e);
                    }
                    return acc;
                }, 0) : 0;

                // console.log(stlUnder10)

                const stl10to30 = endpointData.teamKpis && Array.isArray(endpointData.teamKpis) ? endpointData.teamKpis.reduce((acc, curr) => {
                    // the number of leads where the selected setter has a speed to lead between 10 and 30 minutes
                    try {
                        const adminObj = curr && curr["admin_json"] ? JSON.parse(curr["admin_json"]) : {};
                        if (!adminObj || !adminObj.lead_created_ts) return acc;

                        const leadCreatedOn = adminObj.lead_created_ts ? convertTimestamp(adminObj.lead_created_ts, 'Pacific/Honolulu', 'America/New_York') : null;
                        let setters = Array.isArray(adminObj.setters) ? adminObj.setters : [];

                        setters.forEach(setter => {
                            let setterItemId = Number(setter.item_id);
                            if (selectedTeamMemberId === setterItemId && setter.first_outbound_call && setter.first_outbound_call.created_on) {
                                let setterOutboundCall = convertTimestamp(setter.first_outbound_call.created_on, 'Pacific/Honolulu', 'America/New_York');
                                let diffInSeconds = calculateDelayedStart(leadCreatedOn, setterOutboundCall, 'America/New_York');
                                if (diffInSeconds >= 600 && diffInSeconds <= 1800) {
                                    acc += 1;
                                }
                            }
                        });
                    } catch (e) {
                        console.error("Error parsing JSON:", e);
                    }
                    return acc;
                }, 0) : 0;

                // console.log(stl10to30)

                const outsideBHStl = endpointData.teamKpis && Array.isArray(endpointData.teamKpis) ? endpointData.teamKpis.reduce((acc, curr) => {
                    // the number of leads where the selected setter has a speed to lead outside of business hours
                    try {
                        const adminObj = curr && curr["admin_json"] ? JSON.parse(curr["admin_json"]) : {};
                        
                        if (!adminObj || !adminObj.lead_created_ts) return acc;
                        // console.log(adminObj)
                        const leadCreatedOn = adminObj.lead_created_ts ? convertTimestamp(adminObj.lead_created_ts, 'Pacific/Honolulu', 'America/New_York') : null;
                        let outsideBH = outsideBusinessHours(leadCreatedOn, 'America/New_York');

                        // console.log(outsideBH)

                        if (!outsideBH) return acc; // Skip if the lead was created during business hours

                        let setters = Array.isArray(adminObj.setters) ? adminObj.setters : [];

                        setters.forEach(setter => {
                            let setterItemId = Number(setter.item_id);
                            if (selectedTeamMemberId === setterItemId && setter.first_outbound_call && setter.first_outbound_call.created_on) {
                                let setterOutboundCall = convertTimestamp(setter.first_outbound_call.created_on, 'Pacific/Honolulu', 'America/New_York');
                                let diffInSeconds = calculateNormalStart(leadCreatedOn, setterOutboundCall, 'America/New_York');
                                
                                if (diffInSeconds < 1800) {
                                    acc += 1;
                                }
                            }
                        });
                    } catch (e) {
                        console.error("Error parsing JSON:", e);
                    }
                    return acc;
                }, 0) : 0;

                // console.log(outsideBHStl)

                const firstSetterBonus = endpointData.teamKpis && Array.isArray(endpointData.teamKpis) ? endpointData.teamKpis.reduce((acc, curr) => {
                    // the number of leads where the selected setter was the first setter to contact the lead
                    try {
                        const adminObj = curr && curr["admin_json"] ? JSON.parse(curr["admin_json"]) : {};
                        if (!adminObj || !adminObj.lead_created_ts || !adminObj.setters) return acc;
                        if (Number(adminObj.speed_to_lead?.first_outbound_call?.call_owner?.item_id) === selectedTeamMemberId) {
                            acc += 1;
                        }

                    } catch (e) {
                        console.error("Error parsing JSON:", e);
                    }
                    return acc;
                }, 0) : 0;

                // console.log(firstSetterBonus)

                const setterStlMedian = endpointData.teamKpis && Array.isArray(endpointData.teamKpis) ? endpointData.teamKpis.reduce((acc, curr) => {
                    // The median time between when the lead is created and a Setter Call is submitted for the lead by the selected setter
                    try {
                        const adminObj = curr?.admin_json ? JSON.parse(curr.admin_json) : null;
                        if (!adminObj) return acc; // Skip current iteration if adminObj is null or parsing failed
                        // console.log(adminObj)

                        const leadCreatedOn = adminObj.lead_created_ts ? convertTimestamp(adminObj.lead_created_ts, 'Pacific/Honolulu', 'America/New_York') : null;
                        const setterCall = adminObj.setter_call?.created_on ? convertTimestamp(adminObj.setter_call.created_on, 'Pacific/Honolulu', 'America/New_York') : null;
                        const setterResponsible = Number(adminObj.setter_call?.setter_responsible?.item_id);

                        // console.log(leadCreatedOn, setterCall, setterResponsible, selectedTeamMemberId)

                        // Skip if essential data is missing or if the setterResponsible is not the selected setter
                        if (leadCreatedOn && setterCall && setterResponsible === selectedTeamMemberId) {
                            let diffInSeconds = calculateDelayedStart(leadCreatedOn, setterCall, 'America/New_York');
                            acc.push(diffInSeconds);
                        }

                    } catch (e) {
                        console.error("Error parsing JSON:", e);
                    }
                    return acc;

                }, []) : [];

                // console.log(setterStlMedian)

                const closerStlMedian = endpointData.teamKpis && Array.isArray(endpointData.teamKpis) ? endpointData.teamKpis.reduce((acc, curr) => {
                    // The time between when the lead books a call and the assigned closer calls the lead
                    // Only applicable if the setter and closer are not the same person
                    try {
                        const adminObj = curr?.admin_json ? JSON.parse(curr.admin_json) : null;
                        if (!adminObj) return acc; // Continue with the next iteration if adminObj is null or undefined

                        const dcBooking = adminObj.discovery_call_booking;
                        const dcBookingCreatedOn = dcBooking?.created_on ? convertTimestamp(dcBooking.created_on, 'Pacific/Honolulu', 'America/New_York') : null;
                        const selfSet = dcBooking?.self_set;
                        const closerAssignedId = Number(dcBooking?.closer_assigned?.item_id);
                        const firstOutboundCloserCallCreatedOn = dcBooking?.closer_assigned?.first_outbound_call?.created_on ? convertTimestamp(dcBooking.closer_assigned.first_outbound_call.created_on, 'Pacific/Honolulu', 'America/New_York') : null;

                        // Check all conditions are met: dcBooking exists, it's not a self-set, the selected closer is assigned, and the first outbound call is made
                        if (dcBookingCreatedOn && !selfSet && closerAssignedId === selectedTeamMemberId && firstOutboundCloserCallCreatedOn) {
                            let diffInSeconds = calculateDelayedStart(dcBookingCreatedOn, firstOutboundCloserCallCreatedOn, 'America/New_York');
                            acc.push(diffInSeconds);
                        }

                    } catch (e) {
                        console.error("Error parsing JSON:", e);
                    }
                    return acc;
                }, []) : [];

                const individualEffort = endpointData.teamKpis && Array.isArray(endpointData.teamKpis) ? endpointData.teamKpis.reduce((acc, curr) => {
                    try {
                        const adminObj = curr && curr["admin_json"] ? JSON.parse(curr["admin_json"]) : {};
                        const setters = adminObj?.setters || [];

                        if (adminObj.setter_call?.created_on) {
                            // skip the lead if a Setter Call has already happened
                            return acc;
                        }

                        setters.forEach((setter) => {
                            // Check if the current setter in the loop is the selected setter based on item_id
                            if (Number(setter.item_id) === teamMember[0]) {
                                // Check if the setter has made an attempt to contact (i.e., first_outbound_call exists and has a created_on timestamp)
                                if (setter.first_outbound_call && setter.first_outbound_call.created_on) {
                                    acc += 1; // Increment the accumulator if the selected setter made an attempt to contact
                                }
                            }
                        });
                    } catch (e) {
                        console.error("Error parsing JSON:", e);
                    }
                    return acc;
                }, 0) : 0;

                const noSetterCallLeads = endpointData.teamKpis && Array.isArray(endpointData.teamKpis) ? endpointData.teamKpis.reduce((acc, curr) => {
                    try {
                        const adminObj = curr && curr["admin_json"] ? JSON.parse(curr["admin_json"]) : {};

                        // console.log(adminObj)

                        const selectedSetterExists = adminObj.setters && adminObj.setters.filter(setter => Number(setter.item_id) === teamMember[0]);

                        // console.log(selectedSetterExists)

                        if (adminObj.setter_call?.created_on || selectedSetterExists.length === 0) {
                            // skip the lead if a Setter Call has already happened
                            return acc;
                        } else {
                            acc += 1;
                        }
                    } catch (e) {
                        console.error("Error parsing JSON:", e);
                    }
                    return acc;
                }, 0) : 0;



                endpointData.individualStlMedian = individualStlMedian;
                endpointData.stlUnder10 = stlUnder10;
                endpointData.stl10to30 = stl10to30;
                endpointData.outsideBHStl = outsideBHStl;
                endpointData.firstSetterBonus = firstSetterBonus;
                endpointData.setterStlMedian = setterStlMedian;
                endpointData.closerStlMedian = closerStlMedian;
                endpointData.individualEffort = Math.floor(individualEffort);
                endpointData.noSetterCallLeads = noSetterCallLeads;
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