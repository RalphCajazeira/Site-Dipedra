let filteredItems = [];
let isFiltering = false;

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
      if (retryCount > 0) {
        return fetchData(url, options, retryCount - 1);
      } else {
        showMessage(error.message, true);
        throw error;
      }
    }
  }

  function createElement(tag, attributes = {}, innerHTML = "") {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => (element[key] = value));
    element.innerHTML = innerHTML;
    return element;
  }

  function createCatalogCard(item) {
    const card = createElement("div", { className: "card" });

    const img = createElement("img", {
      src: `../assets/images/catalogo/${item.imagem}`,
      alt: item.nome,
    });

    const editButton = createElement("button", { className: "edit-button", type: "button" }, "Editar");
    const deleteButton = createElement("button", { className: "delete-button", type: "button" }, "Apagar");

    editButton.addEventListener("click", (e) => {
      e.preventDefault();
      openEditModal(item);
    });

    deleteButton.addEventListener("click", async (e) => {
      e.preventDefault();
      await deleteItem(item.imagem);
    });

    const actions = createElement("div", { className: "card-actions" });
    actions.append(deleteButton, editButton);

    const title = createElement("h3", {}, item.nome);
    const info = createElement("div", { className: "image-info" }, `
      <p><strong>Tipo:</strong> ${item.tipo}</p>
      <p><strong>Material:</strong> ${item.material}</p>
      <p><strong>Ambientes:</strong> ${item.ambientes.join(", ")}</p>
    `);

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

      // Atualiza na memória
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

      const updatedItem = filteredItems.find((item) => item.imagem === currentImage);
      updateCardDOM(updatedItem);
    } catch (error) {
      console.error("Erro ao editar item:", error);
    }
  });

  async function deleteItem(image) {
    if (!confirm("Deseja realmente apagar este item?")) return;

    try {
      const url = `http://127.0.0.1:3000/catalogo/delete/${image}`;
      const options = { method: "DELETE" };

      const result = await fetchData(url, options);
      showMessage(result.message);

      filteredItems = filteredItems.filter((item) => item.imagem !== image);
      removeCardDOM(image);
    } catch (error) {
      console.error("Erro ao apagar item:", error);
    }
  }

  function removeCardDOM(imageName) {
    const cardToRemove = [...catalogoGrid.children].find((card) => {
      const img = card.querySelector("img");
      return img && img.src.includes(imageName);
    });
    if (cardToRemove) {
      cardToRemove.remove();
    }
  }

  function updateCardDOM(updatedItem) {
    const cardToUpdate = [...catalogoGrid.children].find((card) => {
      const img = card.querySelector("img");
      return img && img.src.includes(updatedItem.imagem);
    });

    if (cardToUpdate) {
      const newCard = createCatalogCard(updatedItem);
      catalogoGrid.replaceChild(newCard, cardToUpdate);
    }
  }

  function displayFilteredItems(filtered) {
    catalogoGrid.innerHTML = "";
    if (filtered.length === 0) {
      catalogoGrid.innerHTML = "<p>Nenhum resultado encontrado.</p>";
      return;
    }
    filtered.forEach((item) => {
      catalogoGrid.appendChild(createCatalogCard(item));
    });
  }

  async function loadItems() {
    try {
      const data = await fetchData("../assets/catalogo.json");
      if (!data || data.length === 0) throw new Error("O catálogo está vazio.");
      isFiltering = false;
      filteredItems = data;
      displayFilteredItems(filteredItems);
    } catch (error) {
      console.error("Erro ao carregar o catálogo:", error);
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", async (e) => {
      const query = e.target.value.trim().toLowerCase();
      isFiltering = query !== "";

      try {
        const data = await fetchData("../assets/catalogo.json");
        const filtered = data.filter((item) => {
          const searchData = `${item.nome} ${item.tipo} ${item.material} ${item.ambientes.join(" ")}`.toLowerCase();
          return query.split(" ").every((term) => searchData.includes(term));
        });

        filteredItems = filtered;
        displayFilteredItems(filtered);
      } catch (error) {
        console.error("Erro ao filtrar catálogo:", error);
      }
    });
  }

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
        await loadItems(); // recarrega para incluir novo item
      } catch (error) {
        console.error("Erro ao enviar formulário:", error);
      }
    });
  }

  loadItems();
});
