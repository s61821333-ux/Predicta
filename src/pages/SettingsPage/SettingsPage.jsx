import { useEffect, useState } from 'react'
import AppShell from '../../layouts/AppShell'
import GlassCard from '../../components/GlassCard/GlassCard'
import Button from '../../components/Button/Button'
import Badge from '../../components/Badge/Badge'
import { useUser } from '../../context/UserContext'
import {
  fetchCategories,
  createCategory,
  deleteCategory,
  updateUserSettings,
  getAuthUserId,
} from '../../lib/db'
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

export default function SettingsPage() {
  const { settings, profile, refresh } = useUser()
  const [notifBudget, setNotifBudget] = useState(true)
  const [notifSummary, setNotifSummary] = useState(true)
  const [notifAI, setNotifAI] = useState(false)
  const [autoCategory, setAutoCategory] = useState(true)
  const [futureForecast, setFutureForecast] = useState(true)
  const [rtlMode, setRtlMode] = useState(true)
  const [categories, setCategories] = useState([])
  const [newCat, setNewCat] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (settings) {
      setNotifBudget(settings.notif_budget)
      setNotifSummary(settings.notif_summary)
      setNotifAI(settings.notif_ai)
      setAutoCategory(settings.auto_category)
      setFutureForecast(settings.future_forecast)
      setRtlMode(settings.rtl_mode)
    }
  }, [settings])

  useEffect(() => {
    async function loadCats() {
      const userId = await getAuthUserId()
      if (!userId) return
      const { data } = await fetchCategories(userId)
      const userCats = data.filter((c) => c.user_id === userId)
      setCategories(userCats)
    }
    if (profile?.id) loadCats()
  }, [profile?.id])

  async function persistSettings(patch) {
    if (!profile?.id) return
    setSaving(true)
    await updateUserSettings(profile.id, patch)
    setSaving(false)
    refresh()
  }

  function toggleSetting(key, value, setter) {
    setter(value)
    persistSettings({ [key]: value })
  }

  async function addCat() {
    const name = newCat.trim()
    if (!name || !profile?.id) return
    const { data, error } = await createCategory(profile.id, { name, type: 'expense' })
    if (!error && data) {
      setCategories((prev) => [...prev, data])
      setNewCat('')
    }
  }

  async function removeCat(cat) {
    const { error } = await deleteCategory(cat.id)
    if (!error) setCategories((prev) => prev.filter((c) => c.id !== cat.id))
  }

  const currency = settings?.currency_code ?? 'ILS'

  return (
    <AppShell>
      <div className="page-header">
        <h1 className="text-headline-lg">הגדרות</h1>
        <p className="text-body-md page-subtitle">
          העדפות נשמרות בטבלת user_settings · {saving ? 'שומר...' : 'מסונכרן'}
        </p>
      </div>

      <GlassCard className="settings-section">
        <h3 className="text-headline-md settings-section__title">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", color: 'var(--color-primary-container)' }}>notifications</span>
          התראות
        </h3>
        <SettingsRow icon="savings" label="חריגה מתקציב" desc="קבל התראה כשאתה חורג מהתקציב החודשי">
          <Toggle checked={notifBudget} onChange={() => toggleSetting('notif_budget', !notifBudget, setNotifBudget)} />
        </SettingsRow>
        <SettingsRow icon="summarize" label="סיכום שבועי" desc="קבל סיכום הוצאות בכל יום ראשון">
          <Toggle checked={notifSummary} onChange={() => toggleSetting('notif_summary', !notifSummary, setNotifSummary)} />
        </SettingsRow>
        <SettingsRow icon="psychology" label="תובנות AI" desc="קבל המלצות חכמות מהבינה המלאכותית">
          <Toggle checked={notifAI} onChange={() => toggleSetting('notif_ai', !notifAI, setNotifAI)} />
        </SettingsRow>
      </GlassCard>

      <GlassCard className="settings-section">
        <h3 className="text-headline-md settings-section__title">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", color: 'var(--color-primary-container)' }}>psychology</span>
          בינה מלאכותית
        </h3>
        <SettingsRow icon="category" label="קטגוריזציה אוטומטית">
          <Toggle checked={autoCategory} onChange={() => toggleSetting('auto_category', !autoCategory, setAutoCategory)} />
        </SettingsRow>
        <SettingsRow icon="timeline" label="תחזית עתידית">
          <Toggle checked={futureForecast} onChange={() => toggleSetting('future_forecast', !futureForecast, setFutureForecast)} />
        </SettingsRow>
      </GlassCard>

      <GlassCard className="settings-section">
        <h3 className="text-headline-md settings-section__title">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", color: 'var(--color-primary-container)' }}>label</span>
          קטגוריות מותאמות אישית
        </h3>
        <div className="settings-cats">
          {categories.length === 0 ? (
            <p className="text-label-light" style={{ color: 'var(--color-on-surface-variant)' }}>
              אין קטגוריות מותאמות — רק קטגוריות מערכת פעילות
            </p>
          ) : (
            categories.map((cat) => (
              <div key={cat.id} className="settings-cat-chip glass-recessed">
                <span className="text-label-bold">{cat.name}</span>
                <button type="button" className="settings-cat__remove" onClick={() => removeCat(cat)}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
                </button>
              </div>
            ))
          )}
        </div>
        <div className="settings-add-cat">
          <div className="input-field" style={{ flex: 1 }}>
            <div className="input-field__wrap glass-recessed">
              <span className="material-symbols-outlined input-field__icon">add</span>
              <input
                className="input-field__input"
                placeholder="קטגוריה חדשה..."
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCat()}
              />
            </div>
          </div>
          <Button variant="primary" onClick={addCat} icon="add">הוסף</Button>
        </div>
      </GlassCard>

      <GlassCard className="settings-section">
        <h3 className="text-headline-md settings-section__title">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", color: 'var(--color-primary-container)' }}>display_settings</span>
          תצוגה
        </h3>
        <SettingsRow icon="translate" label="ממשק עברית RTL">
          <Toggle checked={rtlMode} onChange={() => toggleSetting('rtl_mode', !rtlMode, setRtlMode)} />
        </SettingsRow>
        <SettingsRow icon="currency_exchange" label="מטבע" desc={`מטבע ברירת מחדל: ${currency}`}>
          <Badge color="primary">₪ {currency}</Badge>
        </SettingsRow>
        <SettingsRow icon="date_range" label="פורמט תאריך" desc={settings?.date_format ?? 'DD/MM/YYYY'}>
          <Badge color="primary">{settings?.date_format ?? 'DD/MM/YYYY'}</Badge>
        </SettingsRow>
      </GlassCard>
    </AppShell>
  )
}
