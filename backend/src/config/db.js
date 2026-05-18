const mongoose = require("mongoose");
const { config } = require("./env");

async function connectDB() {
  if (!config.mongodbEnabled) {
    console.warn("MongoDB disabled: set a real MONGODB_URI to use the backend database.");
    return;
  }

  await mongoose.connect(config.mongodbUri, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log("MongoDB connected");
}

function isDbReady() {
  return mongoose.connection.readyState === 1;
}

function dbStatus() {
  if (!config.mongodbEnabled) return "disabled";
  return isDbReady() ? "connected" : "connecting";
}

module.exports = {
  connectDB,
  dbStatus,
  isDbReady,
};
