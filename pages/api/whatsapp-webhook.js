import { MongoClient } from 'mongodb';
import OpenAI from 'openai';

const VERIFY_TOKEN = 'padbol123';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { 'hub.mode': mode, 'hub.verify_token': token, 'hub.challenge': challenge } = req.query;
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  }

  if (req.method === 'POST') {
    const data = req.body;

    // Validar estructura de mensaje entrante
    if (
      data.object === 'whatsapp_business_account' &&
      data.entry?.[0]?.changes?.[0]?.value?.messages?.[0]
    ) {
      const msg = data.entry[0].changes[0].value.messages[0];
      const phoneId = data.entry[0].changes[0].value.metadata.phone_number_id;
      const sender = msg.from;
      const messageText = msg.text?.body;

      console.log(`💬 Mensaje recibido de ${sender}: ${messageText}`);

      // Paso 1: Lógica con base de datos (opcional)
      let infoCliente = '';
      try {
        const client = await MongoClient.connect(process.env.MONGO_URI);
        const db = client.db(); // usa el default
        const cliente = await db.collection('clientes').findOne({ telefono: sender });
        infoCliente = cliente
          ? `El cliente se llama ${cliente.nombre} de ${cliente.ubicacion}. `
          : 'No encontré info previa del cliente. ';
        client.close();
      } catch (e) {
        console.log('❌ Error MongoDB:', e.message);
      }

      // Paso 2: Consulta a OpenAI
      let respuesta = 'Estamos procesando tu mensaje...';
      try {
        const chat = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `Sos un bot de Padbol. Respondé de forma útil y concreta. ${infoCliente}`,
            },
            {
              role: 'user',
              content: messageText,
            },
          ],
        });
        respuesta = chat.choices[0].message.content;
      } catch (e) {
        console.log('❌ Error GPT:', e.message);
      }

      // Paso 3: Responder vía WhatsApp Cloud API
      try {
        await fetch(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: sender,
            text: { body: respuesta },
          }),
        });
      } catch (e) {
        console.log('❌ Error al responder:', e.message);
      }

      return res.sendStatus(200);
    }

    res.sendStatus(200);
  }
}

