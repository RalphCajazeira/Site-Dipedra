let currentPath = "/assets/blocos";
let modoGrid = true;
let editandoArquivo = null;
let arquivosGlobais = {};
let metadadosGlobais = {};
let fotosCapturadas = [];

const API_BASE = "https://dipedraapi.loca.lt";

async function loadFolder(path = currentPath) {
  const res = await fetch(`/api/blocos?path=${encodeURIComponent(path)}`);
  const data = await res.json();

  const container = document.getElementById("blocos-container");
  container.innerHTML = "";

  // Aplica classe correta
  container.classList.remove("grid-view", "lista-view");
  container.classList.add(modoGrid ? "grid-view" : "lista-view");

  arquivosGlobais = data.files;
  metadadosGlobais = data.metadados || {};

  data.folders.forEach((folder) => {
    const div = document.createElement("div");
    div.className = "folder";

    div.onclick = () => {
      currentPath += `/${folder}`;
      loadFolder();
    };

    const nameSpan = document.createElement("span");
    nameSpan.textContent = folder;

    const renameBtn = document.createElement("button");
    renameBtn.textContent = "✏️";
    renameBtn.title = "Renomear pasta";
    renameBtn.onclick = async () => {
      const novoNome = prompt("Novo nome da pasta:", folder);
      if (!novoNome) return;
      await fetch(`${API_BASE}/api/blocos/rename`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: currentPath,
          oldName: folder,
          newName: novoNome,
        }),
      });
      loadFolder();
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.title = "Excluir pasta";
    deleteBtn.onclick = async () => {
      if (confirm(`Tem certeza que deseja excluir a pasta "${folder}"?`)) {
        await fetch(`${API_BASE}/api/blocos/delete`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: currentPath, name: folder }),
        });
        loadFolder();
      }
    };

    const buttonWrapper = document.createElement("div");
    buttonWrapper.className = "button-wrapper";
    buttonWrapper.append(renameBtn, deleteBtn);

    div.append(nameSpan, buttonWrapper);
    container.appendChild(div);
  });

  data.files.forEach((file) => {
    const div = document.createElement("div");
    div.className = "file";

    const nameSpan = document.createElement("span");
    nameSpan.textContent = file;

    if (/\.(jpg|jpeg|png|gif)$/i.test(file)) {
      const img = document.createElement("img");
      img.src = `${currentPath}/${file}`;
      div.prepend(img);
    }

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.title = "Editar dados";
    editBtn.onclick = () => abrirModalEdicao(file);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.title = "Excluir arquivo";
    deleteBtn.onclick = async () => {
      if (confirm(`Deseja excluir o arquivo "${file}"?`)) {
        await fetch(`${API_BASE}/api/blocos/delete`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: currentPath, name: file }),
        });
        loadFolder();
      }
    };

    const buttonWrapper = document.createElement("div");
    buttonWrapper.className = "button-wrapper";
    buttonWrapper.append(editBtn, deleteBtn);

    const description = document.createElement("div");
    description.className = "description";
    description.append(nameSpan, buttonWrapper);

    div.append(description);
    container.appendChild(div);
  });

  if (data.folders.length === 0 && data.files.length === 0) {
    const vazio = document.createElement("div");
    vazio.textContent = "📂 Pasta Vazia";
    vazio.style.opacity = "0.6";
    vazio.style.padding = "0.5rem";
    container.appendChild(vazio);
  }

  const caminhoAtual = document.getElementById("caminho-atual");
  if (caminhoAtual) {
    caminhoAtual.textContent = currentPath.replace("/assets/blocos", "") || "/";
  }
}

function abrirModalNovaImagem() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.capture = "environment";

  input.onchange = () => {
    const file = input.files[0];
    if (!file) return;

    fotosCapturadas.push(file);

    const continuar = confirm(
      "Deseja tirar outra foto?\n\nOK = Sim\nCancelar = Preencher dados"
    );
    if (continuar) {
      abrirModalNovaImagem();
    } else {
      mostrarModalComFotos();
    }
  };

  input.click();
}

function mostrarModalComFotos() {
  editandoArquivo = null;
  document.getElementById("modal-titulo").textContent = `Preencher dados (${
    fotosCapturadas.length
  } foto${fotosCapturadas.length > 1 ? "s" : ""})`;
  document.getElementById("modal-file").classList.add("hidden");
  document.getElementById("modal-nome").value = "";
  document.getElementById("modal-comprimento").value = "";
  document.getElementById("modal-largura").value = "";
  document.getElementById("modal-codeInterno").value = "";
  document.getElementById("modal-imagem").classList.remove("hidden");
}

function abrirModalEdicao(nomeArquivo) {
  const meta = metadadosGlobais[nomeArquivo];
  if (!meta) return alert("Dados da imagem não encontrados.");

  editandoArquivo = nomeArquivo;
  document.getElementById("modal-titulo").textContent = "Editar Imagem";
  document.getElementById("modal-file").classList.add("hidden");
  document.getElementById("modal-nome").value = meta.nome || "";
  document.getElementById("modal-comprimento").value = meta.comprimento || "";
  document.getElementById("modal-largura").value = meta.largura || "";
  document.getElementById("modal-codeInterno").value = meta.codeInterno || "";
  document.getElementById("modal-imagem").classList.remove("hidden");
}

function fecharModal() {
  document.getElementById("modal-imagem").classList.add("hidden");
  fotosCapturadas = [];
  editandoArquivo = null;
}

async function salvarModal() {
  const nome = document.getElementById("modal-nome").value;
  const comprimento = document.getElementById("modal-comprimento").value;
  const largura = document.getElementById("modal-largura").value;
  const codeInterno = document.getElementById("modal-codeInterno").value;

  if (!comprimento || !largura) {
    alert("Comprimento e Largura são obrigatórios");
    return;
  }

  if (editandoArquivo) {
    const meta = metadadosGlobais[editandoArquivo];
    if (!meta?.code) {
      alert("Código da imagem não encontrado.");
      return;
    }

    await fetch(`${API_BASE}/api/blocos/atualizar-metadata`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: meta.code,
        nome,
        comprimento,
        largura,
        codeInterno,
      }),
    });

    fecharModal();
    loadFolder();
    return;
  }

  if (!fotosCapturadas.length) {
    alert("Nenhuma imagem foi capturada.");
    return;
  }

  const formData = new FormData();
  for (let file of fotosCapturadas) {
    formData.append("images", file);
  }
  formData.append("nome", nome);
  formData.append("comprimento", comprimento);
  formData.append("largura", largura);
  formData.append("codeInterno", codeInterno);
  formData.append("path", currentPath);

  await fetch(`${API_BASE}/api/blocos/upload`, {
    method: "POST",
    body: formData,
  });

  fecharModal();
  loadFolder();
}

window.onload = () => {
  document.getElementById("nova-pasta-btn").onclick = createFolder;
  document.getElementById("nova-foto-btn").onclick = abrirModalNovaImagem;
  document.getElementById("voltar-inicio-btn").onclick = () => {
    currentPath = "/assets/blocos";
    loadFolder();
  };
  document.getElementById("modal-cancelar-btn").onclick = fecharModal;
  document.getElementById("modal-salvar-btn").onclick = salvarModal;
  document.getElementById("alternar-visualizacao-btn").onclick = () => {
    modoGrid = !modoGrid;
    document.getElementById("alternar-visualizacao-btn").textContent = modoGrid
      ? "🧱 Modo Grid"
      : "🗂️ Modo Lista";
    loadFolder();
  };
  loadFolder();
};

async function createFolder() {
  const folderName = prompt("Nome da nova pasta:");
  if (!folderName) return;
  await fetch(`${API_BASE}/api/blocos/folder`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: currentPath, name: folderName }),
  });
  loadFolder();
}
