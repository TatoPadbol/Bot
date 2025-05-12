import { buffer } from 'micro';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
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
    try {
      const rawBody = await buffer(req);
      const body = JSON.parse(rawBody.toString());

      console.log("✅ Webhook recibido:");
      console.log(JSON.stringify(body, null, 2));

      return res.status(200).send("EVENT_RECEIVED");
    } catch (error) {
      console.error("❌ Error procesando el webhook:", error);
      return res.status(500).send("Error interno");
    }
  }

  res.status(405).end();
}