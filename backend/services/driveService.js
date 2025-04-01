const { google } = require("googleapis");
const fs = require("fs");
const fsp = require("fs").promises;
const path = require("path");

let credentials;

if (process.env.NODE_ENV === "production") {
  try {
    credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  } catch (err) {
    console.error(
      "❌ Erro ao carregar GOOGLE_SERVICE_ACCOUNT_JSON:",
      err.message
    );
    process.exit(1);
  }
} else {
  try {
    credentials = require("../chaves/drive-key.json");
  } catch (err) {
    console.error("❌ Erro ao carregar chaves locais do Google:", err.message);
    process.exit(1);
  }
}

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({ version: "v3", auth });

const SITE_FOLDER_ID = process.env.GOOGLE_DRIVE_SITE_FOLDER_ID;
const BLOCOS_FOLDER_ID = process.env.GOOGLE_DRIVE_PASTA_BLOCOS_ID;

let DB_FILE_ID = null;

// ↓↓↓ 1. Baixar blocosDB.json do Drive
async function baixarBlocosDB() {
  const res = await drive.files.list({
    q: `'${SITE_FOLDER_ID}' in parents and name='blocosDB.json' and trashed=false`,
    fields: "files(id, name)",
  });

  if (!res.data.files.length) {
    throw new Error("blocosDB.json não encontrado no Drive.");
  }

  DB_FILE_ID = res.data.files[0].id;

  const destPath = path.join(__dirname, "../blocosDB.json");
  const dest = fs.createWriteStream(destPath);

  await new Promise((resolve, reject) => {
    drive.files.get(
      { fileId: DB_FILE_ID, alt: "media" },
      { responseType: "stream" },
      (err, res) => {
        if (err) return reject(err);
        res.data
          .on("end", () => {
            console.log("📥 blocosDB.json baixado do Drive.");
            resolve();
          })
          .on("error", reject)
          .pipe(dest);
      }
    );
  });
}

// ↓↓↓ 2. Salvar blocosDB.json no Drive
async function salvarBlocosDBNoDrive() {
  if (!DB_FILE_ID) {
    throw new Error("DB_FILE_ID não definido. Verifique se baixou do Drive.");
  }

  const dbPath = path.join(__dirname, "../blocosDB.json");

  await drive.files.update({
    fileId: DB_FILE_ID,
    media: {
      mimeType: "application/json",
      body: fs.createReadStream(dbPath),
    },
  });

  console.log("📤 blocosDB.json atualizado no Drive.");
}

// ↓↓↓ 3. Criar pastas recursivamente no Drive
async function criarPastaNoDrive(caminhoRelativo) {
  const partes = caminhoRelativo
    .replace(/^\/assets\/blocos\/?/, "")
    .split("/")
    .filter(Boolean);

  let parentId = BLOCOS_FOLDER_ID;

  for (const parte of partes) {
    const query = `'${parentId}' in parents and name='${parte}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
    const res = await drive.files.list({ q: query, fields: "files(id)" });

    if (res.data.files.length) {
      parentId = res.data.files[0].id;
    } else {
      const novaPasta = await drive.files.create({
        resource: {
          name: parte,
          mimeType: "application/vnd.google-apps.folder",
          parents: [parentId],
        },
        fields: "id",
      });
      parentId = novaPasta.data.id;
    }
  }

  return parentId;
}

// ↓↓↓ 4. Enviar imagem para o Drive
async function uploadImagemParaDrive(caminhoRelativo, file, nomeFinal) {
  const parentId = await criarPastaNoDrive(caminhoRelativo);

  await drive.files.create({
    requestBody: {
      name: nomeFinal,
      parents: [parentId],
    },
    media: {
      mimeType: file.mimetype,
      body: fs.createReadStream(file.path),
    },
  });

  await fsp.unlink(file.path);
}

module.exports = {
  baixarBlocosDB,
  salvarBlocosDBNoDrive,
  criarPastaNoDrive,
  uploadImagemParaDrive,
};
