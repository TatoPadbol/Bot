// pages/api/save-client.js
import connectDB from '../../lib/mongodb';
import Client from '../../../models/client';

export default async function handler(req, res) {
  await connectDB();
  if (req.method === 'POST') {
    try {
      const { name, project, country, question1, question2, extra, whatsappNumber } = req.body;
      const client = new Client({ name, project, country, question1, question2, extra, whatsappNumber });
      await client.save();
      res.status(201).json({ success: true });
    } catch (error) {
      res.status(400).json({ success: false, error });
    }
  } else {
    res.status(405).end();
  }
}