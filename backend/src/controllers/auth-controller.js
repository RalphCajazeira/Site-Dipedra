require("../config/register-alias");
const { parseLoginPayload } = require("@/dtos/auth-dto");
const { authenticate, getProfile } = require("@/services/auth-service");

class AuthController {
  async login(req, res, next) {
    try {
      const payload = parseLoginPayload(req.body);
      const result = await authenticate(payload);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async me(req, res, next) {
    try {
      const profile = await getProfile(req.user.id);
      return res.status(200).json({ user: profile });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  AuthController,
};
