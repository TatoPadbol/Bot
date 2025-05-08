import Link from "next/link";

export default function Home() {
  return (
    <div style={{
      padding: "2rem",
      fontFamily: "Arial, sans-serif",
      maxWidth: "600px",
      margin: "0 auto",
      textAlign: "center"
    }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>🚀 Bienvenido al panel de gestión PadbolBot</h1>
      <p style={{ marginBottom: "2rem" }}>Elegí qué querés hacer:</p>

      <Link href="/admin">
        <a style={btnStyle}>➕ Agregar cliente</a>
      </Link>

      <Link href="/admin-clients">
        <a style={btnStyle}>🛠️ Ver / Editar clientes</a>
      </Link>

      <Link href="/chat">
        <a style={btnStyle}>💬 Probar el bot</a>
      </Link>
    </div>
  );
}

const btnStyle = {
  display: "block",
  padding: "1rem",
  backgroundColor: "#0070f3",
  color: "#fff",
  borderRadius: "8px",
  textDecoration: "none",
  marginBottom: "1rem",
  fontSize: "16px",
  fontWeight: "bold"
};
