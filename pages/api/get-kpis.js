import { connectToDb } from '../../lib/mongodb'

export default async (req, res) => {
  const client = await connectToDb();
  
  const { leadSource, dateRange } = req.body;

  try {
    
    const db = client.db("REIA");
    const kpisCollection = db.collection("Leads");

    let query = {};
    if (leadSource !== "all") {
      query.source = leadSource;
    }

    if (dateRange === "lastWeek") {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      query.created = { $gte: lastWeek };
    }
    if (dateRange === "lastMonth") {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      query.created = { $gte: lastMonth };
    }
    if (dateRange === "lastQuarter") {
      const lastQuarter = new Date();
      lastQuarter.setMonth(lastQuarter.getMonth() - 3);
      query.created = { $gte: lastQuarter };
    }

    const leads = await kpisCollection.find(query).toArray();

    // Calculate cost per lead
    const marketingSpend = leads.reduce((acc, lead) => acc + lead.cost , 0);
    const costPerLead = (marketingSpend / leads.length);

    // Calculate percent of connected leads
    const connectedLeads = leads.filter(lead => lead.connected === true);
    const percentConnectedLeads = (connectedLeads.length / leads.length * 100);

    // Calculate percent of triage calls
    const triageCalls = leads.filter(lead => lead.triageCall === true);
    const percentTriageCalls = (triageCalls.length / connectedLeads.length * 100);

    // Calculate percent of qualified triage calls
    const qualTriageCalls = leads.filter(lead => lead.triageCallQualified === true);
    const percentQualTriageCalls = (qualTriageCalls.length / triageCalls.length * 100);

    // Calculate percent of qualified triage calls
    const perfectPresentations = leads.filter(lead => lead.perfectPresentation === true);
    const percentPerfectPresentations = (perfectPresentations.length / qualTriageCalls.length * 100);

    // Calculate percent of qualified triage calls
    const contracted = leads.filter(lead => lead.contracted === true);
    const percentContracted = (contracted.length / perfectPresentations.length * 100);

    // Calculate percent of qualified triage calls
    const acquired = leads.filter(lead => lead.acquired === true);
    const percentAcquired = (acquired.length / contracted.length * 100);

    // Calculate Cost per Acquisition
    const costPerAcquisition = ( marketingSpend / acquired.length );

    // 
    res.json([
      //{name:"Marketing Spend", current:(Math.floor(Math.random() * 500) + 100), redFlag:null, target:null, data1:null, data2:null },
      {name:"Cost Per Lead", current:(Math.floor(Math.random() * 60) + 20), redFlag:60.00, target:35.00, data1:"Marketing: $6600", data2:"Leads: 100"},
      {name:"Lead Connection", current:(Math.floor(Math.random() * 40) + 60), redFlag:70, target:80, data1:"Leads: 100", data2:"Connections: 60"},
      {name:"Triage ", current:(Math.floor(Math.random() * 50) + 40), redFlag:60, target:75, data1:"Connections: 60", data2:"Triages: 35"}, 
      {name:"Triage Qualification", current:(Math.floor(Math.random() * 60) + 30), redFlag:50, target:70, data1:"Triages: 35", data2:"Qualified: 28"}, 
      {name:"Deal Analysis Approval", current:(Math.floor(Math.random() * 40) + 50), redFlag:65, target:80, data1:"Qualified: 28", data2:"Approvals: 20"},
      {name:"Presentation Rate", current:(Math.floor(Math.random() * 40) + 50), redFlag:65, target:80, data1:"Approvals: 20", data2:"Presentations: 18"},
      {name:"Contract Rate", current:(Math.floor(Math.random() * 40)), redFlag:10, target:25, data1:"Presentations: 18", data2:"Contracts: 5"},
      {name:"Acquisition Rate", current:(Math.floor(Math.random() * 60) + 30), redFlag:50, target:75, data1:"Contracts: 5", data2:"Acquisitions: 4"},
      //{name:"Deals", current:(Math.floor(Math.random() * 10) + 5), redFlag:7, target:20, data1:null, data2:null},
      //{name:"Profit", current:(Math.floor(Math.random() * 20000) + 100000), redFlag:null, target:null, data1:null, data2:null},
      //{name:"Avg Profit Per Deal", current:((Math.floor(Math.random() * 20000) + 100000)/(Math.floor(Math.random() * 10) + 5)).toFixed(2), redFlag:null, target:null, data1:326000, data2:14},
      //{name:"Cost Per Acquisition", current:costPerAcquisition, redFlag:120, target:70, data1:marketingSpend, data2:acquired.length}
    ]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching kpi");
  }
};
