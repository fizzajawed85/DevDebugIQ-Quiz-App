import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import ParticleBackground from '../components/ParticleBackground'
import { Mail, Lock } from 'lucide-react'

export default function ResetPassword() {
  const [email, setEmail] = useState('')
  const [step, setStep] = useState(1)
  const [code, setCode] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  async function sendOtp() {
    if (!email) return setMsg('Please enter email')
    setLoading(true)
    try {
      await axios.post('/api/otp', { email })
      setMsg('OTP sent to your email.')
      setStep(2)
    } catch (e) {
      setMsg('Unable to send OTP. Try again later.')
    } finally {
      setLoading(false)
    }
  }

  async function verify() {
    if (!code) return setMsg('Enter OTP code')
    setLoading(true)
    try {
      await axios.post('/api/verify-otp', { email, code })
      setMsg('Code verified. Enter new password.')
      setStep(3)
    } catch (e) {
      setMsg(e?.response?.data?.error || 'Invalid code')
    } finally {
      setLoading(false)
    }
  }

  async function changePwd() {
    if (!newPwd) return setMsg('Enter new password')
    setLoading(true)
    try {
      await axios.post('/api/change-password', { email, newPassword: newPwd })
      setMsg('Password changed. Redirecting to login...')
      setTimeout(() => nav('/login'), 900)
    } catch (e) {
      setMsg(e?.response?.data?.error || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative bg-gray-50 dark:bg-black">
      <ParticleBackground />
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-white/5 shadow-md border border-gray-300 dark:border-white/6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Lock size={18} /> Reset Password
          </h2>

          {msg && <div className="mb-3 text-sm text-gray-700 dark:text-slate-200">{msg}</div>}

          {step === 1 && (
            <>
              <label className="text-sm text-gray-600 dark:text-white/80 mb-2 block">
                Enter your account email
              </label>
              <div className="flex items-center gap-2 mb-4">
                <Mail size={18} className="text-gray-500 dark:text-white/70" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 p-2 rounded border border-gray-300 dark:border-white/10 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/50 bg-white dark:bg-transparent"
                />
              </div>
              <button
                onClick={sendOtp}
                disabled={loading}
                className="w-full py-2 rounded bg-gradient-to-r from-[#0ea5e9] to-[#7c3aed] text-white"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <label className="text-sm text-gray-600 dark:text-white/80 mb-2 block">
                Enter OTP sent to your email
              </label>
              <div className="flex items-center gap-2 mb-4">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="6-digit code"
                  className="flex-1 p-2 rounded border border-gray-300 dark:border-white/10 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/50 bg-white dark:bg-transparent"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={verify}
                  disabled={loading}
                  className="flex-1 py-2 rounded bg-gradient-to-r from-[#0ea5e9] to-[#7c3aed] text-white"
                >
                  Verify
                </button>
                <button
                  onClick={() => setStep(1)}
                  className="py-2 px-3 rounded border border-gray-300 dark:border-white/10 text-gray-600 dark:text-white/80"
                >
                  Back
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <label className="text-sm text-gray-600 dark:text-white/80 mb-2 block">
                Enter new password
              </label>
              <input
                type="password"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                placeholder="New password"
                className="w-full p-2 mb-4 rounded border border-gray-300 dark:border-white/10 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/50 bg-white dark:bg-transparent"
              />
              <button
                onClick={changePwd}
                disabled={loading}
                className="w-full py-2 rounded bg-gradient-to-r from-[#0ea5e9] to-[#7c3aed] text-white"
              >
                {loading ? 'Updating...' : 'Change Password'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
