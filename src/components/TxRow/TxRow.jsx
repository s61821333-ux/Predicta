import { useState } from 'react'
import CatChip from '../CatChip/CatChip'
import Icon from '../Icon/Icon'

const nf = new Intl.NumberFormat('en-US')
function fmt(n) { return '₪' + nf.format(Math.round(Math.abs(n))) }
function fmtSigned(n, type) { return (type === 'income' ? '+' : '−') + fmt(n) }
function shortDate(s) {
  if (!s) return ''
  const dt = new Date(s)
  return `${String(dt.getDate()).padStart(2, '0')}/${String(dt.getMonth() + 1).padStart(2, '0')}`
}
function relLabel(s) {
  if (!s) return ''
  const dt = new Date(s)
  const now = new Date()
  const diff = Math.round((now - dt) / 86400000)
  if (diff === 0) return 'היום'
  if (diff === 1) return 'אתמול'
  if (diff < 0) return 'עתידי'
  return shortDate(s)
}

export default function TxRow({ t, onDelete, expandable = true }) {
  const [open, setOpen] = useState(false)
  const cat = t.category || {}
  const inc = t.type === 'income'
  const future = t.status === 'future'

  return (
    <div style={{
      borderRadius: 18, overflow: 'hidden',
      border: future ? '1.5px dashed var(--hairline)' : '1px solid transparent',
      opacity: future ? 0.7 : 1,
    }}>
      <div className="tap" onClick={() => expandable && setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '10px 8px', cursor: expandable ? 'pointer' : 'default' }}>
        <CatChip
          color={cat.color_hex || '#8A93A8'}
          name={cat.name || ''}
          iconName={cat.icon_name}
          size={46}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {t.description || cat.name || 'עסקה'}
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink-2)', display: 'flex', gap: 7, alignItems: 'center', marginTop: 2 }}>
            <span>{cat.name}</span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span>{future ? 'עתידי' : relLabel(t.date)}</span>
          </div>
        </div>
        <div className="tnum" style={{ fontWeight: 800, fontSize: 16, color: inc ? 'var(--pos)' : 'var(--ink)', flexShrink: 0 }}>
          {fmtSigned(t.amount, t.type)}
        </div>
      </div>
      {open && (
        <div className="enter" style={{ padding: '0 10px 12px', display: 'flex', gap: 18, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 18, fontSize: 13, color: 'var(--ink-2)' }}>
            <span>תאריך: {shortDate(t.date)}</span>
            <span>סטטוס: {future ? 'עתידי' : 'הושלם'}</span>
          </div>
          {onDelete && (
            <button className="tap" onClick={e => { e.stopPropagation(); onDelete(t) }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--neg)', fontWeight: 700, fontSize: 13 }}>
              <Icon name="trash" size={17} /> מחק
            </button>
          )}
        </div>
      )}
    </div>
  )
}
