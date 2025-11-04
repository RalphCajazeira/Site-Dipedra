document.addEventListener("DOMContentLoaded", function () {
  const cardContainer = document.querySelector(".card-container");
  const images = ["../assets/slide/slide01.jpg", "../assets/slide/slide02.jpg"];
  let currentSlide = 0;

  function startSlideShow() {
    cardContainer.style.backgroundImage = `url('${images[currentSlide]}')`;

    setInterval(() => {
      currentSlide = (currentSlide + 1) % images.length;
      cardContainer.style.backgroundImage = `url('${images[currentSlide]}')`;
    }, 6000); // alterna a cada 6 segundos
  }

  startSlideShow();
});
