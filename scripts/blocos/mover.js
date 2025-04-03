// mover.js

async function carregarPastasDisponiveis(pastaAtual = "/assets/blocos") {
  const lista = document.getElementById("modal-mover-lista");
  lista.innerHTML = "";

  try {
    const res = await fetch(`/blocos/db`);
    const db = await res.json();

    for (const path in db) {
      // Só mostra pastas diferentes da atual e visíveis
      if (path !== pastaAtual && db[path]?.folders !== undefined) {
        const item = document.createElement("div");
        item.className = "destino-item";
        item.textContent = path.replace("/assets/blocos", "") || "/";
        item.dataset.path = path;
        item.onclick = () => {
          document.getElementById("modal-mover-destino").value = path;
        };
        lista.appendChild(item);
      }
    }
  } catch (err) {
    console.error("Erro ao carregar pastas disponíveis:", err);
  }
}

function abrirModalMover(tipo, nome) {
  document.getElementById("modal-mover").classList.remove("hidden");
  document.getElementById("modal-mover-tipo").value = tipo;
  document.getElementById("modal-mover-nome").value = nome;
  document.getElementById("modal-mover-destino").value = "";

  carregarPastasDisponiveis(currentPath);
}

function fecharModalMover() {
  document.getElementById("modal-mover").classList.add("hidden");
}

async function moverItemConfirmado() {
  const tipo = document.getElementById("modal-mover-tipo").value;
  const nome = document.getElementById("modal-mover-nome").value;
  const destino = document.getElementById("modal-mover-destino").value;

  if (!destino || destino === currentPath) {
    alert("Escolha uma pasta de destino diferente.");
    return;
  }

  await fetch("/blocos/mover", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tipo,
      origem: `${currentPath}/${nome}`,
      destino,
    }),
  });

  fecharModalMover();
  loadFolder();
}

// Vincular eventos (no onload ou onde preferir)
document.getElementById("modal-mover-cancelar-btn").onclick = fecharModalMover;
document.getElementById("modal-mover-confirmar-btn").onclick =
  moverItemConfirmado;
