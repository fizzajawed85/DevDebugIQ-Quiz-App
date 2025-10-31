import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function AnimatedButton({ to="/login", children }){
  const [broken, setBroken] = useState(false)
  const nav = useNavigate()
  function click(){ setBroken(true); setTimeout(()=>nav(to),700) }
  return (
    <div className="relative inline-block">
      <motion.button onClick={click} className={`px-10 py-3 rounded-2xl text-white bg-gradient-to-r from-[#0ea5e9] to-[#7c3aed] ${broken?'opacity-0 scale-90':''}`} whileTap={{scale:0.98}}>
        {children}
      </motion.button>
      {broken && <div className="absolute inset-0 flex pointer-events-none">
        {[...Array(12)].map((_,i)=> <div key={i} className="w-3 mx-0.5 bg-blue-400/80 h-full animate-fall" style={{animationDelay:`${i*0.03}s`}} />)}
      </div>}
    </div>
  )
}
