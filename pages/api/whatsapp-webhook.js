import dbConnect from "../../lib/dbConnect";
import Client from "../../models/client";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("✅ Webhook verificado correctamente");
      return res.status(200).send(challenge);
    } else {
      return res.status(403).end();
    }
  }

  if (req.method === "POST") {
    const entry = req.body?.entry?.[0];
    const message = entry?.changes?.[0]?.value?.messages?.[0];

    if (!message) return res.status(200).end();

    const numeroRemitente = message.from;
    const texto = message.text?.body;

    let numeroNegocio = entry?.changes?.[0]?.value?.metadata?.display_phone_number || "";
    numeroNegocio = numeroNegocio.replace(/\D/g, "");

    console.log(`📲 Mensaje recibido de: ${numeroRemitente}`);
    console.log(`🏪 Número del negocio: ${numeroNegocio}`);
    console.log(`🗣️ Texto recibido: ${texto}`);

    await dbConnect();
    const cliente = await Client.findOne({ phone: numeroNegocio });

    if (!cliente) {
      console.log("❌ Cliente no encontrado en Mongo");
      await responder(numeroRemitente, "Gracias por tu mensaje. Un asistente humano se pondrá en contacto pronto.");
      return res.status(200).end();
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
      console.log("🧠 Enviando prompt a OpenAI...");
      console.log("📋 Prompt:", prompt);

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
      console.log("📦 Respuesta de OpenAI:", JSON.stringify(json));

      if (!openaiRes.ok) {
        console.error("🛑 Error de OpenAI:", json);
        throw new Error("Falla en respuesta de OpenAI");
      }

      const respuesta = json.choices?.[0]?.message?.content?.trim();

      if (!respuesta) throw new Error("OpenAI no devolvió texto");

      await responder(numeroRemitente, respuesta);
      return res.status(200).end();

    } catch (err) {
      console.error("❌ Error al procesar mensaje:", err);
      await responder(numeroRemitente, "Hubo un error técnico. Te responderemos pronto.");
      return res.status(500).end();
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

async function responder(to, mensaje) {
  console.log("👉 Enviando respuesta a:", to); // LOG CLAVE

  const url = `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`;

  const body = {
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body: mensaje }
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`
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
