import React from 'react'
import ParticleBackground from '../components/ParticleBackground'
import AnimatedButton from '../components/AnimatedButton'

export default function GettingStarted(){
  return (
    <div className="min-h-screen relative">
      <ParticleBackground />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="bg-black/40 p-8 rounded-2xl text-center max-w-2xl">
          <h1 className="text-5xl font-bold text-white mb-3">DevDebugIQ</h1>
          <p className="text-slate-200 mb-6">Adaptive, AI-generated error-identification quizzes for programmers.</p>
          <AnimatedButton to="/login">Getting Started</AnimatedButton>
        </div>
      </div>
    </div>
  )
}
