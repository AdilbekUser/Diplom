const mongoose = require("mongoose");
const { config } = require("./env");

async function connectDB() {
  await mongoose.connect(config.mongodbUri, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log("MongoDB connected");
}

function isDbReady() {
  return mongoose.connection.readyState === 1;
}

module.exports = {
  connectDB,
  isDbReady,
};
