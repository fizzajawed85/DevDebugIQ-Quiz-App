import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Chatbot from "../components/Chatbot";
import { AppContext } from "../AppContext";
import { ref, set } from "firebase/database";
import { db } from "../firebase/config";
import { Clock } from "lucide-react";

export default function Quiz() {
  const { category } = useParams();
  const nav = useNavigate();
  const { user } = useContext(AppContext);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [difficulty, setDifficulty] = useState("medium");
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(180);
  const correctStreak = useRef(0);
  const wrongStreak = useRef(0);

  // ✅ Fetch quiz
  useEffect(() => {
    async function fetchQuiz() {
      setLoading(true);
      try {
        const res = await axios.post("/api/quiz", { category, difficulty });
        if (res.data.questions) setQuestions(res.data.questions);
        else setQuestions([]);
      } catch (e) {
        console.error("Failed to fetch quiz:", e.response?.data || e.message);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    }
    fetchQuiz();
  }, [category, difficulty]);

  // ✅ Timer logic
  useEffect(() => {
    setTimeLeft(180);
    const t = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          handleAnswer(null);
          return 180;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [index, questions]);

  // ✅ Handle answer
  async function handleAnswer(choiceIndex) {
    if (!questions.length) return;
    const q = questions[index];
    const isCorrect = choiceIndex === q.correctOption;
    const ansObj = {
      qId: q.id,
      choice: choiceIndex,
      isCorrect,
      timeTaken: 180 - timeLeft,
    };
    const updatedAnswers = [...answers, ansObj];
    setAnswers(updatedAnswers);

    if (isCorrect) {
      correctStreak.current += 1;
      wrongStreak.current = 0;
    } else {
      wrongStreak.current += 1;
      correctStreak.current = 0;
    }

    if (correctStreak.current >= 3) {
      setDifficulty("hard");
      correctStreak.current = 0;
    }
    if (wrongStreak.current >= 3) {
      setDifficulty("easy");
      wrongStreak.current = 0;
    }

    if (index + 1 >= questions.length) {
      const result = { answers: updatedAnswers, category, difficulty, createdAt: Date.now() };
      if (user) {
        await set(ref(db, `results/${user.uid}/${Date.now()}`), {
          result,
          user: { uid: user.uid, email: user.email, name: user.displayName },
        });
      }
      nav("/result", { state: { result, questions } });
    } else {
      setIndex((i) => i + 1);
    }
  }

  // ✅ Loading / No questions messages
  if (loading || !questions.length)
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="text-center text-slate-700 dark:text-white text-lg">
          {loading ? "Loading quiz..." : "No questions available"}
        </div>
      </div>
    );

  const q = questions[index];

  return (
    <div className="relative min-h-screen pt-28 pb-10 px-4 md:px-8 bg-white dark:bg-[#010b18]">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-wrap justify-between items-center gap-3">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
            Category : {category}
          </h2>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Clock size={16} />
            <div>
              {index + 1}/{questions.length} •{" "}
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
            </div>
          </div>
        </div>

        {/* Quiz layout */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left: Code block */}
          <div className="w-full md:flex-1 p-4 rounded-xl bg-black/5 dark:bg-white/10 border border-transparent overflow-auto max-h-[60vh]">
            <pre className="whitespace-pre-wrap text-sm text-slate-800 dark:text-slate-200">
              <code>{q.code}</code>
            </pre>
          </div>

          {/* Right: Options (short & scroll-free) */}
          <div className="w-full md:w-1/3 flex-shrink-0 flex flex-col gap-2">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className="w-full py-2 px-3 text-left rounded-lg
                  bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20
                  transition text-slate-800 dark:text-slate-100 text-sm"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chatbot pinned bottom-right */}
      <div className="fixed bottom-5 right-5 z-50">
        <Chatbot questionCode={q.code} />
      </div>
    </div>
  );
}
