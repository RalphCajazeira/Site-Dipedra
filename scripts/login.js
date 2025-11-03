document.addEventListener("DOMContentLoaded", () => {
  const api = window.AppAPI;
  const form = document.getElementById("login-form");
  const feedback = document.getElementById("login-feedback");
  if (!api || !form) {
    return;
  }

  const session = api.getSession?.();
  if (session?.user) {
    window.location.href = "catalogo.html";
    return;
  }

  function setFeedback(message, isError = false) {
    if (!feedback) return;
    feedback.textContent = message;
    feedback.style.color = isError ? "#c1272d" : "#0a7b25";
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector("button[type='submit']");
    const username = form.username.value.trim();
    const password = form.password.value.trim();

    if (!username || !password) {
      setFeedback("Informe usuário e senha.", true);
      return;
    }

    submitButton.disabled = true;
    setFeedback("Entrando...");

    try {
      await api.login(username, password);
      setFeedback("Login realizado com sucesso.");
      window.location.href = "catalogo.html";
    } catch (error) {
      console.error(error);
      setFeedback(error.message || "Não foi possível autenticar.", true);
      submitButton.disabled = false;
    }
  });
});
