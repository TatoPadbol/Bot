
import formidable from 'formidable';
import { v2 as cloudinary } from 'cloudinary';
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
    console.log("⛔ Método no permitido");
    return res.status(405).end('Method Not Allowed');
  }

  const form = new formidable.IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    console.log("📥 Datos recibidos:", { fields, files });

    if (err) {
      console.error('❌ Error al parsear el formulario:', err);
      return res.status(500).json({ success: false, error: 'Error al parsear el formulario' });
    }

    const { phone } = fields;
    if (!phone || !files.file || !files.file[0]) {
      console.warn('⚠️ Faltan datos necesarios');
      return res.status(400).json({ success: false, error: 'Faltan datos: archivo o teléfono' });
    }

    try {
      console.log("📤 Subiendo PDF a Cloudinary...");
      const result = await cloudinary.uploader.upload(files.file[0].filepath, {
        resource_type: 'raw',
        folder: 'padbot-pdfs'
      });

      const client = await Client.findOne({ phone });
      if (!client) {
        console.warn("⚠️ Cliente no encontrado con teléfono:", phone);
        return res.status(404).json({ success: false, error: 'Cliente no encontrado' });
      }

      client.pdf = result.secure_url;
      await client.save();

      console.log("✅ PDF actualizado para:", client.name);
      return res.status(200).json({ success: true, url: result.secure_url });
    } catch (error) {
      console.error("❌ Error al subir PDF o guardar cliente:", error);
      return res.status(500).json({ success: false, error: 'Error al subir o guardar el PDF' });
    }
  });
}
