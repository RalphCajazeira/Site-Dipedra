(function (window) {
  const STORAGE_KEY = "dipedra.session";

  function resolveBaseUrl() {
    const configured = window.APP_CONFIG?.apiBaseUrl;
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

  const API_BASE_URL = resolveBaseUrl();

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

  function isNetworkError(error) {
    if (!error) {
      return false;
    }

    return (
      error.name === "TypeError" ||
      error.message === "Failed to fetch" ||
      /NetworkError/i.test(error.message || "")
    );
  }

  function resolveFallbackCatalogUrl() {
    if (typeof window === "undefined" || !window.location) {
      return "../assets/catalogo.json";
    }

    try {
      return new URL("../assets/catalogo.json", window.location.href).href;
    } catch (_error) {
      return "../assets/catalogo.json";
    }
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

    return {
      image: item.image || item.imagem || "",
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
    try {
      const payload = await request("/catalog", { method: "GET" });
      return payload?.items ?? [];
    } catch (error) {
      if (!isNetworkError(error)) {
        throw error;
      }

      console.warn(
        "Não foi possível comunicar com a API do catálogo. Utilizando dados locais.",
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

  window.AppAPI = {
    API_BASE_URL,
    getSession,
    fetchProfile,
    login,
    logout,
    fetchCatalog,
    createCatalogItems,
    updateCatalogItem,
    deleteCatalogItem,
  };
})(window);
