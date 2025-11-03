require("../config/register-alias");
const { PrismaClientKnownRequestError } = require("@prisma/client/runtime/library");
const { prisma } = require("@/lib/prisma-client");

function mapCatalogItem(entity) {
  if (!entity) {
    return null;
  }

  return {
    id: entity.id,
    image: entity.image,
    nome: entity.name,
    tipo: entity.type,
    material: entity.material,
    ambientes: entity.ambientes,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}

async function create(item) {
  try {
    const entity = await prisma.catalogItem.create({
      data: {
        image: item.image,
        name: item.nome,
        type: item.tipo,
        material: item.material,
        ambientes: item.ambientes,
      },
    });

    return { inserted: true, entity: mapCatalogItem(entity) };
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { inserted: false, entity: null };
    }

    throw error;
  }
}

async function update(image, item) {
  const entity = await prisma.catalogItem.update({
    where: { image },
    data: {
      name: item.nome,
      type: item.tipo,
      material: item.material,
      ambientes: item.ambientes,
    },
  });

  return mapCatalogItem(entity);
}

async function remove(image) {
  await prisma.catalogItem.delete({ where: { image } });
  return true;
}

async function findByImage(image) {
  const entity = await prisma.catalogItem.findUnique({ where: { image } });
  return mapCatalogItem(entity);
}

async function listAll() {
  const entities = await prisma.catalogItem.findMany({
    orderBy: { createdAt: "desc" },
  });

  return entities.map(mapCatalogItem);
}

module.exports = {
  create,
  update,
  remove,
  findByImage,
  listAll,
};
