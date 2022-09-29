import { product } from "./route/product";
import express from "express";

const app = express();
app.use(express.json());
app.use("/product", product);
app.get("/", async (req, res) => {
  res.send("hello");
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("Server is running on port ", port);
});
