
import Link from "next/link";

export default function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <img
        src="https://res.cloudinary.com/dmin4ofkd/image/upload/v1747854259/Isologo-Padbol_-Primary_pazydf.png"
        alt="Padbol Logo"
        style={{ width: "100px", marginBottom: "20px" }}
      />
      <h1>Bienvenido al panel de gestión</h1>
      <h2>PadbolBot</h2>
      <p>Elegí qué querés hacer:</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "300px", margin: "40px auto" }}>
        <Link href="/add-client">
          <button style={{ padding: "10px", fontSize: "16px", cursor: "pointer" }}>➕ Agregar cliente</button>
        </Link>
        <Link href="/edit-clients">
          <button style={{ padding: "10px", fontSize: "16px", cursor: "pointer" }}>🛠️ Ver / Editar clientes</button>
        </Link>
        <Link href="/test-bot">
          <button style={{ padding: "10px", fontSize: "16px", cursor: "pointer" }}>💬 Probar el bot</button>
        </Link>
      </div>
    </div>
  );
}
