const fs = require("fs");
const path = require("path");

function loadEnvFile() {
  const envPath = path.join(__dirname, "..", "..", "..", ".env");

  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile();

function isPlaceholderMongoUri(value) {
  return (
    !value ||
    /username:password/i.test(value) ||
    /cluster\.mongodb\.net/i.test(value) ||
    /<your-mongodb-atlas-uri>/i.test(value)
  );
}

const mongodbUri = process.env.MONGODB_URI || "";
const nodeEnv = process.env.NODE_ENV || "development";

const config = {
  port: process.env.PORT || 3000,
  nodeEnv,
  jwtSecret: process.env.JWT_SECRET,
  mongodbUri,
  mongodbEnabled: !isPlaceholderMongoUri(mongodbUri),
  frontendOrigin: process.env.FRONTEND_ORIGIN || process.env.CORS_ORIGIN || "",
};

function validateConfig() {
  const missing = [];
  if (!config.jwtSecret) missing.push("JWT_SECRET");
  if (config.nodeEnv === "production" && !config.mongodbEnabled) missing.push("MONGODB_URI");

  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

module.exports = {
  config,
  validateConfig,
};
