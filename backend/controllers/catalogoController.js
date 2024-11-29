exports.uploadImages = (req, res) => {
  try {
    const { nome, tipo, material, ambientes } = req.body;
    const images = req.files; // Array com os arquivos enviados

    if (!images || images.length === 0) {
      return res
        .status(400)
        .send({ message: "Pelo menos uma imagem é obrigatória." });
    }

    const catalogo = JSON.parse(fs.readFileSync(catalogoPath, "utf8"));

    images.forEach((image) => {
      const newEntry = {
        imagem: image.filename, // Nome único gerado pelo multer
        nome,
        tipo,
        material,
        ambientes: ambientes.split(",").map((a) => a.trim()),
      };

      catalogo.push(newEntry);
    });

    fs.writeFileSync(catalogoPath, JSON.stringify(catalogo, null, 2));

    res.status(200).send({ message: "Imagens adicionadas com sucesso!" });
  } catch (error) {
    console.error("Erro ao processar imagens:", error);
    res.status(500).send({ message: "Erro ao processar imagens.", error });
  }
};
