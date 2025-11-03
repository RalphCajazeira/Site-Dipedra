const fs = require("fs");
const os = require("os");
const path = require("path");

jest.mock("../services/driveService", () => ({
  salvarBlocosDBNoDrive: jest.fn().mockResolvedValue(),
}));

describe("blocosController", () => {
  let tempRoot;
  let controller;

  const loadController = () => {
    jest.resetModules();
    process.env.BLOCOS_ROOT = tempRoot;
    return require("../controllers/blocosController");
  };

  beforeEach(() => {
    tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "blocos-test-"));
    controller = loadController();
  });

  afterEach(() => {
    fs.rmSync(tempRoot, { recursive: true, force: true });
    delete process.env.BLOCOS_ROOT;
    jest.resetModules();
  });

  const writeDB = (data) => {
    fs.writeFileSync(
      path.join(tempRoot, "blocosDB.json"),
      JSON.stringify(data, null, 2)
    );
  };

  test("moverItem atualiza pastas e arquivos ao mover uma pasta", () => {
    const origemDir = path.join(tempRoot, "uploads", "origem");
    const origemSubdir = path.join(origemDir, "sub");
    fs.mkdirSync(origemSubdir, { recursive: true });
    const arquivoOrigem = path.join(origemSubdir, "file.txt");
    fs.writeFileSync(arquivoOrigem, "conteudo");

    const destinoDir = path.join(tempRoot, "destino");
    fs.mkdirSync(destinoDir, { recursive: true });

    writeDB({
      pastas: ["uploads", "uploads/origem", "uploads/origem/sub", "destino"],
      arquivos: {
        "uploads/origem/sub/file.txt": {
          code: 101,
          nome: "file",
          comprimento: 10,
          largura: 20,
        },
      },
    });

    controller.moverItem("uploads/origem", "destino", "pasta");

    expect(
      fs.existsSync(path.join(destinoDir, "origem", "sub", "file.txt"))
    ).toBe(true);

    const dbAtualizado = controller.carregarDB();
    expect(dbAtualizado.pastas).toEqual(
      expect.arrayContaining(["destino/origem", "destino/origem/sub", "destino"])
    );
    expect(dbAtualizado.pastas).not.toContain("uploads/origem");
    expect(dbAtualizado.pastas).not.toContain("uploads/origem/sub");
    expect(dbAtualizado.arquivos["destino/origem/sub/file.txt"]).toEqual({
      code: 101,
      nome: "file",
      comprimento: 10,
      largura: 20,
    });
    expect(dbAtualizado.arquivos).not.toHaveProperty(
      "uploads/origem/sub/file.txt"
    );
  });

  test("moverItem atualiza arquivos ao mover um arquivo", () => {
    const origemDir = path.join(tempRoot, "uploads");
    fs.mkdirSync(origemDir, { recursive: true });
    const arquivoOrigem = path.join(origemDir, "imagem.png");
    fs.writeFileSync(arquivoOrigem, "binario");

    const destinoDir = path.join(tempRoot, "destino");
    fs.mkdirSync(destinoDir, { recursive: true });

    writeDB({
      pastas: ["uploads", "destino"],
      arquivos: {
        "uploads/imagem.png": {
          code: 202,
          nome: "imagem",
          comprimento: 15,
          largura: 25,
        },
      },
    });

    controller.moverItem("uploads/imagem.png", "destino", "arquivo");

    expect(fs.existsSync(path.join(destinoDir, "imagem.png"))).toBe(true);
    expect(fs.existsSync(arquivoOrigem)).toBe(false);

    const dbAtualizado = controller.carregarDB();
    expect(dbAtualizado.arquivos["destino/imagem.png"]).toEqual({
      code: 202,
      nome: "imagem",
      comprimento: 15,
      largura: 25,
    });
    expect(dbAtualizado.arquivos).not.toHaveProperty("uploads/imagem.png");
  });

  test("atualizarMetadadosPorCode renomeia arquivo e atualiza metadados", () => {
    const pasta = path.join(tempRoot, "galeria");
    fs.mkdirSync(pasta, { recursive: true });
    const nomeOriginal = "10x20 - Code 303.png";
    const caminhoOriginal = path.join(pasta, nomeOriginal);
    fs.writeFileSync(caminhoOriginal, "imagem");

    writeDB({
      pastas: ["galeria"],
      arquivos: {
        "galeria/10x20 - Code 303.png": {
          code: 303,
          nome: "Peça",
          comprimento: 10,
          largura: 20,
          codeInterno: "A1",
        },
      },
    });

    const novosDados = {
      nome: "Peça atualizada",
      comprimento: 30,
      largura: 40,
      codeInterno: "B2",
    };

    const resultado = controller.atualizarMetadadosPorCode(303, novosDados);
    expect(resultado).toBe(true);

    const novoNome = "30x40 - Code 303.png";
    expect(fs.existsSync(path.join(pasta, novoNome))).toBe(true);
    expect(fs.existsSync(caminhoOriginal)).toBe(false);

    const dbAtualizado = controller.carregarDB();
    expect(dbAtualizado.arquivos["galeria/30x40 - Code 303.png"]).toEqual({
      code: 303,
      nome: "Peça atualizada",
      comprimento: 30,
      largura: 40,
      codeInterno: "B2",
    });
    expect(dbAtualizado.arquivos).not.toHaveProperty(
      "galeria/10x20 - Code 303.png"
    );
  });
});
