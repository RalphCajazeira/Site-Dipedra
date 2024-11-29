const fs = require("fs");
const path = require("path");
const catalogoPath = path.join(
  __dirname,
  "../",
  "../",
  "assets",
  "catalogo.json"
);

exports.uploadImages = (req, res) => {
  try {
    const { nome, tipo, material, ambientes } = req.body;
    const images = req.files;

    if (!images || images.length === 0) {
      return res
        .status(400)
        .send({ message: "Pelo menos uma imagem é obrigatória." });
    }

    console.log("Arquivos recebidos:", images);
    console.log("Dados do formulário:", req.body);

    const catalogo = JSON.parse(fs.readFileSync(catalogoPath, "utf8"));

    images.forEach((image) => {
      const alreadyExists = catalogo.some(
        (item) => item.imagem === image.filename
      );

      if (!alreadyExists) {
        const newEntry = {
          imagem: image.filename,
          nome,
          tipo,
          material,
          ambientes: ambientes.split(",").map((a) => a.trim()),
        };
        catalogo.push(newEntry);
      } else {
        console.log(`A imagem ${image.filename} já existe no catálogo.`);
      }
    });

    fs.writeFileSync(catalogoPath, JSON.stringify(catalogo, null, 2));

    console.log("JSON atualizado com sucesso.");
    res.status(200).send({ message: "Imagens adicionadas com sucesso!" });
  } catch (error) {
    console.error("Erro ao processar imagens:", error);
    res.status(500).send({ message: "Erro ao processar imagens.", error });
  }
};
