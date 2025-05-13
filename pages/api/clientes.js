import connectDB from '../../lib/mongodb';
import Client from '../../models/client';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    const clients = await Client.find({});
    res.status(200).json(clients);
  } else if (req.method === 'PUT') {
    const { name, ...rest } = req.body;
    const result = await Client.updateOne({ name }, { $set: rest });
    res.status(200).json({ success: true, result });
  } else {
    res.status(405).end();
  }
}