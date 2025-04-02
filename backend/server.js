const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config(); // Lê variáveis do .env local

const blocosRoutes = require("./routes/blocosRoutes");
const catalogoRoutes = require("./routes/catalogoRoutes");

const app = express();

// ✅ ATUALIZE ESTA PARTE:
app.use(
  cors({
    origin: ["https://www.dipedra.com.br", "http://localhost:3000"],
  })
);

app.use(express.json());

// Servindo arquivos estáticos em desenvolvimento
app.use("/pages", express.static(path.join(__dirname, "..", "pages")));
app.use("/scripts", express.static(path.join(__dirname, "..", "scripts")));
app.use("/assets", express.static(path.join(__dirname, "..", "assets")));

// Rotas principais
app.use("/blocos", blocosRoutes);
app.use("/catalogo", catalogoRoutes);

// Inicializa o banco de dados do Google Drive, se necessário
require("./utils/inicializarDriveDB")();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
