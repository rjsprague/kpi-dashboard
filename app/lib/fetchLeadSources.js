import cookies from 'js-cookie';

async function fetchLeadSources(clientSpaceId) {

    const accessToken = cookies.get('accessToken');

    // console.log("fetchLeadSources clientSpaceId", clientSpaceId)
    // console.log("fetchLeadSources accessToken", accessToken)

    // const closersSpaceId = process.env.NEXT_PUBLIC_ACQUISITIONS_SPACEID
    // console.log("fetchLeadSources closersSpaceId", closersSpaceId)

    try {
        const response = await fetch('/api/lead-sources', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                "spaceid": clientSpaceId,
            })
        });

        //console.log('Lead Sources Response:', response);

        if (!response.ok) {
            console.error(response)
            throw new Error("Something went wrong on api server!", response);
        }

        const data = await response.json();

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

        // console.log("filteredData", filteredData)

        const sortedData = filteredData.sort(
            (a, b) => b["Count of Seller Leads"] - a["Count of Seller Leads"]
        );

        // console.log("sortedData", sortedData)

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
