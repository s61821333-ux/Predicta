import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import {
  fetchTransactions, fetchTotalBalance,
  fetchMonthlySummary, fetchBudgetsWithSpent,
} from '../../lib/db'
import CatChip from '../../components/CatChip/CatChip'
import SectionHead from '../../components/SectionHead/SectionHead'
import TxRow from '../../components/TxRow/TxRow'
import { FiveDayChart } from '../../components/Charts/Charts'
import Icon from '../../components/Icon/Icon'

const nf = new Intl.NumberFormat('en-US')
const fmt = n => '₪' + nf.format(Math.round(Math.abs(n)))
const HE_MONTHS = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר']

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'בוקר טוב'
  if (h < 17) return 'צהריים טובים'
  if (h < 21) return 'ערב טוב'
  return 'לילה טוב'
}

function budgetColor(p) {
  if (p > 1) return 'var(--neg)'
  if (p > 0.9) return 'var(--warn)'
  if (p > 0.7) return 'var(--warn)'
  return 'var(--blue)'
}

export default function DashboardPage() {
  const { profile } = useUser()
  const navigate = useNavigate()
  const [balance, setBalance] = useState(0)
  const [income, setIncome] = useState(0)
  const [expense, setExpense] = useState(0)
  const [budgets, setBudgets] = useState([])
  const [recent, setRecent] = useState([])
  const [allTxs, setAllTxs] = useState([])
  const [wide, setWide] = useState(window.innerWidth >= 900)

  useEffect(() => {
    const on = () => setWide(window.innerWidth >= 900)
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])

  useEffect(() => {
    if (!profile?.id) return
    const now = new Date()
    const month = now.getMonth() + 1
    const year = now.getFullYear()
    fetchTotalBalance(profile.id).then(({ balance: b }) => setBalance(b || 0))
    fetchMonthlySummary(profile.id, month, year).then(s => { setIncome(s.income || 0); setExpense(s.expense || 0) })
    fetchBudgetsWithSpent(profile.id, month, year).then(({ data }) => setBudgets(data || []))
    fetchTransactions(profile.id, { limit: 5, status: 'completed' }).then(({ data }) => setRecent(data || []))
    fetchTransactions(profile.id).then(({ data }) => setAllTxs(data || []))
  }, [profile?.id])

  const net = income - expense
  const now = new Date()

  const balanceCard = (
    <div className="glass" style={{ borderRadius: 28, padding: 24, position: 'relative', overflow: 'hidden', background: 'linear-gradient(150deg, #4D8BFF 0%, #2D6FF0 46%, #1A49AE 100%)', color: '#fff', boxShadow: '0 18px 44px var(--blue-glow)' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(80% 70% at 80% -10%, rgba(255,255,255,0.32), transparent 60%)', pointerEvents: 'none' }} />
      <svg viewBox="0 0 400 130" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', height: 88, opacity: 0.9, pointerEvents: 'none' }}>
        <defs>
          <linearGradient id="ribfill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(255,255,255,0.28)"/><stop offset="1" stopColor="rgba(255,255,255,0)"/>
          </linearGradient>
        </defs>
        <path d="M0,96 C50,90 78,58 120,62 C165,66 188,30 235,38 C285,46 320,12 400,8 L400,130 L0,130 Z" fill="url(#ribfill)"/>
        <path d="M0,96 C50,90 78,58 120,62 C165,66 188,30 235,38 C285,46 320,12 400,8" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="400" cy="8" r="4.5" fill="#fff"/>
      </svg>
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: 0.85, fontSize: 14, fontWeight: 600 }}>
          <Icon name="wallet" size={18} /> היתרה הכוללת
        </div>
        <div className="display" style={{ fontSize: wide ? 54 : 47, fontWeight: 700, margin: '6px 0 14px', lineHeight: 1 }}>
          {fmt(balance)}
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 13px', borderRadius: 999, background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', fontWeight: 700, fontSize: 14 }}>
            <Icon name={net >= 0 ? 'arrowUp' : 'arrowDown'} size={16} sw={2.4} />
            {net >= 0 ? '+' : '−'}{fmt(net)} החודש
          </span>
          <span style={{ opacity: 0.8, fontSize: 13.5, fontWeight: 600 }}>{HE_MONTHS[now.getMonth()]} {now.getFullYear()}</span>
        </div>
      </div>
    </div>
  )

  const summary = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {[
        { icon: 'arrowDown', label: 'הכנסות', value: fmt(income), color: 'var(--pos)', bg: 'rgba(24,184,154,0.15)' },
        { icon: 'arrowUp',   label: 'הוצאות', value: fmt(expense), color: 'var(--neg)', bg: 'rgba(255,107,76,0.15)' },
      ].map(s => (
        <div key={s.label} className="glass" style={{ borderRadius: 22, padding: '16px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, color: 'var(--ink-2)', fontSize: 13.5, fontWeight: 600 }}>
            <span style={{ width: 28, height: 28, borderRadius: 9, display: 'grid', placeItems: 'center', color: s.color, background: s.bg }}><Icon name={s.icon} size={17} sw={2.3} /></span>
            {s.label}
          </div>
          <div className="tnum" style={{ fontSize: 24, fontWeight: 800, marginTop: 9, color: s.color }}>{s.value}</div>
        </div>
      ))}
    </div>
  )

  const chart = (
    <div className="glass" style={{ borderRadius: 24, padding: '18px 18px 14px' }}>
      <SectionHead title="5 ימים אחרונים" />
      <FiveDayChart transactions={allTxs} />
    </div>
  )

  const budgetsCard = (
    <div className="glass" style={{ borderRadius: 24, padding: 18 }}>
      <SectionHead title="תקציבים" action="לדוחות" onAction={() => navigate('/reports')} />
      {budgets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px 10px', color: 'var(--ink-2)', fontWeight: 600 }}>אין תקציבים מוגדרים</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {budgets.map(b => {
            const p = b.budget > 0 ? b.spent / b.budget : 0
            return (
              <div key={b.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 7 }}>
                  <CatChip color={b.color} name={b.label} size={34} r={11} />
                  <span style={{ fontWeight: 700, fontSize: 14.5, flex: 1 }}>{b.label}</span>
                  <span className="tnum" style={{ fontSize: 13.5, fontWeight: 700, color: p > 1 ? 'var(--neg)' : 'var(--ink-2)' }}>
                    {fmt(b.spent)} <span style={{ color: 'var(--ink-3)' }}>/ {fmt(b.budget)}</span>
                  </span>
                </div>
                <div className="bar"><i style={{ width: `${Math.min(p, 1) * 100}%`, background: budgetColor(p) }} /></div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )

  const recentCard = (
    <div className="glass" style={{ borderRadius: 24, padding: 18 }}>
      <SectionHead title="עסקאות אחרונות" action="הצג הכל" onAction={() => navigate('/search')} />
      {recent.length === 0
        ? <div style={{ textAlign: 'center', padding: '20px 10px', color: 'var(--ink-2)', fontWeight: 600 }}>אין עסקאות עדיין</div>
        : <div>{recent.map(t => <TxRow key={t.id} t={t} expandable={false} />)}</div>
      }
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ padding: '2px 4px' }}>
        <div style={{ fontSize: 14, color: 'var(--ink-2)', fontWeight: 600 }}>{greeting()},</div>
        <h1 style={{ margin: '2px 0 0', fontSize: 27, fontWeight: 800, letterSpacing: '-0.02em' }}>{profile?.first_name || 'שלום'} 👋</h1>
      </div>
      {wide ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 16, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>{balanceCard}{summary}{chart}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>{budgetsCard}{recentCard}</div>
        </div>
      ) : <>{balanceCard}{summary}{chart}{budgetsCard}{recentCard}</>}
    </div>
  )
}
