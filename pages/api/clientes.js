
import connectDB from '../../lib/mongodb';
import Client from '../../models/client';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    const clients = await Client.find({});
    return res.status(200).json(clients);
  }

  if (req.method === 'PUT') {
    const { phone, ...rest } = req.body;
    console.log("📬 Recibido en PUT:", { phone, ...rest });

    if (!phone) {
      console.warn("⚠️ Faltó el campo phone");
      return res.status(400).json({ success: false, error: "Falta el campo phone" });
    }

    try {
      const result = await Client.updateOne({ phone }, { $set: rest });
      console.log("💾 Resultado del update:", result);
      return res.status(200).json({ success: true, result });
    } catch (err) {
      console.error("❌ Error actualizando cliente:", err);
      return res.status(500).json({ success: false, error: "Error interno" });
    }
  }

  res.status(405).end();
}
