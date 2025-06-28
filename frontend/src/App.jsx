import React, { useEffect } from 'react'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Home from './pages/Home'
import { Routes, Route } from 'react-router-dom'
import Customise from './pages/Customise'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuthStore } from './store/auth.store'

const App = () => {
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/customize" element={<Customise />} />
      </Routes>
    </>
  )
}

export default App