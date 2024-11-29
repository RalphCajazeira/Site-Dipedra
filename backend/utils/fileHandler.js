const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../assets/images/catalogo"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueSuffix); // Nome único para cada arquivo
  },
});

const upload = multer({ storage });

// Configuração para aceitar múltiplos arquivos
module.exports = {
  uploadMultiple: upload.array("images", 10), // Aceita até 10 arquivos
};
