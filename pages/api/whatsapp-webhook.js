// pages/api/whatsapp-webhook.js

export default function handler(req, res) {
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

  if (!VERIFY_TOKEN) {
    console.error("WHATSAPP_VERIFY_TOKEN is not defined in environment variables.");
    return res.status(500).send("Server misconfiguration.");
  }

  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('WEBHOOK_VERIFIED');
        return res.status(200).send(challenge);
      } else {
        return res.sendStatus(403);
      }
    } else {
      return res.sendStatus(400);
    }
  }

  if (req.method === 'POST') {
    console.log('🔔 Webhook recibido:', JSON.stringify(req.body, null, 2));
    return res.sendStatus(200);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}