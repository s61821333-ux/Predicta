import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Logo } from '../../components/Logo/Logo'
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle'
import Icon from '../../components/Icon/Icon'

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState('')
  const [error,   setError]   = useState('')
  const [sent,    setSent]    = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setLoading(false)
    if (err) { setError(err.message || 'שגיאה בשליחת הקישור'); return }
    setSent(true)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, position: 'relative' }}>
      <div className="amb"><b/><b/><b/></div>
      <div style={{ position: 'absolute', top: 16, insetInlineEnd: 16, zIndex: 10 }}><ThemeToggle /></div>

      <div className="glass glass-strong enter" style={{ width: '100%', maxWidth: 400, borderRadius: 28, padding: 32, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 28 }}>
          <Logo size={52} />
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>שכחתי סיסמה</h1>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-2)', fontWeight: 600, textAlign: 'center' }}>נשלח לך קישור לאיפוס הסיסמה</p>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--pos-soft)', display: 'grid', placeItems: 'center', margin: '0 auto 16px', color: 'var(--pos)' }}>
              <Icon name="check" size={28} sw={2.5} />
            </div>
            <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>הקישור נשלח!</p>
            <p style={{ color: 'var(--ink-2)', fontSize: 14, lineHeight: 1.5 }}>
              בדוק את תיבת הדואר שלך ב-<strong>{email}</strong> ולחץ על הקישור לאיפוס הסיסמה.
            </p>
            <Link to="/login" style={{ display: 'inline-block', marginTop: 20, color: 'var(--blue)', fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>
              חזרה לכניסה
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-2)', paddingInlineStart: 4 }}>אימייל</label>
              <input className="field" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required autoComplete="email" />
            </div>

            {error && (
              <div style={{ color: 'var(--neg)', fontSize: 13.5, fontWeight: 700, textAlign: 'center', padding: '10px 14px', borderRadius: 12, background: 'var(--neg-soft)' }}>
                {error}
              </div>
            )}

            <button className="btn btn-primary tap" type="submit" disabled={loading}
              style={{ width: '100%', height: 52, marginTop: 4, fontSize: 16, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'שולח…' : <><Icon name="bell" size={18} sw={2.2} /> שלח קישור איפוס</>}
            </button>

            <p style={{ marginTop: 6, textAlign: 'center', fontSize: 14, color: 'var(--ink-2)' }}>
              <Link to="/login" style={{ color: 'var(--blue)', fontWeight: 700, textDecoration: 'none' }}>חזרה לכניסה</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
