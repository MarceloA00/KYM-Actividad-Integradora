const { MongoMemoryServer } = require('mongodb-memory-server');

module.exports = async function () {
  global.__MONGOD__ = await MongoMemoryServer.create();
  process.env.MONGO_URI = global.__MONGOD__.getUri();
};