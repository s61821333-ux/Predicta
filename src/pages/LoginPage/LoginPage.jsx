import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signInWithPasskey } from '../../lib/auth'
import { Logo } from '../../components/Logo/Logo'
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle'
import Icon from '../../components/Icon/Icon'

export default function LoginPage() {
  const navigate = useNavigate()
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handlePasskey = async () => {
    setError('')
    setLoading(true)
    const { error: err } = await signInWithPasskey()
    setLoading(false)
    if (err) { setError(err.message || 'שגיאה בכניסה, נסה שוב'); return }
    navigate('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, position: 'relative' }}>
      <div className="amb"><b/><b/><b/></div>
      <div style={{ position: 'absolute', top: 16, insetInlineEnd: 16, zIndex: 10 }}><ThemeToggle /></div>

      <div className="glass glass-strong enter" style={{ width: '100%', maxWidth: 400, borderRadius: 28, padding: 32, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 32 }}>
          <Logo size={56} />
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>Predicta</h1>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-2)', fontWeight: 600 }}>הכסף שלך, בבהירות</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {error && (
            <div style={{ color: 'var(--neg)', fontSize: 13.5, fontWeight: 700, textAlign: 'center', padding: '10px 14px', borderRadius: 12, background: 'var(--neg-soft)' }}>
              {error}
            </div>
          )}

          <button
            className="btn btn-primary tap"
            onClick={handlePasskey}
            disabled={loading}
            style={{ width: '100%', height: 56, fontSize: 16, opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
          >
            {loading
              ? 'מאמת…'
              : <><Icon name="lock" size={20} sw={2.3} /> כניסה עם מפתח גישה</>
            }
          </button>

          <p style={{ margin: 0, textAlign: 'center', fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.7 }}>
            מפתח גישה משתמש בזיהוי ביומטרי<br/>או ב-PIN של המכשיר שלך
          </p>
        </div>

        <p style={{ marginTop: 28, textAlign: 'center', fontSize: 14, color: 'var(--ink-2)' }}>
          אין לך חשבון?{' '}
          <Link to="/register" style={{ color: 'var(--blue)', fontWeight: 700, textDecoration: 'none' }}>הרשמה</Link>
        </p>
      </div>
    </div>
  )
}
