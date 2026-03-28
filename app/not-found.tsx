import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <p className="text-5xl font-bold text-gray-300 mb-4">404</p>
        <h1 className="text-xl font-bold text-gray-700 mb-3">
          ページが見つかりません
        </h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          アクセスされたページは存在しないか、移動・削除された可能性があります。
        </p>

        <Link
          href="/"
          className="inline-block w-full py-4 rounded-xl bg-blue-600 text-white font-bold text-base hover:bg-blue-700 transition-all"
        >
          トップページへ戻る
        </Link>

        <div className="mt-6 flex justify-center gap-3 text-xs text-gray-400">
          <Link href="/terms" className="hover:text-gray-600 hover:underline">利用規約</Link>
          <span>|</span>
          <Link href="/privacy" className="hover:text-gray-600 hover:underline">プライバシーポリシー</Link>
        </div>
      </div>
    </div>
  )
}
