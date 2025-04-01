// Requer que config.js esteja incluído antes

async function carregarRelatorio() {
  try {
    const res = await fetch(`${API_BASE}/db`);
    const db = await res.json();

    const pastaTree = {};

    for (const caminhoCompleto in db.arquivos) {
      const meta = db.arquivos[caminhoCompleto];
      const partes = caminhoCompleto.split("/");
      const baseIndex = partes.indexOf("blocos");
      if (baseIndex === -1) continue;

      const pasta = partes.slice(baseIndex + 1, -1).join("/");

      const comp = parseFloat((meta.comprimento || "0").replace(",", "."));
      const larg = parseFloat((meta.largura || "0").replace(",", "."));
      const area = isNaN(comp) || isNaN(larg) ? 0 : comp * larg;

      if (!pastaTree[pasta]) {
        pastaTree[pasta] = { total: 0, imagens: 0, subpastas: {} };
      }

      pastaTree[pasta].total += area;
      pastaTree[pasta].imagens += 1;
    }

    // Montar árvore
    const estrutura = {};
    for (const pasta of Object.keys(pastaTree)) {
      const partes = pasta.split("/");
      let atual = estrutura;
      for (let i = 0; i < partes.length; i++) {
        const parte = partes[i];
        const caminho = partes.slice(0, i + 1).join("/");
        if (!atual[parte]) {
          atual[parte] = { caminho, total: 0, imagens: 0, subpastas: {} };
        }
        if (i === partes.length - 1) {
          atual[parte].total = pastaTree[pasta].total;
          atual[parte].imagens = pastaTree[pasta].imagens;
        }
        atual = atual[parte].subpastas;
      }
    }

    // Renderizar
    const container = document.getElementById("relatorio-container");
    container.innerHTML = "";

    function renderCard(obj, pai) {
      const nomesOrdenados = Object.keys(obj).sort((a, b) =>
        a.localeCompare(b)
      );
      for (const nome of nomesOrdenados) {
        const pasta = obj[nome];
        const div = document.createElement("div");
        div.className = "item";
        div.innerHTML = `
          <strong>${pasta.caminho}</strong>
          <div>📐 Área total: <b>${pasta.total.toFixed(2)} m²</b></div>
          <div>🖼️ Chapas: <b>${pasta.imagens}</b></div>
        `;
        div.onclick = () => {
          const path = "/assets/blocos/" + pasta.caminho;
          window.location.href =
            "/pages/blocos.html?path=" + encodeURIComponent(path);
        };

        if (pai) {
          pai.appendChild(div);
        } else {
          container.appendChild(div);
        }

        if (Object.keys(pasta.subpastas).length) {
          const subDiv = document.createElement("div");
          subDiv.style.paddingLeft = "1.5rem";
          subDiv.style.borderLeft = "2px solid #ddd";
          subDiv.style.marginTop = "0.5rem";
          renderCard(pasta.subpastas, subDiv);
          div.appendChild(subDiv);
        }
      }
    }

    renderCard(estrutura);
  } catch (error) {
    console.error("Erro ao carregar relatório:", error);
    document.getElementById("relatorio-container").textContent =
      "Erro ao carregar relatório.";
  }
}

function voltarParaBlocos() {
  window.location.href = "/pages/blocos.html";
}

carregarRelatorio();
