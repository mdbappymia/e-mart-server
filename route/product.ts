import { client } from "./../functions/dbConnect";
import { Router } from "express";
import fs from "fs";
import rimraf from "rimraf";

export const product = Router();

product.get("/", async (req, res) => {
  try {
    await client.connect();
    console.log("Database connected");
    const products = await client
      .db("product_management")
      .collection("products")
      .find()
      .toArray();
    res.json(products);
  } catch (e) {
    res.send(new Error("error"));
  }
});
product.post("/add", async (req, res) => {
  try {
    await client.connect();
    console.log("database connected");
    if (req.method === "POST") {
      const database = client.db("product_management");
      const productCollection = database.collection("products");
      const data = req.body;
      const result = await productCollection.insertOne(data);
      res.json(result);
    }
  } catch (err) {
    res.send(new Error("Error"));
  }
});

product.post("/image", async (req: any, res) => {
  try {
    const path = `public/utils/images/${req.body.folder}`;
    fs.mkdir(path, { recursive: true }, (error: any) => {
      if (error) {
        res.send(error.message);
      }
      req.files.image.mv(
        `public/utils/images/${req.body.folder}/${req.body.id}.jpg`
      );
    });
    res.json({
      url: `public/utils/images/${req.body.folder}/${req.body.id}.jpg`,
    });
  } catch (e: any) {
    res.send(e.message);
  }
});

product.delete("/image", async (req, res) => {
  try {
    rimraf(`${req.body.url}`, async function (e) {
      if (e) {
        throw new Error("Error");
      } else res.status(200).json({ acknowledged: true, url: req.body.url });
    });
  } catch (e) {
    res.send(new Error("Error"));
  }
});

product.get("/category", async (req, res) => {
  await client.connect();
  const category = await client
    .db("product_management")
    .collection("products")
    .distinct("category");
  res.send(category);
});
