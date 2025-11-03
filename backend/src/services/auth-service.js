require("../config/register-alias");
const { HttpError } = require("@/errors/http-error");
const { env } = require("@/config/env");
const { sign } = require("@/lib/jwt");
const bcrypt = require("@/lib/bcrypt");
const userRepository = require("@/repositories/user-repository");

function toPublicUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    role: user.role,
  };
}

async function authenticate({ username, password }) {
  const user = await userRepository.findByUsername(username);

  if (!user) {
    throw new HttpError(401, "Credenciais inválidas.");
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    throw new HttpError(401, "Credenciais inválidas.");
  }

  const token = sign(
    {
      sub: String(user.id),
      role: user.role,
      username: user.username,
    },
    env.auth.jwtSecret,
    {
      expiresIn: env.auth.jwtExpiresIn,
    }
  );

  return {
    token,
    user: toPublicUser(user),
  };
}

async function getProfile(userId) {
  const user = await userRepository.findById(Number(userId));
  if (!user) {
    throw new HttpError(401, "Usuário não encontrado.");
  }

  return toPublicUser(user);
}

module.exports = {
  authenticate,
  getProfile,
};
