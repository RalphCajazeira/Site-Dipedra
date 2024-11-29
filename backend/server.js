const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cors = require("cors"); // Importa o pacote cors

const app = express(); // Inicializa o objeto app do Express
app.use(cors()); // Aplica o middleware CORS para permitir todas as origens

const upload = multer({ dest: path.join(__dirname, "../uploads") }); // Diretório temporário para uploads
const catalogFile = path.join(__dirname, "../assets/catalogo.json"); // Caminho para catalogo.json
const imageDirectory = path.join(__dirname, "../assets/images/catalogo"); // Caminho para salvar as imagens

// Verifica se catalogo.json existe; se não, cria um arquivo vazio
if (!fs.existsSync(catalogFile)) {
  fs.writeFileSync(catalogFile, "[]", "utf-8"); // Cria um arquivo JSON vazio (array)
  console.log("Arquivo catalogo.json criado.");
}

// Endpoint de upload para múltiplos arquivos
app.post("/upload", upload.array("productImages"), (req, res) => {
  const { productName, productType, productMaterial, productAmbientes } =
    req.body;
  const ambientes = productAmbientes.split(",").map((a) => a.trim());

  const imageFiles = req.files;

  if (!imageFiles || imageFiles.length === 0) {
    return res
      .status(400)
      .json({ message: "Nenhum arquivo de imagem foi enviado." });
  }

  const newItems = [];

  // Processa cada imagem individualmente
  imageFiles.forEach((imageFile, index) => {
    const ambiente = ambientes[0]; // Usa o primeiro ambiente
    const ext = path.extname(imageFile.originalname);

    // Gera um nome de arquivo único
    const newImagePath = generateUniqueFileName(
      productName,
      productType,
      productMaterial,
      ambiente,
      ext
    );

    try {
      // Move a imagem para o diretório final e a renomeia
      fs.renameSync(imageFile.path, newImagePath);

      // Extrai o nome do arquivo do caminho para salvar no JSON
      const imageFileName = path.basename(newImagePath);

      // Cria um novo item para cada imagem
      const newItem = {
        imagem: imageFileName,
        nome: productName,
        tipo: productType,
        material: productMaterial,
        ambientes: ambientes,
      };

      newItems.push(newItem);
    } catch (err) {
      console.error("Erro ao mover a imagem:", err);
      return res.status(500).json({ message: "Erro ao mover a imagem." });
    }
  });

  // Atualiza o arquivo catalogo.json
  fs.readFile(catalogFile, "utf-8", (err, data) => {
    if (err) {
      console.error("Erro ao ler o arquivo JSON:", err);
      return res.status(500).json({ message: "Erro ao ler o arquivo JSON." });
    }

    let catalog;
    try {
      catalog = JSON.parse(data);
    } catch (parseErr) {
      console.error("Erro ao analisar o JSON:", parseErr);
      return res.status(500).json({ message: "Erro ao analisar o JSON." });
    }

    catalog.push(...newItems); // Adiciona todos os novos itens ao catálogo

    fs.writeFile(
      catalogFile,
      JSON.stringify(catalog, null, 2),
      "utf-8",
      (err) => {
        if (err) {
          console.error("Erro ao salvar no arquivo JSON:", err);
          return res
            .status(500)
            .json({ message: "Erro ao salvar no arquivo JSON." });
        }
        res.json({ message: "Upload bem-sucedido!" });
      }
    );
  });
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
