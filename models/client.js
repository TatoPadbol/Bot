import mongoose from 'mongoose';

const ClientSchema = new mongoose.Schema({
  url: { type: String },
  name: String,
  industry: String,
  country: String,
  phone: String,
  info: String,
  faqs: [String]
}, { collection: 'clientes' }); // 👈 Acá indicamos explícitamente el nombre de la colección

export default mongoose.models.Client || mongoose.model('Client', ClientSchema);
