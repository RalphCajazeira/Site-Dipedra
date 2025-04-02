// scripts/blocos/blocos.js

let currentPath = "/assets/blocos";
let modoGrid = true;
let editandoArquivo = null;
let arquivosGlobais = {};
let metadadosGlobais = {};
let fotosCapturadas = [];

/**
 * Carrega a pasta do backend
 */
async function loadFolder(path = currentPath) {
  // Faz requisição GET: /blocos?path=...
  const res = await fetch(`${API_BASE}?path=${encodeURIComponent(path)}`);
  const data = await res.json();

  // data deve ter { folders: [...], files: [...], metadados: {...} }
  // Se por acaso vier erro, data pode ser {error: "..."}.
  if (data.error) {
    console.error("Erro ao carregar pasta:", data.error);
    return;
  }

  const container = document.getElementById("blocos-container");
  container.innerHTML = "";
  container.classList.remove("grid-view", "lista-view");
  container.classList.add(modoGrid ? "grid-view" : "lista-view");

  // Se a controller retorna "data.files" ou "data.folders", OK
  const folders = data.folders || [];
  const files = data.files || [];
  metadadosGlobais = data.metadados || {};

  // Folders
  folders.forEach((folder) => {
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
    renameBtn.onclick = async (event) => {
      event.stopPropagation();
      const novoNome = prompt("Novo nome da pasta:", folder);
      if (!novoNome || novoNome === folder) return;

      await fetch(`${API_BASE}/rename`, {
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
    deleteBtn.onclick = async (event) => {
      event.stopPropagation();
      const caminhoCompleto = currentPath + "/" + folder;
      if (caminhoCompleto === "/assets/blocos") {
        alert("A pasta raiz não pode ser excluída.");
        return;
      }

      if (confirm(`Tem certeza que deseja excluir a pasta "${folder}"?`)) {
        await fetch(`${API_BASE}/delete`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: currentPath, name: folder }),
        });
        loadFolder();
      }
    };

    const moverBtn = document.createElement("button");
    moverBtn.textContent = "📁";
    moverBtn.title = "Mover pasta";
    moverBtn.onclick = (e) => {
      e.stopPropagation();
      abrirModalMover("pasta", folder);
    };

    const btnWrap = document.createElement("div");
    btnWrap.className = "button-wrapper";
    btnWrap.append(renameBtn, deleteBtn, moverBtn);

    div.append(nameSpan, btnWrap);
    container.appendChild(div);
  });

  // Files
  files.forEach((file) => {
    const div = document.createElement("div");
    div.className = "file";

    const nameSpan = document.createElement("span");
    nameSpan.textContent = file;

    if (/\.(jpg|jpeg|png|gif)$/i.test(file)) {
      const img = document.createElement("img");
      const meta = metadadosGlobais[file];
      img.src = meta?.url || `${currentPath}/${file}`;
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
        await fetch(`${API_BASE}/delete`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: currentPath, name: file }),
        });
        loadFolder();
      }
    };

    const moverBtn = document.createElement("button");
    moverBtn.textContent = "📁";
    moverBtn.title = "Mover arquivo";
    moverBtn.onclick = () => abrirModalMover("arquivo", file);

    const btnWrap = document.createElement("div");
    btnWrap.className = "button-wrapper";
    btnWrap.append(editBtn, deleteBtn, moverBtn);

    const desc = document.createElement("div");
    desc.className = "description";
    desc.append(nameSpan, btnWrap);

    div.append(desc);
    container.appendChild(div);
  });

  if (folders.length === 0 && files.length === 0) {
    const vazio = document.createElement("div");
    vazio.textContent = "📂 Pasta Vazia";
    vazio.style.opacity = "0.6";
    vazio.style.padding = "0.5rem";
    container.appendChild(vazio);
  }

  const caminhoAtual = document.getElementById("caminho-atual");
  if (caminhoAtual) {
    const displayPath = currentPath.replace("/assets/blocos", "") || "/";
    caminhoAtual.textContent = displayPath;
  }
}

async function createFolder() {
  const name = prompt("Nome da nova pasta:");
  if (!name) return;
  await fetch(`${API_BASE}/folder`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: currentPath, name }),
  });
  loadFolder();
}

// Abaixo, modal e funções de edição, etc. (do seu código original)

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
      "Deseja tirar outra foto?\nOK = Sim\nCancelar = Preencher dados"
    );
    if (continuar) abrirModalNovaImagem();
    else mostrarModalComFotos();
  };

  input.click();
}

function mostrarModalComFotos() {
  editandoArquivo = null;
  document.getElementById("modal-titulo").textContent = `Preencher dados (${
    fotosCapturadas.length
  } foto${fotosCapturadas.length > 1 ? "s" : ""})`;
  document.getElementById("modal-file").classList?.add("hidden");
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
  document.getElementById("modal-file").classList?.add("hidden");
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
    if (!meta?.code) return alert("Código da imagem não encontrado.");

    await fetch(`${API_BASE}/atualizar-metadata`, {
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

  await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData,
  });

  fecharModal();
  loadFolder();
}

// Se tiver a função "abrirModalMover", coloque aqui

// Iniciar
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
  document.getElementById("relatorio-btn").onclick = () => {
    window.location.href = "relatorio.html";
  };

  loadFolder();
};
