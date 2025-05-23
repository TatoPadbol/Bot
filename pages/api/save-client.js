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
      const { name, industry, country, phone, info, url, pdfUrl, phone_number_id } = fields;

      const updated = await Client.findOneAndUpdate(
        { phone },
        {
          name,
          industry,
          country,
          phone,
          info,
          url,
          pdfUrl,
          phone_number_id
        },
        { upsert: true, new: true }
      );

      return res.status(200).json({ success: true, data: updated });
    } catch (error) {
      console.error('Error al guardar el cliente:', error);
      return res.status(500).json({ success: false, error: 'Error al guardar el cliente' });
    }
  });
}