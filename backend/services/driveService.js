const { google } = require("googleapis");
const fs = require("fs");
const fsPromises = require("fs/promises");
const path = require("path");

// Local e Romoto
const auth =
  process.env.NODE_ENV === "production"
    ? new google.auth.GoogleAuth({
        credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
        scopes: ["https://www.googleapis.com/auth/drive"],
      })
    : new google.auth.GoogleAuth({
        keyFile: path.join(__dirname, "../chaves/drive-key.json"),
        scopes: ["https://www.googleapis.com/auth/drive"],
      });

const drive = google.drive({ version: "v3", auth });

const DB_FILE_NAME = "blocosDB.json";
const SITE_FOLDER_ID = process.env.GOOGLE_DRIVE_SITE_FOLDER_ID;

// ↓↓↓ Encontrar ou criar o blocosDB.json no Drive
async function encontrarOuCriarDBFile() {
  const res = await drive.files.list({
    q: `'${SITE_FOLDER_ID}' in parents and name='${DB_FILE_NAME}' and trashed = false`,
    fields: "files(id, name)",
  });

  if (res.data.files.length > 0) {
    return res.data.files[0].id;
  }

  // Criar o arquivo vazio se não existir
  const fileMetadata = {
    name: DB_FILE_NAME,
    parents: [SITE_FOLDER_ID],
  };

  const media = {
    mimeType: "application/json",
    body: JSON.stringify({ arquivos: {}, pastas: [] }),
  };

  const createRes = await drive.files.create({
    requestBody: fileMetadata,
    media: {
      mimeType: media.mimeType,
      body: media.body,
    },
    fields: "id",
  });

  console.log(`📁 blocosDB.json criado no Drive com ID: ${createRes.data.id}`);
  return createRes.data.id;
}

// ↓↓↓ Baixar o blocosDB.json para uso local
async function baixarBlocosDB() {
  const fileId = await encontrarOuCriarDBFile();
  const destPath = path.join(__dirname, "../blocosDB.json");

  const res = await drive.files.get(
    {
      fileId,
      alt: "media",
    },
    { responseType: "stream" }
  );

  const dest = fs.createWriteStream(destPath);
  await new Promise((resolve, reject) => {
    res.data
      .on("end", () => {
        console.log("📥 blocosDB.json baixado para uso local.");
        resolve();
      })
      .on("error", (err) => {
        console.error("Erro ao baixar blocosDB.json:", err);
        reject(err);
      })
      .pipe(dest);
  });

  // Salva o ID em cache para reuso no upload
  process.env.DRIVE_DB_FILE_ID = fileId;
}

// ↓↓↓ Enviar o blocosDB.json local para o Drive
async function salvarBlocosDBNoDrive() {
  const fileId =
    process.env.DRIVE_DB_FILE_ID || (await encontrarOuCriarDBFile());
  const filePath = path.join(__dirname, "../blocosDB.json");

  await drive.files.update({
    fileId,
    media: {
      mimeType: "application/json",
      body: fs.createReadStream(filePath),
    },
  });

  console.log("📤 blocosDB.json atualizado no Google Drive.");
}

module.exports = {
  baixarBlocosDB,
  salvarBlocosDBNoDrive,
};
