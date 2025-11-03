require("../config/register-alias");
const { createHmac } = require("node:crypto");

function base64UrlEncode(value) {
  if (Buffer.isBuffer(value)) {
    return value.toString("base64url");
  }

  if (typeof value === "string") {
    return Buffer.from(value).toString("base64url");
  }

  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function base64UrlDecode(value) {
  return Buffer.from(value, "base64url").toString();
}

function parseDuration(value) {
  if (!value) {
    return null;
  }

  if (typeof value === "number") {
    return value;
  }

  if (typeof value !== "string") {
    return null;
  }

  const match = value.trim().match(/^(\d+)([smhd])$/i);
  if (!match) {
    return Number(value) || null;
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();

  const multiplier = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
  }[unit];

  return amount * multiplier;
}

function sign(payload, secret, options = {}) {
  if (!payload || typeof payload !== "object") {
    throw new Error("Payload must be an object");
  }

  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const now = Math.floor(Date.now() / 1000);
  const tokenPayload = { ...payload };

  if (options.expiresIn) {
    const expiresInSeconds = parseDuration(options.expiresIn);
    if (expiresInSeconds) {
      tokenPayload.exp = now + expiresInSeconds;
    }
  }

  if (options.notBefore) {
    const notBeforeSeconds = parseDuration(options.notBefore);
    if (notBeforeSeconds) {
      tokenPayload.nbf = now + notBeforeSeconds;
    }
  }

  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(tokenPayload);
  const signature = createHmac("sha256", secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64url");

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function verify(token, secret) {
  if (typeof token !== "string" || token.split(".").length !== 3) {
    throw new Error("Token malformado");
  }

  const [encodedHeader, encodedPayload, signature] = token.split(".");
  const expectedSignature = createHmac("sha256", secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64url");

  if (signature !== expectedSignature) {
    throw new Error("Assinatura inválida");
  }

  const payload = JSON.parse(base64UrlDecode(encodedPayload));
  const now = Math.floor(Date.now() / 1000);

  if (payload.exp && now >= payload.exp) {
    throw new Error("Token expirado");
  }

  if (payload.nbf && now < payload.nbf) {
    throw new Error("Token ainda não é válido");
  }

  return payload;
}

module.exports = {
  sign,
  verify,
};
