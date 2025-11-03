require("../config/register-alias");
const {
  createCatalogItems,
  updateCatalogItem,
  deleteCatalogItem,
  listCatalogItems,
} = require("@/services/catalog-service");

class CatalogController {
  async index(_req, res, next) {
    try {
      const items = await listCatalogItems();
      return res.status(200).json({ items });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const result = await createCatalogItems({
        files: req.files,
        body: req.body,
      });

      return res.status(201).json({
        message: "Catálogo atualizado com sucesso.",
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const item = await updateCatalogItem(req.params.image, req.body);
      return res.status(200).json({
        message: "Item atualizado com sucesso.",
        item,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await deleteCatalogItem(req.params.image);
      return res.status(200).json({
        message: "Item removido com sucesso.",
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { CatalogController };
