
import { useState, useEffect } from "react";

export default function EditClient() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    fetch("/api/get-clients")
      .then((res) => res.json())
      .then((data) => setClients(data));
  }, []);

  const handleEdit = (client) => {
    setSelectedClient(client);
    document.getElementById("name").value = client.name;
    document.getElementById("category").value = client.category;
    document.getElementById("country").value = client.country;
    document.getElementById("info").value = client.info;
    document.getElementById("phone").value = client.phone;
    document.getElementById("faq1").value = client.faqs[0];
    document.getElementById("faq2").value = client.faqs[1];
    document.getElementById("faq3").value = client.faqs[2];
  };

  return (
    <div>
      <h1>Editar Cliente</h1>
      <ul>
        {clients.map((client, index) => (
          <li key={index}>
            <button onClick={() => handleEdit(client)}>Editar {client.name}</button>
          </li>
        ))}
      </ul>

      <form id="editForm">
        <input type="text" id="name" placeholder="Nombre del cliente" required />
        <input type="text" id="category" placeholder="Rubro" required />
        <input type="text" id="country" placeholder="País" required />
        <input type="text" id="phone" placeholder="Teléfono (ej: 5492211234567)" required />
        <textarea id="info" placeholder="Información general del negocio" required></textarea>
        <textarea id="faq1" placeholder="Pregunta frecuente 1" required></textarea>
        <textarea id="faq2" placeholder="Pregunta frecuente 2" required></textarea>
        <textarea id="faq3" placeholder="Pregunta frecuente 3" required></textarea>
        <button type="submit">Guardar cambios</button>
      </form>
      <script src="/admin-client.js"></script>
    </div>
  );
}
