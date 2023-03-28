export default async function getUniqueLeadSources(req, res) {

    // Get lead source items from API
    const leadSources = await fetch("https://db.reiautomated.io/lead-sources")
        .then((res) => {
            if (res.status === 200) {
                return res.json();
            } else {
                throw new Error("Something went wrong on api server!");
            }
        })
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.error(error);
        });

    // Create hash map of itemid as key and title as value
    const leadSourceMap = {};

    for (const source of leadSources.data) {
        if (source.Title) {
            leadSourceMap[source.Title] = parseInt(source.itemid, 10);
        }        
    };

    res.json(leadSourceMap);
}
