const {
  salvarBlocosDBNoDrive,
  verificarSeBlocosDBExiste,
} = require("../services/driveService");

module.exports = async function () {
  try {
    const existe = await verificarSeBlocosDBExiste();
    if (existe) {
      console.log("[Init] ✅ blocosDB.json verificado no Drive.");
    } else {
      console.log("[Init] blocosDB.json NÃO encontrado, criando novo...");
      await salvarBlocosDBNoDrive({});
      console.log("[Init] ✅ blocosDB.json criado com sucesso no Drive!");
    }
  } catch (err) {
    console.error(
      "[Init] ❌ Erro ao verificar/criar blocosDB.json:",
      err.message
    );
  }
};
