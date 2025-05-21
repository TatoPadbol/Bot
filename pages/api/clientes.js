
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
    if (!phone) {
      return res.status(400).json({ success: false, error: "Falta el campo phone" });
    }

    const result = await Client.updateOne({ phone }, { $set: rest });
    return res.status(200).json({ success: true, result });
  }

  res.status(405).end();
}
