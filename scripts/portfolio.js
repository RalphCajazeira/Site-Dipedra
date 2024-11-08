// portfolio.js - Script para carregar cards e alternar entre áreas e suas imagens

document.addEventListener("DOMContentLoaded", function () {
  const portfolioGrid = document.getElementById("portfolio-grid");

  // Definindo as pastas dos projetos
  const projects = ["Area de Serviço", "Banheiro", "Cozinha", "Varanda"];

  // Caminho da imagem de fallback
  const placeholderPath = "../assets/images/placeholder.jpg";

  // Função para exibir os cards das áreas principais
  function displayProjectCards() {
    portfolioGrid.innerHTML = ""; // Limpa o grid

    projects.forEach((project) => {
      const card = document.createElement("div");
      card.classList.add("card");

      // Caminho da imagem de capa
      const imagePath = `../assets/images/portfolio/${project}/capa.jpg`;

      // Imagem do card
      const img = document.createElement("img");
      img.src = imagePath;
      img.alt = `Imagem de ${project}`;
      img.onerror = () => {
        img.src = placeholderPath;
      }; // Usa placeholder se não carregar
      card.appendChild(img);

      // Título do card
      const title = document.createElement("div");
      title.classList.add("card-title");
      title.textContent = project;
      card.appendChild(title);

      // Evento de clique para abrir imagens da área específica
      card.addEventListener("click", () => displayProjectImages(project));

      // Adiciona o card ao grid
      portfolioGrid.appendChild(card);
    });
  }

  // Função para exibir as imagens dentro de uma área específica
  function displayProjectImages(project) {
    portfolioGrid.innerHTML = ""; // Limpa o grid para exibir as imagens

    // Caminho da pasta do projeto
    const projectPath = `../assets/images/portfolio/${project}`;

    // Supondo que as imagens estão nomeadas sequencialmente como "1.jpg", "2.jpg", etc.
    for (let i = 1; i <= 10; i++) {
      // Ajuste o limite conforme o número de imagens
      const imgPath = `${projectPath}/${i}.jpg`;

      const imgWrapper = document.createElement("div");
      imgWrapper.classList.add("image-wrapper");

      const img = document.createElement("img");
      img.src = imgPath;
      img.alt = `Imagem ${i} de ${project}`;
      img.onerror = () => (img.style.display = "none"); // Oculta se a imagem não carregar
      imgWrapper.appendChild(img);

      portfolioGrid.appendChild(imgWrapper);
    }

    // Botão para voltar à visualização dos cards principais
    const backButton = document.createElement("button");
    backButton.textContent = "Voltar";
    backButton.classList.add("back-button");
    backButton.addEventListener("click", displayProjectCards);
    portfolioGrid.appendChild(backButton);
  }

  // Exibe os cards principais ao carregar a página
  displayProjectCards();
});
