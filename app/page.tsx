'use client'

import { useState } from 'react'
import { HearingFormData } from '@/lib/types'
import ProgressBar from '@/components/ProgressBar'
import Step1BasicInfo from '@/components/Step1BasicInfo'
import Step2Challenges from '@/components/Step2Challenges'
import Step3AppSelection from '@/components/Step3AppSelection'
import Step4DetailedHearing from '@/components/Step4DetailedHearing'
import Step5Confirm from '@/components/Step5Confirm'

const initialData: HearingFormData = {
  companyName: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  industry: '',
  challenges: [],
  selectedApps: [],
  similarAppNotes: '',
  detailedAnswers: {},
  referenceImages: [],
}

export default function HomePage() {
  const [step, setStep] = useState(0) // 0 = landing, 1-5 = steps
  const [formData, setFormData] = useState<HearingFormData>(initialData)

  const updateData = (partial: Partial<HearingFormData>) => {
    setFormData((prev) => ({ ...prev, ...partial }))
  }

  // ランディング画面
  if (step === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center max-w-md animate-fade-in">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            アプリ開発<br />ヒアリングシート
          </h1>
          <p className="text-gray-500 mb-2 text-base leading-relaxed">
            あなたのビジネスに最適なアプリをご提案します。
          </p>
          <p className="text-gray-400 text-sm mb-8">
            所要時間：約3〜5分 / 音声入力対応
          </p>

          <button
            onClick={() => setStep(1)}
            className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 active:scale-[0.98] transition-all shadow-md"
          >
            ヒアリングを始める
          </button>

          <p className="mt-6 text-xs text-gray-400">
            開発: 大口テック
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between px-4 py-3">
            <h1 className="font-bold text-gray-800 text-sm">アプリ開発ヒアリング</h1>
            <span className="text-xs text-gray-400">Step {step} / 5</span>
          </div>
          <ProgressBar currentStep={step} />
        </div>
      </div>

      {/* コンテンツ */}
      <div className="max-w-lg mx-auto pt-6">
        {step === 1 && (
          <Step1BasicInfo
            data={formData}
            onChange={updateData}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <Step2Challenges
            data={formData}
            onChange={updateData}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <Step3AppSelection
            data={formData}
            onChange={updateData}
            onNext={() => setStep(4)}
            onBack={() => setStep(2)}
          />
        )}
        {step === 4 && (
          <Step4DetailedHearing
            data={formData}
            onChange={updateData}
            onNext={() => setStep(5)}
            onBack={() => setStep(3)}
          />
        )}
        {step === 5 && (
          <Step5Confirm
            data={formData}
            onBack={() => setStep(4)}
          />
        )}
      </div>
    </div>
  )
}
