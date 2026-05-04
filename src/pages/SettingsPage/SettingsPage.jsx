import { useState } from 'react'
import AppShell  from '../../layouts/AppShell'
import GlassCard from '../../components/GlassCard/GlassCard'
import Button    from '../../components/Button/Button'
import Badge     from '../../components/Badge/Badge'
import './SettingsPage.css'

function Toggle({ checked, onChange }) {
  return (
    <div
      className={`settings-toggle${checked ? ' settings-toggle--active' : ''}`}
      onClick={onChange}
      role="switch"
      aria-checked={checked}
    >
      <div className="settings-toggle__knob" />
    </div>
  )
}

function SettingsRow({ icon, label, desc, children }) {
  return (
    <div className="settings-row">
      <span className="material-symbols-outlined settings-row__icon" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      <div className="settings-row__text">
        <span className="text-label-bold">{label}</span>
        {desc && <p className="text-label-light settings-row__desc">{desc}</p>}
      </div>
      <div className="settings-row__control">{children}</div>
    </div>
  )
}

const DEFAULT_CATS = ['אוכל', 'תחבורה', 'קניות', 'בריאות', 'בילויים', 'דיור', 'תקשורת', 'חינוך']

export default function SettingsPage() {
  const [notifBudget,   setNotifBudget]   = useState(true)
  const [notifSummary,  setNotifSummary]  = useState(true)
  const [notifAI,       setNotifAI]       = useState(false)
  const [autoCategory,  setAutoCategory]  = useState(true)
  const [futureForecast,setFutureForecast]= useState(true)
  const [rtlMode,       setRtlMode]       = useState(true)
  const [categories,    setCategories]    = useState(DEFAULT_CATS)
  const [newCat,        setNewCat]        = useState('')

  function addCat() {
    if (newCat.trim() && !categories.includes(newCat.trim())) {
      setCategories(prev => [...prev, newCat.trim()])
      setNewCat('')
    }
  }

  function removeCat(cat) {
    setCategories(prev => prev.filter(c => c !== cat))
  }

  return (
    <AppShell>
      <div className="page-header">
        <h1 className="text-headline-lg">הגדרות</h1>
        <p className="text-body-md page-subtitle">התאם את האפליקציה לצרכים שלך</p>
      </div>

      {/* ── Notifications ── */}
      <GlassCard className="settings-section">
        <h3 className="text-headline-md settings-section__title">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", color: 'var(--color-primary-container)' }}>notifications</span>
          התראות
        </h3>

        <SettingsRow icon="savings" label="חריגה מתקציב" desc="קבל התראה כשאתה חורג מהתקציב החודשי">
          <Toggle checked={notifBudget} onChange={() => setNotifBudget(v => !v)} />
        </SettingsRow>

        <SettingsRow icon="summarize" label="סיכום שבועי" desc="קבל סיכום הוצאות בכל יום ראשון">
          <Toggle checked={notifSummary} onChange={() => setNotifSummary(v => !v)} />
        </SettingsRow>

        <SettingsRow icon="psychology" label="תובנות AI" desc="קבל המלצות חכמות מהבינה המלאכותית">
          <Toggle checked={notifAI} onChange={() => setNotifAI(v => !v)} />
        </SettingsRow>
      </GlassCard>

      {/* ── AI & Categorization ── */}
      <GlassCard className="settings-section">
        <h3 className="text-headline-md settings-section__title">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", color: 'var(--color-primary-container)' }}>psychology</span>
          בינה מלאכותית
        </h3>

        <SettingsRow icon="category" label="קטגוריזציה אוטומטית" desc="AI מסווג עסקאות חדשות אוטומטית">
          <Toggle checked={autoCategory} onChange={() => setAutoCategory(v => !v)} />
        </SettingsRow>

        <SettingsRow icon="timeline" label="תחזית עתידית" desc="AI מחשב תחזית תזרים ל-6 חודשים קדימה">
          <Toggle checked={futureForecast} onChange={() => setFutureForecast(v => !v)} />
        </SettingsRow>
      </GlassCard>

      {/* ── Categories management ── */}
      <GlassCard className="settings-section">
        <h3 className="text-headline-md settings-section__title">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", color: 'var(--color-primary-container)' }}>label</span>
          ניהול קטגוריות
        </h3>

        <div className="settings-cats">
          {categories.map(cat => (
            <div key={cat} className="settings-cat-chip glass-recessed">
              <span className="text-label-bold">{cat}</span>
              <button className="settings-cat__remove" onClick={() => removeCat(cat)}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
              </button>
            </div>
          ))}
        </div>

        <div className="settings-add-cat">
          <div className="input-field" style={{ flex: 1 }}>
            <div className="input-field__wrap glass-recessed">
              <span className="material-symbols-outlined input-field__icon">add</span>
              <input
                className="input-field__input"
                placeholder="קטגוריה חדשה..."
                value={newCat}
                onChange={e => setNewCat(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCat()}
              />
            </div>
          </div>
          <Button variant="primary" onClick={addCat} icon="add">הוסף</Button>
        </div>
      </GlassCard>

      {/* ── Display ── */}
      <GlassCard className="settings-section">
        <h3 className="text-headline-md settings-section__title">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", color: 'var(--color-primary-container)' }}>display_settings</span>
          תצוגה
        </h3>

        <SettingsRow icon="translate" label="ממשק עברית RTL" desc="הצג את האפליקציה מימין לשמאל">
          <Toggle checked={rtlMode} onChange={() => setRtlMode(v => !v)} />
        </SettingsRow>

        <SettingsRow icon="currency_exchange" label="מטבע" desc="שקל ישראלי (ILS)">
          <Badge color="primary">₪ ILS</Badge>
        </SettingsRow>

        <SettingsRow icon="date_range" label="פורמט תאריך" desc="DD/MM/YYYY (ישראלי)">
          <Badge color="primary">DD/MM/YY</Badge>
        </SettingsRow>
      </GlassCard>

      {/* ── Data ── */}
      <GlassCard className="settings-section">
        <h3 className="text-headline-md settings-section__title">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", color: 'var(--color-primary-container)' }}>database</span>
          נתונים
        </h3>

        <Button variant="glass" full icon="download">ייצוא כל הנתונים (CSV)</Button>
        <Button variant="glass" full icon="backup">גיבוי לענן</Button>
        <Button variant="glass" full icon="delete_forever"
          style={{ color: 'var(--color-error)', borderColor: 'var(--color-error-container)' }}>
          מחיקת כל הנתונים
        </Button>
      </GlassCard>
    </AppShell>
  )
}
