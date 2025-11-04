document.addEventListener("DOMContentLoaded", () => {
  const api = window.AppAPI;
  if (!api) {
    console.error("AppAPI não foi inicializado.");
    return;
  }

  const elements = {
    grid: document.getElementById("catalogo-grid"),
    bottom: document.getElementById("catalogo-bottom"),
    search: document.getElementById("search-input"),
    filters: Array.from(document.querySelectorAll('input[name="filter-type"]')),
    modal: document.getElementById("image-modal"),
    modalImage: document.getElementById("modal-image"),
    closeModal: document.querySelector("#image-modal .modal-close"),
    leftButton: document.querySelector("#image-modal .modal-button.left"),
    rightButton: document.querySelector("#image-modal .modal-button.right"),
    adminPanel: document.getElementById("admin-panel"),
    uploadForm: document.getElementById("upload-form"),
    toggleUpload: document.getElementById("toggle-upload"),
    logoutButton: document.getElementById("logout-button"),
    editModal: document.getElementById("edit-modal"),
    editForm: document.getElementById("edit-form"),
    closeEdit: document.getElementById("close-edit-modal"),
  };

  const placeholderPath =
    typeof api.getPlaceholderImageUrl === "function"
      ? api.getPlaceholderImageUrl()
      : "../assets/images/placeholder.jpg";

  function resolveImagePath(imageName) {
    if (!imageName) {
      return placeholderPath;
    }

    if (typeof api.resolveImageUrl === "function") {
      return api.resolveImageUrl(imageName);
    }

    return `../assets/images/catalogo/${imageName}`;
  }

  const state = {
    items: [],
    filterMaps: {},
    filteredItems: [],
    currentFilter: "ambientes",
    currentGroup: null,
    currentImageIndex: 0,
    currentUser: null,
    uploadVisible: false,
    editingItem: null,
  };

  async function init() {
    await refreshSession();
    await loadCatalog();
    registerEvents();
    applyCurrentView();
  }

  async function refreshSession() {
    const session = await api.fetchProfile();
    updateAdminPanel(session?.user || api.getSession()?.user || null);
  }

  async function loadCatalog() {
    try {
      const items = await api.fetchCatalog();
      state.items = Array.isArray(items) ? items : [];
      buildFilterMaps();
    } catch (error) {
      console.error("Erro ao carregar o catálogo", error);
      if (elements.grid) {
        elements.grid.innerHTML = `<p>Não foi possível carregar o catálogo no momento.</p>`;
      }
    }
  }

  function buildFilterMaps() {
    const maps = {
      ambientes: new Map(),
      nome: new Map(),
      tipo: new Map(),
      material: new Map(),
      chapas: new Map(),
    };

    state.items.forEach((item) => {
      const ambientes = Array.isArray(item.ambientes) ? item.ambientes : [];

      ambientes.forEach((ambiente) => {
        addToMap(maps.ambientes, ambiente, item);
        if (ambiente.toLowerCase() === "chapas") {
          addToMap(maps.chapas, "Chapas", item);
        }
      });

      if (item.nome) {
        addToMap(maps.nome, item.nome, item);
      }

      if (item.tipo) {
        addToMap(maps.tipo, item.tipo, item);
      }

      if (item.material) {
        addToMap(maps.material, item.material, item);
      }
    });

    state.filterMaps = maps;
  }

  function addToMap(map, key, item) {
    const normalizedKey = key?.toString().trim();
    if (!normalizedKey) {
      return;
    }

    if (!map.has(normalizedKey)) {
      map.set(normalizedKey, []);
    }

    map.get(normalizedKey).push(item);
  }

  function registerEvents() {
    elements.search?.addEventListener("input", (event) => {
      const query = event.target.value.trim();
      if (!query) {
        state.currentGroup = null;
        applyCurrentView();
        return;
      }
      filterItems(query);
    });

    elements.filters.forEach((radio) => {
      radio.addEventListener("change", (event) => {
        state.currentFilter = event.target.value;
        state.currentGroup = null;
        displayFilterItems(state.currentFilter);
      });
    });

    elements.closeModal?.addEventListener("click", closeModal);
    elements.leftButton?.addEventListener("click", () => navigateImage(-1));
    elements.rightButton?.addEventListener("click", () => navigateImage(1));
    document.addEventListener("keydown", handleModalKeyboardNavigation);

    elements.toggleUpload?.addEventListener("click", () => {
      state.uploadVisible = !state.uploadVisible;
      updateUploadVisibility();
    });

    elements.logoutButton?.addEventListener("click", () => {
      api.logout();
      updateAdminPanel(null);
      applyCurrentView();
    });

    elements.uploadForm?.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!elements.uploadForm) return;

      const formData = new FormData(elements.uploadForm);
      try {
        const result = await api.createCatalogItems(formData);
        const created = Array.isArray(result?.created) ? result.created.length : 0;
        const skipped = Array.isArray(result?.skipped) ? result.skipped.length : 0;
        const message = skipped
          ? `Imagens adicionadas: ${created}. Ignoradas por duplicidade: ${skipped}.`
          : "Imagens adicionadas com sucesso.";
        alert(message);
        elements.uploadForm.reset();
        await loadCatalog();
        applyCurrentView();
      } catch (error) {
        console.error(error);
        alert(error.message || "Erro ao enviar as imagens.");
      }
    });

    elements.editForm?.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!state.editingItem) return;

      const payload = {
        nome: elements.editForm.nome.value,
        tipo: elements.editForm.tipo.value,
        material: elements.editForm.material.value,
        ambientes: elements.editForm.ambientes.value,
      };

      try {
        await api.updateCatalogItem(state.editingItem.image, payload);
        alert("Item atualizado com sucesso.");
        closeEditModal();
        await loadCatalog();
        applyCurrentView();
      } catch (error) {
        console.error(error);
        alert(error.message || "Não foi possível atualizar o item.");
      }
    });

    elements.closeEdit?.addEventListener("click", closeEditModal);

    window.addEventListener("app:session-changed", (event) => {
      const user = event.detail?.session?.user || null;
      updateAdminPanel(user);
      applyCurrentView();
    });
  }

  function updateUploadVisibility() {
    if (!elements.uploadForm || !elements.toggleUpload) {
      return;
    }

    if (state.uploadVisible) {
      elements.uploadForm.removeAttribute("hidden");
      elements.toggleUpload.textContent = "Ocultar formulário";
    } else {
      elements.uploadForm.setAttribute("hidden", "");
      elements.toggleUpload.textContent = "Adicionar imagens";
    }
  }

  function updateAdminPanel(user) {
    state.currentUser = user;

    if (!elements.adminPanel) {
      return;
    }

    if (user) {
      elements.adminPanel.removeAttribute("hidden");
      elements.logoutButton?.removeAttribute("hidden");
      updateUploadVisibility();
    } else {
      elements.adminPanel.setAttribute("hidden", "");
      state.uploadVisible = false;
      updateUploadVisibility();
    }
  }

  function applyCurrentView() {
    if (!elements.grid) return;

    const query = elements.search?.value?.trim();
    if (query) {
      filterItems(query);
      return;
    }

    if (state.currentGroup && state.currentFilter) {
      const groupItems =
        state.filterMaps[state.currentFilter]?.get(state.currentGroup) || [];
      if (groupItems.length > 0) {
        displayImagesByGroup(state.currentFilter, state.currentGroup);
        return;
      }
    }

    displayFilterItems(state.currentFilter || "ambientes");
  }

  function displayFilterItems(filterType) {
    const map = state.filterMaps[filterType] || new Map();
    const sortedKeys = Array.from(map.keys()).sort((a, b) =>
      a.localeCompare(b)
    );

    state.filteredItems = [];
    state.currentFilter = filterType;
    state.currentGroup = null;

    if (!elements.grid) return;
    elements.grid.innerHTML = "";
    elements.bottom.innerHTML = "";

    if (sortedKeys.length === 0) {
      elements.grid.innerHTML = "<p>Catálogo em atualização.</p>";
      return;
    }

    sortedKeys.forEach((group) => {
      const items = map.get(group) || [];
      if (items.length === 0) return;

      const coverItem = selectCoverItem(items);
      const card = createCard(group, coverItem.image);
      card.addEventListener("click", () => displayImagesByGroup(filterType, group));
      elements.grid.appendChild(card);
    });
  }

  function selectCoverItem(items) {
    if (!Array.isArray(items) || items.length === 0) {
      return { image: "" };
    }

    const chapa = items.find((item) => item.nome?.toLowerCase() === "chapa");
    return chapa || items[0];
  }

  function displayImagesByGroup(filterType, group) {
    const map = state.filterMaps[filterType] || new Map();
    let items = map.get(group) || [];

    if (filterType === "chapas") {
      items = [...items].sort((a, b) => (a.material || "").localeCompare(b.material || ""));
    } else {
      const chapas = items.filter((item) => item.nome?.toLowerCase() === "chapa");
      const others = items.filter((item) => item.nome?.toLowerCase() !== "chapa");
      items = [...chapas, ...others];
    }

    state.filteredItems = items;
    state.currentGroup = group;
    state.currentFilter = filterType;

    renderImageList(items);
    renderBackButton(() => displayFilterItems(filterType));
  }

  function renderImageList(items) {
    if (!elements.grid) return;
    elements.grid.innerHTML = "";

    if (!items || items.length === 0) {
      elements.grid.innerHTML = "<p>Nenhum item disponível.</p>";
      return;
    }

    items.forEach((item, index) => {
      const wrapper = createImageWrapper(item, index);
      elements.grid.appendChild(wrapper);
    });
  }

  function renderBackButton(callback) {
    elements.bottom.innerHTML = "";
    const button = document.createElement("button");
    button.className = "back-button";
    button.textContent = "Voltar";
    button.addEventListener("click", callback);
    elements.bottom.appendChild(button);
  }

  function filterItems(query) {
    const terms = query.toLowerCase().split(" ").filter(Boolean);

    if (terms.length === 0) {
      state.currentGroup = null;
      displayFilterItems(state.currentFilter);
      return;
    }

    const chapas = [];
    const others = [];

    state.items.forEach((item) => {
      const texto = [
        item.nome,
        item.tipo,
        item.material,
        ...(Array.isArray(item.ambientes) ? item.ambientes : []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matches = terms.every((term) => texto.includes(term));
      if (!matches) return;

      if (Array.isArray(item.ambientes) && item.ambientes.includes("Chapas")) {
        chapas.push(item);
      } else {
        others.push(item);
      }
    });

    state.filteredItems = [...chapas, ...others];
    state.currentGroup = null;

    if (!elements.grid) return;
    elements.bottom.innerHTML = "";

    if (state.filteredItems.length === 0) {
      elements.grid.innerHTML = "<p>Nenhum resultado encontrado.</p>";
      return;
    }

    renderImageList(state.filteredItems);
  }

  function createCard(title, imageName) {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = resolveImagePath(imageName);
    img.alt = title;
    img.onerror = () => {
      img.onerror = null;
      img.src = placeholderPath;
    };

    const titleEl = document.createElement("div");
    titleEl.className = "card-title";
    titleEl.textContent = title;

    card.appendChild(img);
    card.appendChild(titleEl);
    return card;
  }

  function createImageWrapper(item, index) {
    const wrapper = document.createElement("div");
    wrapper.className = "image-wrapper";

    const img = document.createElement("img");
    img.src = resolveImagePath(item.image);
    img.alt = `Imagem de ${item.nome || item.image}`;
    img.onerror = () => {
      img.onerror = null;
      img.src = placeholderPath;
    };
    img.addEventListener("click", () => openModal(index));

    const info = document.createElement("div");
    info.className = "image-info";
    const ambientes = Array.isArray(item.ambientes)
      ? item.ambientes.join(", ")
      : "";
    info.innerHTML = `
      <h3>${item.nome || "Item"}</h3>
      <p><strong>Tipo:</strong> ${item.tipo || "-"}</p>
      <p><strong>Material:</strong> ${item.material || "-"}</p>
      <p><strong>Ambientes:</strong> ${ambientes || "-"}</p>
    `;

    wrapper.appendChild(img);
    wrapper.appendChild(info);

    if (state.currentUser) {
      const actions = document.createElement("div");
      actions.className = "admin-actions";

      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.textContent = "Editar";
      editButton.addEventListener("click", (event) => {
        event.stopPropagation();
        openEditModal(item);
      });
      actions.appendChild(editButton);

      if (state.currentUser.role === "master") {
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete";
        deleteButton.textContent = "Apagar";
        deleteButton.addEventListener("click", async (event) => {
          event.stopPropagation();
          if (!confirm("Deseja remover este item?")) {
            return;
          }
          try {
            await api.deleteCatalogItem(item.image);
            alert("Item removido com sucesso.");
            await loadCatalog();
            applyCurrentView();
          } catch (error) {
            console.error(error);
            alert(error.message || "Não foi possível remover o item.");
          }
        });
        actions.appendChild(deleteButton);
      }

      wrapper.appendChild(actions);
    }

    return wrapper;
  }

  function openModal(index) {
    if (!elements.modal || !elements.modalImage) return;
    const items = state.filteredItems;
    if (!items || items.length === 0) return;

    state.currentImageIndex = index;
    elements.modalImage.src = resolveImagePath(items[index].image);
    elements.modal.style.display = "flex";
  }

  function closeModal() {
    if (!elements.modal) return;
    elements.modal.style.display = "none";
  }

  function navigateImage(direction) {
    const items = state.filteredItems;
    if (!items || items.length === 0) return;

    state.currentImageIndex =
      (state.currentImageIndex + direction + items.length) % items.length;

    if (elements.modalImage) {
      elements.modalImage.src = resolveImagePath(items[state.currentImageIndex].image);
    }
  }

  function handleModalKeyboardNavigation(event) {
    if (!elements.modal || elements.modal.style.display !== "flex") return;

    if (event.key === "Escape") {
      closeModal();
    } else if (event.key === "ArrowRight") {
      navigateImage(1);
    } else if (event.key === "ArrowLeft") {
      navigateImage(-1);
    }
  }

  function openEditModal(item) {
    if (!elements.editModal || !elements.editForm) return;

    state.editingItem = item;
    elements.editForm.nome.value = item.nome || "";
    elements.editForm.tipo.value = item.tipo || "";
    elements.editForm.material.value = item.material || "";
    elements.editForm.ambientes.value = Array.isArray(item.ambientes)
      ? item.ambientes.join(", ")
      : "";

    elements.editModal.style.display = "flex";
  }

  function closeEditModal() {
    if (!elements.editModal || !elements.editForm) return;

    state.editingItem = null;
    elements.editForm.reset();
    elements.editModal.style.display = "none";
  }

  init();
});
