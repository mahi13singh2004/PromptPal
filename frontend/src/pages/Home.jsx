import React, { useEffect, useState, useRef } from 'react'
import { useAuthStore } from '../store/auth.store'
import { useNavigate } from 'react-router-dom'
import History from '../components/History'

const Home = () => {
  const { user, logout, loading, getGeminiResponse } = useAuthStore()
  const navigate = useNavigate()
  const [isRestarting, setIsRestarting] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [currentResponse, setCurrentResponse] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const recognitionRef = useRef(null)

  const handleEdit = () => {
    navigate('/customize')
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'hi-IN'

    // Pause speech recognition while speaking
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsSpeaking(true)
    }

    // Function to speak with Hindi voice
    const speakWithHindiVoice = () => {
      const voices = window.speechSynthesis.getVoices()
      const hindiVoice = voices.find(v => v.lang === 'hi-IN')

      if (hindiVoice) {
        utterance.voice = hindiVoice
        console.log('Using Hindi voice:', hindiVoice.name)
      } else {
        console.log('Hindi voice not found, using default')
      }

      window.speechSynthesis.speak(utterance)
    }

    // If voices are already loaded, speak immediately
    if (window.speechSynthesis.getVoices().length > 0) {
      speakWithHindiVoice()
    } else {
      // Wait for voices to load
      window.speechSynthesis.onvoiceschanged = speakWithHindiVoice
    }

    // Resume speech recognition after speaking
    utterance.onend = () => {
      setIsSpeaking(false)
      if (recognitionRef.current) {
        recognitionRef.current.start()
      }
    }
  }

  const handleCommand = (data) => {
    const { type, userInput, response } = data
    setCurrentResponse(response) // Display response on screen
    setIsGenerating(false) // Stop generating animation
    speak(response)

    if (type == 'google-search') {
      const query = encodeURIComponent(userInput)
      window.open(`https://www.google.com/search?q=${query}`, '_blank')
    }

    if (type == 'calculator-open') {
      window.open(`https://www.google.com/search?q=calculator`, '_blank')
    }

    if (type == 'weather-show') {
      window.open(`https://www.google.com/search?q=weather`, '_blank')
    }

    if (type == 'instagram-open') {
      window.open(`https://www.instagram.com/`, '_blank')
    }

    if (type == 'facebook-open') {
      window.open(`https://www.facebook.com/`, '_blank')
    }

    if (type == 'youtube-search' || type == 'youtube-play') {
      const query = encodeURIComponent(userInput)
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank')
    }
  }

  useEffect(() => {
    const startSpeechRecognition = () => {
      const speech = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new speech()
      recognition.continuous = true
      recognition.lang = 'en-US'

      recognition.onresult = async (e) => {
        // Don't process if assistant is speaking
        if (isSpeaking) {
          console.log('Assistant is speaking, ignoring input')
          return
        }

        const transcript = e.results[e.results.length - 1][0].transcript.trim()
        console.log(transcript)
        if (transcript.toLowerCase().includes(user.assistantName.toLowerCase())) {
          setIsGenerating(true) // Start generating animation
          const data = await getGeminiResponse(transcript)
          console.log(data)
          if (data && data.response) {
            handleCommand(data)
          } else {
            setIsGenerating(false) // Stop generating if no response
          }
        }
      }

      recognition.start()
      recognitionRef.current = recognition
      console.log('Speech recognition started/restarted')
    }

    // Start speech recognition
    startSpeechRecognition()

    // Restart every 20 seconds
    const interval = setInterval(() => {
      console.log('Restarting speech recognition...')
      setIsRestarting(true)

      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }

      startSpeechRecognition()

      setTimeout(() => {
        setIsRestarting(false)
      }, 2000)
    }, 30000)

    return () => {
      clearInterval(interval)
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  return (
    <div className='w-full h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden'>
      {/* Animated background elements */}
      <div className='absolute inset-0 opacity-20'>
        <div className='absolute top-20 left-20 w-2 h-2 bg-cyan-400 rounded-full animate-pulse'></div>
        <div className='absolute top-40 right-32 w-1 h-1 bg-purple-400 rounded-full animate-ping'></div>
        <div className='absolute bottom-32 left-1/4 w-3 h-3 bg-blue-400 rounded-full animate-bounce'></div>
        <div className='absolute bottom-20 right-20 w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
      </div>

      {/* Top Navigation */}
      <div className='absolute top-6 right-6 flex gap-4 z-10'>
        <button
          onClick={() => setIsHistoryOpen(true)}
          className='bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-cyan-400/25 font-mono font-bold tracking-wider'
        >
          HISTORY
        </button>
        <button
          onClick={handleEdit}
          className='bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-yellow-600 hover:to-orange-700 transition-all duration-300 shadow-lg shadow-yellow-400/25 font-mono font-bold tracking-wider'
        >
          EDIT
        </button>
        <button
          onClick={handleLogout}
          className='bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-red-400/25 font-mono font-bold tracking-wider'
          disabled={loading}
        >
          LOGOUT
        </button>
      </div>

      {isRestarting && (
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50'>
          <div className='bg-gradient-to-r from-red-500 to-pink-600 text-white px-8 py-4 rounded-lg font-bold text-2xl font-mono tracking-wider shadow-lg shadow-red-400/25'>
            RESTARTING
          </div>
        </div>
      )}

      {isSpeaking && (
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50'>
          <div className='bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-4 rounded-lg font-bold text-2xl font-mono tracking-wider shadow-lg shadow-blue-400/25'>
            SPEAKING
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className='w-4/5 h-4/5 bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm rounded-2xl border border-cyan-400/30 shadow-2xl shadow-cyan-400/20 flex'>
        {/* Left Side - Assistant Info */}
        <div className='w-1/2 p-8 flex flex-col justify-center items-center'>
          <h1 className='text-4xl font-bold mb-8 text-cyan-400 font-mono tracking-wider'>AI ASSISTANT</h1>
          {user && (
            <div className='text-center'>
              <div className='mb-8'>
                <h2 className='text-2xl font-semibold mb-6 text-gray-300 font-mono'>Hello! {user.name}</h2>
                {user.assistantImage && (
                  <img
                    src={user.assistantImage}
                    alt="Assistant"
                    className='w-48 h-48 rounded-full mx-auto mb-6 object-cover border-4 border-cyan-400/50 shadow-lg shadow-cyan-400/25'
                  />
                )}
                {user.assistantName && (
                  <p className='text-xl text-cyan-400 font-mono tracking-wider'>I am {user.assistantName}</p>
                )}
              </div>

              {/* Status GIFs */}
              <div className='mb-6'>
                {isGenerating && (
                  <div className='text-center'>
                    <img
                      src="https://i.pinimg.com/originals/19/e4/21/19e421ce92a12f4bfdc1171abb28486c.gif"
                      alt="Generating"
                      className='w-32 h-32 rounded-full mx-auto'
                    />
                    <p className='text-sm text-cyan-400 mt-2 font-mono'>GENERATING RESPONSE...</p>
                  </div>
                )}

                {!isGenerating && !isSpeaking && !isRestarting && (
                  <div className='text-center'>
                    <img
                      src="https://cdn.dribbble.com/userupload/42162783/file/original-35e74caf22ad148f3a80e7b776e610e1.gif"
                      alt="Listening"
                      className='w-32 rounded-full h-32 mx-auto'
                    />
                    <p className='text-sm text-cyan-400 mt-2 font-mono'>READY TO LISTEN</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Response Display */}
        <div className='w-1/2 p-8 bg-gradient-to-br from-slate-700/50 to-slate-600/50 rounded-r-2xl border-l border-cyan-400/30 flex flex-col justify-center'>
          <h3 className='text-3xl font-bold text-center mb-6 text-cyan-400 font-mono tracking-wider'>ASSISTANT RESPONSE</h3>

          {currentResponse ? (
            <div className='bg-slate-800/50 border border-cyan-400/30 rounded-lg p-6 h-64 overflow-y-auto'>
              <p className='text-gray-300 font-mono text-lg leading-relaxed'>{currentResponse}</p>
            </div>
          ) : (
            <div className='bg-slate-800/50 border border-cyan-400/30 rounded-lg p-6 h-64 flex items-center justify-center'>
              <div className='text-center'>
                <div className='w-16 h-16 border-4 border-cyan-400/50 rounded-full animate-pulse mx-auto mb-4'></div>
                <p className='text-cyan-400 font-mono text-lg'>Say "{user?.assistantName || 'Assistant'}" followed by your command</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* History Modal */}
      <History
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </div>
  )
}

export default Home