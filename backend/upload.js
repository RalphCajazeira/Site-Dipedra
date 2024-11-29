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
    formData.append(
      "productImage",
      document.getElementById("productImage").files[0]
    );

    try {
      const response = await fetch("/upload", {
        method: "POST",
        body: formData,
      });

      // Verifica se a resposta do servidor está OK (status 200)
      if (!response.ok) {
        throw new Error(`Erro HTTP! status: ${response.status}`);
      }

      // Tenta converter a resposta para JSON
      const result = await response.json();
      document.getElementById("uploadStatus").innerText = result.message;
    } catch (error) {
      document.getElementById("uploadStatus").innerText =
        "Erro ao fazer upload. Tente novamente.";
      console.error("Erro:", error);
    }
  });
