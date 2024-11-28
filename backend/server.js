const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid"); // Adicione a biblioteca UUID

const app = express();
const port = 3000;

// Permitir o frontend rodando no Live Server (porta 5000)
app.use(
  cors({
    origin: "http://127.0.0.1:5500", // Permitir requisições do Live Server
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
    allowedHeaders: ["Content-Type", "Authorization"], // Cabeçalhos permitidos
  })
);

// Função para obter o próximo número incremental
const getNextFileNumber = (dir, baseName) => {
  const files = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
  const matchingFiles = files.filter((file) => file.startsWith(baseName));
  return matchingFiles.length + 1; // Retorna o próximo número disponível
};

// Configuração de armazenamento com multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../assets/images/catalogo");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); // Cria a pasta caso não exista
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Gera o nome base do arquivo
    const baseName = [
      req.body.productName.trim().toLowerCase().replace(/\s+/g, "-"),
      req.body.productType.trim().toLowerCase().replace(/\s+/g, "-"),
      req.body.productMaterial.trim().toLowerCase().replace(/\s+/g, "-"),
      req.body.productAmbientes.trim().toLowerCase().replace(/\s+/g, "-"),
    ].join("---");

    // Obtém o próximo número incremental
    const uploadPath = path.join(__dirname, "../assets/images/catalogo");
    const nextNumber = getNextFileNumber(uploadPath, baseName);

    // Gera o nome completo do arquivo
    const filename = `${baseName}---${nextNumber}${path.extname(
      file.originalname
    )}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

// Middleware para parse de JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve arquivos estáticos
app.use(express.static(path.join(__dirname, "../assets")));

// Rota para o catálogo
app.get("/catalogo", (req, res) => {
  fs.readFile(
    path.join(__dirname, "../assets/catalogo.json"),
    "utf8",
    (err, data) => {
      if (err) {
        res.status(500).send("Erro ao carregar o catálogo.");
        return;
      }
      res.json(JSON.parse(data));
    }
  );
});

// Rota para adicionar produtos (upload de imagens)
app.post("/upload", upload.array("productImages", 10), (req, res) => {
  const { productName, productType, productMaterial, productAmbientes } =
    req.body;

  const newProducts = req.files.map((file) => ({
    nome: productName,
    tipo: productType,
    material: productMaterial,
    ambientes: productAmbientes.split(",").map((item) => item.trim()),
    imagem: file.filename, // Nome do arquivo salvo
  }));

  const catalogPath = path.join(__dirname, "../assets/catalogo.json");
  fs.readFile(catalogPath, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Erro ao carregar o catálogo.");
      return;
    }

    const catalogo = JSON.parse(data);

    // Adiciona os novos produtos
    catalogo.push(...newProducts);

    // Grava novamente no arquivo JSON
    fs.writeFile(catalogPath, JSON.stringify(catalogo, null, 2), (err) => {
      if (err) {
        res.status(500).send("Erro ao salvar o catálogo.");
        return;
      }
      res.send("Produtos adicionados com sucesso!");
    });
  });
});

// Rota para excluir produto
app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;

  const catalogPath = path.join(__dirname, "../assets/catalogo.json");
  fs.readFile(catalogPath, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Erro ao carregar o catálogo.");
      return;
    }

    let catalogo = JSON.parse(data);

    // Remove o produto com o ID correspondente
    catalogo = catalogo.filter((item, index) => index !== parseInt(id));

    // Grava novamente no arquivo JSON
    fs.writeFile(catalogPath, JSON.stringify(catalogo, null, 2), (err) => {
      if (err) {
        res.status(500).send("Erro ao salvar o catálogo.");
        return;
      }
      res.send("Produto excluído com sucesso!");
    });
  });
});

// Rota para editar produto
app.put("/edit/:id", upload.single("editImage"), (req, res) => {
  const id = req.params.id;
  const { editName, editType, editMaterial, editAmbientes } = req.body;

  const catalogPath = path.join(__dirname, "../assets/catalogo.json");
  fs.readFile(catalogPath, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Erro ao carregar o catálogo.");
      return;
    }

    let catalogo = JSON.parse(data);

    // Encontra o produto pelo ID
    const product = catalogo[id];
    if (product) {
      // Atualiza os campos
      product.nome = editName || product.nome;
      product.tipo = editType || product.tipo;
      product.material = editMaterial || product.material;
      product.ambientes = editAmbientes
        ? editAmbientes.split(",").map((item) => item.trim())
        : product.ambientes;

      // Se uma nova imagem foi enviada, substitui a antiga
      if (req.file) {
        product.imagem = req.file.filename;
      }

      // Grava novamente no arquivo JSON
      fs.writeFile(catalogPath, JSON.stringify(catalogo, null, 2), (err) => {
        if (err) {
          res.status(500).send("Erro ao salvar o catálogo.");
          return;
        }
        res.send({ message: "Produto editado com sucesso!" });
      });
    } else {
      res.status(404).send("Produto não encontrado!");
    }
  });
});

// Iniciar servidor na porta 3000
app.listen(port, () => {
  console.log(`Servidor rodando na porta http://127.0.0.1:${port}`);
});
