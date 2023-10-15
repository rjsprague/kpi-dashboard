import kpiToEndpointMapping from './kpiToEndpointMapping';
import apiEndpoints from './apiEndpoints';
import { formatDate } from './date-utils';
import cookies from 'js-cookie';

export default async function fetchSingleKpi({ startDate, endDate, leadSource, kpiView, teamMembers, clientSpaceId, apiName }) {
    const accessToken = cookies.get('accessToken');
    // console.log("accessToken", accessToken)
    // console.log("api name: ", apiName)
    const managementSpaceId = Number(process.env.NEXT_PUBLIC_MANAGEMENT_SPACEID);
    let teamMembersNum = teamMembers.map(Number);
    const apiEndpointsKeys = kpiToEndpointMapping[apiName];

    // console.log(apiEndpointsKeys)
    // console.log(startDate, endDate, leadSource, kpiView, teamMembers, clientSpaceId, apiName)

    if (!apiEndpointsKeys || apiEndpointsKeys.length < 1) {
        throw new Error('Invalid API name');
    }

    let results = apiEndpointsKeys.reduce((acc, key) => {
        return {
            ...acc,
            [key]: [],
        };
    }, {});

    const apiEndpointsObj = apiEndpoints(startDate, endDate, leadSource, kpiView, teamMembersNum);

    const getInitialData = async (requestObject) => {
        const response = await fetch(`${requestObject.url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                "spaceid": requestObject.name === "Closers Payments" ? managementSpaceId : clientSpaceId,
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
        const response = await fetch(`${requestObject.url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                "spaceid": requestObject.name === "Closers Payments" ? managementSpaceId : clientSpaceId,
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
    // query the leads endpoint for each of the leads in the leadsArray
    let leadsEndpoint;

    if (clientSpaceId == process.env.NEXT_PUBLIC_ACQUISITIONS_SPACEID) {
        leadsEndpoint = apiEndpointsObj["closersLeadsCreated"]
    } else {
        leadsEndpoint = apiEndpointsObj["leads"]
    }
    leadsEndpoint.filters = [{ type: "app", fieldName: "itemid", values: leadsArray.flat() }];
    const leads = await fetchPage(leadsEndpoint);
    // console.log(leads)

    let namesAddresses = {};
    leads.forEach(lead => {
        namesAddresses[lead.itemid] = {
            "Name": lead["Contact Name"] ? lead["Contact Name"] : lead["Seller Contact Name"] ? lead["Seller Contact Name"]
                : lead["First"] && lead["Last"] ? lead["First"] + " " + lead["Last"]
                    : lead["First"] ? lead["First"]
                        : lead["Last"] ? lead["Last"]
                            : lead.Title ? lead.Title
                                : "No Name",
            "Address": lead["Property Address"] ? lead["Property Address"] : lead["*AS Address"] ? lead["*AS Address"] : "No address",
        }
    });

    // console.log(namesAddresses)
    // console.log(results)

    Object.keys(results).forEach(key => {
        results[key] = filterResults(results[key], key, namesAddresses);
    });
    // console.log(results)

    return results;
};

function filterResults(results, apiEndpointKey, namesAddresses) {

    // console.log(results)
    // console.log(apiEndpointKey)
    // console.log(namesAddresses)

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
                        "Lead Source": result["Lead Source Item"] ? result["Lead Source Item"] : "No Lead Source",
                        podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
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
                        "Pre-Qualification Status": result["Pre-Qualification Status"] ? result["Pre-Qualification Status"] : "No Status",
                        "Lead Source": result["Lead Source Item"] ? result["Lead Source Item"] : "No Lead Source",
                        podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                    }
                }
            })
        } else if (apiEndpointKey === "leadConnections") {
            return results.map((result) => {
                return {
                    "Date Connected": result["First lead connection"]["start"] ? formatDate(result["First lead connection"]["start"]) : "Not a Lead Connection",
                    "Lead Name": result["Seller Contact Name"] ? result["Seller Contact Name"]
                        : result["First"] && result["Last"] ? result["First"] + " " + result["Last"]
                            : result["First"] ? result["First"]
                                : result["Last"] ? result["Last"]
                                    : result.Title ? result.Title
                                        : "No Name",
                    "Address": result["Property Address"] ? result["Property Address"] : result["*AS Address"] ? result["*AS Address"] : "No address",
                    "Status": result["Lead Status"] ? result["Lead Status"] : "No Status",
                    "Lead Source": result["Lead Source Item"] ? result["Lead Source Item"] : "No Lead Source",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                }
            })
        } else if (apiEndpointKey === "triageCalls") {
            return results.map((result) => {
                return {
                    "Date SLS Submitted": result["SLS Created On"]["start"] ? formatDate(result["SLS Created On"]["start"]) : "Not an SLS",
                    "Lead Name": result["Seller Contact Name"] ? result["Seller Contact Name"]
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
                }
            })
        } else if (apiEndpointKey === "qualifiedTriageCalls") {
            return results.map((result) => {
                return {
                    "Date SLS Submitted": result["SLS Created On"]["start"] ? formatDate(result["SLS Created On"]["start"]) : "Not an SLS",
                    "Lead Name": result["Seller Contact Name"] ? result["Seller Contact Name"]
                        : result["First"] && result["Last"] ? result["First"] + " " + result["Last"]
                            : result["First"] ? result["First"]
                                : result["Last"] ? result["Last"]
                                    : result.Title ? result.Title
                                        : "No Name",
                    "Address": result["Property Address"] ? result["Property Address"] : result["*AS Address"] ? result["*AS Address"] : "No address",
                    "Lead Source": result["Lead Source"] ? result["Lead Source"] : "No Lead Source",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                }
            })
        } else if (apiEndpointKey === "triageApproval") {
            return results.map((result) => {
                return {
                    "Date SLS Submitted": result["SLS Created On"]["start"] ? formatDate(result["SLS Created On"]["start"]) : "Not an SLS",
                    "Lead Name": result["Seller Contact Name"] ? result["Seller Contact Name"]
                        : result["First"] && result["Last"] ? result["First"] + " " + result["Last"]
                            : result["First"] ? result["First"]
                                : result["Last"] ? result["Last"]
                                    : result.Title ? result.Title
                                        : "No Name",
                    "Address": result["Property Address"] ? result["Property Address"] : result["*AS Address"] ? result["*AS Address"] : "No address",
                    "Lead Source": result["Lead Source"] ? result["Lead Source"] : "No Lead Source",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                }
            })
        } else if (apiEndpointKey === "dealAnalysis") {
            return results.map((result) => {
                return {
                    "Date DA Submitted": result["Timestamp"] && result["Timestamp"]["start"] ? formatDate(result["Timestamp"]["start"]) : "Not an SLS",
                    "Lead Name": namesAddresses && namesAddresses[result["Seller Lead"]] && namesAddresses[result["Seller Lead"]]["Name"] ? namesAddresses[result["Seller Lead"]]["Name"] : "Ask Ryan",
                    "Address": namesAddresses && namesAddresses[result["Seller Lead"]] && namesAddresses[result["Seller Lead"]]["Address"] ? namesAddresses[result["Seller Lead"]]["Address"] : "Ask Ryan",
                    "Status": result["--Current Seller Lead Status"] ? result["--Current Seller Lead Status"] : "No Status",
                    "Lead Source": result["Lead Source"] ? result["Lead Source"] : "No Lead Source",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                }
            })
        } else if (apiEndpointKey === "perfectPresentations") {
            return results.map((result) => {
                return {
                    "Date AS Submitted": result["AS Created On"]["start"] ? formatDate(result["AS Created On"]["start"]) : "Not an SLS",
                    "Lead Name": namesAddresses && namesAddresses[result["Related Lead"]] ? namesAddresses[result["Related Lead"]]["Name"] : "Ask Ryan",
                    "Address": result["*AS Address"] ? result["*AS Address"] : "No address",
                    "Result": result["**What was the result of this lead?**"] ? result["**What was the result of this lead?**"] : "No Result",
                    "Lead Source": result["Lead Source"] ? result["Lead Source"] : "No Lead Source",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                }
            })
        } else if (apiEndpointKey === "lmStlMedian") {

            return results.map((result) => {
                return {
                    "Date": result["Timestamp"]["start"] ? formatDate(result["Timestamp"]["start"]) : "No Date",
                    "Lead Name": namesAddresses && namesAddresses[result["Seller Lead"]] ? namesAddresses[result["Seller Lead"]]["Name"] : "Ask Ryan",
                    "Address": namesAddresses && namesAddresses[result["Seller Lead"]] ? namesAddresses[result["Seller Lead"]]["Address"] : "Ask Ryan",
                    "LM STL Median": result["Speed to Lead Adjusted"] ? (result["Speed to Lead Adjusted"] / 60) + " mins" : "No LM STL Median",
                    //"Lead Source": result["Lead Source"] ? result["Lead Source"] : "No Lead Source",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                }
            })
        } else if (apiEndpointKey === "amStlMedian") {
            return results.map((result) => {
                return {
                    "Date": result["Timestamp"]["start"] ? formatDate(result["Timestamp"]["start"]) : "No Date",
                    "Lead Name": namesAddresses && namesAddresses[result["Seller Lead"]] ? namesAddresses[result["Seller Lead"]]["Name"] : "Ask Ryan",
                    "Address": namesAddresses && namesAddresses[result["Seller Lead"]] ? namesAddresses[result["Seller Lead"]]["Address"] : "Ask Ryan",
                    "AM STL Median": result["Speed to Lead Adjusted"] ? (result["Speed to Lead Adjusted"] / 3600).toFixed(2) + " hours" : "No AM STL Median",
                    //"Lead Source": result["Lead Source"] ? result["Lead Source"] : "No Lead Source",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                }
            })
        } else if (apiEndpointKey === "daStlMedian") {
            return results.map((result) => {
                return {
                    "Date": result["Timestamp"]["start"] ? formatDate(result["Timestamp"]["start"]) : "No Date",
                    "Lead Name": namesAddresses && namesAddresses[result["Seller Lead"]] ? namesAddresses[result["Seller Lead"]]["Name"] : "Ask Ryan",
                    "Address": namesAddresses && namesAddresses[result["Seller Lead"]] ? namesAddresses[result["Seller Lead"]]["Address"] : "Ask Ryan",
                    "LM STL Median": result["Speed to Lead Adjusted"] ? (result["Speed to Lead Adjusted"] / 3600).toFixed(2) + " hours" : "No DA STL Median",
                    //"Lead Source": result["Lead Source"] ? result["Lead Source"] : "No Lead Source",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                }
            })
        } else if (apiEndpointKey === "bigChecks") {
            return results.map((result) => {
                return {
                    "Date": result["Timestamp"]["start"] ? formatDate(result["Timestamp"]["start"]) : "No Date",
                    "Team Member": result["Team Member Responsible"] ? result["Team Member Responsible"] : "No Team Member",
                    //"Lead Source": result["Lead Source"] ? result["Lead Source"] : "No Lead Source",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                }
            })
        } else if (apiEndpointKey === "contracts" || apiEndpointKey === "contractedProfit") {
            return results.map((result) => {
                return {
                    "Date Contracted": result["*Date Ratified"]["start"] ? formatDate(result["*Date Ratified"]["start"]) : "No Date",
                    "Lead Name": namesAddresses && namesAddresses[result["Seller Lead"]] && namesAddresses[result["Seller Lead"]]["Name"] ? namesAddresses[result["Seller Lead"]]["Name"] : "Ask Ryan",
                    "Address": namesAddresses && namesAddresses[result["Seller Lead"]] && namesAddresses[result["Seller Lead"]]["Address"] ? namesAddresses[result["Seller Lead"]]["Address"] : "Ask Ryan",
                    "Expected Profit": result["Expected Profit Center"] ? result["Expected Profit Center"] : "No Profit Center",
                    "Lead Source": result["Lead Source"] ? result["Lead Source"] : "No Lead Source",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                }
            })
        } else if (apiEndpointKey === "acquisitions") {
            return results.map((result) => {
                return {
                    "Date Acquired": result["Date Acquired"]["start"] ? formatDate(result["Date Acquired"]["start"]) : "No Date",
                    "Lead Name": namesAddresses && namesAddresses[result["Seller Lead"]] && namesAddresses[result["Seller Lead"]]["Name"] ? namesAddresses[result["Seller Lead"]]["Name"] : "Ask Ryan",
                    "Address": namesAddresses && namesAddresses[result["Seller Lead"]] && namesAddresses[result["Seller Lead"]]["Address"] ? namesAddresses[result["Seller Lead"]]["Address"] : "Ask Ryan",
                    "Lead Source": result["Lead Source"] ? result["Lead Source"] : "No Lead Source",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
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
                    "Lead Name": namesAddresses && namesAddresses[result["Seller Lead"]] && namesAddresses[result["Seller Lead"]]["Name"] ? namesAddresses[result["Seller Lead"]]["Name"] : "Ask Ryan",
                    "Address": namesAddresses && namesAddresses[result["Seller Lead"]] && namesAddresses[result["Seller Lead"]]["Address"] ? namesAddresses[result["Seller Lead"]]["Address"] : "Ask Ryan",
                    "Projected Profit": result["Expected Profit Center"] ? result["Expected Profit Center"] : "No Projected Profit",
                    "Lead Source": result["Lead Source"] ? result["Lead Source"] : "No Lead Source",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                }
            })
        } else if (apiEndpointKey === "deals") {
            return results.map((result) => {
                return {
                    "Date Deal Sold": result["Closing (Sell)"]["start"] ? formatDate(result["Closing (Sell)"]["start"]) : "No Date",
                    "Lead Name": namesAddresses && namesAddresses[result["Seller Lead"]] && namesAddresses[result["Seller Lead"]]["Name"] ? namesAddresses[result["Seller Lead"]]["Name"] : "Ask Ryan",
                    "Address": namesAddresses && namesAddresses[result["Seller Lead"]] && namesAddresses[result["Seller Lead"]]["Address"] ? namesAddresses[result["Seller Lead"]]["Address"] : "Ask Ryan",
                    "Lead Source": result["Lead Source"] ? result["Lead Source"] : "No Lead Source",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                }
            })
        } else if (apiEndpointKey === "profit") {
            return results.map((result) => {
                return {
                    "Date Deal Sold": result["Closing (Sell)"]["start"] ? formatDate(result["Closing (Sell)"]["start"]) : "No Date",
                    "Lead Name": namesAddresses && namesAddresses[result["Seller Lead"]] && namesAddresses[result["Seller Lead"]]["Name"] ? namesAddresses[result["Seller Lead"]]["Name"] : "Ask Ryan",
                    "Address": namesAddresses && namesAddresses[result["Seller Lead"]] && namesAddresses[result["Seller Lead"]]["Address"] ? namesAddresses[result["Seller Lead"]]["Address"] : "Ask Ryan",
                    "Amount of Profit": result["Net Profit Center"] ? result["Net Profit Center"] : "No Profit",
                    "Lead Source": result["Lead Source"] ? result["Lead Source"] : "No Lead Source",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
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
                    "Lead Name": namesAddresses && namesAddresses[result["Seller Lead"]] && namesAddresses[result["Seller Lead"]]["Name"] ? namesAddresses[result["Seller Lead"]]["Name"] : "Ask Ryan",
                    "Address": namesAddresses && namesAddresses[result["Seller Lead"]] && namesAddresses[result["Seller Lead"]]["Address"] ? namesAddresses[result["Seller Lead"]]["Address"] : "Ask Ryan",
                    "Projected Profit": result["Expected Profit Center"] ? result["Expected Profit Center"] : "No Projected Profit",
                    "Lead Source": result["Lead Source"] ? result["Lead Source"] : "No Lead Source",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                }
            })
        } else if (apiEndpointKey === "closersPayments") {
            // const calcResults = results.reduce((acc, curr) => {
            //     if (curr.hasOwnProperty("Closer Responsible")) {
            //         acc.push(curr)
            //     }
            //     return acc
            // }, [])
            return results.map((result) => {
                return {
                    "Date": result["Date"]["start"] ? formatDate(result["Date"]["start"]) : "No date given",
                    // "Payment Start": result["Date Start"] && result["Date Start"]["start"] ? formatDate(result["Date Start"]["start"]) : "No start date",
                    "Closer": result["Closer Responsible"] ? result["Closer Responsible"] : "No closer given", //get name converted from id in table
                    "Cash Up Front": result["Cash Collected Up Front"] ? result["Cash Collected Up Front"] : "No cash up front",
                    "Revenue Contracted": result["Contract Total"] ? result["Contract Total"] : "No revenue contracted",
                    podio_item_id: result.itemid ? result.itemid : podio_item_id,
                }
            })
        } else if (apiEndpointKey === "closersUniqueAttended" || apiEndpointKey === "closersTotalAttended" || apiEndpointKey === "closersBookings" || apiEndpointKey === "closersAppointments") {
            return results.map((result) => {
                return {
                    "Date": result["Date"]["start"] ? formatDate(result["Date"]["start"]) : "No Date",
                    "Name": namesAddresses && namesAddresses[result["Related Lead"]] ? namesAddresses[result["Related Lead"]]["Name"] : "No Name",
                    "Event": result["Event"] ? result["Event"] : "No event given",
                    "Team Member Responsible": result["Team Member Responsible [Name]"] ? result["Team Member Responsible [Name]"] : "No team member responsible",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                }
            })
        } else if (apiEndpointKey === "closersDcOffers" || apiEndpointKey === "closersDcClosed") {
            return results.map((result) => {
                return {
                    "Date Submitted": result["created_on"] && result["created_on"]["start"] ? formatDate(result["created_on"]["start"]) : "No date given",
                    "Name": namesAddresses && namesAddresses[result["Related Lead"]] ? namesAddresses[result["Related Lead"]]["Name"] : "No Name",
                    "Status": result["Status of the Call"] ? result["Status of the Call"] : "No Status",
                    "Lead Source": result["Related Lead Source Item"] ? result["Related Lead Source Item"] : "No lead source",
                    "Closer": result["Closer Responsible"] ? result["Closer Responsible"] : "Closer not given",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id
                }
            })
        } else if (apiEndpointKey === "closersLeadsSetPrequalified") {
            return results.map((result) => {
                return {
                    "Date": result["created_on"] && result["created_on"]["start"] ? formatDate(result["created_on"]["start"]) : "No date given",
                    "Name": namesAddresses && namesAddresses[result["Related Lead"]] ? namesAddresses[result["Related Lead"]]["Name"] : "No Name",
                    "Qualification": result["Qualification"] ? result["Qualification"] : "No qualification",
                    "Call Confirmed": result["Call Confirmed"] ? result["Call Confirmed"] : "No call confirmed",
                    // "Lead Source": result["Related Lead Source Item"] ? result["Related Lead Source Item"] : "No lead source",
                    "Setter": result["Team Member Responsible"] ? result["Team Member Responsible"] : "Setter not given",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id
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
