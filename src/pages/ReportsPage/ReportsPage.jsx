import { useState } from 'react'
import AppShell      from '../../layouts/AppShell'
import GlassCard     from '../../components/GlassCard/GlassCard'
import Badge         from '../../components/Badge/Badge'
import StatWidget    from '../../components/StatWidget/StatWidget'
import ProgressBar   from '../../components/ProgressBar/ProgressBar'
import Button        from '../../components/Button/Button'
import './ReportsPage.css'

const MONTHS = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני']

const CAT_BREAKDOWN = [
  { cat: 'אוכל',     pct: 34, amount: '₪2,840', color: '#ff6b00' },
  { cat: 'תחבורה',   pct: 18, amount: '₪1,500', color: '#5e5e5e' },
  { cat: 'קניות',    pct: 22, amount: '₪1,840', color: '#5d5f5f' },
  { cat: 'בילויים',  pct: 14, amount: '₪1,170', color: '#a04100' },
  { cat: 'אחר',      pct: 12, amount: '₪1,000', color: '#8e7164' },
]

const CASHFLOW_BARS = [
  { month: 'ינו', income: 12000, expense: 8500 },
  { month: 'פבר', income: 12000, expense: 9200 },
  { month: 'מרץ', income: 14000, expense: 7800 },
  { month: 'אפר', income: 13500, expense: 10100 },
  { month: 'מאי', income: 14200, expense: 8340 },
  { month: 'יוני', income: 13000, expense: 7600, forecast: true },
]

export default function ReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState('מאי')
  const [filterType, setFilterType] = useState('all')

  const maxVal = Math.max(...CASHFLOW_BARS.map(b => Math.max(b.income, b.expense)))

  return (
    <AppShell>
      <div className="page-header">
        <h1 className="text-headline-lg">דוחות</h1>
        <p className="text-body-md page-subtitle">ניתוח תזרים מזומנים</p>
      </div>

      {/* ── Month selector ── */}
      <div className="reports-months hide-scrollbar">
        {MONTHS.map(m => (
          <button
            key={m}
            className={`reports-month-btn${selectedMonth === m ? ' reports-month-btn--active' : ''}`}
            onClick={() => setSelectedMonth(m)}
          >
            {m}
          </button>
        ))}
      </div>

      {/* ── Summary stats ── */}
      <div className="reports-stats">
        <StatWidget label="הכנסות" value="₪14,200" accent={false} />
        <StatWidget label="הוצאות" value="₪8,340"  accent={true}  />
        <StatWidget label="נטו"    value="₪5,860"  accent={false} />
      </div>

      {/* ── Cash-flow bar chart ── */}
      <GlassCard className="reports-chart-card">
        <div className="reports-chart__header">
          <span className="text-label-bold">תזרים מזומנים — 6 חודשים</span>
          <Badge color="primary">תחזית כלולה</Badge>
        </div>

        <div className="reports-cashflow">
          {CASHFLOW_BARS.map(({ month, income, expense, forecast }) => (
            <div key={month} className={`reports-cashflow__col${forecast ? ' reports-cashflow__col--forecast' : ''}`}>
              <div className="reports-cashflow__bars">
                <div
                  className="reports-cashflow__bar reports-cashflow__bar--income"
                  style={{ height: `${(income / maxVal) * 100}%` }}
                />
                <div
                  className="reports-cashflow__bar reports-cashflow__bar--expense"
                  style={{ height: `${(expense / maxVal) * 100}%` }}
                />
              </div>
              <span className="text-label-light reports-cashflow__label">{month}</span>
              {forecast && <span className="text-label-light reports-cashflow__forecast-tag">תחזית</span>}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="reports-chart__legend">
          <span className="reports-legend__dot" style={{ background: '#00a060' }} />
          <span className="text-label-light">הכנסות</span>
          <span className="reports-legend__dot" style={{ background: 'var(--color-primary-container)' }} />
          <span className="text-label-light">הוצאות</span>
        </div>
      </GlassCard>

      {/* ── Type filter ── */}
      <div className="reports-type-filter glass-recessed">
        {['all', 'expense', 'income'].map(t => (
          <button
            key={t}
            className={`reports-filter-btn${filterType === t ? ' reports-filter-btn--active' : ''}`}
            onClick={() => setFilterType(t)}
          >
            {t === 'all' ? 'הכל' : t === 'expense' ? 'הוצאות' : 'הכנסות'}
          </button>
        ))}
      </div>

      {/* ── Category breakdown ── */}
      <GlassCard className="reports-cats-card">
        <span className="text-headline-md">פירוט קטגוריות</span>
        {CAT_BREAKDOWN.map(({ cat, pct, amount, color }) => (
          <div key={cat} className="reports-cat-row">
            <div className="reports-cat__label-row">
              <div className="reports-cat__dot" style={{ background: color }} />
              <span className="text-label-bold">{cat}</span>
              <span className="text-label-light reports-cat__pct">{pct}%</span>
              <span className="text-label-bold" dir="ltr" style={{ marginRight: 'auto' }}>{amount}</span>
            </div>
            <ProgressBar value={pct} />
          </div>
        ))}
      </GlassCard>

      {/* ── Export ── */}
      <Button variant="glass" full icon="download">
        ייצוא PDF
      </Button>
    </AppShell>
  )
}
