const MongoClient = require('mongodb').MongoClient;

const uri = process.env.MONGODB_URI

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

let _client;

const connectToDb = async function () {
  if (!_client) {
    _client = MongoClient.connect(uri, {
      maxPoolSize: 200,
      wtimeoutMS: 2000,
      useNewUrlParser: true
    });
  }
  return _client;
};

module.exports = {
  connectToDb,
};