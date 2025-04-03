const LOCAL_API = "http://localhost:3000/api/blocos";
const PROD_API = "https://site-dipedra-production.up.railway.app/api/blocos"; // ✅ atualizado

let API_BASE = LOCAL_API;

if (window.location.hostname !== "localhost") {
  API_BASE = PROD_API;
}
