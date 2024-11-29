document.addEventListener("DOMContentLoaded", function () {
  const catalogoGrid = document.getElementById("catalogo-grid");
  const searchInput = document.getElementById("search-input");
  const filterRadioButtons = document.querySelectorAll(
    'input[name="filter-type"]'
  );
  const closeButton = document.querySelector(".modal-close");

  const catalogoJsonPath = "../assets/catalogo.json";
  const imagePath = "../assets/images/catalogo/";
  const placeholderPath = "../assets/images/placeholder.jpg";

  let allItems = [];
  let ambientesMap = new Map();
  let nomeMap = new Map();
  let tipoMap = new Map();
  let materialMap = new Map();
  let filteredItems = [];
  let currentImageIndex = 0;

  // Garantir que o botão de fechar funcione ao ser clicado
  if (closeButton) {
    closeButton.addEventListener("click", closeModal); // Fechar o modal ao clicar no botão "X"
  }

  // Função para abrir o modal
  function openModal(imageIndex) {
    const modal = document.getElementById("image-modal");
    const modalImage = document.getElementById("modal-image");
    currentImageIndex = imageIndex;

    if (modal && modalImage) {
      modalImage.src = `${imagePath}${filteredItems[imageIndex].imagem}`;
      modal.style.display = "flex";

      // Adiciona o evento de teclado ao abrir o modal
      document.addEventListener("keydown", handleKeydown);
    } else {
      console.error("Elemento modal ou modal-image não encontrado.");
    }
  }

  function closeModal() {
    const modal = document.getElementById("image-modal");
    if (modal) {
      modal.style.display = "none"; // Fecha o modal

      // Remove o evento de teclado ao fechar o modal
      document.removeEventListener("keydown", handleKeydown);
    }
  }

  // Função para navegação entre as imagens
  function navigateImage(direction) {
    const modalImage = document.getElementById("modal-image");
    if (modalImage) {
      currentImageIndex += direction;
      if (currentImageIndex < 0) {
        currentImageIndex = filteredItems.length - 1;
      } else if (currentImageIndex >= filteredItems.length) {
        currentImageIndex = 0;
      }
      modalImage.src = `${imagePath}${filteredItems[currentImageIndex].imagem}`;
    }
  }

  // Função para lidar com eventos de teclado
  function handleKeydown(event) {
    if (event.key === "Escape") {
      closeModal(); // Fecha o modal ao pressionar "Esc"
    } else if (event.key === "ArrowRight") {
      navigateImage(1);
    } else if (event.key === "ArrowLeft") {
      navigateImage(-1);
    }
  }

  // Função para exibir os filtros ordenados
  function displayFilterItems(filterType) {
    catalogoGrid.innerHTML = "";
    let filterMap;

    switch (filterType) {
      case "ambientes":
        filterMap = ambientesMap;
        break;
      case "nome":
        filterMap = nomeMap;
        break;
      case "tipo":
        filterMap = tipoMap;
        break;
      case "material":
        filterMap = materialMap;
        break;
      default:
        filterMap = ambientesMap;
    }

    // Ordenar os grupos de forma alfabética
    const sortedGroups = [...filterMap.keys()].sort();

    sortedGroups.forEach((group) => {
      let firstItem =
        filterMap.get(group).find((item) => !item.capaUsada) ||
        filterMap.get(group)[0];
      firstItem.capaUsada = true;

      const card = document.createElement("div");
      card.classList.add("card");

      const img = document.createElement("img");
      img.src = `${imagePath}${firstItem.imagem}`;
      img.alt = `Imagem de ${group}`;
      img.onerror = () => (img.src = placeholderPath);
      card.appendChild(img);

      const title = document.createElement("div");
      title.classList.add("card-title");
      title.textContent = group;
      card.appendChild(title);

      card.addEventListener("click", () =>
        displayImagesByGroup(filterType, group)
      );

      catalogoGrid.appendChild(card);
    });
  }

  // Função para exibir as imagens filtradas por grupo
  function displayImagesByGroup(filterType, group) {
    catalogoGrid.innerHTML = "";
    let filterMap;
    switch (filterType) {
      case "ambientes":
        filterMap = ambientesMap;
        break;
      case "nome":
        filterMap = nomeMap;
        break;
      case "tipo":
        filterMap = tipoMap;
        break;
      case "material":
        filterMap = materialMap;
        break;
      default:
        filterMap = ambientesMap;
    }

    filteredItems = filterMap.get(group) || [];
    filteredItems.forEach((item, index) => {
      const imgWrapper = document.createElement("div");
      imgWrapper.classList.add("image-wrapper");

      const img = document.createElement("img");
      img.src = `${imagePath}${item.imagem}`;
      img.alt = `Imagem de ${item.nome}`;
      img.onerror = () => (img.src = placeholderPath);
      imgWrapper.appendChild(img);

      img.addEventListener("click", () => openModal(index));

      const info = document.createElement("div");
      info.classList.add("image-info");
      info.innerHTML = `
        <h3>${item.nome}</h3>
        <p><strong>Tipo:</strong> ${item.tipo}</p>
        <p><strong>Material:</strong> ${item.material}</p>
        <p><strong>Ambientes:</strong> ${item.ambientes.join(", ")}</p>
      `;
      imgWrapper.appendChild(info);

      catalogoGrid.appendChild(imgWrapper);
    });

    const backButton = document.createElement("button");
    backButton.textContent = "Voltar";
    backButton.classList.add("back-button");
    backButton.addEventListener("click", () => displayFilterItems(filterType));
    catalogoGrid.appendChild(backButton);
  }

  // Função para filtrar os itens com múltiplas palavras
  function filterItems(query, filterType) {
    const terms = query
      .toLowerCase()
      .split(" ")
      .filter((term) => term); // Divide a string em palavras, ignorando espaços

    filteredItems = allItems.filter((item) => {
      const searchData = `${item.nome} ${item.tipo} ${
        item.material
      } ${item.ambientes.join(" ")}`.toLowerCase();
      return terms.every((term) => searchData.includes(term)); // Verifica se cada termo aparece
    });

    displayFilteredItems(filteredItems);
  }

  // Função para exibir os itens filtrados
  function displayFilteredItems(filtered) {
    catalogoGrid.innerHTML = "";
    filteredItems = filtered;

    if (filteredItems.length === 0) {
      catalogoGrid.innerHTML = "<p>Nenhum resultado encontrado.</p>";
      return;
    }

    filteredItems.forEach((item, index) => {
      const imgWrapper = document.createElement("div");
      imgWrapper.classList.add("image-wrapper");

      const img = document.createElement("img");
      img.src = `${imagePath}${item.imagem}`;
      img.alt = `Imagem de ${item.nome}`;
      img.onerror = () => (img.src = placeholderPath);
      imgWrapper.appendChild(img);

      img.addEventListener("click", () => openModal(index));

      const info = document.createElement("div");
      info.classList.add("image-info");
      info.innerHTML = `
        <h3>${item.nome}</h3>
        <p><strong>Tipo:</strong> ${item.tipo}</p>
        <p><strong>Material:</strong> ${item.material}</p>
        <p><strong>Ambientes:</strong> ${item.ambientes.join(", ")}</p>
      `;
      imgWrapper.appendChild(info);

      catalogoGrid.appendChild(imgWrapper);
    });
  }

  // Lê os dados do JSON e preenche os grupos
  fetch(catalogoJsonPath)
    .then((response) => response.json())
    .then((items) => {
      allItems = items;

      items.forEach((item) => {
        item.ambientes.forEach((ambiente) => {
          if (!ambientesMap.has(ambiente)) {
            ambientesMap.set(ambiente, [item]);
          } else {
            ambientesMap.get(ambiente).push(item);
          }
        });

        // Populando outros filtros
        if (!nomeMap.has(item.nome)) {
          nomeMap.set(item.nome, [item]);
        } else {
          nomeMap.get(item.nome).push(item);
        }

        if (!tipoMap.has(item.tipo)) {
          tipoMap.set(item.tipo, [item]);
        } else {
          tipoMap.get(item.tipo).push(item);
        }

        if (!materialMap.has(item.material)) {
          materialMap.set(item.material, [item]);
        } else {
          materialMap.get(item.material).push(item);
        }
      });

      displayFilterItems("ambientes"); // Exibe os ambientes por padrão

      // Filtro por radio buttons
      filterRadioButtons.forEach((radio) => {
        radio.addEventListener("change", (event) => {
          const selectedFilter = event.target.value;
          displayFilterItems(selectedFilter); // Exibe os filtros com base na opção selecionada
        });
      });

      // Filtragem por texto
      searchInput.addEventListener("input", (event) => {
        const selectedFilter = Array.from(filterRadioButtons).find(
          (radio) => radio.checked
        ).value;
        if (event.target.value === "") {
          displayFilterItems(selectedFilter); // Quando o campo de pesquisa estiver vazio, mostra o filtro selecionado
        } else {
          filterItems(event.target.value, selectedFilter); // Filtra os itens conforme o texto digitado
        }
      });
    })
    .catch((error) => {
      console.error("Erro ao carregar o catálogo:", error);
      catalogoGrid.innerHTML = "<p>Erro ao carregar as imagens.</p>";
    });

  // Navegação dos botões de próxima e anterior
  const leftButton = document.querySelector(".modal-button.left");
  const rightButton = document.querySelector(".modal-button.right");

  if (leftButton) {
    leftButton.addEventListener("click", () => navigateImage(-1));
  }
  if (rightButton) {
    rightButton.addEventListener("click", () => navigateImage(1));
  }
});

// catalogo.js
async function loadItems() {
  const catalogoGrid = document.getElementById("catalogo-grid");

  try {
    const response = await fetch("../assets/catalogo.json");

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    catalogoGrid.innerHTML = ""; // Limpa o grid antes de carregar novos itens

    data.forEach((item) => {
      const card = document.createElement("div");
      card.classList.add("card");

      const img = document.createElement("img");
      img.src = `../assets/images/catalogo/${item.imagem}`;
      img.alt = item.nome;
      card.appendChild(img);

      const title = document.createElement("h3");
      title.textContent = item.nome;
      card.appendChild(title);

      catalogoGrid.appendChild(card);
    });
  } catch (error) {
    console.error("Erro ao carregar o catálogo:", error);
    alert(
      "Não foi possível carregar o catálogo no momento. Tente novamente mais tarde."
    );
  }
}

// Garante que a função seja globalmente acessível
window.loadItems = loadItems;

// Carrega os itens ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  loadItems();
});
