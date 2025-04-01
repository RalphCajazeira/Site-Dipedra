const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;

const {
  criarPasta,
  salvarImagens,
  atualizarMetadadosPorCode,
  deletarPorCaminhoCompleto,
  carregarDB,
} = require("../controllers/blocosController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// ✅ NOVO: Listar conteúdo da pasta com base no blocosDB.json
router.get("/", (req, res) => {
  const dirPath = req.query.path || "/assets/blocos";

  try {
    const db = carregarDB();

    const arquivosNaPasta = [];
    const subpastas = [];
    const metadados = {};

    for (const [caminho, dados] of Object.entries(db.arquivos)) {
      if (path.dirname(caminho) === dirPath) {
        const nomeArquivo = path.basename(caminho);
        arquivosNaPasta.push(nomeArquivo);
        metadados[nomeArquivo] = dados;
      }
    }

    for (const pasta of db.pastas || []) {
      const base = pasta.replace(dirPath + "/", "");
      if (pasta.startsWith(dirPath) && base.indexOf("/") === -1) {
        subpastas.push(base);
      }
    }

    res.json({
      files: arquivosNaPasta,
      folders: subpastas,
      metadados,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ NOVO: Listar todas as pastas (para mover.js)
router.get("/listar-pastas", (req, res) => {
  try {
    const db = carregarDB();
    res.json({ pastas: db.pastas || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar pasta
router.post("/folder", (req, res) => {
  console.log("📦 Requisição recebida para criar pasta");
  console.log("Body:", req.body);

  const { path: currentPath, name } = req.body;

  if (!currentPath || !name) {
    return res.status(400).json({ error: "Parâmetros inválidos" });
  }

  const fullPath = path.join(__dirname, "../../", currentPath, name);
  console.log("➡️ Caminho completo para nova pasta:", fullPath);

  try {
    criarPasta(fullPath);
    res.sendStatus(201);
  } catch (err) {
    console.error("❌ Erro ao criar pasta:", err.message);
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

// Renomear pasta
router.put("/rename", async (req, res) => {
  const { path: currentPath, oldName, newName } = req.body;
  const basePath = path.join(__dirname, "../../", currentPath);
  const oldPath = path.join(basePath, oldName);
  const newPath = path.join(basePath, newName);

  const dbPath = path.join(__dirname, "../../backend/blocosDB.json");

  try {
    await fs.rename(oldPath, newPath);

    const dbRaw = await fs.readFile(dbPath, "utf-8");
    const db = JSON.parse(dbRaw);

    const novaEstruturaArquivos = {};
    const caminhoAntigo = path.join(currentPath, oldName).replace(/\\/g, "/");
    const caminhoNovo = path.join(currentPath, newName).replace(/\\/g, "/");

    for (const [caminho, dados] of Object.entries(db.arquivos)) {
      if (caminho.startsWith(caminhoAntigo)) {
        const novoCaminho = caminho.replace(caminhoAntigo, caminhoNovo);
        novaEstruturaArquivos[novoCaminho] = dados;
      } else {
        novaEstruturaArquivos[caminho] = dados;
      }
    }

    db.arquivos = novaEstruturaArquivos;

    if (Array.isArray(db.pastas)) {
      const index = db.pastas.indexOf(caminhoAntigo);
      if (index !== -1) {
        db.pastas[index] = caminhoNovo;
      }
    }

    await fs.writeFile(dbPath, JSON.stringify(db, null, 2), "utf-8");

    res.sendStatus(200);
  } catch (err) {
    console.error("Erro ao renomear pasta:", err);
    res.status(500).json({ error: "Falha ao renomear a pasta" });
  }
});

// Mover
router.put("/mover", async (req, res) => {
  const { tipo, origem, destino } = req.body;
  const raiz = path.join(__dirname, "../../");
  const dbPath = path.join(raiz, "backend/blocosDB.json");
  const fsPromises = fs;

  try {
    const nomeItem = path.basename(origem);
    const origemAbs = path.join(raiz, origem);
    const destinoAbs = path.join(raiz, destino, nomeItem);
    const dbRaw = await fsPromises.readFile(dbPath, "utf-8");
    const db = JSON.parse(dbRaw);

    await fsPromises.rename(origemAbs, destinoAbs);

    const relOrigem = "/" + path.relative(raiz, origemAbs).replace(/\\/g, "/");
    const relDestino =
      "/" + path.relative(raiz, destinoAbs).replace(/\\/g, "/");

    if (tipo === "arquivo") {
      const dados = db.arquivos[relOrigem];
      delete db.arquivos[relOrigem];
      db.arquivos[relDestino] = dados;
    } else if (tipo === "pasta") {
      const subPastas = db.pastas.filter((p) => p.startsWith(relOrigem));
      const novasPastas = subPastas.map((p) =>
        p.replace(relOrigem, relDestino)
      );
      db.pastas = db.pastas
        .filter((p) => !p.startsWith(relOrigem))
        .concat(novasPastas);

      const novosArquivos = {};
      for (const [caminho, meta] of Object.entries(db.arquivos)) {
        if (caminho.startsWith(relOrigem)) {
          const novo = caminho.replace(relOrigem, relDestino);
          novosArquivos[novo] = meta;
        } else {
          novosArquivos[caminho] = meta;
        }
      }

      db.arquivos = novosArquivos;
    }

    await fsPromises.writeFile(dbPath, JSON.stringify(db, null, 2));
    res.sendStatus(200);
  } catch (error) {
    console.error("Erro ao mover:", error);
    res.status(500).json({ error: "Falha ao mover item." });
  }
});

// Rota de debug (opcional)
router.get("/db", (req, res) => {
  try {
    const db = carregarDB();
    res.json(db);
  } catch (err) {
    res.status(500).json({ error: "Erro ao carregar blocosDB.json" });
  }
});

module.exports = router;
