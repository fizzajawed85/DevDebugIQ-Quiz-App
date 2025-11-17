import React, { useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { ref, set } from 'firebase/database'
import { auth, db } from '../firebase/config'
import { useNavigate } from 'react-router-dom'
import ParticleBackground from '../components/ParticleBackground'

export default function Signup() {
  const [form, setForm] = useState({ first:'', last:'', email:'', phone:'', password:'', country:'', city:'', age:'', dob:'' })
  const [err, setErr] = useState('')
  const nav = useNavigate()

  async function submit(e) {
    e.preventDefault()
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password)
      await updateProfile(cred.user, { displayName: `${form.first} ${form.last}` })
      await set(ref(db, `users/${cred.user.uid}`), { ...form, createdAt: Date.now(), isAdmin:false })
      nav('/categories')
    } catch(e) { setErr(e.message) }
  }

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />
      <div className="relative z-10 flex items-center justify-center min-h-screen pt-24 px-4">
        <form 
          onSubmit={submit} 
          className="w-full max-w-lg p-6 rounded-xl
                     bg-white dark:bg-white/5 backdrop-blur
                     shadow-lg"
        >
          <h2 className="text-2xl mb-4 text-black dark:text-white text-center">Sign up</h2>
          {err && <div className="mb-2 text-red-400 text-center">{err}</div>}

          <div className="grid grid-cols-2 gap-3">
            <input placeholder="First" value={form.first} onChange={e=>setForm({...form, first:e.target.value})} 
                   className="p-2 rounded bg-gray-100 dark:bg-white/10 text-black dark:text-white" />
            <input placeholder="Last" value={form.last} onChange={e=>setForm({...form, last:e.target.value})} 
                   className="p-2 rounded bg-gray-100 dark:bg-white/10 text-black dark:text-white" />
          </div>

          <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} 
                 className="w-full mt-3 p-2 rounded bg-gray-100 dark:bg-white/10 text-black dark:text-white" />
          <input placeholder="Phone" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} 
                 className="w-full mt-3 p-2 rounded bg-gray-100 dark:bg-white/10 text-black dark:text-white" />
          <input placeholder="Password" value={form.password} type="password" onChange={e=>setForm({...form, password:e.target.value})} 
                 className="w-full mt-3 p-2 rounded bg-gray-100 dark:bg-white/10 text-black dark:text-white" />

          <div className="grid grid-cols-2 gap-3 mt-3">
            <input placeholder="Country" value={form.country} onChange={e=>setForm({...form, country:e.target.value})} 
                   className="p-2 rounded bg-gray-100 dark:bg-white/10 text-black dark:text-white" />
            <input placeholder="City" value={form.city} onChange={e=>setForm({...form, city:e.target.value})} 
                   className="p-2 rounded bg-gray-100 dark:bg-white/10 text-black dark:text-white" />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <input placeholder="Age" value={form.age} onChange={e=>setForm({...form, age:e.target.value})} 
                   className="p-2 rounded bg-gray-100 dark:bg-white/10 text-black dark:text-white" />
            <input type="date" value={form.dob} onChange={e=>setForm({...form, dob:e.target.value})} 
                   className="p-2 rounded bg-gray-100 dark:bg-white/10 text-black dark:text-white" />
          </div>

          <button className="mt-4 w-full py-2 bg-gradient-to-r from-[#0ea5e9] to-[#7c3aed] text-white rounded">
            Sign up
          </button>
        </form>
      </div>
    </div>
  )
}
