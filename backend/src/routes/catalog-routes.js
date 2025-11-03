require("../config/register-alias");
const { Router } = require("express");
const { CatalogController } = require("@/controllers/catalog-controller");
const { uploadCatalogImages } = require("@/middlewares/upload");
const { authenticate } = require("@/middlewares/authenticate");
const { authorize } = require("@/middlewares/authorize");

const catalogRoutes = Router();
const catalogController = new CatalogController();

catalogRoutes.get("/", catalogController.index.bind(catalogController));
catalogRoutes.post(
  "/",
  authenticate,
  authorize(["master", "user"]),
  uploadCatalogImages.array("images", 10),
  catalogController.create.bind(catalogController)
);
catalogRoutes.put(
  "/:image",
  authenticate,
  authorize(["master", "user"]),
  catalogController.update.bind(catalogController)
);
catalogRoutes.delete(
  "/:image",
  authenticate,
  authorize(["master"]),
  catalogController.delete.bind(catalogController)
);

module.exports = { catalogRoutes };
