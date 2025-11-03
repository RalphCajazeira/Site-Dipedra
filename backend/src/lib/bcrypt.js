require("../config/register-alias");
const { randomBytes, scrypt, timingSafeEqual } = require("node:crypto");
const { promisify } = require("node:util");

const scryptAsync = promisify(scrypt);
const SALT_LENGTH = 16;
const KEY_LENGTH = 32;
const COST = 16384;
const BLOCK_SIZE = 8;
const PARALLELIZATION = 1;
const PREFIX = "scrypt$";

function encode(hashBuffer) {
  return hashBuffer.toString("base64");
}

function decode(hash) {
  return Buffer.from(hash, "base64");
}

function parseHash(storedHash) {
  if (typeof storedHash !== "string" || !storedHash.startsWith(PREFIX)) {
    throw new Error("Unsupported hash format");
  }

  const [, params, saltB64, keyB64] = storedHash.split("$");

  const [costRaw, blockSizeRaw, parallelizationRaw, keyLengthRaw] = params.split(":");

  const salt = decode(saltB64);
  const key = decode(keyB64);

  const cost = Number(costRaw) || COST;
  const blockSize = Number(blockSizeRaw) || BLOCK_SIZE;
  const parallelization = Number(parallelizationRaw) || PARALLELIZATION;
  const parsedKeyLength = Number(keyLengthRaw);
  const keyLength = Number.isFinite(parsedKeyLength) && parsedKeyLength > 0
    ? parsedKeyLength
    : key.length;

  return {
    cost,
    blockSize,
    parallelization,
    keyLength,
    salt,
    key,
  };
}

async function hash(password) {
  if (typeof password !== "string" || password.length === 0) {
    throw new Error("Password must be a non-empty string");
  }

  const salt = randomBytes(SALT_LENGTH);
  const derivedKey = await scryptAsync(password, salt, KEY_LENGTH, {
    N: COST,
    r: BLOCK_SIZE,
    p: PARALLELIZATION,
  });

  const params = [COST, BLOCK_SIZE, PARALLELIZATION, KEY_LENGTH].join(":");
  const result = [
    PREFIX,
    params,
    encode(salt),
    encode(Buffer.from(derivedKey)),
  ].join("$");

  return result;
}

async function compare(password, storedHash) {
  if (typeof storedHash !== "string" || storedHash.length === 0) {
    return false;
  }

  let parsed;
  try {
    parsed = parseHash(storedHash);
  } catch (error) {
    return false;
  }

  const derivedKey = await scryptAsync(password, parsed.salt, parsed.keyLength, {
    N: parsed.cost,
    r: parsed.blockSize,
    p: parsed.parallelization,
  });

  if (derivedKey.length !== parsed.key.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(derivedKey), parsed.key);
}

module.exports = {
  hash,
  compare,
};
