
import dbConnect from '../../lib/dbConnect';
import Client from '../../models/client';
import formidable from 'formidable';
import fs from 'fs';
import pdfParse from 'pdf-parse';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error al procesar el archivo' });
    }

    const phone = fields.phone?.[0];
    const file = files.file?.[0];

    if (!phone || !file) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    try {
      const dataBuffer = fs.readFileSync(file.filepath);
      const parsed = await pdfParse(dataBuffer);

      await dbConnect();
      const client = await Client.findOne({ phone });

      if (!client) {
        return res.status(404).json({ message: 'Cliente no encontrado' });
      }

      client.trainingData.push({
        filename: file.originalFilename,
        content: parsed.text,
        uploadedAt: new Date()
      });

      await client.save();

      return res.status(200).json({ message: 'PDF procesado y guardado correctamente' });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al guardar el PDF' });
    }
  });
}
