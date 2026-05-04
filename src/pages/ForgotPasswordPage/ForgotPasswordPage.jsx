import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button     from '../../components/Button/Button'
import InputField from '../../components/InputField/InputField'
import GlassCard  from '../../components/GlassCard/GlassCard'
import './AuthPage.css'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [sent, setSent] = useState(false)

  return (
    <div className="auth-page organic-bg" dir="rtl">
      <div className="app-blob app-blob--top"    aria-hidden="true" />
      <div className="app-blob app-blob--bottom" aria-hidden="true" />

      <button className="auth-back" onClick={() => navigate('/login')}>
        <span className="material-symbols-outlined">arrow_forward</span>
      </button>

      <div className="auth-content">
        <div className="auth-brand">
          <span className="material-symbols-outlined auth-brand__icon">bubble_chart</span>
          <span className="text-headline-md auth-brand__name">Predicta</span>
        </div>

        <h1 className="text-headline-lg auth-title">שחזור סיסמה</h1>
        <p className="text-body-md auth-sub">נשלח לך קוד אימות</p>

        <GlassCard variant="panel" className="auth-card">

          {!sent ? (
            <>
              <InputField
                label="מספר טלפון או אימייל"
                placeholder="05X-XXX-XXXX / email@example.com"
                icon="contact_phone"
              />

              <Button variant="primary" full onClick={() => setSent(true)} icon="send">
                שלח קוד אימות
              </Button>
            </>
          ) : (
            <>
              <div className="auth-info" style={{ background: 'rgba(0,180,100,0.08)', borderColor: 'rgba(0,180,100,0.2)' }}>
                <span className="material-symbols-outlined auth-info__icon" style={{ color: '#00a060' }}>check_circle</span>
                <p className="auth-info__text">קוד אימות נשלח! בדוק את SMS / האימייל שלך</p>
              </div>

              <InputField
                label="קוד אימות"
                placeholder="הזן קוד 6 ספרות"
                icon="sms"
                type="number"
              />

              <InputField
                label="סיסמה חדשה"
                placeholder="לפחות 8 תווים"
                icon="lock"
                type="password"
              />

              <InputField
                label="אימות סיסמה"
                placeholder="חזור על הסיסמה החדשה"
                icon="lock_reset"
                type="password"
              />

              <Button variant="primary" full onClick={() => navigate('/login')} icon="check">
                עדכן סיסמה
              </Button>
            </>
          )}

          <div className="auth-links" style={{ justifyContent: 'center' }}>
            <button className="auth-link text-label-light" onClick={() => navigate('/login')}>
              חזרה לכניסה
            </button>
          </div>

        </GlassCard>
      </div>
    </div>
  )
}
