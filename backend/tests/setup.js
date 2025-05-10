const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

module.exports = async function() {
  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  mongoose.set('strictQuery', false);
  await mongoose.connect(uri);
  
  // Store references for teardown
  global.__MONGOD__ = mongoServer;
  global.__MONGOOSE__ = mongoose;
};