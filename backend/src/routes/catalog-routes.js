require("../config/register-alias");
const { Router } = require("express");
const { CatalogController } = require("@/controllers/catalog-controller");
const { uploadCatalogImages } = require("@/middlewares/upload");

const catalogRoutes = Router();
const catalogController = new CatalogController();

catalogRoutes.get("/", catalogController.index.bind(catalogController));
catalogRoutes.post(
  "/",
  uploadCatalogImages.array("images", 10),
  catalogController.create.bind(catalogController)
);
catalogRoutes.put(
  "/:image",
  catalogController.update.bind(catalogController)
);
catalogRoutes.delete(
  "/:image",
  catalogController.delete.bind(catalogController)
);

module.exports = { catalogRoutes };
