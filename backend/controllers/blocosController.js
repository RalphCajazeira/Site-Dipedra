const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "../../blocosDB.json");

function carregarDB() {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(
      dbPath,
      JSON.stringify({ arquivos: {}, pastas: [] }, null, 2)
    );
  }
  const raw = fs.readFileSync(dbPath);
  return JSON.parse(raw);
}

function salvarDB(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

function gerarCodeUnico(db) {
  const codigos = Object.values(db.arquivos).map((entry) => entry.code || 0);
  const maior = codigos.length ? Math.max(...codigos) : 0;
  return maior + 1;
}

function listarConteudo(dir) {
  if (!fs.existsSync(dir)) throw new Error("Diretório não encontrado");

  const itens = fs.readdirSync(dir);
  const folders = itens.filter((i) =>
    fs.statSync(path.join(dir, i)).isDirectory()
  );
  const files = itens.filter((i) => fs.statSync(path.join(dir, i)).isFile());

  return { folders, files };
}

function criarPasta(dir) {
  if (fs.existsSync(dir)) {
    throw new Error("Uma pasta com esse nome já existe nesse diretório.");
  }

  fs.mkdirSync(dir, { recursive: true });

  const db = carregarDB();
  const relPath = path
    .relative(path.join(__dirname, "../../"), dir)
    .replace(/\\/g, "/");

  if (!db.pastas.includes("/" + relPath)) {
    db.pastas.push("/" + relPath);
    salvarDB(db);
  }
}

function salvarImagens(destino, arquivos, meta) {
  const db = carregarDB();
  if (!fs.existsSync(destino)) fs.mkdirSync(destino, { recursive: true });

  const salvos = [];

  for (const arquivo of arquivos) {
    const code = gerarCodeUnico(db);
    const ext = path.extname(arquivo.originalname);

    const { nome, comprimento, largura, codeInterno } = meta;

    let baseNome = nome || "";
    if (comprimento && largura) baseNome += ` ${comprimento}x${largura}`;
    if (codeInterno) baseNome += ` - codeInterno ${codeInterno}`;
    baseNome = baseNome.trim().replace(/[\\/:"*?<>|]+/g, "");

    const nomeFinal = `${baseNome ? baseNome + " - " : ""}Code ${code}${ext}`;
    const caminhoFinal = path.join(destino, nomeFinal);
    const relFinal = path
      .relative(path.join(__dirname, "../../"), caminhoFinal)
      .replace(/\\/g, "/");

    fs.renameSync(arquivo.path, caminhoFinal);

    db.arquivos["/" + relFinal] = {
      code,
      nome: nome || "",
      comprimento,
      largura,
      codeInterno,
    };

    salvos.push(nomeFinal);
  }

  salvarDB(db);
  return salvos;
}

function atualizarMetadadosPorCode(code, novosDados) {
  const db = carregarDB();
  const entrada = Object.entries(db.arquivos).find(
    ([_, dados]) => dados.code == code
  );

  if (entrada) {
    const [caminhoAntigo, dadosAntigos] = entrada;
    const ext = path.extname(caminhoAntigo);
    const pasta = path.dirname(caminhoAntigo);
    let novoNome = novosDados.nome || "";
    if (novosDados.comprimento && novosDados.largura)
      novoNome += ` ${novosDados.comprimento}x${novosDados.largura}`;
    if (novosDados.codeInterno)
      novoNome += ` - codeInterno ${novosDados.codeInterno}`;
    novoNome = `${novoNome ? novoNome + " - " : ""}Code ${code}${ext}`;
    const novoCaminho = `${pasta}/${novoNome}`;

    const fullAntigo = path.join(__dirname, "../../", caminhoAntigo);
    const fullNovo = path.join(__dirname, "../../", novoCaminho);
    fs.renameSync(fullAntigo, fullNovo);

    delete db.arquivos[caminhoAntigo];
    db.arquivos[novoCaminho] = {
      ...dadosAntigos,
      ...novosDados,
      code,
    };

    salvarDB(db);
    return true;
  }

  return false;
}

function deletarPorCaminhoCompleto(caminho) {
  const db = carregarDB();
  const full = path.join(__dirname, "../../", caminho);
  const stat = fs.statSync(full);

  // Normalizar o caminho para o formato do JSON (barra inicial e separador de /)
  const rel = "/" + caminho.replace(/\\/g, "/").replace(/^\/+/, "");

  if (stat.isDirectory()) {
    fs.rmSync(full, { recursive: true, force: true });

    // Remove pastas e arquivos do JSON que começam com o caminho
    db.pastas = db.pastas.filter((p) => !p.startsWith(rel));
    db.arquivos = Object.fromEntries(
      Object.entries(db.arquivos).filter(([k]) => !k.startsWith(rel))
    );
  } else {
    fs.unlinkSync(full);
    delete db.arquivos[rel];
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
};
