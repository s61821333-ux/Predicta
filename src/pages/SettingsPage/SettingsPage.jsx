import { useEffect, useState } from 'react'
import { useUser } from '../../context/UserContext'
import { useAppState } from '../../context/AppStateContext'
import { fetchCategories, createCategory, deleteCategory, fetchUserSettings, updateUserSettings } from '../../lib/db'
import { Confirm, Modal } from '../../components/Modal/Modal'
import CatChip from '../../components/CatChip/CatChip'
import Icon from '../../components/Icon/Icon'

const COLOR_PAL = ['#2D6FF0','#FF8A4C','#B36BFF','#FF5D7E','#FFB22E','#26C6DA','#22C55E','#EC6FB0']

function AddCategoryModal({ open, onClose, onAdd }) {
  const [name, setName] = useState('')
  const [type, setType] = useState('expense')
  const [color, setColor] = useState(COLOR_PAL[0])
  useEffect(() => { if (open) { setName(''); setType('expense'); setColor(COLOR_PAL[0]) } }, [open])

  return (
    <Modal open={open} onClose={onClose}>
      <h3 style={{ margin: '0 0 16px', fontSize: 19, fontWeight: 800 }}>קטגוריה חדשה</h3>
      <input className="field" placeholder="שם הקטגוריה" value={name} onChange={e => setName(e.target.value)} style={{ marginBottom: 14 }} />
      <div className="seg" style={{ marginBottom: 16 }}>
        <button className={type === 'expense' ? 'on exp' : ''} onClick={() => setType('expense')}>הוצאה</button>
        <button className={type === 'income'  ? 'on inc' : ''} onClick={() => setType('income')}>הכנסה</button>
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 22 }}>
        {COLOR_PAL.map(c => (
          <button key={c} className="tap" onClick={() => setColor(c)}
            style={{ width: 36, height: 36, borderRadius: '50%', background: c, border: color === c ? '3px solid var(--ink)' : '3px solid transparent', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)' }} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn btn-ghost" style={{ flex: 1, height: 48 }} onClick={onClose}>ביטול</button>
        <button className="btn btn-primary" style={{ flex: 1, height: 48, opacity: name.trim() ? 1 : 0.5, pointerEvents: name.trim() ? 'auto' : 'none' }}
          onClick={() => { onAdd({ name: name.trim(), type, color_hex: color, icon_name: 'other' }); onClose() }}>הוסף</button>
      </div>
    </Modal>
  )
}

export default function SettingsPage() {
  const { profile } = useUser()
  const { showToast } = useAppState()
  const [settings, setSettings] = useState({
    notif_budget: false, notif_summary: false, notif_ai: false,
    auto_category: false, future_forecast: false, rtl_mode: true,
  })
  const [customCats, setCustomCats] = useState([])
  const [delCat, setDelCat] = useState(null)
  const [addOpen, setAddOpen] = useState(false)
  const [reveal, setReveal] = useState(false)
  const [smsToken, setSmsToken] = useState('')

  useEffect(() => {
    if (!profile?.id) return
    fetchUserSettings(profile.id).then(({ data }) => {
      if (data) {
        setSettings({
          notif_budget:   !!data.notif_budget,
          notif_summary:  !!data.notif_summary,
          notif_ai:       !!data.notif_ai,
          auto_category:  !!data.auto_category,
          future_forecast:!!data.future_forecast,
          rtl_mode:       !!data.rtl_mode,
        })
        setSmsToken(data.sms_ingest_token || '')
      }
    })
    fetchCategories(profile.id).then(({ data }) => {
      setCustomCats((data || []).filter(c => c.user_id !== null))
    })
  }, [profile?.id])

  const toggle = async (key) => {
    const next = { ...settings, [key]: !settings[key] }
    setSettings(next)
    await updateUserSettings(profile.id, { [key]: next[key] })
  }

  const addCat = async (catData) => {
    const { data } = await createCategory(profile.id, catData)
    if (data) { setCustomCats(prev => [...prev, data]); showToast('הקטגוריה נוספה') }
  }

  const deleteCat = async () => {
    if (!delCat) return
    await deleteCategory(delCat.id)
    setCustomCats(prev => prev.filter(c => c.id !== delCat.id))
    setDelCat(null)
  }

  const masked = smsToken ? smsToken.replace(/[a-z0-9]/gi, '•') : '—'
  const copy = () => { navigator.clipboard?.writeText(smsToken); showToast('הטוקן הועתק') }

  const Group = ({ title, children }) => (
    <div>
      <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink-2)', margin: '0 4px 9px' }}>{title}</div>
      <div className="glass" style={{ borderRadius: 22, padding: '6px 16px' }}>{children}</div>
    </div>
  )

  const Row = ({ label, desc, k, last }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: last ? 'none' : '1px solid var(--hairline)' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 15 }}>{label}</div>
        {desc && <div style={{ fontSize: 12.5, color: 'var(--ink-2)', marginTop: 2 }}>{desc}</div>}
      </div>
      <button className={'sw tap' + (settings[k] ? ' on' : '')} onClick={() => toggle(k)} aria-label={label}><i /></button>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 90 }}>
      <h1 style={{ margin: '2px 4px', fontSize: 26, fontWeight: 800 }}>הגדרות</h1>

      <Group title="התראות">
        <Row label="התראות תקציב"  desc="כשמתקרבים או חורגים מהתקציב" k="notif_budget" />
        <Row label="סיכום שבועי"   desc="סיכום הוצאות אחת לשבוע"       k="notif_summary" />
        <Row label="תובנות AI"     desc="המלצות ותובנות מבוססות בינה"   k="notif_ai" last />
      </Group>

      <Group title="תכונות AI">
        <Row label="קטגוריזציה אוטומטית" desc="שיוך קטגוריה לעסקאות חדשות" k="auto_category" />
        <Row label="תחזית עתידית"        desc="חיזוי הוצאות ל-6 חודשים"    k="future_forecast" last />
      </Group>

      <Group title="תצוגה">
        <Row label="תצוגה מימין לשמאל" desc="פריסת עברית (RTL)" k="rtl_mode" last />
      </Group>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 4px 9px' }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink-2)' }}>קטגוריות מותאמות</span>
          <button className="tap" onClick={() => setAddOpen(true)} style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--blue)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Icon name="add" size={16}/> הוסף
          </button>
        </div>
        <div className="glass" style={{ borderRadius: 22, padding: '6px 16px' }}>
          {customCats.length === 0 ? (
            <div style={{ padding: '22px 0', textAlign: 'center', color: 'var(--ink-2)', fontWeight: 600, fontSize: 14 }}>אין עדיין קטגוריות מותאמות</div>
          ) : customCats.map((c, i) => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i === customCats.length - 1 ? 'none' : '1px solid var(--hairline)' }}>
              <CatChip color={c.color_hex} name={c.name} iconName={c.icon_name} size={36} r={12} />
              <span style={{ flex: 1, fontWeight: 700, fontSize: 15 }}>{c.name}</span>
              <span style={{ fontSize: 12.5, color: 'var(--ink-2)', fontWeight: 600 }}>{c.type === 'income' ? 'הכנסה' : 'הוצאה'}</span>
              <button className="tap" onClick={() => setDelCat(c)} style={{ color: 'var(--neg)', padding: 4 }}><Icon name="trash" size={18}/></button>
            </div>
          ))}
        </div>
      </div>

      {smsToken && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink-2)', margin: '0 4px 9px' }}>אינטגרציית SMS</div>
          <div className="glass" style={{ borderRadius: 22, padding: 16 }}>
            <p style={{ margin: '0 0 14px', fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.5 }}>
              חבר/י אפליקציית העברת SMS כדי לרשום עסקאות אוטומטית. השתמש/י בטוקן האישי.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'var(--glass-2)', border: '1px solid var(--hairline)', borderRadius: 14, padding: '11px 13px' }}>
              <Icon name="lock" size={17} style={{ color: 'var(--ink-2)' }} />
              <span className="tnum" style={{ flex: 1, fontSize: 14.5, fontWeight: 700, letterSpacing: reveal ? 0 : '0.1em', color: reveal ? 'var(--ink)' : 'var(--ink-2)' }}>{reveal ? smsToken : masked}</span>
              <button className="tap" onClick={() => setReveal(r => !r)} style={{ color: 'var(--ink-2)', padding: 3 }}><Icon name="eye" size={18}/></button>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              <button className="btn btn-ghost tap" style={{ flex: 1, height: 46 }} onClick={copy}><Icon name="copy" size={18}/> העתק</button>
            </div>
          </div>
        </div>
      )}

      <Confirm open={!!delCat} title="מחיקת קטגוריה" danger confirmLabel="מחק"
        body={`למחוק את הקטגוריה "${delCat?.name}"? עסקאות קיימות יסומנו כ"אחר".`}
        onConfirm={deleteCat} onClose={() => setDelCat(null)} />
      <AddCategoryModal open={addOpen} onClose={() => setAddOpen(false)} onAdd={addCat} />
    </div>
  )
}
