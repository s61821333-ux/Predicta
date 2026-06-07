import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import { fetchTransactions, fetchMonthlySummary } from '../../lib/db'
import { AiOrb } from '../../components/Logo/Logo'
import CatChip from '../../components/CatChip/CatChip'
import Icon from '../../components/Icon/Icon'

const PROMPTS = [
  'מה ההוצאה הגדולה שלי החודש?',
  'איך נראה החיסכון שלי?',
  'תן לי סיכום פיננסי של החודש',
  'מה הקטגוריה הכי יקרה שלי?',
]

const nf = new Intl.NumberFormat('en-US')
const fmt = n => '₪' + nf.format(Math.round(Math.abs(n)))

// Detect contextual action button from the user's message
function detectAction(text) {
  const lower = text.toLowerCase()
  if (/(דוח|דוחות|קטגוריות|פירוט|breakdown)/.test(lower))
    return { label: 'צפה בדוחות', to: '/reports' }
  if (/(הוסף|עסקה חדשה|הכנסה חדשה|הוצאה חדשה)/.test(lower))
    return { label: 'הוסף עסקה', to: '/new-transaction' }
  return null
}

function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: 5, padding: '4px 2px' }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ink-3)', animation: `td 1s ${i * 0.15}s infinite ease-in-out` }} />
      ))}
    </div>
  )
}

function Bubble({ msg, navigate }) {
  if (!msg.is_ai) return (
    <div style={{ alignSelf: 'flex-start', maxWidth: '82%' }}>
      <div style={{ borderRadius: '20px 20px 6px 20px', padding: '11px 15px', fontSize: 15.5, fontWeight: 500, lineHeight: 1.45, color: '#fff', background: 'linear-gradient(180deg, var(--blue-300), var(--blue))', boxShadow: '0 6px 16px var(--blue-glow)' }}>
        {msg.text}
      </div>
    </div>
  )
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', alignSelf: 'flex-end', maxWidth: '88%', flexDirection: 'row-reverse' }}>
      <AiOrb size={30} />
      <div className="glass" style={{ borderRadius: '20px 20px 20px 6px', padding: '13px 16px' }}>
        {msg.title && <div style={{ fontWeight: 800, fontSize: 15.5, marginBottom: 5 }}>{msg.title}</div>}
        <div style={{ fontSize: 15, lineHeight: 1.5, color: 'var(--ink)', whiteSpace: 'pre-wrap' }}>{msg.text}</div>
        {msg.stats && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
            {msg.stats.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px', borderRadius: 13, background: 'var(--glass-2)', border: '1px solid var(--hairline)' }}>
                <CatChip color={s.color} name={s.label} size={30} r={9} />
                <span style={{ flex: 1, fontWeight: 700, fontSize: 14 }}>{s.label}</span>
                <span className="tnum" style={{ fontWeight: 800, fontSize: 14 }}>{s.value}</span>
              </div>
            ))}
          </div>
        )}
        {msg.action && (
          <button className="tap" onClick={() => navigate(msg.action.to)}
            style={{ marginTop: 12, width: '100%', height: 44, borderRadius: 13, fontWeight: 700, fontSize: 14.5, color: '#fff', background: 'linear-gradient(180deg, var(--blue-300), var(--blue))', boxShadow: '0 6px 16px var(--blue-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
            <Icon name="spark" size={17} /> {msg.action.label}
          </button>
        )}
      </div>
    </div>
  )
}

export default function AIChatPage() {
  const { profile } = useUser()
  const navigate = useNavigate()
  const scrollRef = useRef(null)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [txs, setTxs] = useState([])
  const [monthlySummary, setMonthlySummary] = useState({ income: 0, expense: 0, net: 0 })
  const [chat, setChat] = useState([
    { is_ai: true, text: 'שלום! אני פְּרֶדִי, היועץ הפיננסי שלך. אני מנתח את הנתונים הפיננסיים האמיתיים שלך בזמן אמת. במה אפשר לעזור?' }
  ])

  useEffect(() => {
    if (!profile?.id) return
    const now = new Date()
    const month = now.getMonth() + 1
    const year = now.getFullYear()
    fetchTransactions(profile.id, { month, year }).then(({ data }) => setTxs(data || []))
    fetchMonthlySummary(profile.id, month, year).then(s => setMonthlySummary(s))
  }, [profile?.id])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [chat, typing])

  const send = async (txt) => {
    const v = (txt ?? input).trim()
    if (!v || typing) return

    setChat(c => [...c, { is_ai: false, text: v }])
    setInput('')
    setTyping(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: v,
          transactions: txs,
          summary: monthlySummary,
          chatHistory: chat,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'שגיאה לא ידועה')
      }

      const action = detectAction(v)
      setChat(c => [...c, { is_ai: true, text: data.text, action }])
    } catch (err) {
      console.error('Chat error:', err)
      setChat(c => [...c, { is_ai: true, text: 'מצטער, אירעה שגיאה. בדוק שה-API key מוגדר בהגדרות Vercel ונסה שוב.' }])
    } finally {
      setTyping(false)
    }
  }

  const showPrompts = chat.length <= 1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '2px 4px 14px' }}>
        <AiOrb size={44} />
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>פְּרֶדִי</h1>
          <div style={{ fontSize: 13, color: 'var(--pos)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--pos)' }} /> ניתוח בזמן אמת
          </div>
        </div>
        {txs.length > 0 && (
          <div style={{ marginRight: 'auto', fontSize: 12, color: 'var(--ink-2)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Icon name="check" size={13} sw={2.5} style={{ color: 'var(--pos)' }} />
            {txs.length} עסקאות • {fmt(monthlySummary.expense)} הוצאות
          </div>
        )}
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14, padding: '8px 2px', minHeight: 0 }}>
        {chat.map((msg, i) => <Bubble key={i} msg={msg} navigate={navigate} />)}
        {typing && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexDirection: 'row-reverse' }}>
            <AiOrb size={30} thinking />
            <div className="glass" style={{ borderRadius: '20px 20px 20px 6px', padding: '12px 16px' }}><TypingDots /></div>
          </div>
        )}
      </div>

      {showPrompts && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: '10px 2px' }}>
          {PROMPTS.map(p => (
            <button key={p} className="chip tap" onClick={() => send(p)} style={{ height: 'auto', padding: '9px 13px', lineHeight: 1.3 }}>{p}</button>
          ))}
        </div>
      )}

      <div className="glass glass-strong" style={{ borderRadius: 22, padding: 7, display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="שאל את פרדי כל דבר…"
          disabled={typing}
          style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--ink)', fontSize: 16, padding: '0 12px', opacity: typing ? 0.5 : 1 }} />
        <button className="tap" onClick={() => send()} disabled={typing || !input.trim()} aria-label="שלח"
          style={{ width: 44, height: 44, borderRadius: 14, display: 'grid', placeItems: 'center', color: '#fff', background: input.trim() && !typing ? 'linear-gradient(180deg, var(--blue-300), var(--blue))' : 'var(--hairline)', boxShadow: input.trim() && !typing ? '0 6px 16px var(--blue-glow)' : 'none', transition: 'all 0.2s' }}>
          <Icon name="send2" size={22} sw={2.2} />
        </button>
      </div>
    </div>
  )
}
