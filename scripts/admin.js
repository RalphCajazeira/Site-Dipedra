document.addEventListener("DOMContentLoaded", function () {
  const uploadForm = document.getElementById("uploadForm"); // Formulário de Upload
  const adminGrid = document.getElementById("catalogo-grid"); // Grid para exibir os produtos
  const deleteConfirmModal = document.getElementById("delete-confirm-modal");
  const confirmDeleteBtn = document.getElementById("confirm-delete");
  const cancelDeleteBtn = document.getElementById("cancel-delete");
  const editModal = document.getElementById("edit-modal");
  const cancelEditBtn = document.getElementById("cancel-edit");
  const editForm = document.getElementById("editForm");
  let currentItemId = null;

  // Função para carregar os produtos do JSON e exibi-los no grid de administração
  async function loadProducts() {
    try {
      const response = await fetch("../assets/catalogo.json");
      const products = await response.json();

      adminGrid.innerHTML = ""; // Limpa o grid antes de adicionar os novos elementos

      products.forEach((product, index) => {
        const card = document.createElement("div");
        card.classList.add("card");

        const img = document.createElement("img");
        img.src = `../assets/images/catalogo/${product.imagem}`;
        img.alt = `Imagem de ${product.nome}`;
        card.appendChild(img);

        const info = document.createElement("div");
        info.classList.add("image-info");
        info.innerHTML = `
          <h3>${product.nome}</h3>
          <p><strong>Tipo:</strong> ${product.tipo}</p>
          <p><strong>Material:</strong> ${product.material}</p>
          <p><strong>Ambientes:</strong> ${product.ambientes.join(", ")}</p>
        `;
        card.appendChild(info);

        // Botões de Ação
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("button", "red");
        deleteButton.textContent = "Excluir";
        deleteButton.addEventListener("click", () => openDeleteModal(index));
        card.appendChild(deleteButton);

        const editButton = document.createElement("button");
        editButton.classList.add("button", "yellow");
        editButton.textContent = "Editar";
        editButton.addEventListener("click", () =>
          openEditModal(index, product)
        );
        card.appendChild(editButton);

        adminGrid.appendChild(card);
      });
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      adminGrid.innerHTML = "<p>Erro ao carregar as imagens.</p>";
    }
  }

  // Abre o modal de confirmação de exclusão
  function openDeleteModal(index) {
    currentItemId = index;
    deleteConfirmModal.style.display = "block"; // Exibe o modal
  }

  // Fecha o modal de exclusão sem excluir
  if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener("click", () => {
      deleteConfirmModal.style.display = "none"; // Oculta o modal
      currentItemId = null; // Reseta o item atual
    });
  }

  // Confirma a exclusão do produto
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener("click", async () => {
      if (currentItemId !== null) {
        try {
          const response = await fetch(
            `http://127.0.0.1:3000/delete/${currentItemId}`,
            {
              method: "DELETE",
            }
          );

          if (response.ok) {
            loadProducts(); // Recarrega a lista de produtos após a exclusão
            console.log("Produto excluído com sucesso.");
          } else {
            console.error("Erro ao excluir o produto.");
          }
        } catch (error) {
          console.error("Erro ao enviar requisição de exclusão:", error);
        } finally {
          deleteConfirmModal.style.display = "none"; // Oculta o modal
          currentItemId = null; // Reseta o item atual
        }
      }
    });
  }

  // Função para abrir o modal de edição com os dados preenchidos
  function openEditModal(index, product) {
    currentItemId = index;
    document.getElementById("editName").value = product.nome;
    document.getElementById("editType").value = product.tipo;
    document.getElementById("editMaterial").value = product.material;
    document.getElementById("editAmbientes").value =
      product.ambientes.join(", ");
    editModal.style.display = "block"; // Exibe o modal de edição
  }

  // Fecha o modal de edição sem salvar alterações
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener("click", () => {
      editModal.style.display = "none"; // Oculta o modal de edição
      currentItemId = null; // Reseta o item atual
    });
  }

  // Envio do formulário de edição
  if (editForm) {
    editForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // Previne o envio padrão do formulário

      const formData = new FormData(editForm);

      try {
        const response = await fetch(
          `http://127.0.0.1:3000/edit/${currentItemId}`,
          {
            method: "PUT",
            body: formData,
          }
        );

        if (response.ok) {
          await loadProducts(); // Recarrega os produtos após a edição
          editModal.style.display = "none"; // Fecha o modal de edição
        } else {
          console.error("Erro ao editar o produto.");
        }
      } catch (error) {
        console.error("Erro ao enviar a requisição de edição:", error);
      } finally {
        currentItemId = null; // Reseta o item atual
      }
    });
  }

  // Envio do formulário de upload de imagem
  if (uploadForm) {
    uploadForm.addEventListener("submit", async function (event) {
      event.preventDefault(); // Previne o comportamento padrão do formulário

      const formData = new FormData(uploadForm); // Cria FormData com os dados do formulário

      try {
        const response = await fetch("http://127.0.0.1:3000/upload", {
          method: "POST",
          body: formData, // Envia o FormData (dados e imagens)
        });

        // Verifica se o status da resposta é OK
        if (!response.ok) {
          const errorText = await response.text(); // Lê o corpo da resposta como texto
          console.error("Erro no upload:", response.status, errorText);
          alert("Erro ao enviar o formulário. Verifique os dados.");
          return;
        }

        // Tenta interpretar a resposta como JSON
        try {
          const result = await response.json(); // Lê o corpo como JSON
          console.log("Upload bem-sucedido:", result.message);
          alert(result.message || "Upload realizado com sucesso!");
        } catch (jsonError) {
          // Caso a resposta não seja JSON
          console.log("A resposta não é JSON, tratando como texto.");
          alert("Upload realizado com sucesso!");
        }

        loadProducts(); // Recarrega os produtos após o upload
      } catch (error) {
        console.error("Erro ao enviar o formulário:", error);
        alert(
          "Erro ao enviar o formulário. Verifique o console para mais detalhes."
        );
      }
    });
  }

  // Carrega os produtos ao iniciar
  loadProducts();
});
