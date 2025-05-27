
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
      if (editing[key] !== undefined) {
        const value = editing[key];
        if (key === "file") {
          formData.append("pdf", value); // subir como "pdf"
        } else {
          formData.append(key, typeof value === "string" ? value : String(value));
        }
      }
    }

    try {
      const res = await fetch("/api/save-client", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Error al guardar:", data);
        alert("Error al guardar cliente");
        return;
      }

      alert("Cliente guardado correctamente");
      setEditing(null);
      const updated = await fetch("/api/clientes").then((res) => res.json());
      setClients(updated);
    } catch (err) {
      console.error("Fallo en la solicitud:", err);
      alert("Fallo al conectar con el servidor");
    }
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
          <input name="numberId" value={editing.numberId || ""} onChange={handleChange} placeholder="Number ID" />
          <input name="info" value={editing.info || ""} onChange={handleChange} placeholder="Info" />
          <input name="url" value={editing.url || ""} onChange={handleChange} placeholder="URL" />
          {editing.pdf && (
            <p>PDF actual: <a href={editing.pdf} target="_blank" rel="noopener noreferrer">Ver archivo</a></p>
          )}
          <input type="file" onChange={handleFileChange} />
          <button type="submit">Guardar</button>
          <button type="button" onClick={handleCancel}>Cancelar</button>
        </form>
      )}
    </div>
  );
}
