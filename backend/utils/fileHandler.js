const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../assets/images/catalogo"));
  },
  filename: (req, file, cb) => {
    const { nome, tipo, material, ambientes } = req.body;
    const ambiente = ambientes.split(",")[0];
    const baseName = `${nome.toLowerCase().replace(/ /g, "-")}---${tipo
      .toLowerCase()
      .replace(/ /g, "-")}---${material
      .toLowerCase()
      .replace(/ /g, "-")}---${ambiente.toLowerCase().replace(/ /g, "-")}`;

    const folderPath = path.join(__dirname, "../../assets/images/catalogo");
    const existingFiles = fs
      .readdirSync(folderPath)
      .filter((file) => file.startsWith(baseName));
    const nextNumber = existingFiles.length + 1;

    const fileName = `${baseName}---${nextNumber}.jpg`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

module.exports = {
  uploadMultiple: upload.array("images", 10), // Aceita até 10 arquivos
};
