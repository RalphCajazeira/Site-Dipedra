const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(
    __dirname,
    "../chaves/site-dipedra-455418-abbeb250dfd0.json"
  ), // ajuste o nome da chave
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const driveFolderId = "PASTA_ID_DO_DRIVE"; // Coloque aqui o ID da pasta no Drive onde o blocosDB.json está
const blocosDBName = "blocosDB.json";

async function getDriveClient() {
  const authClient = await auth.getClient();
  return google.drive({ version: "v3", auth: authClient });
}

async function baixarBlocosDB() {
  const drive = await getDriveClient();

  const res = await drive.files.list({
    q: `name='${blocosDBName}' and '${driveFolderId}' in parents`,
    fields: "files(id, name)",
    spaces: "drive",
  });

  const file = res.data.files[0];
  if (!file) throw new Error("blocosDB.json não encontrado no Drive");

  const destPath = path.join(__dirname, "../blocosDB.json");
  const dest = fs.createWriteStream(destPath);

  const download = await drive.files.get(
    { fileId: file.id, alt: "media" },
    { responseType: "stream" }
  );

  await new Promise((resolve, reject) => {
    download.data
      .on("end", () => resolve())
      .on("error", (err) => reject(err))
      .pipe(dest);
  });

  return file.id;
}

async function salvarBlocosDBNoDrive() {
  const drive = await getDriveClient();
  const localPath = path.join(__dirname, "../blocosDB.json");

  const res = await drive.files.list({
    q: `name='${blocosDBName}' and '${driveFolderId}' in parents`,
    fields: "files(id, name)",
    spaces: "drive",
  });

  const file = res.data.files[0];
  const fileMetadata = { name: blocosDBName, parents: [driveFolderId] };
  const media = {
    mimeType: "application/json",
    body: fs.createReadStream(localPath),
  };

  if (file) {
    // Atualizar arquivo existente
    await drive.files.update({
      fileId: file.id,
      media,
    });
  } else {
    // Criar novo
    await drive.files.create({
      resource: fileMetadata,
      media,
      fields: "id",
    });
  }
}

module.exports = {
  baixarBlocosDB,
  salvarBlocosDBNoDrive,
};
