const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.cymbxlh.mongodb.net/?appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    console.log("MongoDB connected");

    const db = client.db("products");
    const productCollection = db.collection("product");

    // Routes
    app.get("/product", async (req, res) => {
      try {
        const result = await productCollection.find().toArray();
        res.json(result);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.post("/product", async (req, res) => {
      try {
        const result = await productCollection.insertOne(req.body);
        res.json(result);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.get("/product/:id", async (req, res) => {
      try {
        const result = await productCollection.findOne({
          _id: new ObjectId(req.params.id),
        });
        res.json(result);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.delete("/product/:id", async (req, res) => {
      try {
        const result = await productCollection.deleteOne({
          _id: new ObjectId(req.params.id),
        });
        res.json(result);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.patch("/product/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const data = req.body;
        const result = await productCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: data }
        );
        res.json(result);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.get("/", (req, res) => res.send("Hello World!"));

    // Start server only after DB connect
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

  } catch (err) {
    console.error("Failed to connect DB", err);
  }
}

run();
