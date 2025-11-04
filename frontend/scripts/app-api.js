(function (window, document) {
  const STORAGE_KEY = "dipedra.session";
  const CONFIG_EVENT = "app:config-loaded";

  const scriptUrl = (() => {
    try {
      const current = document.currentScript;
      if (current?.src) {
        return new URL(current.src, window.location.href);
      }

      const candidates = document.querySelectorAll("script[src]");
      for (const candidate of candidates) {
        if (candidate.src && candidate.src.includes("app-api.js")) {
          return new URL(candidate.src, window.location.href);
        }
      }
    } catch (_error) {
      /* noop */
    }

    return null;
  })();

  const frontendBaseUrl = scriptUrl ? new URL("../", scriptUrl) : null;

  function resolveRelativeUrl(path, fallback = "") {
    if (!path || typeof path !== "string") {
      return fallback;
    }

    if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith("/")) {
      return path;
    }

    if (!frontendBaseUrl) {
      return path;
    }

    try {
      return new URL(path, frontendBaseUrl).href;
    } catch (_error) {
      return fallback || path;
    }
  }

  function getConfig() {
    return window.APP_CONFIG || {};
  }

  function resolveBaseUrl() {
    const configured = getConfig().apiBaseUrl;
    if (configured && typeof configured === "string") {
      return configured.replace(/\/$/, "");
    }

    if (window.location && window.location.origin && window.location.origin !== "null") {
      const origin = window.location.origin.replace(/\/$/, "");
      const hostname = window.location.hostname;
      const port = window.location.port;

      const isLocalHost = ["localhost", "127.0.0.1", "[::1]"].includes(hostname);

      if (!isLocalHost) {
        return `${origin}/api`;
      }

      if (!port || port === "3000") {
        return `${origin}/api`;
      }
    }

    return "http://localhost:3000/api";
  }

  let API_BASE_URL = resolveBaseUrl();

  window.addEventListener(CONFIG_EVENT, () => {
    API_BASE_URL = resolveBaseUrl();
  });

  function getSession() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return null;
      }
      return JSON.parse(raw);
    } catch (error) {
      console.error("Não foi possível recuperar a sessão armazenada.", error);
      return null;
    }
  }

  function setSession(session) {
    if (!session) {
      clearSession();
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    window.dispatchEvent(
      new CustomEvent("app:session-changed", { detail: { session } })
    );
  }

  function clearSession() {
    window.localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("app:session-changed", { detail: { session: null } }));
  }

  function buildHeaders(inputHeaders = {}, body) {
    const headers = new Headers(inputHeaders);

    if (body && !(body instanceof FormData)) {
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
    }

    return headers;
  }

  async function request(path, options = {}, { requireAuth = false } = {}) {
    const session = getSession();
    const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
    const headers = buildHeaders(options.headers, options.body);

    const isFormData = options.body instanceof FormData;
    let body = options.body;

    if (body && !isFormData && typeof body === "object") {
      body = JSON.stringify(body);
    }

    if (session?.token) {
      headers.set("Authorization", `Bearer ${session.token}`);
    } else if (requireAuth) {
      throw new Error("Sessão expirada. Faça login novamente.");
    }

    const response = await fetch(url, {
      ...options,
      headers,
      body,
    });

    let data = null;
    const contentType = response.headers.get("Content-Type") || "";
    if (contentType.includes("application/json")) {
      data = await response.json().catch(() => null);
    }

    if (!response.ok) {
      if (response.status === 401) {
        clearSession();
      }
      const message = data?.message || "Erro ao comunicar com a API.";
      throw new Error(message);
    }

    return data;
  }

  async function login(username, password) {
    const payload = await request(
      "/auth/login",
      {
        method: "POST",
        body: { username, password },
      },
      { requireAuth: false }
    );

    if (payload?.token && payload?.user) {
      setSession({ token: payload.token, user: payload.user });
    }

    return payload;
  }

  async function fetchProfile() {
    const session = getSession();

    if (!shouldUseApi()) {
      return session || null;
    }

    if (!session?.token) {
      return null;
    }

    try {
      const payload = await request(
        "/auth/me",
        {
          method: "GET",
        },
        { requireAuth: true }
      );

      if (payload?.user) {
        const nextSession = { token: session.token, user: payload.user };
        setSession(nextSession);
        return nextSession;
      }
    } catch (error) {
      clearSession();
    }

    return null;
  }

  async function logout() {
    clearSession();
  }

  function resolveFallbackCatalogUrl() {
    const fallback = getConfig().fallbackCatalogUrl;
    if (fallback) {
      return fallback;
    }

    return resolveRelativeUrl("assets/catalogo.json");
  }

  function getCatalogMode() {
    const config = getConfig();
    const value = (config.catalogSource || "auto").toString().trim().toLowerCase();

    if (["local", "static", "json", "offline"].includes(value)) {
      return "local";
    }

    if (["api", "remote", "online", "api-only"].includes(value)) {
      return "api";
    }

    return "auto";
  }

  function shouldUseApi() {
    return getCatalogMode() !== "local";
  }

  function normalizeFallbackItem(item) {
    if (!item || typeof item !== "object") {
      return null;
    }

    const ambientes = Array.isArray(item.ambientes)
      ? item.ambientes
      : typeof item.ambientes === "string"
        ? item.ambientes
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean)
        : [];

    const image =
      typeof item.image === "string"
        ? item.image.trim()
        : typeof item.imagem === "string"
          ? item.imagem.trim()
          : "";

    return {
      image,
      nome: item.nome || "",
      tipo: item.tipo || "",
      material: item.material || "",
      ambientes,
    };
  }

  async function loadFallbackCatalog() {
    const url = resolveFallbackCatalogUrl();
    const response = await fetch(url, { cache: "no-cache" });

    if (!response.ok) {
      throw new Error("Não foi possível carregar o catálogo local.");
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      return [];
    }

    return data
      .map(normalizeFallbackItem)
      .filter((item) => item && item.image);
  }

  async function fetchCatalog() {
    const mode = getCatalogMode();

    if (mode === "local") {
      return loadFallbackCatalog();
    }

    try {
      const payload = await request("/catalog", { method: "GET" });
      return payload?.items ?? [];
    } catch (error) {
      if (mode === "api") {
        throw error;
      }

      console.warn(
        "Não foi possível utilizar a API do catálogo. Utilizando dados locais.",
        error
      );

      return loadFallbackCatalog();
    }
  }

  async function createCatalogItems(formData) {
    return request(
      "/catalog",
      {
        method: "POST",
        body: formData,
      },
      { requireAuth: true }
    );
  }

  async function updateCatalogItem(imageName, payload) {
    return request(
      `/catalog/${encodeURIComponent(imageName)}`,
      {
        method: "PUT",
        body: payload,
      },
      { requireAuth: true }
    );
  }

  async function deleteCatalogItem(imageName) {
    return request(
      `/catalog/${encodeURIComponent(imageName)}`,
      {
        method: "DELETE",
      },
      { requireAuth: true }
    );
  }

  function resolveImageUrl(imagePath) {
    if (!imagePath || typeof imagePath !== "string") {
      return "";
    }

    if (/^(?:[a-z]+:)?\/\//i.test(imagePath) || imagePath.startsWith("/")) {
      return imagePath;
    }

    const base = getConfig().imageBaseUrl;
    if (base && typeof base === "string") {
      const normalizedBase = base.endsWith("/") ? base : `${base}/`;
      const combined = `${normalizedBase}${imagePath.replace(/^\/+/, "")}`;
      return resolveRelativeUrl(combined, combined);
    }

    return resolveRelativeUrl(`assets/images/catalogo/${imagePath}`, imagePath);
  }

  function getPlaceholderImageUrl() {
    const placeholder = getConfig().placeholderImageUrl;
    if (placeholder) {
      return placeholder;
    }

    return resolveRelativeUrl("assets/images/placeholder.jpg");
  }

  const api = {
    get API_BASE_URL() {
      return API_BASE_URL;
    },
    get apiBaseUrl() {
      return API_BASE_URL;
    },
    getConfig,
    getSession,
    fetchProfile,
    login,
    logout,
    fetchCatalog,
    createCatalogItems,
    updateCatalogItem,
    deleteCatalogItem,
    resolveImageUrl,
    getPlaceholderImageUrl,
  };

  window.AppAPI = api;
})(window, document);
