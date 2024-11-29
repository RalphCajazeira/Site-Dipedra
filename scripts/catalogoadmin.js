document.addEventListener("DOMContentLoaded", function () {
  const uploadForm = document.getElementById("uploadForm");
  const catalogoGrid = document.getElementById("catalogo-grid");
  const editModal = document.getElementById("editModal");
  const closeModal = document.getElementById("closeModal");
  const editForm = document.getElementById("editForm");

  let currentImage = ""; // Guarda a imagem que está sendo editada

  if (uploadForm) {
    uploadForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(uploadForm);

      try {
        const response = await fetch("http://127.0.0.1:3000/catalogo/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (response.ok) {
          alert(result.message);
          uploadForm.reset();
          loadItems();
        } else {
          alert(result.message || "Erro ao enviar.");
        }
      } catch (error) {
        console.error("Erro ao enviar formulário:", error);
        alert("Erro ao enviar. Consulte o console para mais detalhes.");
      }
    });
  }

  closeModal.addEventListener("click", () => {
    editModal.style.display = "none";
  });

  async function loadItems() {
    try {
      const response = await fetch("../assets/catalogo.json");

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      catalogoGrid.innerHTML = "";

      data.forEach((item) => {
        const card = document.createElement("div");
        card.classList.add("card");

        const img = document.createElement("img");
        img.src = `../assets/images/catalogo/${item.imagem}`;
        img.alt = item.nome;
        card.appendChild(img);

        const title = document.createElement("h3");
        title.textContent = item.nome;
        card.appendChild(title);

        const editButton = document.createElement("button");
        editButton.textContent = "Editar";
        editButton.onclick = () => openEditModal(item);
        card.appendChild(editButton);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Apagar";
        deleteButton.onclick = () => deleteItem(item.imagem);
        card.appendChild(deleteButton);

        catalogoGrid.appendChild(card);
      });
    } catch (error) {
      console.error("Erro ao carregar o catálogo:", error);
      alert("Erro ao carregar o catálogo.");
    }
  }

  function openEditModal(item) {
    // Preenche os campos do modal com os dados do item
    document.getElementById("editNome").value = item.nome;
    document.getElementById("editTipo").value = item.tipo;
    document.getElementById("editMaterial").value = item.material;
    document.getElementById("editAmbientes").value = item.ambientes.join(", ");
    currentImage = item.imagem; // Guarda a imagem sendo editada

    editModal.style.display = "flex"; // Exibe o modal
  }

  editForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = document.getElementById("editNome").value;
    const tipo = document.getElementById("editTipo").value;
    const material = document.getElementById("editMaterial").value;
    const ambientes = document.getElementById("editAmbientes").value;

    try {
      const response = await fetch(
        `http://127.0.0.1:3000/catalogo/edit/${currentImage}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome, tipo, material, ambientes }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        editModal.style.display = "none"; // Fecha o modal
        loadItems();
      } else {
        alert(result.message || "Erro ao editar.");
      }
    } catch (error) {
      console.error("Erro ao editar item:", error);
      alert("Erro ao editar item.");
    }
  });

  async function deleteItem(image) {
    if (!confirm("Deseja realmente apagar este item?")) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:3000/catalogo/delete/${image}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        loadItems();
      } else {
        alert(result.message || "Erro ao apagar.");
      }
    } catch (error) {
      console.error("Erro ao apagar item:", error);
      alert("Erro ao apagar item.");
    }
  }

  loadItems();
});
