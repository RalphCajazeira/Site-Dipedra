const API_BASE =
  location.hostname === "localhost" || location.hostname.startsWith("192.")
    ? `${location.origin}/api/blocos`
    : "https://site-dipedra-production.up.railway.app/api/blocos";

const SITE_BASE = API_BASE.replace(/\/api\/blocos$/, "");
