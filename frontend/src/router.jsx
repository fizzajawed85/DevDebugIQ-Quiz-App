import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import GettingStarted from './pages/GettingStarted'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ResetPassword from './pages/ResetPassword'
import Categories from './pages/Categories'
import Quiz from './pages/Quiz'
import Result from './pages/Result'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,   // 🔹 App is layout
    children: [
      { index: true, element: <GettingStarted /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'reset-password', element: <ResetPassword /> },
      { path: 'categories', element: <Categories /> },
      { path: 'quiz/:category', element: <Quiz /> },
      { path: 'result', element: <Result /> },
      { path: 'profile', element: <Profile /> },
      { path: 'admin', element: <Dashboard /> },
    ],
  },
])

export default router
