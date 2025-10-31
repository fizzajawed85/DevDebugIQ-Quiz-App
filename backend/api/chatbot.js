// backend/api/chatbot.js
import fetch from "node-fetch";

async function callGenerative(prompt, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const body = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
  };

  console.log("💬 Calling Gemini 2.0 API for hint...");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  console.log("🔍 Gemini raw response:", text);

  try {
    return JSON.parse(text);
  } catch (err) {
    console.warn("⚠️ Gemini returned non-JSON response, fallback used.");
    return null;
  }
}

export async function handler(req, res) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey)
      return res.status(500).json({ hint: "Missing GEMINI_API_KEY" });

    const { message, questionCode } = req.body || {};

    const prompt = `
You are a helpful quiz assistant named DevBot.
The user asked: "${message}"
Here is the question/code: """${questionCode || ""}"""
Give a **short hint (1–2 sentences)** to help the user find the answer.
Do NOT reveal the correct option or give a full solution.
`;

    const data = await callGenerative(prompt, apiKey);

    let hint = "Think about how the HTML element should be closed or used properly.";

    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      hint = data.candidates[0].content.parts[0].text;
    }

    res.json({ hint: String(hint).trim() });
  } catch (e) {
    console.error("❌ Error in chatbot handler:", e);
    res.status(500).json({ hint: "Hint service failed" });
  }
}
