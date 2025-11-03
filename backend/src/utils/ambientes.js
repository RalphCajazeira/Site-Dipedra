function sanitizeList(values) {
  return values
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
    .map((value) => value.replace(/\s+/g, " "));
}

function normalizeAmbientes(input) {
  if (!input) {
    return [];
  }

  if (Array.isArray(input)) {
    return sanitizeList(input);
  }

  if (typeof input === "string") {
    return sanitizeList(input.split(","));
  }

  return [];
}

module.exports = { normalizeAmbientes };
