// apiUtils.js
const handleAcquisitionKpis = async (apiName, apiEndpoint, filters) => {
    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
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
        } else if (apiName !== "Marketing Expenses" && apiName !== "Profit") {
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
        }
    } catch (error) {
        console.error(error);
        throw new Error("Error fetching data. Please try again later.");
    }
};

const handleTeamKpis = async (apiName, apiEndpoint, filters) => {
    console.log("apiName: ", apiName)

    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
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


export default async function fetchKPIs(apiName, apiEndpoint, filters, kpiView) {

    //console.log("apiName: ", apiName)
    //console.log("apiEndpoint: ", apiEndpoint)
    //console.log("filters: ", filters)
    //console.log("kpiView: ", kpiView)

    try {
        // Process the data based on the kpiView
        switch (kpiView) {
            case 'Financials':
                // Process and return data for Financial KPI view                
                break;

            case 'Acquisitions':
                // Process and return data for Acquisition KPI view
                return await handleAcquisitionKpis(apiName, apiEndpoint, filters);

            case 'Dispositions':
                // Process and return data for Disposition KPI view
                break;

            case 'Team':
                // Process and return data for Team KPI view
                return await handleTeamKpis(apiName, apiEndpoint, filters);

            default:
                console.error(`Unsupported KPI view: ${kpiView}`);
                throw new Error(`Unsupported KPI view: ${kpiView}`);
        }
    } catch (error) {
        console.error(error);
        throw new Error("Error fetching data. Please try again later.");
    }
};

