
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

  const [phoneError, setPhoneError] = useState("");

  const handleChange = (field, value) => {
    if (field === "phone") {
      const isValid = /^\d{10,15}$/.test(value);
      setPhoneError(isValid ? "" : "Número inválido. Usa solo números, entre 10 y 15 dígitos.");
    }
    setClient({ ...client, [field]: value });
  };

  const handleFaqChange = (index, value) => {
    const newFaqs = [...client.faqs];
    newFaqs[index] = value;
    setClient({ ...client, faqs: newFaqs });
  };

  const handleSubmit = async () => {
    if (phoneError) {
      alert("Corrige el número de teléfono antes de guardar.");
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
    <div className="form-container">
      <input placeholder="Nombre del cliente" value={client.name} onChange={(e) => handleChange("name", e.target.value)} />
      <input placeholder="Rubro" value={client.industry} onChange={(e) => handleChange("industry", e.target.value)} />
      <select value={client.country} onChange={(e) => handleChange("country", e.target.value)}>
        <option value="">Selecciona un país</option>
        {countries.map((c) => (
          <option key={c.code} value={c.code}>{c.name}</option>
        ))}
      </select>
      <input placeholder="Número de WhatsApp (Ej: 5491123456789)" value={client.phone} onChange={(e) => handleChange("phone", e.target.value)} />
      {phoneError && <span style={{ color: "red", fontSize: "14px" }}>{phoneError}</span>}
      <textarea placeholder="Información general del negocio" value={client.info} onChange={(e) => handleChange("info", e.target.value)} />
      {client.faqs.map((faq, idx) => (
        <textarea key={idx} placeholder={`Pregunta frecuente ${idx + 1}`} value={faq} onChange={(e) => handleFaqChange(idx, e.target.value)} />
      ))}
      <button onClick={handleSubmit}>Guardar cliente</button>
    </div>
  );
}
