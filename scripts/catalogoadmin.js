document.addEventListener("DOMContentLoaded", function () {
  const uploadForm = document.getElementById("uploadForm");

  if (uploadForm) {
    uploadForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(uploadForm); // Captura o formulário inteiro

      try {
        const response = await fetch("http://127.0.0.1:3000/catalogo/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (response.ok) {
          alert(result.message);
          uploadForm.reset();
          loadItems(); // Atualiza o catálogo
        } else {
          alert(result.message || "Erro ao enviar.");
        }
      } catch (error) {
        console.error("Erro ao enviar formulário:", error);
        alert("Erro ao enviar.");
      }
    });
  }

  loadItems(); // Chama a função global definida no catalogo.js
});
