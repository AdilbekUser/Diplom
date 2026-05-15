const app = require("./app");
const { config, validateConfig } = require("./config/env");
const { connectDB } = require("./config/db");

async function start() {
  validateConfig();

  connectDB().catch((err) => {
    console.error("MongoDB error:", err.message);
  });

  app.listen(config.port, () => {
    console.log(`ORDA Smart Event System: http://localhost:${config.port}`);
  });
}

start().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
