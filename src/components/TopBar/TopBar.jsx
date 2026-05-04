import './TopBar.css'

export default function TopBar({ userName, onNavigate }) {
  return (
    <header className="topbar glass-panel" dir="rtl">

      {/* Avatar / user greeting */}
      <div className="topbar__avatar glass-panel" onClick={() => onNavigate?.('/profile')} style={{ cursor: 'pointer' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-primary)' }}>account_circle</span>
      </div>

      {/* Brand — centered */}
      <div className="topbar__brand" onClick={() => onNavigate?.('/dashboard')} style={{ cursor: 'pointer' }}>
        <span className="material-symbols-outlined topbar__logo-icon">bubble_chart</span>
        <span className="topbar__name text-headline-md">Predicta</span>
      </div>

      {/* Settings icon */}
      <button className="topbar__settings" onClick={() => onNavigate?.('/settings')} aria-label="הגדרות">
        <span className="material-symbols-outlined">settings</span>
      </button>

    </header>
  )
}
