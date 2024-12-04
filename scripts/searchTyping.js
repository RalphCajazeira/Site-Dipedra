// Função para obter os parâmetros da URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
  
  // Simular digitação
  function simulateTyping(element, text, delay = 100) {
    element.value = ""; // Limpa o campo antes de simular
    let i = 0;
  
    function typeCharacter() {
      if (i < text.length) {
        element.value += text[i]; // Adiciona o próximo caractere
        const event = new Event('input', { bubbles: true }); // Dispara o evento input
        element.dispatchEvent(event); // Aciona o filtro
        i++;
        setTimeout(typeCharacter, delay); // Próximo caractere após um pequeno atraso
      }
    }
  
    typeCharacter();
  }
  
  // Preencher e simular digitação
  document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input");
    const searchQuery = getQueryParam("search");
  
    if (searchInput && searchQuery) {
      simulateTyping(searchInput, decodeURIComponent(searchQuery));
    }
  });
  