import kpiToEndpointMapping from './kpiToEndpointMapping';
import apiEndpoints from './apiEndpoints';

export default async function fetchKpiData({ startDate, endDate, leadSource, kpiView, teamMembers, clientSpaceId, apiName }) {

    const apiEndpointsKeys = kpiToEndpointMapping[apiName];

    if (!apiEndpointsKeys || apiEndpointsKeys.length < 1) {
        throw new Error('Invalid API name');
    }

    const apiEndpointsObj = apiEndpoints(startDate, endDate, leadSource, kpiView, teamMembers);
    for (const apiEndpointKey of apiEndpointsKeys) {
        let requestObject = apiEndpointsObj[apiEndpointKey];

        try {
            const response = await fetch(`${requestObject.url}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "spaceid": clientSpaceId,
                    "filters": requestObject.filters
                }),
            });

            if (!response.ok) {
                console.error(`Error fetching data from ${requestObject.url}: ${response.status} ${response.statusText}`);
                throw new Error(`Server responded with an error: ${response.statusText}`);
            }

            const data = await response.json();
            let fetchedResults = data.data ? data.data : [];
            let offset = fetchedResults.length;

            while (data.total > fetchedResults.length) {
                const fetchMoreData = await fetch(`${requestObject.url}`, {
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

                const moreData = await fetchMoreData.json();
                fetchedResults = fetchedResults.concat(moreData.data);
                offset += moreData.data.length;
            }

            fetchedResults = fetchedResults.map((result) => {
                return {
                    name: result["Seller Contact Name"] ? result["Seller Contact Name"]
                        : result["First"] && result["Last"] ? result["First"] + " " + result["Last"]
                            : result["First"] ? result["First"]
                                : result["Last"] ? result["Last"]
                                    : result.Title ? result.Title
                                        : "No Name",
                    address: result["Property Address"] ? result["Property Address"] : "No address",
                    podio_item_id: result.itemid ? result.itemid : result.podio_item_id,
                };
            });

            return fetchedResults;
        } catch (error) {
            console.error(error);
            throw new Error("Error fetching data. Please try again later.");
        }
    }
}
