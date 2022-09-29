import { client } from "./../functions/dbConnect";
import { Router } from "express";
import fs from "fs";

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

product.post("/image", async (req, res) => {
  console.log("hello");
  if (req.method === "POST") {
    const image = req.body;
    if (/^data:image\/png;base64,/.test(image.image)) {
      var base64Data = image.image.replace(/^data:image\/png;base64,/, "");
    }
    if (/^data:image\/jpeg;base64,/.test(image.image)) {
      var base64Data = image.image.replace(/^data:image\/jpeg;base64,/, "");
    }
    const path = `public/utils/images/${image.folder}`;
    fs.mkdir(path, { recursive: true }, (error: any) => {
      if (error) {
        console.log(error);
      }
      fs.writeFile(
        `public/utils/images/${image.folder}/${image.id}.png`,
        base64Data,
        "base64",
        function (err: any) {
          if (err) console.log(err);
        }
      );
    });
    fs.writeFile(
      `public/utils/images/${image.folder}/${image.id}.png`,
      base64Data,
      "base64",
      function (err: any) {
        if (err) console.log(err);
      }
    );
    res.json({ url: `utils/images/${image.folder}/${image.id}.png` });
  }
});
