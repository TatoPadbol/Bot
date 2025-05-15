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
        info});
      client.url = url;
      await client.save();
        console.log("✅ Guardado en trainingData para:", client.name);
    if (url) {
      console.log("✅ Intentando entrenar desde la URL:", url);
      try {
        const response = await fetch(url);
        const html = await response.text();        const $ = cheerio.load(html);
        const text = $('body').text().replace(/\s+/g, ' ').trim();
        console.log("✅ Contenido extraído:", text.slice(0, 200));

        client.trainingData = client.trainingData || [];
        client.trainingData.push({
          filename: 'Contenido de la URL',
          content: text,
          uploadedAt: new Date()
        });

        await client.save();
        console.log("✅ Guardado en trainingData para:", client.name);
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