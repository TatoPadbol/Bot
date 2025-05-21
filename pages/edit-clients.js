
import { useEffect, useState } from "react";

const CLOUDINARY_UPLOAD_PRESET = "padbot_upload";
const CLOUDINARY_CLOUD_NAME = "dmin4ofkd";

export default function EditClients() {
  const [clients, setClients] = useState([]);
  const [editing, setEditing] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    let pdfUrl = editing.pdf;
    if (pdfFile) {
      const formData = new FormData();
      formData.append("file", pdfFile);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`, {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      console.log("📎 Resultado Cloudinary:", uploadData);

      if (!uploadRes.ok) {
        console.error("❌ Error al subir PDF:", uploadData);
        alert("Falló la subida del PDF: " + uploadData.error?.message);
        return;
      }

      pdfUrl = uploadData.secure_url;
    }

    const updatedClient = { ...editing, pdf: pdfUrl };
    console.log("📤 Enviando cliente actualizado:", updatedClient);

    const res = await fetch("/api/clientes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedClient),
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
        <form onSubmit={handleSubmit}>
          <input placeholder="Nombre" value={editing.name} onChange={(e) => handleChange("name", e.target.value)} />
          <input placeholder="Rubro" value={editing.industry} onChange={(e) => handleChange("industry", e.target.value)} />
          <input placeholder="País" value={editing.country} onChange={(e) => handleChange("country", e.target.value)} />
          <input placeholder="Teléfono" value={editing.phone} onChange={(e) => handleChange("phone", e.target.value)} />
          <input placeholder="URL" value={editing.url || ""} onChange={(e) => handleChange("url", e.target.value)} />
          <textarea placeholder="Info" value={editing.info} onChange={(e) => handleChange("info", e.target.value)} />
          <textarea placeholder="FAQs (separadas por ;)" value={editing.faqs?.join("; ") || ""} onChange={(e) => handleChange("faqs", e.target.value.split(";"))} />
          {editing.pdf && (
            <p>
              PDF actual: <a href={editing.pdf} target="_blank" rel="noopener noreferrer">Ver archivo</a>
            </p>
          )}
          <div>
            <label>Cargar archivo PDF</label>
            <input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files[0])} />
          </div>
          <button type="submit">Guardar</button>
        </form>
      ) : (
        clients.map((client, idx) => (
          <div key={idx}>
            <h3>{client.name}</h3>
            <button onClick={() => setEditing(client)}>Editar</button>
          </div>
        ))
      )}
    </div>
  );
}
