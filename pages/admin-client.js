document.addEventListener("DOMContentLoaded", function () {
  const editButtons = document.querySelectorAll(".edit-btn");
  const deleteButtons = document.querySelectorAll(".delete-btn");

  editButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const clientId = button.dataset.id;
      const response = await fetch(`/api/get-client?id=${clientId}`);
      const data = await response.json();

      document.getElementById("name").value = data.name || "";
      document.getElementById("location").value = data.location || "";
      document.getElementById("faqs").value = data.faqs?.join("\n") || "";
      document.getElementById("description").value = data.description || "";
      document.getElementById("phone").value = data.phone || "";
      document.getElementById("client-id").value = data._id;

      document.getElementById("form-title").textContent = "Editar Cliente";
      document.getElementById("submit-button").textContent = "Actualizar";
    });
  });

  deleteButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const clientId = button.dataset.id;
      if (confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
        await fetch(`/api/delete-client?id=${clientId}`, { method: "DELETE" });
        window.location.reload();
      }
    });
  });
});
