import { useEffect, useState } from 'react'
import { useUser } from '../../context/UserContext'
import { fetchMonthlySummary, fetchCategoryBreakdown, fetchCashflowByMonth } from '../../lib/db'
import SectionHead from '../../components/SectionHead/SectionHead'
import CatChip from '../../components/CatChip/CatChip'
import { CashflowChart } from '../../components/Charts/Charts'
import Icon from '../../components/Icon/Icon'

const nf = new Intl.NumberFormat('en-US')
const fmt = n => '₪' + nf.format(Math.round(Math.abs(n)))
const HE_MONTHS = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר']

export default function ReportsPage() {
  const { profile } = useUser()
  const [wide, setWide] = useState(window.innerWidth >= 900)
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year]  = useState(now.getFullYear())
  const [summary, setSummary]     = useState({ income: 0, expense: 0, net: 0 })
  const [breakdown, setBreakdown] = useState([])
  const [cashflow, setCashflow]   = useState([])

  useEffect(() => {
    const on = () => setWide(window.innerWidth >= 900)
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])

  useEffect(() => {
    if (!profile?.id) return
    fetchMonthlySummary(profile.id, month, year).then(s => setSummary(s))
    fetchCategoryBreakdown(profile.id, month, year).then(({ data }) => setBreakdown(data || []))
  }, [profile?.id, month, year])

  useEffect(() => {
    if (!profile?.id) return
    fetchCashflowByMonth(profile.id, 6).then(({ data }) => setCashflow(data || []))
  }, [profile?.id])

  const canBack = month > 1
  const canFwd  = month < now.getMonth() + 1 && year === now.getFullYear()

  const selector = (
    <div className="glass" style={{ borderRadius: 20, padding: '8px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <button className="tap" disabled={!canBack} onClick={() => setMonth(m => m - 1)}
        style={{ width: 40, height: 40, borderRadius: 12, display: 'grid', placeItems: 'center', color: canBack ? 'var(--ink)' : 'var(--ink-3)', background: 'var(--glass-2)', opacity: canBack ? 1 : 0.4 }}>
        <Icon name="chevron" size={20} sw={2.3} />
      </button>
      <div style={{ fontWeight: 800, fontSize: 17 }}>{HE_MONTHS[month - 1]} {year}</div>
      <button className="tap" disabled={!canFwd} onClick={() => setMonth(m => m + 1)}
        style={{ width: 40, height: 40, borderRadius: 12, display: 'grid', placeItems: 'center', color: canFwd ? 'var(--ink)' : 'var(--ink-3)', background: 'var(--glass-2)', opacity: canFwd ? 1 : 0.4 }}>
        <Icon name="chevronL" size={20} sw={2.3} />
      </button>
    </div>
  )

  const chips = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
      {[
        { label: 'הכנסות', value: fmt(summary.income),  color: 'var(--pos)' },
        { label: 'הוצאות', value: fmt(summary.expense), color: 'var(--neg)' },
        { label: 'מאזן',   value: (summary.net < 0 ? '−' : '') + fmt(summary.net), color: summary.net >= 0 ? 'var(--blue)' : 'var(--neg)' },
      ].map(s => (
        <div key={s.label} className="glass" style={{ borderRadius: 18, padding: '13px 12px', textAlign: 'center' }}>
          <div style={{ fontSize: 12.5, color: 'var(--ink-2)', fontWeight: 600 }}>{s.label}</div>
          <div className="tnum" style={{ fontSize: 18, fontWeight: 800, marginTop: 4, color: s.color }}>{s.value}</div>
        </div>
      ))}
    </div>
  )

  const cashflowCard = (
    <div className="glass" style={{ borderRadius: 24, padding: 18 }}>
      <SectionHead title="תזרים 6 חודשים" />
      <CashflowChart data={cashflow} />
    </div>
  )

  const breakdownCard = (
    <div className="glass" style={{ borderRadius: 24, padding: 18 }}>
      <SectionHead title="פילוח לפי קטגוריה" />
      {breakdown.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--ink-2)' }}>
          <div style={{ fontSize: 30, marginBottom: 8 }}>🫧</div>
          <div style={{ fontWeight: 700 }}>לא נמצאו הוצאות לחודש זה</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          {breakdown.map(item => (
            <div key={item.cat}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 7 }}>
                <CatChip color={item.color} name={item.cat} size={36} r={12} />
                <span style={{ fontWeight: 700, fontSize: 14.5, flex: 1 }}>{item.cat}</span>
                <span className="tnum" style={{ fontWeight: 800, fontSize: 14.5 }}>{fmt(item.amount)}</span>
                <span className="tnum" style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink-2)', width: 40, textAlign: 'end' }}>{item.pct}%</span>
              </div>
              <div className="bar"><i style={{ width: `${item.pct}%`, background: item.color }} /></div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h1 style={{ margin: '2px 4px', fontSize: 26, fontWeight: 800 }}>דוחות</h1>
      {selector}{chips}
      {wide
        ? <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>{cashflowCard}{breakdownCard}</div>
        : <>{cashflowCard}{breakdownCard}</>}
    </div>
  )
}
