import { useEffect, useState } from "react";

export default function ClientesAdmin() {
  const [clientes, setClientes] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const fetchClientes = async () => {
    const res = await fetch("/api/clientes");
    const data = await res.json();
    setClientes(data);
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleDelete = async (nombre) => {
    if (confirm(`¿Seguro que querés borrar a ${nombre}?`)) {
      await fetch("/api/clientes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre })
      });
      fetchClientes();
    }
  };

  const handleEdit = (cliente) => {
    setEditing(cliente.nombre);
    setForm(cliente);
  };

  const handleSave = async () => {
    await fetch("/api/clientes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setEditing(null);
    fetchClientes();
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2>🗂️ Clientes registrados</h2>
      {clientes.map((c) => (
        <div key={c.nombre} style={{ border: "1px solid #ddd", padding: "1rem", marginBottom: "1rem", borderRadius: "6px" }}>
          {editing === c.nombre ? (
            <>
              <input name="nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
              <input name="rubro" value={form.rubro} onChange={e => setForm({ ...form, rubro: e.target.value })} />
              <input name="pais" value={form.pais} onChange={e => setForm({ ...form, pais: e.target.value })} />
              <textarea name="info" value={form.info} onChange={e => setForm({ ...form, info: e.target.value })} />
              <textarea name="faq1" value={form.faq1} onChange={e => setForm({ ...form, faq1: e.target.value })} />
              <textarea name="faq2" value={form.faq2} onChange={e => setForm({ ...form, faq2: e.target.value })} />
              <textarea name="faq3" value={form.faq3} onChange={e => setForm({ ...form, faq3: e.target.value })} />
              <button onClick={handleSave}>💾 Guardar</button>
              <button onClick={() => setEditing(null)}>❌ Cancelar</button>
            </>
          ) : (
            <>
              <strong>{c.nombre}</strong> ({c.rubro}, {c.pais})
              <p>{c.info}</p>
              <ul>
                <li>{c.faq1}</li>
                <li>{c.faq2}</li>
                <li>{c.faq3}</li>
              </ul>
              <button onClick={() => handleEdit(c)}>✏️ Editar</button>
              <button onClick={() => handleDelete(c.nombre)}>🗑️ Borrar</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
