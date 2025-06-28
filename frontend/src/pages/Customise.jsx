import React, { useRef, useState } from 'react'
import { IoMdImages } from "react-icons/io";
import { useAuthStore } from '../store/auth.store';
import { useNavigate } from 'react-router-dom';

const Customise = () => {
  const [frontendImage, setFrontendImage] = useState(null)
  const [assistantName, setAssistantName] = useState('')
  const [loading, setLoading] = useState(false)
  const { updateAssistantDetails, err } = useAuthStore()
  const navigate = useNavigate()


  const handleChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setFrontendImage(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async () => {
    if (!assistantName.trim()) {
      alert('Please enter an assistant name')
      return
    }
    if (!frontendImage) {
      alert('Please select an image')
      return
    }

    setLoading(true)

    const file = inputImage.current.files[0]

    try {
      const success = await updateAssistantDetails(assistantName, file)
      if (success) {
        navigate('/')
      }
    } catch (error) {
      console.error('Error updating assistant details:', error)
    } finally {
      setLoading(false)
    }
  }

  const inputImage = useRef()

  return (
    <>
      <div className='w-full h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden'>

        <div className='absolute inset-0 opacity-20'>
          <div className='absolute top-20 left-20 w-2 h-2 bg-cyan-400 rounded-full animate-pulse'></div>
          <div className='absolute top-40 right-32 w-1 h-1 bg-purple-400 rounded-full animate-ping'></div>
          <div className='absolute bottom-32 left-1/4 w-3 h-3 bg-blue-400 rounded-full animate-bounce'></div>
          <div className='absolute bottom-20 right-20 w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
        </div>

        <div className='w-4/5 h-4/5 bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm rounded-2xl border border-cyan-400/30 shadow-2xl shadow-cyan-400/20 flex'>

          <div className='w-1/2 p-8 flex flex-col justify-center'>
            <h2 className='text-3xl font-bold text-center mb-8 text-cyan-400 font-mono tracking-wider'>CONFIGURE ASSISTANT</h2>

            {/* Status GIFs */}
            <div className='mb-6'>
              {loading ? (
                <div className='text-center'>
                  <p className='text-sm text-cyan-400 mt-2 font-mono'>PROCESSING...</p>
                </div>
              ) : (
                <div className='text-center'>
                </div>
              )}
            </div>

            <div className='mb-6'>
              <label className='block text-center text-sm font-medium text-cyan-400 mb-3 font-mono'>
                ASSISTANT NAME
              </label>
              <input
                type="text"
                value={assistantName}
                onChange={(e) => setAssistantName(e.target.value)}
                placeholder="ENTER ASSISTANT NAME"
                className='w-full bg-slate-800/50 border-2 border-cyan-400/50 p-4 rounded-lg text-center text-lg font-mono text-cyan-400 placeholder-cyan-400/50 focus:outline-none focus:border-cyan-400 focus:bg-slate-800/70 transition-all duration-300'
              />
            </div>

            <div className='mb-6'>
              <label className='block text-center text-sm font-medium text-cyan-400 mb-3 font-mono'>
                ASSISTANT IMAGE
              </label>
              <div
                className='w-48 h-48 border-2 border-dashed border-cyan-400/50 flex flex-col items-center justify-center cursor-pointer hover:border-cyan-400 hover:bg-slate-800/30 transition-all duration-300 mx-auto rounded-lg'
                onClick={() => inputImage.current.click()}
              >
                {!frontendImage ? (
                  <div className='text-center'>
                    <IoMdImages className='w-12 h-12 text-cyan-400 mx-auto mb-3' />
                    <p className='text-xs text-cyan-400 font-mono'>CLICK TO UPLOAD</p>
                  </div>
                ) : (
                  <img src={frontendImage} className='w-full h-full object-cover rounded-lg' alt="Assistant preview" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                ref={inputImage}
                hidden
                onChange={handleChange}
              />
            </div>

            {err && (
              <div className='mb-4 p-3 bg-red-900/50 border border-red-400 text-red-400 rounded-lg font-mono text-sm'>
                {err}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !assistantName.trim() || !frontendImage}
              className='w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-4 px-6 rounded-lg font-bold text-xl font-mono tracking-wider hover:from-cyan-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-400/25 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed disabled:transform-none'
            >
              {loading ? 'INITIALIZING...' : 'ACTIVATE ASSISTANT'}
            </button>
          </div>

          <div className='w-1/2 p-8 bg-gradient-to-br from-slate-700/50 to-slate-600/50 rounded-r-2xl border-l border-cyan-400/30'>
            <h3 className='text-6xl font-bold text-center mb-6 text-cyan-400 font-mono tracking-wider'>SETUP GUIDE</h3>

            <div className='space-y-6'>
              <div className='flex items-start space-x-4'>
              </div>

              <div className='flex items-start space-x-4'>
                <div className='w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm font-mono flex-shrink-0 mt-1'>
                  1
                </div>
                <div>
                  <h4 className='text-cyan-400 text-xl font-mono font-bold mb-2'>CONFIGURE ASSISTANT</h4>
                  <p className='text-gray-300 text-sm font-mono'>Set your assistant name and upload a profile image</p>
                </div>
              </div>

              <div className='flex items-start space-x-4'>
                <div className='w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm font-mono flex-shrink-0 mt-1'>
                  2
                </div>
                <div>
                  <h4 className='text-cyan-400 text-xl font-mono font-bold mb-2'>VOICE ACTIVATION</h4>
                  <p className='text-gray-300 text-sm font-mono'>Say your assistant's name followed by your command</p>
                  <div className='mt-2 p-3 bg-slate-800/50 rounded-lg border border-cyan-400/30'>
                    <p className='text-cyan-400 font-mono text-xs'>Example: "{assistantName || 'Assistant'}, what's the weather today?"</p>
                  </div>
                </div>
              </div>

              <div className='flex items-start space-x-4'>
                <div className='w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm font-mono flex-shrink-0 mt-1'>
                  3
                </div>
                <div>
                  <h4 className='text-cyan-400 text-xl font-mono font-bold mb-2'>ENJOY INTERACTION</h4>
                  <p className='text-gray-300 text-sm font-mono'>Your AI assistant will respond with voice and text</p>
                </div>
              </div>
            </div>

            <div className='mt-8 p-4 bg-cyan-900/20 border border-cyan-400/30 rounded-lg'>
              <h5 className='text-cyan-400 font-mono font-bold mb-2'>💡 TIP</h5>
              <p className='text-gray-300 text-sm font-mono'>Make sure your microphone is enabled and speak clearly for best results. Also Enable Popup Redirect To Other Sites. 
                <br></br> Sample Prompts: Search for Take you Forward in youtube, Search for 'Mahi Singh JSSATE' on chrome, Whats The Weather Today etc</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Customise
