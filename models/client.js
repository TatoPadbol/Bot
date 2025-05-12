
import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  industry: { type: String },
  country: { type: String },
  phone: { type: String },
  info: { type: String },
  faqs: [String]
});

export default mongoose.models.Client || mongoose.model("Client", ClientSchema);
