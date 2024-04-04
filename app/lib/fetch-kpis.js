import fetchKPIs from "./api-utils";
import KPI_DEFINITIONS from "./kpi-definitions";
import kpiToEndpointMapping from "./kpiToEndpointMapping";
import apiEndpoints from "./apiEndpoints";
import { calculateBusinessHoursDiff } from "./date-utils";
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

            // filter out leads that don't have a phone number
            endpointData.teamKpis = endpointData.teamKpis && Array.isArray(endpointData.teamKpis) ? endpointData.teamKpis.filter(lead => lead.contact_phones) : [];

            if (departments[0] === "Team") {
                
                const teamStlMedian = endpointData.teamKpis && Array.isArray(endpointData.teamKpis) ? endpointData.teamKpis.reduce((acc, curr) => {
                    try {
                        const adminObj = curr && curr["admin_json"] ? JSON.parse(curr["admin_json"]) : {};

                        let lead_created_on = adminObj?.lead_created_ts ? new Date(adminObj.lead_created_ts).toISOString() : null;
                        let finalSetterOutboundCall = adminObj?.speed_to_lead?.final_setter_first_outbound_call?.created_on ? new Date(adminObj.speed_to_lead.final_setter_first_outbound_call.created_on).toISOString() : null;

                        if (lead_created_on && finalSetterOutboundCall) {
                            // Calculate the difference in seconds for each lead in the array and push it to the acc array
                            const businessHoursDiff = calculateBusinessHoursDiff(lead_created_on, finalSetterOutboundCall, "America/New_York");
                            acc.push(businessHoursDiff);
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
                        console.log(adminObj)

                        let lead_created_on = adminObj?.lead_created_ts ? new Date(adminObj.lead_created_ts).toISOString() : null;
                        let setterCall = adminObj?.setter_call && adminObj?.setter_call?.created_on ? new Date(adminObj.setter_call.created_on).toISOString() : null;

                        // console.log(setterCall)

                        if (lead_created_on && setterCall) {
                            // Calculate the difference in seconds for each lead in the array and push it to the acc array
                            const businessHoursDiff = calculateBusinessHoursDiff(lead_created_on, setterCall, "America/New_York");
                            acc.push(businessHoursDiff);
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
                        const dcBookingCreatedOn = dcBooking?.created_on ? new Date(dcBooking.created_on).toISOString() : null;
                        const firstOutboundCloserCall = dcBooking?.closer_assigned?.first_outbound_call?.created_on ? new Date(dcBooking.closer_assigned.first_outbound_call.created_on).toISOString() : null;
                        // Proceed only if both dates are valid
                        if (dcBookingCreatedOn && firstOutboundCloserCall) {
                            // Calculate the difference in seconds and add to the accumulator
                            const businessHoursDiff = calculateBusinessHoursDiff(dcBookingCreatedOn, firstOutboundCloserCall, "America/New_York");
                            acc.push(businessHoursDiff);
                        }
                    } catch (e) {
                        console.error("Error parsing JSON:", e);
                    }
                    return acc;
                }, []) : [];

                // console.log(closersStlMedian)

                const teamEffort = Array.isArray(endpointData.teamKpis) ? endpointData.teamKpis.reduce((acc, curr) => {
                    try {
                        const adminObj = curr?.admin_json ? JSON.parse(curr.admin_json) : {};
                        const setters = adminObj?.setters || [];

                        // Count the number of setters who have made an outbound call for the current lead
                        let settersWhoCalled = setters.reduce((setterAcc, setter) => {
                            return setterAcc + (setter.first_outbound_call && setter.first_outbound_call.created_on ? 1 : 0);
                        }, 0);

                        // Calculate the fraction for the current lead and add it to the accumulator
                        if (setters.length > 0) { // Avoid division by zero
                            acc += settersWhoCalled / setters.length;
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
                        let lead_created_on = new Date(adminObj.lead_created_ts).toISOString();

                        // Ensure setters is treated as an array
                        let setters = Array.isArray(adminObj.setters) ? adminObj.setters : [];

                        setters.forEach(setter => {
                            let setterItemId = Number(setter.item_id);
                            if (selectedTeamMemberId === setterItemId && setter.first_outbound_call && setter.first_outbound_call.created_on) {
                                let setterOutboundCall = new Date(setter.first_outbound_call.created_on).toISOString();
                                let diffInSeconds = calculateBusinessHoursDiff(lead_created_on, setterOutboundCall, 'America/New_York');
                                acc.push(diffInSeconds);
                            }
                        });
                    } catch (e) {
                        console.error("Error parsing JSON:", e);
                    }
                    return acc;
                }, []) : [];

                // console.log(individualStlMedian)


                const setterStlMedian = endpointData.teamKpis && Array.isArray(endpointData.teamKpis) ? endpointData.teamKpis.reduce((acc, curr) => {
                    // The median time between when the lead is created and a Setter Call is submitted for the lead by the selected setter
                    try {
                        const adminObj = curr?.admin_json ? JSON.parse(curr.admin_json) : null;
                        if (!adminObj) return acc; // Skip current iteration if adminObj is null or parsing failed
                        // console.log(adminObj)

                        const leadCreatedOn = adminObj.lead_created_ts ? new Date(adminObj.lead_created_ts).toISOString() : null;
                        const setterCall = adminObj.setter_call?.created_on ? new Date(adminObj.setter_call.created_on).toISOString() : null;
                        const setterResponsible = Number(adminObj.setter_call?.setter_responsible?.item_id);

                        // console.log(leadCreatedOn, setterCall, setterResponsible, selectedTeamMemberId)

                        // Skip if essential data is missing or if the setterResponsible is not the selected setter
                        if (leadCreatedOn && setterCall && setterResponsible === selectedTeamMemberId) {
                            let diffInSeconds = calculateBusinessHoursDiff(leadCreatedOn, setterCall, 'America/New_York');
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
                        const dcBookingCreatedOn = dcBooking?.created_on ? new Date(dcBooking.created_on).toISOString() : null;
                        const selfSet = dcBooking?.self_set;
                        const closerAssignedId = Number(dcBooking?.closer_assigned?.item_id);
                        const firstOutboundCloserCallCreatedOn = dcBooking?.closer_assigned?.first_outbound_call?.created_on ? new Date(dcBooking.closer_assigned.first_outbound_call.created_on).toISOString() : null;

                        // Check all conditions are met: dcBooking exists, it's not a self-set, the selected closer is assigned, and the first outbound call is made
                        if (dcBookingCreatedOn && !selfSet && closerAssignedId === selectedTeamMemberId && firstOutboundCloserCallCreatedOn) {
                            let diffInSeconds = calculateBusinessHoursDiff(dcBookingCreatedOn, firstOutboundCloserCallCreatedOn, 'America/New_York');
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


                endpointData.individualStlMedian = individualStlMedian;
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