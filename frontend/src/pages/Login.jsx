import React, { useState } from 'react'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '../firebase/config'
import { useNavigate } from 'react-router-dom'
import ParticleBackground from '../components/ParticleBackground'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const nav = useNavigate()

  // Email/password login
  async function submit(e) {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      nav('/categories')
    } catch (e) {
      setErr('Invalid credentials — redirecting to signup')
      setTimeout(() => nav('/signup'), 700)
    }
  }

  // Google login
  async function googleLogin() {
    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({
        prompt: 'select_account', // forces account chooser every time
      })
      const result = await signInWithPopup(auth, provider)
      nav('/categories')
    } catch (error) {
      console.error('Google login error:', error)
      setErr('Google sign-in failed')
    }
  }

  return (
    <div className="min-h-screen relative bg-gray-50 dark:bg-gray-900">
      <ParticleBackground />
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <form
          onSubmit={submit}
          className="w-full max-w-md p-6 rounded-xl bg-white/20 dark:bg-white/5 backdrop-blur-md border border-gray-300 dark:border-white/20 shadow-lg"
        >
          <h2 className="text-2xl mb-6 text-gray-900 dark:text-white text-center font-semibold">
            Login
          </h2>

          {err && <div className="mb-4 text-red-500 text-center">{err}</div>}

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full mb-4 p-3 rounded bg-white/50 dark:bg-white/10 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="w-full mb-4 p-3 rounded bg-white/50 dark:bg-white/10 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button className="w-full py-3 mb-4 bg-gradient-to-r from-[#0ea5e9] to-[#7c3aed] text-white rounded-lg transition">
            Login
          </button>

          <div className="flex justify-between text-sm text-gray-700 dark:text-white/70">
            <button
              type="button"
              onClick={googleLogin}
              className="underline hover:text-blue-500 transition"
            >
              Sign in with Google
            </button>
            <button
              type="button"
              onClick={() => nav('/reset-password')}
              className="underline hover:text-blue-500 transition"
            >
              Forgot?
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
