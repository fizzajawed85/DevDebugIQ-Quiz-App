// backend/api/verify-otp.js
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

// 🔹 Verify OTP handler
export async function handler(req, res) {
  try {
    const { email, code } = req.body || {};
    if (!email || !code)
      return res.status(400).json({ error: "email+code required" });

    const database = db.getDatabase();
    const snap = await db.get(db.ref(database, `otps/${encodeURIComponent(email)}`));

    if (!snap.exists()) return res.status(400).json({ error: "No OTP found" });

    const data = snap.val();

    if (data.expiresAt < Date.now())
      return res.status(400).json({ error: "Expired" });
    if (data.code !== code)
      return res.status(400).json({ error: "Invalid" });

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "verify failed" });
  }
}
