import { useEffect, useState } from "react";

export default function EditClients() {
  const [clients, setClients] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetch("/api/clientes")
      .then((res) => res.json())
      .then((data) => setClients(data));
  }, []);

  const handleEdit = (client) => {
    setEditing({ ...client });
  };

  const handleCancel = () => {
    setEditing(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditing((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setEditing((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in editing) {
      if (editing[key]) formData.append(key, editing[key]);
    }

    await fetch("/api/save-client", {
      method: "POST",
      body: formData,
    });

    setEditing(null);
    const updated = await fetch("/api/clientes").then((res) => res.json());
    setClients(updated);
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>Editar Clientes</h1>
      {clients.map((client, i) => (
        <div key={i} style={{ marginBottom: 30 }}>
          <h2>{client.name}</h2>
          <button onClick={() => handleEdit(client)}>Editar</button>
        </div>
      ))}

      {editing && (
        <form onSubmit={handleSave}>
          <input name="name" value={editing.name || ""} onChange={handleChange} placeholder="Nombre" />
          <input name="industry" value={editing.industry || ""} onChange={handleChange} placeholder="Industria" />
          <input name="country" value={editing.country || ""} onChange={handleChange} placeholder="País" />
          <input name="phone" value={editing.phone || ""} onChange={handleChange} placeholder="Teléfono" />
          <input name="phone_number_id" value={editing.phone_number_id || ""} onChange={handleChange} placeholder="Phone Number ID" />
          <input name="info" value={editing.info || ""} onChange={handleChange} placeholder="Info" />
          <input name="url" value={editing.url || ""} onChange={handleChange} placeholder="URL" />
          <p>PDF actual: <a href={editing.pdf} target="_blank" rel="noopener noreferrer">Ver archivo</a></p>
          <input type="file" onChange={handleFileChange} />
          <button type="submit">Guardar</button>
          <button onClick={handleCancel}>Cancelar</button>
        </div>
      )}
    </div>
  );
}