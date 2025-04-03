// backend/server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const blocosRoutes = require("./routes/blocosRoutes");

const app = express();
const PORT = process.env.PORT || 8080;

// CORS liberado para seu domínio
app.use(
  cors({
    origin: ["http://localhost:3000", "https://www.dipedra.com.br"],
  })
);

app.use(express.json());

// Rota para teste da API
app.get("/", (req, res) => {
  res.send("API está rodando!");
});

// Rota pública para testar a listagem do banco de dados
app.get(
  "/api/blocos",
  require("./controllers/blocosController").listarConteudoPublica
);

// Rotas reais da aplicação
app.use("/api/blocos", blocosRoutes);

// Inicializa banco do Drive
require("./utils/inicializarDriveDB")();

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando na porta ${PORT}`);
});
