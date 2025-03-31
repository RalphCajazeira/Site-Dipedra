const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;

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
  const {
    nome,
    comprimento,
    largura,
    codeInterno,
    path: folderPath,
  } = req.body;
  const destino = path.join(__dirname, "../../", folderPath);

  try {
    const nomes = salvarImagens(destino, req.files, {
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

// Atualizar metadados + renomear arquivo
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

// Renomear pasta e atualizar blocosDB.json (arquivos + pastas)
router.put("/rename", async (req, res) => {
  const { path: currentPath, oldName, newName } = req.body;
  const basePath = path.join(__dirname, "../../", currentPath);
  const oldPath = path.join(basePath, oldName);
  const newPath = path.join(basePath, newName);

  const dbPath = path.join(__dirname, "../../blocosDB.json");

  try {
    // 1. Renomear a pasta no sistema de arquivos
    await fs.rename(oldPath, newPath);

    // 2. Carregar o banco
    const dbRaw = await fs.readFile(dbPath, "utf-8");
    const db = JSON.parse(dbRaw);

    const novaEstruturaArquivos = {};
    const caminhoAntigo = path.join(currentPath, oldName).replace(/\\/g, "/");
    const caminhoNovo = path.join(currentPath, newName).replace(/\\/g, "/");

    // 3. Atualizar caminhos dos arquivos
    for (const [caminho, dados] of Object.entries(db.arquivos)) {
      if (caminho.startsWith(caminhoAntigo)) {
        const novoCaminho = caminho.replace(caminhoAntigo, caminhoNovo);
        novaEstruturaArquivos[novoCaminho] = dados;
      } else {
        novaEstruturaArquivos[caminho] = dados;
      }
    }

    db.arquivos = novaEstruturaArquivos;

    // 4. Atualizar caminho da pasta
    if (Array.isArray(db.pastas)) {
      const index = db.pastas.indexOf(caminhoAntigo);
      if (index !== -1) {
        db.pastas[index] = caminhoNovo;
      }
    }

    // 5. Salvar banco atualizado
    await fs.writeFile(dbPath, JSON.stringify(db, null, 2), "utf-8");

    res.sendStatus(200);
  } catch (err) {
    console.error("Erro ao renomear pasta:", err);
    res.status(500).json({ error: "Falha ao renomear a pasta" });
  }
});

module.exports = router;
