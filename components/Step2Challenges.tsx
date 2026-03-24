'use client'

import { HearingFormData, CHALLENGES } from '@/lib/types'
import VoiceInput from './VoiceInput'
import { useState } from 'react'

interface Props {
  data: HearingFormData
  onChange: (data: Partial<HearingFormData>) => void
  onNext: () => void
  onBack: () => void
}

export default function Step2Challenges({ data, onChange, onNext, onBack }: Props) {
  const [otherText, setOtherText] = useState('')

  const toggleChallenge = (id: string) => {
    const current = data.challenges || []
    const next = current.includes(id)
      ? current.filter((c) => c !== id)
      : [...current, id]
    onChange({ challenges: next })
  }

  const canProceed = data.challenges.length > 0

  return (
    <div className="animate-fade-in space-y-6 px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">どんなことにお困りですか？</h2>
        <p className="text-gray-500 mt-2 text-sm">当てはまるものをすべて選んでください</p>
      </div>

      <div className="space-y-3">
        {CHALLENGES.map((challenge) => {
          const selected = data.challenges.includes(challenge.id)
          return (
            <button
              key={challenge.id}
              onClick={() => toggleChallenge(challenge.id)}
              className={`w-full text-left px-4 py-4 rounded-xl border-2 transition-all ${
                selected
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-blue-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${
                  selected ? 'bg-blue-600 text-white' : 'border-2 border-gray-300'
                }`}>
                  {selected && (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-base">{challenge.label}</span>
              </div>
            </button>
          )
        })}
      </div>

      {data.challenges.includes('other') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            具体的に教えてください（音声入力OK）
          </label>
          <VoiceInput
            value={otherText}
            onChange={setOtherText}
            placeholder="困っていることを自由にお話しください..."
            rows={3}
          />
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-4 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-base hover:bg-gray-50"
        >
          戻る
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="flex-[2] py-4 rounded-xl text-white font-bold text-lg transition-all disabled:bg-gray-300 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
        >
          次へ進む
        </button>
      </div>
    </div>
  )
}
