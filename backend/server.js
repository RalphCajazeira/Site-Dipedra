// backend/server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const blocosRoutes = require("./routes/blocosRoutes");
const catalogoRoutes = require("./routes/catalogoRoutes");

const app = express();
const PORT = process.env.PORT || 8080;

// 🌐 Permitir CORS de todas as origens (temporariamente liberado geral para testes)
app.use(cors());

// Ou se quiser restringir depois:
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://www.dipedra.com.br",
];
// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       return callback(null, true);
//     }
//     return callback(new Error("Not allowed by CORS"));
//   },
// }));

app.use(express.json());

// Servindo arquivos estáticos em desenvolvimento
app.use("/pages", express.static(path.join(__dirname, "..", "pages")));
app.use("/scripts", express.static(path.join(__dirname, "..", "scripts")));
app.use("/assets", express.static(path.join(__dirname, "..", "assets")));

// Rotas principais
app.use("/api/blocos", blocosRoutes);
app.use("/catalogo", catalogoRoutes);

// Inicializa o banco de dados do Google Drive, se necessário
require("./utils/inicializarDriveDB")();

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando na porta ${PORT}`);
  console.log(
    `🌐 API disponível em: https://site-dipedra-production.up.railway.app/api/blocos`
  );
});
