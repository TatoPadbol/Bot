// pages/api/whatsapp-webhook.js

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
      return res.status(403).end();
    }
  }

  // 📩 MENSAJE RECIBIDO DESDE WHATSAPP
  if (req.method === "POST") {
    const entry = req.body?.entry?.[0];
    const message = entry?.changes?.[0]?.value?.messages?.[0];
    if (!message) return res.status(200).end();

    const numeroRemitente = message.from;               // quien manda el mensaje
    const texto = message.text?.body;                   // texto entrante
    let numeroNegocio = entry?.changes?.[0]?.value
                          ?.metadata?.display_phone_number || "";
    numeroNegocio = numeroNegocio.replace(/\D/g, "");   // normalizo sólo dígitos

    console.log(`📲 Recibido de ${numeroRemitente} hacia ${numeroNegocio}: ${texto}`);

    await dbConnect();
    const cliente = await Client.findOne({ phone: numeroNegocio });
    if (!cliente) {
      console.log("❌ Cliente (negocio) no encontrado");
      await responder(numeroRemitente,
        "Gracias por tu mensaje. Un asistente humano se pondrá en contacto pronto.");
      return res.status(200).end();
    }

    const faqs = cliente.faqs || [];
    const prompt = `
Sos el asistente virtual del negocio "${cliente.name}".
Información general: ${cliente.info || ""}
Preguntas frecuentes:
${faqs.map((f,i) => `${i+1}. ${f}`).join("\n")}

Respondé breve, clara y profesional. Si no sabés, decí que un humano atenderá.
Usuario preguntó: ${texto}
    `;

    try {
      console.log("🧠 Enviando prompt a OpenAI...");
      console.log("📋 Prompt:", prompt);

      const openaiRes = await fetch(
        "https://api.openai.com/v1/chat/completions", {
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
        console.error("🛑 OpenAI devolvió error:", json);
        throw new Error("Falla en respuesta de OpenAI");
      }

      const respuesta = json.choices?.[0]?.message?.content?.trim();
      if (!respuesta) throw new Error("OpenAI no devolvió texto");

      // Envío la respuesta
      await responder(numeroRemitente, respuesta);
      return res.status(200).end();

    } catch (err) {
      console.error("❌ Error al procesar mensaje:", err);
      await responder(numeroRemitente,
        "Hubo un error técnico. Te respondiremos en breve.");
      return res.status(500).end();
    }
  }

  // Métodos no permitidos
  res.setHeader("Allow", ["GET","POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

// 🚀 Función para enviar mensaje a WhatsApp
async function responder(to, mensaje) {
  // 🌟 Aseguro que el número tenga '+' al frente
  const destino = to.startsWith("+") ? to : `+${to}`;
  console.log("👉 Enviando respuesta a:", destino);

  const url = `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`;
  const body = {
    messaging_product: "whatsapp",
    to: destino,
    type: "text",
    text: { body: mensaje }
  };
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`
  };

  try {
    const resp = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    });
    if (!resp.ok) {
      const errText = await resp.text();
      console.error("❌ Error enviando a WhatsApp:", errText);
    } else {
      console.log("✅ Respuesta enviada a WhatsApp");
    }
  } catch (err) {
    console.error("❌ Error conectando con WhatsApp API:", err);
  }
}
