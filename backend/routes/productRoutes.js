import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// Create
router.post("/", async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json(product);
});

// Read
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Update
router.put("/:id", async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Delete
router.delete("/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});


// Recommendation (rule-based)
router.get("/:id/recommendations", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Not Found" });

  const recommendations = await Product.find({
    _id: { $ne: product._id },
    $or: [
      { category: product.category },
      { price: { $gte: product.price - 5000, $lte: product.price + 5000 } },
      { tags: { $in: product.tags || [] } }
    ]
  }).limit(5);

  res.json(recommendations);
});


export default router;
