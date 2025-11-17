import React from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider 
      router={router} 
      future={{ 
        v7_startTransition: true, 
        v7_relativeSplatPath: true 
      }} 
    />
  </React.StrictMode>
)
