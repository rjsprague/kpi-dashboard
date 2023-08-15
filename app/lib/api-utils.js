
const handleAcquisitionKpis = async (clientSpaceId, apiName, apiEndpoint, filters) => {
    console.log("clientSpaceId: ", clientSpaceId)
    console.log("filters: ", filters)
    console.log("apiEndpoint: ", apiEndpoint)
    console.log("apiName: ", apiName)
    const managementSpaceId = 7723481;

    
    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "spaceid": apiName === "Closers Payments" ? managementSpaceId : clientSpaceId,
                "filters": filters
            }),
        });

        if (!response.ok) {
            console.error(`Error fetching data from ${apiEndpoint}: ${response.status} ${response.statusText}`);
            throw new Error(`Server responded with an error: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.total === 0) {
            return 0;
        } else if (apiName !== "Marketing Expenses" && apiName !== "Profit" && apiName !== "Projected Profit" && apiName !== "Pending Deals" && apiName !== "Closers Ad Spend" && apiName !== "Closers Payments") {
            return data.total;
        } else {

            console.log(apiName)
            console.log(data)

            let fetchedResults = data.data ? data.data : [];
            let offset = fetchedResults.length;

            while (data.total > fetchedResults.length) {
                const fetchMoreData = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "spaceid": apiName === "Closers Payments" ? managementSpaceId : clientSpaceId,
                        "filters": filters,
                        "offset": offset,
                        "limit": 1000,
                    }),
                });

                const moreData = await fetchMoreData.json();
                fetchedResults = fetchedResults.concat(moreData.data);
                offset += moreData.data.length;
            }
            console.log("fetchedResults: ", fetchedResults)
            return fetchedResults;
        }
    } catch (error) {
        console.error(error);
        throw new Error("Error fetching data. Please try again later.");
    }
};

const handleTeamKpis = async (clientSpaceId, apiName, apiEndpoint, filters) => {
    // console.log("apiName: ", apiName)
    // console.log("apiEndpoint: ", apiEndpoint)
    // console.log("filters: ", filters)


    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "spaceid": clientSpaceId,
                "filters": filters,
                "limit": 1000,
            }),
        });

        if (!response.ok) {
            console.error(`Error fetching data from ${apiEndpoint}: ${response.status} ${response.statusText}`);
            throw new Error(`Server responded with an error: ${response.statusText}`);
        }
        const data = await response.json();
        //console.log("data: ", data)
        let fetchedResults = data.data ? data.data : [];
        let offset = fetchedResults.length;

        while (data.total > fetchedResults.length) {
            const fetchMoreData = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "spaceid": clientSpaceId,
                    "filters": filters,
                    "offset": offset,
                    "limit": 1000,
                }),
            });
            const moreData = await fetchMoreData.json();
            fetchedResults = fetchedResults.concat(moreData.data);
            offset += moreData.data.length;
        }

        //console.log("fetchedResults: ", fetchedResults)
        return fetchedResults;

    } catch (error) {
        console.error(error);
        throw new Error("Error fetching data. Please try again later.");
    }
};

const handleFinancialKpis = async (clientSpaceId, apiName, apiEndpoint, filters) => {
    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "spaceid": clientSpaceId,
                "filters": filters
            }),
        });

        if (!response.ok) {
            console.error(`Error fetching data from ${apiEndpoint}: ${response.status} ${response.statusText}`);
            throw new Error(`Server responded with an error: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.total === 0) {
            return 0;
        } else if (apiName !== "Marketing Expenses" && apiName !== "Profit" && apiName !== "Projected Profit") {
            return data.total;
        } else {

            let fetchedResults = data.data ? data.data : [];
            let offset = fetchedResults.length;

            while (data.total > fetchedResults.length) {
                const fetchMoreData = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "spaceid": clientSpaceId,
                        "filters": filters,
                        "offset": offset,
                        "limit": 1000,
                    }),
                });

                const moreData = await fetchMoreData.json();
                fetchedResults = fetchedResults.concat(moreData.data);
                offset += moreData.data.length;
            }
            return fetchedResults;
        }
    } catch (error) {
        console.error(error);
        throw new Error("Error fetching data. Please try again later.");
    }
};

export default async function fetchKPIs(clientSpaceId, apiName, apiEndpoint, filters, kpiView) {
    console.log("apiName: ", apiName)
    console.log("apiEndpoint: ", apiEndpoint)
    console.log("filters: ", filters)
    console.log("kpiView: ", kpiView)


    try {
        switch (kpiView) {
            case 'Financial':
                return await handleFinancialKpis(clientSpaceId, apiName, apiEndpoint, filters);

            case 'Acquisitions':
                return await handleAcquisitionKpis(clientSpaceId, apiName, apiEndpoint, filters);

            case 'Leaderboard':
                return null;

            case 'Team':
                return await handleTeamKpis(clientSpaceId, apiName, apiEndpoint, filters);

            default:
                console.error(`Unsupported KPI view: ${kpiView}`);
                throw new Error(`Unsupported KPI view: ${kpiView}`);
        }
    } catch (error) {
        console.error(error);
        throw new Error("Error fetching data. Please try again later.");
    }
};

