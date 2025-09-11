import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json({ limit: "8mb" }));
app.use(express.urlencoded({ extended: true, limit: "8mb" }));

// Ensure uploads folder exists and serve it
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use("/uploads", express.static(uploadsDir));

// Simple ping route
app.get("/api/ping", (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// Mount API routes BEFORE static/catch-all
app.use("/api/products", productRoutes);

// If you serve client build from backend, keep existing logic
const clientBuildPath = path.join(__dirname, "client", "build");
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

// Central error handler
app.use((err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err);
  if (err.type === "entity.too.large" || err.status === 413) {
    return res.status(413).json({ message: "Payload too large" });
  }
  res.status(err.status || 500).json({ message: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 5000;
let server = null;

// Connect to MongoDB (no deprecated options)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });

// Listen for mongoose connection errors after initial connect
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// Graceful shutdown helper
const gracefulShutdown = async (signal) => {
  try {
    console.log(`${signal} received: closing HTTP server and MongoDB connection...`);
    if (server) {
      // stop accepting new connections
      server.close(() => console.log("HTTP server closed"));
    }

    // close mongoose connection
    await mongoose.connection.close(false);
    console.log("Mongoose connection closed");

    // give processes a moment to finish
    setTimeout(() => process.exit(0), 500);
  } catch (err) {
    console.error("Error during graceful shutdown:", err);
    process.exit(1);
  }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// Catch unhandled promise rejections and uncaught exceptions
process.on("unhandledRejection", (reason, p) => {
  console.error("Unhandled Rejection at:", p, "reason:", reason);
  // optionally: trigger graceful shutdown
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception thrown:", err);
  // it's unsafe to continue after an uncaught exception
  process.exit(1);
});

export default app;
