import { useEffect, useMemo, useState } from 'react'
import AppShell from '../../layouts/AppShell'
import GlassCard from '../../components/GlassCard/GlassCard'
import InputField from '../../components/InputField/InputField'
import Badge from '../../components/Badge/Badge'
import { fetchTransactions, deleteTransaction, getAuthUserId } from '../../lib/db'
import { formatTxnAmount, formatDateFull } from '../../utils/format'
import './SearchPage.css'

export default function SearchPage() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [catFilter, setCatFilter] = useState('הכל')
  const [selected, setSelected] = useState(null)

  async function loadTransactions() {
    const userId = await getAuthUserId()
    if (!userId) return
    const { data } = await fetchTransactions(userId)
    setTransactions(data)
    setLoading(false)
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  const categoryNames = useMemo(() => {
    const names = new Set(transactions.map((t) => t.category?.name).filter(Boolean))
    return ['הכל', ...names]
  }, [transactions])

  const filtered = transactions.filter((t) => {
    const label = t.description || t.category?.name || ''
    const cat = t.category?.name ?? ''
    const matchQuery = !query || label.includes(query) || cat.includes(query)
    const matchType = typeFilter === 'all' || t.type === typeFilter
    const matchCat = catFilter === 'הכל' || cat === catFilter
    return matchQuery && matchType && matchCat
  })

  async function handleDelete(id) {
    await deleteTransaction(id)
    setSelected(null)
    loadTransactions()
  }

  return (
    <AppShell>
      <div className="page-header">
        <h1 className="text-headline-lg">חיפוש עסקאות</h1>
        <p className="text-body-md page-subtitle">
          {loading ? 'טוען...' : `${transactions.length} עסקאות מהמסד נתונים`}
        </p>
      </div>

      <InputField
        label=""
        placeholder="חפש לפי שם, קטגוריה..."
        icon="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="search-filters">
        <div className="search-type-toggle glass-recessed">
          {['all', 'expense', 'income'].map((t) => (
            <button
              key={t}
              type="button"
              className={`search-type-btn${typeFilter === t ? ' search-type-btn--active' : ''}`}
              onClick={() => setTypeFilter(t)}
            >
              {t === 'all' ? 'הכל' : t === 'expense' ? 'הוצאות' : 'הכנסות'}
            </button>
          ))}
        </div>
      </div>

      <div className="search-cat-chips hide-scrollbar">
        {categoryNames.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`txn-cat-chip${catFilter === cat ? ' txn-cat-chip--active' : ''}`}
            onClick={() => setCatFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="search-results-header">
        <span className="text-label-bold">{filtered.length} תוצאות</span>
        {(query || typeFilter !== 'all' || catFilter !== 'הכל') && (
          <button
            type="button"
            className="search-clear text-label-light"
            onClick={() => { setQuery(''); setTypeFilter('all'); setCatFilter('הכל') }}
          >
            נקה סינון
          </button>
        )}
      </div>

      <div className="search-results">
        {loading ? (
          <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>טוען עסקאות...</p>
        ) : filtered.length === 0 ? (
          <GlassCard className="search-empty">
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--color-outline)', fontVariationSettings: "'FILL' 1" }}>search_off</span>
            <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>לא נמצאו עסקאות</p>
          </GlassCard>
        ) : (
          filtered.map((txn) => {
            const label = txn.description || txn.category?.name || 'עסקה'
            const icon = txn.category?.icon_name ?? 'receipt'
            return (
              <GlassCard
                key={txn.id}
                className={`search-txn-card${selected === txn.id ? ' search-txn-card--open' : ''}`}
                onClick={() => setSelected(selected === txn.id ? null : txn.id)}
              >
                <div className="search-txn__row">
                  <div
                    className="search-txn__icon glass-recessed"
                    style={{ color: txn.type === 'income' ? '#00a060' : txn.category?.color_hex ?? 'var(--color-primary-container)' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                  </div>
                  <div className="search-txn__info">
                    <div className="search-txn__name-row">
                      <span className="text-label-bold">{label}</span>
                      {txn.is_temporary && <Badge color="primary">זמנית</Badge>}
                    </div>
                    <span className="text-label-light">
                      {txn.category?.name ?? '—'} · {formatDateFull(txn.date)}
                    </span>
                  </div>
                  <span
                    className="text-label-bold search-txn__amount"
                    dir="ltr"
                    style={{ color: txn.type === 'income' ? '#00a060' : 'var(--color-on-surface)' }}
                  >
                    {formatTxnAmount(txn.amount, txn.type)}
                  </span>
                </div>

                {selected === txn.id && (
                  <div className="search-txn__detail glass-recessed">
                    <div className="search-txn__detail-row">
                      <span className="text-label-light">קטגוריה</span>
                      <span className="text-label-bold">{txn.category?.name ?? '—'}</span>
                    </div>
                    <div className="search-txn__detail-row">
                      <span className="text-label-light">תאריך</span>
                      <span className="text-label-bold" dir="ltr">{formatDateFull(txn.date)}</span>
                    </div>
                    <div className="search-txn__detail-row">
                      <span className="text-label-light">סוג</span>
                      <span className="text-label-bold">{txn.type === 'expense' ? 'הוצאה' : 'הכנסה'}</span>
                    </div>
                    <div className="search-txn__actions">
                      <button
                        type="button"
                        className="search-txn__action-btn search-txn__action-btn--delete text-label-bold"
                        onClick={(e) => { e.stopPropagation(); handleDelete(txn.id) }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                        מחיקה
                      </button>
                    </div>
                  </div>
                )}
              </GlassCard>
            )
          })
        )}
      </div>
    </AppShell>
  )
}
