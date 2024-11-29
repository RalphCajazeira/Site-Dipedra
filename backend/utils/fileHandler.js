const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../assets/images/catalogo"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Configuração para aceitar múltiplos arquivos
module.exports = {
  uploadSingle: upload.single("image"),
  uploadMultiple: upload.array("images", 10), // Aceita até 10 arquivos
};
