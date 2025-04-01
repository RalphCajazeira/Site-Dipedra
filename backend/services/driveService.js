const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");

const DB_PATH = path.join(__dirname, "../blocosDB.json");
const FOLDER_ID = process.env.GOOGLE_DRIVE_SITE_FOLDER_ID;

let drive;
let pastaBlocosID = null;

function autenticarGoogle() {
  if (drive) return drive;

  try {
    const json = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    const auth = new google.auth.GoogleAuth({
      credentials: json,
      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    drive = google.drive({ version: "v3", auth });
    return drive;
  } catch (err) {
    console.error(
      "❌ Erro ao carregar GOOGLE_SERVICE_ACCOUNT_JSON:",
      err.message
    );
    throw err;
  }
}

async function encontrarOuCriarPasta(nome, paiID) {
  const drive = autenticarGoogle();

  const resposta = await drive.files.list({
    q: `'${paiID}' in parents and name = '${nome}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: "files(id, name)",
  });

  if (resposta.data.files.length > 0) {
    return resposta.data.files[0].id;
  }

  const novaPasta = await drive.files.create({
    resource: {
      name: nome,
      mimeType: "application/vnd.google-apps.folder",
      parents: [paiID],
    },
    fields: "id",
  });

  return novaPasta.data.id;
}

async function baixarBlocosDB() {
  if (process.env.NODE_ENV !== "production") return;

  const drive = autenticarGoogle();

  const resposta = await drive.files.list({
    q: `'${FOLDER_ID}' in parents and name = 'blocosDB.json' and trashed = false`,
    fields: "files(id, name)",
  });

  if (resposta.data.files.length === 0) {
    console.warn("⚠️ blocosDB.json não encontrado no Drive.");
    return;
  }

  const fileId = resposta.data.files[0].id;

  const dest = fs.createWriteStream(DB_PATH);
  await drive.files
    .get({ fileId, alt: "media" }, { responseType: "stream" })
    .then(
      (res) =>
        new Promise((resolve, reject) => {
          res.data
            .on("end", () => {
              console.log("📥 blocosDB.json baixado para uso local.");
              resolve();
            })
            .on("error", reject)
            .pipe(dest);
        })
    );
}

async function salvarBlocosDBNoDrive() {
  if (process.env.NODE_ENV !== "production") return;

  const drive = autenticarGoogle();

  const resposta = await drive.files.list({
    q: `'${FOLDER_ID}' in parents and name = 'blocosDB.json' and trashed = false`,
    fields: "files(id, name)",
  });

  const fileMetadata = {
    name: "blocosDB.json",
    parents: [FOLDER_ID],
  };

  const media = {
    mimeType: "application/json",
    body: fs.createReadStream(DB_PATH),
  };

  if (resposta.data.files.length > 0) {
    const fileId = resposta.data.files[0].id;
    await drive.files.update({ fileId, media });
  } else {
    await drive.files.create({ resource: fileMetadata, media, fields: "id" });
  }

  console.log("📤 blocosDB.json atualizado no Drive.");
}

async function enviarArquivoParaDrive(localPath, caminhoRelativo) {
  if (process.env.NODE_ENV !== "production") return;

  const drive = autenticarGoogle();

  // Garante que a pasta blocos está criada
  if (!pastaBlocosID) {
    pastaBlocosID = await encontrarOuCriarPasta("blocos", FOLDER_ID);
  }

  const partes = caminhoRelativo
    .replace(/^\/?assets\/blocos\//, "")
    .split("/")
    .filter(Boolean);

  let parentId = pastaBlocosID;

  for (let i = 0; i < partes.length - 1; i++) {
    const nomePasta = partes[i];
    parentId = await encontrarOuCriarPasta(nomePasta, parentId);
  }

  const nomeArquivo = partes[partes.length - 1];

  const fileMetadata = {
    name: nomeArquivo,
    parents: [parentId],
  };

  const media = {
    body: fs.createReadStream(localPath),
  };

  await drive.files.create({
    resource: fileMetadata,
    media,
    fields: "id",
  });

  console.log(`✅ Arquivo ${nomeArquivo} enviado ao Drive.`);
}

module.exports = {
  baixarBlocosDB,
  salvarBlocosDBNoDrive,
  enviarArquivoParaDrive,
};
