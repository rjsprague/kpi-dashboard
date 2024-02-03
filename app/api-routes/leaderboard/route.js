import { MongoClient, ServerApiVersion } from 'mongodb';
import { NextResponse } from 'next/server';

export async function GET(req, res) {
    
    const url = new URL(req.url);
    const year = url.searchParams.get('year');
    const month = url.searchParams.get('month');

    const mongodb_password = process.env.MONGODB_PASSWORD;
    
    const uri = `mongodb://reiautomated:${mongodb_password}@ac-8zn8aei-shard-00-00.tjsihpy.mongodb.net:27017,ac-8zn8aei-shard-00-01.tjsihpy.mongodb.net:27017,ac-8zn8aei-shard-00-02.tjsihpy.mongodb.net:27017/?ssl=true&replicaSet=atlas-xo8f03-shard-0&authSource=admin&retryWrites=true&w=majority`;
    
    const client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });

    try {
        await client.connect();
        const collection = client.db('REIA').collection('Leaderboard');

        const data = await collection.find({ year, month }).toArray();

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to connect to the database' });
    } finally {
        await client.close();
    }
}
