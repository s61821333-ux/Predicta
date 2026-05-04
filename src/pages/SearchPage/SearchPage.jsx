import { useState } from 'react'
import AppShell   from '../../layouts/AppShell'
import GlassCard  from '../../components/GlassCard/GlassCard'
import InputField from '../../components/InputField/InputField'
import Badge      from '../../components/Badge/Badge'
import './SearchPage.css'

const ALL_TRANSACTIONS = [
  { id: 1, icon: 'restaurant',     label: 'קפה ארומה',      amount: -45,   date: '02/05/2025', cat: 'אוכל',      type: 'expense' },
  { id: 2, icon: 'directions_car', label: 'תדלוק פז',       amount: -180,  date: '01/05/2025', cat: 'תחבורה',    type: 'expense' },
  { id: 3, icon: 'account_balance',label: 'משכורת',         amount: 12000, date: '28/04/2025', cat: 'הכנסה',     type: 'income'  },
  { id: 4, icon: 'shopping_bag',   label: 'זארה',            amount: -450,  date: '27/04/2025', cat: 'קניות',     type: 'expense' },
  { id: 5, icon: 'wifi',           label: 'בזק',             amount: -89,   date: '25/04/2025', cat: 'תקשורת',    type: 'expense' },
  { id: 6, icon: 'fitness_center', label: 'מנוי כושר',      amount: -180,  date: '24/04/2025', cat: 'בריאות',    type: 'expense' },
  { id: 7, icon: 'local_movies',   label: 'Yes',             amount: -55,   date: '22/04/2025', cat: 'בילויים',   type: 'expense' },
  { id: 8, icon: 'attach_money',   label: 'פרויקט פרילנס',  amount: 3500,  date: '20/04/2025', cat: 'הכנסה',     type: 'income'  },
  { id: 9, icon: 'restaurant',     label: 'מסעדת אוכמניות', amount: -320,  date: '19/04/2025', cat: 'אוכל',      type: 'expense', temporary: true },
  { id: 10,icon: 'home',           label: 'שכירות אפריל',   amount: -4200, date: '01/04/2025', cat: 'דיור',      type: 'expense' },
]

const CATS = ['הכל', 'אוכל', 'תחבורה', 'קניות', 'תקשורת', 'בריאות', 'בילויים', 'דיור', 'הכנסה']

export default function SearchPage() {
  const [query,    setQuery]    = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [catFilter,  setCatFilter]  = useState('הכל')
  const [selected,   setSelected]   = useState(null)

  const filtered = ALL_TRANSACTIONS.filter(t => {
    const matchQuery = !query || t.label.includes(query) || t.cat.includes(query)
    const matchType  = typeFilter === 'all' || t.type === typeFilter
    const matchCat   = catFilter === 'הכל' || t.cat === catFilter
    return matchQuery && matchType && matchCat
  })

  return (
    <AppShell>
      <div className="page-header">
        <h1 className="text-headline-lg">חיפוש עסקאות</h1>
        <p className="text-body-md page-subtitle">מצא עסקה בהיסטוריה שלך</p>
      </div>

      {/* ── Search field ── */}
      <InputField
        label=""
        placeholder="חפש לפי שם, קטגוריה..."
        icon="search"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      {/* ── Filters row ── */}
      <div className="search-filters">
        {/* Type */}
        <div className="search-type-toggle glass-recessed">
          {['all', 'expense', 'income'].map(t => (
            <button
              key={t}
              className={`search-type-btn${typeFilter === t ? ' search-type-btn--active' : ''}`}
              onClick={() => setTypeFilter(t)}
            >
              {t === 'all' ? 'הכל' : t === 'expense' ? 'הוצאות' : 'הכנסות'}
            </button>
          ))}
        </div>

        {/* Date range */}
        <GlassCard variant="recessed" className="search-date-range">
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--color-on-surface-variant)' }}>date_range</span>
          <input className="search-date-input" type="date" defaultValue="2025-04-01" />
          <span className="text-label-light">—</span>
          <input className="search-date-input" type="date" defaultValue="2025-05-03" />
        </GlassCard>
      </div>

      {/* ── Category chips ── */}
      <div className="search-cat-chips hide-scrollbar">
        {CATS.map(cat => (
          <button
            key={cat}
            className={`txn-cat-chip${catFilter === cat ? ' txn-cat-chip--active' : ''}`}
            onClick={() => setCatFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Results count ── */}
      <div className="search-results-header">
        <span className="text-label-bold">{filtered.length} תוצאות</span>
        {(query || typeFilter !== 'all' || catFilter !== 'הכל') && (
          <button
            className="search-clear text-label-light"
            onClick={() => { setQuery(''); setTypeFilter('all'); setCatFilter('הכל') }}
          >
            נקה סינון
          </button>
        )}
      </div>

      {/* ── Results ── */}
      <div className="search-results">
        {filtered.length === 0 ? (
          <GlassCard className="search-empty">
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--color-outline)', fontVariationSettings: "'FILL' 1" }}>search_off</span>
            <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>לא נמצאו עסקאות</p>
          </GlassCard>
        ) : filtered.map(txn => (
          <GlassCard
            key={txn.id}
            className={`search-txn-card${selected === txn.id ? ' search-txn-card--open' : ''}`}
            onClick={() => setSelected(selected === txn.id ? null : txn.id)}
          >
            <div className="search-txn__row">
              <div className="search-txn__icon glass-recessed" style={{ color: txn.amount > 0 ? '#00a060' : 'var(--color-primary-container)' }}>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{txn.icon}</span>
              </div>
              <div className="search-txn__info">
                <div className="search-txn__name-row">
                  <span className="text-label-bold">{txn.label}</span>
                  {txn.temporary && <Badge color="primary">זמנית</Badge>}
                </div>
                <span className="text-label-light">{txn.cat} · {txn.date}</span>
              </div>
              <span
                className="text-label-bold search-txn__amount"
                dir="ltr"
                style={{ color: txn.amount > 0 ? '#00a060' : 'var(--color-on-surface)' }}
              >
                {txn.amount > 0 ? '+' : ''}₪{Math.abs(txn.amount).toLocaleString()}
              </span>
            </div>

            {/* Expanded detail */}
            {selected === txn.id && (
              <div className="search-txn__detail glass-recessed">
                <div className="search-txn__detail-row">
                  <span className="text-label-light">קטגוריה</span>
                  <span className="text-label-bold">{txn.cat}</span>
                </div>
                <div className="search-txn__detail-row">
                  <span className="text-label-light">תאריך</span>
                  <span className="text-label-bold" dir="ltr">{txn.date}</span>
                </div>
                <div className="search-txn__detail-row">
                  <span className="text-label-light">סוג</span>
                  <span className="text-label-bold">{txn.type === 'expense' ? 'הוצאה' : 'הכנסה'}</span>
                </div>
                <div className="search-txn__actions">
                  <button className="search-txn__action-btn text-label-bold">
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
                    עריכה
                  </button>
                  <button className="search-txn__action-btn search-txn__action-btn--delete text-label-bold">
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                    מחיקה
                  </button>
                </div>
              </div>
            )}
          </GlassCard>
        ))}
      </div>
    </AppShell>
  )
}
