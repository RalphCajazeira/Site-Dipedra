// backend/utils/inicializarDriveDB.js
const fs = require("fs");
const path = require("path");
const {
  verificarSeBlocosDBExiste,
  baixarBlocosDB,
  salvarBlocosDBNoDrive,
} = require("../services/driveService");

const DB_PATH = path.join(__dirname, "..", "blocosDB.json");

async function inicializarDriveDB() {
  if (process.env.NODE_ENV !== "production") return;

  console.log("[Init] Verificando blocosDB.json no Drive...");

  try {
    const existe = await verificarSeBlocosDBExiste();

    if (existe) {
      console.log("[Init] ✅ blocosDB.json verificado no Drive.");
      await baixarBlocosDB();
    } else {
      console.log("[Init] blocosDB.json NÃO encontrado, criando novo...");

      const vazio = {
        "/assets/blocos": {
          folders: [],
          files: [],
          metadados: {},
        },
        __ultimoCodigo__: 0,
      };

      await fs.promises.writeFile(DB_PATH, JSON.stringify(vazio, null, 2));
      await salvarBlocosDBNoDrive(vazio);
      console.log("[Init] ✅ blocosDB.json criado com sucesso no Drive!");
    }
  } catch (err) {
    console.error(
      "[Init] ❌ Erro ao verificar/criar blocosDB.json:",
      err.message
    );
  }
}

module.exports = inicializarDriveDB;
