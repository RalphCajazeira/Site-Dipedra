function abrirModalMover(tipo, nome) {
  const destino = prompt("Para qual pasta deseja mover?");
  if (!destino) return;

  fetch(`${API_BASE}/mover`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tipo,
      origem: currentPath + "/" + nome,
      destino: destino.startsWith("/assets/blocos")
        ? destino
        : "/assets/blocos/" + destino,
    }),
  }).then(() => loadFolder());
}
