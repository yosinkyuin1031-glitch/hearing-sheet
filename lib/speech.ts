'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */

export function startSpeechRecognition(
  onResult: (text: string) => void,
  onEnd?: () => void
): (() => void) | null {
  const w = window as any
  const SpeechRecognition = w.SpeechRecognition || w.webkitSpeechRecognition

  if (!SpeechRecognition) {
    alert('お使いのブラウザは音声入力に対応していません。Chrome をお使いください。')
    return null
  }

  const recognition = new SpeechRecognition()
  recognition.lang = 'ja-JP'
  recognition.continuous = true
  recognition.interimResults = true

  let finalTranscript = ''

  recognition.onresult = (event: any) => {
    let interim = ''
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript
      if (event.results[i].isFinal) {
        finalTranscript += transcript
      } else {
        interim += transcript
      }
    }
    onResult(finalTranscript + interim)
  }

  recognition.onerror = (event: any) => {
    console.error('Speech recognition error:', event.error)
    if (event.error !== 'no-speech') {
      onEnd?.()
    }
  }

  recognition.onend = () => {
    onEnd?.()
  }

  recognition.start()

  return () => {
    recognition.stop()
  }
}

export function isSpeechSupported(): boolean {
  if (typeof window === 'undefined') return false
  const w = window as any
  return !!(w.SpeechRecognition || w.webkitSpeechRecognition)
}
