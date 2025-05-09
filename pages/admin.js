export const dynamic = 'force-dynamic';

import { useState } from "react";
import countries from "@/lib/countries";

export default function AdminClient() {
  const [client, setClient] = useState({
    name: "",
    industry: "",
    country: "",
    phone: "",
    info: "",
    faqs: ["", "", ""],
  });

  const handleChange = (field, value) => {
    setClient({ ...client, [field]: value });
  };

  const handleFaqChange = (index, value) => {
    const newFaqs = [...client.faqs];
    newFaqs[index] = value;
    setClient({ ...client, faqs: newFaqs });
  };

  const handleSubmit = async () => {
    if (!/^\d{10,15}$/.test(client.phone)) {
      alert("Número de WhatsApp inválido. Debe contener entre 10 y 15 dígitos.");
      return;
    }
    const res = await fetch("/api/save-client", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(client),
    });
    if (res.ok) alert("Cliente guardado correctamente");
    else alert("Error al guardar");
  };

  return (
    <div className="form-container" style={{ maxWidth: 500, margin: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <h1 style={{ color: 'red', textAlign: 'center' }}>PRUEBA</h1>
      <input placeholder="Nombre del cliente" value={client.name} onChange={(e) => handleChange("name", e.target.value)} />
      <input placeholder="Rubro" value={client.industry} onChange={(e) => handleChange("industry", e.target.value)} />
      <select value={client.country} onChange={(e) => handleChange("country", e.target.value)}>
        <option value="">Selecciona un país</option>
        {countries.map((c) => (
          <option key={c.code} value={c.code}>{c.name}</option>
        ))}
      </select>
      <input placeholder="Número de WhatsApp (Ej: 5491123456789)" value={client.phone} onChange={(e) => handleChange("phone", e.target.value)} />
      <textarea placeholder="Información general del negocio" value={client.info} onChange={(e) => handleChange("info", e.target.value)} />
      {client.faqs.map((faq, idx) => (
        <textarea key={idx} placeholder={`Pregunta frecuente ${idx + 1}`} value={faq} onChange={(e) => handleFaqChange(idx, e.target.value)} />
      ))}
      <button onClick={handleSubmit}>Guardar cliente</button>
    </div>
  );
}
