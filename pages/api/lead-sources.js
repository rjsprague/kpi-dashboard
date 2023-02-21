import { connectToDb } from '../../lib/mongodb'

async function getUniqueLeadSources(req, res) {
    const client = await connectToDb();
    try {
        const db = client.db("REIA");
        const result = await db.command({ distinct: "Leads", key: "source" });
        res.json(result.values); 
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching lead sources");
    } 
}

module.exports = getUniqueLeadSources;
