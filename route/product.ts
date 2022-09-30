import { client } from "./../functions/dbConnect";
import { Router } from "express";
import fs from "fs";
import rimraf from "rimraf";

export const product = Router();

product.get("/", async (req, res) => {
  await client.connect();
  console.log("Database connected");
  const products = await client
    .db("product_management")
    .collection("products")
    .find()
    .toArray();
  res.json(products);
});
product.post("/add", async (req, res) => {
  await client.connect();
  console.log("database connected");
  if (req.method === "POST") {
    const database = client.db("product_management");
    const productCollection = database.collection("products");
    const data = req.body;
    const result = await productCollection.insertOne(data);
    res.json(result);
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
        `public/utils/images/${req.body.folder}/${req.files.image.name}`
      );
    });
    res.json({
      url: `public/utils/images/${req.body.folder}/${req.files.image.name}`,
    });
  } catch (e: any) {
    res.send(e.message);
  }
});

product.delete("/image", async (req, res) => {
  console.log(req.body);
  rimraf(`${req.body.url}`, async function (e) {
    if (e) {
      throw new Error("Error");
    } else res.status(200).json({ acknowledged: true, url: req.body.url });
  });
});
