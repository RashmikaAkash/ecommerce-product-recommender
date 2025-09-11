// backend/routes/productRoutes.js
import express from "express";
import Product from "../models/Product.js";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const router = express.Router();

// compute __dirname (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// uploads directory (backend/uploads)
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    // unique filename: timestamp + originalname
    const unique = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
    cb(null, unique);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB max

// Helper: clean and parse price from various inputs like "$100", "100,00", "100.00"
function parseAndRoundPrice(raw) {
  if (raw == null) return null;
  const str = String(raw).trim();
  if (str === "") return null;
  // keep digits, dot and minus
  let cleaned = str.replace(/[^0-9.\-]/g, "");
  // keep first dot only
  const parts = cleaned.split(".");
  if (parts.length > 2) cleaned = parts[0] + "." + parts.slice(1).join("");
  const num = Number(cleaned);
  if (Number.isNaN(num)) return NaN;
  // round to 2 decimals
  return Math.round(num * 100) / 100;
}

// Create (JSON)
router.post("/", async (req, res, next) => {
  try {
    const body = { ...req.body };

    // Defensive price parsing
    if (body.price != null) {
      const parsed = parseAndRoundPrice(body.price);
      if (Number.isNaN(parsed)) return res.status(400).json({ message: "Invalid price" });
      if (parsed == null) return res.status(400).json({ message: "Invalid price" });
      body.price = parsed;
    }

    // If tags/colors are strings, attempt to normalize common formats
    if (typeof body.tags === "string") {
      try {
        body.tags = body.tags.trim().startsWith("[") ? JSON.parse(body.tags) : body.tags.split(",").map(t => t.trim()).filter(Boolean);
      } catch {
        body.tags = body.tags.split(",").map(t => t.trim()).filter(Boolean);
      }
    }

    if (typeof body.colors === "string") {
      try {
        body.colors = body.colors.trim().startsWith("[") ? JSON.parse(body.colors) : body.colors.split(",").map(c => c.trim()).filter(Boolean);
      } catch {
        body.colors = body.colors.split(",").map(c => c.trim()).filter(Boolean);
      }
    }

    const product = new Product(body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

// Read all
router.get("/", async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const products = await Product.find().skip(skip).limit(Number(limit));
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// Read single
router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// Update — accepts multipart/form-data with optional field 'image'
router.put("/:id", upload.single("image"), async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });

    const existing = await Product.findById(id);
    if (!existing) return res.status(404).json({ message: "Product not found" });

    // Merge fields (req.body properties are strings if multipart)
    const updates = {};

    if (req.body.name != null) updates.name = req.body.name;
    if (req.body.price != null) {
      const parsed = parseAndRoundPrice(req.body.price);
      if (Number.isNaN(parsed)) return res.status(400).json({ message: "Invalid price" });
      updates.price = parsed;
    }
    if (req.body.category != null) updates.category = req.body.category;
    if (req.body.description != null) updates.description = req.body.description;

    // tags can come as JSON string or comma separated
    if (req.body.tags != null) {
      try {
        const maybe = req.body.tags;
        if (typeof maybe === "string" && maybe.trim().startsWith("[")) {
          updates.tags = JSON.parse(maybe);
        } else if (typeof maybe === "string") {
          updates.tags = maybe.split(",").map(t => t.trim()).filter(Boolean);
        } else {
          updates.tags = maybe;
        }
      } catch {
        updates.tags = String(req.body.tags).split(",").map((c) => c.trim()).filter(Boolean);
      }
    }

    // colors can come as JSON string or comma separated
    if (req.body.colors != null) {
      try {
        const maybe = req.body.colors;
        if (typeof maybe === "string" && maybe.trim().startsWith("[")) {
          updates.colors = JSON.parse(maybe);
        } else if (typeof maybe === "string") {
          updates.colors = maybe
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean);
        } else {
          updates.colors = maybe;
        }
      } catch {
        updates.colors = String(req.body.colors).split(",").map((c) => c.trim()).filter(Boolean);
      }
    }

    // handle uploaded image
    if (req.file) {
      // optionally delete previous image file if it's local (not implemented here)
      const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      updates.image = imageUrl;
    }

    // apply updates
    const updated = await Product.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Delete
router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    next(err);
  }
});

// Recommendations route
router.get("/:id/recommendations", async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });

    const product = await Product.findById(id).lean();
    if (!product) return res.status(404).json({ message: "Product not found" });

    const tags = product.tags || [];

    const recs = await Product.aggregate([
      { $match: { _id: { $ne: product._id } } },
      {
        $addFields: {
          priceDiff: { $abs: { $subtract: ["$price", product.price] } },
          tagMatchCount: { $size: { $setIntersection: ["$tags", tags] } },
          sameCategory: { $cond: [{ $eq: ["$category", product.category] }, 1, 0] }
        }
      },
      { $sort: { tagMatchCount: -1, sameCategory: -1, priceDiff: 1 } },
      { $limit: 5 }
    ]);

    res.json(recs);
  } catch (err) {
    next(err);
  }
});

export default router;
