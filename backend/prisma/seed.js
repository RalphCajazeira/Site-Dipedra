const fs = require("fs");
const path = require("path");
const { prisma } = require("../src/lib/prisma-client");
const { normalizeAmbientes } = require("../src/utils/ambientes");

async function seedCatalog() {
  const catalogPath = path.join(__dirname, "..", "..", "assets", "catalogo.json");

  if (!fs.existsSync(catalogPath)) {
    console.warn("⚠️  Arquivo assets/catalogo.json não encontrado. Nada foi importado.");
    return;
  }

  const rawContent = fs.readFileSync(catalogPath, "utf-8");
  const items = JSON.parse(rawContent);

  for (const item of items) {
    const ambientes = normalizeAmbientes(item.ambientes);

    await prisma.catalogItem.upsert({
      where: { image: item.imagem },
      create: {
        image: item.imagem,
        name: item.nome,
        type: item.tipo || null,
        material: item.material || null,
        ambientes,
      },
      update: {
        name: item.nome,
        type: item.tipo || null,
        material: item.material || null,
        ambientes,
      },
    });
  }

  console.log(`✅ ${items.length} registros importados para ${process.env.DATABASE_URL}.`);
}

async function main() {
  try {
    await seedCatalog();
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error("❌ Erro ao executar o seed:", error);
    process.exit(1);
  });
}

module.exports = { seedCatalog };
