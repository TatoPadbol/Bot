import dbConnect from "../../lib/dbConnect";
import Client from "../../models/client";

export default async function handler(req, res) {
  // 🔐 VALIDACIÓN DEL WEBHOOK DE META
  if (req.method === "GET") {
    const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("✅ Webhook verificado correctamente");
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  }

  // 📩 MENSAJE RECIBIDO DESDE WHATSAPP
  if (req.method === "POST") {
    const entry = req.body?.entry?.[0];
    const message = entry?.changes?.[0]?.value?.messages?.[0];

    if (!message) return res.sendStatus(200);

    const numero = message.from;
    const texto = message.text?.body;

    console.log(`📲 Mensaje recibido de ${numero}: ${texto}`);

    await dbConnect();
    const cliente = await Client.findOne({ phone: numero });

    if (!cliente) {
      console.log("❌ Cliente no encontrado");
      await responder(numero, "Gracias por tu mensaje. Un asistente humano se pondrá en contacto pronto.");
      return res.sendStatus(200);
    }

    const faqs = cliente.faqs || [];
    const prompt = `
Sos el asistente virtual del negocio de nombre "${cliente.name}". Tu tarea es responder preguntas de potenciales clientes.
Información general del negocio: ${cliente.info || ""}
Preguntas frecuentes:
${faqs.map((f, i) => `${i + 1}. ${f}`).join("\n")}

Respondé de forma breve, clara y profesional. Si no sabés la respuesta, indicá que un humano se pondrá en contacto.
Pregunta del usuario: ${texto}
    `;

    try {
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

      if (!openaiRes.ok) {
        console.error("🛑 Error de OpenAI:", json);
        throw new Error("Falla en respuesta de OpenAI");
      }

      const respuesta = json.choices?.[0]?.message?.content?.trim();

      if (!respuesta) throw new Error("OpenAI no devolvió texto");

      await responder(numero, respuesta);
      return res.sendStatus(200);

    } catch (err) {
      console.error("❌ Error al procesar mensaje:", err);
      await responder(numero, "Hubo un error técnico. Te respondemos en breve.");
      return res.sendStatus(500);
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

async function responder(to, mensaje) {
  const url = `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`;

  const body = {
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body: mensaje }
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` // ✅ ESTA ES LA CORRECCIÓN CLAVE
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("❌ Error al enviar mensaje a WhatsApp:", error);
    } else {
      console.log("✅ Respuesta enviada a WhatsApp");
    }
  } catch (err) {
    console.error("❌ Error al conectar con WhatsApp API:", err);
  }
}
