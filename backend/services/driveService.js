require("dotenv").config();
const { google } = require("googleapis");
const fs = require("fs");
const fsp = fs.promises;
const path = require("path");

// Autenticação com conta de serviço
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, "../chaves/drive-key.json"),
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({ version: "v3", auth });

// IDs fixos no .env
const SITE_FOLDER_ID = process.env.GOOGLE_DRIVE_SITE_FOLDER_ID;
const BLOCOS_FOLDER_ID = process.env.GOOGLE_DRIVE_PASTA_BLOCOS_ID;

// Esse ID será preenchido dinamicamente
let blocosDBFileId = null;

// 🔍 Encontra ou cria o arquivo blocosDB.json na pasta Site-Dipedra
async function encontrarOuCriarBlocosDB() {
  const res = await drive.files.list({
    q: `'${SITE_FOLDER_ID}' in parents and name = 'blocosDB.json' and trashed = false`,
    fields: "files(id, name)",
  });

  if (res.data.files.length > 0) {
    blocosDBFileId = res.data.files[0].id;
    console.log("📄 blocosDB.json encontrado no Drive:", blocosDBFileId);
    return;
  }

  // Se não encontrou, cria um novo arquivo
  const conteudoInicial = JSON.stringify({ arquivos: {}, pastas: [] }, null, 2);
  const tempPath = path.join(__dirname, "../../temp-blocosDB.json");
  await fsp.writeFile(tempPath, conteudoInicial, "utf-8");

  const criado = await drive.files.create({
    requestBody: {
      name: "blocosDB.json",
      mimeType: "application/json",
      parents: [SITE_FOLDER_ID],
    },
    media: {
      mimeType: "application/json",
      body: fs.createReadStream(tempPath),
    },
    fields: "id",
  });

  blocosDBFileId = criado.data.id;
  console.log("✅ blocosDB.json criado no Drive:", blocosDBFileId);
  await fsp.unlink(tempPath);
}

// 📥 Baixar o conteúdo do blocosDB.json
async function getDBFileContent() {
  if (!blocosDBFileId)
    throw new Error("blocosDB.json ainda não foi identificado.");
  const res = await drive.files.get({
    fileId: blocosDBFileId,
    alt: "media",
  });
  return res.data;
}

// 📤 Atualizar o conteúdo de blocosDB.json
async function updateDBFileContent(newContent) {
  if (!blocosDBFileId)
    throw new Error("blocosDB.json ainda não foi identificado.");

  const tempPath = path.join(__dirname, "../../temp-blocosDB.json");
  await fsp.writeFile(tempPath, JSON.stringify(newContent, null, 2), "utf-8");

  await drive.files.update({
    fileId: blocosDBFileId,
    media: {
      mimeType: "application/json",
      body: fs.createReadStream(tempPath),
    },
  });

  await fsp.unlink(tempPath);
}

// 📁 Criar nova pasta dentro de outra pasta
async function createFolder(name, parentId = BLOCOS_FOLDER_ID) {
  const res = await drive.files.create({
    requestBody: {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId],
    },
    fields: "id",
  });

  return res.data.id;
}

// 📷 Upload de imagem para uma pasta
async function uploadImageToFolder(filePath, fileName, parentId) {
  const res = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [parentId],
    },
    media: {
      mimeType: "image/jpeg",
      body: fs.createReadStream(filePath),
    },
    fields: "id, name",
  });

  return res.data;
}

// 🔁 Mover arquivo ou pasta
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

// 🧠 Inicializa o banco (chamada no server.js)
async function baixarBlocosDB() {
  await encontrarOuCriarBlocosDB();
  const db = await getDBFileContent();
  const localPath = path.join(__dirname, "../../blocosDB.json");
  await fsp.writeFile(localPath, JSON.stringify(db, null, 2), "utf-8");
  console.log("📥 blocosDB.json baixado para uso local.");
}

module.exports = {
  baixarBlocosDB,
  getDBFileContent,
  updateDBFileContent,
  createFolder,
  uploadImageToFolder,
  moveFileOrFolder,
};
