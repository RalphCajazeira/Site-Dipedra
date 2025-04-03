// backend/controllers/blocosController.js

const fs = require("fs");
const path = require("path");
const {
  baixarBlocosDB,
  salvarBlocosDBNoDrive,
  carregarBlocosDBDoDrive,
  criarPastaNoDrive,
  uploadArquivoParaDrive,
  renomearItemNoDrive,
  moverItemNoDrive,
  deletarItemNoDrive,
} = require("../services/driveService");

const isProduction = process.env.NODE_ENV === "production";

// Vamos guardar o caminho do blocosDB.json local
const DB_PATH = path.join(__dirname, "..", "blocosDB.json");

// -------------------------
// Carregar DB local
// -------------------------
function lerBlocosLocal() {
  try {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    return {}; // se não existir ou der erro, retorna objeto vazio
  }
}

function salvarBlocosLocal(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

// -------------------------
// Carregar DB (dev ou prod)
// -------------------------
async function carregarDB() {
  if (isProduction) {
    // Em produção, puxa do Drive
    return await carregarBlocosDBDoDrive();
  } else {
    // Em desenvolvimento
    return lerBlocosLocal();
  }
}

// -------------------------
// Salvar DB (dev ou prod)
// -------------------------
async function salvarDB(db) {
  if (isProduction) {
    // Opcional salvar local também, se quiser manter histórico
    salvarBlocosLocal(db);
    await salvarBlocosDBNoDrive(db); // ✅ passa o banco correto
  } else {
    salvarBlocosLocal(db);
  }
}

// Garante que o path no DB exista
function garantirEntradaNoDB(db, dirPath) {
  if (!db[dirPath]) {
    db[dirPath] = {
      folders: [],
      files: [],
      metadados: {},
    };
  }
}

// -------------------------
// Listar conteúdo
// -------------------------
async function listarConteudo(dirPath) {
  if (!dirPath) dirPath = "assets/blocos";

  const db = await carregarDB();
  garantirEntradaNoDB(db, dirPath);

  // Retorna { folders, files, metadados }
  return {
    folders: db[dirPath].folders,
    files: db[dirPath].files,
    metadados: db[dirPath].metadados || {},
  };
}

// -------------------------
// Criar pasta
// -------------------------
async function criarPasta(novoCaminho) {
  if (!novoCaminho) return;

  if (!isProduction) {
    // 1) Cria fisicamente no disco
    const absPath = path.join(__dirname, "..", "..", novoCaminho);
    fs.mkdirSync(absPath, { recursive: true });

    // 2) Atualiza DB local
    const db = lerBlocosLocal();

    // Garante que o pai exista no DB
    const pai = path.dirname(novoCaminho);
    garantirEntradaNoDB(db, pai);

    // Garante que a própria pasta tenha entrada
    garantirEntradaNoDB(db, novoCaminho);

    // Adiciona na lista de folders do pai
    const nomePasta = path.basename(novoCaminho);
    if (!db[pai].folders.includes(nomePasta)) {
      db[pai].folders.push(nomePasta);
    }

    await salvarDB(db);
  } else {
    // PRODUÇÃO => Drive
    await criarPastaNoDrive(novoCaminho);
    // Atualiza DB no Drive
    const db = await carregarDB();

    // Mesmo esquema de atualizar pai
    const pai = path.dirname(novoCaminho);
    garantirEntradaNoDB(db, pai);
    garantirEntradaNoDB(db, novoCaminho);

    const nomePasta = path.basename(novoCaminho);
    if (!db[pai].folders.includes(nomePasta)) {
      db[pai].folders.push(nomePasta);
    }

    await salvarDB(db);
  }
}

// -------------------------
// Salvar imagens (upload)
// -------------------------
// Atualiza a funcao salvarImagens no blocosController.js
// Substituir a antiga salvarImagens por essa nova

const salvarImagens = async (folderPath, files, meta = {}) => {
  if (!folderPath) return [];

  const { nome = "", comprimento, largura, codeInterno = "" } = meta;

  if (!comprimento || !largura) {
    throw new Error("Comprimento e Largura são obrigatórios");
  }

  const formatarMedida = (valor) => {
    const num = parseFloat(valor.toString().replace(",", "."));
    return num.toFixed(2).replace(".", ",");
  };

  const compFormatado = formatarMedida(comprimento);
  const largFormatado = formatarMedida(largura);

  const db = await carregarDB();
  garantirEntradaNoDB(db, folderPath);

  if (!db.__ultimoCodigo__) db.__ultimoCodigo__ = 0;

  const nomesGerados = [];

  for (const file of files) {
    db.__ultimoCodigo__++;
    const code = db.__ultimoCodigo__.toString().padStart(4, "0");

    const partesNome = [];
    if (nome.trim()) partesNome.push(nome.trim());
    partesNome.push(`${compFormatado}x${largFormatado}`);
    if (codeInterno.trim()) partesNome.push(codeInterno.trim());
    partesNome.push(`Id ${code}`);

    const nomeArquivo = partesNome.join(" - ") + ".jpg";

    let url = "";

    if (!isProduction) {
      const destino = path.join(__dirname, "..", "..", folderPath, nomeArquivo);
      fs.mkdirSync(path.dirname(destino), { recursive: true });
      fs.renameSync(file.path, destino);
    } else {
      const resultado = await uploadArquivoParaDrive(
        file,
        folderPath,
        nomeArquivo
      );
      if (resultado?.fileUrl) {
        url = resultado.fileUrl;
      }
    }

    db[folderPath].files.push(nomeArquivo);
    if (!db[folderPath].metadados) db[folderPath].metadados = {};
    db[folderPath].metadados[nomeArquivo] = {
      nome: nome.trim(),
      comprimento: compFormatado,
      largura: largFormatado,
      codeInterno: codeInterno.trim(),
      code,
      url, // ✅ salva a URL pública no banco
    };

    nomesGerados.push(nomeArquivo);
  }

  await salvarDB(db);
  return nomesGerados;
};

module.exports = {
  // ... outros exports
  salvarImagens,
};

// -------------------------
// Atualizar metadados
// -------------------------
async function atualizarMetadadosPorCode(
  code,
  { nome, comprimento, largura, codeInterno }
) {
  // Supondo que você tenha "db[algumPath].metadados[arquivo]" = { code:..., nome:..., ... }
  // Para simplificar, iremos varrer o DB e procurar o code. Ajuste ao seu gosto.

  const db = await carregarDB();
  let encontrado = false;

  for (const dirPath in db) {
    for (const arq in db[dirPath].metadados) {
      if (db[dirPath].metadados[arq].code === code) {
        // Atualiza
        db[dirPath].metadados[arq].nome = nome;
        db[dirPath].metadados[arq].comprimento = comprimento;
        db[dirPath].metadados[arq].largura = largura;
        db[dirPath].metadados[arq].codeInterno = codeInterno;
        encontrado = true;
        break;
      }
    }
    if (encontrado) break;
  }

  if (encontrado) {
    await salvarDB(db);
  }
  return encontrado;
}

// -------------------------
// Deletar
// -------------------------
async function deletarPorCaminhoCompleto(fullPath) {
  if (!fullPath) return;

  if (!isProduction) {
    // 1) Deleta fisicamente (arquivo ou pasta)
    const abs = path.join(__dirname, "..", "..", fullPath);
    if (fs.existsSync(abs)) {
      const stat = fs.statSync(abs);
      if (stat.isDirectory()) {
        fs.rmdirSync(abs, { recursive: true });
      } else {
        fs.unlinkSync(abs);
      }
    }

    // 2) Atualiza DB
    const db = lerBlocosLocal();
    const pai = path.dirname(fullPath);
    const nome = path.basename(fullPath);

    // Se for pasta
    if (db[pai]?.folders.includes(nome)) {
      // Remover da lista de folders
      db[pai].folders = db[pai].folders.filter((f) => f !== nome);

      // Também remover todo o “subtree” do DB (ex: se existiam subpastas)
      removerSubcaminhosDoDB(db, fullPath);
    } else {
      // Se for arquivo
      if (db[pai]?.files.includes(nome)) {
        db[pai].files = db[pai].files.filter((f) => f !== nome);
        // Se houver metadados, remover
        delete db[pai].metadados?.[nome];
      }
    }

    await salvarDB(db);
  } else {
    // PROD => Drive
    await deletarItemNoDrive(fullPath);

    const db = await carregarDB();
    const pai = path.dirname(fullPath);
    const nome = path.basename(fullPath);

    // Remover do DB (mesmo esquema)
    if (db[pai]?.folders.includes(nome)) {
      db[pai].folders = db[pai].folders.filter((f) => f !== nome);
      removerSubcaminhosDoDB(db, fullPath);
    } else if (db[pai]?.files.includes(nome)) {
      db[pai].files = db[pai].files.filter((f) => f !== nome);
      delete db[pai].metadados?.[nome];
    }

    await salvarDB(db);
  }
}

// Função auxiliar que remove todos os caminhos que começam com `raiz`
function removerSubcaminhosDoDB(db, raiz) {
  for (const key of Object.keys(db)) {
    if (key === raiz || key.startsWith(raiz + "/")) {
      delete db[key];
    }
  }
}

// -------------------------
// Mover item
// -------------------------
async function moverItem(origem, destino, tipo) {
  // tipo pode ser "arquivo" ou "pasta" (segundo seu front)

  if (!isProduction) {
    // 1) Fisicamente
    const absOrigem = path.join(__dirname, "..", "..", origem);
    const nomeBase = path.basename(origem);
    const absDestino = path.join(__dirname, "..", "..", destino, nomeBase);
    fs.renameSync(absOrigem, absDestino);

    // 2) Atualiza DB
    const db = lerBlocosLocal();
    const paiOrigem = path.dirname(origem);
    const paiDestino = destino;

    garantirEntradaNoDB(db, paiOrigem);
    garantirEntradaNoDB(db, paiDestino);

    if (tipo === "pasta") {
      // remover da lista de folders do paiOrigem
      db[paiOrigem].folders = db[paiOrigem].folders.filter(
        (f) => f !== nomeBase
      );

      // adicionar na lista do paiDestino
      if (!db[paiDestino].folders.includes(nomeBase)) {
        db[paiDestino].folders.push(nomeBase);
      }

      // Precisamos também mover toda a subárvore no DB:
      const oldRoot = origem; // ex: /assets/blocos/oldFolder
      const newRoot = path.join(destino, nomeBase).replace(/\\/g, "/");

      moverSubcaminhosNoDB(db, oldRoot, newRoot);
    } else {
      // tipo === "arquivo"
      db[paiOrigem].files = db[paiOrigem].files.filter((f) => f !== nomeBase);

      if (!db[paiDestino].files.includes(nomeBase)) {
        db[paiDestino].files.push(nomeBase);
      }

      // Se houver metadados, transfere
      const meta = db[paiOrigem].metadados?.[nomeBase];
      if (meta) {
        db[paiDestino].metadados = db[paiDestino].metadados || {};
        db[paiDestino].metadados[nomeBase] = meta;
        delete db[paiOrigem].metadados[nomeBase];
      }
    }

    await salvarDB(db);
  } else {
    // PROD => Drive
    await moverItemNoDrive(origem, destino);

    // 2) Atualiza DB do Drive
    const db = await carregarDB();
    const nomeBase = path.basename(origem);
    const paiOrigem = path.dirname(origem);
    const paiDestino = destino;

    garantirEntradaNoDB(db, paiOrigem);
    garantirEntradaNoDB(db, paiDestino);

    if (tipo === "pasta") {
      db[paiOrigem].folders = db[paiOrigem].folders.filter(
        (f) => f !== nomeBase
      );
      if (!db[paiDestino].folders.includes(nomeBase)) {
        db[paiDestino].folders.push(nomeBase);
      }

      const oldRoot = origem;
      const newRoot = path.join(destino, nomeBase).replace(/\\/g, "/");
      moverSubcaminhosNoDB(db, oldRoot, newRoot);
    } else {
      db[paiOrigem].files = db[paiOrigem].files.filter((f) => f !== nomeBase);
      if (!db[paiDestino].files.includes(nomeBase)) {
        db[paiDestino].files.push(nomeBase);
      }
      const meta = db[paiOrigem].metadados?.[nomeBase];
      if (meta) {
        db[paiDestino].metadados = db[paiDestino].metadados || {};
        db[paiDestino].metadados[nomeBase] = meta;
        delete db[paiOrigem].metadados[nomeBase];
      }
    }

    await salvarDB(db);
  }
}

// -------------------------
// Mover subcaminhos no DB
// -------------------------
function moverSubcaminhosNoDB(db, oldRoot, newRoot) {
  // Precisamos renomear todas as entradas cujo key inicia com oldRoot
  // Ex: /assets/blocos/folder => /assets/blocos/outroFolder

  const keys = Object.keys(db);
  for (const key of keys) {
    if (key === oldRoot || key.startsWith(oldRoot + "/")) {
      const relative = key.substring(oldRoot.length); // ex: "" ou "/sub1"...
      const newKey = (newRoot + relative).replace(/\\/g, "/");
      // Se a newKey já existe, mesclar? Vamos sobrescrever
      db[newKey] = db[key];
      delete db[key];
    }
  }
}

// -------------------------
// Renomear pasta/arquivo
// -------------------------
async function renomearPasta(currentPath, oldName, newName) {
  if (!oldName || !newName) return;
  const origem = path.join(currentPath, oldName).replace(/\\/g, "/");
  const destino = path.join(currentPath, newName).replace(/\\/g, "/");

  if (!isProduction) {
    // 1) Rename físico
    const absOrigem = path.join(__dirname, "..", "..", origem);
    const absDestino = path.join(__dirname, "..", "..", destino);
    fs.renameSync(absOrigem, absDestino);

    // 2) Atualiza DB
    const db = lerBlocosLocal();
    const pai = currentPath;
    garantirEntradaNoDB(db, pai);

    const isPasta = db[pai].folders.includes(oldName);
    if (isPasta) {
      // Tira o oldName
      db[pai].folders = db[pai].folders.filter((f) => f !== oldName);
      // Coloca o newName
      if (!db[pai].folders.includes(newName)) {
        db[pai].folders.push(newName);
      }

      // Ajustar subcaminhos no DB
      moverSubcaminhosNoDB(db, origem, destino);
    } else {
      // Então é arquivo
      db[pai].files = db[pai].files.filter((f) => f !== oldName);
      if (!db[pai].files.includes(newName)) {
        db[pai].files.push(newName);
      }
      // Se tiver metadados, renomeie a chave
      const meta = db[pai].metadados?.[oldName];
      if (meta) {
        db[pai].metadados[newName] = meta;
        delete db[pai].metadados[oldName];
      }
    }

    await salvarDB(db);
  } else {
    // PROD => Drive
    await renomearItemNoDrive(origem, destino);

    const db = await carregarDB();
    const pai = currentPath;
    garantirEntradaNoDB(db, pai);

    const isPasta = db[pai].folders.includes(oldName);
    if (isPasta) {
      db[pai].folders = db[pai].folders.filter((f) => f !== oldName);
      if (!db[pai].folders.includes(newName)) {
        db[pai].folders.push(newName);
      }

      moverSubcaminhosNoDB(db, origem, destino);
    } else {
      db[pai].files = db[pai].files.filter((f) => f !== oldName);
      if (!db[pai].files.includes(newName)) {
        db[pai].files.push(newName);
      }
      const meta = db[pai].metadados?.[oldName];
      if (meta) {
        db[pai].metadados[newName] = meta;
        delete db[pai].metadados[oldName];
      }
    }

    await salvarDB(db);
  }
}

// dentro do blocosController.js

async function listarConteudoPublica(req, res) {
  const path = req.query.path || "/assets/blocos";
  try {
    const data = await listarConteudo(path);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar conteúdo" });
  }
}

// Exporta
module.exports = {
  listarConteudo,
  criarPasta,
  salvarImagens,
  atualizarMetadadosPorCode,
  deletarPorCaminhoCompleto,
  carregarDB,
  moverItem,
  renomearPasta,
  listarConteudoPublica,
};
