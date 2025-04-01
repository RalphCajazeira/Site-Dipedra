const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
require("dotenv").config();

const KEY_PATH = path.join(__dirname, "../chaves/drive-key.json");
const auth = new google.auth.GoogleAuth({
  keyFile: KEY_PATH,
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({ version: "v3", auth });

const FOLDER_BLOCOS_ID = process.env.GOOGLE_DRIVE_PASTA_BLOCOS_ID;

// Cria subpasta dentro de "Blocos" se não existir
async function criarPastaNoDrive(nomeDaPasta, parentId = FOLDER_BLOCOS_ID) {
  const res = await drive.files.list({
    q: `name='${nomeDaPasta}' and mimeType='application/vnd.google-apps.folder' and '${parentId}' in parents and trashed=false`,
    fields: "files(id, name)",
  });

  if (res.data.files.length) return res.data.files[0].id;

  const pasta = await drive.files.create({
    requestBody: {
      name: nomeDaPasta,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId],
    },
    fields: "id",
  });

  return pasta.data.id;
}

// Upload de imagem para o Drive na pasta correta
async function uploadImagemParaDrive(
  caminhoLocal,
  nomeArquivo,
  caminhoVirtual
) {
  const partes = caminhoVirtual.replace(/^\/+/, "").split("/");
  let parentId = FOLDER_BLOCOS_ID;

  for (const parte of partes) {
    if (!parte.trim()) continue;
    parentId = await criarPastaNoDrive(parte, parentId);
  }

  const fileMetadata = {
    name: nomeArquivo,
    parents: [parentId],
  };

  const media = {
    mimeType: "image/jpeg",
    body: fs.createReadStream(caminhoLocal),
  };

  const res = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: "id",
  });

  const fileId = res.data.id;

  // Torna o arquivo público
  await drive.permissions.create({
    fileId,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  return `https://drive.google.com/uc?id=${fileId}`;
}

module.exports = { uploadImagemParaDrive };
