require("../config/register-alias");
const path = require("path");
const repository = require("@/repositories/catalog-repository");
const {
  parseCreateCatalogItemsPayload,
  parseUpdateCatalogItemPayload,
} = require("@/dtos/catalog-dto");
const { HttpError } = require("@/errors/http-error");
const { env } = require("@/config/env");
const { deleteFileIfExists } = require("@/utils/file-system");

async function createCatalogItems(payload) {
  const { files, body } = payload;

  if (!files || files.length === 0) {
    throw new HttpError(400, "Envie ao menos uma imagem para o catálogo.");
  }

  const parsed = parseCreateCatalogItemsPayload(body);

  const createdImages = [];
  const skippedImages = [];

  for (const file of files) {
    const result = await repository.create({
      image: file.filename,
      ...parsed,
    });

    if (result.inserted) {
      createdImages.push(file.filename);
    } else {
      skippedImages.push(file.filename);
    }
  }

  return {
    created: createdImages,
    skipped: skippedImages,
  };
}

async function updateCatalogItem(image, body) {
  const existing = await repository.findByImage(image);

  if (!existing) {
    throw new HttpError(404, "Item não encontrado.");
  }

  const parsed = parseUpdateCatalogItemPayload(body, existing);
  const updated = await repository.update(image, parsed);

  if (!updated) {
    throw new HttpError(500, "Não foi possível atualizar o item informado.");
  }

  return updated;
}

async function deleteCatalogItem(image) {
  const existing = await repository.findByImage(image);

  if (!existing) {
    throw new HttpError(404, "Item não encontrado.");
  }

  await repository.remove(image);

  const imagePath = path.join(env.upload.catalogDir, image);
  deleteFileIfExists(imagePath);

  return { image };
}

async function listCatalogItems() {
  return repository.listAll();
}

module.exports = {
  createCatalogItems,
  updateCatalogItem,
  deleteCatalogItem,
  listCatalogItems,
};
