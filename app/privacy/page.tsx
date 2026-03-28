import Link from 'next/link'

export const metadata = {
  title: 'プライバシーポリシー | 株式会社ROLE OWL',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" className="text-blue-600 text-sm flex items-center gap-1 hover:underline">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            トップに戻る
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">プライバシーポリシー</h1>
        <p className="text-sm text-gray-500 mb-8">最終更新日：2026年3月28日</p>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-8 text-sm text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-base font-bold text-gray-800 mb-3">1. 事業者情報</h2>
            <p>株式会社ROLE OWL（以下「当社」）は、本サービスを通じて取得する個人情報の取り扱いについて、以下のとおり定めます。</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-800 mb-3">2. 取得する個人情報</h2>
            <p className="mb-2">当社は、本サービスの利用を通じて以下の情報を取得します。</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>お名前</li>
              <li>会社名・院名</li>
              <li>メールアドレス</li>
              <li>電話番号</li>
              <li>業種</li>
              <li>ビジネス課題・アプリ開発に関するヒアリング内容</li>
              <li>参考イメージ（アップロードされた場合）</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-800 mb-3">3. 利用目的</h2>
            <p className="mb-2">取得した個人情報は、以下の目的で利用します。</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>アプリ開発の提案・見積もりの作成</li>
              <li>お打ち合わせ・ご連絡のため</li>
              <li>AI仕様書の自動生成（入力内容を基にした分析）</li>
              <li>サービス改善のための統計的分析</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-800 mb-3">4. 第三者提供</h2>
            <p>当社は、以下の場合を除き、取得した個人情報を第三者に提供しません。</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 mt-2">
              <li>ユーザーの同意がある場合</li>
              <li>法令に基づく場合</li>
              <li>人の生命・身体・財産の保護のために必要な場合</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-800 mb-3">5. 利用するサービス・技術</h2>
            <p className="mb-2">本サービスでは、以下の外部サービスを利用しています。</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Supabase（データベース・ファイルストレージ）：入力データの保存</li>
              <li>Anthropic Claude API（AI）：仕様書の自動生成</li>
              <li>Vercel（ホスティング）：サービスの配信</li>
            </ul>
            <p className="mt-2 text-gray-500 text-xs">各サービスは独自のプライバシーポリシーに従ってデータを取り扱います。</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-800 mb-3">6. 個人情報の管理・保護</h2>
            <p>当社は、個人情報への不正アクセス・紛失・破壊・改ざん・漏洩を防止するため、適切なセキュリティ対策を実施します。</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-800 mb-3">7. 保存期間</h2>
            <p>取得した個人情報は、利用目的の達成に必要な期間のみ保存します。ご依頼をいただかない場合は、お問い合わせから1年を目安に削除します。</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-800 mb-3">8. 開示・訂正・削除の請求</h2>
            <p>ユーザーは、自身の個人情報の開示・訂正・削除を請求できます。ご希望の場合は、担当者までご連絡ください。</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-800 mb-3">9. クッキー（Cookie）について</h2>
            <p>本サービスでは、フォームの入力内容を一時保存するためにブラウザのセッションストレージを使用します。セッション終了時（ブラウザを閉じた時）に自動的に削除されます。</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-800 mb-3">10. プライバシーポリシーの変更</h2>
            <p>当社は、法令改正やサービス内容の変更に応じて、本ポリシーを変更する場合があります。変更後は本サービス上に掲載した時点より効力を生じます。</p>
          </section>

          <section className="pt-4 border-t border-gray-100">
            <p className="text-gray-500">
              運営会社：株式会社ROLE OWL<br />
              お問い合わせ：本フォームまたは担当者までご連絡ください
            </p>
          </section>
        </div>

        <p className="text-center mt-6 text-sm">
          <Link href="/terms" className="text-blue-600 hover:underline">利用規約</Link>
          <span className="text-gray-400 mx-2">|</span>
          <Link href="/" className="text-blue-600 hover:underline">トップページ</Link>
        </p>
      </div>
    </div>
  )
}
