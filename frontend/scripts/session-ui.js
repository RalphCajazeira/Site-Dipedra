(function (window, document) {
  const SESSION_EVENT = "app:session-changed";

  function normalizeUserName(user) {
    if (!user || typeof user !== "object") {
      return "";
    }

    const name =
      user.name ||
      user.nome ||
      user.fullName ||
      user.username ||
      user.email ||
      "";

    return name ? String(name).trim() : "";
  }

  function isLocalMode(config) {
    const value = (config?.catalogSource || "auto").toString().trim().toLowerCase();
    return ["local", "static", "json", "offline"].includes(value);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const api = window.AppAPI;
    if (!api) {
      console.error("AppAPI não foi encontrado para inicializar a UI de sessão.");
      return;
    }

    const loginLink = document.querySelector(".login-link");
    const sessionContainer = document.querySelector(".user-session");
    const greeting = document.querySelector(".user-session__greeting");
    const logoutButton = document.querySelector(".user-session__logout");

    if (!sessionContainer || !greeting || !logoutButton) {
      return;
    }

    function updateUi(user) {
      const hasUser = Boolean(user);
      const name = normalizeUserName(user);

      if (loginLink) {
        loginLink.hidden = hasUser;
      }

      sessionContainer.hidden = !hasUser;
      greeting.textContent = hasUser ? `Olá, ${name || "usuário"}` : "";
    }

    logoutButton.addEventListener("click", (event) => {
      event.preventDefault();
      if (typeof api.logout === "function") {
        api.logout();
      }
    });

    window.addEventListener(SESSION_EVENT, (event) => {
      const user = event.detail?.session?.user || null;
      updateUi(user);
    });

    const session = typeof api.getSession === "function" ? api.getSession() : null;
    updateUi(session?.user || null);

    const config = typeof api.getConfig === "function" ? api.getConfig() : {};
    if (!isLocalMode(config) && session?.token && typeof api.fetchProfile === "function") {
      api.fetchProfile().catch(() => {
        /* silenciosamente ignora erros para não afetar a UI */
      });
    }
  });
})(window, document);
