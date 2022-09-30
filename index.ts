import { product } from "./route/product";
import express from "express";
import cors from "cors";
const fileUpload = require("express-fileupload");

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(express.static("./"));
app.use("/product", product);

app.get("/", async (req, res) => {
  res.send("hello");
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("Server is running on port ", port);
});
