const API_BASE =
  location.hostname === "localhost"
    ? "http://localhost:3000/api/blocos"
    : "https://site-dipedra-production.up.railway.app/api/blocos";

const SITE_BASE = API_BASE.replace(/\/api\/blocos$/, "");
