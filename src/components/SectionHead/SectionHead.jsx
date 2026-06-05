export default function SectionHead({ title, action, onAction }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '4px 4px 12px' }}>
      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 9 }}>
        <span style={{ width: 4, height: 17, borderRadius: 3, background: 'linear-gradient(var(--blue-300), var(--blue))', flexShrink: 0 }} />
        {title}
      </h2>
      {action && (
        <button className="tap" onClick={onAction} style={{ fontSize: 14, fontWeight: 700, color: 'var(--blue)' }}>
          {action}
        </button>
      )}
    </div>
  )
}
