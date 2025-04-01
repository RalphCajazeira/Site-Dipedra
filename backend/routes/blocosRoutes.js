const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  listarConteudo,
  criarPasta,
  salvarImagens,
  atualizarMetadadosPorCode,
  deletarPorCaminhoCompleto,
  carregarDB,
  salvarDB,
  moverItem,
} = require("../controllers/blocosController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// ↓↓↓ GET arquivos + metadados por pasta
router.get("/", (req, res) => {
  const dirPath = req.query.path || "assets/blocos";
  try {
    const conteudo = listarConteudo(dirPath);
    res.json(conteudo);
  } catch (err) {
    console.error("Erro ao listar:", err);
    res.status(500).json({ error: err.message });
  }
});

// ↓↓↓ Criar nova pasta
router.post("/folder", (req, res) => {
  const { path: parentPath, name } = req.body;
  const novaPasta = path.posix.join(parentPath, name);
  try {
    criarPasta(novaPasta);
    res.sendStatus(201);
  } catch (err) {
    console.error("Erro ao criar pasta:", err);
    res.status(500).json({ error: err.message });
  }
});

// ↓↓↓ Upload de imagens
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
    console.error("Erro ao salvar imagens:", err);
    res.status(500).json({ error: err.message });
  }
});

// ↓↓↓ Atualizar metadados
router.put("/atualizar-metadata", (req, res) => {
  const { code, nome, comprimento, largura, codeInterno } = req.body;
  try {
    const sucesso = atualizarMetadadosPorCode(code, {
      nome,
      comprimento,
      largura,
      codeInterno,
    });
    if (sucesso) res.sendStatus(200);
    else res.status(404).json({ error: "Code não encontrado" });
  } catch (err) {
    console.error("Erro ao atualizar metadados:", err);
    res.status(500).json({ error: err.message });
  }
});

// ↓↓↓ Deletar arquivo ou pasta
router.delete("/delete", (req, res) => {
  const { path: folderPath, name } = req.body;
  const fullRelPath = path.posix.join(folderPath, name);
  try {
    deletarPorCaminhoCompleto(fullRelPath);
    res.sendStatus(200);
  } catch (err) {
    console.error("Erro ao deletar:", err);
    res.status(500).json({ error: err.message });
  }
});

// ↓↓↓ Renomear pasta
// Renomear pasta (modo local ou produção)
router.put("/rename", async (req, res) => {
  const { path: currentPath, oldName, newName } = req.body;

  try {
    const fullOldPath = path.join(__dirname, "../../", currentPath, oldName);
    const fullNewPath = path.join(__dirname, "../../", currentPath, newName);

    const relOld = path.join(currentPath, oldName).replace(/\\/g, "/");
    const relNew = path.join(currentPath, newName).replace(/\\/g, "/");

    const db = carregarDB();

    // 1. Renomear fisicamente (local)
    if (fs.existsSync(fullOldPath)) {
      await fs.promises.rename(fullOldPath, fullNewPath);
    }

    // 2. Atualizar caminhos no banco
    if (Array.isArray(db.pastas)) {
      db.pastas = db.pastas.map((p) =>
        p.startsWith(relOld) ? p.replace(relOld, relNew) : p
      );
    }

    const novosArquivos = {};
    for (const [caminho, dados] of Object.entries(db.arquivos)) {
      if (caminho.startsWith(relOld)) {
        const novoCaminho = caminho.replace(relOld, relNew);
        novosArquivos[novoCaminho] = dados;
      } else {
        novosArquivos[caminho] = dados;
      }
    }
    db.arquivos = novosArquivos;

    salvarDB(db);

    // Se estiver em produção, movimenta também no Drive
    if (process.env.NODE_ENV === "production") {
      const {
        getDriveFolderId,
        moveFileOrFolder,
        listDriveFilesInFolder,
      } = require("../services/driveService");

      const blocosFolderId = await getDriveFolderId("blocos");
      const subpastas = await listDriveFilesInFolder(blocosFolderId);

      const antiga = subpastas.find((p) => p.name === oldName);
      if (!antiga) return res.sendStatus(200); // nada a mover

      // Cria nova pasta
      const novaId = await createFolder(newName, blocosFolderId);

      // Move arquivos
      const arquivosNaPasta = await listDriveFilesInFolder(antiga.id);
      for (const arquivo of arquivosNaPasta) {
        await moveFileOrFolder(arquivo.id, novaId);
      }

      // Remove pasta antiga (opcional)
      await drive.files.delete({ fileId: antiga.id });
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Erro ao renomear pasta:", err);
    res.status(500).json({ error: "Erro ao renomear pasta" });
  }
});
// ↓↓↓ Mover pasta ou arquivo
router.put("/mover", (req, res) => {
  const { tipo, origem, destino } = req.body;
  try {
    moverItem(origem, destino, tipo);
    res.sendStatus(200);
  } catch (err) {
    console.error("Erro ao mover item:", err);
    res.status(500).json({ error: err.message });
  }
});

// ↓↓↓ Acesso ao blocosDB.json completo
router.get("/db", (req, res) => {
  try {
    const db = carregarDB();
    res.json(db);
  } catch (err) {
    res.status(500).json({ error: "Erro ao carregar blocosDB.json" });
  }
});

module.exports = router;
