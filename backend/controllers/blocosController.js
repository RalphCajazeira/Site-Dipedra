const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const { v4: uuidv4 } = require("uuid");

const DB_PATH = path.join(__dirname, "../blocosDB.json");

function carregarDB() {
  const data = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(data);
}

function salvarDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
  if (process.env.NODE_ENV === "production") {
    const { salvarBlocosDBNoDrive } = require("../services/driveService");
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

function criarPasta(fullPath) {
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });

    const db = carregarDB();
    const caminho = fullPath
      .replace(path.resolve(__dirname, "../../"), "")
      .replace(/\\/g, "/");

    if (!db.pastas.includes(caminho)) {
      db.pastas.push(caminho);
      salvarDB(db);
    }
  }
}

function salvarImagens(destino, arquivos, dadosImagem) {
  const db = carregarDB();
  const nomesSalvos = [];

  arquivos.forEach((file) => {
    const code = Date.now() + Math.floor(Math.random() * 10000);
    const ext = path.extname(file.originalname);
    const nomeFinal = `${dadosImagem.comprimento}x${dadosImagem.largura} - Code ${code}${ext}`;
    const destinoFinal = path.join(destino, nomeFinal);

    fs.renameSync(file.path, destinoFinal);

    const caminho = destinoFinal
      .replace(path.resolve(__dirname, "../../"), "")
      .replace(/\\/g, "/");

    db.arquivos[caminho] = {
      code,
      nome: dadosImagem.nome || "",
      comprimento: dadosImagem.comprimento,
      largura: dadosImagem.largura,
      codeInterno: dadosImagem.codeInterno || "",
    };

    nomesSalvos.push(nomeFinal);
  });

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

      // Renomear arquivo
      const antigoPath = path.join(__dirname, "../../", caminho);
      const novoPath = path.join(__dirname, "../../", novoCaminho);

      fs.renameSync(antigoPath, novoPath);

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

  if (fs.lstatSync(fullPath).isDirectory()) {
    fs.rmSync(fullPath, { recursive: true, force: true });

    db.pastas = db.pastas.filter((p) => !p.startsWith(relPath));
    for (const arquivo of Object.keys(db.arquivos)) {
      if (arquivo.startsWith(relPath)) delete db.arquivos[arquivo];
    }
  } else {
    fs.unlinkSync(fullPath);
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
    // Atualizar estrutura de pastas e arquivos que começam com a origem
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
    // Tipo arquivo
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
