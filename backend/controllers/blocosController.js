const fs = require("fs");
const path = require("path");
const { salvarBlocosDBNoDrive } = require("../services/driveService");

const ROOT = process.env.BLOCOS_ROOT || path.resolve(__dirname, "../../");

const DB_PATH = path.join(ROOT, "blocosDB.json");

function carregarDB() {
  if (!fs.existsSync(DB_PATH)) return { arquivos: {}, pastas: [] };

  try {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (e) {
    console.error("Erro ao carregar blocosDB.json:", e.message);
    return { arquivos: {}, pastas: [] };
  }
}

function salvarDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  if (process.env.NODE_ENV === "production") {
    salvarBlocosDBNoDrive().catch(console.error);
  }
}

function listarConteudo(dirRelativo) {
  const db = carregarDB();
  const prefixo = dirRelativo.replace(/\/$/, "");

  const folders = db.pastas
    .filter((p) => path.dirname(p) === prefixo)
    .map((p) => path.basename(p));

  const files = Object.keys(db.arquivos)
    .filter((filePath) => path.dirname(filePath) === prefixo)
    .map((p) => path.basename(p));

  const metadados = {};
  for (const [caminho, dados] of Object.entries(db.arquivos)) {
    if (path.dirname(caminho) === prefixo) {
      metadados[path.basename(caminho)] = dados;
    }
  }

  return { folders, files, metadados };
}

function criarPasta(pathRelativo) {
  const db = carregarDB();
  const caminhoCompleto = path.join(ROOT, pathRelativo);

  if (!fs.existsSync(caminhoCompleto)) {
    fs.mkdirSync(caminhoCompleto, { recursive: true });
  }

  const normalizado = pathRelativo.replace(/\\/g, "/");
  if (!db.pastas.includes(normalizado)) {
    db.pastas.push(normalizado);
    salvarDB(db);
  }
}

function salvarImagens(destinoRelativo, arquivos, dadosImagem) {
  const db = carregarDB();
  const nomesSalvos = [];

  const destinoFisico = path.join(ROOT, destinoRelativo);
  if (!fs.existsSync(destinoFisico)) {
    fs.mkdirSync(destinoFisico, { recursive: true });
  }

  arquivos.forEach((file) => {
    const code = Date.now() + Math.floor(Math.random() * 10000);
    const ext = path.extname(file.originalname);
    const nomeFinal = `${dadosImagem.comprimento}x${dadosImagem.largura} - Code ${code}${ext}`;
    const destinoCompleto = path.join(destinoFisico, nomeFinal);
    const caminhoNoDB = path
      .join(destinoRelativo, nomeFinal)
      .replace(/\\/g, "/");

    fs.renameSync(file.path, destinoCompleto);

    db.arquivos[caminhoNoDB] = {
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
      const novoCaminho = `${pasta}/${novoNome}`.replace(/\\/g, "/");

      const oldPath = path.join(ROOT, caminho);
      const newPath = path.join(ROOT, novoCaminho);

      fs.renameSync(oldPath, newPath);

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

function deletarPorCaminhoCompleto(caminhoRelativo) {
  const db = carregarDB();
  const fullPath = path.join(ROOT, caminhoRelativo);

  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      fs.rmSync(fullPath, { recursive: true, force: true });

      db.pastas = db.pastas.filter((p) => !p.startsWith(caminhoRelativo));
      for (const key of Object.keys(db.arquivos)) {
        if (key.startsWith(caminhoRelativo)) delete db.arquivos[key];
      }
    } else {
      fs.unlinkSync(fullPath);
      delete db.arquivos[caminhoRelativo];
    }

    salvarDB(db);
  }
}

function moverItem(origemRel, destinoRel, tipo) {
  const db = carregarDB();
  const nome = path.basename(origemRel);
  const novoRel = `${destinoRel}/${nome}`.replace(/\\/g, "/");

  const origemAbs = path.join(ROOT, origemRel);
  const destinoAbs = path.join(ROOT, novoRel);

  fs.renameSync(origemAbs, destinoAbs);

  if (tipo === "pasta") {
    db.pastas = db.pastas.map((p) =>
      p.startsWith(origemRel) ? p.replace(origemRel, novoRel) : p
    );

    const novosArquivos = {};
    for (const [caminho, dados] of Object.entries(db.arquivos)) {
      if (caminho.startsWith(origemRel)) {
        const novo = caminho.replace(origemRel, novoRel);
        novosArquivos[novo] = dados;
      } else {
        novosArquivos[caminho] = dados;
      }
    }
    db.arquivos = novosArquivos;
  } else {
    db.arquivos[novoRel] = db.arquivos[origemRel];
    delete db.arquivos[origemRel];
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
  salvarDB,
  moverItem,
};
