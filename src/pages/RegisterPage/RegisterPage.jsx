import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signUpUser } from '../../lib/auth'
import { Logo } from '../../components/Logo/Logo'
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle'
import Icon from '../../components/Icon/Icon'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName,  setLastName]  = useState('')
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [error,     setError]     = useState('')
  const [loading,   setLoading]   = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (password.length < 6) { setError('הסיסמה חייבת להכיל לפחות 6 תווים'); return }
    setError('')
    setLoading(true)
    const { error: err } = await signUpUser({ email, password, firstName, lastName })
    setLoading(false)
    if (err) { setError(err.message || 'שגיאה בהרשמה'); return }
    navigate('/dashboard')
  }

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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-2)', paddingInlineStart: 4 }}>שם פרטי</label>
              <input className="field" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="ישראל" required autoComplete="given-name" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-2)', paddingInlineStart: 4 }}>שם משפחה</label>
              <input className="field" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="ישראלי" required autoComplete="family-name" />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-2)', paddingInlineStart: 4 }}>אימייל</label>
            <input className="field" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required autoComplete="email" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-2)', paddingInlineStart: 4 }}>סיסמה</label>
            <input className="field" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="לפחות 6 תווים" required autoComplete="new-password" />
          </div>

          {error && (
            <div style={{ color: 'var(--neg)', fontSize: 13.5, fontWeight: 700, textAlign: 'center', padding: '10px 14px', borderRadius: 12, background: 'var(--neg-soft)' }}>
              {error}
            </div>
          )}

          <button className="btn btn-primary tap" type="submit" disabled={loading}
            style={{ width: '100%', height: 52, marginTop: 4, fontSize: 16, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'נרשם…' : <><Icon name="check" size={18} sw={2.4} /> הרשמה</>}
          </button>
        </form>

        <p style={{ marginTop: 20, textAlign: 'center', fontSize: 14, color: 'var(--ink-2)' }}>
          כבר יש לך חשבון?{' '}
          <Link to="/login" style={{ color: 'var(--blue)', fontWeight: 700, textDecoration: 'none' }}>כניסה</Link>
        </p>
      </div>
    </div>
  )
}
