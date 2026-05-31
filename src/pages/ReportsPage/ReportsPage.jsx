import { useEffect, useMemo, useState } from 'react'
import AppShell from '../../layouts/AppShell'
import GlassCard from '../../components/GlassCard/GlassCard'
import Badge from '../../components/Badge/Badge'
import StatWidget from '../../components/StatWidget/StatWidget'
import ProgressBar from '../../components/ProgressBar/ProgressBar'
import Button from '../../components/Button/Button'
import {
  fetchMonthlySummary,
  fetchCategoryBreakdown,
  fetchCashflowByMonth,
  getAuthUserId,
} from '../../lib/db'
import { formatCurrency, HEBREW_MONTHS } from '../../utils/format'
import './ReportsPage.css'

export default function ReportsPage() {
  const monthOptions = useMemo(() => {
    const now = new Date()
    const opts = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      opts.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        month: d.getMonth() + 1,
        year: d.getFullYear(),
        label: HEBREW_MONTHS[d.getMonth()],
      })
    }
    return opts
  }, [])

  const [selectedKey, setSelectedKey] = useState(() => monthOptions[monthOptions.length - 1]?.key)
  const [filterType, setFilterType] = useState('all')
  const [summary, setSummary] = useState({ income: 0, expense: 0, net: 0 })
  const [breakdown, setBreakdown] = useState([])
  const [cashflow, setCashflow] = useState([])
  const [loading, setLoading] = useState(true)

  const selected = monthOptions.find((m) => m.key === selectedKey) ?? monthOptions[monthOptions.length - 1]

  useEffect(() => {
    async function load() {
      const userId = await getAuthUserId()
      if (!userId || !selected) return

      const [
        { income, expense, net },
        { data: catData },
        { data: flowData },
      ] = await Promise.all([
        fetchMonthlySummary(userId, selected.month, selected.year),
        fetchCategoryBreakdown(userId, selected.month, selected.year),
        fetchCashflowByMonth(userId, 6),
      ])

      setSummary({ income, expense, net })
      setBreakdown(catData)
      setCashflow(flowData)
      setLoading(false)
    }

    setLoading(true)
    load()
  }, [selectedKey, selected])

  const maxVal = Math.max(
    1,
    ...cashflow.map((b) => Math.max(b.income, b.expense)),
  )

  return (
    <AppShell>
      <div className="page-header">
        <h1 className="text-headline-lg">דוחות</h1>
        <p className="text-body-md page-subtitle">נתונים מחושבים מעסקאות Supabase</p>
      </div>

      <div className="reports-months hide-scrollbar">
        {monthOptions.map((m) => (
          <button
            key={m.key}
            type="button"
            className={`reports-month-btn${selectedKey === m.key ? ' reports-month-btn--active' : ''}`}
            onClick={() => setSelectedKey(m.key)}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="reports-stats">
        <StatWidget
          label="הכנסות"
          value={loading ? '—' : formatCurrency(summary.income)}
          accent={false}
        />
        <StatWidget
          label="הוצאות"
          value={loading ? '—' : formatCurrency(summary.expense)}
          accent
        />
        <StatWidget
          label="נטו"
          value={loading ? '—' : formatCurrency(summary.net)}
          accent={false}
        />
      </div>

      <GlassCard className="reports-chart-card">
        <div className="reports-chart__header">
          <span className="text-label-bold">תזרים מזומנים — 6 חודשים</span>
          <Badge color="primary">מ-Supabase</Badge>
        </div>

        <div className="reports-cashflow">
          {cashflow.map(({ monthIndex, income, expense, forecast }) => (
            <div
              key={monthIndex}
              className={`reports-cashflow__col${forecast ? ' reports-cashflow__col--forecast' : ''}`}
            >
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
              <span className="text-label-light reports-cashflow__label">
                {HEBREW_MONTHS[monthIndex]?.slice(0, 3)}
              </span>
            </div>
          ))}
        </div>

        <div className="reports-chart__legend">
          <span className="reports-legend__dot" style={{ background: '#00a060' }} />
          <span className="text-label-light">הכנסות</span>
          <span className="reports-legend__dot" style={{ background: 'var(--color-primary-container)' }} />
          <span className="text-label-light">הוצאות</span>
        </div>
      </GlassCard>

      <div className="reports-type-filter glass-recessed">
        {['all', 'expense', 'income'].map((t) => (
          <button
            key={t}
            type="button"
            className={`reports-filter-btn${filterType === t ? ' reports-filter-btn--active' : ''}`}
            onClick={() => setFilterType(t)}
          >
            {t === 'all' ? 'הכל' : t === 'expense' ? 'הוצאות' : 'הכנסות'}
          </button>
        ))}
      </div>

      <GlassCard className="reports-cats-card">
        <span className="text-headline-md">פירוט קטגוריות — {selected?.label}</span>
        {loading ? (
          <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>טוען...</p>
        ) : breakdown.length === 0 ? (
          <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
            אין הוצאות לחודש זה
          </p>
        ) : (
          breakdown.map(({ cat, pct, amount, color }) => (
            <div key={cat} className="reports-cat-row">
              <div className="reports-cat__label-row">
                <div className="reports-cat__dot" style={{ background: color }} />
                <span className="text-label-bold">{cat}</span>
                <span className="text-label-light reports-cat__pct">{pct}%</span>
                <span className="text-label-bold" dir="ltr" style={{ marginRight: 'auto' }}>
                  {formatCurrency(amount)}
                </span>
              </div>
              <ProgressBar value={pct} />
            </div>
          ))
        )}
      </GlassCard>

      <Button variant="glass" full icon="download">
        ייצוא PDF
      </Button>
    </AppShell>
  )
}
