const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const catalogoRoutes = require("./routes/catalogoRoutes");
const blocosRoutes = require("./routes/blocosRoutes");
const { baixarBlocosDB } = require("./services/driveService");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Servir arquivos estáticos
app.use("/assets", express.static(path.join(__dirname, "../assets")));
app.use("/pages", express.static(path.join(__dirname, "../pages")));
app.use("/scripts", express.static(path.join(__dirname, "../scripts")));
app.use("/assets/css", express.static(path.join(__dirname, "../assets/css")));
app.use(express.static(path.join(__dirname, "../"))); // raiz

// Rotas
app.use("/catalogo", catalogoRoutes);
app.use("/api/blocos", blocosRoutes);

// Iniciar servidor apenas após baixar o blocosDB.json
baixarBlocosDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Backend rodando em http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Erro ao baixar blocosDB.json do Drive:", err.message);
    process.exit(1); // força parada para não rodar com erro
  });
