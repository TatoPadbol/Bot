import { useState } from "react";

export default function ChatTest() {
  const [cliente, setCliente] = useState("Juan");
  const [pregunta, setPregunta] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [loading, setLoading] = useState(false);

  const enviarPregunta = async () => {
    setLoading(true);
    setRespuesta("");
    try {
      const res = await fetch("/api/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ cliente, pregunta })
      });

      const data = await res.json();
      setRespuesta(data.respuesta || "No se pudo generar respuesta.");
    } catch (error) {
      console.error(error);
      setRespuesta("Error al conectar con el bot.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial", maxWidth: "600px", margin: "0 auto" }}>
      <h2>💬 Probar el Bot</h2>
      <input
        type="text"
        placeholder="Nombre del cliente"
        value={cliente}
        onChange={(e) => setCliente(e.target.value)}
        style={{ width: "100%", marginBottom: "10px", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
      />
      <textarea
        placeholder="Escribí tu pregunta..."
        value={pregunta}
        onChange={(e) => setPregunta(e.target.value)}
        style={{ width: "100%", height: "100px", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
      />
      <button
        onClick={enviarPregunta}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          borderRadius: "6px",
          border: "none",
          backgroundColor: "#0070f3",
          color: "white",
          cursor: "pointer",
          fontSize: "16px",
          width: "100%"
        }}
        disabled={loading}
      >
        {loading ? "Consultando..." : "Preguntar al bot"}
      </button>

      {respuesta && (
        <div style={{ marginTop: "20px", background: "#f4f4f4", padding: "1rem", borderRadius: "8px" }}>
          <strong>🤖 Respuesta del bot:</strong>
          <p>{respuesta}</p>
        </div>
      )}
    </div>
  );
}
