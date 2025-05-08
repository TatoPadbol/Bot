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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Cliente cargado:", cliente);
    alert("Cliente guardado (por ahora solo en consola)");
    // Acá después conectamos con la base de datos
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2>Panel de Administración</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="nombre" placeholder="Nombre del cliente" onChange={handleChange} /><br /><br />
        <input type="text" name="rubro" placeholder="Rubro" onChange={handleChange} /><br /><br />
        <input type="text" name="pais" placeholder="País" onChange={handleChange} /><br /><br />
        <textarea name="faq1" placeholder="Pregunta frecuente 1" onChange={handleChange} /><br /><br />
        <textarea name="faq2" placeholder="Pregunta frecuente 2" onChange={handleChange} /><br /><br />
        <textarea name="faq3" placeholder="Pregunta frecuente 3" onChange={handleChange} /><br /><br />
        <button type="submit">Guardar cliente</button>
      </form>
    </div>
  );
}
