const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

module.exports = async function() {
  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  process.env.MONGO_URI = uri;
  
  mongoose.set('strictQuery', false);
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  
  global.__MONGOD__ = mongoServer;
};