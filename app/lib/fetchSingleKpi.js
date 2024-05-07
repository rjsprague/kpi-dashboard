import kpiToEndpointMapping from './kpiToEndpointMapping';
import apiEndpoints from './apiEndpoints';
import { formatDate } from './date-utils';
import cookies from 'js-cookie';
import {
    calculateTeamKpiTables,
    calculateIndividualKpiTables,
    calculateClosersAcquisitionTables
} from './closers-team-kpis-tables';


export default async function fetchSingleKpi({ startDate, endDate, leadSource, kpiView, teamMembers, clientSpaceId, apiName, closers, setters, noSetter, selectedDepartment }) {

    // console.log(closers)
    // console.log(setters)
    // console.log(teamMembers)
    // console.log(apiName)

    const accessToken = cookies.get('token');
    const managementSpaceId = Number(process.env.NEXT_PUBLIC_MANAGEMENT_SPACEID);
    let teamMembersNum = teamMembers && teamMembers.map(Number);
    let closersNum = closers ? closers.map(Number) : [];
    let settersNum = setters ? setters.map(Number) : [];
    const apiEndpointsKeys = kpiToEndpointMapping[apiName];

    // console.log(apiEndpointsKeys)
    // console.log(startDate, endDate, leadSource, kpiView, teamMembers, clientSpaceId, apiName, closers, setters)

    if (!apiEndpointsKeys || apiEndpointsKeys.length < 1) {
        console.log(apiEndpointsKeys)
        throw new Error('Something wrong with the api name?');
    }

    let results = apiEndpointsKeys.reduce((acc, key) => {
        return {
            ...acc,
            [key]: [],
        };
    }, {});

    const apiEndpointsObj = apiEndpoints(startDate, endDate, leadSource, kpiView, teamMembersNum, closersNum, settersNum);
    // console.log(apiEndpointsObj.currentPassiveIncome)

    const getInitialData = async (requestObject) => {
        const response = await fetch(`${requestObject.url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                "spaceid": requestObject.name === "Closers Payments" || requestObject.name === "Closer Commission" || requestObject.name === "Setter Commission" || requestObject.name === "Current Passive Income" ? managementSpaceId : clientSpaceId,
                "filters": requestObject.filters,
                "offset": 0,
                "limit": 1,
            }),
        });

        if (!response.ok) {
            console.error(`Error fetching data from ${requestObject.url}: ${response.status} ${response.statusText}`);
            throw new Error(`Server responded with an error: ${response.statusText}`);
        }

        const data = await response.json();

        return data.total;
    };

    const fetchPage = async (requestObject, offset = 0) => {
        // console.log(requestObject)
        const response = await fetch(`${requestObject.url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                "spaceid": requestObject.name === "Closers Payments" || requestObject.name === "Closer Commission" || requestObject.name === "Setter Commission" || requestObject.name === "Current Passive Income" ? managementSpaceId : clientSpaceId,
                "filters": requestObject.filters,
                "offset": offset,
                "limit": 1000,
            }),
        });

        if (!response.ok) {
            console.error(`Error fetching data from ${requestObject.url}: ${response.status} ${response.statusText}`);
            throw new Error(`Server responded with an error: ${response.statusText}`);
        }

        const data = await response.json();
        let fetchedResults = data.data ? data.data : [];
        // console.log(fetchedResults)
        return fetchedResults;
    };

    const promises = apiEndpointsKeys.map(async apiEndpointKey => {
        let requestObject = apiEndpointsObj[apiEndpointKey];
        // console.log(requestObject)
        try {
            const total = await getInitialData(requestObject);
            const limit = 1000;
            const offsets = Array.from({ length: Math.ceil(total / limit) }, (_, i) => i * limit);

            const dataPromises = offsets.map(offset => fetchPage(requestObject, offset));
            const data = await Promise.all(dataPromises);

            return { [apiEndpointKey]: data.flat() };

        } catch (error) {
            console.error(error);
            throw new Error("Error fetching data. Please try again later.");
        }
    });

    const promiseResults = await Promise.all(promises);
    promiseResults.forEach(result => {
        const key = Object.keys(result)[0];
        results[key] = result[key];
    });


    for (let i = 0; i < apiEndpointsKeys.length; i++) {
        if (noSetter === false) {
            break;
        }
        if (noSetter === true && apiEndpointsKeys[i] === "closersBookings" || noSetter === true && apiEndpointsKeys[i] === "closersAppointments" || noSetter === true && apiEndpointsKeys[i] === "closersTotalAttended" || noSetter === true && apiEndpointsKeys[i] === "closersUniqueAttended" || noSetter === true && apiEndpointsKeys[i] === "closersDcOffers" || noSetter === true && apiEndpointsKeys[i] === "closersDcClosed") {
            // return the results where there is no "Setter Responsible" key
            results[apiEndpointsKeys[i]] = results[apiEndpointsKeys[i]].filter(result => !result["Setter Responsible"]);
        }
    }

    // console.log(results)

    if (apiName && apiName === 'Closers Offer Rate') {

        let requestObject = apiEndpointsObj.allPreviousDcOffers;

        const allPreviousDcOffers = await fetchPage(requestObject, 0);

        // De-duplicate the offers
        let deduplicatedAllDcOffers = allPreviousDcOffers.reduce((acc, curr) => {
            let lead = curr['Related Lead'] && curr['Related Lead'][0];
            // console.log(lead)
            if (lead && !acc.includes(lead)) {
                acc.push(lead);
            }
            return acc;
        }, []);

        let deduplicatedCurrentDcOffers = results.closersDcOffers.reduce((acc, curr) => {
            let lead = curr['Related Lead'] && curr['Related Lead'][0];
            if (lead && !acc.includes(lead)) {
                acc.push(lead);
            }
            return acc;
        }, []);

        let uniqueOffers = deduplicatedCurrentDcOffers.reduce((acc, curr) => {
            if (!deduplicatedAllDcOffers.includes(curr)) {
                acc.push(curr);
            }
            return acc;
        }, []);

        let uniqueOffersResults = [];

        for (let i = 0; i < uniqueOffers.length; i++) {
            let offer = uniqueOffers[i];
            uniqueOffersResults.push(results.closersDcOffers.find(result => result['Related Lead'] && result['Related Lead'][0] === offer));
        }

        results.closersDcOffers = uniqueOffersResults;
    }

    // filter "Seller Lead" and "Related Lead" from each of the objects in the results object
    let leadsArray = [];

    let resultsValues = Object.values(results).flat();
    // console.log(resultsValues)

    resultsValues.forEach(item => {
        if (item["Seller Lead"]) {
            leadsArray.push(item["Seller Lead"]);
        } else if (item["Related Lead"]) {
            leadsArray.push(item["Related Lead"]);
        } else if (item["Contact"]) {
            leadsArray.push(item["Contact"])
        }
    });


    // console.log(leadsArray)
    // query the leads endpoint for each of the leads in the leadsArray
    let leadsEndpoint;

    // console.log(clientSpaceId)
    // console.log(process.env.NEXT_PUBLIC_ACQUISITIONS_SPACEID)

    if (clientSpaceId == process.env.NEXT_PUBLIC_ACQUISITIONS_SPACEID) {
        leadsEndpoint = apiEndpointsObj["closersLeadsCreated"]
    } else {
        leadsEndpoint = apiEndpointsObj["leads"]
    }

    leadsEndpoint.filters = [{ type: "app", fieldName: "itemid", values: leadsArray.flat() }];
    const leads = await fetchPage(leadsEndpoint);
    // console.log(leads[0]["Followup Reminder: Specific Date"])
    // console.log(leads)

    let namesAddresses = {};
    leads.forEach(lead => {
        // console.log(lead["Followup Reminder: Specific Date"])
        namesAddresses[lead.itemid] = {
            "Name": lead["Contact Name"] ? lead["Contact Name"] : lead["Seller Contact Name"] ? lead["Seller Contact Name"]
                : lead["First"] && lead["Last"] ? lead["First"] + " " + lead["Last"]
                    : lead["First"] ? lead["First"]
                        : lead["Last"] ? lead["Last"]
                            : lead.Title ? lead.Title
                                : "No Name",
            "Address": lead["Property Address"] ? lead["Property Address"] : lead["*AS Address"] ? lead["*AS Address"] : "No address",
            "Status": lead["Lead Status"] ? lead["Lead Status"] : "No lead status",
            "Follow Up": lead['Followup Reminder: Specific Date'] ? lead['Followup Reminder: Specific Date']['start'] : "No followup date",
            seller_id: lead.itemid ? lead.itemid : lead.podio_item_id,
        }
    });

    // console.log(namesAddresses)
    // console.log(results)
    // console.log(kpiView)
    // if view is Team and closersSpaceId equals clientSpaceId
    if (kpiView === "Team" && clientSpaceId == process.env.NEXT_PUBLIC_ACQUISITIONS_SPACEID) {
        results.teamKpis = results.teamKpis && Array.isArray(results.teamKpis) ? results.teamKpis.filter(lead => lead.contact_phones) : [];
    }

    Object.keys(results).forEach(key => {
        results[key] = filterResults(results[key], key, namesAddresses, selectedDepartment, apiName, teamMembers);
    });
    // console.log(results)

    return results;
};

function filterResults(results, apiEndpointKey, namesAddresses, selectedDepartment, apiName, teamMembers) {

    // console.log(results)
    // console.log(apiEndpointKey)
    // console.log(namesAddresses)
    // console.log(selectedDepartment)
    // console.log(apiName)
    // console.log(teamMembers)
    let selectedTeamMemberId = teamMembers && teamMembers[0]

    try {
        if (apiEndpointKey === "marketingExpenses" || apiEndpointKey === "closersAdSpend") {
            return results.map((result) => {
                return {
                    "Week": result["Week Number"] ? parseInt(result["Week Number"], 10) : "No Week Number",
                    "Lead Source": result["Lead Source"] ? result["Lead Source"] : "No Lead Source",
                    "Amount": result["Amount"] ? result["Amount"] : "No Amount",
                    podio_item_id: result.itemid ? result.itemid : "No itemid",
                }
            })
        } else if (apiEndpointKey === "leads" || apiEndpointKey === "closersLeadsCreated" || apiEndpointKey === "closersQualifiedBookings") {
            return results.map((result) => {
                if (apiEndpointKey === "leads") {
                    return {
                        "Date": result["Lead Created On"]["start"] ? formatDate(result["Lead Created On"]["start"]) : result["Lead Created On"]["start"] ? formatDate(result["Lead Created On"]["start"]) : "Not a Lead",
                        "Name": result["Contact Name"] ? result["Contact Name"] : result["Seller Contact Name"] ? result["Seller Contact Name"]
                            : result["First"] && result["Last"] ? result["First"] + " " + result["Last"]
                                : result["First"] ? result["First"]
                                    : result["Last"] ? result["Last"]
                                        : result.Title ? result.Title
                                            : "No Name",
                        "Address": result["Property Address"] ? result["Property Address"] : result["*AS Address"] ? result["*AS Address"] : "No address",
                        "Status": result["Lead Status"] ? result["Lead Status"] : "No Status",
                        "Lead Source": result["Lead Source Item"] ? result["Lead Source Item"] : result["Related Lead Source Item"] ? result["Related Lead Source Item"] : "No Lead Source",
                        podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                        seller_id: result.itemid ? result.itemid : result.podio_item_id,
                    }
                } else {
                    return {
                        "Date": result["Lead Created On"]["start"] ? formatDate(result["Lead Created On"]["start"]) : result["Lead Created On"]["start"] ? formatDate(result["Lead Created On"]["start"]) : "Not a Lead",
                        "Name": result["Contact Name"] ? result["Contact Name"] : result["Seller Contact Name"] ? result["Seller Contact Name"]
                            : result["First"] && result["Last"] ? result["First"] + " " + result["Last"]
                                : result["First"] ? result["First"]
                                    : result["Last"] ? result["Last"]
                                        : result.Title ? result.Title
                                            : "No Name",
                        "Status": result["Lead Status"] ? result["Lead Status"] : "No Status",
                        "Pre-Qualification Status": result["Pre-Qualification Status"] ? result["Pre-Qualification Status"] : "No Status",
                        "Lead Source": result["Lead Source Item"] ? result["Lead Source Item"] : "No Lead Source",
                        podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                        seller_id: result.itemid ? result.itemid : result.podio_item_id,
                    }
                }
            })
        } else if (apiEndpointKey === "leadConnections") {
            return results.map((result) => {
                return {
                    "Date Connected": result["First lead connection"]["start"] ? formatDate(result["First lead connection"]["start"]) : "Not a Lead Connection",
                    "Name": result["Seller Contact Name"] ? result["Seller Contact Name"]
                        : result["First"] && result["Last"] ? result["First"] + " " + result["Last"]
                            : result["First"] ? result["First"]
                                : result["Last"] ? result["Last"]
                                    : result.Title ? result.Title
                                        : "No Name",
                    "Address": result["Property Address"] ? result["Property Address"] : result["*AS Address"] ? result["*AS Address"] : "No address",
                    "Status": result["Lead Status"] ? result["Lead Status"] : "No Status",
                    "Lead Source": result["Lead Source Item"] ? result["Lead Source Item"] : "No Lead Source",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                    seller_id: result.itemid ? result.itemid : result.podio_item_id,
                }
            })
        } else if (apiEndpointKey === "closersLeadsConnected" || apiEndpointKey === "closersLeadsTriaged") {
            const validTableRows = results.map(lead => calculateClosersAcquisitionTables(lead, apiEndpointKey, namesAddresses))
                .filter(tableRowData => tableRowData !== null);
            return validTableRows;
        } else if (apiEndpointKey === "triageCalls" || apiEndpointKey === "qualifiedTriageCalls" || apiEndpointKey === "triageApproval") {
            return results.map((result) => {
                return {
                    "Date SLS Submitted": result["SLS Created On"]["start"] ? formatDate(result["SLS Created On"]["start"]) : "Not an SLS",
                    "Name": result["Seller Contact Name"] ? result["Seller Contact Name"]
                        : result["First"] && result["Last"] ? result["First"] + " " + result["Last"]
                            : result["First"] ? result["First"]
                                : result["Last"] ? result["Last"]
                                    : result.Title ? result.Title
                                        : "No Name",
                    "Status": result["Q or UNQ"] && result["Qualified?"] ? result["Q or UNQ"] + " " + result["Qualified?"]
                        : result["Q or UNQ"] ? result["Q or UNQ"]
                            : "No Status",
                    "Address": result["Property Address"] ? result["Property Address"] : result["*AS Address"] ? result["*AS Address"] : "No address",
                    "Lead Manager": result["Lead Manager Responsible"] ? result["Lead Manager Responsible"] : "No Lead Manager",
                    "Lead Source": result["Lead Source"] ? result["Lead Source"] : "No Lead Source",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                    seller_id: result["Linked Lead"] ? result["Linked Lead"][0] : "No Seller ID",
                }
            })
        } else if (apiEndpointKey === "dealAnalysis") {
            return results.map((result) => {
                return {
                    "Date DA Submitted": result["Timestamp"] && result["Timestamp"]["start"] ? formatDate(result["Timestamp"]["start"]) : "Not an SLS",
                    "Name": namesAddresses && namesAddresses[result["Seller Lead"]] && namesAddresses[result["Seller Lead"]]["Name"] ? namesAddresses[result["Seller Lead"]]["Name"] : "Ask Ryan",
                    "Address": namesAddresses && namesAddresses[result["Seller Lead"]] && namesAddresses[result["Seller Lead"]]["Address"] ? namesAddresses[result["Seller Lead"]]["Address"] : "Ask Ryan",
                    "Status": result["--Current Seller Lead Status"] ? result["--Current Seller Lead Status"] : "No Status",
                    "Lead Source": result["Lead Source"] ? result["Lead Source"] : "No Lead Source",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                    seller_id: namesAddresses[result["Seller Lead"]] ? namesAddresses[result["Seller Lead"]].seller_id : "No Seller ID",
                }
            })
        } else if (apiEndpointKey === "perfectPresentations") {
            return results.map((result) => {
                return {
                    "Date AS Submitted": result["AS Created On"]["start"] ? formatDate(result["AS Created On"]["start"]) : "Not an SLS",
                    "Name": namesAddresses && namesAddresses[result["Related Lead"]] ? namesAddresses[result["Related Lead"]]["Name"] : "Ask Ryan",
                    "Address": result["*AS Address"] ? result["*AS Address"] : "No address",
                    "Result": result["**What was the result of this lead?**"] ? result["**What was the result of this lead?**"] : "No Result",
                    "Lead Source": result["Lead Source"] ? result["Lead Source"] : "No Lead Source",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                    seller_id: result["Related Lead"] ? result["Related Lead"][0] : "No Seller ID",
                }
            })
        } else if (apiEndpointKey === "lmStlMedian") {

            return results.map((result) => {
                return {
                    "Date": result["Timestamp"]["start"] ? formatDate(result["Timestamp"]["start"]) : "No Date",
                    "Name": namesAddresses && namesAddresses[result["Seller Lead"]] ? namesAddresses[result["Seller Lead"]]["Name"] : "Ask Ryan",
                    "Address": namesAddresses && namesAddresses[result["Seller Lead"]] ? namesAddresses[result["Seller Lead"]]["Address"] : "Ask Ryan",
                    "LM STL Median": result["Speed to Lead Adjusted"] ? (result["Speed to Lead Adjusted"] / 60) + " mins" : "No LM STL Median",
                    "Team Member": result["Team Member Responsible"] ? result["Team Member Responsible"] : "No Team Member",
                    "Lead Source": result["Lead Source"] ? result["Lead Source"] : "No Lead Source",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                    seller_id: namesAddresses[result["Seller Lead"]] ? namesAddresses[result["Seller Lead"]].seller_id : "No Seller ID",
                }
            })
        } else if (apiEndpointKey === "amStlMedian") {
            return results.map((result) => {
                return {
                    "Date": result["Timestamp"]["start"] ? formatDate(result["Timestamp"]["start"]) : "No Date",
                    "Name": namesAddresses && namesAddresses[result["Seller Lead"]] ? namesAddresses[result["Seller Lead"]]["Name"] : "Ask Ryan",
                    "Address": namesAddresses && namesAddresses[result["Seller Lead"]] ? namesAddresses[result["Seller Lead"]]["Address"] : "Ask Ryan",
                    "AM STL Median": result["Speed to Lead Adjusted"] ? (result["Speed to Lead Adjusted"] / 3600).toFixed(2) + " hours" : "No AM STL Median",
                    "Team Member": result["Team Member Responsible"] ? result["Team Member Responsible"] : "No Team Member",
                    "Lead Source": result["Lead Source"] ? result["Lead Source"] : "No Lead Source",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                    seller_id: namesAddresses[result["Seller Lead"]] ? namesAddresses[result["Seller Lead"]].seller_id : "No Seller ID",
                }
            })
        } else if (apiEndpointKey === "daStlMedian") {
            return results.map((result) => {
                return {
                    "Date": result["Timestamp"]["start"] ? formatDate(result["Timestamp"]["start"]) : "No Date",
                    "Name": namesAddresses && namesAddresses[result["Seller Lead"]] ? namesAddresses[result["Seller Lead"]]["Name"] : "Ask Ryan",
                    "Address": namesAddresses && namesAddresses[result["Seller Lead"]] ? namesAddresses[result["Seller Lead"]]["Address"] : "Ask Ryan",
                    "DA STL Median": result["Speed to Lead Adjusted"] ? (result["Speed to Lead Adjusted"] / 3600).toFixed(2) + " hours" : "No DA STL Median",
                    "Team Member": result["Team Member Responsible"] ? result["Team Member Responsible"] : "No Team Member",
                    "Lead Source": result["Lead Source"] ? result["Lead Source"] : "No Lead Source",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                    seller_id: namesAddresses[result["Seller Lead"]] ? namesAddresses[result["Seller Lead"]].seller_id : "No Seller ID",
                }
            })
        } else if (apiEndpointKey === "teamKpis") {
            if (selectedDepartment[0] === 'Team') {
                // console.log(selectedDepartment)
                // Map to transform leads to table row data, then filter out null values
                const validTableRows = results.map(lead => calculateTeamKpiTables(lead, apiName, lead.admin_json))
                    .filter(tableRowData => tableRowData !== null); // Remove null entries
                return validTableRows;
            } else {
                // console.log(selectedDepartment)
                // Assuming calculateIndividualKpiTables is correctly handling null values
                const validTableRows = results.map(lead => calculateIndividualKpiTables(lead, apiName, lead.admin_json, selectedTeamMemberId))
                    .filter(tableRowData => tableRowData !== null); // Filter here if necessary
                return validTableRows;
            }
        } else if (apiEndpointKey === "bigChecks") {
            return results.map((result) => {
                return {
                    "Date": result["Timestamp"]["start"] ? formatDate(result["Timestamp"]["start"]) : "No Date",
                    "Team Member": result["Team Member Responsible"] ? result["Team Member Responsible"] : "No Team Member",
                    //"Lead Source": result["Lead Source"] ? result["Lead Source"] : "No Lead Source",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                    seller_id: namesAddresses[result["Seller Lead"]] ? namesAddresses[result["Seller Lead"]].seller_id : "No Seller ID",
                }
            })
        } else if (apiEndpointKey === "contracts" || apiEndpointKey === "contractedProfit") {
            return results.map((result) => {
                return {
                    "Date Contracted": result["*Date Ratified"]["start"] ? formatDate(result["*Date Ratified"]["start"]) : "No Date",
                    "Name": namesAddresses && namesAddresses[result["Seller Lead"]] && namesAddresses[result["Seller Lead"]]["Name"] ? namesAddresses[result["Seller Lead"]]["Name"] : "Ask Ryan",
                    "Address": namesAddresses && namesAddresses[result["Seller Lead"]] && namesAddresses[result["Seller Lead"]]["Address"] ? namesAddresses[result["Seller Lead"]]["Address"] : "Ask Ryan",
                    "Expected Profit": result["Expected Profit Center"] ? result["Expected Profit Center"] : "No Profit Center",
                    "Lead Source": result["Lead Source"] ? result["Lead Source"] : "No Lead Source",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                    seller_id: namesAddresses[result["Seller Lead"]] ? namesAddresses[result["Seller Lead"]].seller_id : "No Seller ID",
                }
            })
        } else if (apiEndpointKey === "acquisitions") {
            return results.map((result) => {
                return {
                    "Date Acquired": result["Date Acquired"]["start"] ? formatDate(result["Date Acquired"]["start"]) : "No Date",
                    "Name": namesAddresses && namesAddresses[result["Seller Lead"]] && namesAddresses[result["Seller Lead"]]["Name"] ? namesAddresses[result["Seller Lead"]]["Name"] : "Ask Ryan",
                    "Address": namesAddresses && namesAddresses[result["Seller Lead"]] && namesAddresses[result["Seller Lead"]]["Address"] ? namesAddresses[result["Seller Lead"]]["Address"] : "Ask Ryan",
                    "Lead Source": result["Lead Source"] ? result["Lead Source"] : "No Lead Source",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                    seller_id: namesAddresses[result["Seller Lead"]] ? namesAddresses[result["Seller Lead"]].seller_id : "No Seller ID",
                }
            })
        } else if (apiEndpointKey === "pendingDeals") {
            const calcResults = results.reduce((acc, curr) => {
                if (!curr.hasOwnProperty("*Deal")) {
                    acc.push(curr)
                }
                return acc
            }, [])
            return calcResults.map((result) => {
                return {
                    "Date Acquired": result["Date Acquired"]["start"] ? formatDate(result["Date Acquired"]["start"]) : "No Date",
                    "Name": namesAddresses && namesAddresses[result["Seller Lead"]] && namesAddresses[result["Seller Lead"]]["Name"] ? namesAddresses[result["Seller Lead"]]["Name"] : "Ask Ryan",
                    "Address": namesAddresses && namesAddresses[result["Seller Lead"]] && namesAddresses[result["Seller Lead"]]["Address"] ? namesAddresses[result["Seller Lead"]]["Address"] : "Ask Ryan",
                    "Projected Profit": result["Expected Profit Center"] ? result["Expected Profit Center"] : "No Projected Profit",
                    "Lead Source": result["Lead Source"] ? result["Lead Source"] : "No Lead Source",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                    seller_id: namesAddresses[result["Seller Lead"]] ? namesAddresses[result["Seller Lead"]].seller_id : "No Seller ID",
                }
            })
        } else if (apiEndpointKey === "deals") {
            return results.map((result) => {
                return {
                    "Date Deal Sold": result["Closing (Sell)"]["start"] ? formatDate(result["Closing (Sell)"]["start"]) : "No Date",
                    "Name": namesAddresses && namesAddresses[result["Seller Lead"]] && namesAddresses[result["Seller Lead"]]["Name"] ? namesAddresses[result["Seller Lead"]]["Name"] : "Ask Ryan",
                    "Address": namesAddresses && namesAddresses[result["Seller Lead"]] && namesAddresses[result["Seller Lead"]]["Address"] ? namesAddresses[result["Seller Lead"]]["Address"] : "Ask Ryan",
                    "Lead Source": result["Lead Source"] ? result["Lead Source"] : "No Lead Source",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                    seller_id: namesAddresses[result["Seller Lead"]] ? namesAddresses[result["Seller Lead"]].seller_id : "No Seller ID",
                }
            })
        } else if (apiEndpointKey === "profit") {
            return results.map((result) => {
                return {
                    "Date Deal Sold": result["Closing (Sell)"]["start"] ? formatDate(result["Closing (Sell)"]["start"]) : "No Date",
                    "Name": namesAddresses && namesAddresses[result["Seller Lead"]] && namesAddresses[result["Seller Lead"]]["Name"] ? namesAddresses[result["Seller Lead"]]["Name"] : "Ask Ryan",
                    "Address": namesAddresses && namesAddresses[result["Seller Lead"]] && namesAddresses[result["Seller Lead"]]["Address"] ? namesAddresses[result["Seller Lead"]]["Address"] : "Ask Ryan",
                    "Amount of Profit": result["Net Profit Center"] ? result["Net Profit Center"] : "No Profit",
                    "Lead Source": result["Lead Source"] ? result["Lead Source"] : "No Lead Source",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                    seller_id: namesAddresses[result["Seller Lead"]] ? namesAddresses[result["Seller Lead"]].seller_id : "No Seller ID",
                }
            })
        } else if (apiEndpointKey === "projectedProfit") {
            const calcResults = results.reduce((acc, curr) => {
                if (!curr.hasOwnProperty("*Deal")) {
                    acc.push(curr)
                }
                return acc
            }, [])
            return calcResults.map((result) => {
                return {
                    "Date Acquired": result["Date Acquired"]["start"] ? formatDate(result["Date Acquired"]["start"]) : "No Date",
                    "Name": namesAddresses && namesAddresses[result["Seller Lead"]] && namesAddresses[result["Seller Lead"]]["Name"] ? namesAddresses[result["Seller Lead"]]["Name"] : "Ask Ryan",
                    "Address": namesAddresses && namesAddresses[result["Seller Lead"]] && namesAddresses[result["Seller Lead"]]["Address"] ? namesAddresses[result["Seller Lead"]]["Address"] : "Ask Ryan",
                    "Projected Profit": result["Expected Profit Center"] ? result["Expected Profit Center"] : "No Projected Profit",
                    "Lead Source": result["Lead Source"] ? result["Lead Source"] : "No Lead Source",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                    seller_id: namesAddresses[result["Seller Lead"]] ? namesAddresses[result["Seller Lead"]].seller_id : "No Seller ID",
                }
            })
        } else if (apiEndpointKey === "closersPayments") {
            return results.map((result) => {
                return {
                    "Date": result["Date"]["start"] ? formatDate(result["Date"]["start"]) : "No date given",
                    "Client": result["Workspace Name"] ? result["Workspace Name"] : "Update in Podio",
                    "Closer": result["Closer Responsible"] ? result["Closer Responsible"] : "Update in Podio",
                    "Cash Up Front": result["Cash Collected Up Front"] ? result["Cash Collected Up Front"] : "Update in Podio",
                    "Revenue Contracted": result["Contract Total"] ? result["Contract Total"] : "Update in Podio",
                    podio_item_id: result.itemid ? result.itemid : podio_item_id,
                    seller_id: namesAddresses[result["Seller Lead"]] ? namesAddresses[result["Seller Lead"]].seller_id : "No Seller ID",
                }
            })
        } else if (apiEndpointKey === "closersUniqueAttended" || apiEndpointKey === "closersTotalAttended" || apiEndpointKey === "closersBookings" || apiEndpointKey === "closersAppointments") {
            // Unique Attended, Total Attended, Bookings and Appointments are pulled from the Lead Events app
            return results.map((result) => {
                return {
                    "Date": result["Date"]["start"] ? formatDate(result["Date"]["start"]) : "No Date",
                    "Name": namesAddresses && namesAddresses[result["Related Lead"]] ? namesAddresses[result["Related Lead"]]["Name"] : "No Name",
                    "Event": result["Event"] ? result["Event"] : "No event given",
                    "Event #": result["lead_event #"] ? result["lead_event #"] : "No event number given",
                    "Status": namesAddresses && namesAddresses[result["Related Lead"]] && namesAddresses[result["Related Lead"]]["Status"] ? namesAddresses[result["Related Lead"]]["Status"] : "No status given",
                    "Follow Up": namesAddresses && namesAddresses[result["Related Lead"]] && namesAddresses[result["Related Lead"]]["Follow Up"] ? namesAddresses[result["Related Lead"]]["Follow Up"] : "No follow up given",
                    "Setter": result["Setter Responsible"] ? result["Setter Responsible"] : "Not set",
                    "Closer": result["Closer Responsible"] ? result["Closer Responsible"] : "No closer responsible",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                    seller_id: namesAddresses[result["Related Lead"]] ? namesAddresses[result["Related Lead"]].seller_id : "No Seller ID",
                }
            })
        } else if (apiEndpointKey === "closersDcOffers" || apiEndpointKey === "closersDcClosed") {
            return results.map((result) => {
                return {
                    "Date Submitted": result["created_on"] && result["created_on"]["start"] ? formatDate(result["created_on"]["start"]) : "No date given",
                    "Name": namesAddresses && namesAddresses[result["Related Lead"]] ? namesAddresses[result["Related Lead"]]["Name"] : "No Name",
                    "Status": result["Status of the Call"] ? result["Status of the Call"] : "No Status",
                    "Lead Source": result["Related Lead Source Item"] ? result["Related Lead Source Item"] : "No lead source",
                    "Setter": result["Setter Responsible"] ? result["Setter Responsible"] : result["Team Member Responsible"] ? result["Team Member Responsible"] : "Not Set",
                    "Closer": result["Closer Responsible"] ? result["Closer Responsible"] : "Closer not given",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                    seller_id: namesAddresses[result["Related Lead"]] ? namesAddresses[result["Related Lead"]].seller_id : "No Seller ID",
                }
            })
        } else if (apiEndpointKey === "closersLeadsSetPrequalified") {
            return results.map((result) => {
                return {
                    "Date": result["created_on"] && result["created_on"]["start"] ? formatDate(result["created_on"]["start"]) : "No date given",
                    "Name": namesAddresses && namesAddresses[result["Related Lead"]] ? namesAddresses[result["Related Lead"]]["Name"] : "No Name",
                    "Qualification": result["Qualification"] ? result["Qualification"] : "No qualification",
                    "Call Confirmed": result["Call Confirmed"] ? result["Call Confirmed"] : "No call confirmed",
                    "Lead Source": result["Related Lead Source Item"] ? result["Related Lead Source Item"] : "No lead source",
                    "Setter": result["Setter Responsible"] ? result["Setter Responsible"] : result["Team Member Responsible"] ? result["Team Member Responsible"] : "Not Set",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                    seller_id: namesAddresses[result["Related Lead"]] ? namesAddresses[result["Related Lead"]].seller_id : "No Seller ID",
                }
            })
        } else if (apiEndpointKey === "closerCommission" || apiEndpointKey === "setterCommission") {
            return results.map((result) => {
                return {
                    "Date Completed": result["Date Completed"]["start"] ? formatDate(result["Date Completed"]["start"]) : "No date given",
                    "Client": result["Client Name"] ? result["Client Name"] : result["Client"] ? result["Client"] : "No client given",
                    "Team Member": result["Team Member"] ? result["Team Member"] : "No Name",
                    "Status": result["Status"] ? result["Status"] : "No Status",
                    "Type": result["Type"] ? result["Type"] : "No Type",
                    "Compensation": result["Compensation"] ? result["Compensation"] : "No compensation",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                }
            })
        } else if (apiEndpointKey === "currentPassiveIncome") {
            return results.map((result) => {
                return {
                    "Date": result["Date"]["start"] ? formatDate(result["Date"]["start"]) : "No date given",
                    "Closer": result["Closer Responsible"] ? result["Closer Responsible"] : "No closer given",
                    "Client": result["Workspace Name"] ? result["Workspace Name"] : "No Workspace Name",
                    "Status": result["Status"] ? result["Status"] : "No Status",
                    "Closer Commission Monthly": result["Closer Commision Monthly"] ? result["Closer Commision Monthly"] : "No closer commission monthly",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                }
            })
        } else {
            throw new Error("Invalid API name");
        }

    } catch (error) {
        console.error(error);
        throw new Error("Error fetching data. Please try again later.");
    }
}

