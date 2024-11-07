document.addEventListener("DOMContentLoaded", function () {
  const cardContainer = document.querySelector(".card-container");
  const images = ["./assets/slide/slide01.jpg", "./assets/slide/slide02.jpg"];
  let currentSlide = 0;

  function startSlideShow() {
    // Exibe a primeira imagem imediatamente
    cardContainer.style.backgroundImage = `url('${images[currentSlide]}')`;

    // Inicia o intervalo de troca de imagens após exibir a primeira imagem
    setInterval(() => {
      currentSlide = (currentSlide + 1) % images.length;
      cardContainer.style.backgroundImage = `url('${images[currentSlide]}')`;
      console.log(`Mostrando imagem: ${images[currentSlide]}`);
    }, 6000); // alterna a cada 3 segundos
  }

  startSlideShow();
});
