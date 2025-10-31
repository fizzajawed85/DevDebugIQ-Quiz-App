// backend/api/otp.js
// Sends OTP via nodemailer and stores it to Firebase Admin Realtime DB

import nodemailer from "nodemailer";
import admin from "firebase-admin";
import * as db from "firebase-admin/database";

// 🔹 Initialize Firebase Admin
if (!admin.apps.length) {
  if (process.env.FIREBASE_ADMIN_CREDENTIALS_JSON) {
    const cred = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS_JSON);
    admin.initializeApp({
      credential: admin.credential.cert(cred),
      databaseURL:
        process.env.FIREBASE_DATABASE_URL ||
        process.env.VITE_FIREBASE_DATABASE_URL,
    });
  } else {
    admin.initializeApp({
      databaseURL:
        process.env.FIREBASE_DATABASE_URL ||
        process.env.VITE_FIREBASE_DATABASE_URL,
    });
  }
}

// 🔹 Setup Nodemailer Transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587", 10),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// 🔹 API Handler
export async function handler(req, res) {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: "Email required" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Send OTP Email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "DevDebugIQ OTP",
      text: `Your OTP for DevDebugIQ is: ${code}. Valid for 10 minutes.`,
    });

    // Store OTP in Firebase Realtime DB
    const database = db.getDatabase();
    await db.set(db.ref(database, `otps/${encodeURIComponent(email)}`), {
      code,
      createdAt: Date.now(),
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 mins expiry
    });

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to send OTP" });
  }
}
