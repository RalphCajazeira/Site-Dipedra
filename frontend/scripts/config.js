(function (window, document) {
  const CONFIG_EVENT = "app:config-loaded";

  const scriptUrl = (() => {
    try {
      const current = document.currentScript;
      if (current?.src) {
        return new URL(current.src, window.location.href);
      }

      const candidates = document.querySelectorAll("script[src]");
      for (const candidate of candidates) {
        if (candidate.src && candidate.src.includes("config.js")) {
          return new URL(candidate.src, window.location.href);
        }
      }
    } catch (_error) {
      /* noop */
    }

    return null;
  })();

  const frontendBaseUrl = scriptUrl ? new URL("../", scriptUrl) : null;

  function ensureTrailingSlash(value) {
    if (!value || typeof value !== "string") {
      return value;
    }

    if (value.endsWith("/") || value.includes("?")) {
      return value;
    }

    return `${value}/`;
  }

  function resolveRelative(value, options = {}) {
    const { trailingSlash = false } = options;

    if (!value || typeof value !== "string") {
      return value;
    }

    if (/^(?:[a-z]+:)?\/\//i.test(value) || value.startsWith("/")) {
      return trailingSlash ? ensureTrailingSlash(value) : value;
    }

    if (!frontendBaseUrl) {
      return trailingSlash ? ensureTrailingSlash(value) : value;
    }

    try {
      const resolved = new URL(value, frontendBaseUrl).href;
      return trailingSlash ? ensureTrailingSlash(resolved) : resolved;
    } catch (_error) {
      return trailingSlash ? ensureTrailingSlash(value) : value;
    }
  }

  function parseEnv(text) {
    if (!text || typeof text !== "string") {
      return {};
    }

    const result = {};
    const lines = text.replace(/\ufeff/g, "").split(/\r?\n/);

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) {
        continue;
      }

      const [rawKey, ...rest] = line.split("=");
      if (!rawKey) {
        continue;
      }

      const key = rawKey.trim();
      const rawValue = rest.join("=").trim();
      const value = rawValue.replace(/^['"]|['"]$/g, "");
      result[key] = value;
    }

    return result;
  }

  const defaults = {
    catalogSource: "auto",
    apiBaseUrl: "",
    fallbackCatalogUrl: resolveRelative("assets/catalogo.json"),
    imageBaseUrl: resolveRelative("assets/images/catalogo/", { trailingSlash: true }),
    placeholderImageUrl: resolveRelative("assets/images/placeholder.jpg"),
  };

  function buildConfig(values = {}) {
    const config = { ...defaults };

    if (typeof values.CATALOG_SOURCE === "string" && values.CATALOG_SOURCE.trim()) {
      config.catalogSource = values.CATALOG_SOURCE.trim();
    }

    if (typeof values.API_BASE_URL === "string") {
      config.apiBaseUrl = values.API_BASE_URL.trim();
    }

    if (
      typeof values.FALLBACK_CATALOG_URL === "string" &&
      values.FALLBACK_CATALOG_URL.trim()
    ) {
      config.fallbackCatalogUrl = resolveRelative(values.FALLBACK_CATALOG_URL.trim());
    }

    if (typeof values.IMAGE_BASE_URL === "string" && values.IMAGE_BASE_URL.trim()) {
      config.imageBaseUrl = resolveRelative(values.IMAGE_BASE_URL.trim(), {
        trailingSlash: true,
      });
    }

    if (
      typeof values.PLACEHOLDER_IMAGE_URL === "string" &&
      values.PLACEHOLDER_IMAGE_URL.trim()
    ) {
      config.placeholderImageUrl = resolveRelative(values.PLACEHOLDER_IMAGE_URL.trim());
    }

    return config;
  }

  function setConfig(config) {
    window.APP_CONFIG = config;
    window.dispatchEvent(new CustomEvent(CONFIG_EVENT, { detail: { config } }));
  }

  async function loadEnvConfig() {
    if (typeof fetch !== "function") {
      return null;
    }

    const candidates = [];

    if (scriptUrl) {
      candidates.push(new URL("../.env", scriptUrl));
      candidates.push(new URL("../../.env", scriptUrl));
    }

    if (window.location && window.location.href && window.location.href !== "null") {
      try {
        candidates.push(new URL(".env", window.location.href));
      } catch (_error) {
        /* noop */
      }
    }

    const uniqueCandidates = [];
    for (const candidate of candidates) {
      const href = candidate.href || candidate.toString();
      if (!uniqueCandidates.includes(href)) {
        uniqueCandidates.push(href);
      }
    }

    for (const href of uniqueCandidates) {
      try {
        const response = await fetch(href, { cache: "no-store" });
        if (response.ok) {
          return response.text();
        }
      } catch (_error) {
        /* tenta próximo candidato */
      }
    }

    return null;
  }

  const initialConfig = buildConfig();
  setConfig(initialConfig);

  loadEnvConfig()
    .then((envText) => {
      if (!envText) {
        return;
      }

      const envValues = parseEnv(envText);
      const config = buildConfig(envValues);
      setConfig(config);
    })
    .catch(() => {
      /* mantém configuração padrão em caso de erro */
    });
})(window, document);
