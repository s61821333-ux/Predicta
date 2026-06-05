export function Modal({ open, onClose, children }) {
  if (!open) return null
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 300, display: 'grid', placeItems: 'center', padding: 20,
      background: 'rgba(8,14,28,0.45)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
      animation: 'fadeUp 0.25s cubic-bezier(0.32, 0.72, 0, 1)',
    }}>
      <div onClick={e => e.stopPropagation()} className="glass glass-strong"
        style={{ width: '100%', maxWidth: 380, borderRadius: 26, padding: 22, boxShadow: 'var(--shadow-lg)' }}>
        {children}
      </div>
    </div>
  )
}

export function Confirm({ open, title, body, danger, confirmLabel = 'אישור', onConfirm, onClose }) {
  return (
    <Modal open={open} onClose={onClose}>
      <h3 style={{ margin: '0 0 8px', fontSize: 19, fontWeight: 800 }}>{title}</h3>
      <p style={{ margin: '0 0 20px', color: 'var(--ink-2)', fontSize: 15, lineHeight: 1.5 }}>{body}</p>
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn btn-ghost" style={{ flex: 1, height: 48 }} onClick={onClose}>ביטול</button>
        <button className="btn" style={{
          flex: 1, height: 48, color: '#fff',
          background: danger
            ? 'linear-gradient(180deg, oklch(0.72 0.16 32), var(--neg))'
            : 'linear-gradient(180deg, var(--blue-300), var(--blue))',
          boxShadow: danger ? '0 8px 20px var(--neg-soft)' : '0 8px 20px var(--blue-glow)',
        }} onClick={() => { onConfirm(); onClose() }}>{confirmLabel}</button>
      </div>
    </Modal>
  )
}
