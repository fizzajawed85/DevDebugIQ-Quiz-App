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

app.post("/api/quiz", (req, res) => quiz.handler(req, res));
app.post("/api/chatbot", (req, res) => chatbot.handler(req, res));
app.post("/api/otp", (req, res) => otp.handler(req, res));
app.post("/api/verify-otp", (req, res) => verifyOtp.handler(req, res));
app.post("/api/changePassword", (req, res) => changePwd.handler(req, res));
app.get("/api/user-stats", (req, res) => userStats.handler(req, res));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Backend listening on port ${PORT}`));
