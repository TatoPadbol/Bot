import { useState } from "react";

export default function AdminPanel() {
  const [cliente, setCliente] = useState({
    nombre: "",
    rubro: "",
    pais: "",
    info: "",
    faq1: "",
    faq2: "",
    faq3: ""
  });

  const handleChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/save-client", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(cliente)
      });
      if (res.ok) {
        alert("Cliente guardado exitosamente.");
        setCliente({ nombre: "", rubro: "", pais: "", info: "", faq1: "", faq2: "", faq3: "" });
      } else {
        alert("Hubo un error al guardar.");
      }
    } catch (error) {
      console.error(error);
      alert("Error en la conexión.");
    }
  };

  return (
    <div style={{
      padding: "2rem",
      fontFamily: "Arial",
      background: "linear-gradient(145deg, #f2f2f2, #dcdcdc)",
      borderRadius: "12px",
      maxWidth: "600px",
      margin: "2rem auto",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
    }}>
      <h2 style={{ textAlign: "center", color: "#333" }}>📋 Panel de Administración</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="nombre" placeholder="🧑 Nombre del cliente" value={cliente.nombre} onChange={handleChange} style={inputStyle} />
        <input type="text" name="rubro" placeholder="🏷️ Rubro" value={cliente.rubro} onChange={handleChange} style={inputStyle} />
        <input type="text" name="pais" placeholder="🌍 País" value={cliente.pais} onChange={handleChange} style={inputStyle} />
        <textarea name="info" placeholder="📝 Información general del negocio" value={cliente.info} onChange={handleChange} style={textAreaStyle} />
        <textarea name="faq1" placeholder="❓ Pregunta frecuente 1" value={cliente.faq1} onChange={handleChange} style={textAreaStyle} />
        <textarea name="faq2" placeholder="❓ Pregunta frecuente 2" value={cliente.faq2} onChange={handleChange} style={textAreaStyle} />
        <textarea name="faq3" placeholder="❓ Pregunta frecuente 3" value={cliente.faq3} onChange={handleChange} style={textAreaStyle} />
        <button type="submit" style={buttonStyle}>💾 Guardar cliente</button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "14px"
};

const textAreaStyle = {
  ...inputStyle,
  minHeight: "60px"
};

const buttonStyle = {
  backgroundColor: "#0070f3",
  color: "#fff",
  border: "none",
  padding: "12px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px",
  width: "100%"
};
