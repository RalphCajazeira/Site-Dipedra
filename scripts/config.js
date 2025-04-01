// Define a base da API dependendo se está rodando local ou online
const API_BASE =
  location.hostname === "localhost"
    ? "http://localhost:3000/api/blocos"
    : "https://site-dipedra-production.up.railway.app/api/blocos";

// Define o domínio base do site (sem /api/blocos)
const SITE_BASE = API_BASE.replace(/\/api\/blocos$/, "");
