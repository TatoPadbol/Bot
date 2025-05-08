export default function Home() {
  return (
    <div style={{ padding: "2rem", fontFamily: "Arial", textAlign: "center" }}>
      <h1 style={{ fontSize: "2rem" }}>🤖 Bienvenido al sistema de bots Padbol</h1>
      <p>Accedé al panel de control para cargar nuevos clientes y entrenar a tu bot.</p>
      <a href="/admin" style={{
        display: "inline-block",
        marginTop: "1rem",
        padding: "10px 20px",
        backgroundColor: "#0070f3",
        color: "#fff",
        borderRadius: "8px",
        textDecoration: "none"
      }}>Ir al panel de administración</a>
    </div>
  );
}
