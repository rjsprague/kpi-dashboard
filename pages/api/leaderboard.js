import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  const { year, month } = req.query;

  const mongodb_password = process.env.MONGODB_PASSWORD;
  const uri = `mongodb+srv://rjsprague:${mongodb_password}@cluster0.tjsihpy.mongodb.net/?retryWrites=true&w=majority`;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const collection = client.db('REIA').collection('Leaderboard');

    const data = await collection.find({ year, month }).toArray();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to connect to the database' });
  } finally {
    await client.close();
  }
}
