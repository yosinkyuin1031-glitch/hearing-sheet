'use client'

import { useState, useEffect } from 'react'
import { HearingFormData, HearingQuestion } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import VoiceInput from './VoiceInput'

interface Props {
  data: HearingFormData
  onChange: (data: Partial<HearingFormData>) => void
  onNext: () => void
  onBack: () => void
}

export default function Step4DetailedHearing({ data, onChange, onNext, onBack }: Props) {
  const [questions, setQuestions] = useState<HearingQuestion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadQuestions()
  }, [])

  async function loadQuestions() {
    const { data: qData } = await supabase
      .from('hearing_questions')
      .select('*')
      .eq('step', 3)
      .order('sort_order')
    setQuestions((qData as HearingQuestion[]) || [])
    setLoading(false)
  }

  const updateAnswer = (key: string, value: string) => {
    onChange({
      detailedAnswers: { ...data.detailedAnswers, [key]: value },
    })
  }

  const requiredKeys = questions.filter((q) => q.is_required).map((q) => q.question_key)
  const canProceed = requiredKeys.every((key) => data.detailedAnswers[key]?.trim())

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="animate-fade-in space-y-6 px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">もう少し詳しく教えてください</h2>
        <p className="text-gray-500 mt-2 text-sm">
          音声入力もご利用いただけます（マイクボタン）
        </p>
      </div>

      <div className="space-y-6">
        {questions.map((q) => (
          <div key={q.id}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {q.question_text}
              {q.is_required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {q.question_type === 'textarea' ? (
              <VoiceInput
                value={data.detailedAnswers[q.question_key] || ''}
                onChange={(v) => updateAnswer(q.question_key, v)}
                placeholder="こちらに入力、または音声入力..."
                rows={3}
              />
            ) : q.question_type === 'select' ? (
              <select
                value={data.detailedAnswers[q.question_key] || ''}
                onChange={(e) => updateAnswer(q.question_key, e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">選択してください</option>
                {(q.options || []).map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={data.detailedAnswers[q.question_key] || ''}
                onChange={(e) => updateAnswer(q.question_key, e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
        ))}
      </div>

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
          確認画面へ
        </button>
      </div>
    </div>
  )
}
