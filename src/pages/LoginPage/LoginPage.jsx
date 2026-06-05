import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signInUser } from '../../lib/auth'
import { Logo } from '../../components/Logo/Logo'
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle'
import Icon from '../../components/Icon/Icon'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await signInUser({ email, password })
    setLoading(false)
    if (err) { setError(err.message || 'שגיאה בכניסה'); return }
    navigate('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, position: 'relative' }}>
      <div className="amb"><b/><b/><b/></div>
      <div style={{ position: 'absolute', top: 16, insetInlineEnd: 16, zIndex: 10 }}><ThemeToggle /></div>
      <div className="glass glass-strong enter" style={{ width: '100%', maxWidth: 400, borderRadius: 28, padding: 32, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 28 }}>
          <Logo size={56} />
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>Predicta</h1>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-2)', fontWeight: 600 }}>הכסף שלך, בבהירות</p>
        </div>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-2)', paddingInlineStart: 4 }}>אימייל</label>
            <input className="field" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-2)', paddingInlineStart: 4 }}>סיסמה</label>
            <input className="field" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          {error && <div style={{ color: 'var(--neg)', fontSize: 13.5, fontWeight: 700, textAlign: 'center', padding: '8px 12px', borderRadius: 10, background: 'var(--neg-soft)' }}>{error}</div>}
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', height: 52, marginTop: 4, fontSize: 16, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'נכנס…' : <><Icon name="arrowDown" size={18} sw={2.4} /> כניסה</>}
          </button>
        </form>
        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 14, color: 'var(--ink-2)' }}>
          <Link to="/forgot-password" style={{ color: 'var(--blue)', fontWeight: 700, textDecoration: 'none' }}>שכחתי סיסמה</Link>
          <span style={{ margin: '0 10px' }}>·</span>
          <Link to="/register" style={{ color: 'var(--blue)', fontWeight: 700, textDecoration: 'none' }}>הרשמה</Link>
        </div>
      </div>
    </div>
  )
}
