import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";
import Product from "../models/Product.js";
import connectDB from "./db.js";

const seed = async () => {
  await connectDB();

  // ── Admin user ──────────────────────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.warn("⚠️  Skipping admin creation: ADMIN_EMAIL or ADMIN_PASSWORD not found in environment variables.");
  } else {
    let user = await User.findOne({ email: adminEmail });
    if (user) {
      console.log(`ℹ️  Admin already exists: ${adminEmail}. Updating password...`);
      user.password = adminPassword; // Pre-save hook will hash it
      await user.save();
      console.log(`✅ Admin password updated successfully.`);
    } else {
      await User.create({
        email: adminEmail,
        password: adminPassword,
      });
      console.log(`✅ Admin created: ${adminEmail}`);
    }
  }

  // ── Sample products (only if DB is empty) ──────────────────────────────────
  const count = await Product.countDocuments();
  if (count === 0) {
    console.log("🌱 Seeding new products...");
    await Product.insertMany([
      {
        name: "Sample Product 1",
        description: "A great product to get you started.",
        price: 499,
        category: "general",
        stock: 20,
        images: ["https://via.placeholder.com/400x400.png?text=Product+1"],
      },
      {
        name: "Sample Product 2",
        description: "Another excellent product for your store.",
        price: 999,
        category: "general",
        stock: 10,
        images: ["https://via.placeholder.com/400x400.png?text=Product+2"],
      },
    ]);
    console.log("✅ Sample products inserted");
  } else {
    console.log("ℹ️  Products already exist. Updating images for sample products...");
    await Product.updateOne(
      { name: "Sample Product 1" },
      { $set: { images: ["https://via.placeholder.com/400x400.png?text=Product+1"] } }
    );
    await Product.updateOne(
      { name: "Sample Product 2" },
      { $set: { images: ["https://via.placeholder.com/400x400.png?text=Product+2"] } }
    );
    console.log("✅ Sample product images updated");
  }

  await mongoose.disconnect();
  console.log("🔌 Disconnected. Seed complete.");
  process.exit(0);
};

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});