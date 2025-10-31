import fetch from "node-fetch";

const QUESTION_COUNT = 10;

// ✅ Fallback questions in case Gemini fails
// backend/api/fallbackQuestions.js
export const fallbackQuestions = [
  {
    id: "q1",
    code: "<p>What does HTML stand for?</p>",
    options: [
      "Hyper Text Markup Language",
      "Home Tool Markup Language",
      "Hyperlinks and Text Markup Language",
      "Hyperlinking Text Mark Language"
    ],
    correctOption: 0
  },
  {
    id: "q2",
    code: "<p>Which tag is used to create a hyperlink?</p>",
    options: ["<a>", "<link>", "<href>", "<hyper>"],
    correctOption: 0
  },
  {
    id: "q3",
    code: "<p>What is the correct HTML element for inserting a line break?</p>",
    options: ["<br>", "<lb>", "<break>", "<hr>"],
    correctOption: 0
  },
  {
    id: "q4",
    code: "<p>Which CSS property controls the text color?</p>",
    options: ["color", "text-color", "font-color", "fgcolor"],
    correctOption: 0
  },
  {
    id: "q5",
    code: "<p>Which HTML attribute specifies an inline style?</p>",
    options: ["style", "class", "font", "styles"],
    correctOption: 0
  },
  {
    id: "q6",
    code: "<p>How do you write 'Hello World' in an alert box using JavaScript?</p>",
    options: [
      "alert('Hello World');",
      "msg('Hello World');",
      "alertBox('Hello World');",
      "msgBox('Hello World');"
    ],
    correctOption: 0
  },
  {
    id: "q7",
    code: "<p>How do you create a function in JavaScript?</p>",
    options: [
      "function myFunction() {}",
      "function:myFunction() {}",
      "create function myFunction() {}",
      "def myFunction() {}"
    ],
    correctOption: 0
  },
  {
    id: "q8",
    code: "<p>Which HTML tag is used to define an unordered list?</p>",
    options: ["<ul>", "<ol>", "<li>", "<list>"],
    correctOption: 0
  },
  {
    id: "q9",
    code: "<p>Which property is used to change the background color in CSS?</p>",
    options: ["background-color", "bgcolor", "color", "back-color"],
    correctOption: 0
  },
  {
    id: "q10",
    code: "<p>How do you write an IF statement in JavaScript?</p>",
    options: [
      "if (condition) {}",
      "if condition {}",
      "if: (condition) {}",
      "if = condition {}"
    ],
    correctOption: 0
  }
];

function cleanGeminiOutput(text) {
  return text.replace(/```json\s*([\s\S]*?)```/g, "$1").trim();
}

async function callGemini(category, difficulty, apiKey) {
  const prompt = `
Generate ${QUESTION_COUNT} quiz questions focused on identifying coding or syntax errors.
Each question should:
- Belong to the category: ${category}
- Contain a short code snippet (in that category)
- Include one logical, syntax, or runtime error
- Ask the user to identify what the error or output will be
- Use realistic beginner-to-intermediate examples
Difficulty level: ${difficulty}

Return a valid JSON array like this:
[
  {
    "id": "q1",
    "code": "<pre><code>const num = '5'; console.log(num + 5);</code></pre>",
    "question": "What happens when this code runs?",
    "options": [
      "It throws a TypeError",
      "It prints 55",
      "It prints 10",
      "It causes a syntax error"
    ],
    "correctOption": 1
  }
]

Rules:
- Always output pure JSON (no markdown, no explanations)
- Questions must match the category (e.g., HTML tag errors, CSS syntax mistakes, JS logic bugs)
- Keep questions clear and short
`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${text}`);
  }

  const data = await res.json();

  let rawText = "";
  if (data?.candidates?.[0]?.content?.parts) {
    rawText = data.candidates[0].content.parts.map((p) => p.text).join("\n");
  }

  rawText = cleanGeminiOutput(rawText);

  try {
    const questions = JSON.parse(rawText);
    if (!Array.isArray(questions) || questions.length !== QUESTION_COUNT)
      throw new Error("Invalid number of questions from Gemini");
    return questions;
  } catch (e) {
    throw new Error(
      "Failed to parse Gemini JSON: " +
        e.message +
        "\nRaw text snippet: " +
        rawText.slice(0, 200)
    );
  }
}

export async function handler(req, res) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Missing GEMINI_API_KEY" });

    const { category, difficulty } = req.body;

    if (!category || !difficulty)
      return res.status(400).json({ error: "Category and difficulty required" });

    console.log(`🧠 Calling Gemini for ${category} | Difficulty: ${difficulty}`);
    try {
      const questions = await callGemini(category, difficulty, apiKey);
      res.json({ questions });
    } catch (geminiError) {
      console.error("Gemini failed, using fallback questions:", geminiError.message);
      // Return fallback questions instead of error
      res.json({ questions: fallbackQuestions });
    }
  } catch (e) {
    console.error("Quiz handler error:", e);
    res.status(500).json({ error: e.message });
  }
}
