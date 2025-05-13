import connectDB from '../../lib/mongodb';
import Client from '../../models/client';

export default async function handler(req, res) {
  await connectDB();
  if (req.method === 'POST') {
    try {
      const { name, industry, country, phone, info, faqs } = req.body;
      const client = new Client({
        name,
        project: industry,
        country,
        whatsappNumber: phone,
        extra: info,
        question1: faqs[0] || "",
        question2: faqs[1] || "",
        question3: faqs[2] || "",
      });
      await client.save();
      res.status(201).json({ success: true });
    } catch (error) {
      console.error("Error en save-client:", error);
      res.status(400).json({ success: false, error });
    }
  } else {
    res.status(405).end();
  }
}