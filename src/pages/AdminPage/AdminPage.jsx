export default function AdminPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h1 style={{ margin: '2px 4px', fontSize: 26, fontWeight: 800 }}>מנהל מערכת</h1>
      <div className="glass" style={{ borderRadius: 24, padding: 28, textAlign: 'center', color: 'var(--ink-2)' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔧</div>
        <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--ink)' }}>פאנל ניהול</div>
        <div style={{ marginTop: 8, fontSize: 14, lineHeight: 1.6 }}>ממשק הניהול יהיה זמין בקרוב</div>
      </div>
    </div>
  )
}
