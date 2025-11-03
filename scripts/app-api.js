(function (window) {
  const STORAGE_KEY = "dipedra.session";

  function resolveBaseUrl() {
    const configured = window.APP_CONFIG?.apiBaseUrl;
    if (configured && typeof configured === "string") {
      return configured.replace(/\/$/, "");
    }

    if (window.location.origin && window.location.origin !== "null") {
      return `${window.location.origin.replace(/\/$/, "")}/api`;
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

  async function fetchCatalog() {
    const payload = await request("/catalog", { method: "GET" });
    return payload?.items ?? [];
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
