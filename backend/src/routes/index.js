require("../config/register-alias");
const { Router } = require("express");
const { catalogRoutes } = require("@/routes/catalog-routes");
const { authRoutes } = require("@/routes/auth-routes");

const routes = Router();

routes.use("/catalog", catalogRoutes);
routes.use("/auth", authRoutes);

module.exports = { routes };
