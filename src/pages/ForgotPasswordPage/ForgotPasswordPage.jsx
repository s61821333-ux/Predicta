import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Logo } from '../../components/Logo/Logo'
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle'
import Icon from '../../components/Icon/Icon'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/login` })
    setLoading(false)
    setSent(true)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, position: 'relative' }}>
      <div className="amb"><b/><b/><b/></div>
      <div style={{ position: 'absolute', top: 16, insetInlineEnd: 16, zIndex: 10 }}><ThemeToggle /></div>
      <div className="glass glass-strong enter" style={{ width: '100%', maxWidth: 400, borderRadius: 28, padding: 32, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 28 }}>
          <Logo size={52} />
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>שחזור סיסמה</h1>
        </div>
        {sent ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📬</div>
            <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>בדוק את האימייל שלך</div>
            <div style={{ color: 'var(--ink-2)', fontSize: 14, lineHeight: 1.6 }}>שלחנו קישור לאיפוס הסיסמה לכתובת {email}</div>
            <Link to="/login" style={{ display: 'block', marginTop: 20 }} className="btn btn-primary" style={{ height: 48, fontSize: 15, color: '#fff', background: 'linear-gradient(180deg, var(--blue-300), var(--blue))' }}>חזרה לכניסה</Link>
          </div>
        ) : (
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-2)', paddingInlineStart: 4 }}>כתובת אימייל</label>
              <input className="field" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', height: 52, fontSize: 16, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'שולח…' : <><Icon name="send" size={18} /> שלח קישור</>}
            </button>
          </form>
        )}
        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 14 }}>
          <Link to="/login" style={{ color: 'var(--blue)', fontWeight: 700, textDecoration: 'none' }}>חזרה לכניסה</Link>
        </div>
      </div>
    </div>
  )
}
