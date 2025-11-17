import React from "react";
import { useNavigate } from "react-router-dom";
import ParticleBackground from "../components/ParticleBackground";
import { Grid, Codepen } from "lucide-react";

const categories = [
  "HTML",
  "CSS",
  "TypeScript",
  "JavaScript",
  "React",
  "Next.js",
  "Python",
  "Java",
  "C++",
  "Agentic AI",
];

export default function Categories() {
  const nav = useNavigate();

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden pt-24 bg-white dark:bg-[#010b18]">
      {/* 🔹 LEFT SECTION */}
      <div className="w-full md:w-1/2 relative hidden md:flex items-center justify-center">
        <ParticleBackground />
        <div className="relative z-10 flex items-center justify-start px-10">
          <div className="max-w-md text-black dark:text-white">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#7c3aed] flex items-center justify-center">
                <Codepen color="white" size={18} />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Quiz Categories</h1>
                <p className="text-sm text-slate-600 dark:text-white/70 mt-2">
                  10 categories — error identification quizzes. Adaptive
                  difficulty. 3 min/question.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-black/5 dark:bg-white/10">
                • Error Identification focus
              </div>
              <div className="p-3 rounded-lg bg-black/5 dark:bg-white/10">
                • 10 questions per quiz
              </div>
              <div className="p-3 rounded-lg bg-black/5 dark:bg-white/10">
                • DevBot hints (won’t reveal answers)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 RIGHT SECTION */}
      <div className="w-full md:w-1/2 px-6 md:px-8 flex flex-col justify-center">
        <div className="max-w-3xl mx-auto w-full">
          {/* Header text */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-800 dark:text-white">
              Pick a category
            </h2>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Choose & start
            </div>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {categories.map((cat) => (
              <div
                key={cat}
                onClick={() => nav(`/quiz/${encodeURIComponent(cat)}`)}
                className="cursor-pointer p-4 rounded-xl hover:scale-[1.02] transition transform 
                bg-black/5 dark:bg-[#031427] border border-transparent hover:border-slate-300 
                dark:hover:border-slate-600 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-white">
                      {cat}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      10 Qs • Error ID
                    </p>
                  </div>
                  <Grid size={20} className="text-slate-400 dark:text-slate-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🔹 MOBILE LEFT SECTION */}
      <div className="md:hidden relative flex flex-col items-center justify-center py-10 bg-white dark:bg-[#010b18]">
        <ParticleBackground />
        <div className="relative z-10 px-6 text-center text-black dark:text-white">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#7c3aed] flex items-center justify-center">
              <Codepen color="white" size={18} />
            </div>
            <h1 className="text-3xl font-bold">Quiz Categories</h1>
            <p className="text-sm text-slate-600 dark:text-white/70 max-w-sm mx-auto mt-2">
              10 categories — error identification quizzes. Adaptive difficulty.
              3 min/question.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
