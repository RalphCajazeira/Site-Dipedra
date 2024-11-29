document.addEventListener("DOMContentLoaded", () => {
  const uploadForm = document.getElementById("uploadForm");
  const catalogoGrid = document.getElementById("catalogo-grid");
  const editModal = document.getElementById("editModal");
  const closeModal = document.getElementById("closeModal");
  const editForm = document.getElementById("editForm");

  let currentImage = ""; // Guarda a imagem que está sendo editada

  // Função para exibir mensagens de erro/alerta
  function showMessage(message, isError = false) {
    alert(isError ? `Erro: ${message}` : message);
  }

  // Função genérica para realizar requisições
  async function fetchData(url, options = {}, retryCount = 3) {
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erro na requisição");
      return data;
    } catch (error) {
      console.error(error);
      if (retryCount > 0) {
        console.log(
          `Tentando novamente... (${retryCount} tentativas restantes)`
        );
        return fetchData(url, options, retryCount - 1);
      } else {
        showMessage(error.message, true);
        throw error;
      }
    }
  }

  // Função para criar elementos HTML dinamicamente
  function createElement(tag, attributes = {}, innerHTML = "") {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(
      ([key, value]) => (element[key] = value)
    );
    element.innerHTML = innerHTML;
    return element;
  }

  // Carregar itens do catálogo
  async function loadItems() {
    try {
      const data = await fetchData("../assets/catalogo.json");
      if (!data || data.length === 0) throw new Error("O catálogo está vazio.");

      catalogoGrid.innerHTML = ""; // Limpa o grid antes de carregar novos itens
      data.forEach((item) => catalogoGrid.appendChild(createCatalogCard(item)));
    } catch (error) {
      console.error("Erro ao carregar o catálogo:", error);
    }
  }

  // Criar card do catálogo
  function createCatalogCard(item) {
    const card = createElement("div", { className: "card" });

    const img = createElement("img", {
      src: `../assets/images/catalogo/${item.imagem}`,
      alt: item.nome,
    });

    const title = createElement("h3", {}, item.nome);

    const editButton = createElement(
      "button",
      { className: "edit-button" },
      "Editar"
    );
    editButton.onclick = () => openEditModal(item);

    const deleteButton = createElement(
      "button",
      { className: "delete-button" },
      "Apagar"
    );
    deleteButton.onclick = () => deleteItem(item.imagem);

    card.append(img, title, editButton, deleteButton);
    return card;
  }

  // Abrir modal de edição
  function openEditModal(item) {
    document.getElementById("editNome").value = item.nome;
    document.getElementById("editTipo").value = item.tipo;
    document.getElementById("editMaterial").value = item.material;
    document.getElementById("editAmbientes").value = item.ambientes.join(", ");
    currentImage = item.imagem;

    editModal.style.display = "flex";
  }

  // Fechar modal
  closeModal.addEventListener("click", () => {
    editModal.style.display = "none";
  });

  // Submeter formulário de edição
  editForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = document.getElementById("editNome").value;
    const tipo = document.getElementById("editTipo").value;
    const material = document.getElementById("editMaterial").value;
    const ambientes = document.getElementById("editAmbientes").value;

    try {
      const url = `http://127.0.0.1:3000/catalogo/edit/${currentImage}`;
      const options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, tipo, material, ambientes }),
      };

      const result = await fetchData(url, options);
      showMessage(result.message);
      editModal.style.display = "none";
      await loadItems();
    } catch (error) {
      console.error("Erro ao editar item:", error);
    }
  });

  // Submeter formulário de upload
  if (uploadForm) {
    uploadForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(uploadForm);

      try {
        const url = "http://127.0.0.1:3000/catalogo/upload";
        const options = { method: "POST", body: formData };

        const result = await fetchData(url, options);
        showMessage(result.message);
        uploadForm.reset();
        await loadItems();
      } catch (error) {
        console.error("Erro ao enviar formulário:", error);
      }
    });
  }

  // Apagar item
  async function deleteItem(image) {
    if (!confirm("Deseja realmente apagar este item?")) return;

    try {
      const url = `http://127.0.0.1:3000/catalogo/delete/${image}`;
      const options = { method: "DELETE" };

      const result = await fetchData(url, options);
      showMessage(result.message);
      await loadItems();
    } catch (error) {
      console.error("Erro ao apagar item:", error);
    }
  }

  // Inicializa o carregamento dos itens
  loadItems();
});
