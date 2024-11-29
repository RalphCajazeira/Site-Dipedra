const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Importa o CORS
const path = require("path");
const catalogoRoutes = require("./routes/catalogoRoutes");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Permite CORS para todas as rotas
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../assets")));

// Rotas
app.use("/catalogo", catalogoRoutes);

app.listen(PORT, () => {
  console.log(`Backend rodando em http://127.0.0.1:${PORT}`);
});
