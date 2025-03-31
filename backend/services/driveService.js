// backend/services/driveService.js
const { google } = require("googleapis");
const fs = require("fs").promises;
const fstream = require("fs");
const path = require("path");
require("dotenv").config();

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, "../chaves/drive-key.json"),
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({ version: "v3", auth });

const DB_FILE_ID = process.env.GOOGLE_DRIVE_DB_FILE_ID;
const BLOCOS_FOLDER_ID = process.env.GOOGLE_DRIVE_PASTA_BLOCOS_ID;
const isProd = process.env.NODE_ENV === "production";
const LOCAL_DB_PATH = path.join(__dirname, "../../blocosDB.json");

async function baixarBlocosDB() {
  if (!isProd) {
    console.log("🛠️ Ambiente local: usando blocosDB.json local");
    return;
  }

  try {
    const res = await drive.files.get({
      fileId: DB_FILE_ID,
      alt: "media",
    });

    const data = JSON.stringify(res.data, null, 2);
    await fs.writeFile(LOCAL_DB_PATH, data, "utf-8");

    console.log("📄 blocosDB.json encontrado no Drive:", DB_FILE_ID);
    console.log("📥 blocosDB.json baixado para uso local.");
  } catch (error) {
    console.error("❌ Erro ao baixar blocosDB.json do Drive:", error.message);
    throw error;
  }
}

async function getDBFileContent() {
  if (!isProd) {
    const localContent = await fs.readFile(LOCAL_DB_PATH, "utf-8");
    return JSON.parse(localContent);
  }

  const res = await drive.files.get({
    fileId: DB_FILE_ID,
    alt: "media",
  });
  return res.data;
}

async function updateDBFileContent(newContent) {
  const json = JSON.stringify(newContent, null, 2);

  if (!isProd) {
    await fs.writeFile(LOCAL_DB_PATH, json, "utf-8");
    return;
  }

  const tempPath = path.join(__dirname, "../../temp-blocosDB.json");
  await fs.writeFile(tempPath, json, "utf-8");

  await drive.files.update({
    fileId: DB_FILE_ID,
    media: {
      mimeType: "application/json",
      body: fstream.createReadStream(tempPath),
    },
  });

  await fs.unlink(tempPath);
}

async function createFolder(name, parentId = BLOCOS_FOLDER_ID) {
  const res = await drive.files.create({
    resource: {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId],
    },
    fields: "id",
  });

  return res.data.id;
}

async function uploadImageToFolder(filePath, fileName, parentId) {
  const res = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [parentId],
    },
    media: {
      mimeType: "image/jpeg",
      body: fstream.createReadStream(filePath),
    },
    fields: "id, name",
  });

  return res.data;
}

async function moveFileOrFolder(fileId, newParentId) {
  const file = await drive.files.get({
    fileId,
    fields: "parents",
  });

  const previousParents = file.data.parents.join(",");
  await drive.files.update({
    fileId,
    addParents: newParentId,
    removeParents: previousParents,
    fields: "id, parents",
  });
}

module.exports = {
  baixarBlocosDB,
  getDBFileContent,
  updateDBFileContent,
  createFolder,
  uploadImageToFolder,
  moveFileOrFolder,
};
