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
      const formDataPDF = new FormData();
      formDataPDF.append("file", pdfFile);
      formDataPDF.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`,
        {
          method: "POST",
          body: formDataPDF,
        }
      );

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        console.error("❌ Error al subir PDF:", uploadData);
        alert("Error al subir el PDF");
        return;
      }

      pdfUrl = uploadData.secure_url;
    }

    const formData = new FormData();
    formData.append("name", editing.name);
    formData.append("industry", editing.industry);
    formData.append("country", editing.country);
    formData.append("phone", editing.phone);
    formData.append("info", editing.info);
    formData.append("url", editing.url);
    formData.append("pdfUrl", pdfUrl);
    formData.append("phone_number_id", editing.phone_number_id || "");

    const res = await fetch("/api/save-client-fix", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Cliente guardado correctamente");
      setEditing(null);
      refreshClients();
    } else {
      alert("Hubo un error al guardar el cliente");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Editar Clientes</h1>
      {clients.map((client) => (
        <div key={client._id}>
          {editing?._id === client._id ? (
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={editing.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Nombre"
              />
              <input
                type="text"
                value={editing.industry}
                onChange={(e) => handleChange("industry", e.target.value)}
                placeholder="Industria"
              />
              <input
                type="text"
                value={editing.country}
                onChange={(e) => handleChange("country", e.target.value)}
                placeholder="País"
              />
              <input
                type="text"
                value={editing.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="Teléfono"
              />
              <input
                type="text"
                value={editing.info}
                onChange={(e) => handleChange("info", e.target.value)}
                placeholder="Info"
              />
              <input
                type="text"
                value={editing.url}
                onChange={(e) => handleChange("url", e.target.value)}
                placeholder="URL"
              />
              <input
                type="text"
                value={editing.phone_number_id || ""}
                onChange={(e) => handleChange("phone_number_id", e.target.value)}
                placeholder="Phone Number ID"
              />
              {editing.pdf && (
              <div style={{ marginBottom: "0.5rem" }}>
                PDF actual:{" "}
                <a href={editing.pdf} target="_blank" rel="noopener noreferrer">Ver archivo</a>
              </div>
            )}
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdfFile(e.target.files[0])}
            />
              <button type="submit">Guardar</button>
              <button type="button" onClick={() => setEditing(null)}>
                Cancelar
              </button>
            </form>
          ) : (
            <div style={{ marginBottom: "1rem" }}>
              <strong>{client.name}</strong>
              <div>
                <button onClick={() => setEditing(client)}>Editar</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}