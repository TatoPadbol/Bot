import cheerio from 'cheerio';
import connectDB from '../../lib/mongodb';
import Client from '../../models/client';

export default async function handler(req, res) {
  await connectDB();
  if (req.method === 'POST') {
    try {
      const { name, industry, country, phone, info, url } = req.body;
      const client = new Client({
        name,
        industry,
        country,
        phone,
        info,
        faqs
      });
      client.url = url;
      await client.save();
    if (url) {
      try {
        const response = await fetch(url);
        const html = await response.text();        const $ = cheerio.load(html);
        const text = $('body').text().replace(/\s+/g, ' ').trim();

        client.trainingData = client.trainingData || [];
        client.trainingData.push({
          filename: 'Contenido de la URL',
          content: text,
          uploadedAt: new Date()
        });

        await client.save();
      } catch (err) {
        console.error("Error al entrenar desde la URL:", err.message);
      }
    }

      res.status(201).json({ success: true });
    } catch (error) {
      console.error("Error en save-client:", error);
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).end();
  }
}