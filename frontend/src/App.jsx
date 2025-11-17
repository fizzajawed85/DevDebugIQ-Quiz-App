import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import { AppContext } from './AppContext'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase/config'
import { Outlet } from 'react-router-dom'  // 🔹 Outlet

export default function App() {
  const [user, setUser] = useState(null)
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u))
    return unsub
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <AppContext.Provider value={{ user, setUser, theme, setTheme }}>
      <div className={`${theme === 'dark' ? 'bg-[#020416] text-white' : 'bg-white text-slate-900'} min-h-screen`}>
        <Navbar />         {/* Navbar har page par dikhega */}
        <Outlet />         {/* Child routes render */}
      </div>
    </AppContext.Provider>
  )
}
