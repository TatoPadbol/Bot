
export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

import formidable from 'formidable';
import connectDB from '../../lib/mongodb';
import Client from '../../models/client';

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const form = new formidable.IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields) => {
    if (err) {
      return res.status(500).json({ error: 'Error al parsear' });
    }

    try {
      const numberId = Array.isArray(fields.numberId) ? fields.numberId[0] : fields.numberId;

      const updated = await Client.findOneAndUpdate(
        { phone: fields.phone },
        {
          name: fields.name,
          industry: fields.industry,
          country: fields.country,
          phone: fields.phone,
          info: fields.info,
          url: fields.url,
          numberId: numberId
        },
        { upsert: true, new: true }
      );

      return res.status(200).json({ message: 'Cliente guardado correctamente', data: updated });
    } catch (error) {
      return res.status(500).json({ error: 'Error al guardar el cliente' });
    }
  });
}
