import { useEffect, useState } from "react";

export default function EditClients() {
  const [clients, setClients] = useState([]);
  const [editing, setEditing] = useState(null);

  const refreshClients = async () => {
    const res = await fetch("/api/clientes");
    const data = await res.json();
    setClients(data);
  };

  useEffect(() => {
    refreshClients();
  }, []);

  const handleChange = (field, value) => {
    setEditing({ ...editing, [field]: value });
  };

  const handleSubmit = async () => {
    const res = await fetch("/api/clientes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    if (res.ok) {
      alert("Cliente actualizado correctamente");
      setEditing(null);
      await refreshClients();
    } else {
      alert("Error al actualizar");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h1>Editar Clientes</h1>
      {editing ? (
        <div>
          <input placeholder="Nombre" value={editing.name} onChange={(e) => handleChange("name", e.target.value)} />
          <input placeholder="Rubro" value={editing.industry} onChange={(e) => handleChange("industry", e.target.value)} />
          <input placeholder="País" value={editing.country} onChange={(e) => handleChange("country", e.target.value)} />
          <input placeholder="Teléfono" value={editing.phone} onChange={(e) => handleChange("phone", e.target.value)} />
          <textarea placeholder="Info" value={editing.info} onChange={(e) => handleChange("info", e.target.value)} />
          <textarea placeholder="FAQs (separadas por ;)" value={editing.faqs.join("; ")} onChange={(e) => handleChange("faqs", e.target.value.split(";"))} />
          <button onClick={handleSubmit}>Guardar</button>
        </div>
      ) : (
        clients.map((client, idx) => (
          <div key={idx} style={{ borderBottom: "1px solid #ccc", padding: 10 }}>
            <strong>{client.name}</strong> - {client.country}
            <button onClick={() => setEditing(client)} style={{ marginLeft: 10 }}>Editar</button>
          </div>
        ))
      )}
    </div>
  );
}