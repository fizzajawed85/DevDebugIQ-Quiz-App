import React, { useContext, useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase/config'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../AppContext'
import { User } from 'lucide-react'

export default function ProfileMenu() {
  const { user } = useContext(AppContext)
  const [open, setOpen] = useState(false)
  const nav = useNavigate()

  async function logout() {
    await signOut(auth)
    nav('/')
    setOpen(false) // auto close on logout
  }

  function handleNav(path) {
    nav(path)
    setOpen(false) // auto close when navigating to new page
  }

  return (
    <div className="relative">
      {/* 🔹 Profile Icon Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-10 h-10 flex items-center justify-center 
                   rounded-full transition 
                   bg-black/5 dark:bg-white/10 
                   hover:bg-black/10 dark:hover:bg-white/20"
      >
        {user?.displayName?.[0]?.toUpperCase() || <User size={18} />}
      </button>

      {/* 🔹 Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#111827] text-black dark:text-white rounded-xl shadow-lg p-2 z-50 border border-black/5 dark:border-white/10">
          <button
            onClick={() => handleNav('/profile')}
            className="w-full text-left p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
          >
            Profile
          </button>
          <button
            onClick={() => handleNav('/admin')}
            className="w-full text-left p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
          >
            Dashboard
          </button>
          <div className="border-t border-black/10 dark:border-white/10 my-2" />
          <button
            onClick={logout}
            className="w-full text-left p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
