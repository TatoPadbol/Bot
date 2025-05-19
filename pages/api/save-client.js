
import fs from 'fs';
import path from 'path';
import formidable from 'formidable';
import * as cheerio from 'cheerio';
import connectDB from '../../lib/mongodb';
import Client from '../../models/client';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const form = new formidable.IncomingForm({
    uploadDir: path.join(process.cwd(), '/public/uploads'),
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error al parsear el formulario:', err);
      return res.status(500).json({ success: false, error: 'Error en el parseo del formulario' });
    }

    try {
      const { name, industry, country, phone, info, url } = fields;
      const client = new Client({
        name,
        industry,
        country,
        phone,
        info,
        url,
      });

      // Procesar PDF si fue subido
      if (files.pdf && files.pdf[0]) {
        const filePath = files.pdf[0].filepath;
        const fileName = path.basename(filePath);
        client.pdf = '/uploads/' + fileName;
        console.log("✅ PDF guardado en:", client.pdf);
      }

      await client.save();
      console.log("✅ Cliente guardado:", client.name);

      // Entrenamiento desde URL
      if (url) {
        try {
          const response = await fetch(url);
          const html = await response.text();
          const $ = cheerio.load(html);
          const text = $('body').text().replace(/\s+/g, ' ').trim();

          client.trainingData = client.trainingData || [];
          client.trainingData.push({
            filename: 'Contenido de la URL',
            content: text,
            uploadedAt: new Date(),
          });

          await client.save();
          console.log("✅ Contenido de URL entrenado para:", client.name);
        } catch (err) {
          console.error("Error al entrenar desde la URL:", err.message);
        }
      }

      res.status(201).json({ success: true });
    } catch (error) {
      console.error("Error en save-client:", error);
      res.status(400).json({ success: false, error: error.message });
    }
  });
}
