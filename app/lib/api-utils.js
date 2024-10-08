import cookies from 'js-cookie';

export default async function fetchKPIs(clientSpaceId, apiName, apiEndpoint, filters, kpiView, noSetter) {

    const accessToken = cookies.get('token');
    // console.log("accessToken", accessToken)
    // console.log("apiName: ", apiName)
    // console.log("apiEndpoint: ", apiEndpoint)
    // console.log("filters: ", filters)
    // console.log("kpiView: ", kpiView)
    // console.log("noSetter: ", noSetter)


    try {
        switch (kpiView) {
            case 'Financial':
                return await handleFinancialKpis(accessToken, clientSpaceId, apiName, apiEndpoint, filters);

            case 'Acquisitions':
                return await handleAcquisitionKpis(accessToken, clientSpaceId, apiName, apiEndpoint, filters, noSetter);

            case 'Leaderboard':
                return null;

            case 'Team':
                return await handleTeamKpis(accessToken, clientSpaceId, apiName, apiEndpoint, filters);

            case 'Payments':
                return await handlePaymentsKpis(accessToken, apiName, apiEndpoint, filters);
            
            case 'All Previous DC Offers':
                return await fetchAllPreviousDcOffers(accessToken, clientSpaceId, apiEndpoint, filters, noSetter);

            default:
                console.error(`Unsupported KPI view: ${kpiView}`);
                throw new Error(`Unsupported KPI view: ${kpiView}`);
        }
    } catch (error) {
        console.error(error);
        throw new Error("Error fetching data. Please try again later.");
    }
};

const handleAcquisitionKpis = async (accessToken, clientSpaceId, apiName, apiEndpoint, filters, noSetter) => {
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
                "filters": filters,
                "limit": 1
            }),
        });

        // console.log("response: ", response)

        if (!response.ok) {
            console.error(`Error fetching data from ${apiEndpoint}: ${response.status} ${response.statusText}`);
            console.log(`Error fetching data from ${apiEndpoint}: ${response.status} ${response.statusText}`);
            throw new Error(`Server responded with an error: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.total === 0) {
            return 0;
        } else if (noSetter === true && apiName === "Closers Bookings" || noSetter === true && apiName === "Closers Appointments" || noSetter === true && apiName === "Closers Total Attended" || noSetter === true && apiName === "Closers Unique Attended" || noSetter === true && apiName === "Closers DC Offers" || noSetter === true && apiName === "Closers DC Closed" || apiName === "Marketing Expenses" || apiName === "Profit" || apiName === "Projected Profit" || apiName === "Contracted Profit" || apiName === "Pending Deals" || apiName === "Closers Ad Spend" || apiName === "Closers Payments" || apiName === "Closers DC Offers" || apiName === "Closers Leads Connected") {
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
            if (noSetter === true && apiName === "Closers Bookings" || noSetter === true && apiName === "Closers Appointments" || noSetter === true && apiName === "Closers Total Attended" || noSetter === true && apiName === "Closers Unique Attended" || noSetter === true && apiName === "Closers DC Closed") {
                return fetchedResults.filter(result => !result["Setter Responsible"]).length;
            } else if (noSetter === true && apiName === "Closers DC Offers") {
                return fetchedResults.filter(result => !result["Setter Responsible"]);
            }

            // console.log(noSetter)
            // console.log(apiName + " Results: ", fetchedResults)

            return fetchedResults;
        } else {
            return data.total;
        }
    } catch (error) {
        console.error(error);
        // console.log(error)
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

        // console.log("data: ", data)

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

// Fetch all results from closersDcOffers endpoint
const fetchAllPreviousDcOffers = async (accessToken, clientSpaceId, apiEndpoint, filters, noSetter) => {

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
                "limit": 1,
            }),
        });

        if (!response.ok) {
            console.error(`Error fetching data from ${apiEndpoint}: ${response.status} ${response.statusText}`);
            throw new Error(`Server responded with an error: ${response.statusText}`);
        }
        const data = await response.json();
        
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

        if (noSetter) {
            // return the results where there is no "Setter Responsible" key
            return fetchedResults.filter(result => !result["Setter Responsible"]);
        } else {
            return fetchedResults;
        }

    } catch (error) {
        console.error(error);
        throw new Error("Error fetching data. Please try again later.");
    }
}
