const { google } = require("googleapis");
const fs = require("fs").promises;
const path = require("path");

// Carrega as credenciais do JSON da conta de serviço
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, "../../chaves/drive-key.json"),
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({ version: "v3", auth });

const DB_FILE_ID = process.env.GOOGLE_DRIVE_DB_FILE_ID;
const BLOCOS_FOLDER_ID = process.env.GOOGLE_DRIVE_PASTA_BLOCOS_ID;

// ↓↓↓ 1. Ler blocosDB.json do Google Drive
async function getDBFileContent() {
  const res = await drive.files.get({
    fileId: DB_FILE_ID,
    alt: "media",
  });
  return res.data;
}

// ↓↓↓ 2. Atualizar blocosDB.json no Google Drive
async function updateDBFileContent(newContent) {
  const tempPath = path.join(__dirname, "../../temp-blocosDB.json");
  await fs.writeFile(tempPath, JSON.stringify(newContent, null, 2), "utf-8");

  await drive.files.update({
    fileId: DB_FILE_ID,
    media: {
      mimeType: "application/json",
      body: fs.createReadStream(tempPath),
    },
  });

  await fs.unlink(tempPath); // remove o temporário
}

// ↓↓↓ 3. Criar nova pasta no Drive (retorna ID)
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

// ↓↓↓ 4. Fazer upload de imagem para uma pasta específica
async function uploadImageToFolder(filePath, fileName, parentId) {
  const res = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [parentId],
    },
    media: {
      mimeType: "image/jpeg", // ajuste conforme necessário
      body: fs.createReadStream(filePath),
    },
    fields: "id, name",
  });

  return res.data;
}

// ↓↓↓ 5. Mover um item para outra pasta
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
  getDBFileContent,
  updateDBFileContent,
  createFolder,
  uploadImageToFolder,
  moveFileOrFolder,
};
