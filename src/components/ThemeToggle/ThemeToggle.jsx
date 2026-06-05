import { useTheme } from '../../context/ThemeContext'

export default function ThemeToggle({ size = 42 }) {
  const { theme, toggleTheme } = useTheme()
  const dark = theme === 'dark'
  return (
    <button className="tap" onClick={toggleTheme} aria-label="החלף ערכת נושא"
      style={{
        width: size, height: size, borderRadius: '50%', display: 'grid', placeItems: 'center',
        background: 'var(--glass-2)', border: '1px solid var(--glass-line)', color: 'var(--ink)',
        boxShadow: 'var(--shadow)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      }}>
      {dark ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
          <circle cx="12" cy="12" r="4.2"/>
          <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/>
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 14.5A8 8 0 0 1 9.5 4 7 7 0 1 0 20 14.5Z"/>
        </svg>
      )}
    </button>
  )
}
