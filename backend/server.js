const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const catalogoRoutes = require("./routes/catalogoRoutes");
const blocosRoutes = require("./routes/blocosRoutes");
const { baixarBlocosDB } = require("./services/driveService");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use("/assets", express.static(path.join(__dirname, "../assets")));
app.use("/pages", express.static(path.join(__dirname, "../pages")));
app.use("/scripts", express.static(path.join(__dirname, "../scripts")));
app.use(express.static(path.join(__dirname, "../")));

app.use("/catalogo", catalogoRoutes);
app.use("/api/blocos", blocosRoutes);

// Baixar o blocosDB.json do Google Drive antes de iniciar
baixarBlocosDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Backend rodando em http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erro ao baixar blocosDB.json do Drive:", err.message);
    process.exit(1);
  });
