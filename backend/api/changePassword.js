// backend/api/change-password.js
import admin from "firebase-admin";

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

// 🔹 Change Password Handler
export async function handler(req, res) {
  try {
    const { email, newPassword } = req.body || {};
    if (!email || !newPassword)
      return res
        .status(400)
        .json({ error: "email+newPassword required" });

    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().updateUser(user.uid, { password: newPassword });

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
