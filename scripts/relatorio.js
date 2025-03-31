const API_BASE =
  location.hostname === "localhost"
    ? "http://localhost:3000/api/blocos"
    : "/api/blocos";

// Caminho base do site (sem /api/blocos)
const SITE_BASE = API_BASE.replace(/\/api\/blocos$/, "");

async function carregarRelatorio() {
  const res = await fetch(`${SITE_BASE}/blocosDB.json`);
  const db = await res.json();

  const dadosPorPasta = {};

  for (const [caminho, meta] of Object.entries(db.arquivos)) {
    const partes = caminho.split("/");
    const baseIndex = partes.indexOf("blocos");
    if (baseIndex === -1) continue;

    const subcaminho = partes.slice(baseIndex + 1, -1).join("/");
    for (let i = 1; i <= subcaminho.split("/").length; i++) {
      const chave = subcaminho.split("/").slice(0, i).join("/");
      if (!dadosPorPasta[chave]) {
        dadosPorPasta[chave] = { total: 0, imagens: 0 };
      }

      const comp = parseFloat((meta.comprimento || "0").replace(",", "."));
      const larg = parseFloat((meta.largura || "0").replace(",", "."));
      const area = isNaN(comp) || isNaN(larg) ? 0 : comp * larg;

      dadosPorPasta[chave].total += area;

      // Conta a imagem apenas na pasta exata onde ela está
      if (i === subcaminho.split("/").length) {
        dadosPorPasta[chave].imagens += 1;
      }
    }
  }

  const container = document.getElementById("relatorio-container");
  container.innerHTML = "";

  Object.entries(dadosPorPasta).forEach(([pasta, dados]) => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <strong>${pasta}</strong>
      <div>📐 Área total: <b>${dados.total.toFixed(2)} m²</b></div>
      <div>🖼️ Imagens: <b>${dados.imagens}</b></div>
    `;
    div.onclick = () => {
      const path = "/assets/blocos/" + pasta;
      window.location.href =
        "/pages/blocos.html?path=" + encodeURIComponent(path);
    };
    container.appendChild(div);
  });
}

function voltarParaBlocos() {
  window.location.href = "/pages/blocos.html";
}

carregarRelatorio();
