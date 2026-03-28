import Link from 'next/link'

export const metadata = {
  title: '利用規約 | 株式会社ROLE OWL',
}

export default function TermsPage() {
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
        <h1 className="text-2xl font-bold text-gray-800 mb-2">利用規約</h1>
        <p className="text-sm text-gray-500 mb-8">最終更新日：2026年3月28日</p>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-8 text-sm text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-base font-bold text-gray-800 mb-3">第1条（適用）</h2>
            <p>本利用規約（以下「本規約」）は、株式会社ROLE OWL（以下「当社」）が提供するアプリ開発ヒアリングシートサービス（以下「本サービス」）の利用条件を定めるものです。本サービスをご利用になる方（以下「ユーザー」）は、本規約に同意した上でご利用ください。</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-800 mb-3">第2条（サービスの内容）</h2>
            <p>本サービスは、ユーザーのビジネス課題やアプリ開発ニーズをヒアリングするためのオンラインフォームを提供するものです。送信された内容は、当社がアプリ開発の提案・見積もりを行うために利用します。</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-800 mb-3">第3条（禁止事項）</h2>
            <p className="mb-2">ユーザーは、本サービスの利用にあたり、以下の行為を行ってはなりません。</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>虚偽の情報を入力する行為</li>
              <li>他人の個人情報を無断で使用する行為</li>
              <li>当社または第三者の権利・利益を侵害する行為</li>
              <li>本サービスの運営を妨害する行為</li>
              <li>法令または公序良俗に反する行為</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-800 mb-3">第4条（免責事項）</h2>
            <p>当社は、本サービスを通じて取得した情報に基づく提案・見積もりが、ユーザーの期待に必ずしも応えられることを保証しません。また、本サービスの利用によって生じた損害について、当社の故意または重大な過失による場合を除き、責任を負いません。</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-800 mb-3">第5条（個人情報の取り扱い）</h2>
            <p>
              ユーザーから取得した個人情報は、当社の
              <Link href="/privacy" className="text-blue-600 hover:underline mx-1">プライバシーポリシー</Link>
              に従って適切に管理します。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-800 mb-3">第6条（サービスの変更・中断・終了）</h2>
            <p>当社は、ユーザーへの事前通知なく、本サービスの内容変更、一時中断、または終了を行う場合があります。これによりユーザーに損害が生じた場合であっても、当社は責任を負いません。</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-800 mb-3">第7条（規約の変更）</h2>
            <p>当社は、必要に応じて本規約を変更することができます。変更後の規約は、本サービス上に掲載した時点より効力を生じます。</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-800 mb-3">第8条（準拠法・管轄裁判所）</h2>
            <p>本規約の解釈は日本法に準拠します。本サービスに関する紛争については、当社の本店所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。</p>
          </section>

          <section className="pt-4 border-t border-gray-100">
            <p className="text-gray-500">
              運営会社：株式会社ROLE OWL<br />
              お問い合わせ：本フォームまたは担当者までご連絡ください
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
