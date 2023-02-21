const faker = require('faker');
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://test-user:L3XCw57GbIF7oeo7@cluster0.tjsihpy.mongodb.net/?retryWrites=true&w=majority";
const client =  new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function insertLeads() {
  try {
    await client.connect();
    const db = client.db("REIA")  
    const leadsCollection = db.collection("Leads");
    console.log(`You have successfully connected to the ${leadsCollection.collectionName} collection of the ${db.databaseName} database.`)
    await leadsCollection.insertMany(leads);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
    
}

const leadSources = [
  'Online Ad',
  'Cold Call',
  'Referral',
  'Trade Show',
  'Web Search',
  'Partner',
  'Other'
];

const generateLead = () => {
  return {
    id: faker.datatype.uuid(),
    name: faker.name.findName(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
    created: faker.date.recent(90),
    source: leadSources[Math.floor(Math.random() * leadSources.length)],
    cost: Math.floor(Math.random() * 91) + 10,
    connected: faker.datatype.boolean(),
    triageCall: faker.datatype.boolean(),
    triageCallQualified: faker.datatype.boolean(),
    perfectPresentation: faker.datatype.boolean(),
    contracted: faker.datatype.boolean(),
    acquired: faker.datatype.boolean()
  };
};

const leads = [];

for (let i = 0; i < 1000; i++) {
  leads.push(generateLead());
}

insertLeads();

const fs = require('fs');

fs.writeFile('leads.json', JSON.stringify(leads), (err) => {
  if (err) throw err;
  console.log('The leads have been saved to leads.json file!');
});

