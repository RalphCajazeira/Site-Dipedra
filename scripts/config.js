// scripts/config.js

// Se estiver rodando local, a URL seria:
const LOCAL_API = "http://localhost:3000/blocos";

// Em produção, a URL seria seu app no Railway:
const PROD_API = "https://SEU-APP-RAILWAY-URL/blocos";

let API_BASE = LOCAL_API; // ou "/blocos" se rodar no mesmo host

// Se quiser checar se está rodando no GitHub Pages, você pode
// definir automaticamente:
if (window.location.hostname !== "localhost") {
  API_BASE = PROD_API;
}
