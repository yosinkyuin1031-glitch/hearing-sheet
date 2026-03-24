'use client'

import { useState } from 'react'
import { HearingFormData, CHALLENGES } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface Props {
  data: HearingFormData
  onBack: () => void
}

const QUESTION_LABELS: Record<string, string> = {
  target_users: '主なユーザー',
  current_method: '現在の管理方法',
  pain_points: '一番の課題',
  must_features: '必須機能',
  nice_to_have: 'あると嬉しい機能',
  site_color_image: 'サイトの色味・雰囲気',
  site_reference: '参考サイト',
  site_goal: 'サイトのゴール',
  diagnosis_type: '診断の内容',
  diagnosis_lead: '診断後の導線',
  diagnosis_channel: '診断の利用場所',
  ec_products: '販売商品',
  ec_product_count: '商品数',
  ec_subscription: '定期購入の必要性',
  backend_product: 'バックエンド商品',
  product_flow: '理想的な顧客導線',
  existing_tools: '現在使用中のサービス',
  payment_type: 'お支払い方法',
  budget_onetime: '一括予算',
  budget_monthly: '月額予算',
  timeline: '希望スケジュール',
  other_notes: 'その他',
}

export default function Step5Confirm({ data, onBack }: Props) {
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  const challengeLabels = data.challenges
    .map((id) => CHALLENGES.find((c) => c.id === id)?.label || id)

  async function handleSubmit() {
    setSubmitting(true)
    try {
      const { data: inserted, error } = await supabase
        .from('hearing_responses')
        .insert({
          company_name: data.companyName || null,
          contact_name: data.contactName,
          contact_email: data.contactEmail || null,
          contact_phone: data.contactPhone || null,
          industry: data.industry,
          challenges: data.challenges,
          selected_apps: data.selectedApps,
          similar_app_notes: data.similarAppNotes || null,
          detailed_answers: data.detailedAnswers,
          status: 'submitted',
        })
        .select('id')
        .single()

      if (error) throw error

      // AI仕様書生成をバックグラウンドで実行
      if (inserted?.id) {
        fetch('/api/generate-spec', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ responseId: inserted.id }),
        }).catch(console.error)
      }

      router.push('/complete')
    } catch (err) {
      console.error('Submit error:', err)
      alert('送信に失敗しました。もう一度お試しください。')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="animate-fade-in space-y-6 px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">入力内容の確認</h2>
        <p className="text-gray-500 mt-2 text-sm">内容をご確認の上、送信してください</p>
      </div>

      <div className="space-y-4">
        {/* 基本情報 */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-bold text-gray-700 text-sm mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">1</span>
            基本情報
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex"><span className="text-gray-500 w-24 flex-shrink-0">お名前</span><span className="font-medium">{data.contactName}</span></div>
            {data.companyName && <div className="flex"><span className="text-gray-500 w-24 flex-shrink-0">会社名・院名</span><span className="font-medium">{data.companyName}</span></div>}
            <div className="flex"><span className="text-gray-500 w-24 flex-shrink-0">業種</span><span className="font-medium">{data.industry}</span></div>
            {data.contactEmail && <div className="flex"><span className="text-gray-500 w-24 flex-shrink-0">メール</span><span className="font-medium">{data.contactEmail}</span></div>}
            {data.contactPhone && <div className="flex"><span className="text-gray-500 w-24 flex-shrink-0">電話番号</span><span className="font-medium">{data.contactPhone}</span></div>}
          </div>
        </div>

        {/* お困りごと */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-bold text-gray-700 text-sm mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">2</span>
            お困りごと
          </h3>
          <div className="flex flex-wrap gap-2">
            {challengeLabels.map((label) => (
              <span key={label} className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-sm border border-amber-200">
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* 選択アプリ */}
        {data.selectedApps.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-bold text-gray-700 text-sm mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">3</span>
              興味のあるアプリ
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.selectedApps.map((app) => (
                <span key={app} className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm border border-blue-200">
                  {app}
                </span>
              ))}
            </div>
            {data.similarAppNotes && (
              <p className="mt-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                {data.similarAppNotes}
              </p>
            )}
          </div>
        )}

        {/* 詳細回答 */}
        {Object.keys(data.detailedAnswers).length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-bold text-gray-700 text-sm mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">4</span>
              詳細ヒアリング
            </h3>
            <div className="space-y-3 text-sm">
              {Object.entries(data.detailedAnswers).map(([key, val]) => {
                if (!val) return null
                return (
                  <div key={key}>
                    <p className="text-gray-500 text-xs">{QUESTION_LABELS[key] || key}</p>
                    <p className="font-medium mt-0.5">{val}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={submitting}
          className="flex-1 py-4 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-base hover:bg-gray-50 disabled:opacity-50"
        >
          戻る
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex-[2] py-4 rounded-xl text-white font-bold text-lg transition-all disabled:bg-gray-400 bg-green-600 hover:bg-green-700 active:scale-[0.98]"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              送信中...
            </span>
          ) : (
            '送信する'
          )}
        </button>
      </div>
    </div>
  )
}
