import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import { fetchTransactions, fetchMonthlySummary } from '../../lib/db'
import { AiOrb } from '../../components/Logo/Logo'
import CatChip from '../../components/CatChip/CatChip'
import Icon from '../../components/Icon/Icon'

const PROMPTS = [
  'מה ההוצאה הגדולה שלי החודש?',
  'איך אני בהשוואה לחודש שעבר?',
  'כמה חסכתי השנה?',
  'מה הקטגוריה הכי יקרה שלי?',
]

const nf = new Intl.NumberFormat('en-US')
const fmt = n => '₪' + nf.format(Math.round(Math.abs(n)))

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
        <div style={{ fontSize: 15, lineHeight: 1.5, color: 'var(--ink)' }}>{msg.text}</div>
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

function buildReply(text, txs, summary) {
  const lower = text.toLowerCase()
  const { income, expense } = summary

  const byCat = {}
  txs.forEach(t => {
    if (t.type !== 'expense') return
    const name = t.category?.name || 'אחר'
    const color = t.category?.color_hex || '#8A93A8'
    if (!byCat[name]) byCat[name] = { amt: 0, color }
    byCat[name].amt += Number(t.amount)
  })
  const top = Object.entries(byCat).sort((a, b) => b[1].amt - a[1].amt).map(([label, { amt, color }]) => ({ label, value: fmt(amt), color }))

  if (/(הגדול|יקר|הכי הרבה|על מה)/.test(lower)) {
    return {
      title: top[0] ? `ההוצאה הגדולה שלך: ${top[0].label}` : 'לא נמצאו הוצאות',
      text: top[0] ? `הוצאת ${top[0].value} על ${top[0].label} החודש — ${expense > 0 ? Math.round((Object.values(byCat)[0]?.amt / expense) * 100) : 0}% מסך ההוצאות.` : 'אין נתוני הוצאות לחודש זה.',
      stats: top.slice(0, 3),
      action: { label: 'צפה בדוח מלא', to: '/reports' },
    }
  }
  if (/(חסכ|חיסכון|נשאר|יתרה)/.test(lower)) {
    const net = income - expense
    const rate = income > 0 ? Math.round((net / income) * 100) : 0
    return {
      title: 'החיסכון שלך החודש',
      text: `הכנסת ${fmt(income)} והוצאת ${fmt(expense)}. חסכת ${fmt(net)} — שיעור חיסכון של ${rate}%. ${rate > 20 ? 'כל הכבוד! 🌱' : 'יש מקום לשיפור 💪'}`,
    }
  }
  if (/(תקציב|חרג|הגעתי)/.test(lower)) {
    return { text: 'עבור לדף הדוחות כדי לראות את מצב התקציבים שלך.', action: { label: 'לדוחות', to: '/reports' } }
  }
  return { text: 'אני כאן כדי לעזור לך להבין את הכסף שלך. נסה לשאול אותי על הוצאות, חיסכון, או תקציבים 👇' }
}

export default function AIChatPage() {
  const { profile } = useUser()
  const navigate = useNavigate()
  const scrollRef = useRef(null)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [txs, setTxs] = useState([])
  const [monthlySummary, setMonthlySummary] = useState({ income: 0, expense: 0 })
  const [chat, setChat] = useState([
    { is_ai: true, text: 'שלום! אני פְּרֶדִי, היועץ הפיננסי שלך. אני יכול לנתח את ההוצאות, החיסכון והתקציבים שלך. במה אפשר לעזור?' }
  ])

  useEffect(() => {
    if (!profile?.id) return
    const now = new Date()
    fetchTransactions(profile.id, { month: now.getMonth() + 1, year: now.getFullYear() }).then(({ data }) => setTxs(data || []))
    fetchMonthlySummary(profile.id, now.getMonth() + 1, now.getFullYear()).then(s => setMonthlySummary(s))
  }, [profile?.id])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [chat, typing])

  const send = (txt) => {
    const v = (txt ?? input).trim()
    if (!v) return
    setChat(c => [...c, { is_ai: false, text: v }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setChat(c => [...c, { is_ai: true, ...buildReply(v, txs, monthlySummary) }])
    }, 950)
  }

  const showPrompts = chat.length <= 1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '2px 4px 14px' }}>
        <AiOrb size={44} />
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>פְּרֶדִי</h1>
          <div style={{ fontSize: 13, color: 'var(--pos)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--pos)' }} /> היועץ הפיננסי שלך
          </div>
        </div>
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14, padding: '8px 2px', minHeight: 0 }}>
        {chat.map((msg, i) => <Bubble key={i} msg={msg} navigate={navigate} />)}
        {typing && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
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
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="שאל את פרדי כל דבר…"
          style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--ink)', fontSize: 16, padding: '0 12px' }} />
        <button className="tap" onClick={() => send()} aria-label="שלח"
          style={{ width: 44, height: 44, borderRadius: 14, display: 'grid', placeItems: 'center', color: '#fff', background: input.trim() ? 'linear-gradient(180deg, var(--blue-300), var(--blue))' : 'var(--hairline)', boxShadow: input.trim() ? '0 6px 16px var(--blue-glow)' : 'none', transition: 'all 0.2s' }}>
          <Icon name="send2" size={22} sw={2.2} />
        </button>
      </div>
    </div>
  )
}
