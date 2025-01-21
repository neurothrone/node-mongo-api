require("dotenv").config();

const express = require("express");
const app = express();
const PORT = 3000;
app.use(express.json());

const mongoose = require("mongoose");
const Product = require("./models/product");

app.get(
  "/",
  (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
  }
);

app.post(
  "/blogs",
  (req, res) => {
    res.send("This is a post request.");
  }
);

app.get(
  "/api/products",
  async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (err) {
      res.status(500).json({message: err});
    }
  }
);

app.get(
  "/api/products/:id",
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({message: "Product not found"});
      }
      res.json(product);
    } catch (err) {
      res.status(500).json({message: err});
    }
  }
);

app.post(
  "/api/products",
  async (req, res) => {
    try {
      const product = await Product.create(req.body);
      res.status(201).json(product);
    } catch (err) {
      res.status(500).json({message: err});
    }
  }
);

app.put(
  "/api/products/:id",
  async (req, res) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true});
      if (!updatedProduct) {
        return res.status(404).json({message: "Product not found"});
      }
      res.json(updatedProduct);
    } catch (err) {
      res.status(500).json({message: err});
    }
  }
);


app.delete(
  "/api/products/:id",
  async (req, res) => {
    try {
      const {id} = req.params;
      const productToDelete = await Product.findByIdAndDelete(id);
      if (!productToDelete) {
        return res.status(404).json({message: "Product not found"});
      }
      res.status(204).end();
    } catch (err) {
      res.status(500).json({message: err});
    }
  }
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB!");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });