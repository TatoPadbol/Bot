import dbConnect from "../../lib/dbConnect";
import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  await dbConnect();
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db("padbol");
    const collection = db.collection("clientes");
    await collection.insertOne(req.body);
    res.status(200).json({ message: "Guardado con éxito" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error guardando cliente" });
  } finally {
    await client.close();
  }
}
