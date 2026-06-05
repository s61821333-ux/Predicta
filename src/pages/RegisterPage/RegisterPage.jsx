import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signUpUser } from '../../lib/auth'
import { Logo } from '../../components/Logo/Logo'
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle'
import Icon from '../../components/Icon/Icon'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [f, setF] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await signUpUser({ email: f.email, password: f.password, firstName: f.firstName, lastName: f.lastName })
    setLoading(false)
    if (err) { setError(err.message || 'שגיאה בהרשמה'); return }
    navigate('/dashboard')
  }

  const field = (key, label, type = 'text', placeholder = '') => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-2)', paddingInlineStart: 4 }}>{label}</label>
      <input className="field" type={type} value={f[key]} placeholder={placeholder} required
        onChange={e => setF({ ...f, [key]: e.target.value })} />
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, position: 'relative' }}>
      <div className="amb"><b/><b/><b/></div>
      <div style={{ position: 'absolute', top: 16, insetInlineEnd: 16, zIndex: 10 }}><ThemeToggle /></div>
      <div className="glass glass-strong enter" style={{ width: '100%', maxWidth: 420, borderRadius: 28, padding: 32, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 28 }}>
          <Logo size={52} />
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>הצטרפות ל-Predicta</h1>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-2)', fontWeight: 600 }}>נהל את הכסף שלך בחכמה</p>
        </div>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {field('firstName', 'שם פרטי')}
            {field('lastName', 'שם משפחה')}
          </div>
          {field('email', 'אימייל', 'email', 'your@email.com')}
          {field('password', 'סיסמה', 'password', '••••••••')}
          {error && <div style={{ color: 'var(--neg)', fontSize: 13.5, fontWeight: 700, textAlign: 'center', padding: '8px 12px', borderRadius: 10, background: 'var(--neg-soft)' }}>{error}</div>}
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', height: 52, marginTop: 4, fontSize: 16, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'נרשם…' : <><Icon name="check" size={18} sw={2.4} /> הרשמה</>}
          </button>
        </form>
        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 14, color: 'var(--ink-2)' }}>
          כבר יש לך חשבון? <Link to="/login" style={{ color: 'var(--blue)', fontWeight: 700, textDecoration: 'none' }}>כניסה</Link>
        </div>
      </div>
    </div>
  )
}
