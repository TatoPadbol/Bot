
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("editForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const updatedClient = {
      name: document.getElementById("name").value,
      category: document.getElementById("category").value,
      country: document.getElementById("country").value,
      info: document.getElementById("info").value,
      phone: document.getElementById("phone").value,
      faqs: [
        document.getElementById("faq1").value,
        document.getElementById("faq2").value,
        document.getElementById("faq3").value,
      ],
    };

    fetch(`/api/update-client?name=${updatedClient.name}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedClient),
    })
      .then((response) => {
        if (response.ok) {
          window.location.href = "/admin-client";
        } else {
          alert("Error al actualizar el cliente.");
        }
      });
  });
});
