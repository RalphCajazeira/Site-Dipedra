const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const catalogoRoutes = require("./routes/catalogoRoutes");
const blocosRoutes = require("./routes/blocosRoutes");
const {
  baixarBlocosDB,
  inicializarDrive,
} = require("./services/driveService");

const app = express();
const PORT = process.env.PORT || 3000;

// CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://192.168.3.91:3000", // celular local
  "https://www.dipedra.com.br", // domínio do GitHub Pages
];

const corsOptions =
  process.env.NODE_ENV === "production"
    ? {
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
          }
          callback(new Error("Not allowed by CORS"));
        },
      }
    : {}; // Em dev, libera geral

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Arquivos estáticos (só funcionam localmente)
app.use("/assets", express.static(path.join(__dirname, "../assets")));
app.use("/pages", express.static(path.join(__dirname, "../pages")));
app.use("/scripts", express.static(path.join(__dirname, "../scripts")));
app.use("/assets/css", express.static(path.join(__dirname, "../assets/css")));
app.use(express.static(path.join(__dirname, "../"))); // raiz

// Rotas
app.use("/catalogo", catalogoRoutes);
app.use("/api/blocos", blocosRoutes);

// Início
if (process.env.NODE_ENV === "production") {
  inicializarDrive()
    .then(() => baixarBlocosDB())
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 [PROD] Backend rodando na porta ${PORT}`);
      });
    })
    .catch((err) => {
      console.error("❌ Falha ao inicializar Drive:", err.message);
      process.exit(1);
    });
} else {
  // Dev local
  app.listen(PORT, () => {
    console.log(`🛠️ [DEV] Backend rodando em http://localhost:${PORT}`);
  });
}
