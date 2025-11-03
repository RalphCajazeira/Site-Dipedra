require("../config/register-alias");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { env } = require("@/config/env");
const { ensureDirectoryExists } = require("@/utils/file-system");
const { slugify } = require("@/utils/slugify");
const { normalizeAmbientes } = require("@/utils/ambientes");

ensureUploadDirectory();

function ensureUploadDirectory() {
  ensureDirectoryExists(env.upload.catalogDir);
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, env.upload.catalogDir);
  },
  filename: (req, file, cb) => {
    const { nome = "item", tipo = "tipo", material = "material" } = req.body;
    const ambientes = normalizeAmbientes(req.body.ambientes);
    const primaryAmbiente = ambientes[0] || "ambiente";

    const baseName = [
      slugify(nome),
      slugify(tipo || "tipo"),
      slugify(material || "material"),
      slugify(primaryAmbiente),
    ].join("---");

    const existingFiles = fs
      .readdirSync(env.upload.catalogDir)
      .filter((fileName) => fileName.startsWith(baseName));

    const usedNumbers = existingFiles
      .map((fileName) => {
        const match = fileName.match(/---(\d+)\.[a-zA-Z0-9]+$/);
        return match ? parseInt(match[1], 10) : null;
      })
      .filter((value) => value !== null)
      .sort((a, b) => a - b);

    let nextNumber = 1;
    for (const value of usedNumbers) {
      if (value === nextNumber) {
        nextNumber += 1;
      } else if (value > nextNumber) {
        break;
      }
    }

    const extension = path.extname(file.originalname) || ".jpg";
    const filename = `${baseName}---${nextNumber}${extension}`;

    cb(null, filename);
  },
});

const uploadCatalogImages = multer({ storage });

module.exports = { uploadCatalogImages };
