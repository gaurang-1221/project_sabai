import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

// POST /api/contact — send inquiry email to store owner
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Basic email format check
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false, // true for port 465, false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      replyTo: email,
      to: process.env.EMAIL_TO,
      subject: `[Shop Inquiry] ${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="margin-bottom: 4px; color: #111;">New inquiry from your store</h2>
          <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p style="margin-top: 16px;"><strong>Message:</strong></p>
          <p style="background: #f9f9f9; padding: 16px; border-radius: 8px; color: #444;">
            ${message.replace(/\n/g, "<br />")}
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="font-size: 12px; color: #999;">Sent from your store contact form</p>
        </div>
      `,
    });

    res.json({ message: "Message sent successfully" });
  } catch (err) {
    console.error("Email send error:", err.message);
    res.status(500).json({ message: "Failed to send message. Please try again." });
  }
});

export default router;