const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

const GOOGLE_DRIVE_SITE_FOLDER_ID = process.env.GOOGLE_DRIVE_SITE_FOLDER_ID;

// Modo local carrega a chave do JSON, produção usa variável de ambiente
let auth;
if (process.env.NODE_ENV === "production") {
  const key = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  auth = new google.auth.GoogleAuth({
    credentials: key,
    scopes: ["https://www.googleapis.com/auth/drive"],
  });
} else {
  auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, "../chaves/drive-key.json"),
    scopes: ["https://www.googleapis.com/auth/drive"],
  });
}

const drive = google.drive({ version: "v3", auth });

const DRIVE_FOLDER_NOT_FOUND = "DRIVE_FOLDER_NOT_FOUND";

function normalizeDrivePath(caminhoRelativo = "") {
  const sanitized = caminhoRelativo
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");

  const partes = sanitized ? sanitized.split("/").filter(Boolean) : [];

  if (partes[0] === "assets") {
    partes.shift();
  }

  if (partes.length === 0 || partes[0] !== "blocos") {
    partes.unshift("blocos");
  }

  return partes.join("/");
}

async function findFolderIdByName(nome, parentId) {
  const sanitizedName = nome.replace(/'/g, "\\'");
  const res = await drive.files.list({
    q: `'${parentId}' in parents and name = '${sanitizedName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: "files(id, name)",
  });

  if (res.data.files.length === 0) return null;
  return res.data.files[0].id;
}

async function createFolder(name, parentId) {
  const existingId = await findFolderIdByName(name, parentId);
  if (existingId) {
    return { id: existingId, name };
  }

  const nova = await drive.files.create({
    resource: {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId],
    },
    fields: "id, name, parents",
  });

  return nova.data;
}

async function getDriveFolderId(caminhoRelativo = "", options = {}) {
  const { createIfMissing = false } = options;

  const normalizado = normalizeDrivePath(caminhoRelativo);
  const partes = normalizado.split("/").filter(Boolean);

  let parentId = GOOGLE_DRIVE_SITE_FOLDER_ID;

  for (const parte of partes) {
    let folderId = await findFolderIdByName(parte, parentId);

    if (!folderId) {
      if (!createIfMissing) {
        const erro = new Error(
          `Pasta "${parte}" não encontrada no caminho "${normalizado}".`
        );
        erro.code = DRIVE_FOLDER_NOT_FOUND;
        erro.drivePath = normalizado;
        throw erro;
      }
      const criada = await createFolder(parte, parentId);
      folderId = criada.id;
    }

    parentId = folderId;
  }

  return parentId;
}

async function listDriveFilesInFolder(folderId) {
  const res = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: "files(id, name, mimeType)",
  });

  return res.data.files || [];
}

async function moveFileOrFolder(fileId, newParentId) {
  const file = await drive.files.get({ fileId, fields: "parents" });
  const previousParents = (file.data.parents || []).join(",");

  return drive.files.update({
    fileId,
    addParents: newParentId,
    removeParents: previousParents,
    fields: "id, parents",
  });
}

async function deleteFileOrFolder(fileId) {
  await drive.files.delete({ fileId });
}

/** ↓↓↓ LOCAL: caminho do blocosDB.json */
const LOCAL_DB_PATH = path.join(__dirname, "../blocosDB.json");

/** ↓↓↓ Encontra o arquivo blocosDB.json no Drive */
async function encontrarArquivoDB() {
  const res = await drive.files.list({
    q: `'${GOOGLE_DRIVE_SITE_FOLDER_ID}' in parents and name = 'blocosDB.json' and trashed = false`,
    fields: "files(id, name)",
  });

  return res.data.files[0] || null;
}

/** ↓↓↓ Baixar o blocosDB.json do Drive para uso local */
async function baixarBlocosDB() {
  if (process.env.NODE_ENV !== "production") return;

  const arquivo = await encontrarArquivoDB();
  if (!arquivo) {
    console.warn("⚠️ blocosDB.json não encontrado no Drive.");
    return;
  }

  const res = await drive.files.get(
    { fileId: arquivo.id, alt: "media" },
    { responseType: "stream" }
  );

  const writeStream = fs.createWriteStream(LOCAL_DB_PATH);
  await new Promise((resolve, reject) => {
    res.data.pipe(writeStream);
    res.data.on("end", resolve);
    res.data.on("error", reject);
  });

  console.log("📥 blocosDB.json baixado do Drive com sucesso.");
}

/** ↓↓↓ Atualiza o blocosDB.json no Drive */
async function salvarBlocosDBNoDrive() {
  if (process.env.NODE_ENV !== "production") return;

  const arquivo = await encontrarArquivoDB();
  if (!arquivo) {
    console.warn("⚠️ blocosDB.json não encontrado para atualização.");
    return;
  }

  await drive.files.update({
    fileId: arquivo.id,
    media: {
      mimeType: "application/json",
      body: fs.createReadStream(LOCAL_DB_PATH),
    },
  });

  console.log("☁️ blocosDB.json atualizado no Drive.");
}

/** ↓↓↓ Cria toda a estrutura de pastas conforme caminhoRelativo */
async function encontrarOuCriarCaminhoCompleto(caminhoRelativo) {
  return getDriveFolderId(caminhoRelativo, { createIfMissing: true });
}

/** ↓↓↓ Envia arquivo de imagem para o caminho relativo no Drive */
async function enviarArquivoParaDrive(localPath, nomeArquivo, caminhoRelativo) {
  const parentId = await encontrarOuCriarCaminhoCompleto(caminhoRelativo);

  const res = await drive.files.create({
    requestBody: {
      name: nomeArquivo,
      parents: [parentId],
    },
    media: {
      mimeType: "image/jpeg",
      body: fs.createReadStream(localPath),
    },
    fields: "id, name, webViewLink, webContentLink",
  });

  return res.data;
}

module.exports = {
  baixarBlocosDB,
  salvarBlocosDBNoDrive,
  encontrarOuCriarCaminhoCompleto,
  enviarArquivoParaDrive,
  getDriveFolderId,
  listDriveFilesInFolder,
  moveFileOrFolder,
  createFolder,
  deleteFileOrFolder,
  DRIVE_FOLDER_NOT_FOUND,
};
