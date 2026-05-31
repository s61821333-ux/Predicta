import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../../layouts/AppShell'
import GlassCard from '../../components/GlassCard/GlassCard'
import InputField from '../../components/InputField/InputField'
import Button from '../../components/Button/Button'
import Badge from '../../components/Badge/Badge'
import { fetchCategories, createTransaction, getAuthUserId } from '../../lib/db'
import './NewTransactionPage.css'

export default function NewTransactionPage() {
  const navigate = useNavigate()
  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [isTemporary, setIsTemporary] = useState(false)
  const [selectedCatId, setSelectedCatId] = useState('')
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const userId = await getAuthUserId()
      if (!userId) return
      const { data } = await fetchCategories(userId)
      const filtered = data.filter(
        (c) => c.type === type || c.type === 'both',
      )
      setCategories(filtered)
      setSelectedCatId('')
    }
    load()
  }, [type])

  async function handleSave(status = 'completed') {
    setError('')
    const userId = await getAuthUserId()
    if (!userId) return

    const parsedAmount = parseFloat(amount)
    if (!parsedAmount || parsedAmount <= 0) {
      setError('הזן סכום תקין')
      return
    }
    if (!selectedCatId) {
      setError('בחר קטגוריה')
      return
    }

    setLoading(true)
    const { error: saveError } = await createTransaction(userId, {
      amount: parsedAmount,
      type,
      description: description.trim() || null,
      date: new Date(date).toISOString(),
      category_id: selectedCatId,
      is_temporary: type === 'expense' ? isTemporary : false,
      status,
      currency: 'ILS',
    })
    setLoading(false)

    if (saveError) {
      setError(saveError.message)
      return
    }

    navigate('/dashboard')
  }

  return (
    <AppShell>
      <div className="page-header">
        <h1 className="text-headline-lg">עסקה חדשה</h1>
        <p className="text-body-md page-subtitle">נשמר בטבלת transactions ב-Supabase</p>
      </div>

      <div className="txn-type-toggle glass-recessed">
        <button
          type="button"
          className={`txn-type-btn${type === 'expense' ? ' txn-type-btn--active txn-type-btn--expense' : ''}`}
          onClick={() => setType('expense')}
        >
          <span className="material-symbols-outlined">arrow_downward</span>
          הוצאה
        </button>
        <button
          type="button"
          className={`txn-type-btn${type === 'income' ? ' txn-type-btn--active txn-type-btn--income' : ''}`}
          onClick={() => setType('income')}
        >
          <span className="material-symbols-outlined">arrow_upward</span>
          הכנסה
        </button>
      </div>

      <GlassCard className="txn-form-card">
        <div className="txn-amount-wrap glass-recessed">
          <span className="text-label-bold txn-amount__currency">₪</span>
          <input
            className="txn-amount__input text-display-xl"
            type="number"
            placeholder="0"
            dir="ltr"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <InputField
          label="תיאור"
          placeholder="תיאור הוצאה/הכנסה"
          icon="notes"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <InputField
          label="תאריך"
          icon="calendar_today"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <div className="txn-cat-section">
          <label className="input-field__label text-label-light">קטגוריה</label>
          <div className="txn-cat-chips">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`txn-cat-chip${selectedCatId === cat.id ? ' txn-cat-chip--active' : ''}`}
                onClick={() => setSelectedCatId(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {type === 'expense' && (
          <div className="txn-temp-row glass-recessed">
            <div className="txn-temp__info">
              <span className="material-symbols-outlined txn-temp__icon">hourglass_top</span>
              <div>
                <span className="text-label-bold">הוצאה זמנית</span>
                <p className="text-label-light txn-temp__sub">לא תיספר בחישובי תקציב סופיים</p>
              </div>
            </div>
            <div
              className={`txn-toggle${isTemporary ? ' txn-toggle--active' : ''}`}
              onClick={() => setIsTemporary((v) => !v)}
              role="switch"
              aria-checked={isTemporary}
            >
              <div className="txn-toggle__knob" />
            </div>
          </div>
        )}

        {error && <p className="auth-alert auth-alert--error" role="alert">{error}</p>}

        <Button variant="primary" full onClick={() => handleSave('completed')} disabled={loading} icon="check">
          {loading ? 'שומר...' : 'שמור עסקה'}
        </Button>
      </GlassCard>

      <GlassCard className="txn-future-card">
        <div className="txn-future__header">
          <span className="material-symbols-outlined" style={{ color: 'var(--color-primary-container)', fontVariationSettings: "'FILL' 1" }}>upcoming</span>
          <div>
            <span className="text-label-bold">הוצאה עתידית</span>
            <p className="text-label-light">נשמר עם status = future</p>
          </div>
          <Badge color="primary">תחזית</Badge>
        </div>
        <Button variant="glass" full icon="schedule" onClick={() => handleSave('future')} disabled={loading}>
          הוסף לתחזית
        </Button>
      </GlassCard>
    </AppShell>
  )
}
