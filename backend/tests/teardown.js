module.exports = async function() {
  await global.__MONGOOSE__.disconnect();
  await global.__MONGOD__.stop();
};