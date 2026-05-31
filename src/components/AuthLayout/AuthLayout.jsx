import { Link, useNavigate } from 'react-router-dom'
import './AuthLayout.css'

const HIGHLIGHTS = [
  { icon: 'timeline', text: 'תחזית תזרים 6 חודשים' },
  { icon: 'psychology', text: 'ניתוח הוצאות עם AI' },
  { icon: 'shield', text: 'מאובטח ב-Supabase' },
]

export default function AuthLayout({
  mode = 'login',
  title,
  subtitle,
  children,
  footer,
}) {
  const navigate = useNavigate()
  const isLogin = mode === 'login'

  return (
    <div className="auth-shell organic-bg" dir="rtl">
      <div className="app-blob app-blob--top" aria-hidden="true" />
      <div className="app-blob app-blob--bottom" aria-hidden="true" />

      <button
        type="button"
        className="auth-shell__back"
        onClick={() => navigate('/')}
        aria-label="חזרה לדף הבית"
      >
        <span className="material-symbols-outlined">arrow_forward</span>
      </button>

      <div className="auth-shell__grid">
        <aside className="auth-shell__hero glass-panel animate-fade-in-up">
          <div className="auth-shell__hero-brand">
            <span className="material-symbols-outlined auth-shell__hero-icon">bubble_chart</span>
            <span className="text-headline-md">Predicta</span>
          </div>

          <h2 className="text-headline-lg auth-shell__hero-title">
            {isLogin ? 'שלום שוב!' : 'הצטרף ל-Predicta'}
          </h2>
          <p className="text-body-md auth-shell__hero-sub">
            {isLogin
              ? 'התחבר לחשבון שלך וצפה בתמונת התקציב המעודכנת שלך.'
              : 'צור חשבון אחד ונהל את כל הכספים שלך במקום אחד.'}
          </p>

          <ul className="auth-shell__highlights">
            {HIGHLIGHTS.map(({ icon, text }) => (
              <li key={text} className="auth-shell__highlight">
                <span className="material-symbols-outlined auth-shell__highlight-icon">{icon}</span>
                <span className="text-label-bold">{text}</span>
              </li>
            ))}
          </ul>

          <div className="auth-shell__db-badge">
            <span className="material-symbols-outlined">database</span>
            <span className="text-label-light">מחובר ל-Supabase</span>
          </div>
        </aside>

        <main className="auth-shell__main animate-fade-in-up delay-100">
          <div className="auth-shell__form-header">
            <h1 className="text-headline-lg">{title}</h1>
            <p className="text-body-md auth-shell__subtitle">{subtitle}</p>
          </div>

          <div className="auth-shell__card glass-panel">
            {children}
          </div>

          {footer && <div className="auth-shell__footer">{footer}</div>}

          <p className="auth-shell__switch text-body-md">
            {isLogin ? (
              <>
                אין לך חשבון?{' '}
                <Link to="/register" className="auth-shell__switch-link">הרשמה</Link>
              </>
            ) : (
              <>
                כבר יש לך חשבון?{' '}
                <Link to="/login" className="auth-shell__switch-link">כניסה</Link>
              </>
            )}
          </p>
        </main>
      </div>
    </div>
  )
}
