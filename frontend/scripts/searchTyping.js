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
      const event = new Event("input", { bubbles: true }); // Dispara o evento input
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
  const qrcodeButton = document.getElementById("generate-qrcode");
  const copyLinkButton = document.getElementById("copy-link");

  // Preenche o campo de pesquisa com base no parâmetro da URL
  const searchQuery = getQueryParam("search");
  if (searchInput && searchQuery) {
    simulateTyping(searchInput, decodeURIComponent(searchQuery));
  }

  // Função para gerar QR Code
  if (qrcodeButton) {
    qrcodeButton.addEventListener("click", () => {
      const baseUrl = window.location.href.split("?")[0];
      const searchValue = searchInput.value.trim();

      if (searchValue === "") {
        alert("Por favor, insira um termo de pesquisa.");
        return;
      }

      const searchUrl = `${baseUrl}?search=${encodeURIComponent(searchValue)}`;

      // Gera o QR Code como imagem
      QRCode.toDataURL(searchUrl, { width: 500, height: 500 }, (error, url) => {
        if (error) {
          console.error("Erro ao gerar o QR Code:", error);
        } else {
          const link = document.createElement("a");
          link.href = url;
          link.download = `qrcode-${searchValue}.png`; // Nome do arquivo inclui o valor da pesquisa
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
    });
  }

  // Função para copiar o link para a área de transferência
  if (copyLinkButton) {
    copyLinkButton.addEventListener("click", () => {
      const baseUrl = window.location.href.split("?")[0];
      const searchValue = searchInput.value.trim();

      if (searchValue === "") {
        alert("Por favor, insira um termo de pesquisa.");
        return;
      }

      const searchUrl = `${baseUrl}?search=${encodeURIComponent(searchValue)}`;

      // Verifica se o recurso clipboard está disponível
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(searchUrl)
          .then(() => {
            alert("Link copiado para a área de transferência!");
          })
          .catch((error) => {
            console.error("Erro ao copiar o link:", error);
          });
      } else {
        // Método alternativo para navegadores que não suportam clipboard
        const textArea = document.createElement("textarea");
        textArea.value = searchUrl;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand("copy");
          alert("Link copiado para a área de transferência!");
        } catch (error) {
          console.error("Erro ao copiar o link (alternativo):", error);
          alert("Não foi possível copiar o link. Copie manualmente.");
        }
        document.body.removeChild(textArea);
      }
    });
  }
});
