import { IncomingForm } from "formidable";
import { send } from "micro";
import connectDB from "../../lib/mongodb";
import Client from "../../models/client";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    send(res, 405, "Method Not Allowed");
    return;
  }

  await connectDB();

  const form = new IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error al parsear el formulario:", err);
      send(res, 500, { success: false, error: "Error en el parseo del formulario" });
      return;
    }

    try {
      const clean = (val) => Array.isArray(val) ? val[0] : val;
      const name = clean(fields.name);
      const industry = clean(fields.industry);
      const country = clean(fields.country);
      const phone = clean(fields.phone);
      const info = clean(fields.info);
      const url = clean(fields.url);
      const pdfUrl = clean(fields.pdfUrl);
      const phone_number_id = clean(fields.phone_number_id);

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

      send(res, 200, { success: true, data: updated });
    } catch (error) {
      console.error("Error al guardar el cliente:", error);
      send(res, 500, { success: false, error: "Error al guardar el cliente" });
    }
  });
}