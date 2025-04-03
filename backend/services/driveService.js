const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const stream = require("stream");

const isProduction = process.env.NODE_ENV === "production";
const GOOGLE_DRIVE_SITE_FOLDER_ID =
  process.env.GOOGLE_DRIVE_SITE_FOLDER_ID || "";

let drive = null;

if (isProduction) {
  try {
    const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    drive = google.drive({ version: "v3", auth });
    console.log("[DriveService] Google Drive inicializado em modo PRODUÇÃO.");
  } catch (err) {
    console.error("Erro ao inicializar Drive (PRODUÇÃO):", err);
  }
} else {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    drive = google.drive({ version: "v3", auth });
    console.log(
      "[DriveService] Google Drive inicializado em modo DESENVOLVIMENTO."
    );
  } catch (err) {
    console.error("Erro ao inicializar Drive (DESENVOLVIMENTO):", err);
  }
}

async function encontrarOuCriarPasta(nome, idPai) {
  if (!drive) return null;
  const res = await drive.files.list({
    q: `'${idPai}' in parents and name='${nome}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: "files(id, name)",
  });
  if (res.data.files.length > 0) return res.data.files[0].id;

  const nova = await drive.files.create({
    requestBody: {
      name: nome,
      mimeType: "application/vnd.google-apps.folder",
      parents: [idPai],
    },
    fields: "id",
  });
  return nova.data.id;
}

async function getPastaBlocosId() {
  if (!drive) return null;
  return await encontrarOuCriarPasta("blocos", GOOGLE_DRIVE_SITE_FOLDER_ID);
}

async function criarPastaNoDrive(caminhoRelativo) {
  if (!drive) return null;
  const partes = caminhoRelativo
    .replace(/^\/?assets\/blocos\/?/, "")
    .split("/")
    .filter(Boolean);
  let parentId = await getPastaBlocosId();
  for (const parte of partes) {
    parentId = await encontrarOuCriarPasta(parte, parentId);
  }
  return parentId;
}

async function uploadArquivoParaDrive(file, caminhoRelativo, nomeFinal) {
  if (!drive) {
    fs.unlinkSync(file.path);
    return null;
  }

  const folderPath = caminhoRelativo
    .replace(/^\/?assets\/blocos\/?/, "")
    .split("/")
    .filter(Boolean);
  let parentId = await getPastaBlocosId();
  for (const parte of folderPath) {
    parentId = await encontrarOuCriarPasta(parte, parentId);
  }

  const res = await drive.files.create({
    requestBody: {
      name: nomeFinal,
      parents: [parentId],
    },
    media: {
      mimeType: file.mimetype,
      body: fs.createReadStream(file.path),
    },
    fields: "id",
  });

  const fileId = res.data.id;

  await drive.permissions.create({
    fileId,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  const fileUrl = `https://lh3.googleusercontent.com/d/${fileId}=w1000`;

  fs.unlinkSync(file.path);

  return { fileId, fileUrl };
}

async function salvarBlocosDBNoDrive(dbData = {}) {
  if (!drive) return;

  const buffer = Buffer.from(JSON.stringify(dbData, null, 2));
  const bufferStream = new stream.PassThrough();
  bufferStream.end(buffer);

  const res = await drive.files.list({
    q: `'${GOOGLE_DRIVE_SITE_FOLDER_ID}' in parents and name='blocosDB.json' and trashed=false`,
    fields: "files(id)",
  });

  if (res.data.files.length > 0) {
    await drive.files.update({
      fileId: res.data.files[0].id,
      media: {
        mimeType: "application/json",
        body: bufferStream,
      },
    });
  } else {
    await drive.files.create({
      requestBody: {
        name: "blocosDB.json",
        mimeType: "application/json",
        parents: [GOOGLE_DRIVE_SITE_FOLDER_ID],
      },
      media: {
        mimeType: "application/json",
        body: bufferStream,
      },
    });
  }
}

async function baixarBlocosDB() {
  if (!drive) return;
  const res = await drive.files.list({
    q: `'${GOOGLE_DRIVE_SITE_FOLDER_ID}' in parents and name='blocosDB.json' and trashed=false`,
    fields: "files(id)",
  });
  if (res.data.files.length === 0) {
    await fs.promises.writeFile("blocosDB.json", JSON.stringify({}, null, 2));
    return;
  }
  const fileId = res.data.files[0].id;
  const dest = fs.createWriteStream("blocosDB.json");
  await new Promise((resolve, reject) => {
    drive.files
      .get({ fileId, alt: "media" }, { responseType: "stream" })
      .then((response) => {
        response.data.on("end", resolve).on("error", reject).pipe(dest);
      })
      .catch(reject);
  });
}

async function carregarBlocosDBDoDrive() {
  if (!drive) return {};
  const res = await drive.files.list({
    q: `'${GOOGLE_DRIVE_SITE_FOLDER_ID}' in parents and name='blocosDB.json' and trashed=false`,
    fields: "files(id)",
  });
  if (res.data.files.length === 0) return {};
  const fileId = res.data.files[0].id;
  const response = await drive.files.get(
    { fileId, alt: "media" },
    { responseType: "stream" }
  );
  let raw = "";
  await new Promise((resolve, reject) => {
    response.data
      .on("data", (chunk) => (raw += chunk))
      .on("end", resolve)
      .on("error", reject);
  });
  try {
    return JSON.parse(raw);
  } catch (err) {
    return {};
  }
}

async function renomearItemNoDrive(origemRel, destinoRel) {
  if (!drive) return;
  const nomeAntigo = path.basename(origemRel);
  const nomeNovo = path.basename(destinoRel);
  const pastaOrigem = path
    .dirname(origemRel)
    .replace(/^\/?assets\/blocos\/?/, "")
    .split("/")
    .filter(Boolean);
  let parentId = await getPastaBlocosId();
  for (const parte of pastaOrigem) {
    parentId = await encontrarOuCriarPasta(parte, parentId);
  }
  const res = await drive.files.list({
    q: `'${parentId}' in parents and name='${nomeAntigo}' and trashed=false`,
    fields: "files(id)",
  });
  if (res.data.files.length > 0) {
    await drive.files.update({
      fileId: res.data.files[0].id,
      requestBody: { name: nomeNovo },
    });
  }
}

async function moverItemNoDrive(origemRel, destinoRel) {
  if (!drive) return;
  const nome = path.basename(origemRel);
  const origemPartes = path
    .dirname(origemRel)
    .replace(/^\/?assets\/blocos\/?/, "")
    .split("/")
    .filter(Boolean);
  const destinoPartes = destinoRel
    .replace(/^\/?assets\/blocos\/?/, "")
    .split("/")
    .filter(Boolean);

  let origemId = await getPastaBlocosId();
  for (const parte of origemPartes) {
    origemId = await encontrarOuCriarPasta(parte, origemId);
  }

  let destinoId = await getPastaBlocosId();
  for (const parte of destinoPartes) {
    destinoId = await encontrarOuCriarPasta(parte, destinoId);
  }

  const res = await drive.files.list({
    q: `'${origemId}' in parents and name='${nome}' and trashed=false`,
    fields: "files(id, parents)",
  });

  if (res.data.files.length > 0) {
    const file = res.data.files[0];
    await drive.files.update({
      fileId: file.id,
      addParents: destinoId,
      removeParents: file.parents[0],
    });
  }
}

async function deletarItemNoDrive(caminhoRelativo) {
  if (!drive) return;
  const nome = path.basename(caminhoRelativo);
  const pastaRelativa = path
    .dirname(caminhoRelativo)
    .replace(/^\/?assets\/blocos\/?/, "")
    .split("/")
    .filter(Boolean);
  let parentId = await getPastaBlocosId();
  for (const parte of pastaRelativa) {
    parentId = await encontrarOuCriarPasta(parte, parentId);
  }

  const res = await drive.files.list({
    q: `'${parentId}' in parents and name='${nome}' and trashed=false`,
    fields: "files(id)",
  });

  for (const file of res.data.files) {
    await drive.files.delete({ fileId: file.id });
  }
}

async function verificarSeBlocosDBExiste() {
  if (!drive) return false;
  const res = await drive.files.list({
    q: `'${GOOGLE_DRIVE_SITE_FOLDER_ID}' in parents and name='blocosDB.json' and trashed=false`,
    fields: "files(id)",
  });
  return res.data.files.length > 0;
}

module.exports = {
  baixarBlocosDB,
  salvarBlocosDBNoDrive,
  carregarBlocosDBDoDrive,
  criarPastaNoDrive,
  uploadArquivoParaDrive,
  renomearItemNoDrive,
  moverItemNoDrive,
  deletarItemNoDrive,
  verificarSeBlocosDBExiste,
};
