document
  .getElementById("uploadForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append(
      "productName",
      document.getElementById("productName").value
    );
    formData.append(
      "productType",
      document.getElementById("productType").value
    );
    formData.append(
      "productMaterial",
      document.getElementById("productMaterial").value
    );
    formData.append(
      "productAmbientes",
      document.getElementById("productAmbientes").value
    );

    // Adiciona todos os arquivos de imagem ao FormData
    const files = document.getElementById("productImage").files;
    for (let i = 0; i < files.length; i++) {
      formData.append("productImages", files[i]);
    }

    try {
      const response = await fetch("http://127.0.0.1:3000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.error(
          "Erro no servidor:",
          response.status,
          await response.text()
        );
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.log("Upload bem-sucedido:", result.message);
      alert("Upload bem-sucedido!");
    } catch (error) {
      console.error("Erro ao enviar o formulário:", error);
      alert("Erro ao enviar o formulário.");
    }
  });
