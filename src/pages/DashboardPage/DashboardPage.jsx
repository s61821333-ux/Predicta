import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../../layouts/AppShell'
import BalanceCard from '../../components/BalanceCard/BalanceCard'
import SpendingChart from '../../components/SpendingChart/SpendingChart'
import ForecastChart from '../../components/ForecastChart/ForecastChart'
import GlassCard from '../../components/GlassCard/GlassCard'
import Badge from '../../components/Badge/Badge'
import Button from '../../components/Button/Button'
import ProgressBar from '../../components/ProgressBar/ProgressBar'
import { useUser } from '../../context/UserContext'
import {
  fetchTotalBalance,
  fetchMonthlySummary,
  fetchTransactions,
  fetchBudgetsWithSpent,
  getAuthUserId,
} from '../../lib/db'
import {
  formatCurrency,
  formatTxnAmount,
  formatDateShort,
  getGreeting,
  getCurrentMonthYear,
  getHebrewMonthName,
} from '../../utils/format'
import './DashboardPage.css'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { profile, loading: userLoading } = useUser()
  const [loading, setLoading] = useState(true)
  const [balance, setBalance] = useState(0)
  const [monthly, setMonthly] = useState({ income: 0, expense: 0, net: 0 })
  const [recent, setRecent] = useState([])
  const [budgets, setBudgets] = useState([])
  const { month, year } = getCurrentMonthYear()

  useEffect(() => {
    async function load() {
      const userId = await getAuthUserId()
      if (!userId) return

      const [
        { balance: bal },
        { income, expense, net },
        { data: txns },
        { data: budgetRows },
      ] = await Promise.all([
        fetchTotalBalance(userId),
        fetchMonthlySummary(userId, month, year),
        fetchTransactions(userId, { limit: 5 }),
        fetchBudgetsWithSpent(userId, month, year),
      ])

      setBalance(bal)
      setMonthly({ income, expense, net })
      setRecent(txns)
      setBudgets(budgetRows)
      setLoading(false)
    }

    if (!userLoading) load()
  }, [userLoading, month, year])

  const monthLabel = `${getHebrewMonthName(month - 1)} ${year}`

  return (
    <AppShell>
      <div className="page-header">
        <h1 className="text-headline-lg">
          {userLoading ? 'טוען...' : `${getGreeting(profile?.first_name)} ☀️`}
        </h1>
        <p className="text-body-md page-subtitle">הנה הסקירה הפיננסית שלך להיום</p>
      </div>

      <div className="bento-grid">
        <div className="bento-col-8 animate-fade-in-up">
          <BalanceCard
            currency="₪"
            amount={loading ? '—' : Math.abs(balance).toLocaleString('he-IL')}
            trend={monthly.net >= 0 ? `+${formatCurrency(monthly.net, { signed: false })}` : formatCurrency(monthly.net)}
            trendLabel={`נטו ${monthLabel}`}
          />
        </div>

        <div className="bento-col-4 animate-fade-in-up delay-100">
          <GlassCard className="dash-summary-card">
            <span className="text-label-bold dash-summary__title">חודש {getHebrewMonthName(month - 1)}</span>
            <div className="dash-summary__row">
              <span className="text-label-light">הכנסות</span>
              <span className="text-label-bold" style={{ color: '#00a060' }} dir="ltr">
                {formatCurrency(monthly.income, { signed: true, type: 'income' })}
              </span>
            </div>
            <div className="dash-summary__row">
              <span className="text-label-light">הוצאות</span>
              <span className="text-label-bold" style={{ color: 'var(--color-primary-container)' }} dir="ltr">
                {formatCurrency(monthly.expense, { signed: true, type: 'expense' })}
              </span>
            </div>
            <div className="dash-summary__divider" />
            <div className="dash-summary__row">
              <span className="text-label-bold">נטו</span>
              <span
                className="text-label-bold"
                dir="ltr"
                style={{ color: monthly.net >= 0 ? '#00a060' : 'var(--color-error)' }}
              >
                {formatCurrency(monthly.net, { signed: true, type: monthly.net >= 0 ? 'income' : 'expense' })}
              </span>
            </div>
            <Button variant="primary" full onClick={() => navigate('/reports')} style={{ marginTop: 12 }}>
              דוח מלא
            </Button>
          </GlassCard>
        </div>

        <div className="bento-col-6">
          <SpendingChart />
        </div>

        <div className="bento-col-6">
          <ForecastChart
            value={loading ? 'טוען...' : `צפי: ${formatCurrency(Math.max(balance + monthly.net, 0))}`}
            subtitle="על בסיס העסקאות שלך ב-Supabase"
          />
        </div>
      </div>

      <GlassCard className="dash-budget-card">
        <div className="dash-budget__header">
          <span className="text-headline-md">מעקב תקציב</span>
          <Badge color="primary">{monthLabel}</Badge>
        </div>
        {loading ? (
          <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>טוען תקציבים...</p>
        ) : budgets.length === 0 ? (
          <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
            אין תקציבים לחודש זה. הוסף תקציבים בהגדרות או דרך Supabase.
          </p>
        ) : (
          budgets.map(({ id, label, spent, budget, color }) => (
            <div key={id} className="dash-budget__item">
              <div className="dash-budget__item-header">
                <span className="text-label-bold">{label}</span>
                <span className="text-label-light" dir="ltr">
                  ₪{spent.toLocaleString()} / ₪{budget.toLocaleString()}
                </span>
              </div>
              <ProgressBar
                value={budget ? Math.min(Math.round((spent / budget) * 100), 100) : 0}
                currentLabel={`₪${spent.toLocaleString()}`}
                budgetLabel={`₪${budget.toLocaleString()}`}
              />
            </div>
          ))
        )}
      </GlassCard>

      <div className="dash-recent">
        <div className="dash-recent__header">
          <h2 className="text-headline-md">עסקאות אחרונות</h2>
          <button className="dash-recent__link text-label-bold" onClick={() => navigate('/search')}>
            הכל
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back_ios</span>
          </button>
        </div>

        {loading ? (
          <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>טוען עסקאות...</p>
        ) : recent.length === 0 ? (
          <GlassCard className="dash-txn-card">
            <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)', textAlign: 'center', width: '100%' }}>
              עדיין אין עסקאות.{' '}
              <button
                type="button"
                className="auth-link text-label-bold"
                onClick={() => navigate('/new-transaction')}
              >
                הוסף עסקה ראשונה
              </button>
            </p>
          </GlassCard>
        ) : (
          recent.map((txn, idx) => {
            const color = txn.category?.color_hex ?? '#5e5e5e'
            const label = txn.description || txn.category?.name || 'עסקה'
            return (
              <GlassCard key={txn.id} className={`dash-txn-card animate-fade-in-up delay-${(idx + 3) * 100}`}>
                <div className="dash-txn__icon glass-recessed" style={{ color }}>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {txn.category?.icon_name ?? 'receipt'}
                  </span>
                </div>
                <div className="dash-txn__info">
                  <span className="text-label-bold">{label}</span>
                  <span className="text-label-light">
                    {txn.category?.name ?? '—'} · {formatDateShort(txn.date)}
                    {txn.is_temporary ? ' · זמנית' : ''}
                  </span>
                </div>
                <span
                  className="dash-txn__amount text-label-bold"
                  style={{ color: txn.type === 'income' ? '#00a060' : 'var(--color-on-surface)' }}
                  dir="ltr"
                >
                  {formatTxnAmount(txn.amount, txn.type)}
                </span>
              </GlassCard>
            )
          })
        )}
      </div>

      <button className="fab" onClick={() => navigate('/new-transaction')} aria-label="הוסף עסקה">
        <span className="material-symbols-outlined">add</span>
      </button>
    </AppShell>
  )
}
