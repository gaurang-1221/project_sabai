import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import Product from "../models/Product.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ecommerce-products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1000, height: 1000, crop: "limit", quality: "auto" }],
  },
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching products" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching product" });
  }
});

router.post("/", protect, upload.array("images", 5), async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }
    const images = req.files?.map((f) => f.path) || [];
    const product = await Product.create({
      name, description,
      price: Number(price),
      category: category.toLowerCase().trim(),
      stock: Number(stock) || 0,
      images,
    });
    res.status(201).json(product);
  } catch (err) {
    console.error("Create product error:", err.message);
    res.status(500).json({ message: err.message || "Error creating product" });
  }
});

router.put("/:id", protect, upload.array("images", 5), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    const { name, description, price, category, stock, existingImages } = req.body;
    const kept = existingImages
      ? Array.isArray(existingImages) ? existingImages : [existingImages]
      : product.images;
    const newImages = req.files?.map((f) => f.path) || [];
    product.name        = name        ?? product.name;
    product.description = description ?? product.description;
    product.price       = price       !== undefined ? Number(price)  : product.price;
    product.category    = category    ? category.toLowerCase().trim() : product.category;
    product.stock       = stock       !== undefined ? Number(stock)  : product.stock;
    product.images      = [...kept, ...newImages];
    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error updating product" });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    for (const url of product.images) {
      try {
        const parts = url.split("/");
        const filename = parts[parts.length - 1].split(".")[0];
        const folder = parts[parts.length - 2];
        await cloudinary.uploader.destroy(`${folder}/${filename}`);
      } catch (_) {}
    }
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product" });
  }
});

export default router;