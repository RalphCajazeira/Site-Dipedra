// backend/routes/blocosRoutes.js
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

// GET /blocos?path=...
router.get("/", async (req, res) => {
  const dirPath = req.query.path || "assets/blocos";
  try {
    const conteudo = await listarConteudo(dirPath);
    res.json(conteudo); // { folders, files, metadados }
  } catch (err) {
    console.error("Erro ao listar conteudo:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /blocos/folder => criar pasta
router.post("/folder", async (req, res) => {
  const { path: currentPath, name } = req.body;
  const newPath = path.join(currentPath, name).replace(/\\/g, "/");
  try {
    await criarPasta(newPath);
    res.sendStatus(201);
  } catch (err) {
    console.error("Erro ao criar pasta:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /blocos/upload => upload de imagens
router.post("/upload", upload.array("images"), async (req, res) => {
  const { nome, comprimento, largura, codeInterno, path: folderPath } = req.body;
  try {
    const nomes = await salvarImagens(folderPath, req.files, {
      nome,
      comprimento,
      largura,
      codeInterno,
    });
    res.status(201).json({ arquivos: nomes });
  } catch (err) {
    console.error("Erro ao fazer upload:", err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /blocos/atualizar-metadata => atualizar metadados
router.put("/atualizar-metadata", async (req, res) => {
  const { code, nome, comprimento, largura, codeInterno } = req.body;
  try {
    const sucesso = await atualizarMetadadosPorCode(code, {
      nome,
      comprimento,
      largura,
      codeInterno,
    });
    if (sucesso) {
      res.sendStatus(200);
    } else {
      res.status(404).json({ error: "Code não encontrado" });
    }
  } catch (err) {
    console.error("Erro ao atualizar metadata:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /blocos/delete => deletar
router.delete("/delete", async (req, res) => {
  const { path: folderPath, name } = req.body;
  const fullPath = path.join(folderPath, name).replace(/\\/g, "/");
  try {
    await deletarPorCaminhoCompleto(fullPath);
    res.sendStatus(200);
  } catch (err) {
    console.error("Erro ao deletar:", err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /blocos/rename => renomear
router.put("/rename", async (req, res) => {
  const { path: currentPath, oldName, newName } = req.body;
  try {
    await renomearPasta(currentPath, oldName, newName);
    res.sendStatus(200);
  } catch (err) {
    console.error("Erro ao renomear pasta:", err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /blocos/mover => mover item
router.put("/mover", async (req, res) => {
  const { tipo, origem, destino } = req.body;
  try {
    await moverItem(origem, destino, tipo);
    res.sendStatus(200);
  } catch (err) {
    console.error("Erro ao mover:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /blocos/db => retorna o DB inteiro (opcional)
router.get("/db", async (req, res) => {
  try {
    const db = await carregarDB();
    res.json(db);
  } catch (err) {
    console.error("Erro ao carregar db:", err);
    res.status(500).json({ error: "Erro ao carregar blocosDB.json" });
  }
});

module.exports = router;
