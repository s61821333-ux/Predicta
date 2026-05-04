import { useNavigate } from 'react-router-dom'
import AppShell    from '../../layouts/AppShell'
import BalanceCard from '../../components/BalanceCard/BalanceCard'
import SpendingChart  from '../../components/SpendingChart/SpendingChart'
import ForecastChart  from '../../components/ForecastChart/ForecastChart'
import GlassCard      from '../../components/GlassCard/GlassCard'
import Badge          from '../../components/Badge/Badge'
import Button         from '../../components/Button/Button'
import ProgressBar    from '../../components/ProgressBar/ProgressBar'
import './DashboardPage.css'

const RECENT = [
  { icon: 'restaurant',   label: 'מסעדות',      amount: '-₪320',  date: '02/05', cat: 'אוכל',      color: '#ff6b00' },
  { icon: 'directions_car', label: 'תדלוק',     amount: '-₪180',  date: '01/05', cat: 'תחבורה',    color: '#5e5e5e' },
  { icon: 'shopping_bag', label: 'זארה',         amount: '-₪450',  date: '30/04', cat: 'קניות',     color: '#5d5f5f' },
  { icon: 'account_balance', label: 'משכורת',   amount: '+₪12,000', date: '28/04', cat: 'הכנסה', color: '#00a060' },
  { icon: 'wifi',         label: 'בזק',          amount: '-₪89',   date: '27/04', cat: 'תקשורת',    color: '#5e5e5e' },
]

const BUDGET_CATS = [
  { label: 'אוכל',     spent: 1850, budget: 2500 },
  { label: 'בילויים',  spent: 680,  budget: 800  },
  { label: 'תחבורה',   spent: 420,  budget: 600  },
]

export default function DashboardPage() {
  const navigate = useNavigate()

  return (
    <AppShell>
      {/* ── Greeting ── */}
      <div className="page-header">
        <h1 className="text-headline-lg">בוקר טוב, נועה ☀️</h1>
        <p className="text-body-md page-subtitle">הנה הסקירה הפיננסית שלך להיום</p>
      </div>

      {/* ── Bento grid ── */}
      <div className="bento-grid">
        <div className="bento-col-8 animate-fade-in-up">
          <BalanceCard
            currency="₪"
            amount="124,500"
            trend="+4.2%"
            trendLabel="לעומת חודש קודם"
          />
        </div>

        {/* Monthly summary */}
        <div className="bento-col-4 animate-fade-in-up delay-100">
          <GlassCard className="dash-summary-card">
            <span className="text-label-bold dash-summary__title">חודש מאי</span>
            <div className="dash-summary__row">
              <span className="text-label-light">הכנסות</span>
              <span className="text-label-bold" style={{ color: '#00a060' }} dir="ltr">+₪14,200</span>
            </div>
            <div className="dash-summary__row">
              <span className="text-label-light">הוצאות</span>
              <span className="text-label-bold" style={{ color: 'var(--color-primary-container)' }} dir="ltr">-₪8,340</span>
            </div>
            <div className="dash-summary__divider" />
            <div className="dash-summary__row">
              <span className="text-label-bold">נטו</span>
              <span className="text-label-bold" dir="ltr" style={{ color: '#00a060' }}>+₪5,860</span>
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
          <ForecastChart value="צפי: ₪ 132K" subtitle="על בסיס המגמה הנוכחית שלך" />
        </div>
      </div>

      {/* ── Budget progress ── */}
      <GlassCard className="dash-budget-card">
        <div className="dash-budget__header">
          <span className="text-headline-md">מעקב תקציב</span>
          <Badge color="primary">מאי 2025</Badge>
        </div>
        {BUDGET_CATS.map(({ label, spent, budget }) => (
          <div key={label} className="dash-budget__item">
            <div className="dash-budget__item-header">
              <span className="text-label-bold">{label}</span>
              <span className="text-label-light" dir="ltr">₪{spent.toLocaleString()} / ₪{budget.toLocaleString()}</span>
            </div>
            <ProgressBar
              value={Math.round((spent / budget) * 100)}
              currentLabel={`₪${spent.toLocaleString()}`}
              budgetLabel={`₪${budget.toLocaleString()}`}
            />
          </div>
        ))}
      </GlassCard>

      {/* ── Recent transactions ── */}
      <div className="dash-recent">
        <div className="dash-recent__header">
          <h2 className="text-headline-md">עסקאות אחרונות</h2>
          <button className="dash-recent__link text-label-bold" onClick={() => navigate('/search')}>
            הכל
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back_ios</span>
          </button>
        </div>

        {RECENT.map(({ icon, label, amount, date, cat, color }, idx) => (
          <GlassCard key={label + date} className={`dash-txn-card animate-fade-in-up delay-${(idx + 3) * 100}`}>
            <div className="dash-txn__icon glass-recessed" style={{ color }}>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
            </div>
            <div className="dash-txn__info">
              <span className="text-label-bold">{label}</span>
              <span className="text-label-light">{cat} · {date}</span>
            </div>
            <span className={`dash-txn__amount text-label-bold`} style={{ color: amount.startsWith('+') ? '#00a060' : 'var(--color-on-surface)' }} dir="ltr">
              {amount}
            </span>
          </GlassCard>
        ))}
      </div>

      {/* ── FAB — new transaction ── */}
      <button className="fab" onClick={() => navigate('/new-transaction')} aria-label="הוסף עסקה">
        <span className="material-symbols-outlined">add</span>
      </button>
    </AppShell>
  )
}
