

export default async function getUniqueLeadSources(req, res) {
    // Get data from API
    const response = await fetch(`https://db.reiautomated.io/seller-leads/23642479`);
    const text = await response.text();
    const data = JSON.parse(text);
    
    const { dateRange } = req.query;
    //console.log("dateRange ", dateRange);

    /* Filter data by date range using start_utc
    "Lead Created On": {
        "start": "2023-03-01 11:49:13",
        "start_date": "2023-03-01",
        "start_date_utc": "2023-03-01",
        "start_time": "11:49:13",
        "start_time_utc": "21:49:13",
        "start_utc": "2023-03-01 21:49:13"
    }*/
    let filteredData = data;
    //console.log(new Date(data[11]['Lead Created On'].start_date_utc));

    if (dateRange === "Last Week") {
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        filteredData = data.filter(obj => obj['Lead Created On'] && new Date(obj['Lead Created On'].start_utc) > lastWeek);
        //console.log("filteredData ", filteredData.length);
    }
    if (dateRange === "Last Month") {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        filteredData = data.filter(obj => obj['Lead Created On'] && new Date(obj['Lead Created On'].start_utc) > lastMonth);
        //console.log("filteredData ", filteredData.length);
    }
    if (dateRange === "Last Quarter") {
        const lastQuarter = new Date();
        lastQuarter.setMonth(lastQuarter.getMonth() - 3);
        filteredData = data.filter(obj => obj['Lead Created On'] && new Date(obj['Lead Created On'].start_utc) > lastQuarter);
        //console.log("filteredData ", filteredData.length);
    }
    //console.log("filteredData ", filteredData);

    // Get unique lead source items
    const leadSourceItems = filteredData.map((obj) => obj['Lead Source Item']);
    const leadSourceItemsSet = new Set(leadSourceItems.flat().filter(Boolean));
    console.log("leadSourceItemsSet ", leadSourceItemsSet);

    res.json(Array.from(leadSourceItemsSet));
}
