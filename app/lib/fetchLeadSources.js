import Cookies from 'js-cookie';

async function fetchLeadSources(clientSpaceId) {
    const accessToken = Cookies.get('token')
    const closersSpaceId = Number(process.env.NEXT_PUBLIC_ACQUISITIONS_SPACEID)


    // console.log("fetchLeadSources clientSpaceId", clientSpaceId)
    // console.log("fetchLeadSources accessToken", accessToken)
    // console.log("fetchLeadSources closersSpaceId", closersSpaceId)

    try {

        let apiUrl;
        let bearerToken;

        if (clientSpaceId === closersSpaceId) {
            apiUrl = '/api/closers/acquisitions/lead-sources';
            bearerToken = closersSpaceId;
        } else {
            apiUrl = '/api/lead-sources';
            bearerToken = clientSpaceId;
        }

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                "spaceid": bearerToken,
            })
        });

        // console.log('Lead Sources Response:', response);

        if (!response.ok) {
            console.error(response)
            throw new Error("Something went wrong on api server!", response);
        }

        const data = await response.json();
        // console.log(data)
        // console.log("data", data?.data[1]?.Status && data.data[1].Status[0])

        // filter out object with a field called "Status" that has a value of "Inactive"
        // if an item doesn't have a "Status" field, it will be included in the filtered data
        const filteredData = data.data.filter((item) => {
            if (item.Status) {
                return item.Status[0] !== "Inactive";
            } else {
                return item;
            }
        });

        const sortedData = filteredData.sort(
            (a, b) => b["Count of Seller Leads"] - a["Count of Seller Leads"]
        );

        const leadSourceMap = {};

        for (const source of sortedData) {
            if (source.Title) {
                leadSourceMap[source.Title] = parseInt(source.itemid, 10);
            }
        }
        // console.log("leadSourceMap", leadSourceMap)
        // console.log("lead sources values ", Object.values(leadSourceMap))
        return leadSourceMap;

    } catch (error) {
        console.error(error);
        throw new Error("Error fetching lead sources. Please try again later.", error);
    }
}

export default fetchLeadSources;
