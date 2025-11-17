import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'

export default function Result() {
  const { state } = useLocation()
  const nav = useNavigate()
  const { result, questions } = state || {}
  if (!result) return <div className="p-8 text-slate-800 dark:text-white">No result found</div>

  const correctCount = result.answers.filter(a => a.isCorrect).length

  return (
    <div className="min-h-screen bg-white dark:bg-[#030712] transition-colors">
      {/* Fixed padding top ensures content never goes under navbar */}
      <div className="pt-28 pb-10">
        <div className="max-w-full lg:max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 🔹 Back button + Heading */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-2 text-slate-800 dark:text-white text-3xl font-bold">
              <CheckCircle2 size={28} className="text-blue-500 dark:text-blue-400" />
              Your Result
            </div>
            <button
              onClick={() => nav('/categories')}
              className="flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium"
            >
              <ArrowLeft size={16} /> Back to Categories
            </button>
          </div>

          {/* 🔹 Score */}
          <div className="mb-6 text-lg font-bold text-slate-800 dark:text-white">
            Score: {correctCount} / {questions.length}
          </div>

          {/* 🔹 Questions Review */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">Review Questions</h3>
            {questions.map((q) => {
              const ans = result.answers.find(a => a.qId === q.id)
              return (
                <div
                  key={q.id}
                  className="p-4 rounded-lg bg-black/5 dark:bg-white/10 transition-colors"
                >
                  <pre className="whitespace-pre-wrap p-3 rounded bg-black/5 dark:bg-white/10 text-sm overflow-x-auto">
                    <code>{q.code}</code>
                  </pre>
                  <p className="mt-2 text-slate-800 dark:text-white">
                    <strong>Correct:</strong> {q.options[q.correctOption]}
                  </p>
                  <p className="text-slate-800 dark:text-white">
                    <strong>Your answer:</strong>{' '}
                    {ans?.choice === null || ans?.choice === undefined ? 'No answer' : q.options[ans.choice]}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
