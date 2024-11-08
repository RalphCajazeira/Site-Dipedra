// catalogo.js - Carrega os ambientes e imagens do JSON do catálogo

document.addEventListener("DOMContentLoaded", function () {
  const catalogoGrid = document.getElementById("catalogo-grid");
  const searchInput = document.getElementById("search-input");

  // Caminhos para o JSON e as imagens
  const catalogoJsonPath = "../assets/catalogo.json";
  const imagePath = "../assets/images/catalogo/";
  const placeholderPath = "../assets/images/placeholder.jpg";

  let allItems = []; // Armazena todos os itens do JSON para pesquisa
  let ambientesMap = new Map(); // Armazena os ambientes únicos e a primeira imagem de cada

  // Função para abrir o modal com a imagem ampliada
  function openModal(imageSrc) {
    const modal = document.getElementById("image-modal");
    const modalImage = document.getElementById("modal-image");
    modalImage.src = imageSrc;
    modal.style.display = "flex";
  }

  // Função para fechar o modal
  window.closeModal = function () {
    document.getElementById("image-modal").style.display = "none";
  };

  // Função para exibir a grid inicial com os ambientes
  function displayAmbientes() {
    catalogoGrid.innerHTML = ""; // Limpa o grid

    // Cria um card para cada ambiente com a primeira imagem disponível, dando prioridade a imagens não repetidas
    ambientesMap.forEach((items, ambiente) => {
      let firstItem = items[0]; // Inicialmente assume a primeira imagem como capa
      let remainingItems = items.slice(1); // Outros itens após a primeira

      // Tenta encontrar uma imagem que ainda não foi usada
      for (let item of remainingItems) {
        if (!item.capaUsada) {
          firstItem = item;
          item.capaUsada = true;
          break;
        }
      }

      const card = document.createElement("div");
      card.classList.add("card");

      // Imagem do ambiente (primeira ocorrência ou uma imagem diferente da capa)
      const img = document.createElement("img");
      img.src = `${imagePath}${firstItem.imagem}`;
      img.alt = `Imagem de ${ambiente}`;
      img.onerror = () => (img.src = placeholderPath);
      card.appendChild(img);

      // Título do ambiente
      const title = document.createElement("div");
      title.classList.add("card-title");
      title.textContent = ambiente;
      card.appendChild(title);

      // Evento de clique no card para exibir as imagens do ambiente
      card.addEventListener("click", () => displayImagesByAmbiente(ambiente));

      catalogoGrid.appendChild(card);
    });
  }

  // Função para exibir as imagens associadas a um ambiente específico
  function displayImagesByAmbiente(ambiente) {
    catalogoGrid.innerHTML = ""; // Limpa o grid para exibir as imagens do ambiente

    const items = ambientesMap.get(ambiente);

    items.forEach((item) => {
      const imgWrapper = document.createElement("div");
      imgWrapper.classList.add("image-wrapper");

      const img = document.createElement("img");
      img.src = `${imagePath}${item.imagem}`;
      img.alt = `Imagem de ${item.nome}`;
      img.onerror = () => (img.src = placeholderPath);
      imgWrapper.appendChild(img);

      // Evento de clique para abrir a imagem no modal
      img.addEventListener("click", () => openModal(img.src));

      // Informações do produto
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

    // Botão para voltar à visualização dos ambientes
    const backButton = document.createElement("button");
    backButton.textContent = "Voltar";
    backButton.classList.add("back-button");
    backButton.addEventListener("click", displayAmbientes);
    catalogoGrid.appendChild(backButton);
  }

  // Função para exibir os itens que correspondem ao termo de pesquisa
  function displayFilteredItems(filteredItems) {
    catalogoGrid.innerHTML = ""; // Limpa o grid

    if (filteredItems.length === 0) {
      catalogoGrid.innerHTML = "<p>Nenhum resultado encontrado.</p>";
      return;
    }

    filteredItems.forEach((item) => {
      const imgWrapper = document.createElement("div");
      imgWrapper.classList.add("image-wrapper");

      const img = document.createElement("img");
      img.src = `${imagePath}${item.imagem}`;
      img.alt = `Imagem de ${item.nome}`;
      img.onerror = () => (img.src = placeholderPath);
      imgWrapper.appendChild(img);

      // Evento de clique para abrir a imagem no modal
      img.addEventListener("click", () => openModal(img.src));

      // Informações do produto
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

  // Função de pesquisa dinâmica com suporte a múltiplos termos
  function filterItems(query) {
    const terms = query
      .toLowerCase()
      .split(" ")
      .filter((term) => term); // Divide em múltiplos termos e remove espaços em branco

    const filteredItems = allItems.filter((item) => {
      const searchData = `${item.nome} ${item.tipo} ${
        item.material
      } ${item.ambientes.join(" ")}`.toLowerCase();

      // Verifica se todos os termos estão presentes nos dados de pesquisa
      return terms.every((term) => searchData.includes(term));
    });

    if (query === "") {
      displayAmbientes(); // Exibe a grid inicial se não houver termo de pesquisa
    } else {
      displayFilteredItems(filteredItems); // Exibe os itens filtrados pela pesquisa
    }
  }

  // Carrega o JSON e prepara a exibição inicial
  fetch(catalogoJsonPath)
    .then((response) => response.json())
    .then((items) => {
      allItems = items; // Guarda todos os itens para a pesquisa

      // Prepara os ambientes e suas imagens
      items.forEach((item) => {
        item.ambientes.forEach((ambiente) => {
          if (!ambientesMap.has(ambiente)) {
            ambientesMap.set(ambiente, [item]); // Adiciona o ambiente com a primeira imagem
          } else {
            ambientesMap.get(ambiente).push(item); // Adiciona mais itens ao ambiente existente
          }
        });
      });

      displayAmbientes(); // Exibe a grid inicial com os ambientes

      // Evento de input para a pesquisa
      searchInput.addEventListener("input", (event) => {
        filterItems(event.target.value);
      });
    })
    .catch((error) => {
      console.error("Erro ao carregar o catálogo:", error);
      catalogoGrid.innerHTML = "<p>Erro ao carregar as imagens.</p>";
    });
});
