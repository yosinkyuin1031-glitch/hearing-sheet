'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { HearingResponse, CHALLENGES } from '@/lib/types'
import { useToast } from '@/components/ui/Toast'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft: { label: '下書き', color: 'bg-gray-100 text-gray-600' },
  submitted: { label: '受付済', color: 'bg-blue-100 text-blue-700' },
  reviewed: { label: '確認済', color: 'bg-amber-100 text-amber-700' },
  completed: { label: '完了', color: 'bg-green-100 text-green-700' },
}

type SortOrder = 'newest' | 'oldest'
type StatusFilter = 'all' | 'draft' | 'submitted' | 'reviewed' | 'completed'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [responses, setResponses] = useState<HearingResponse[]>([])
  const [selected, setSelected] = useState<HearingResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const { showToast, ToastContainer } = useToast()

  const loadResponses = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('hearing_responses')
      .select('*')
      .order('created_at', { ascending: false })
    setResponses((data as HearingResponse[]) || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    if (authed) loadResponses()
  }, [authed, loadResponses])

  // フィルタ・ソート・検索を適用した一覧
  const filteredResponses = useMemo(() => {
    let list = [...responses]

    // ステータスフィルタ
    if (statusFilter !== 'all') {
      list = list.filter((r) => r.status === statusFilter)
    }

    // 検索（会社名・氏名）
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      list = list.filter(
        (r) =>
          (r.contact_name || '').toLowerCase().includes(q) ||
          (r.company_name || '').toLowerCase().includes(q)
      )
    }

    // ソート
    list.sort((a, b) => {
      const diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      return sortOrder === 'newest' ? -diff : diff
    })

    return list
  }, [responses, statusFilter, searchQuery, sortOrder])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setAuthLoading(true)
    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        setAuthed(true)
      } else {
        showToast('パスワードが違います', 'error')
      }
    } catch {
      showToast('認証に失敗しました。もう一度お試しください。', 'error')
    } finally {
      setAuthLoading(false)
    }
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('hearing_responses').update({ status }).eq('id', id)
    await loadResponses()
    if (selected?.id === id) {
      setSelected((prev) => prev ? { ...prev, status: status as HearingResponse['status'] } : null)
    }
    const label = STATUS_LABELS[status]?.label || status
    showToast(`ステータスを「${label}」に変更しました`, 'success')
  }

  async function regenerateSpec(id: string) {
    showToast('AI仕様書を生成中...', 'info', 10000)
    const res = await fetch('/api/generate-spec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ responseId: id }),
    })
    if (res.ok) {
      await loadResponses()
      const { data } = await supabase.from('hearing_responses').select('*').eq('id', id).single()
      if (data) setSelected(data as HearingResponse)
      showToast('AI仕様書を生成しました', 'success')
    } else {
      showToast('仕様書の生成に失敗しました。もう一度お試しください。', 'error')
    }
  }

  function downloadPDF(response: HearingResponse) {
    const content = response.ai_spec || 'まだ仕様書が生成されていません'
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `仕様書_${response.contact_name || 'unknown'}_${new Date(response.created_at).toLocaleDateString('ja-JP').replace(/\//g, '-')}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  // ログイン画面
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <ToastContainer />
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">管理画面</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワードを入力"
              aria-label="管理画面パスワード"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-50"
            >
              {authLoading ? 'ログイン中...' : 'ログイン'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // 詳細画面
  if (selected) {
    const challengeLabels = (selected.challenges || [])
      .map((id) => CHALLENGES.find((c) => c.id === id)?.label || id)

    return (
      <div className="min-h-screen bg-gray-50">
        <ToastContainer />
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <button onClick={() => setSelected(null)} className="text-blue-600 font-medium text-sm flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              一覧に戻る
            </button>
            <div className="flex gap-2">
              <button onClick={() => regenerateSpec(selected.id)} className="px-3 py-1.5 text-sm rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 font-medium">
                AI再生成
              </button>
              <button onClick={() => downloadPDF(selected)} className="px-3 py-1.5 text-sm rounded-lg bg-green-100 text-green-700 hover:bg-green-200 font-medium">
                DL
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4 space-y-4">
          {/* 基本情報カード */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-lg text-gray-800">{selected.contact_name}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_LABELS[selected.status]?.color || ''}`}>
                {STATUS_LABELS[selected.status]?.label}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-gray-500">会社名</span><p className="font-medium">{selected.company_name || '-'}</p></div>
              <div><span className="text-gray-500">業種</span><p className="font-medium">{selected.industry || '-'}</p></div>
              <div><span className="text-gray-500">メール</span><p className="font-medium">{selected.contact_email || '-'}</p></div>
              <div><span className="text-gray-500">電話</span><p className="font-medium">{selected.contact_phone || '-'}</p></div>
              <div><span className="text-gray-500">受付日</span><p className="font-medium">{new Date(selected.created_at).toLocaleString('ja-JP')}</p></div>
            </div>
          </div>

          {/* 課題・選択アプリ */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-bold text-sm text-gray-700 mb-2">お困りごと</h3>
            <div className="flex flex-wrap gap-1 mb-3">
              {challengeLabels.map((l) => (
                <span key={l} className="px-2 py-1 rounded-full bg-amber-50 text-amber-700 text-xs border border-amber-200">{l}</span>
              ))}
            </div>
            {(selected.selected_apps || []).length > 0 && (
              <>
                <h3 className="font-bold text-sm text-gray-700 mb-2 mt-3">興味のあるアプリ</h3>
                <div className="flex flex-wrap gap-1">
                  {selected.selected_apps.map((a) => (
                    <span key={a} className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs border border-blue-200">{a}</span>
                  ))}
                </div>
              </>
            )}
            {selected.similar_app_notes && (
              <p className="mt-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-2">{selected.similar_app_notes}</p>
            )}
          </div>

          {/* 詳細回答 */}
          {Object.keys(selected.detailed_answers || {}).length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-bold text-sm text-gray-700 mb-2">詳細ヒアリング</h3>
              <div className="space-y-2 text-sm">
                {Object.entries(selected.detailed_answers).map(([key, val]) => (
                  <div key={key}>
                    <span className="text-gray-500 text-xs">{key}</span>
                    <p className="font-medium">{val as string}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI仕様書 */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-bold text-sm text-gray-700 mb-2">AI生成 仕様書</h3>
            {selected.ai_spec ? (
              <div className="prose prose-sm max-w-none whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 rounded-lg p-4">
                {selected.ai_spec}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>まだ仕様書が生成されていません</p>
                <button
                  onClick={() => regenerateSpec(selected.id)}
                  className="mt-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                >
                  AIで生成する
                </button>
              </div>
            )}
          </div>

          {/* ステータス変更 */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-bold text-sm text-gray-700 mb-3">ステータス変更</h3>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(STATUS_LABELS).map(([key, { label, color }]) => (
                <button
                  key={key}
                  onClick={() => updateStatus(selected.id, key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selected.status === key
                      ? `${color} ring-2 ring-offset-1 ring-blue-500`
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 一覧画面
  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">ヒアリング管理</h1>
          <button onClick={loadResponses} className="text-sm text-blue-600 hover:underline">
            更新
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* 検索・フィルタ・ソート */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          {/* 検索ボックス */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="会社名・氏名で検索"
              aria-label="会社名・氏名で検索"
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="検索クリア"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex gap-3 flex-wrap">
            {/* ステータスフィルタ */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['all', 'draft', 'submitted', 'reviewed', 'completed'] as StatusFilter[]).map((s) => {
                const label = s === 'all' ? '全て' : STATUS_LABELS[s]?.label || s
                const isActive = statusFilter === s
                return (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>

            {/* ソート */}
            <div className="ml-auto">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                aria-label="並び順"
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="newest">新しい順</option>
                <option value="oldest">古い順</option>
              </select>
            </div>
          </div>

          {/* 件数表示 */}
          <p className="text-xs text-gray-500">
            {filteredResponses.length}件 / 全{responses.length}件
          </p>
        </div>

        {/* 一覧 */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
          </div>
        ) : filteredResponses.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">
              {responses.length === 0 ? 'まだ回答がありません' : '条件に一致する回答がありません'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredResponses.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelected(r)}
                className="w-full text-left bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-gray-800">{r.contact_name}</h3>
                    <p className="text-sm text-gray-500">{r.company_name || '-'} / {r.industry}</p>
                    {(r.selected_apps || []).length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {r.selected_apps.slice(0, 3).map((a) => (
                          <span key={a} className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs">{a}</span>
                        ))}
                        {r.selected_apps.length > 3 && (
                          <span className="text-xs text-gray-400">+{r.selected_apps.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_LABELS[r.status]?.color || ''}`}>
                      {STATUS_LABELS[r.status]?.label}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(r.created_at).toLocaleDateString('ja-JP')}
                    </p>
                    {r.ai_spec && <span className="text-xs text-purple-500">AI仕様書あり</span>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
