import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

const CHALLENGE_LABELS: Record<string, string> = {
  customer_mgmt: '顧客・患者の情報管理が大変',
  reservation: '予約管理を楽にしたい',
  marketing: '集客・新規を増やしたい',
  sales: '売上・経営数字を把握したい',
  staff: 'スタッフ管理・シフトを効率化したい',
  paper: '紙の書類をデジタル化したい',
  communication: 'お客様とのコミュニケーションを改善したい',
  ec: '物販・オンライン販売をしたい',
  other: 'その他',
}

const QUESTION_LABELS: Record<string, string> = {
  target_users: '主なユーザー',
  current_method: '現在の管理方法',
  pain_points: '一番の課題',
  must_features: '必須機能',
  nice_to_have: 'あると嬉しい機能',
  user_count: '利用人数',
  customer_count: '顧客・患者数',
  locations: '店舗・拠点数',
  data_migration: 'データ移行',
  priority: '最優先事項',
  site_color_image: 'サイトの色味・雰囲気',
  site_reference: '参考サイト',
  site_goal: 'サイトのゴール',
  diagnosis_type: '診断の内容',
  diagnosis_lead: '診断後の導線',
  diagnosis_channel: '診断の利用場所',
  ec_products: '販売商品',
  ec_product_count: '商品数',
  ec_subscription: '定期購入',
  backend_product: 'バックエンド商品',
  product_flow: '理想的な顧客導線',
  existing_tools: '現在使用中のサービス',
  payment_type: 'お支払い方法',
  budget_onetime: '一括予算',
  budget_monthly: '月額予算',
  timeline: '希望スケジュール',
  other_notes: 'その他の要望',
}

export async function POST(request: NextRequest) {
  try {
    const { responseId } = await request.json()

    const { data: hearing } = await supabase
      .from('hearing_responses')
      .select('*')
      .eq('id', responseId)
      .single()

    if (!hearing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const challengeTexts = (hearing.challenges || [])
      .map((c: string) => CHALLENGE_LABELS[c] || c)
      .join('、')

    const detailedTexts = Object.entries(hearing.detailed_answers || {})
      .map(([key, val]) => `- ${QUESTION_LABELS[key] || key}: ${val}`)
      .join('\n')

    const prompt = `あなたはアプリ開発の仕様書を作成するプロのシステムエンジニアです。
以下のヒアリング内容をもとに、クライアントに提出する仕様書を作成してください。

## ヒアリング内容

- お名前: ${hearing.contact_name}
- 会社名/院名: ${hearing.company_name || '未記入'}
- 業種: ${hearing.industry}
- お困りごと: ${challengeTexts}
- 興味のあるアプリ: ${(hearing.selected_apps || []).join('、') || 'なし'}
- 補足コメント: ${hearing.similar_app_notes || 'なし'}

### 詳細ヒアリング
${detailedTexts || 'なし'}

## 仕様書フォーマット

以下の形式でMarkdown形式の仕様書を作成してください:

# アプリ開発 仕様書

## 1. プロジェクト概要
- アプリ名（仮）
- 目的・ゴール
- ターゲットユーザー

## 2. 主要機能一覧
（優先度: 高/中/低 を明記）

## 3. 画面構成
（主要な画面を箇条書き）

## 4. 技術スタック（提案）

## 5. 開発スケジュール（概算）

## 6. 概算見積

## 7. 今後のステップ

クライアントは技術に詳しくない方が多いので、専門用語は避けて分かりやすく書いてください。`

    if (!ANTHROPIC_API_KEY) {
      // APIキーがない場合はフォールバック仕様書を生成
      const fallbackSpec = generateFallbackSpec(hearing)
      await supabase
        .from('hearing_responses')
        .update({ ai_spec: fallbackSpec })
        .eq('id', responseId)
      return NextResponse.json({ success: true })
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const result = await response.json()
    const spec = result.content?.[0]?.text || generateFallbackSpec(hearing)

    await supabase
      .from('hearing_responses')
      .update({ ai_spec: spec })
      .eq('id', responseId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Generate spec error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

function generateFallbackSpec(hearing: Record<string, unknown>): string {
  const challenges = ((hearing.challenges as string[]) || [])
    .map((c) => CHALLENGE_LABELS[c] || c)
  const apps = (hearing.selected_apps as string[]) || []
  const answers = (hearing.detailed_answers as Record<string, string>) || {}

  return `# アプリ開発 仕様書（ドラフト）

## 1. プロジェクト概要
- **クライアント**: ${hearing.contact_name}様（${hearing.company_name || '未記入'}）
- **業種**: ${hearing.industry}
- **お困りごと**: ${challenges.join('、')}
- **興味のあるアプリ**: ${apps.join('、') || 'なし'}

## 2. ヒアリング内容
${Object.entries(answers).map(([k, v]) => `- **${QUESTION_LABELS[k] || k}**: ${v}`).join('\n')}

${hearing.similar_app_notes ? `\n## 3. 補足\n${hearing.similar_app_notes}` : ''}

---
*この仕様書はAI生成の準備段階です。担当者が内容を確認後、詳細な仕様書を作成します。*`
}
