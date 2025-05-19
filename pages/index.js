
export default function Home() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      backgroundColor: "#f4f4f4",
      fontFamily: "sans-serif",
      padding: "20px",
      textAlign: "center"
    }}>
      <img src="/padbot-logo.png" alt="PadBot" style={{ width: "100px", marginBottom: "20px" }} />
      <h1 style={{ fontSize: "2em", color: "#000" }}>Bienvenido al panel de gestión <br /> <strong>PadBot</strong></h1>
      <p>Elegí qué querés hacer:</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px", width: "100%", maxWidth: "400px" }}>
        <a href="/admin" style={buttonStyle}>➕ Agregar cliente</a>
        <a href="/edit-clients" style={buttonStyle}>🛠️ Ver / Editar clientes</a>
        <a href="/chat" style={buttonStyle}>💬 Probar el bot</a>
      </div>
    </div>
  );
}

const buttonStyle = {
  backgroundColor: "#0070f3",
  color: "white",
  padding: "12px",
  borderRadius: "8px",
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: "16px",
  transition: "background 0.3s",
  textAlign: "center"
};
