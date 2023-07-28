import kpiToEndpointMapping from './kpiToEndpointMapping';
import apiEndpoints from './apiEndpoints';

export default async function fetchSingleKpi({ startDate, endDate, leadSource, kpiView, teamMembers, clientSpaceId, apiName }) {
    let teamMembersNum = teamMembers.map(Number);
    const apiEndpointsKeys = kpiToEndpointMapping[apiName];

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
            },
            body: JSON.stringify({
                "spaceid": clientSpaceId,
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
            },
            body: JSON.stringify({
                "spaceid": clientSpaceId,
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

        return fetchedResults;
    };

    const promises = apiEndpointsKeys.map(async apiEndpointKey => {
        let requestObject = apiEndpointsObj[apiEndpointKey];
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
    resultsValues.forEach(item => {
        if (item["Seller Lead"]) {
            leadsArray.push(item["Seller Lead"]);
        } else if (item["Related Lead"]) {
            leadsArray.push(item["Related Lead"]);
        }
    });
    // query the leads endpoint for each of the leads in the leadsArray
    const leadsEndpoint = apiEndpointsObj["leads"];
    leadsEndpoint.filters = [{ type: "app", fieldName: "itemid", values: leadsArray.flat() }];
    const leads = await fetchPage(leadsEndpoint);

    let namesAddresses = {};
    leads.forEach(lead => {
        namesAddresses[lead.itemid] = {
            "Name": lead["Seller Contact Name"] ? lead["Seller Contact Name"]
                : lead["First"] && lead["Last"] ? lead["First"] + " " + lead["Last"]
                    : lead["First"] ? lead["First"]
                        : lead["Last"] ? lead["Last"]
                            : lead.Title ? lead.Title
                                : "No Name",
            "Address": lead["Property Address"] ? lead["Property Address"] : lead["*AS Address"] ? lead["*AS Address"] : "No address",
        }
    });

    Object.keys(results).forEach(key => {
        results[key] = filterResults(results[key], key, namesAddresses);
    });

    return results;
};

function filterResults(results, apiEndpointKey, namesAddresses) {

    try {
        if (apiEndpointKey === "marketingExpenses") {
            return results.map((result) => {
                return {
                    "Week": result["Week Number"] ? parseInt(result["Week Number"], 10) : "No Week Number",
                    "Lead Source": result["Lead Source"] ? result["Lead Source"] : "No Lead Source",
                    "Amount": result["Amount"] ? result["Amount"] : "No Amount",
                    podio_item_id: result.itemid ? result.itemid : "No itemid",
                }
            })
        } else if (apiEndpointKey === "leads") {
            return results.map((result) => {
                return {
                    "Date": result["Lead Created On"]["start_utc"] ? result["Lead Created On"]["start_utc"] : "Not a Lead",
                    "Name": result["Seller Contact Name"] ? result["Seller Contact Name"]
                        : result["First"] && result["Last"] ? result["First"] + " " + result["Last"]
                            : result["First"] ? result["First"]
                                : result["Last"] ? result["Last"]
                                    : result.Title ? result.Title
                                        : "No Name",
                    "Address": result["Property Address"] ? result["Property Address"] : result["*AS Address"] ? result["*AS Address"] : "No address",
                    "Lead Source": result["Lead Source Item"] ? result["Lead Source Item"] : "No Lead Source",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                }
            })
        } else if (apiEndpointKey === "leadConnections") {
            return results.map((result) => {
                return {
                    "Date Connected": result["First lead connection"]["start_utc"] ? result["First lead connection"]["start_utc"] : "Not a Lead Connection",
                    "Lead Name": result["Seller Contact Name"] ? result["Seller Contact Name"]
                        : result["First"] && result["Last"] ? result["First"] + " " + result["Last"]
                            : result["First"] ? result["First"]
                                : result["Last"] ? result["Last"]
                                    : result.Title ? result.Title
                                        : "No Name",
                    "Address": result["Property Address"] ? result["Property Address"] : result["*AS Address"] ? result["*AS Address"] : "No address",
                    "Lead Source": result["Lead Source Item"] ? result["Lead Source Item"] : "No Lead Source",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                }
            })
        } else if (apiEndpointKey === "triageCalls") {
            return results.map((result) => {
                return {
                    "Date SLS Submitted": result["SLS Created On"]["start_utc"] ? result["SLS Created On"]["start_utc"] : "Not an SLS",
                    "Lead Name": result["Seller Contact Name"] ? result["Seller Contact Name"]
                        : result["First"] && result["Last"] ? result["First"] + " " + result["Last"]
                            : result["First"] ? result["First"]
                                : result["Last"] ? result["Last"]
                                    : result.Title ? result.Title
                                        : "No Name",
                    "Address": result["Property Address"] ? result["Property Address"] : result["*AS Address"] ? result["*AS Address"] : "No address",
                    "Lead Manager": result["Lead Manager Responsible"] ? result["Lead Manager Responsible"] : "No Lead Manager",
                    "Lead Source": result["Lead Source"] ? result["Lead Source"] : "No Lead Source",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                }
            })
        } else if (apiEndpointKey === "qualifiedTriageCalls") {
            return results.map((result) => {
                return {
                    "Date SLS Submitted": result["SLS Created On"]["start_utc"] ? result["SLS Created On"]["start_utc"] : "Not an SLS",
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
                    "Date SLS Submitted": result["SLS Created On"]["start_utc"] ? result["SLS Created On"]["start_utc"] : "Not an SLS",
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
                    "Date DA Submitted": result["Timestamp"] && result["Timestamp"]["start_utc"] ? result["Timestamp"]["start_utc"] : "Not an SLS",
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
                    "Date AS Submitted": result["AS Created On"]["start_utc"] ? result["AS Created On"]["start_utc"] : "Not an SLS",
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
                    "Date": result["Timestamp"]["start_utc"] ? result["Timestamp"]["start_utc"] : "No Date",
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
                    "Date": result["Timestamp"]["start_utc"] ? result["Timestamp"]["start_utc"] : "No Date",
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
                    "Date": result["Timestamp"]["start_utc"] ? result["Timestamp"]["start_utc"] : "No Date",
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
                    "Date": result["Timestamp"]["start_utc"] ? result["Timestamp"]["start_utc"] : "No Date",
                    "Team Member": result["Team Member Responsible"] ? result["Team Member Responsible"] : "No Team Member",
                    //"Lead Source": result["Lead Source"] ? result["Lead Source"] : "No Lead Source",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                }
            })
        } else if (apiEndpointKey === "contracts") {
            return results.map((result) => {
                return {
                    "Date Contracted": result["*Date Ratified"]["start_utc"] ? result["*Date Ratified"]["start_utc"] : "No Date",
                    "Lead Name": namesAddresses && namesAddresses[result["Seller Lead"]] && namesAddresses[result["Seller Lead"]]["Name"] ? namesAddresses[result["Seller Lead"]]["Name"] : "Ask Ryan",
                    "Address": namesAddresses && namesAddresses[result["Seller Lead"]] && namesAddresses[result["Seller Lead"]]["Address"] ? namesAddresses[result["Seller Lead"]]["Address"] : "Ask Ryan",
                    "Lead Source": result["Lead Source"] ? result["Lead Source"] : "No Lead Source",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                }
            })
        } else if (apiEndpointKey === "acquisitions") {
            return results.map((result) => {
                return {
                    "Date Acquired": result["Date Acquired"]["start_utc"] ? result["Date Acquired"]["start_utc"] : "No Date",
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
                    "Date Acquired": result["Date Acquired"]["start_utc"] ? result["Date Acquired"]["start_utc"] : "No Date",
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
                    "Date Deal Sold": result["Closing (Sell)"]["start_utc"] ? result["Closing (Sell)"]["start_utc"] : "No Date",
                    "Lead Name": namesAddresses && namesAddresses[result["Seller Lead"]] && namesAddresses[result["Seller Lead"]]["Name"] ? namesAddresses[result["Seller Lead"]]["Name"] : "Ask Ryan",
                    "Address": namesAddresses && namesAddresses[result["Seller Lead"]] && namesAddresses[result["Seller Lead"]]["Address"] ? namesAddresses[result["Seller Lead"]]["Address"] : "Ask Ryan",
                    "Lead Source": result["Lead Source"] ? result["Lead Source"] : "No Lead Source",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                }
            })
        } else if (apiEndpointKey === "profit") {
            return results.map((result) => {
                return {
                    "Date Deal Sold": result["Closing (Sell)"]["start_utc"] ? result["Closing (Sell)"]["start_utc"] : "No Date",
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
                    "Date Acquired": result["Date Acquired"]["start_utc"] ? result["Date Acquired"]["start_utc"] : "No Date",
                    "Lead Name": namesAddresses && namesAddresses[result["Seller Lead"]] && namesAddresses[result["Seller Lead"]]["Name"] ? namesAddresses[result["Seller Lead"]]["Name"] : "Ask Ryan",
                    "Address": namesAddresses && namesAddresses[result["Seller Lead"]] && namesAddresses[result["Seller Lead"]]["Address"] ? namesAddresses[result["Seller Lead"]]["Address"] : "Ask Ryan",
                    "Projected Profit": result["Expected Profit Center"] ? result["Expected Profit Center"] : "No Projected Profit",
                    "Lead Source": result["Lead Source"] ? result["Lead Source"] : "No Lead Source",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                }
            })
        }
        else {
            throw new Error("Invalid API name");
        }

    } catch (error) {
        console.error(error);
        throw new Error("Error fetching data. Please try again later.");
    }
}
