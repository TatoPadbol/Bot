import dbConnect from "../../lib/dbConnect";
import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { cliente, pregunta } = req.body;
  if (!cliente || !pregunta) return res.status(400).json({ error: "Faltan datos" });

  await dbConnect();
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db("padbol");
    const data = await db.collection("clientes").findOne({ name: cliente });

    if (!data) return res.status(404).json({ error: "Cliente no encontrado" });

    const trainingChunks = (data.trainingData || []).map(entry => entry.content).filter(Boolean);
    const trainingText = trainingChunks.join("\n\n");

    const prompt = `
Sos el asistente virtual del negocio llamado "${cliente}". Tu tarea es responder preguntas de potenciales clientes.
Información entrenada:
${trainingText}

Respondé de forma breve, clara y profesional. Si no sabés la respuesta, indicá que un humano se pondrá en contacto.
Pregunta del usuario: ${pregunta}
`;

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: prompt }],
        temperature: 0.7
      })
    });

    const json = await openaiRes.json();
    const respuesta = json.choices?.[0]?.message?.content?.trim();
    if (!respuesta) throw new Error("No se recibió respuesta válida de OpenAI");

    res.status(200).json({ respuesta });

  } catch (err) {
    console.error("Error al responder:", err);
    res.status(500).json({ error: "Error al generar respuesta" });
  } finally {
    await client.close();
  }
}
