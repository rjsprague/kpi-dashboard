async function fetchLeadSources() {
    try {
      const leadSources = await fetch('/api/lead-sources');
  
      //console.log('Lead Sources Response:', leadSources);

      if (!leadSources.ok) {
        throw new Error("Something went wrong on api server!");
      }
  
      const data = await leadSources.json();

      //console.log("data", data)
  
      const filteredData = data.data.filter(
        (source) => source.Status !== "Inactive"
      );
  
      const sortedData = filteredData.sort(
        (a, b) => b["Count of Seller Leads"] - a["Count of Seller Leads"]
      );
  
      const leadSourceMap = {};
  
      for (const source of sortedData) {
        if (source.Title) {
          leadSourceMap[source.Title] = parseInt(source.itemid, 10);
        }
      }
      console.log("leadSourceMap", leadSourceMap)
      console.log("lead sources values ", Object.values(leadSourceMap))
      return leadSourceMap;

    } catch (error) {
      console.error(error);
      throw new Error("Error fetching lead sources. Please try again later.");
    }
  }
  
  export default fetchLeadSources;
  