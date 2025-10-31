import React, { useContext } from 'react'
import { AppContext } from '../AppContext'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const { theme, setTheme } = useContext(AppContext)

  return (
    <button
      onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
      className="w-10 h-10 flex items-center justify-center 
                 rounded-full transition 
                 bg-black/5 dark:bg-white/10 
                 hover:bg-black/10 dark:hover:bg-white/20"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
