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

function serializeAmbientes(values) {
  const list = normalizeAmbientes(values);
  return JSON.stringify(list);
}

function parseStoredAmbientes(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (error) {
    // Ignore JSON parse errors and fallback to normalization below.
  }

  return normalizeAmbientes(value);
}

module.exports = {
  normalizeAmbientes,
  serializeAmbientes,
  parseStoredAmbientes,
};
