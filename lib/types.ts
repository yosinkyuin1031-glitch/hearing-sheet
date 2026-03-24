export interface PortfolioApp {
  id: string
  name: string
  category: string
  description: string
  features: string[]
  image_url: string | null
  demo_url: string | null
  sort_order: number
  is_active: boolean
}

export interface HearingQuestion {
  id: string
  step: number
  question_key: string
  question_text: string
  question_type: 'text' | 'textarea' | 'select' | 'multi_select' | 'radio'
  options: string[] | null
  is_required: boolean
  condition_app: string | null
  sort_order: number
}

export interface HearingResponse {
  id: string
  company_name: string | null
  contact_name: string | null
  contact_email: string | null
  contact_phone: string | null
  industry: string | null
  challenges: string[]
  selected_apps: string[]
  similar_app_notes: string | null
  detailed_answers: Record<string, string>
  ai_spec: string | null
  status: 'draft' | 'submitted' | 'reviewed' | 'completed'
  created_at: string
  updated_at: string
}

export interface HearingFormData {
  companyName: string
  contactName: string
  contactEmail: string
  contactPhone: string
  industry: string
  challenges: string[]
  selectedApps: string[]
  similarAppNotes: string
  detailedAnswers: Record<string, string>
}

export const INDUSTRIES = [
  '整体院・整骨院',
  '鍼灸院',
  '歯科医院',
  '美容サロン',
  '飲食店',
  'フィットネス・ジム',
  '不動産',
  '小売・EC',
  '介護・福祉',
  '教育・スクール',
  '士業（税理士・弁護士等）',
  'その他',
]

export const CHALLENGES = [
  { id: 'customer_mgmt', label: '顧客・患者の情報管理が大変' },
  { id: 'reservation', label: '予約管理を楽にしたい' },
  { id: 'marketing', label: '集客・新規を増やしたい' },
  { id: 'sales', label: '売上・経営数字を把握したい' },
  { id: 'staff', label: 'スタッフ管理・シフトを効率化したい' },
  { id: 'paper', label: '紙の書類をデジタル化したい' },
  { id: 'communication', label: 'お客様とのコミュニケーションを改善したい' },
  { id: 'ec', label: '物販・オンライン販売をしたい' },
  { id: 'other', label: 'その他（具体的にお聞かせください）' },
]

export const APP_CATEGORIES = [
  '顧客・患者管理',
  '予約・受付',
  '検査・診断ツール',
  '無料診断・チェック',
  'サイト・LP制作',
  '集客・マーケティング',
  'LINE・コミュニケーション',
  '経営・業務管理',
  '健康管理・患者向け',
  'その他・便利ツール',
]
