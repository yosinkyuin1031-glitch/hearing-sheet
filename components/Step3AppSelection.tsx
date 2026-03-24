'use client'

import { useState, useEffect } from 'react'
import { HearingFormData, PortfolioApp, APP_CATEGORIES } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import VoiceInput from './VoiceInput'

interface Props {
  data: HearingFormData
  onChange: (data: Partial<HearingFormData>) => void
  onNext: () => void
  onBack: () => void
}

export default function Step3AppSelection({ data, onChange, onNext, onBack }: Props) {
  const [apps, setApps] = useState<PortfolioApp[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  useEffect(() => {
    loadApps()
  }, [])

  async function loadApps() {
    const { data: appData } = await supabase
      .from('portfolio_apps')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
    setApps(appData || [])
    setLoading(false)
  }

  const toggleApp = (appName: string) => {
    const current = data.selectedApps || []
    const next = current.includes(appName)
      ? current.filter((a) => a !== appName)
      : [...current, appName]
    onChange({ selectedApps: next })
  }

  const categories = [...new Set(apps.map((a) => a.category))]
  const filteredApps = activeCategory
    ? apps.filter((a) => a.category === activeCategory)
    : apps

  const categoryIcons: Record<string, string> = {
    '顧客管理': '👥',
    '予約管理': '📅',
    '検査・評価': '📋',
    '集客・MEO': '📍',
    '問診・受付': '🏥',
    'Web制作': '🌐',
    '経営管理': '💰',
    '健康管理': '❤️',
    '販売': '🛒',
    '集客・CRM': '💬',
    '集客・広告': '📢',
    '人事・労務': '👔',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="animate-fade-in space-y-6 px-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">こんなアプリがあります</h2>
        <p className="text-gray-500 mt-2 text-sm">
          「これに近いものが欲しい」というアプリを選んでください
        </p>
      </div>

      {/* カテゴリフィルタ */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
            !activeCategory
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          すべて
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {categoryIcons[cat] || '📱'} {cat}
          </button>
        ))}
      </div>

      {/* アプリカード */}
      <div className="grid grid-cols-1 gap-3">
        {filteredApps.map((app) => {
          const selected = data.selectedApps.includes(app.name)
          return (
            <button
              key={app.id}
              onClick={() => toggleApp(app.name)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                selected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 mt-0.5 rounded-md flex items-center justify-center flex-shrink-0 ${
                  selected ? 'bg-blue-600 text-white' : 'border-2 border-gray-300'
                }`}>
                  {selected && (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{categoryIcons[app.category] || '📱'}</span>
                    <h3 className="font-bold text-gray-800">{app.name}</h3>
                  </div>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-gray-100 text-xs text-gray-500">
                    {app.category}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">{app.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {app.features?.slice(0, 4).map((f) => (
                      <span key={f} className="px-2 py-0.5 rounded-md bg-gray-50 text-xs text-gray-600 border border-gray-100">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* 補足コメント */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          補足・ご要望（音声入力OK）
        </label>
        <VoiceInput
          value={data.similarAppNotes}
          onChange={(v) => onChange({ similarAppNotes: v })}
          placeholder="「これとこれを組み合わせたい」「全然違うものが欲しい」など..."
          rows={3}
        />
      </div>

      {data.selectedApps.length > 0 && (
        <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
          <p className="text-sm text-blue-700 font-medium">
            選択中: {data.selectedApps.join('、')}
          </p>
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
          className="flex-[2] py-4 rounded-xl text-white font-bold text-lg transition-all bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
        >
          次へ進む
        </button>
      </div>
    </div>
  )
}
