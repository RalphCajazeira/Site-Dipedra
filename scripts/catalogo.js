document.addEventListener("DOMContentLoaded", () => {
  const catalogoGrid = document.getElementById("catalogo-grid");
  const searchInput = document.getElementById("search-input");
  const filterRadioButtons = document.querySelectorAll(
    'input[name="filter-type"]'
  );
  const closeButton = document.querySelector(".modal-close");
  const leftButton = document.querySelector(".modal-button.left");
  const rightButton = document.querySelector(".modal-button.right");

  const catalogoJsonPath = "../assets/catalogo.json";
  const imagePath = "../assets/images/catalogo/";
  const placeholderPath = "../assets/images/placeholder.jpg";

  let allItems = [];
  let filteredItems = [];
  let currentImageIndex = 0;

  const filterMaps = {
    ambientes: new Map(),
    nome: new Map(),
    tipo: new Map(),
    material: new Map(),
    chapas: new Map(),
  };

  // Função para carregar dados do catálogo
  async function fetchCatalogData() {
    try {
      const response = await fetch(catalogoJsonPath);
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

      allItems = await response.json();
      populateFilterMaps();
      displayFilterItems("ambientes"); // Exibir "ambientes" por padrão
    } catch (error) {
      console.error("Erro ao carregar o catálogo:", error);
      catalogoGrid.innerHTML = "<p>Erro ao carregar o catálogo.</p>";
    }
  }

  // Popula os mapas de filtros
  function populateFilterMaps() {
    allItems.forEach((item) => {
      Object.keys(filterMaps).forEach((key) => {
        if (key === "chapas") {
          if (item.ambientes.includes("Chapas")) {
            if (!filterMaps.chapas.has("Chapas")) {
              filterMaps.chapas.set("Chapas", []);
            }
            filterMaps.chapas.get("Chapas").push(item);
          }
          return;
        }

        const values = Array.isArray(item[key]) ? item[key] : [item[key]];
        values.forEach((value) => {
          if (!filterMaps[key].has(value)) {
            filterMaps[key].set(value, []);
          }
          filterMaps[key].get(value).push(item);
        });
      });
    });
  }

  // Função para exibir itens por filtro
  function displayFilterItems(filterType) {
    const filterMap = filterMaps[filterType] || filterMaps.ambientes;
    const sortedKeys = Array.from(filterMap.keys()).sort();

    catalogoGrid.innerHTML = "";
    sortedKeys.forEach((group) => {
      const firstItem =
        filterMap.get(group).find((item) => !item.capaUsada) ||
        filterMap.get(group)[0];
      firstItem.capaUsada = true;

      const card = createCard(group, firstItem.imagem);
      card.addEventListener("click", () =>
        displayImagesByGroup(filterType, group)
      );
      catalogoGrid.appendChild(card);
    });
  }

  // Função para exibir imagens por grupo
  function displayImagesByGroup(filterType, group) {
    const filterMap = filterMaps[filterType] || filterMaps.ambientes;
    let items = filterMap.get(group) || [];

    // Se for o filtro de chapas, ordenar por material
    if (filterType === "chapas") {
      items.sort((a, b) => a.material.localeCompare(b.material));
    } else {
      // Para qualquer outro filtro, ordenar para mostrar as Chapas primeiro
      const chapas = items.filter((item) => item.nome === "Chapa");
      const outros = items.filter((item) => item.nome !== "Chapa");
      items = [...chapas, ...outros];
    }

    filteredItems = items;
    catalogoGrid.innerHTML = "";

    filteredItems.forEach((item, index) => {
      const imgWrapper = createImageWrapper(item, index);
      catalogoGrid.appendChild(imgWrapper);
    });

    const bottomContainer = document.getElementById("catalogo-bottom");
    bottomContainer.innerHTML = "";
    bottomContainer.appendChild(
      createBackButton(() => {
        displayFilterItems(filterType);
        bottomContainer.innerHTML = "";
      })
    );
  }

  // Filtra itens por texto
  function filterItems(query) {
    const terms = query.toLowerCase().split(" ").filter(Boolean);

    const chapas = [];
    const outros = [];

    allItems.forEach((item) => {
      const searchData = `${item.nome} ${item.tipo} ${
        item.material
      } ${item.ambientes.join(" ")}`.toLowerCase();
      const matches = terms.every((term) => searchData.includes(term));

      if (matches) {
        if (item.ambientes.includes("Chapas")) {
          chapas.push(item);
        } else {
          outros.push(item);
        }
      }
    });

    filteredItems = [...chapas, ...outros];
    displayFilteredItems(filteredItems);
  }

  // Exibir itens filtrados
  function displayFilteredItems(filtered) {
    catalogoGrid.innerHTML = "";

    if (filtered.length === 0) {
      catalogoGrid.innerHTML = "<p>Nenhum resultado encontrado.</p>";
      return;
    }

    filtered.forEach((item, index) => {
      const imgWrapper = createImageWrapper(item, index);
      catalogoGrid.appendChild(imgWrapper);
    });
  }

  // Função para criar um card
  function createCard(title, image) {
    const card = document.createElement("div");
    card.classList.add("card");

    const img = document.createElement("img");
    img.src = `${imagePath}${image}`;
    img.alt = title;
    img.onerror = () => (img.src = placeholderPath);

    const titleDiv = document.createElement("div");
    titleDiv.classList.add("card-title");
    titleDiv.textContent = title;

    card.appendChild(img);
    card.appendChild(titleDiv);
    return card;
  }

  // Função para criar wrapper de imagem
  function createImageWrapper(item, index) {
    const imgWrapper = document.createElement("div");
    imgWrapper.classList.add("image-wrapper");

    const img = document.createElement("img");
    img.src = `${imagePath}${item.imagem}`;
    img.alt = `Imagem de ${item.nome}`;
    img.onerror = () => (img.src = placeholderPath);
    img.addEventListener("click", () => openModal(index));

    const info = document.createElement("div");
    info.classList.add("image-info");
    info.innerHTML = `
      <h3>${item.nome}</h3>
      <p><strong>Tipo:</strong> ${item.tipo}</p>
      <p><strong>Material:</strong> ${item.material}</p>
      <p><strong>Ambientes:</strong> ${item.ambientes.join(", ")}</p>
    `;

    imgWrapper.appendChild(img);
    imgWrapper.appendChild(info);
    return imgWrapper;
  }

  // Cria botão de voltar
  function createBackButton(callback) {
    const button = document.createElement("button");
    button.classList.add("back-button");
    button.textContent = "Voltar";
    button.addEventListener("click", callback);
    return button;
  }

  // Modal de imagem
  function openModal(index) {
    const modal = document.getElementById("image-modal");
    const modalImage = document.getElementById("modal-image");

    if (!modal || !modalImage) return console.error("Modal não encontrado.");

    currentImageIndex = index;
    modalImage.src = `${imagePath}${filteredItems[index].imagem}`;
    modal.style.display = "flex";
    document.addEventListener("keydown", handleModalNavigation);
  }

  function closeModal() {
    const modal = document.getElementById("image-modal");
    modal.style.display = "none";
    document.removeEventListener("keydown", handleModalNavigation);
  }

  function navigateImage(direction) {
    currentImageIndex =
      (currentImageIndex + direction + filteredItems.length) %
      filteredItems.length;
    const modalImage = document.getElementById("modal-image");
    modalImage.src = `${imagePath}${filteredItems[currentImageIndex].imagem}`;
  }

  function handleModalNavigation(event) {
    if (event.key === "Escape") closeModal();
    if (event.key === "ArrowRight") navigateImage(1);
    if (event.key === "ArrowLeft") navigateImage(-1);
  }

  // Eventos
  closeButton?.addEventListener("click", closeModal);
  leftButton?.addEventListener("click", () => navigateImage(-1));
  rightButton?.addEventListener("click", () => navigateImage(1));
  searchInput?.addEventListener("input", (e) => filterItems(e.target.value));
  filterRadioButtons.forEach((radio) =>
    radio.addEventListener("change", (e) => displayFilterItems(e.target.value))
  );

  // Inicializa carregamento do catálogo
  fetchCatalogData();
});
