const express = require("express");
const router = express.Router();
const catalogoController = require("../controllers/catalogoController");
const fileHandler = require("../utils/fileHandler");

// Rota para upload de imagens
router.post(
  "/upload",
  fileHandler.uploadMultiple,
  catalogoController.uploadImages
);

// Rota para editar item do catálogo
router.put("/edit/:image", catalogoController.editItem);

// Rota para apagar item do catálogo
router.delete("/delete/:image", catalogoController.deleteItem);

module.exports = router;
