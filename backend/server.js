const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const blocosRoutes = require("./routes/blocosRoutes");
const catalogoRoutes = require("./routes/catalogoRoutes");
const inicializarDriveDB = require("./utils/inicializarDriveDB");

const app = express();
const PORT = process.env.PORT || 3000;

// 🔓 Libera CORS totalmente (para testes)
app.use(cors());

// Middleware para JSON
app.use(express.json());

// Arquivos estáticos
app.use("/assets", express.static(path.join(__dirname, "..", "assets")));
app.use("/pages", express.static(path.join(__dirname, "..", "pages")));
app.use("/scripts", express.static(path.join(__dirname, "..", "scripts")));
app.use(
  "/assets/css",
  express.static(path.join(__dirname, "..", "assets/css"))
);

// Rotas
app.use("/api/blocos", blocosRoutes);
app.use("/api/catalogo", catalogoRoutes);

// Inicializa blocosDB.json
inicializarDriveDB();

// ✅ Inicia o servidor corretamente
app.listen(PORT, () => {
  const baseURL =
    process.env.NODE_ENV === "production"
      ? "https://site-dipedra-production.up.railway.app"
      : `http://localhost:${PORT}`;

  console.log(`🚀 Backend rodando na porta ${PORT}`);
  console.log(`🌐 API disponível em: ${baseURL}/api/blocos`);
});
