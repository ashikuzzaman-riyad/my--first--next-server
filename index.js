const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
console.log(process.env);
app.use(cors());
app.use(express.json());

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
    const db = client.db("products");
    const productCollection = db.collection("product");

    app.get("/product", async (req, res) => {
      const result = await productCollection.find().toArray();
      console.log(result);
      res.send(result);
    });
    app.post("/product", async (req, res) => {
      const data = req.body;
      const result = await productCollection.insertOne(data);
      res.send(result);
    });
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const result = await productCollection.findOne({
        _id: new ObjectId(id),
      });
      res.json(result);
    });

    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });

    app.patch("/product/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;

      try {
        const query = { _id: new ObjectId(id) };
        const update = {
          $set: {
            name: data.name,
            description: data.description,
            price: data.price,
            image: data.image,
            badge: data.badge,
            rating: data.rating,
            reviews: data.reviews,
          },
        };

        const result = await productCollection.updateOne(query, update);
        res.json(result);
      } catch (err) {
        res.status(500).send({ error: "Update failed", details: err });
      }
    });

    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
