require("../config/register-alias");
const { env } = require("@/config/env");
const { HttpError } = require("@/errors/http-error");
const { verify } = require("@/lib/jwt");
const userRepository = require("@/repositories/user-repository");

async function authenticate(req, _res, next) {
  try {
    const authorization = req.headers.authorization || "";
    const [, token] = authorization.split(" ");

    if (!token) {
      throw new HttpError(401, "Autenticação necessária.");
    }

    const payload = verify(token, env.auth.jwtSecret);
    const userId = Number(payload.sub);

    if (!userId) {
      throw new HttpError(401, "Token inválido.");
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new HttpError(401, "Usuário não encontrado.");
    }

    req.user = {
      id: user.id,
      username: user.username,
      role: user.role,
      token,
    };

    next();
  } catch (error) {
    if (error instanceof HttpError) {
      next(error);
      return;
    }

    next(new HttpError(401, error.message || "Token inválido."));
  }
}

module.exports = { authenticate };
