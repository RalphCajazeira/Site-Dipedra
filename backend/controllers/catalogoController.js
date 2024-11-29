const fs = require("fs");
const path = require("path");
const catalogoPath = path.join(
  __dirname,
  "../",
  "../",
  "assets",
  "catalogo.json"
);
const imagePath = path.join(
  __dirname,
  "../",
  "../",
  "assets",
  "images",
  "catalogo"
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
      }
    });

    fs.writeFileSync(catalogoPath, JSON.stringify(catalogo, null, 2));
    res.status(200).send({ message: "Imagens adicionadas com sucesso!" });
  } catch (error) {
    console.error("Erro ao processar imagens:", error);
    res.status(500).send({ message: "Erro ao processar imagens.", error });
  }
};

// Editar item no catálogo
exports.editItem = (req, res) => {
  try {
    const image = req.params.image;
    const { nome, tipo, material, ambientes } = req.body;

    const catalogo = JSON.parse(fs.readFileSync(catalogoPath, "utf8"));

    const itemIndex = catalogo.findIndex((item) => item.imagem === image);

    if (itemIndex === -1) {
      return res.status(404).send({ message: "Item não encontrado." });
    }

    catalogo[itemIndex] = {
      ...catalogo[itemIndex],
      nome,
      tipo,
      material,
      ambientes: ambientes.split(",").map((a) => a.trim()),
    };

    fs.writeFileSync(catalogoPath, JSON.stringify(catalogo, null, 2));

    console.log(`Item ${image} editado com sucesso.`);
    res.status(200).send({ message: "Item editado com sucesso!" });
  } catch (error) {
    console.error("Erro ao editar item:", error);
    res.status(500).send({ message: "Erro ao editar item.", error });
  }
};

// Apagar item no catálogo
exports.deleteItem = (req, res) => {
  try {
    const image = req.params.image;

    const catalogo = JSON.parse(fs.readFileSync(catalogoPath, "utf8"));
    const updatedCatalogo = catalogo.filter((item) => item.imagem !== image);

    if (updatedCatalogo.length === catalogo.length) {
      return res.status(404).send({ message: "Item não encontrado." });
    }

    fs.writeFileSync(catalogoPath, JSON.stringify(updatedCatalogo, null, 2));

    // Apagar a imagem do disco
    const imagePathFull = path.join(imagePath, image);
    if (fs.existsSync(imagePathFull)) {
      fs.unlinkSync(imagePathFull);
    }

    console.log(`Imagem ${image} apagada com sucesso.`);
    res.status(200).send({ message: "Item apagado com sucesso!" });
  } catch (error) {
    console.error("Erro ao apagar item:", error);
    res.status(500).send({ message: "Erro ao apagar item.", error });
  }
};
