import './TopBar.css'

export default function TopBar({ userName, onNavigate, onLogout }) {
  return (
    <header className="topbar glass-panel" dir="rtl">

      <div className="topbar__actions">
        <button
          type="button"
          className="topbar__logout"
          onClick={onLogout}
          aria-label="התנתקות"
        >
          <span className="material-symbols-outlined">logout</span>
        </button>

        <div className="topbar__avatar glass-panel" onClick={() => onNavigate?.('/profile')} style={{ cursor: 'pointer' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-primary)' }}>account_circle</span>
        </div>
      </div>

      <div className="topbar__brand" onClick={() => onNavigate?.('/dashboard')} style={{ cursor: 'pointer' }}>
        <span className="material-symbols-outlined topbar__logo-icon">bubble_chart</span>
        <span className="topbar__name text-headline-md">Predicta</span>
      </div>

      <button type="button" className="topbar__settings" onClick={() => onNavigate?.('/settings')} aria-label="הגדרות">
        <span className="material-symbols-outlined">settings</span>
      </button>

    </header>
  )
}
