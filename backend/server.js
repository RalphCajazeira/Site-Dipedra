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

// Middleware de CORS com verificação por ambiente
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://192.168.3.91:3000",
  "https://www.dipedra.com.br",
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

// Arquivos estáticos
app.use("/assets", express.static(path.join(__dirname, "../assets")));
app.use("/pages", express.static(path.join(__dirname, "../pages")));
app.use("/scripts", express.static(path.join(__dirname, "../scripts")));
app.use("/assets/css", express.static(path.join(__dirname, "../assets/css")));
app.use(express.static(path.join(__dirname, "../"))); // raiz

// Rotas principais
app.use("/catalogo", catalogoRoutes);
app.use("/api/blocos", blocosRoutes);

// ↓↓↓ Modo produção: baixar blocosDB do Drive antes de subir
if (process.env.NODE_ENV === "production") {
  baixarBlocosDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 [PROD] Backend rodando em http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error("❌ Erro ao baixar blocosDB.json do Drive:", err.message);
      process.exit(1); // impede iniciar com erro
    });
} else {
  // ↓↓↓ Modo desenvolvimento: sobe direto
  app.listen(PORT, () => {
    console.log(`🛠️  [DEV] Backend rodando em http://localhost:${PORT}`);
  });
}
