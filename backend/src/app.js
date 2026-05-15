const express = require("express");
const cors = require("cors");
const path = require("path");
const { isDbReady } = require("./config/db");
const { config } = require("./config/env");
const createApiRouter = require("./routes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();
const staticDir = path.join(__dirname, "..", "..", "docs");

function splitOrigins(value) {
  return String(value || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

const allowedOrigins = new Set([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  ...splitOrigins(config.frontendOrigin),
]);
const githubPagesOrigin = /^https:\/\/[a-z0-9-]+\.github\.io$/i;

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(origin) || githubPagesOrigin.test(origin)) return callback(null, true);
      if (config.nodeEnv !== "production") return callback(null, true);
      return callback(new Error("Origin is not allowed by CORS"));
    },
  })
);
app.use(express.json());

app.use((req, res, next) => {
  if (req.path.endsWith(".js") || req.path.endsWith(".css") || req.path === "/") {
    res.setHeader("Cache-Control", "no-store");
  }
  next();
});

app.use(express.static(staticDir));

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    brand: "ORDA Smart Event System",
    database: isDbReady() ? "connected" : "connecting",
  });
});

app.use(createApiRouter());
app.use("/api", createApiRouter());

app.use((req, res, next) => {
  if (req.method === "GET" && req.accepts("html")) {
    return res.sendFile(path.join(staticDir, "index.html"));
  }

  return next();
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
