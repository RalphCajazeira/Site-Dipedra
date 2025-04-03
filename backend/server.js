// backend/server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const blocosRoutes = require("./routes/blocosRoutes");
const catalogoRoutes = require("./routes/catalogoRoutes");
const { listarConteudoPublica } = require("./controllers/blocosController");
const inicializarDriveDB = require("./utils/inicializarDriveDB");

const app = express();
const PORT = process.env.PORT || 8080;

// 🔧 Adicione seu domínio do Railway manualmente ou via variável
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`; // coloque aqui sua URL Railway se quiser fixo

// CORS
const allowedOrigins = ["http://localhost:3000", "https://www.dipedra.com.br"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
  })
);

app.use(express.json());

// Teste
app.get("/", (req, res) => {
  res.send("API está rodando!");
});

app.get("/api/blocos", listarConteudoPublica);

app.use("/api/blocos", blocosRoutes);
app.use("/catalogo", catalogoRoutes);

// Arquivos estáticos
app.use("/assets", express.static(path.join(__dirname, "..", "assets")));
app.use("/pages", express.static(path.join(__dirname, "..", "pages")));
app.use("/scripts", express.static(path.join(__dirname, "..", "scripts")));
app.use(
  "/assets/css",
  express.static(path.join(__dirname, "..", "assets/css"))
);

inicializarDriveDB();

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando na porta ${PORT}`);
  console.log(`🌐 API disponível em: ${BASE_URL}/api/blocos`);
});
