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
    // unique filename: timestamp + originalname (sanitized)
    const unique = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
    cb(null, unique);
  }
});

// only allow common image MIME types
function imageFileFilter(req, file, cb) {
  const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif", "image/svg+xml"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only image files are allowed (png, jpg, jpeg, webp, gif, svg)."), false);
}

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: imageFileFilter }); // 5MB max

function parseAndRoundPrice(raw) {
  if (raw == null) return null;
  const str = String(raw).trim();
  if (str === "") return null;

  // if both separators present, assume the right-most is decimal
  if (str.includes(",") && str.includes(".")) {
    if (str.lastIndexOf(",") > str.lastIndexOf(".")) {
      const cleaned = str.replace(/\./g, "").replace(",", ".");
      const n = Number(cleaned);
      return Number.isNaN(n) ? NaN : Math.round(n * 100) / 100;
    } else {
      const cleaned = str.replace(/,/g, "");
      const n = Number(cleaned);
      return Number.isNaN(n) ? NaN : Math.round(n * 100) / 100;
    }
  }

  // only commas -> if single comma treat as decimal, else remove commas
  if (str.includes(",") && !str.includes(".")) {
    const parts = str.split(",");
    if (parts.length === 2) {
      const cleaned = parts.join(".");
      const n = Number(cleaned);
      return Number.isNaN(n) ? NaN : Math.round(n * 100) / 100;
    } else {
      const cleaned = str.replace(/,/g, "");
      const n = Number(cleaned);
      return Number.isNaN(n) ? NaN : Math.round(n * 100) / 100;
    }
  }

  // fallback: keep digits, dot and minus, keep first dot only
  let cleaned = str.replace(/[^0-9.\-]/g, "");
  const parts = cleaned.split(".");
  if (parts.length > 2) cleaned = parts[0] + "." + parts.slice(1).join("");
  const num = Number(cleaned);
  if (Number.isNaN(num)) return NaN;
  return Math.round(num * 100) / 100;
}

// helper to delete local image file if it points to /uploads/*
async function deleteLocalImageIfExists(imageUrl) {
  if (!imageUrl) return;
  try {
    const urlObj = new URL(imageUrl);
    const pathname = urlObj.pathname; // e.g. /uploads/1634234-name.png
    if (!pathname.startsWith("/uploads/")) return;
    const filePath = path.join(__dirname, "..", pathname);
    if (fs.existsSync(filePath)) {
      try { fs.unlinkSync(filePath); } catch (e) { /* ignore unlink errors */ }
    }
  } catch (err) {
    // not a valid absolute URL — ignore
  }
}

// normalize array fields that may arrive as JSON string or comma-separated
function parseArrayField(maybe) {
  if (maybe == null) return undefined;
  if (Array.isArray(maybe)) return maybe;
  if (typeof maybe === "string") {
    const trimmed = maybe.trim();
    if (trimmed === "") return [];
    if (trimmed.startsWith("[")) {
      try { return JSON.parse(trimmed); } catch { /* fall through */ }
    }
    return trimmed.split(",").map(s => s.trim()).filter(Boolean);
  }
  // fallback: wrap single value
  return [String(maybe)];
}

// Create (JSON)
router.post("/", async (req, res, next) => {
  try {
    const body = { ...req.body };

    // Defensive price parsing
    if (body.price != null) {
      const parsed = parseAndRoundPrice(body.price);
      if (Number.isNaN(parsed) || parsed == null) return res.status(400).json({ message: "Invalid price" });
      body.price = parsed;
    }

    // Normalize tags/colors/sizes if passed as strings
    const tags = parseArrayField(body.tags);
    if (tags !== undefined) body.tags = tags;

    const colors = parseArrayField(body.colors);
    if (colors !== undefined) body.colors = colors;

    const sizes = parseArrayField(body.sizes);
    if (sizes !== undefined) body.sizes = sizes;

    const product = new Product(body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

// Read all (keeps original behavior: returns array)
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
      if (Number.isNaN(parsed) || parsed == null) return res.status(400).json({ message: "Invalid price" });
      updates.price = parsed;
    }
    if (req.body.category != null) updates.category = req.body.category;
    if (req.body.description != null) updates.description = req.body.description;

    // tags can come as JSON string or comma separated
    if (req.body.tags != null) {
      const maybe = req.body.tags;
      updates.tags = parseArrayField(maybe) ?? [];
    }

    // colors can come as JSON string or comma separated
    if (req.body.colors != null) {
      const maybe = req.body.colors;
      updates.colors = parseArrayField(maybe) ?? [];
    }

    // sizes can come as JSON string or comma separated
    if (req.body.sizes != null) {
      const maybe = req.body.sizes;
      updates.sizes = parseArrayField(maybe) ?? [];
    }

    // handle uploaded image
    if (req.file) {
      // delete previous local image if it was served from /uploads
      await deleteLocalImageIfExists(existing.image);
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

    // remove local image if present
    await deleteLocalImageIfExists(deleted.image);

    res.json({ message: "Product deleted" });
  } catch (err) {
    next(err);
  }
});

// Recommendations route (keeps existing logic)
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
