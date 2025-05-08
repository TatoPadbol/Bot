import { useState } from "react";

export default function AdminPanel() {
  const [cliente, setCliente] = useState({
    nombre: "",
    rubro: "",
    pais: "",
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
        setCliente({ nombre: "", rubro: "", pais: "", faq1: "", faq2: "", faq3: "" });
      } else {
        alert("Hubo un error al guardar.");
      }
    } catch (error) {
      console.error(error);
      alert("Error en la conexión.");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2>Panel de Administración</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="nombre" placeholder="Nombre del cliente" value={cliente.nombre} onChange={handleChange} /><br /><br />
        <input type="text" name="rubro" placeholder="Rubro" value={cliente.rubro} onChange={handleChange} /><br /><br />
        <input type="text" name="pais" placeholder="País" value={cliente.pais} onChange={handleChange} /><br /><br />
        <textarea name="faq1" placeholder="Pregunta frecuente 1" value={cliente.faq1} onChange={handleChange} /><br /><br />
        <textarea name="faq2" placeholder="Pregunta frecuente 2" value={cliente.faq2} onChange={handleChange} /><br /><br />
        <textarea name="faq3" placeholder="Pregunta frecuente 3" value={cliente.faq3} onChange={handleChange} /><br /><br />
        <button type="submit">Guardar cliente</button>
      </form>
    </div>
  );
}
