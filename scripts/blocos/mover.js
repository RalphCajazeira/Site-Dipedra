// Requer config.js importado antes

let moverTipo = null;
let moverNome = null;
let moverDestinoAtual = "/assets/blocos";
let todasPastasDisponiveis = [];

async function carregarPastasDisponiveis() {
  try {
    const res = await fetch(`${API_BASE}/db`);
    const db = await res.json();
    todasPastasDisponiveis = db.pastas || [];
  } catch (error) {
    console.error("Erro ao carregar pastas disponíveis:", error);
  }
}

function abrirModalMover(tipo, nome) {
  moverTipo = tipo;
  moverNome = nome;
  moverDestinoAtual = "/assets/blocos";
  document.getElementById("modal-mover").classList.remove("hidden");
  carregarPastasDisponiveis().then(renderizarPastasMover);
}

function fecharModalMover() {
  moverTipo = null;
  moverNome = null;
  moverDestinoAtual = "/assets/blocos";
  document.getElementById("modal-mover").classList.add("hidden");
}

function renderizarPastasMover() {
  const container = document.getElementById("mover-pastas");
  container.innerHTML = "";

  const caminhoSpan = document.getElementById("mover-caminho");
  caminhoSpan.textContent =
    moverDestinoAtual.replace("/assets/blocos", "") || "/";

  const subpastas = todasPastasDisponiveis
    .filter((p) => {
      return (
        p.startsWith(moverDestinoAtual) &&
        p !== moverDestinoAtual &&
        p.replace(moverDestinoAtual + "/", "").indexOf("/") === -1
      );
    })
    .sort();

  for (const pasta of subpastas) {
    const div = document.createElement("div");
    div.className = "item mover-item";
    div.textContent = pasta.replace(moverDestinoAtual + "/", "");
    div.onclick = () => {
      moverDestinoAtual = pasta;
      renderizarPastasMover();
    };
    container.appendChild(div);
  }
}

async function confirmarMover() {
  if (!moverTipo || !moverNome || !moverDestinoAtual) return;

  try {
    await fetch(`${API_BASE}/mover`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tipo: moverTipo,
        origem: currentPath + "/" + moverNome,
        destino: moverDestinoAtual,
      }),
    });
    fecharModalMover();
    loadFolder();
  } catch (error) {
    alert("Erro ao mover item: " + error.message);
    console.error("Erro ao mover:", error);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  carregarPastasDisponiveis();
});
