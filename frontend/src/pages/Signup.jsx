import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store.js'
import { Link } from 'react-router-dom'

const Signup = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const { signup, user, loading, err } = useAuthStore()

  useEffect(() => {
    if (user && !loading) {
      if (user.assistantName && user.assistantImage) {
        navigate("/")
      } else {
        navigate("/customize")
      }
    }
  }, [user, loading, navigate])

  const handleSignUp = async (e) => {
    e.preventDefault()
    const success = await signup(name, email, password)
    if (success) {
      navigate("/customize")
    }
  }

  if (loading) {
    return (
      <div className='w-full h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-4 border-cyan-400 border-t-transparent mx-auto mb-6 shadow-lg shadow-cyan-400/50'></div>
          <p className='text-cyan-400 text-xl font-mono'>INITIALIZING...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className='w-full h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden'>
        {/* Animated background elements */}
        <div className='absolute inset-0 opacity-20'>
          <div className='absolute top-20 left-20 w-2 h-2 bg-cyan-400 rounded-full animate-pulse'></div>
          <div className='absolute top-40 right-32 w-1 h-1 bg-purple-400 rounded-full animate-ping'></div>
          <div className='absolute bottom-32 left-1/4 w-3 h-3 bg-blue-400 rounded-full animate-bounce'></div>
          <div className='absolute bottom-20 right-20 w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
        </div>

        <div className='w-2/3 h-3/5 bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm flex flex-row rounded-2xl border border-cyan-400/30 shadow-2xl shadow-cyan-400/20'>
          <div className='w-1/2 text-center p-8 flex flex-col justify-center'>
            <h1 className='text-4xl font-bold mb-8 text-cyan-400 font-mono tracking-wider'>SYSTEM REGISTRATION</h1>
            <form className='flex flex-col items-center space-y-6' onSubmit={handleSignUp}>
              <div className='w-full max-w-xs'>
                <input
                  type="text"
                  placeholder='ENTER YOUR NAME'
                  className='w-full bg-slate-800/50 border-2 border-cyan-400/50 p-4 rounded-lg text-center text-lg font-mono text-cyan-400 placeholder-cyan-400/50 focus:outline-none focus:border-cyan-400 focus:bg-slate-800/70 transition-all duration-300'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className='w-full max-w-xs'>
                <input
                  type="email"
                  placeholder='ENTER YOUR EMAIL'
                  value={email}
                  className='w-full bg-slate-800/50 border-2 border-cyan-400/50 p-4 rounded-lg text-center text-lg font-mono text-cyan-400 placeholder-cyan-400/50 focus:outline-none focus:border-cyan-400 focus:bg-slate-800/70 transition-all duration-300'
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className='w-full max-w-xs'>
                <input
                  type="password"
                  value={password}
                  placeholder='ENTER YOUR PASSWORD'
                  className='w-full bg-slate-800/50 border-2 border-cyan-400/50 p-4 rounded-lg text-center text-lg font-mono text-cyan-400 placeholder-cyan-400/50 focus:outline-none focus:border-cyan-400 focus:bg-slate-800/70 transition-all duration-300'
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button className='w-full max-w-xs bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-4 px-6 rounded-lg font-bold text-xl font-mono tracking-wider hover:from-cyan-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-400/25'>
                CREATE ACCOUNT
              </button>

              {err && <p className='text-red-400 font-mono text-sm'>{err}</p>}
            </form>

            <div className='text-lg mt-8'>
              <p className='text-gray-300'>Already Have An Account? <Link to="/login"><span className='font-bold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer'>LOGIN</span></Link></p>
            </div>
          </div>
          <div className='w-1/2 h-auto overflow-hidden rounded-r-2xl'>
            <div className='w-full h-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center'>
              <div className='text-center'>
                <div className='w-32 h-32 mx-auto mb-6 relative'>
                  <div className='w-full h-full border-4 border-cyan-400 rounded-full animate-spin'></div>
                  <div className='absolute inset-2 border-4 border-purple-400 rounded-full animate-spin-slow'></div>
                  <div className='absolute inset-4 border-4 border-blue-400 rounded-full animate-pulse'></div>
                </div>
                <h2 className='text-cyan-400 text-2xl font-mono font-bold'>AI ASSISTANT</h2>
                <p className='text-gray-300 text-sm mt-2'>Voice-Enabled Intelligence</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Signup