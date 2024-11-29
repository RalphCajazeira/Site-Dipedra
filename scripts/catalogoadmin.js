document.addEventListener("DOMContentLoaded", function () {
  const uploadForm = document.getElementById("uploadForm");

  // Enviar múltiplos arquivos
  if (uploadForm) {
    uploadForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(uploadForm);
      const files = document.getElementById("productImages").files;

      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      }

      try {
        const response = await fetch("http://127.0.0.1:3000/catalogo/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (response.ok) {
          alert(result.message);
          uploadForm.reset();
          loadItems(); // Reutiliza função do catalogo.js para carregar itens
        } else {
          alert(result.message || "Erro ao enviar.");
        }
      } catch (error) {
        console.error("Erro ao enviar formulário:", error);
        alert("Erro ao enviar.");
      }
    });
  }

  // Reutilizar função do catalogo.js para carregar a grid
  loadItems(); // Certifique-se de que esta função existe no catalogo.js
});
