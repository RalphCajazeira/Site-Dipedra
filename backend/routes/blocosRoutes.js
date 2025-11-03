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

function normalizeRelativePath(rawPath = "") {
  const sanitized = rawPath.toString();
  const normalized = path.posix
    .normalize(sanitized)
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");

  const cleaned = normalized === "." ? "" : normalized;
  const withoutTraversal = cleaned.replace(/^(\.\.\/+)+/, "");
  return withoutTraversal;
}

async function syncDriveRename({ currentPath, oldName, newName, driveFns }) {
  const services =
    driveFns || require("../services/driveService");

  const {
    getDriveFolderId,
    listDriveFilesInFolder,
    moveFileOrFolder,
    createFolder,
    deleteFileOrFolder,
    DRIVE_FOLDER_NOT_FOUND,
  } = services;

  const parentPath = currentPath
    ? path.posix.join(currentPath, "")
    : "";

  const parentFolderId = await getDriveFolderId(parentPath, {
    createIfMissing: true,
  });

  let oldFolderId;
  try {
    oldFolderId = await getDriveFolderId(
      path.posix.join(parentPath, oldName)
    );
  } catch (error) {
    if (error && error.code === DRIVE_FOLDER_NOT_FOUND) {
      console.warn(
        `⚠️ Pasta "${oldName}" não encontrada no Drive para sincronizar renomeação.`
      );
      return { skipped: true };
    }
    throw error;
  }

  let newFolderId;
  try {
    newFolderId = await getDriveFolderId(
      path.posix.join(parentPath, newName)
    );
  } catch (error) {
    if (error && error.code === DRIVE_FOLDER_NOT_FOUND) {
      const criada = await createFolder(newName, parentFolderId);
      newFolderId = criada?.id || criada;
    } else {
      throw error;
    }
  }

  const itens = await listDriveFilesInFolder(oldFolderId);
  let movedCount = 0;
  for (const item of itens) {
    await moveFileOrFolder(item.id, newFolderId);
    movedCount += 1;
  }

  await deleteFileOrFolder(oldFolderId);

  return {
    parentFolderId,
    oldFolderId,
    newFolderId,
    movedCount,
  };
}

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
  const { path: currentPath = "", oldName, newName } = req.body;

  if (!oldName || !newName) {
    return res
      .status(400)
      .json({ error: "Parâmetros oldName e newName são obrigatórios." });
  }

  if (oldName === newName) {
    return res.sendStatus(200);
  }

  try {
    const sanitizedCurrentPath = normalizeRelativePath(currentPath);
    const relOld = normalizeRelativePath(
      path.posix.join(sanitizedCurrentPath, oldName)
    );
    const relNew = normalizeRelativePath(
      path.posix.join(sanitizedCurrentPath, newName)
    );

    const fullOldPath = path.resolve(
      __dirname,
      "../../",
      relOld
    );
    const fullNewPath = path.resolve(
      __dirname,
      "../../",
      relNew
    );

    const db = carregarDB();

    // 1. Renomear fisicamente (local)
    if (fs.existsSync(fullOldPath)) {
      await fs.promises.rename(fullOldPath, fullNewPath);
    } else {
      console.warn(
        `⚠️ Caminho local "${fullOldPath}" não encontrado para renomear.`
      );
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

    if (process.env.NODE_ENV === "production") {
      await syncDriveRename({
        currentPath: sanitizedCurrentPath,
        oldName,
        newName,
      });
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
module.exports.syncDriveRename = syncDriveRename;
