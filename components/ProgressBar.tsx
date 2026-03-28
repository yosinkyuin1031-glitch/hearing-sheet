'use client'

const STEPS = [
  { num: 1, label: '基本情報' },
  { num: 2, label: 'お困りごと' },
  { num: 3, label: 'アプリ選択' },
  { num: 4, label: '詳細入力' },
  { num: 5, label: '確認・送信' },
]

export default function ProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div className="w-full px-4 py-4">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        {STEPS.map((step, i) => (
          <div key={step.num} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  currentStep >= step.num
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {currentStep > step.num ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.num
                )}
              </div>
              <span className={`text-[9px] mt-1 whitespace-nowrap ${
                currentStep >= step.num ? 'text-blue-600 font-medium' : 'text-gray-400'
              }`}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 mt-[-12px] ${
                currentStep > step.num ? 'bg-blue-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
