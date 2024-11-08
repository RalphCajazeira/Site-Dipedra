document.addEventListener("DOMContentLoaded", function () {
  const catalogoGrid = document.getElementById("catalogo-grid");
  const searchInput = document.getElementById("search-input");

  const catalogoJsonPath = "../assets/catalogo.json";
  const imagePath = "../assets/images/catalogo/";
  const placeholderPath = "../assets/images/placeholder.jpg";

  let allItems = [];
  let ambientesMap = new Map();
  let filteredItems = [];
  let currentImageIndex = 0;

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
      modal.style.display = "none";

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

  // Tornar navigateImage e closeModal globais para serem acessíveis no HTML
  window.navigateImage = navigateImage;
  window.closeModal = closeModal;

  // Função para lidar com eventos de teclado
  function handleKeydown(event) {
    if (event.key === "Escape") {
      closeModal();
    } else if (event.key === "ArrowRight") {
      navigateImage(1);
    } else if (event.key === "ArrowLeft") {
      navigateImage(-1);
    }
  }

  function displayAmbientes() {
    catalogoGrid.innerHTML = "";
    ambientesMap.forEach((items, ambiente) => {
      let firstItem = items.find((item) => !item.capaUsada) || items[0];
      firstItem.capaUsada = true;

      const card = document.createElement("div");
      card.classList.add("card");

      const img = document.createElement("img");
      img.src = `${imagePath}${firstItem.imagem}`;
      img.alt = `Imagem de ${ambiente}`;
      img.onerror = () => (img.src = placeholderPath);
      card.appendChild(img);

      const title = document.createElement("div");
      title.classList.add("card-title");
      title.textContent = ambiente;
      card.appendChild(title);

      card.addEventListener("click", () => displayImagesByAmbiente(ambiente));

      catalogoGrid.appendChild(card);
    });
  }

  function displayImagesByAmbiente(ambiente) {
    catalogoGrid.innerHTML = "";
    filteredItems = ambientesMap.get(ambiente) || [];

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
    backButton.addEventListener("click", displayAmbientes);
    catalogoGrid.appendChild(backButton);
  }

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

  function filterItems(query) {
    const terms = query
      .toLowerCase()
      .split(" ")
      .filter((term) => term);
    filteredItems = allItems.filter((item) => {
      const searchData = `${item.nome} ${item.tipo} ${
        item.material
      } ${item.ambientes.join(" ")}`.toLowerCase();
      return terms.every((term) => searchData.includes(term));
    });

    if (query === "") {
      displayAmbientes();
    } else {
      displayFilteredItems(filteredItems);
    }
  }

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
      });

      displayAmbientes();

      searchInput.addEventListener("input", (event) => {
        filterItems(event.target.value);
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
