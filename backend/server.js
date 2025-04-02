const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const blocosRoutes = require("./routes/blocosRoutes");
const catalogoRoutes = require("./routes/catalogoRoutes");

const app = express();

// ✅ CORS correto para produção e dev
const corsOptions = {
  origin: ["https://www.dipedra.com.br", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

// Servindo arquivos estáticos (apenas em dev/local)
app.use("/pages", express.static(path.join(__dirname, "..", "pages")));
app.use("/scripts", express.static(path.join(__dirname, "..", "scripts")));
app.use("/assets", express.static(path.join(__dirname, "..", "assets")));

// Rotas principais
app.use("/blocos", blocosRoutes);
app.use("/catalogo", catalogoRoutes);

// Inicialização do Drive
require("./utils/inicializarDriveDB")();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
