import Icon from '../Icon/Icon'

export default function Toast({ msg, show }) {
  return (
    <div style={{
      position: 'fixed', bottom: 100, left: '50%', transform: `translateX(-50%) translateY(${show ? 0 : 20}px)`,
      opacity: show ? 1 : 0, transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      zIndex: 200, pointerEvents: 'none',
    }}>
      <div className="glass glass-strong" style={{ padding: '12px 20px', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 9, fontWeight: 700, boxShadow: 'var(--shadow-lg)' }}>
        <span style={{ color: 'var(--pos)', display: 'grid', placeItems: 'center' }}>
          <Icon name="check" size={20} sw={2.4} />
        </span>
        {msg}
      </div>
    </div>
  )
}
