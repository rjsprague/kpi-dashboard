

export default async function getUniqueLeadSources(req, res) {

    const leadSources = {       
        2323528185: "Other",
        2282145304: "Lead/Acquisition Manager - Nely",
        2282145210: "Lead/Acquisition Manager - Kevin",
        2282142797: "Lead Manager - Kay",
        2282139969: "Disposition Manager - Everyone",
        2014678698: "Telemarketing",
        2014635757: "Old",
        2014632267: "RVM",
        2014630459: "Postcards",
        2014579881: "Cold Call",
        2014540366: "SMS",
        2014539335: "Facebook",
        2014538978: "PPC",
        2014525323: "Other",
        2014484373: "SEO",
        2014476355: "CallRail",
        2014475213: "SmrtPhone",
        2014474716: "Investor Lift",
        2014474100: "Instapage",
        2014474016: "x0242"
         
    };

    // Get lead source items from API
    //const response = await fetch(`https://db.reiautomated.io/lead-sources/27203897`);
    //const text = await response.text();
    //const data = JSON.parse(text);

    // Create hash map of itemid as keys and title as values
    //const leadSourceMap = data.reduce((map, obj) => {
    //    map[obj.itemid] = obj.Title;
    //    return map;
    //}, {});

    // Use leadSourceMap hash map to get title of each itemid
    //const leadSourceItemsArray = Array.from(leadSourceItemsSet).map((obj) => {
    //    return {
    //        itemid: obj,
    //        title: leadSourceMap[obj]
    //    }
    //});
  
    //res.json(Array.from(leadSourceItemsArray));

    res.json(leadSources);
}
