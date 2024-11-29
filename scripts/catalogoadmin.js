document.addEventListener("DOMContentLoaded", function () {
  const uploadForm = document.getElementById("uploadForm");

  if (uploadForm) {
    uploadForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(uploadForm);

      console.log(
        "Arquivos selecionados para upload:",
        formData.getAll("images")
      );

      try {
        const response = await fetch("http://127.0.0.1:3000/catalogo/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (response.ok) {
          alert(result.message);
          uploadForm.reset();
          // Aguarda 1 segundo antes de carregar o catálogo
          setTimeout(loadItems, 1000);
        } else {
          alert(result.message || "Erro ao enviar.");
        }
      } catch (error) {
        console.error("Erro ao enviar formulário:", error);
        alert("Erro ao enviar. Consulte o console para mais detalhes.");
      }
    });
  }

  loadItems(); // Carrega os itens ao carregar a página
});
