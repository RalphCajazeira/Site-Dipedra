require("../config/register-alias");
const { Router } = require("express");
const { AuthController } = require("@/controllers/auth-controller");
const { authenticate } = require("@/middlewares/authenticate");

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post("/login", authController.login.bind(authController));
authRoutes.get("/me", authenticate, authController.me.bind(authController));

module.exports = { authRoutes };
