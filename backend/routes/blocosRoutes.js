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
  moverItem,
  renomearPasta,
} = require("../controllers/blocosController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/", (req, res) => {
  const dirPath = req.query.path || "assets/blocos";

  try {
    const conteudo = listarConteudo(dirPath);
    res.json(conteudo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/folder", (req, res) => {
  const { path: currentPath, name } = req.body;
  const newPath = path.join(currentPath, name).replace(/\\/g, "/");

  try {
    criarPasta(newPath);
    res.sendStatus(201);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/upload", upload.array("images"), (req, res) => {
  const {
    nome,
    comprimento,
    largura,
    codeInterno,
    path: folderPath,
  } = req.body;

  try {
    const nomes = salvarImagens(folderPath, req.files, {
      nome,
      comprimento,
      largura,
      codeInterno,
    });
    res.status(201).json({ arquivos: nomes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/atualizar-metadata", (req, res) => {
  const { code, nome, comprimento, largura, codeInterno } = req.body;
  const sucesso = atualizarMetadadosPorCode(code, {
    nome,
    comprimento,
    largura,
    codeInterno,
  });

  if (sucesso) res.sendStatus(200);
  else res.status(404).json({ error: "Code não encontrado" });
});

router.delete("/delete", (req, res) => {
  const { path: folderPath, name } = req.body;
  const fullPath = path.join(folderPath, name).replace(/\\/g, "/");

  try {
    deletarPorCaminhoCompleto(fullPath);
    res.sendStatus(200);
  } catch (err) {
    console.error("Erro ao deletar:", err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/rename", (req, res) => {
  const { path: currentPath, oldName, newName } = req.body;

  try {
    renomearPasta(currentPath, oldName, newName);
    res.sendStatus(200);
  } catch (err) {
    console.error("Erro ao renomear pasta:", err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/mover", (req, res) => {
  const { tipo, origem, destino } = req.body;

  try {
    moverItem(origem, destino, tipo);
    res.sendStatus(200);
  } catch (err) {
    console.error("Erro ao mover:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/db", (req, res) => {
  try {
    const db = carregarDB();
    res.json(db);
  } catch (err) {
    res.status(500).json({ error: "Erro ao carregar blocosDB.json" });
  }
});

module.exports = router;
