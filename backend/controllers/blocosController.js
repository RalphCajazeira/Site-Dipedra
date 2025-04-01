const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const {
  salvarBlocosDBNoDrive,
  criarPastaNoDrive,
  uploadImagemParaDrive,
} = require("../services/driveService");

const DB_PATH = path.join(__dirname, "../blocosDB.json");

function carregarDB() {
  const data = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(data);
}

function salvarDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
  if (process.env.NODE_ENV === "production") {
    salvarBlocosDBNoDrive().catch(console.error);
  }
}

function listarConteudo(dirPath) {
  const files = [];
  const folders = [];

  if (!fs.existsSync(dirPath)) return { files, folders };

  fs.readdirSync(dirPath, { withFileTypes: true }).forEach((entry) => {
    if (entry.isDirectory()) folders.push(entry.name);
    else files.push(entry.name);
  });

  return { files, folders };
}

async function criarPasta(fullPath) {
  const db = carregarDB();

  const caminho = fullPath
    .replace(path.resolve(__dirname, "../../"), "")
    .replace(/\\/g, "/");

  if (!db.pastas.includes(caminho)) {
    db.pastas.push(caminho);
    salvarDB(db);
  }

  if (process.env.NODE_ENV === "production") {
    // Criar no Google Drive
    await criarPastaNoDrive(caminho);
  } else {
    // Criar localmente
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  }
}

async function salvarImagens(destino, arquivos, dadosImagem) {
  const db = carregarDB();
  const nomesSalvos = [];

  for (const file of arquivos) {
    const code = Date.now() + Math.floor(Math.random() * 10000);
    const ext = path.extname(file.originalname);
    const nomeFinal = `${dadosImagem.comprimento}x${dadosImagem.largura} - Code ${code}${ext}`;

    let caminho;

    if (process.env.NODE_ENV === "production") {
      // Upload para o Google Drive
      const caminhoRelativo = destino
        .replace(path.resolve(__dirname, "../../"), "")
        .replace(/\\/g, "/");
      const drivePath = caminhoRelativo.replace(/^\/assets\/blocos\/?/, "");
      await uploadImagemParaDrive(drivePath, file, nomeFinal);

      caminho = `/assets/blocos/${drivePath}/${nomeFinal}`;
    } else {
      // Salva localmente
      const destinoFinal = path.join(destino, nomeFinal);
      fs.renameSync(file.path, destinoFinal);

      caminho = destinoFinal
        .replace(path.resolve(__dirname, "../../"), "")
        .replace(/\\/g, "/");
    }

    db.arquivos[caminho] = {
      code,
      nome: dadosImagem.nome || "",
      comprimento: dadosImagem.comprimento,
      largura: dadosImagem.largura,
      codeInterno: dadosImagem.codeInterno || "",
    };

    nomesSalvos.push(nomeFinal);
  }

  salvarDB(db);
  return nomesSalvos;
}

function atualizarMetadadosPorCode(code, novosDados) {
  const db = carregarDB();
  const entradas = Object.entries(db.arquivos);

  for (const [caminho, meta] of entradas) {
    if (meta.code == code) {
      const pasta = path.dirname(caminho);
      const ext = path.extname(caminho);
      const novoNome = `${novosDados.comprimento}x${novosDados.largura} - Code ${code}${ext}`;
      const novoCaminho = `${pasta}/${novoNome}`;

      if (process.env.NODE_ENV !== "production") {
        // Renomeia arquivo localmente
        const antigoPath = path.join(__dirname, "../../", caminho);
        const novoPath = path.join(__dirname, "../../", novoCaminho);
        fs.renameSync(antigoPath, novoPath);
      }

      delete db.arquivos[caminho];
      db.arquivos[novoCaminho] = {
        ...meta,
        ...novosDados,
      };

      salvarDB(db);
      return true;
    }
  }

  return false;
}

function deletarPorCaminhoCompleto(fullPath) {
  const db = carregarDB();
  const relPath = fullPath
    .replace(path.resolve(__dirname, "../../"), "")
    .replace(/\\/g, "/");

  if (fs.existsSync(fullPath) && fs.lstatSync(fullPath).isDirectory()) {
    fs.rmSync(fullPath, { recursive: true, force: true });
    db.pastas = db.pastas.filter((p) => !p.startsWith(relPath));
    for (const arquivo of Object.keys(db.arquivos)) {
      if (arquivo.startsWith(relPath)) delete db.arquivos[arquivo];
    }
  } else {
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    delete db.arquivos[relPath];
  }

  salvarDB(db);
}

function moverItem(origem, destino, tipo) {
  const db = carregarDB();
  const nome = path.basename(origem);
  const novoCaminho = `${destino}/${nome}`;
  const origemAbs = path.join(__dirname, "../../", origem);
  const destinoAbs = path.join(__dirname, "../../", novoCaminho);

  fs.renameSync(origemAbs, destinoAbs);

  const relOrigem = origem;
  const relDestino = novoCaminho;

  if (tipo === "pasta") {
    db.pastas = db.pastas.map((p) =>
      p.startsWith(relOrigem) ? p.replace(relOrigem, relDestino) : p
    );

    const novosArquivos = {};
    for (const [caminho, dados] of Object.entries(db.arquivos)) {
      if (caminho.startsWith(relOrigem)) {
        const novoPath = caminho.replace(relOrigem, relDestino);
        novosArquivos[novoPath] = dados;
      } else {
        novosArquivos[caminho] = dados;
      }
    }
    db.arquivos = novosArquivos;
  } else {
    if (db.arquivos[relOrigem]) {
      db.arquivos[relDestino] = db.arquivos[relOrigem];
      delete db.arquivos[relOrigem];
    }
  }

  salvarDB(db);
}

module.exports = {
  listarConteudo,
  criarPasta,
  salvarImagens,
  atualizarMetadadosPorCode,
  deletarPorCaminhoCompleto,
  carregarDB,
  moverItem,
};
