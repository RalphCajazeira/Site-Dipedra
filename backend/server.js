// backend/server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const blocosRoutes = require("./routes/blocosRoutes");
const catalogoRoutes = require("./routes/catalogoRoutes");
const { baixarBlocosDB } = require("./services/driveService");

const app = express();
const PORT = process.env.PORT || 3000;

// Origens permitidas para CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://www.dipedra.com.br",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());

// Servir arquivos estáticos (em dev)
app.use("/pages", express.static(path.join(__dirname, "..", "pages")));
app.use("/scripts", express.static(path.join(__dirname, "..", "scripts")));
app.use("/assets", express.static(path.join(__dirname, "..", "assets")));
app.use("/assets/css", express.static(path.join(__dirname, "..", "assets/css")));

// Rotas da API
app.use("/api/blocos", blocosRoutes);
app.use("/catalogo", catalogoRoutes);

// Inicialização: baixar blocosDB do Drive se estiver em produção
if (process.env.NODE_ENV === "production") {
  baixarBlocosDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 [PROD] Backend rodando na porta ${PORT}`);
      });
    })
    .catch((err) => {
      console.error("❌ Erro ao baixar blocosDB.json do Drive:", err.message);
      process.exit(1);
    });
} else {
  app.listen(PORT, () => {
    console.log(`🛠️ [DEV] Backend rodando em http://localhost:${PORT}`);
  });
}
