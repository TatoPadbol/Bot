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

    const res = await fetch("/api/save-client", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Cliente guardado correctamente");
      refreshClients();
    } else {
      alert("Hubo un error al guardar el cliente");
    }
  };

  // Resto del componente omitido por brevedad...
}