const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const backendRoot = path.join(__dirname, "..", "..");
const projectRoot = path.join(backendRoot, "..");
const dataDir = path.join(backendRoot, "var");
const defaultSqliteFile = path.join(dataDir, "database.sqlite");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const databaseUrl =
  process.env.DATABASE_URL || `file:${defaultSqliteFile.replace(/\\/g, "/")}`;

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = databaseUrl;
}

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 3000,
  databaseUrl,
  auth: {
    jwtSecret: process.env.JWT_SECRET || "change-me-in-production",
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "8h",
  },
  upload: {
    catalogDir:
      process.env.CATALOG_UPLOAD_DIR ||
      path.join(projectRoot, "assets", "images", "catalogo"),
  },
};

module.exports = { env };
