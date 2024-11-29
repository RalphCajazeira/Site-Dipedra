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

    // Identificar o próximo número disponível
    const usedNumbers = existingFiles
      .map((file) => {
        const match = file.match(/---(\d+)\.jpg$/);
        return match ? parseInt(match[1], 10) : null;
      })
      .filter((num) => num !== null);

    const nextNumber =
      usedNumbers.length > 0
        ? Math.min(
            ...Array.from(
              { length: Math.max(...usedNumbers) + 2 },
              (_, i) => i + 1
            ).filter((n) => !usedNumbers.includes(n))
          )
        : 1;

    const fileName = `${baseName}---${nextNumber}.jpg`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

module.exports = {
  uploadMultiple: upload.array("images", 10), // Aceita até 10 arquivos
};
