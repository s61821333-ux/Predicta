import { useState } from 'react'

const HE_DAYS = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳']
const HE_MONTHS = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר']
const nf = new Intl.NumberFormat('en-US')
function fmt(n) { return '₪' + nf.format(Math.round(Math.abs(n))) }

function toKey(dt) {
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`
}

export function FiveDayChart({ transactions = [] }) {
  const [active, setActive] = useState(null)
  const today = new Date()
  const days = []
  for (let i = 0; i < 5; i++) {
    const dt = new Date(today)
    dt.setDate(dt.getDate() - i)
    const key = toKey(dt)
    const total = transactions
      .filter(t => t.type === 'expense' && t.status === 'completed' && !t.is_temporary && t.date?.startsWith(key))
      .reduce((a, t) => a + Number(t.amount), 0)
    days.push({ key, total, label: HE_DAYS[dt.getDay()], today: i === 0 })
  }
  const max = Math.max(...days.map(d => d.total), 1)

  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', height: 130, padding: '4px 2px 0' }}>
      {days.map((dy, i) => {
        const h = Math.max((dy.total / max) * 100, 4)
        const on = active === i
        return (
          <button key={i} className="tap" onClick={() => setActive(on ? null : i)}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
            <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', flex: 1 }}>
              {on && dy.total > 0 && (
                <div className="tnum" style={{ position: 'absolute', top: -2, fontSize: 11, fontWeight: 800, background: 'var(--ink)', color: 'var(--bg)', padding: '3px 7px', borderRadius: 8, whiteSpace: 'nowrap' }}>
                  {fmt(dy.total)}
                </div>
              )}
              <div style={{
                width: '76%', maxWidth: 30, height: `${h}%`, borderRadius: 9,
                background: dy.today
                  ? 'linear-gradient(180deg, var(--blue-300), var(--blue))'
                  : (on ? 'var(--blue)' : 'rgba(45,111,240,0.26)'),
                boxShadow: dy.today ? '0 6px 14px var(--blue-glow)' : 'none',
                transition: 'height 0.5s cubic-bezier(0.32, 0.72, 0, 1)',
              }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: dy.today ? 800 : 600, color: dy.today ? 'var(--blue)' : 'var(--ink-3)' }}>{dy.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export function CashflowChart({ data = [] }) {
  const [active, setActive] = useState(null)
  const max = Math.max(...data.flatMap(x => [x.income, x.expense]), 1)

  return (
    <div>
      <div style={{ display: 'flex', gap: 14, justifyContent: 'flex-end', marginBottom: 12 }}>
        <Legend color="var(--pos)" label="הכנסות" />
        <Legend color="var(--neg)" label="הוצאות" />
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 150 }}>
        {data.map((mo, i) => {
          const on = active === i
          return (
            <button key={i} className="tap" onClick={() => setActive(on ? null : i)}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end', position: 'relative' }}>
              {on && (
                <div className="tnum" style={{ position: 'absolute', top: -6, fontSize: 10.5, fontWeight: 700, background: 'var(--ink)', color: 'var(--bg)', padding: '4px 8px', borderRadius: 9, whiteSpace: 'nowrap', zIndex: 2, lineHeight: 1.5 }}>
                  <span style={{ color: 'var(--pos)' }}>{fmt(mo.income)}</span> · <span style={{ color: 'var(--neg)' }}>{fmt(mo.expense)}</span>
                </div>
              )}
              <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: '100%', width: '100%', justifyContent: 'center' }}>
                <div style={{ width: '30%', maxWidth: 13, height: `${Math.max(mo.income / max * 100, 3)}%`, borderRadius: 6, background: 'rgba(24,184,154,0.85)' }} />
                <div style={{ width: '30%', maxWidth: 13, height: `${Math.max(mo.expense / max * 100, 3)}%`, borderRadius: 6, background: 'rgba(255,107,76,0.85)' }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: i === data.length - 1 ? 800 : 600, color: i === data.length - 1 ? 'var(--blue)' : 'var(--ink-3)' }}>
                {HE_MONTHS[mo.monthIndex]?.slice(0, 3) || ''}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Legend({ color, label }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--ink-2)', fontWeight: 600 }}>
      <i style={{ width: 11, height: 11, borderRadius: 4, background: color, display: 'block', fontStyle: 'normal' }} /> {label}
    </span>
  )
}
