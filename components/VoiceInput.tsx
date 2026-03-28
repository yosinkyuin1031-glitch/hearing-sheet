'use client'

import { useState, useCallback, useEffect } from 'react'
import { startSpeechRecognition, isSpeechSupported } from '@/lib/speech'
import { useToast } from '@/components/ui/Toast'

interface VoiceInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}

export default function VoiceInput({ value, onChange, placeholder, rows = 3 }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [supported, setSupported] = useState(false)
  const [stopFn, setStopFn] = useState<(() => void) | null>(null)
  const { showToast, ToastContainer } = useToast()

  useEffect(() => {
    setSupported(isSpeechSupported())
  }, [])

  const toggleListening = useCallback(() => {
    if (isListening && stopFn) {
      stopFn()
      setIsListening(false)
      setStopFn(null)
      return
    }

    const stop = startSpeechRecognition(
      (text) => onChange(text),
      () => {
        setIsListening(false)
        setStopFn(null)
      },
      (message) => {
        showToast(message, 'error', 5000)
      }
    )

    if (stop) {
      setIsListening(true)
      setStopFn(() => stop)
    }
  }, [isListening, stopFn, onChange, showToast])

  return (
    <div className="relative">
      <ToastContainer />
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        aria-label={placeholder || '入力フィールド'}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      />
      {supported && (
        <button
          type="button"
          onClick={toggleListening}
          aria-label={isListening ? '音声入力を停止' : '音声で入力'}
          className={`absolute right-3 top-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            isListening
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-600'
          }`}
          title={isListening ? '音声入力を停止' : '音声で入力'}
        >
          {isListening && (
            <span className="absolute inset-0 rounded-full bg-red-400 animate-pulse-ring" />
          )}
          <svg className="w-5 h-5 relative z-10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
        </button>
      )}
    </div>
  )
}
