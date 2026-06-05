import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import { useAppState } from '../../context/AppStateContext'
import { fetchCategories, createTransaction } from '../../lib/db'
import CatChip from '../../components/CatChip/CatChip'
import Icon from '../../components/Icon/Icon'

export default function NewTransactionPage() {
  const { profile } = useUser()
  const { showToast } = useAppState()
  const navigate = useNavigate()
  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState('')
  const [desc, setDesc] = useState('')
  const [catId, setCatId] = useState(null)
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [future, setFuture] = useState(false)
  const [err, setErr] = useState(null)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    if (!profile?.id) return
    fetchCategories(profile.id).then(({ data }) => setCategories(data || []))
  }, [profile?.id])

  const cats = categories.filter(c => c.type === type || c.type === 'both')
  const selectedCat = cats.find(c => c.id === catId)

  const save = async () => {
    const amt = parseFloat(amount)
    if (!amt || amt <= 0) { setErr('amount'); return }
    if (!catId) { setErr('cat'); return }
    setSaving(true)
    try {
      await createTransaction(profile.id, {
        amount: amt, type,
        category_id: catId,
        description: desc.trim(),
        date,
        status: future ? 'future' : 'completed',
        currency: 'ILS',
      })
      showToast('העסקה נשמרה')
      navigate('/dashboard')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingBottom: 100 }}>
      <h1 style={{ margin: '2px 4px', fontSize: 26, fontWeight: 800 }}>עסקה חדשה</h1>

      <div className="seg">
        <button className={type === 'expense' ? 'on exp' : ''} onClick={() => { setType('expense'); setCatId(null) }}>הוצאה</button>
        <button className={type === 'income'  ? 'on inc' : ''} onClick={() => { setType('income');  setCatId(null) }}>הכנסה</button>
      </div>

      <div className="glass" style={{ borderRadius: 24, padding: '22px 20px', textAlign: 'center', border: err === 'amount' ? '1.5px solid var(--neg)' : undefined }}>
        <div style={{ fontSize: 13.5, color: 'var(--ink-2)', fontWeight: 600, marginBottom: 4 }}>סכום</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <span style={{ fontSize: 34, fontWeight: 800, color: amount ? (type === 'income' ? 'var(--pos)' : 'var(--ink)') : 'var(--ink-3)' }}>₪</span>
          <input
            className="tnum" inputMode="decimal" value={amount} placeholder="0"
            onChange={e => { setAmount(e.target.value.replace(/[^0-9.]/g, '')); setErr(null) }}
            style={{ background: 'none', border: 'none', outline: 'none', textAlign: 'center', width: 'min(60%, 220px)', fontSize: 52, fontWeight: 800, letterSpacing: '-0.02em', color: amount ? (type === 'income' ? 'var(--pos)' : 'var(--ink)') : 'var(--ink-3)' }}
          />
        </div>
        {err === 'amount' && <div style={{ color: 'var(--neg)', fontSize: 13, fontWeight: 700, marginTop: 6 }}>נא להזין סכום גדול מ-0</div>}
      </div>

      <input className="field" placeholder="מה קנית? (לא חובה)" value={desc} onChange={e => setDesc(e.target.value)} />

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 4px 10px' }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>קטגוריה</span>
          {err === 'cat' && <span style={{ color: 'var(--neg)', fontSize: 12.5, fontWeight: 700 }}>בחר/י קטגוריה</span>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 10 }}>
          {cats.map(c => {
            const on = catId === c.id
            return (
              <button key={c.id} className="tap" onClick={() => { setCatId(c.id); setErr(null) }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, padding: '12px 6px', borderRadius: 18, background: on ? `${c.color_hex}26` : 'var(--glass-2)', border: `1.5px solid ${on ? c.color_hex : 'var(--hairline)'}`, transition: 'all 0.18s var(--ease)' }}>
                <CatChip color={c.color_hex} name={c.name} iconName={c.icon_name} size={40} />
                <span style={{ fontSize: 12.5, fontWeight: on ? 700 : 600, color: on ? 'var(--ink)' : 'var(--ink-2)' }}>{c.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <label className="glass" style={{ borderRadius: 18, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 12.5, color: 'var(--ink-2)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="calendar" size={15}/> תאריך
          </span>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--ink)', fontSize: 15, fontWeight: 700, fontFamily: 'inherit' }} />
        </label>
        <button className="glass tap" onClick={() => setFuture(f => !f)}
          style={{ borderRadius: 18, padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'start' }}>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 12.5, color: 'var(--ink-2)', fontWeight: 600 }}>סטטוס</span>
            <span style={{ fontSize: 15, fontWeight: 700 }}>{future ? 'עתידי' : 'הושלם'}</span>
          </span>
          <span className={'sw' + (future ? ' on' : '')}><i /></span>
        </button>
      </div>

      <button className="btn btn-primary tap" onClick={save} disabled={saving}
        style={{ height: 56, width: '100%', fontSize: 17, opacity: saving ? 0.7 : 1 }}>
        {saving ? 'שומר…' : <><Icon name="check" size={20} sw={2.4}/> שמור עסקה</>}
      </button>
    </div>
  )
}
