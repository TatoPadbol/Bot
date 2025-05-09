// pages/api/whatsapp-webhook.js

export default function handler(req, res) {
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === "padbol123") {
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  }

  if (req.method === "POST") {
    console.log("✅ Webhook recibido");
    res.sendStatus(200);
  } else {
    res.status(405).end();
  }
}