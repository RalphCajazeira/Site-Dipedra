let filteredItems = []; // Itens filtrados
let isFiltering = false; // Modo de busca ativo

document.addEventListener("DOMContentLoaded", () => {
  const uploadForm = document.getElementById("uploadForm");
  const catalogoGrid = document.getElementById("catalogo-grid");
  const editModal = document.getElementById("editModal");
  const closeModal = document.getElementById("closeModal");
  const editForm = document.getElementById("editForm");
  const searchInput = document.getElementById("search-input");

  let currentImage = "";

  function showMessage(message, isError = false) {
    alert(isError ? `Erro: ${message}` : message);
  }

  async function fetchData(url, options = {}, retryCount = 3) {
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erro na requisição");
      return data;
    } catch (error) {
      if (retryCount > 0) return fetchData(url, options, retryCount - 1);
      showMessage(error.message, true);
      throw error;
    }
  }

  function createElement(tag, attributes = {}, innerHTML = "") {
    const el = document.createElement(tag);
    Object.entries(attributes).forEach(([k, v]) => (el[k] = v));
    el.innerHTML = innerHTML;
    return el;
  }

  async function loadItems() {
    try {
      const data = await fetchData("../assets/catalogo.json");
      if (!data.length) throw new Error("Catálogo vazio.");
      isFiltering = false;
      filteredItems = data;
      displayFilteredItems(filteredItems);
    } catch (err) {
      console.error("Erro ao carregar catálogo:", err);
    }
  }

  function createCatalogCard(item) {
    const card = createElement("div", { className: "card" });

    const img = createElement("img", {
      src: `../assets/images/catalogo/${item.imagem}`,
      alt: item.nome,
    });

    const editButton = createElement(
      "button",
      {
        className: "edit-button",
        type: "button",
      },
      "Editar"
    );

    editButton.addEventListener("click", (e) => {
      e.preventDefault();
      openEditModal(item);
    });

    const deleteButton = createElement(
      "button",
      {
        className: "delete-button",
        type: "button",
      },
      "Apagar"
    );

    deleteButton.addEventListener("click", async (e) => {
      e.preventDefault();
      await deleteItem(item.imagem);
    });

    const actions = createElement("div", { className: "card-actions" });
    actions.append(deleteButton, editButton);

    const title = createElement("h3", {}, item.nome);

    const info = createElement(
      "div",
      { className: "image-info" },
      `
      <p><strong>Tipo:</strong> ${item.tipo}</p>
      <p><strong>Material:</strong> ${item.material}</p>
      <p><strong>Ambientes:</strong> ${item.ambientes.join(", ")}</p>
    `
    );

    card.append(img, actions, title, info);
    return card;
  }

  function openEditModal(item) {
    document.getElementById("editNome").value = item.nome;
    document.getElementById("editTipo").value = item.tipo;
    document.getElementById("editMaterial").value = item.material;
    document.getElementById("editAmbientes").value = item.ambientes.join(", ");
    currentImage = item.imagem;
    editModal.style.display = "flex";
  }

  closeModal.addEventListener("click", () => {
    editModal.style.display = "none";
  });

  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = document.getElementById("editNome").value;
    const tipo = document.getElementById("editTipo").value;
    const material = document.getElementById("editMaterial").value;
    const ambientes = document.getElementById("editAmbientes").value;

    try {
      const result = await fetchData(
        `http://127.0.0.1:3000/catalogo/edit/${currentImage}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome, tipo, material, ambientes }),
        }
      );

      showMessage(result.message);
      editModal.style.display = "none";

      // Atualiza localmente o item editado
      filteredItems = filteredItems.map((item) =>
        item.imagem === currentImage
          ? {
              ...item,
              nome,
              tipo,
              material,
              ambientes: ambientes.split(",").map((a) => a.trim()),
            }
          : item
      );
      displayFilteredItems(filteredItems);
    } catch (err) {
      console.error("Erro ao editar item:", err);
    }
  });

  async function deleteItem(imagem) {
    if (!confirm("Deseja realmente apagar este item?")) return;
    try {
      const result = await fetchData(
        `http://127.0.0.1:3000/catalogo/delete/${imagem}`,
        {
          method: "DELETE",
        }
      );
      showMessage(result.message);
      filteredItems = filteredItems.filter((item) => item.imagem !== imagem);
      displayFilteredItems(filteredItems);
    } catch (err) {
      console.error("Erro ao apagar item:", err);
    }
  }

  function displayFilteredItems(items) {
    catalogoGrid.innerHTML = items.length
      ? ""
      : "<p>Nenhum resultado encontrado.</p>";

    items.forEach((item) => catalogoGrid.appendChild(createCatalogCard(item)));
  }

  if (searchInput) {
    searchInput.addEventListener("input", async (e) => {
      const query = e.target.value.trim().toLowerCase();
      isFiltering = !!query;
      try {
        const data = await fetchData("../assets/catalogo.json");
        const filtered = data.filter((item) => {
          const fullText = `${item.nome} ${item.tipo} ${
            item.material
          } ${item.ambientes.join(" ")}`.toLowerCase();
          return query.split(" ").every((term) => fullText.includes(term));
        });
        filteredItems = filtered;
        displayFilteredItems(filtered);
      } catch (err) {
        console.error("Erro ao filtrar catálogo:", err);
      }
    });
  }

  if (uploadForm) {
    uploadForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(uploadForm);
      try {
        const result = await fetchData(
          "http://127.0.0.1:3000/catalogo/upload",
          {
            method: "POST",
            body: formData,
          }
        );
        showMessage(result.message);
        uploadForm.reset();
        await loadItems();
      } catch (err) {
        console.error("Erro ao enviar imagem:", err);
      }
    });
  }

  loadItems();
});
