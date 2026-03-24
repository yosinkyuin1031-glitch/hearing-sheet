'use client'

import { useState, useEffect, useMemo } from 'react'
import { HearingFormData, HearingQuestion } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import VoiceInput from './VoiceInput'
import ImageUpload from './ImageUpload'

interface Props {
  data: HearingFormData
  onChange: (data: Partial<HearingFormData>) => void
  onNext: () => void
  onBack: () => void
}

// 選択アプリのカテゴリをDBのcondition_appにマッチさせるマッピング
const APP_TO_CONDITION: Record<string, string[]> = {
  // サイト・LP制作系
  'ホームページ制作': ['サイト・LP制作'],
  '症状別ランディングページ': ['サイト・LP制作'],
  '採用サイト': ['サイト・LP制作'],
  'ECサイト・オンラインショップ': ['サイト・LP制作', '販売'],
  'ポートフォリオサイト': ['サイト・LP制作'],
  // 診断系
  '睡眠チェック診断': ['無料診断・チェック'],
  '自律神経セルフチェック': ['無料診断・チェック'],
  '肩こり・腰痛リスク診断': ['無料診断・チェック'],
  '体質診断クイズ': ['無料診断・チェック'],
  'ストレスチェック': ['無料診断・チェック'],
  // 販売系
  '在庫・物販管理': ['販売'],
  '睡眠管理アプリ': ['販売'],
}

const SECTION_LABELS: Record<string, { icon: string; title: string }> = {
  'common': { icon: '📝', title: '基本的なこと' },
  'サイト・LP制作': { icon: '🌐', title: 'サイト・デザインについて' },
  '無料診断・チェック': { icon: '✅', title: '診断ツールについて' },
  '販売': { icon: '🛒', title: '商品・販売について' },
  'backend': { icon: '🎯', title: '商品導線・ゴール設計' },
  'schedule': { icon: '📅', title: '予算・スケジュール' },
}

export default function Step4DetailedHearing({ data, onChange, onNext, onBack }: Props) {
  const [allQuestions, setAllQuestions] = useState<HearingQuestion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadQuestions()
  }, [])

  async function loadQuestions() {
    const { data: qData } = await supabase
      .from('hearing_questions')
      .select('*')
      .order('sort_order')
    setAllQuestions((qData as HearingQuestion[]) || [])
    setLoading(false)
  }

  // 選択アプリから該当するcondition_appを算出
  const activeConditions = useMemo(() => {
    const conditions = new Set<string>()
    for (const appName of data.selectedApps) {
      const mapped = APP_TO_CONDITION[appName]
      if (mapped) mapped.forEach((c) => conditions.add(c))
    }
    return conditions
  }, [data.selectedApps])

  // 表示する質問をフィルタ
  const paymentType = data.detailedAnswers['payment_type'] || ''

  const visibleQuestions = useMemo(() => {
    return allQuestions.filter((q) => {
      // condition_appがある → 該当カテゴリのアプリが選ばれていれば表示
      if (q.condition_app) return activeConditions.has(q.condition_app)
      // 予算の出し分け: 一括/月額の選択に応じて表示
      if (q.question_key === 'budget_onetime') {
        return paymentType === '一括払い（買い切り）' || paymentType === 'まだ決まっていない' || paymentType === '相談して決めたい'
      }
      if (q.question_key === 'budget_monthly') {
        return paymentType === '月額制（サブスク）' || paymentType === 'まだ決まっていない' || paymentType === '相談して決めたい'
      }
      // それ以外の共通質問 → 常に表示
      return true
    })
  }, [allQuestions, activeConditions, paymentType])

  // セクション分け
  const sections = useMemo(() => {
    const result: { key: string; questions: HearingQuestion[] }[] = []

    // step=3: 共通質問
    const commonQs = visibleQuestions.filter((q) => q.step === 3)
    if (commonQs.length > 0) result.push({ key: 'common', questions: commonQs })

    // step=4: 条件付き質問（カテゴリ別）
    const conditionalQs = visibleQuestions.filter((q) => q.step === 4 && q.condition_app)
    const condGroups = new Map<string, HearingQuestion[]>()
    for (const q of conditionalQs) {
      const key = q.condition_app!
      if (!condGroups.has(key)) condGroups.set(key, [])
      condGroups.get(key)!.push(q)
    }
    for (const [key, qs] of condGroups) {
      result.push({ key, questions: qs })
    }

    // step=4: バックエンド系（condition_app=null, step=4）
    const backendQs = visibleQuestions.filter((q) => q.step === 4 && !q.condition_app)
    if (backendQs.length > 0) result.push({ key: 'backend', questions: backendQs })

    // step=5: 予算・スケジュール
    const scheduleQs = visibleQuestions.filter((q) => q.step === 5)
    if (scheduleQs.length > 0) result.push({ key: 'schedule', questions: scheduleQs })

    return result
  }, [visibleQuestions])

  const updateAnswer = (key: string, value: string) => {
    onChange({
      detailedAnswers: { ...data.detailedAnswers, [key]: value },
    })
  }

  const requiredKeys = visibleQuestions.filter((q) => q.is_required).map((q) => q.question_key)
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
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">もう少し詳しく教えてください</h2>
        <p className="text-gray-500 mt-2 text-sm">
          音声入力もご利用いただけます（マイクボタン）
        </p>
        {activeConditions.size > 0 && (
          <p className="text-blue-600 mt-1 text-xs">
            選択した内容に合わせた質問を表示しています
          </p>
        )}
      </div>

      <div className="space-y-8">
        {sections.map((section) => {
          const label = SECTION_LABELS[section.key]
          return (
            <div key={section.key}>
              {label && (
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                  <span className="text-base">{label.icon}</span>
                  <h3 className="font-bold text-gray-700 text-sm">{label.title}</h3>
                </div>
              )}
              <div className="space-y-5">
                {section.questions.map((q) => (
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
            </div>
          )
        })}
      </div>

      {/* 参考イメージアップロード */}
      <div>
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
          <span className="text-base">📎</span>
          <h3 className="font-bold text-gray-700 text-sm">参考イメージ（任意）</h3>
        </div>
        <p className="text-xs text-gray-500 mb-2">
          「こんなデザインにしたい」「今使っているツールの画面」など、参考になる画像があればアップロードしてください
        </p>
        <ImageUpload
          existingUrls={data.referenceImages}
          onUpload={(urls) => onChange({ referenceImages: urls })}
        />
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
