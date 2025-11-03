require("../config/register-alias");
const { HttpError } = require("@/errors/http-error");

function ensureNonEmpty(field, value) {
  if (typeof value !== "string") {
    throw new HttpError(400, `O campo ${field} é obrigatório.`);
  }

  const normalized = value.trim();
  if (!normalized) {
    throw new HttpError(400, `O campo ${field} é obrigatório.`);
  }

  return normalized;
}

function parseLoginPayload(body = {}) {
  const username = ensureNonEmpty("username", body.username ?? body.login);
  const password = ensureNonEmpty("password", body.password ?? body.senha);

  return { username, password };
}

module.exports = {
  parseLoginPayload,
};
