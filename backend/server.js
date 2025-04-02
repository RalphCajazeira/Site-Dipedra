// backend/server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config(); // Se quiser ler .env local

const blocosRoutes = require("./routes/blocosRoutes");
const catalogoRoutes = require("./routes/catalogoRoutes"); // Exemplo

const app = express();

app.use(cors());
app.use(express.json());

// Se você quiser servir arquivos estáticos das pastas pages/scripts/assets em DEV:
app.use("/pages", express.static(path.join(__dirname, "..", "pages")));
app.use("/scripts", express.static(path.join(__dirname, "..", "scripts")));
app.use("/assets", express.static(path.join(__dirname, "..", "assets")));

// Rotas
app.use("/blocos", blocosRoutes);
app.use("/catalogo", catalogoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
