import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import "./firebase.js"; 

import * as quiz from "./api/quiz.js";
import * as chatbot from "./api/chatbot.js";
import * as otp from "./api/otp.js";
import * as verifyOtp from "./api/verify-otp.js";
import * as changePwd from "./api/changePassword.js";
import * as userStats from "./api/user-stats.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/api/quiz", (req, res) => {
  console.log("Quiz API called");
  return quiz.handler(req, res);
});
app.post("/api/chatbot", (req, res) => chatbot.handler(req, res));
app.post("/api/otp", (req, res) => otp.handler(req, res));
app.post("/api/verify-otp", (req, res) => verifyOtp.handler(req, res));
app.post("/api/changePassword", (req, res) => changePwd.handler(req, res));
app.get("/api/user-stats", (req, res) => userStats.handler(req, res));

// When deployed on Vercel we should export a request handler instead of
// starting a long-running server with app.listen. Vercel will invoke the
// exported function per request.
// Keep app.listen for local development when this file is run directly.
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`✅ Backend listening on port ${PORT}`));
}

// Export a handler compatible with serverless platforms (Vercel/@vercel/node)
export default function handler(req, res) {
  return app(req, res);
}
