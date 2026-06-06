import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { sendRegistrationOtp, verifyOtpAndRegisterPasskey } from '../../lib/auth'
import { Logo } from '../../components/Logo/Logo'
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle'
import Icon from '../../components/Icon/Icon'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [step, setStep]           = useState(1)
  const [firstName, setFirstName] = useState('')
  const [lastName,  setLastName]  = useState('')
  const [email,     setEmail]     = useState('')
  const [otp,       setOtp]       = useState('')
  const [error,     setError]     = useState('')
  const [loading,   setLoading]   = useState(false)

  const sendOtp = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await sendRegistrationOtp({ email, firstName, lastName })
    setLoading(false)
    if (err) { setError(err.message || 'שגיאה בשליחת הקוד'); return }
    setStep(2)
  }

  const verifyAndRegister = async (e) => {
    e.preventDefault()
    if (otp.length < 6) { setError('הכנס קוד בן 6 ספרות'); return }
    setError('')
    setLoading(true)
    const { error: err } = await verifyOtpAndRegisterPasskey({ email, token: otp, firstName, lastName })
    setLoading(false)
    if (err) { setError(err.message || 'שגיאה ביצירת מפתח הגישה'); return }
    navigate('/dashboard')
  }

  const ErrorBanner = () => error ? (
    <div style={{ color: 'var(--neg)', fontSize: 13.5, fontWeight: 700, textAlign: 'center', padding: '10px 14px', borderRadius: 12, background: 'var(--neg-soft)' }}>
      {error}
    </div>
  ) : null

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, position: 'relative' }}>
      <div className="amb"><b/><b/><b/></div>
      <div style={{ position: 'absolute', top: 16, insetInlineEnd: 16, zIndex: 10 }}><ThemeToggle /></div>

      <div className="glass glass-strong enter" style={{ width: '100%', maxWidth: 420, borderRadius: 28, padding: 32, position: 'relative', zIndex: 1 }}>

        {step === 1 ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 28 }}>
              <Logo size={52} />
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>הצטרפות ל-Predicta</h1>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-2)', fontWeight: 600 }}>נהל את הכסף שלך בחכמה</p>
            </div>

            <form onSubmit={sendOtp} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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

              <ErrorBanner />

              <button className="btn btn-primary tap" type="submit" disabled={loading}
                style={{ width: '100%', height: 52, marginTop: 4, fontSize: 16, opacity: loading ? 0.7 : 1 }}>
                {loading ? 'שולח…' : 'שלח קוד אימות'}
              </button>
            </form>

            <p style={{ marginTop: 20, textAlign: 'center', fontSize: 14, color: 'var(--ink-2)' }}>
              כבר יש לך חשבון?{' '}
              <Link to="/login" style={{ color: 'var(--blue)', fontWeight: 700, textDecoration: 'none' }}>כניסה</Link>
            </p>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginBottom: 28 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--blue-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue)' }}>
                <Icon name="lock" size={26} sw={2.2} />
              </div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>בדוק את האימייל שלך</h1>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-2)', fontWeight: 600, textAlign: 'center', lineHeight: 1.6 }}>
                שלחנו קוד בן 6 ספרות לכתובת<br/>
                <strong style={{ color: 'var(--ink-1)' }}>{email}</strong>
              </p>
            </div>

            <form onSubmit={verifyAndRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-2)', paddingInlineStart: 4 }}>קוד אימות</label>
                <input
                  className="field"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  style={{ textAlign: 'center', fontSize: 24, letterSpacing: 10, fontWeight: 700 }}
                  required
                />
              </div>

              <ErrorBanner />

              <button className="btn btn-primary tap" type="submit" disabled={loading}
                style={{ width: '100%', height: 52, marginTop: 4, fontSize: 16, opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {loading ? 'יוצר מפתח גישה…' : <><Icon name="lock" size={18} sw={2.4} /> אמת וצור מפתח גישה</>}
              </button>
            </form>

            <p style={{ marginTop: 16, textAlign: 'center', fontSize: 13, color: 'var(--ink-2)' }}>
              לא קיבלת קוד?{' '}
              <button
                onClick={() => { setStep(1); setOtp(''); setError('') }}
                style={{ color: 'var(--blue)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, padding: 0 }}
              >
                נסה שוב
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
