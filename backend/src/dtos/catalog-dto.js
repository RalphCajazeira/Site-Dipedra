require("../config/register-alias");
const { HttpError } = require("@/errors/http-error");
const { normalizeAmbientes } = require("@/utils/ambientes");

function ensureNonEmptyString(value, field) {
  if (typeof value !== "string" && typeof value !== "number") {
    throw new HttpError(400, `O campo ${field} é obrigatório.`);
  }

  const normalized = String(value).trim();

  if (!normalized) {
    throw new HttpError(400, `O campo ${field} é obrigatório.`);
  }

  return normalized;
}

function toNullableString(value) {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = String(value).trim();
  return normalized.length > 0 ? normalized : null;
}

function parseCreateCatalogItemsPayload(body = {}) {
  const nome = ensureNonEmptyString(body.nome, "nome");
  const tipo = toNullableString(body.tipo);
  const material = toNullableString(body.material);
  const ambientes = normalizeAmbientes(body.ambientes);

  return {
    nome,
    tipo,
    material,
    ambientes,
  };
}

function parseUpdateCatalogItemPayload(body = {}, currentItem) {
  if (!currentItem) {
    throw new HttpError(500, "Item atual não informado para atualização.");
  }

  const hasChanges =
    body.nome !== undefined ||
    body.tipo !== undefined ||
    body.material !== undefined ||
    body.ambientes !== undefined;

  if (!hasChanges) {
    throw new HttpError(400, "Informe ao menos um campo para atualizar.");
  }

  const nome =
    body.nome !== undefined
      ? ensureNonEmptyString(body.nome, "nome")
      : currentItem.nome;
  const tipo =
    body.tipo !== undefined ? toNullableString(body.tipo) : currentItem.tipo;
  const material =
    body.material !== undefined
      ? toNullableString(body.material)
      : currentItem.material;
  const ambientes =
    body.ambientes !== undefined
      ? normalizeAmbientes(body.ambientes)
      : currentItem.ambientes;

  return {
    nome,
    tipo,
    material,
    ambientes,
  };
}

module.exports = {
  parseCreateCatalogItemsPayload,
  parseUpdateCatalogItemPayload,
};
