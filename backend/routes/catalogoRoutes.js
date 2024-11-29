const express = require("express");
const catalogoController = require("../controllers/catalogoController");
const { uploadMultiple } = require("../utils/fileHandler");

const router = express.Router();

// Rota para upload múltiplo de imagens
router.post("/upload", uploadMultiple, catalogoController.uploadImages);

module.exports = router;
