import { useEffect, useState } from 'react'
import { useUser } from '../../context/UserContext'
import { fetchTransactions, deleteTransaction } from '../../lib/db'
import TxRow from '../../components/TxRow/TxRow'
import { Confirm } from '../../components/Modal/Modal'
import Icon from '../../components/Icon/Icon'

export default function SearchPage() {
  const { profile } = useUser()
  const [q, setQ] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [txs, setTxs] = useState([])
  const [del, setDel] = useState(null)

  useEffect(() => {
    if (!profile?.id) return
    fetchTransactions(profile.id).then(({ data }) => setTxs(data || []))
  }, [profile?.id])

  const handleDelete = async () => {
    if (!del) return
    await deleteTransaction(del.id)
    setTxs(prev => prev.filter(t => t.id !== del.id))
    setDel(null)
  }

  const filtered = txs.filter(t => {
    if (typeFilter !== 'all' && t.type !== typeFilter) return false
    if (q) {
      const hay = ((t.description || '') + ' ' + (t.category?.name || '')).toLowerCase()
      if (!hay.includes(q.toLowerCase())) return false
    }
    return true
  })

  const groups = {}
  filtered.forEach(t => {
    const dt = new Date(t.date)
    const now = new Date()
    const diff = Math.round((now - dt) / 86400000)
    const key = t.status === 'future' ? 'עתידי' : diff === 0 ? 'היום' : diff === 1 ? 'אתמול' : dt.toLocaleDateString('he-IL')
    if (!groups[key]) groups[key] = []
    groups[key].push(t)
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <h1 style={{ margin: '2px 4px', fontSize: 26, fontWeight: 800 }}>חיפוש והיסטוריה</h1>

      <div className="glass" style={{ borderRadius: 18, padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon name="search" size={20} style={{ color: 'var(--ink-2)' }} />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="חפש לפי תיאור או קטגוריה…"
          style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--ink)', fontSize: 16, padding: '12px 0' }} />
        {q && <button className="tap" onClick={() => setQ('')} style={{ color: 'var(--ink-3)' }}><Icon name="close" size={18}/></button>}
      </div>

      <div className="seg">
        <button className={typeFilter === 'all'     ? 'on neu' : ''} onClick={() => setTypeFilter('all')}>הכל</button>
        <button className={typeFilter === 'expense' ? 'on exp' : ''} onClick={() => setTypeFilter('expense')}>הוצאות</button>
        <button className={typeFilter === 'income'  ? 'on inc' : ''} onClick={() => setTypeFilter('income')}>הכנסות</button>
      </div>

      {filtered.length === 0 ? (
        <div className="glass" style={{ borderRadius: 24, padding: '44px 20px', textAlign: 'center', color: 'var(--ink-2)' }}>
          <div style={{ fontSize: 38, marginBottom: 10 }}>🔍</div>
          <div style={{ fontWeight: 800, fontSize: 17, color: 'var(--ink)' }}>לא נמצאו תוצאות</div>
          <div style={{ fontSize: 14, marginTop: 4 }}>נסה לשנות את החיפוש או המסננים</div>
          {(q || typeFilter !== 'all') && (
            <button className="btn btn-ghost" style={{ marginTop: 16, height: 44 }} onClick={() => { setQ(''); setTypeFilter('all') }}>נקה מסננים</button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {Object.entries(groups).map(([label, items]) => (
            <div key={label}>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink-2)', margin: '0 4px 6px' }}>{label}</div>
              <div className="glass" style={{ borderRadius: 22, padding: '6px 10px' }}>
                {items.map(t => <TxRow key={t.id} t={t} onDelete={setDel} />)}
              </div>
            </div>
          ))}
        </div>
      )}

      <Confirm
        open={!!del}
        title="מחיקת עסקה"
        danger confirmLabel="מחק"
        body={`האם אתה בטוח שברצונך למחוק את "${del?.description || del?.category?.name || 'עסקה'}"?`}
        onConfirm={handleDelete}
        onClose={() => setDel(null)}
      />
    </div>
  )
}
