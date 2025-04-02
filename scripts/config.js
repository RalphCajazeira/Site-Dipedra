// scripts/config.js

const LOCAL_API = "http://localhost:3000/blocos";
const PROD_API = "https://site-dipedra-production.up.railway.app/blocos";

let API_BASE = LOCAL_API;

if (window.location.hostname !== "localhost") {
  API_BASE = PROD_API;
}
