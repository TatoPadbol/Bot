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
      const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
      const industry = Array.isArray(fields.industry) ? fields.industry[0] : fields.industry;
      const country = Array.isArray(fields.country) ? fields.country[0] : fields.country;
      const phone = Array.isArray(fields.phone) ? fields.phone[0] : fields.phone;
      const info = Array.isArray(fields.info) ? fields.info[0] : fields.info;
      const url = Array.isArray(fields.url) ? fields.url[0] : fields.url;
      const pdfUrl = Array.isArray(fields.pdfUrl) ? fields.pdfUrl[0] : fields.pdfUrl;
      const phone_number_id = Array.isArray(fields.phone_number_id) ? fields.phone_number_id[0] : fields.phone_number_id;

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
          phone_number_id,
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