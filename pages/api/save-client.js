
import formidable from 'formidable';
import { v2 as cloudinary } from 'cloudinary';
import * as cheerio from 'cheerio';
import connectDB from '../../lib/mongodb';
import Client from '../../models/client';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

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

  const form = new formidable.IncomingForm({ keepExtensions: true });

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
        url
      });

      if (files.pdf && files.pdf[0]) {
        const result = await cloudinary.uploader.upload(files.pdf[0].filepath, {
          resource_type: 'raw', folder: 'padbot-pdfs'
        });
        client.pdf = result.secure_url;
        console.log("✅ PDF subido a Cloudinary:", result.secure_url);
      }

      await client.save();
      console.log("✅ Cliente guardado:", client.name);

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
