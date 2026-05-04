import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell   from '../../layouts/AppShell'
import GlassCard  from '../../components/GlassCard/GlassCard'
import InputField from '../../components/InputField/InputField'
import Button     from '../../components/Button/Button'
import Badge      from '../../components/Badge/Badge'
import './NewTransactionPage.css'

const CATEGORIES_EXPENSE = ['אוכל', 'תחבורה', 'קניות', 'בריאות', 'בילויים', 'דיור', 'תקשורת', 'חינוך', 'אחר']
const CATEGORIES_INCOME  = ['משכורת', 'פרילנס', 'השקעות', 'מתנה', 'החזר', 'אחר']

export default function NewTransactionPage() {
  const navigate = useNavigate()
  const [type, setType]             = useState('expense') // 'expense' | 'income'
  const [isTemporary, setIsTemporary] = useState(false)
  const [selectedCat, setSelectedCat] = useState('')

  const cats = type === 'expense' ? CATEGORIES_EXPENSE : CATEGORIES_INCOME

  return (
    <AppShell>
      <div className="page-header">
        <h1 className="text-headline-lg">עסקה חדשה</h1>
        <p className="text-body-md page-subtitle">הוסף הכנסה או הוצאה</p>
      </div>

      {/* ── Type toggle ── */}
      <div className="txn-type-toggle glass-recessed">
        <button
          className={`txn-type-btn${type === 'expense' ? ' txn-type-btn--active txn-type-btn--expense' : ''}`}
          onClick={() => { setType('expense'); setSelectedCat('') }}
        >
          <span className="material-symbols-outlined">arrow_downward</span>
          הוצאה
        </button>
        <button
          className={`txn-type-btn${type === 'income' ? ' txn-type-btn--active txn-type-btn--income' : ''}`}
          onClick={() => { setType('income'); setSelectedCat('') }}
        >
          <span className="material-symbols-outlined">arrow_upward</span>
          הכנסה
        </button>
      </div>

      {/* ── Form card ── */}
      <GlassCard className="txn-form-card">

        {/* Amount — prominent */}
        <div className="txn-amount-wrap glass-recessed">
          <span className="text-label-bold txn-amount__currency">₪</span>
          <input
            className="txn-amount__input text-display-xl"
            type="number"
            placeholder="0"
            dir="ltr"
            inputMode="decimal"
          />
        </div>

        <InputField label="תיאור" placeholder="תיאור הוצאה/הכנסה" icon="notes" />

        <InputField label="תאריך" placeholder="DD/MM/YYYY" icon="calendar_today" type="date" />

        {/* Category chips */}
        <div className="txn-cat-section">
          <label className="input-field__label text-label-light">קטגוריה</label>
          <div className="txn-cat-chips">
            {cats.map(cat => (
              <button
                key={cat}
                className={`txn-cat-chip${selectedCat === cat ? ' txn-cat-chip--active' : ''}`}
                onClick={() => setSelectedCat(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Scan invoice */}
        <GlassCard variant="recessed" className="txn-scan-card">
          <span className="material-symbols-outlined txn-scan__icon">document_scanner</span>
          <div className="txn-scan__text">
            <span className="text-label-bold">סרוק חשבונית</span>
            <span className="text-label-light">AI יחלץ את הפרטים אוטומטית</span>
          </div>
          <Button variant="glass" icon="camera_alt">סרוק</Button>
        </GlassCard>

        {/* Temporary expense checkbox (expense only) */}
        {type === 'expense' && (
          <div className="txn-temp-row glass-recessed">
            <div className="txn-temp__info">
              <span className="material-symbols-outlined txn-temp__icon">hourglass_top</span>
              <div>
                <span className="text-label-bold">הוצאה זמנית</span>
                <p className="text-label-light txn-temp__sub">
                  סמן אם ההוצאה צפויה להיות מוחזרת (כגון: Bit)
                </p>
              </div>
            </div>
            <div
              className={`txn-toggle${isTemporary ? ' txn-toggle--active' : ''}`}
              onClick={() => setIsTemporary(v => !v)}
              role="switch"
              aria-checked={isTemporary}
            >
              <div className="txn-toggle__knob" />
            </div>
          </div>
        )}

        {isTemporary && (
          <div className="auth-info">
            <span className="material-symbols-outlined auth-info__icon">info</span>
            <p className="auth-info__text">
              הוצאה זמנית לא תיחשב כהוצאה סופית בתחזית שלך
            </p>
          </div>
        )}

        {/* Submit */}
        <Button variant="primary" full onClick={() => navigate('/dashboard')} icon="check">
          שמור עסקה
        </Button>

      </GlassCard>

      {/* ── Future expense section ── */}
      <GlassCard className="txn-future-card">
        <div className="txn-future__header">
          <span className="material-symbols-outlined" style={{ color: 'var(--color-primary-container)', fontVariationSettings: "'FILL' 1" }}>upcoming</span>
          <div>
            <span className="text-label-bold">הוצאה עתידית</span>
            <p className="text-label-light">הוסף הוצאה שטרם התרחשה לתחזית שלך</p>
          </div>
          <Badge color="primary">חדש</Badge>
        </div>
        <InputField label="תאריך עתידי" placeholder="DD/MM/YYYY" icon="event" type="date" />
        <Button variant="glass" full icon="schedule">
          הוסף לתחזית
        </Button>
      </GlassCard>
    </AppShell>
  )
}
