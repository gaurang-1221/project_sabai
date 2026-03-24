import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";
import Product from "../models/Product.js";
import connectDB from "./Db.js";

const seed = async () => {
  await connectDB();

  // ── Admin user ──────────────────────────────────────────────────────────────
  const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (existing) {
    console.log(`ℹ️  Admin already exists: ${process.env.ADMIN_EMAIL}`);
  } else {
    await User.create({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    });
    console.log(`✅ Admin created: ${process.env.ADMIN_EMAIL}`);
  }

  // ── Sample products (only if DB is empty) ──────────────────────────────────
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany([
      {
        name: "Sample Product 1",
        description: "A great product to get you started.",
        price: 499,
        category: "general",
        stock: 20,
        images: [],
      },
      {
        name: "Sample Product 2",
        description: "Another excellent product for your store.",
        price: 999,
        category: "general",
        stock: 10,
        images: [],
      },
    ]);
    console.log("✅ Sample products inserted");
  } else {
    console.log(`ℹ️  Products already exist (${count} found) — skipping sample data`);
  }

  await mongoose.disconnect();
  console.log("🔌 Disconnected. Seed complete.");
  process.exit(0);
};

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});