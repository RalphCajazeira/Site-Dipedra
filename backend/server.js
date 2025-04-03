const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const catalogoRoutes = require("./routes/catalogoRoutes");
const blocosRoutes = require("./routes/blocosRoutes");
const { baixarBlocosDB } = require("./services/driveService");

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// ✅ Libera todas as origens (⚠️ uso temporário para testes)
app.use(cors());
app.use(bodyParser.json());

// Servir arquivos estáticos
app.use("/assets", express.static(path.join(__dirname, "../assets")));
app.use("/pages", express.static(path.join(__dirname, "../pages")));
app.use("/scripts", express.static(path.join(__dirname, "../scripts")));
app.use("/assets/css", express.static(path.join(__dirname, "../assets/css")));
app.use(express.static(path.join(__dirname, "../"))); // raiz do projeto

// Rotas principais
app.use("/catalogo", catalogoRoutes);
app.use("/api/blocos", blocosRoutes);

// Em produção: baixa blocosDB.json antes de iniciar o servidor
if (process.env.NODE_ENV === "production") {
  baixarBlocosDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log("🚀 Backend rodando na porta " + PORT);
        console.log(`🌐 API disponível em: ${BASE_URL}/api/blocos`);
      });
    })
    .catch((err) => {
      console.error("❌ Erro ao baixar blocosDB.json do Drive:", err.message);
      process.exit(1);
    });
} else {
  app.listen(PORT, () => {
    console.log(`🛠️ [DEV] Backend rodando em ${BASE_URL}`);
  });
}
