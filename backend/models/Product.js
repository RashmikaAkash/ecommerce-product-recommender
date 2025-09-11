// backend/models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, index: true },
    tags: { type: [String], index: true, default: [] },
    colors: { type: [String], default: [] }, // used by frontend
    sizes: { type: [String], default: [] }, // added sizes
    description: { type: String, default: "" },
    image: { type: String, default: "" } // URL to hosted image (recommended)
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Friendly JSON output: id (string) instead of _id, drop __v
productSchema.method("toJSON", function () {
  const obj = this.toObject({ virtuals: true });
  obj.id = obj._id?.toString?.() ?? obj._id;
  delete obj._id;
  delete obj.__v;
  return obj;
});

productSchema.index({ name: "text", description: "text" });

export default mongoose.model("Product", productSchema);
