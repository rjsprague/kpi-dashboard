import cookies from 'js-cookie';

export default async function fetchKPIs(clientSpaceId, apiName, apiEndpoint, filters, kpiView) {

    const accessToken = cookies.get('token');
    // console.log("accessToken", accessToken)
    // console.log("apiName: ", apiName)
    // console.log("apiEndpoint: ", apiEndpoint)
    // console.log("filters: ", filters)
    // console.log("kpiView: ", kpiView)


    try {
        switch (kpiView) {
            case 'Financial':
                return await handleFinancialKpis(accessToken, clientSpaceId, apiName, apiEndpoint, filters);

            case 'Acquisitions':
                return await handleAcquisitionKpis(accessToken, clientSpaceId, apiName, apiEndpoint, filters);

            case 'Leaderboard':
                return null;

            case 'Team':
                return await handleTeamKpis(accessToken, clientSpaceId, apiName, apiEndpoint, filters);

            case 'Payments':
                return await handlePaymentsKpis(accessToken, apiName, apiEndpoint, filters);

            default:
                console.error(`Unsupported KPI view: ${kpiView}`);
                throw new Error(`Unsupported KPI view: ${kpiView}`);
        }
    } catch (error) {
        console.error(error);
        throw new Error("Error fetching data. Please try again later.");
    }
};

const handleAcquisitionKpis = async (accessToken, clientSpaceId, apiName, apiEndpoint, filters) => {
    // console.log("clientSpaceId: ", clientSpaceId)
    // console.log("filters: ", filters)
    // console.log("apiEndpoint: ", apiEndpoint)
    // console.log("apiName: ", apiName)
    const managementSpaceId = Number(process.env.NEXT_PUBLIC_MANAGEMENT_SPACEID);

    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
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
        } else if (apiName !== "Marketing Expenses" && apiName !== "Profit" && apiName !== "Projected Profit" && apiName !== "Contracted Profit" && apiName !== "Pending Deals" && apiName !== "Closers Ad Spend" && apiName !== "Closers Payments") {
            return data.total;
        } else {
            // console.log(apiName)
            // console.log(data)
            let fetchedResults = data.data ? data.data : [];
            let offset = fetchedResults.length;

            while (data.total > fetchedResults.length) {
                const fetchMoreData = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
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
            // console.log("fetchedResults: ", fetchedResults)
            return fetchedResults;
        }
    } catch (error) {
        console.error(error);
        console.log(error)
        throw new Error("Error fetching data. Please try again later.");
    }
};

const handleTeamKpis = async (accessToken, clientSpaceId, apiName, apiEndpoint, filters) => {
    // console.log("apiName: ", apiName)
    // console.log("apiEndpoint: ", apiEndpoint)
    // console.log("filters: ", filters)
    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
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
                    'Authorization': `Bearer ${accessToken}`,
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

        // console.log("fetchedResults: ", fetchedResults)
        return fetchedResults;

    } catch (error) {
        console.error(error);
        throw new Error("Error fetching data. Please try again later.");
    }
};

const handleFinancialKpis = async (accessToken, clientSpaceId, apiName, apiEndpoint, filters) => {
    // console.log("apiName: ", apiName)
    // console.log("apiEndpoint: ", apiEndpoint)
    // console.log("filters: ", filters)
    const managementSpaceId = Number(process.env.NEXT_PUBLIC_MANAGEMENT_SPACEID);

    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
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
        } else if (apiName !== "Marketing Expenses" && apiName !== "Profit" && apiName !== "Projected Profit" && apiName !== "Contracted Profit" && apiName !== "Closers Ad Spend" && apiName !== "Closers Payments") {
            return data.total;
        } else {

            let fetchedResults = data.data ? data.data : [];
            let offset = fetchedResults.length;

            while (data.total > fetchedResults.length) {
                const fetchMoreData = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
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
            // console.log("fetchedResults: ", fetchedResults)
            return fetchedResults;
        }
    } catch (error) {
        console.error(error);
        throw new Error("Error fetching data. Please try again later.");
    }
};

const handlePaymentsKpis = async (accessToken, apiName, apiEndpoint, filters) => {

    // console.log("apiName: ", apiName)
    // console.log("apiEndpoint: ", apiEndpoint)
    // console.log("filters: ", filters)
    
    const managementSpaceId = Number(process.env.NEXT_PUBLIC_MANAGEMENT_SPACEID);

    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                "spaceid": managementSpaceId,
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
        } else {

            let fetchedResults = data.data ? data.data : [];
            let offset = fetchedResults.length;

            while (data.total > fetchedResults.length) {
                const fetchMoreData = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        "spaceid": managementSpaceId,
                        "filters": filters,
                        "offset": offset,
                        "limit": 1000,
                    }),
                });

                const moreData = await fetchMoreData.json();
                fetchedResults = fetchedResults.concat(moreData.data);
                offset += moreData.data.length;
            }
            // console.log("fetchedResults: ", fetchedResults)
            return fetchedResults;
        }
    } catch (error) {
        console.error(error);
        throw new Error("Error fetching data. Please try again later.");
    }
};


