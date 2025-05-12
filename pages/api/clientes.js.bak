import dbConnect from "../../lib/dbConnect";
import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  await dbConnect();
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db("padbol");
  const collection = db.collection("clientes");

  if (req.method === "GET") {
    const clientes = await collection.find({}).toArray();
    res.json(clientes);
  }

  if (req.method === "DELETE") {
    const { nombre } = req.body;
    await collection.deleteOne({ nombre });
    res.status(200).end();
  }

  if (req.method === "PUT") {
    const { nombre, ...rest } = req.body;
    await collection.updateOne({ nombre }, { $set: { ...rest, nombre } });
    res.status(200).end();
  }

  await client.close();
}
