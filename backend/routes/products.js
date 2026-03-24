import express from "express";
import multer from "multer";
import path from "path";
import Product from "../models/Product.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer setup — store uploads in /uploads folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error("Only image files are allowed (jpeg, jpg, png, webp)"));
  },
});

// ─── Public Routes ────────────────────────────────────────────────────────────

// GET /api/products — get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching products" });
  }
});

// GET /api/products/:id — get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching product" });
  }
});

// ─── Admin Routes (protected) ─────────────────────────────────────────────────

// POST /api/products — create product (with optional image upload)
router.post("/", protect, upload.array("images", 5), async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // Build image URLs from uploaded files
    const images = req.files?.map(
      (f) => `${req.protocol}://${req.get("host")}/uploads/${f.filename}`
    ) || [];

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      category: category.toLowerCase().trim(),
      stock: Number(stock) || 0,
      images,
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error creating product" });
  }
});

// PUT /api/products/:id — update product
router.put("/:id", protect, upload.array("images", 5), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const { name, description, price, category, stock, existingImages } = req.body;

    // Merge kept existing images + newly uploaded ones
    const kept = existingImages
      ? Array.isArray(existingImages)
        ? existingImages
        : [existingImages]
      : product.images;

    const newImages = req.files?.map(
      (f) => `${req.protocol}://${req.get("host")}/uploads/${f.filename}`
    ) || [];

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price !== undefined ? Number(price) : product.price;
    product.category = category ? category.toLowerCase().trim() : product.category;
    product.stock = stock !== undefined ? Number(stock) : product.stock;
    product.images = [...kept, ...newImages];

    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error updating product" });
  }
});

// DELETE /api/products/:id — delete product
router.delete("/:id", protect, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product" });
  }
});

export default router;