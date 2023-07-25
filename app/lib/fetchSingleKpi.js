import kpiToEndpointMapping from './kpiToEndpointMapping';
import apiEndpoints from './apiEndpoints';

export default async function fetchSingleKpi({ startDate, endDate, leadSource, kpiView, teamMembers, clientSpaceId, apiName }) {

    console.log("fetchSingleKpi: ", startDate, endDate, leadSource, kpiView, teamMembers, clientSpaceId, apiName)
    
    const apiEndpointsKeys = kpiToEndpointMapping[apiName];

    if (!apiEndpointsKeys || apiEndpointsKeys.length < 1) {
        throw new Error('Invalid API name');
    }

    const apiEndpointsObj = apiEndpoints(startDate, endDate, leadSource, kpiView, teamMembers);

    let results = {
        [apiEndpointsKeys[0]]: [],
        [apiEndpointsKeys[1]]: []
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

        if (data.total > fetchedResults.length) {
            const moreData = await fetchPage(requestObject, offset + fetchedResults.length);
            fetchedResults = fetchedResults.concat(moreData);
        }

        return fetchedResults;
    };

    const promises = apiEndpointsKeys.map(async apiEndpointKey => {
        let requestObject = apiEndpointsObj[apiEndpointKey];
        try {
            const fetchedResults = await fetchPage(requestObject);
            const filteredResults = filterResults(fetchedResults, apiEndpointKey);
            return { [apiEndpointKey]: filteredResults };
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


    return results;
};

function filterResults(results, apiEndpointKey) {

    console.log(results)

    try {
        if (apiEndpointKey === "marketingExpenses") {
            console.log("marketingExpenses")
            return results.map((result) => {
                return {
                    week: result["Week Number"] ? result["Week Number"] : "No Week Number",
                    leadSource: result["Lead Source"] ? result["Lead Source"] : "No Lead Source",
                    amount: result["Amount"] ? result["Amount"] : "No Amount",
                    podio_item_id: result.itemid ? result.itemid : "No itemid",
                }
            })
        } else if (apiEndpointKey === "leads" || apiEndpointKey === "leadConnections" || apiEndpointKey === "triageCalls" || apiEndpointKey === "qualifiedTriageCalls" || apiEndpointKey === "triageApproval" || apiEndpointKey === "perfectPresentations") {
            //console.log("leads")
            return results.map((result) => {
                return {
                    name: result["Seller Contact Name"] ? result["Seller Contact Name"]
                        : result["First"] && result["Last"] ? result["First"] + " " + result["Last"]
                            : result["First"] ? result["First"]
                                : result["Last"] ? result["Last"]
                                    : result.Title ? result.Title
                                        : "No Name",
                    address: result["Property Address"] ? result["Property Address"] : result["*AS Address"] ? result["*AS Address"] : "No address",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                }
            })
        } else if (apiEndpointKey === "lmStlMedian" || apiEndpointKey === "amStlMedian" || apiEndpointKey === "daStlMedian" || apiEndpointKey === "bigChecks" || apiEndpointKey === "dealAnalysis") {
            return null
        } else if (apiEndpointKey === "contracts" || apiEndpointKey === "acquisitions") {
            return null
        } else if (apiEndpointKey === "deals" || apiEndpointKey === "profit" || apiEndpointKey === "projectedProfit") {
            return null
        } else {
            throw new Error("Invalid API name");
        }

    } catch (error) {
        console.error(error);
        throw new Error("Error fetching data. Please try again later.");
    }
}
