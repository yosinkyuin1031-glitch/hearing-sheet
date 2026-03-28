'use client'

import { useState, useEffect } from 'react'
import { HearingFormData, PortfolioApp } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import VoiceInput from './VoiceInput'

interface Props {
  data: HearingFormData
  onChange: (data: Partial<HearingFormData>) => void
  onNext: () => void
  onBack: () => void
}

const categoryIcons: Record<string, string> = {
  '顧客・患者管理': '👥',
  '予約・受付': '📅',
  '検査・診断ツール': '🔍',
  '無料診断・チェック': '✅',
  'サイト・LP制作': '🌐',
  '集客・マーケティング': '📈',
  'LINE・コミュニケーション': '💬',
  '経営・業務管理': '💰',
  '健康管理・患者向け': '❤️',
  'その他・便利ツール': '🛠️',
}

const categoryDescriptions: Record<string, string> = {
  '顧客・患者管理': '顧客情報・カルテ・会員管理',
  '予約・受付': '予約・問診・順番待ち',
  '検査・診断ツール': '検査・姿勢分析・スイング診断',
  '無料診断・チェック': '集客用の無料診断ページ',
  'サイト・LP制作': 'HP・LP・ECサイト・採用サイト',
  '集客・マーケティング': 'MEO・口コミ・SNS・広告',
  'LINE・コミュニケーション': 'LINE配信・予約・チャットボット',
  '経営・業務管理': '売上・シフト・レセプト・在庫',
  '健康管理・患者向け': '睡眠管理・セルフケア・施術提案',
  'その他・便利ツール': '動画編集・アンケート・請求書',
}

export default function Step3AppSelection({ data, onChange, onNext, onBack }: Props) {
  const [apps, setApps] = useState<PortfolioApp[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'category' | 'list'>('category')

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

  const selectedCount = data.selectedApps.length

  if (loading) {
    return (
      <div className="animate-fade-in space-y-5 px-4">
        <div className="text-center mb-4">
          <div className="h-8 w-56 bg-gray-200 rounded-lg mx-auto animate-pulse" />
          <div className="h-4 w-72 bg-gray-100 rounded mx-auto mt-3 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border-2 border-gray-100 bg-white p-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-20 bg-gray-200 rounded mb-1" />
              <div className="h-3 w-full bg-gray-100 rounded" />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-20 w-full bg-gray-100 rounded-xl animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in space-y-5 px-4">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          こんなものが作れます
        </h2>
        <p className="text-gray-500 mt-2 text-sm leading-relaxed">
          アプリ・サイト・診断ツールなど、<br />
          「これに近いものが欲しい」を選んでください
        </p>
      </div>

      {/* 表示切替 */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">全{apps.length}種類の制作実績</p>
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => { setViewMode('category'); setActiveCategory(null) }}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
              viewMode === 'category' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'
            }`}
          >
            カテゴリ別
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
              viewMode === 'list' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'
            }`}
          >
            一覧
          </button>
        </div>
      </div>

      {/* カテゴリ別表示 */}
      {viewMode === 'category' && !activeCategory && (
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => {
            const catApps = apps.filter((a) => a.category === cat)
            const selectedInCat = catApps.filter((a) => data.selectedApps.includes(a.name)).length
            return (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setViewMode('list') }}
                className="text-left p-3 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-200 transition-all relative"
              >
                <span className="text-2xl">{categoryIcons[cat] || '📱'}</span>
                <h3 className="font-bold text-gray-800 text-sm mt-1">{cat}</h3>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">
                  {categoryDescriptions[cat] || ''}
                </p>
                <span className="text-[10px] text-gray-400 mt-1 inline-block">{catApps.length}種類</span>
                {selectedInCat > 0 && (
                  <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                    {selectedInCat}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* リスト表示（カテゴリ選択後 or 一覧モード） */}
      {(viewMode === 'list' || activeCategory) && (
        <>
          {/* カテゴリフィルタ */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
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
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
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
          <div className="grid grid-cols-1 gap-2">
            {filteredApps.map((app) => {
              const selected = data.selectedApps.includes(app.name)
              return (
                <div key={app.id} className={`w-full text-left rounded-xl border-2 transition-all overflow-hidden ${
                  selected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-blue-200'
                }`}>
                  <button
                    onClick={() => toggleApp(app.name)}
                    aria-label={`${app.name}${selected ? '（選択済み）' : ''}`}
                    aria-pressed={selected}
                    className="w-full text-left p-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 mt-0.5 rounded flex items-center justify-center flex-shrink-0 ${
                        selected ? 'bg-blue-600 text-white' : 'border-2 border-gray-300'
                      }`}>
                        {selected && (
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{categoryIcons[app.category] || '📱'}</span>
                          <h3 className="font-bold text-gray-800 text-sm">{app.name}</h3>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{app.description}</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {app.features?.slice(0, 3).map((f) => (
                            <span key={f} className="px-1.5 py-0.5 rounded bg-gray-50 text-[10px] text-gray-500 border border-gray-100">
                              {f}
                            </span>
                          ))}
                          {(app.features?.length || 0) > 3 && (
                            <span className="text-[10px] text-gray-400">+{(app.features?.length || 0) - 3}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                  {/* デモリンク */}
                  {app.demo_url && (
                    <div className="px-3 pb-2 pl-11">
                      <a
                        href={app.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-[11px] text-blue-500 hover:text-blue-700 hover:underline"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        デモを見る
                      </a>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* カテゴリ一覧に戻る */}
          {activeCategory && (
            <button
              onClick={() => { setActiveCategory(null); setViewMode('category') }}
              className="w-full text-center text-sm text-blue-600 hover:underline py-2"
            >
              カテゴリ一覧に戻る
            </button>
          )}
        </>
      )}

      {/* 補足コメント */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          補足・ご要望（音声入力OK）
        </label>
        <VoiceInput
          value={data.similarAppNotes}
          onChange={(v) => onChange({ similarAppNotes: v })}
          placeholder="「これとこれを組み合わせたい」「全然違うものが欲しい」「ここにないものが欲しい」など..."
          rows={3}
        />
      </div>

      {/* 選択中のアプリ */}
      {selectedCount > 0 && (
        <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
          <p className="text-xs text-blue-600 font-medium mb-1">選択中（{selectedCount}件）</p>
          <div className="flex flex-wrap gap-1">
            {data.selectedApps.map((name) => (
              <span
                key={name}
                onClick={() => toggleApp(name)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs cursor-pointer hover:bg-blue-200"
              >
                {name}
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          aria-label="前のステップに戻る"
          className="flex-1 py-4 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-base hover:bg-gray-50"
        >
          戻る
        </button>
        <button
          onClick={onNext}
          aria-label="次のステップへ進む"
          className="flex-[2] py-4 rounded-xl text-white font-bold text-lg transition-all bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
        >
          次へ進む
        </button>
      </div>
    </div>
  )
}
