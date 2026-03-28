'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Page error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-red-50 to-white">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">エラーが発生しました</h1>
        <p className="text-gray-500 text-sm mb-6">
          予期しないエラーが発生しました。ページを再読み込みしてください。
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            aria-label="再試行する"
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-base hover:bg-blue-700 transition-all"
          >
            再試行する
          </button>
          <a
            href="/"
            className="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-base hover:bg-gray-50 transition-all inline-block text-center"
          >
            トップに戻る
          </a>
        </div>
      </div>
    </div>
  )
}
