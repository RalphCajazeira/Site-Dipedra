const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  listarConteudo,
  criarPasta,
  salvarImagens,
  atualizarMetadadosPorCode,
  deletarPorCaminhoCompleto,
  carregarDB,
} = require("../controllers/blocosController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Listar arquivos + metadados
router.get("/", (req, res) => {
  const dirPath = req.query.path || "/assets/blocos";
  const fullPath = path.join(__dirname, "../../", dirPath);

  try {
    const conteudo = listarConteudo(fullPath);
    const db = carregarDB();

    const metadados = {};
    for (const [caminho, dados] of Object.entries(db.arquivos)) {
      if (caminho.startsWith(dirPath)) {
        const nomeArquivo = path.basename(caminho);
        metadados[nomeArquivo] = dados;
      }
    }

    res.json({
      ...conteudo,
      metadados,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar pasta
router.post("/folder", (req, res) => {
  const { path: currentPath, name } = req.body;
  const fullPath = path.join(__dirname, "../../", currentPath, name);

  try {
    criarPasta(fullPath);
    res.sendStatus(201);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload múltiplo
router.post("/upload", upload.array("images"), (req, res) => {
  const { nome, comprimento, largura, lote, path: folderPath } = req.body;
  const destino = path.join(__dirname, "../../", folderPath);

  try {
    const nomes = salvarImagens(destino, req.files, {
      nome,
      comprimento,
      largura,
      lote,
    });
    res.status(201).json({ arquivos: nomes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar metadados + renomear arquivo
router.put("/atualizar-metadata", (req, res) => {
  const { code, nome, comprimento, largura, lote } = req.body;
  const sucesso = atualizarMetadadosPorCode(code, {
    nome,
    comprimento,
    largura,
    lote,
  });

  if (sucesso) res.sendStatus(200);
  else res.status(404).json({ error: "Code não encontrado" });
});

// Deletar arquivo ou pasta
router.delete("/delete", (req, res) => {
  const { path: folderPath, name } = req.body;
  const fullPath = path.join(folderPath, name);

  try {
    deletarPorCaminhoCompleto(fullPath);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
