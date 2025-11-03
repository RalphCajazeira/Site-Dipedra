require("../src/config/register-alias");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execSync } = require("child_process");
const assert = require("node:assert/strict");
const { describe, before, after, afterEach, test } = require("node:test");

const databaseFile = path.join(os.tmpdir(), "catalog-repository-test.sqlite");
process.env.DATABASE_URL = `file:${databaseFile.replace(/\\/g, "/")}`;

const repository = require("@/repositories/catalog-repository");
const { prisma } = require("@/lib/prisma-client");

describe("catalog.repository", () => {
  before(async () => {
    if (fs.existsSync(databaseFile)) {
      fs.unlinkSync(databaseFile);
    }

    execSync("npx prisma migrate deploy", {
      cwd: path.join(__dirname, ".."),
      stdio: "inherit",
    });
  });

  afterEach(async () => {
    await prisma.catalogItem.deleteMany();
  });

  after(async () => {
    await prisma.$disconnect();

    if (fs.existsSync(databaseFile)) {
      fs.unlinkSync(databaseFile);
    }
  });

  const baseItem = {
    image: "produto-teste.jpg",
    nome: "Produto Teste",
    tipo: "Revestimento",
    material: "Porcelanato",
    ambientes: ["Sala"],
  };

  test("should insert a new catalog item", async () => {
    const { inserted } = await repository.create(baseItem);
    assert.equal(inserted, true);

    const stored = await repository.findByImage(baseItem.image);
    assert.ok(stored?.id);
    assert.equal(stored.nome, baseItem.nome);
    assert.equal(stored.tipo, baseItem.tipo);
    assert.equal(stored.material, baseItem.material);
    assert.deepEqual(stored.ambientes, baseItem.ambientes);
  });

  test("should update an existing item", async () => {
    await repository.create(baseItem);

    const updated = await repository.update(baseItem.image, {
      ...baseItem,
      nome: "Produto Editado",
    });

    assert.equal(updated.nome, "Produto Editado");

    const stored = await repository.findByImage(baseItem.image);
    assert.equal(stored.nome, "Produto Editado");
  });

  test("should remove an item by image name", async () => {
    await repository.create(baseItem);

    const removed = await repository.remove(baseItem.image);
    assert.equal(removed, true);

    const stored = await repository.findByImage(baseItem.image);
    assert.equal(stored, null);
  });
});
