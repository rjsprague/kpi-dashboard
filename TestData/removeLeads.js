const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://rjsprague:XbAonDmri5EUM8CQ@cluster1.ozwx4lw.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useUnifiedTopology: true });

async function deleteAllLeads() {
    try {
      await client.connect();
      const db = client.db("REIA");
      const leadsCollection = db.collection("Leads");
      const result = await leadsCollection.deleteMany({});
      console.log(`Deleted ${result.deletedCount} documents from the leads collection`);
    } catch (error) {
      console.error(error);
    } finally {
      await client.close();
    }
  }

  deleteAllLeads();