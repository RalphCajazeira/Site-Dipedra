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

// CORS configurado para seu domínio e localhost
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

// Teste simples de status da API
app.get("/", (req, res) => {
  res.send("API está rodando!");
});

// Rota pública para testar a listagem de blocos
app.get("/api/blocos", listarConteudoPublica);

// Demais rotas
app.use("/api/blocos", blocosRoutes);
app.use("/catalogo", catalogoRoutes);

// Servir arquivos estáticos apenas se necessário (ex: local)
app.use("/assets", express.static(path.join(__dirname, "..", "assets")));
app.use("/pages", express.static(path.join(__dirname, "..", "pages")));
app.use("/scripts", express.static(path.join(__dirname, "..", "scripts")));
app.use(
  "/assets/css",
  express.static(path.join(__dirname, "..", "assets/css"))
);

// Inicializar banco blocosDB.json do Google Drive
inicializarDriveDB();

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando na porta ${PORT}`);
});
