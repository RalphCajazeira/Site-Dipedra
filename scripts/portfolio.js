// portfolio.js - Script para gerar dinamicamente os cards do portfólio

document.addEventListener("DOMContentLoaded", function () {
  const portfolioGrid = document.getElementById("portfolio-grid");

  // Definindo as pastas dos projetos atuais
  const projects = [
    "Area de Serviço",
    "Banheiro",
    "Cozinha",
    "Varanda",
    "Pisicina",
  ];

  // Caminho da imagem de fallback (caso capa.jpg não esteja presente)
  const placeholderPath = "../assets/images/placeholder.jpg"; // Caminho relativo ajustado

  // Criar cards dinamicamente
  projects.forEach((project) => {
    const card = document.createElement("div");
    card.classList.add("card");

    // Caminho da imagem de capa do projeto
    const imagePath = `../assets/images/portfolio/${project}/capa.jpg`;

    // Imagem
    const img = document.createElement("img");
    img.src = imagePath;
    img.alt = `Imagem de ${project}`;
    img.onerror = () => {
      img.src = placeholderPath;
    }; // Usa o placeholder se capa.jpg não carregar
    card.appendChild(img);

    // Título
    const title = document.createElement("div");
    title.classList.add("card-title");
    title.textContent = project;
    card.appendChild(title);

    // Adicionar o card ao grid
    portfolioGrid.appendChild(card);
  });
});
