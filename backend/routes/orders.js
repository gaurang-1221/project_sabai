import express from "express";
import Order from "../models/Order.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// ─── Public Routes ────────────────────────────────────────────────────────────

// POST /api/orders — place a new order
router.post("/", async (req, res) => {
  try {
    const { customer, shippingAddress, items, totalAmount } = req.body;

    if (!customer || !shippingAddress || !items?.length || totalAmount == null) {
      return res.status(400).json({ message: "Missing required order fields" });
    }

    const order = await Order.create({
      customer,
      shippingAddress,
      items,
      totalAmount,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error placing order" });
  }
});

// ─── Admin Routes (protected) ─────────────────────────────────────────────────

// GET /api/orders — get all orders (newest first)
router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

// GET /api/orders/:id — get single order
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Error fetching order" });
  }
});

// PUT /api/orders/:id/status — update order status
router.put("/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Error updating order status" });
  }
});

export default router;