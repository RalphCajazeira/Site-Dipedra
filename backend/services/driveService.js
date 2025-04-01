const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

const GOOGLE_DRIVE_SITE_FOLDER_ID = process.env.GOOGLE_DRIVE_SITE_FOLDER_ID;

let drive = null;

if (process.env.NODE_ENV === "production") {
  const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);

  const auth = new google.auth.GoogleAuth({
    credentials: serviceAccount,
    scopes: ["https://www.googleapis.com/auth/drive"],
  });

  drive = google.drive({ version: "v3", auth });
}

// 🔍 Encontra ou cria uma pasta dentro de outra
async function encontrarOuCriarPasta(nome, idPai) {
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

// 📁 Retorna o ID da pasta "blocos"
async function getPastaBlocosId() {
  return await encontrarOuCriarPasta("blocos", GOOGLE_DRIVE_SITE_FOLDER_ID);
}

// ⬇️ Baixar blocosDB.json do Drive para o servidor local
async function baixarBlocosDB() {
  const res = await drive.files.list({
    q: `'${GOOGLE_DRIVE_SITE_FOLDER_ID}' in parents and name='blocosDB.json' and trashed=false`,
    fields: "files(id)",
  });

  if (res.data.files.length === 0) {
    await fs.promises.writeFile(
      "blocosDB.json",
      JSON.stringify({ arquivos: {}, pastas: [] }, null, 2)
    );
    return;
  }

  const fileId = res.data.files[0].id;
  const dest = fs.createWriteStream("blocosDB.json");

  await new Promise((resolve, reject) => {
    drive.files
      .get({ fileId, alt: "media" }, { responseType: "stream" })
      .then((res) => {
        res.data.on("end", resolve).on("error", reject).pipe(dest);
      });
  });
}

// 💾 Salvar blocosDB.json no Drive
async function salvarBlocosDBNoDrive() {
  const content = await fs.promises.readFile("blocosDB.json", "utf-8");

  const res = await drive.files.list({
    q: `'${GOOGLE_DRIVE_SITE_FOLDER_ID}' in parents and name='blocosDB.json' and trashed=false`,
    fields: "files(id)",
  });

  if (res.data.files.length === 0) {
    await drive.files.create({
      requestBody: {
        name: "blocosDB.json",
        mimeType: "application/json",
        parents: [GOOGLE_DRIVE_SITE_FOLDER_ID],
      },
      media: {
        mimeType: "application/json",
        body: Buffer.from(content),
      },
    });
  } else {
    const fileId = res.data.files[0].id;
    await drive.files.update({
      fileId,
      media: {
        mimeType: "application/json",
        body: Buffer.from(content),
      },
    });
  }
}

// 📖 Ler blocosDB.json diretamente do Drive
async function carregarBlocosDBDoDrive() {
  const res = await drive.files.list({
    q: `'${GOOGLE_DRIVE_SITE_FOLDER_ID}' in parents and name='blocosDB.json' and trashed=false`,
    fields: "files(id)",
  });

  if (res.data.files.length === 0) return { arquivos: {}, pastas: [] };

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

  return JSON.parse(raw);
}

// 📁 Cria estrutura de pasta no Drive (recursivo)
async function criarPastaNoDrive(pathRelativo) {
  const partes = pathRelativo.split("/").filter(Boolean);
  let parentId = await getPastaBlocosId();

  for (const parte of partes) {
    parentId = await encontrarOuCriarPasta(parte, parentId);
  }
}

// ⬆️ Envia imagem para o caminho no Drive
async function uploadArquivoParaDrive(file, pathRelativo, nomeFinal) {
  const partes = pathRelativo.split("/").filter(Boolean);
  let parentId = await getPastaBlocosId();

  for (const parte of partes) {
    parentId = await encontrarOuCriarPasta(parte, parentId);
  }

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

  fs.unlinkSync(file.path);
}

// 🔄 Renomeia arquivo ou pasta
async function renomearItemNoDrive(origemRel, destinoRel) {
  const nomeAntigo = path.basename(origemRel);
  const nomeNovo = path.basename(destinoRel);
  const pastaOrigem = path.dirname(origemRel).split("/").filter(Boolean);

  let parentId = await getPastaBlocosId();
  for (const parte of pastaOrigem) {
    parentId = await encontrarOuCriarPasta(parte, parentId);
  }

  const res = await drive.files.list({
    q: `'${parentId}' in parents and name='${nomeAntigo}' and trashed=false`,
    fields: "files(id)",
  });

  if (res.data.files.length > 0) {
    const fileId = res.data.files[0].id;
    await drive.files.update({
      fileId,
      requestBody: {
        name: nomeNovo,
      },
    });
  }
}

// 🔁 Move item entre pastas
async function moverItemNoDrive(origemRel, destinoRel) {
  const nome = path.basename(origemRel);
  const origemPartes = path.dirname(origemRel).split("/").filter(Boolean);
  const destinoPartes = destinoRel.split("/").filter(Boolean);

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

// 🗑️ Deleta item do Drive
async function deletarItemNoDrive(caminhoRelativo) {
  const nome = path.basename(caminhoRelativo);
  const pastaRelativa = path
    .dirname(caminhoRelativo)
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

module.exports = {
  baixarBlocosDB,
  salvarBlocosDBNoDrive,
  carregarBlocosDBDoDrive,
  criarPastaNoDrive,
  uploadArquivoParaDrive,
  renomearItemNoDrive,
  moverItemNoDrive,
  deletarItemNoDrive,
};
