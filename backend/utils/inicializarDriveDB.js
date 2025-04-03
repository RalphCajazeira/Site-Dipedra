const fs = require("fs");
const path = require("path");
const {
  verificarSeBlocosDBExiste,
  salvarBlocosDBNoDrive,
  baixarBlocosDB,
} = require("../services/driveService");

const isProduction = process.env.NODE_ENV === "production";
const DB_PATH = path.join(__dirname, "..", "blocosDB.json");

async function inicializarDriveDB() {
  try {
    if (isProduction) {
      const existeNoDrive = await verificarSeBlocosDBExiste();

      if (!existeNoDrive) {
        console.log("[Init] blocosDB.json NÃO encontrado, criando novo...");
        await salvarBlocosDBNoDrive({});
        console.log("[Init] ✅ blocosDB.json criado com sucesso no Drive!");
      } else {
        console.log("[Init] ✅ blocosDB.json verificado no Drive.");
      }

      // Sempre baixa o banco atualizado do Drive
      await baixarBlocosDB();
    } else {
      if (!fs.existsSync(DB_PATH)) {
        console.log("[Init] blocosDB.json local NÃO encontrado, criando...");
        fs.writeFileSync(DB_PATH, JSON.stringify({}, null, 2));
        console.log("[Init] ✅ blocosDB.json criado localmente.");
      } else {
        console.log("[Init] ✅ blocosDB.json já existe localmente.");
      }
    }
  } catch (err) {
    console.error(
      "[Init] ❌ Erro ao verificar/criar blocosDB.json:",
      err.message
    );
  }
}

module.exports = inicializarDriveDB;
