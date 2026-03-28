'use client'

import { useState } from 'react'
import { HearingFormData, INDUSTRIES } from '@/lib/types'

interface Props {
  data: HearingFormData
  onChange: (data: Partial<HearingFormData>) => void
  onNext: () => void
}

function validateEmail(email: string): string | null {
  if (!email) return null
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email) ? null : 'メールアドレスの形式が正しくありません'
}

function validatePhone(phone: string): string | null {
  if (!phone) return null
  const cleaned = phone.replace(/[-\s]/g, '')
  const re = /^0\d{9,10}$/
  return re.test(cleaned) ? null : '電話番号の形式が正しくありません（例: 090-1234-5678）'
}

export default function Step1BasicInfo({ data, onChange, onNext }: Props) {
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const emailError = touched.email ? validateEmail(data.contactEmail) : null
  const phoneError = touched.phone ? validatePhone(data.contactPhone) : null
  const nameEmpty = touched.name && !data.contactName.trim()
  const industryEmpty = touched.industry && !data.industry

  const canProceed = data.contactName.trim() && data.industry && !emailError && !phoneError

  return (
    <div className="animate-fade-in space-y-6 px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">まずは基本情報を教えてください</h2>
        <p className="text-gray-500 mt-2 text-sm">お気軽にご入力ください</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
            お名前 <span className="text-red-500">*</span>
          </label>
          <input
            id="contactName"
            type="text"
            value={data.contactName}
            onChange={(e) => onChange({ contactName: e.target.value })}
            onBlur={() => setTouched((p) => ({ ...p, name: true }))}
            placeholder="山田 太郎"
            aria-label="お名前"
            aria-required="true"
            aria-invalid={nameEmpty || undefined}
            className={`w-full rounded-xl border px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              nameEmpty ? 'border-red-400' : 'border-gray-200'
            }`}
          />
          {nameEmpty && (
            <p className="text-red-500 text-xs mt-1">お名前を入力してください</p>
          )}
        </div>

        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
            会社名・院名
          </label>
          <input
            id="companyName"
            type="text"
            value={data.companyName}
            onChange={(e) => onChange({ companyName: e.target.value })}
            placeholder="○○整体院"
            aria-label="会社名・院名"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
            業種 <span className="text-red-500">*</span>
          </label>
          <select
            id="industry"
            value={data.industry}
            onChange={(e) => onChange({ industry: e.target.value })}
            onBlur={() => setTouched((p) => ({ ...p, industry: true }))}
            aria-label="業種を選択"
            aria-required="true"
            aria-invalid={industryEmpty || undefined}
            className={`w-full rounded-xl border px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
              industryEmpty ? 'border-red-400' : 'border-gray-200'
            }`}
          >
            <option value="">選択してください</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
          {industryEmpty && (
            <p className="text-red-500 text-xs mt-1">業種を選択してください</p>
          )}
        </div>

        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
          <input
            id="contactEmail"
            type="email"
            value={data.contactEmail}
            onChange={(e) => onChange({ contactEmail: e.target.value })}
            onBlur={() => setTouched((p) => ({ ...p, email: true }))}
            placeholder="example@mail.com"
            aria-label="メールアドレス"
            aria-invalid={!!emailError || undefined}
            className={`w-full rounded-xl border px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              emailError ? 'border-red-400' : 'border-gray-200'
            }`}
          />
          {emailError && (
            <p className="text-red-500 text-xs mt-1">{emailError}</p>
          )}
        </div>

        <div>
          <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">電話番号</label>
          <input
            id="contactPhone"
            type="tel"
            value={data.contactPhone}
            onChange={(e) => onChange({ contactPhone: e.target.value })}
            onBlur={() => setTouched((p) => ({ ...p, phone: true }))}
            placeholder="090-1234-5678"
            aria-label="電話番号"
            aria-invalid={!!phoneError || undefined}
            className={`w-full rounded-xl border px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              phoneError ? 'border-red-400' : 'border-gray-200'
            }`}
          />
          {phoneError && (
            <p className="text-red-500 text-xs mt-1">{phoneError}</p>
          )}
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!canProceed}
        aria-label="次のステップへ進む"
        className="w-full py-4 rounded-xl text-white font-bold text-lg transition-all disabled:bg-gray-300 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
      >
        次へ進む
      </button>
    </div>
  )
}
