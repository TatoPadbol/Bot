
import { useState } from "react";

export default function Admin() {
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [info, setInfo] = useState("");
  const [url, setUrl] = useState("");
  const [numberId, setNumberId] = useState("");
  const [pdfFile, setPdfFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("industry", industry);
    formData.append("country", country);
    formData.append("phone", phone);
    formData.append("info", info);
    formData.append("url", url);
    formData.append("numberId", numberId);
    if (pdfFile) formData.append("pdf", pdfFile);

    const res = await fetch("/api/save-client", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    alert(data.message || "Cliente guardado");
  };

  return (
    <div className="admin-container">
      <h1 className="padbot-title">PadBot</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
        <input placeholder="Rubro" value={industry} onChange={(e) => setIndustry(e.target.value)} />
        <input placeholder="País" value={country} onChange={(e) => setCountry(e.target.value)} />
        <input placeholder="Teléfono" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <textarea placeholder="Info" value={info} onChange={(e) => setInfo(e.target.value)}></textarea>
        <input placeholder="URL" value={url} onChange={(e) => setUrl(e.target.value)} />
        <input placeholder="Number ID" value={numberId} onChange={(e) => setNumberId(e.target.value)} />
        <input type="file" onChange={(e) => setPdfFile(e.target.files[0])} />
        <button type="submit">Guardar cliente</button>
      </form>
    </div>
  );
}
