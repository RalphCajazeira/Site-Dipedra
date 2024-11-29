document
  .getElementById("uploadForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
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
        event.target.reset();
        loadItems(); // Atualiza o catálogo
      } else {
        console.error("Erro no upload:", result.message);
        alert(result.message || "Erro ao enviar.");
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      alert("Erro ao enviar.");
    }
  });
