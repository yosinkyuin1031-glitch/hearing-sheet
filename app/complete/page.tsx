'use client'

import Link from 'next/link'

export default function CompletePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-green-50 to-white">
      <div className="text-center max-w-md animate-fade-in">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          送信完了
        </h1>

        <p className="text-gray-500 text-base leading-relaxed mb-2">
          ヒアリングシートのご記入ありがとうございます。
        </p>
        <p className="text-gray-500 text-base leading-relaxed mb-8">
          内容を確認し、<strong className="text-gray-700">2営業日以内</strong>にご連絡いたします。
        </p>

        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-8 text-left">
          <h3 className="font-bold text-gray-700 text-sm mb-2">今後の流れ</h3>
          <ol className="space-y-2 text-sm text-gray-600">
            <li className="flex gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
              <span>ヒアリング内容をもとにAIが仕様書を作成</span>
            </li>
            <li className="flex gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
              <span>担当者が仕様書を確認・ブラッシュアップ</span>
            </li>
            <li className="flex gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
              <span>Zoomでお打ち合わせ（ご提案・お見積り）</span>
            </li>
            <li className="flex gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
              <span>ご納得いただけたら開発スタート</span>
            </li>
          </ol>
        </div>

        <Link
          href="/"
          className="inline-block w-full py-4 rounded-xl bg-gray-100 text-gray-700 font-bold text-base hover:bg-gray-200 transition-all"
        >
          トップに戻る
        </Link>
      </div>
    </div>
  )
}
