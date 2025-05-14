// pages/api/whatsapp-webhook.js

import dbConnect from "../../lib/dbConnect";
import Client from "../../models/client";

export default async function handler(req, res) {
  // 🔐 VALIDACIÓN DEL WEBHOOK DE META
  if (req.method === "GET") {
    const VERIFY_TOKEN = "padbot123"; // Asegurate de usar el mismo que pusiste en Meta
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("✅ Webhook verificado");
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  }

  // 📩 MENSAJE RECIBIDO DESDE WHATSAPP
  if (req.method === "POST") {
    const entry = req.body?.entry?.[0];
    const message = entry?.changes?.[0]?.value?.messages?.[0];

    if (!message) return res.sendStatus(200); // Ping vacío, sin mensaje

    const numero = message.from;
    const texto = message.text?.body;

    console.log(`📲 Mensaje recibido de ${numero}: ${texto}`);

    // 📦 Buscar cliente en Mongo por número
    await dbConnect();
    const cliente = await Client.findOne({ phone: numero });

    if (!cliente) {
      console.log("❌ Cliente no encontrado");
      await responder(numero, "Gracias por tu mensaje. Un asistente humano se pondrá en contacto pronto.");
      return res.sendStatus(200);
    }

    // 🧠 Armar prompt personalizado
    const faqs = cliente.faqs || [];
    const prompt = `
Sos el asistente virtual del negocio de nombre "${cliente.name}". Tu tarea es responder preguntas de potenciales clientes.
Información general del negocio: ${cliente.info || ""}
Preguntas frecuentes:
${faqs.map((f, i) => `${i + 1}. ${f}`).join("\n")}

Respondé de forma breve, clara y profesional. Si no sabés la respuesta, indicá que un humano se pondrá en contacto.
Pregunta del usuario: ${texto}
    `;

    // 🤖 Consultar OpenAI
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
      const respuesta = json.choices?.[0]?.message?.content?.trim();

      if (!respuesta) throw new Error("OpenAI no devolvió respuesta válida");

      await responder(numero, respuesta);
      return res.sendStatus(200);

    } catch (err) {
      console.error("❌ Error al generar respuesta:", err);
      await responder(numero, "Hubo un error al generar la respuesta. Te responderemos pronto.");
      return res.sendStatus(500);
    }
  }

  // Si no es GET ni POST
  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

// 🚀 Enviar mensaje por WhatsApp
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
    Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
  };

  await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  });

  console.log("✅ Respuesta enviada a WhatsApp");
}
