import Anthropic from '@anthropic-ai/sdk'

const nf = new Intl.NumberFormat('en-US')
const fmt = n => '₪' + nf.format(Math.round(Math.abs(n)))

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { message, transactions = [], summary = {}, chatHistory = [] } = req.body ?? {}

  if (!message) {
    return res.status(400).json({ error: 'Message required' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY is not configured' })
  }

  const client = new Anthropic({ apiKey })

  const { income = 0, expense = 0, net = 0 } = summary
  const savingsRate = income > 0 ? Math.round((net / income) * 100) : 0

  // Summarize spending by category
  const byCat = {}
  for (const t of transactions) {
    if (t.type !== 'expense') continue
    const name = t.category?.name || 'אחר'
    byCat[name] = (byCat[name] ?? 0) + Number(t.amount)
  }
  const topCategories = Object.entries(byCat)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([cat, amt]) => `  • ${cat}: ${fmt(amt)}`)
    .join('\n')

  const recentTxs = transactions.slice(0, 12).map(t =>
    `  ${t.date?.slice(0, 10)} | ${t.type === 'income' ? '+' : '-'}${fmt(t.amount)} | ${t.category?.name || 'ללא קטגוריה'}${t.description ? ` | ${t.description}` : ''}`
  ).join('\n')

  const systemPrompt = `אתה פְּרֶדִי - היועץ הפיננסי האישי של המשתמש באפליקציית Predicta.
אתה מנתח נתונים פיננסיים אמיתיים ומספק תובנות חכמות ומועילות.

נתוני החודש הנוכחי של המשתמש:
הכנסות: ${fmt(income)}
הוצאות: ${fmt(expense)}
נטו: ${fmt(net)} ${net >= 0 ? '(חיסכון ✅)' : '(גירעון ⚠️)'}
שיעור חיסכון: ${savingsRate}%

הוצאות לפי קטגוריה:
${topCategories || '  (אין נתונים)'}

עסקאות אחרונות:
${recentTxs || '  (אין עסקאות)'}

כללים לתשובות:
- ענה תמיד בעברית
- השתמש אך ורק בנתונים האמיתיים שניתנו לך - אל תמציא מספרים
- היה ממוקד: 2-4 משפטים, אלא אם ביקשו פירוט מפורש
- סגנון: חם, מקצועי, עם תובנה אחת מעשית
- אם נשאלת על נתון שאין לך - אמור זאת בכנות
- השתמש ב-₪ למטבע`

  const messages = chatHistory
    .filter(m => m.text)
    .map(m => ({ role: m.is_ai ? 'assistant' : 'user', content: m.text }))

  messages.push({ role: 'user', content: message })

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 512,
      system: systemPrompt,
      messages,
    })

    const text = response.content[0]?.text ?? 'מצטער, לא הצלחתי לעבד את הבקשה.'
    return res.status(200).json({ text })
  } catch (err) {
    console.error('Claude API error:', err.message)
    return res.status(500).json({ error: 'שגיאה בשירות ה-AI', details: err.message })
  }
}
