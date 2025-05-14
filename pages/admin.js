
import { useState } from "react";

export default function Admin() {
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [info, setInfo] = useState("");
  const [faqs, setFaqs] = useState(["", "", ""]);
  const [pdfFile, setPdfFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, industry, country, phone, info, faqs }),
    });

    if (res.ok) {
      alert("Cliente guardado");
      await uploadPdf(phone);
    } else {
      alert("Error al guardar");
    }
  };

  const uploadPdf = async (phone) => {
    if (!pdfFile || !phone) return;
    const formData = new FormData();
    formData.append("file", pdfFile);
    formData.append("phone", phone);

    await fetch("/api/upload-pdf", {
      method: "POST",
      body: formData,
    });
  };

  const updateFaq = (index, value) => {
    const newFaqs = [...faqs];
    newFaqs[index] = value;
    setFaqs(newFaqs);
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1 style={{ textAlign: "center", color: "red" }}>PADBOT</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Nombre del cliente" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Rubro" value={industry} onChange={(e) => setIndustry(e.target.value)} />
        <select value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="">Selecciona un país</option>
          <option value="AR">Argentina</option>
          <option value="ES">España</option>
          <option value="US">Estados Unidos</option>
        </select>
        <input placeholder="Número de WhatsApp" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <textarea placeholder="Información general del negocio" value={info} onChange={(e) => setInfo(e.target.value)} />
        {faqs.map((faq, idx) => (
          <textarea key={idx} placeholder={`Pregunta frecuente ${idx + 1}`} value={faq} onChange={(e) => updateFaq(idx, e.target.value)} />
        ))}
        <div>
          <label>Cargar archivo PDF</label>
          <input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files[0])} />
        </div>
        <button type="submit">Guardar cliente</button>
      </form>
      <a href="/edit-clients"><button>Editar clientes existentes</button></a>
    </div>
  );
}
