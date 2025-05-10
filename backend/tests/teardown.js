const mongoose = require('mongoose');

module.exports = async function() {
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
  }
  if (global.__MONGOD__) {
    await global.__MONGOD__.stop();
  }
};