import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'yosinkyuin1031@gmail.com'
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD
const GMAIL_USER = process.env.GMAIL_USER || 'yosinkyuin1031@gmail.com'

const CHALLENGE_LABELS: Record<string, string> = {
  customer_mgmt: '顧客・患者管理',
  reservation: '予約管理',
  marketing: '集客',
  sales: '売上管理',
  staff: 'スタッフ管理',
  paper: 'デジタル化',
  communication: 'コミュニケーション',
  ec: '物販・EC',
  other: 'その他',
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

    const challenges = (hearing.challenges || [])
      .map((c: string) => CHALLENGE_LABELS[c] || c)
      .join('、')

    const apps = (hearing.selected_apps || []).join('、')
    const answers = hearing.detailed_answers || {}

    const adminUrl = `https://hearing-sheet-six.vercel.app/admin`

    // メール本文を構築
    const textBody = `
【新規ヒアリング回答】

お名前: ${hearing.contact_name}
会社名: ${hearing.company_name || '未記入'}
業種: ${hearing.industry}
メール: ${hearing.contact_email || '未記入'}
電話: ${hearing.contact_phone || '未記入'}

■ お困りごと
${challenges || 'なし'}

■ 興味のあるアプリ
${apps || 'なし'}

■ 補足コメント
${hearing.similar_app_notes || 'なし'}

■ 詳細回答
${Object.entries(answers).map(([k, v]) => `・${k}: ${v}`).join('\n') || 'なし'}

━━━━━━━━━━━━━━━━━━
管理画面で詳細確認・仕様書閲覧:
${adminUrl}
━━━━━━━━━━━━━━━━━━
`.trim()

    const htmlBody = `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #2563eb; color: white; padding: 16px 20px; border-radius: 12px 12px 0 0;">
    <h2 style="margin: 0; font-size: 18px;">新規ヒアリング回答</h2>
  </div>
  <div style="border: 1px solid #e5e7eb; border-top: none; padding: 20px; border-radius: 0 0 12px 12px;">
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <tr><td style="padding: 6px 0; color: #6b7280; width: 100px;">お名前</td><td style="padding: 6px 0; font-weight: bold;">${hearing.contact_name}</td></tr>
      <tr><td style="padding: 6px 0; color: #6b7280;">会社名</td><td style="padding: 6px 0;">${hearing.company_name || '未記入'}</td></tr>
      <tr><td style="padding: 6px 0; color: #6b7280;">業種</td><td style="padding: 6px 0;">${hearing.industry}</td></tr>
      ${hearing.contact_email ? `<tr><td style="padding: 6px 0; color: #6b7280;">メール</td><td style="padding: 6px 0;">${hearing.contact_email}</td></tr>` : ''}
      ${hearing.contact_phone ? `<tr><td style="padding: 6px 0; color: #6b7280;">電話</td><td style="padding: 6px 0;">${hearing.contact_phone}</td></tr>` : ''}
    </table>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />

    <p style="font-size: 13px; color: #6b7280; margin: 0 0 4px;">お困りごと</p>
    <p style="font-size: 14px; margin: 0 0 12px;">${challenges || 'なし'}</p>

    <p style="font-size: 13px; color: #6b7280; margin: 0 0 4px;">興味のあるアプリ</p>
    <p style="font-size: 14px; margin: 0 0 12px;">${apps || 'なし'}</p>

    ${hearing.similar_app_notes ? `<p style="font-size: 13px; color: #6b7280; margin: 0 0 4px;">補足</p><p style="font-size: 14px; margin: 0 0 12px;">${hearing.similar_app_notes}</p>` : ''}

    <div style="margin-top: 20px; text-align: center;">
      <a href="${adminUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">
        管理画面で確認する
      </a>
    </div>
  </div>
</div>
`.trim()

    // Gmail SMTP送信
    if (GMAIL_APP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: GMAIL_USER,
          pass: GMAIL_APP_PASSWORD,
        },
      })

      await transporter.sendMail({
        from: `"ヒアリングシート" <${GMAIL_USER}>`,
        to: NOTIFY_EMAIL,
        subject: `【新規回答】${hearing.contact_name}様（${hearing.industry}）`,
        text: textBody,
        html: htmlBody,
      })

      console.log('Email notification sent')
    } else {
      console.log('GMAIL_APP_PASSWORD not set, skipping email notification')
      console.log('Notification content:', textBody.substring(0, 200))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Notify error:', error)
    return NextResponse.json({ error: 'Notification failed' }, { status: 500 })
  }
}
