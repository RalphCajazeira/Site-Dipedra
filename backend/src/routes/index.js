require("../config/register-alias");
const { Router } = require("express");
const { catalogRoutes } = require("@/routes/catalog-routes");

const routes = Router();

routes.use("/catalog", catalogRoutes);

module.exports = { routes };
