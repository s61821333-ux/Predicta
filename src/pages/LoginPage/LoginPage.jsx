import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button     from '../../components/Button/Button'
import InputField from '../../components/InputField/InputField'
import GlassCard  from '../../components/GlassCard/GlassCard'
import './AuthPage.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const [method, setMethod] = useState('otp') // 'otp' | 'password'

  return (
    <div className="auth-page organic-bg" dir="rtl">
      <div className="app-blob app-blob--top"    aria-hidden="true" />
      <div className="app-blob app-blob--bottom" aria-hidden="true" />

      {/* Back */}
      <button className="auth-back" onClick={() => navigate('/')}>
        <span className="material-symbols-outlined">arrow_forward</span>
      </button>

      <div className="auth-content animate-fade-in-up">
        {/* Brand */}
        <div className="auth-brand">
          <span className="material-symbols-outlined auth-brand__icon">bubble_chart</span>
          <span className="text-headline-md auth-brand__name">Predicta</span>
        </div>

        <h1 className="text-headline-lg auth-title">ברוך הבא</h1>
        <p className="text-body-md auth-sub">היכנס לחשבון שלך</p>

        <GlassCard variant="panel" className="auth-card">

          {/* Method toggle */}
          <div className="auth-method-toggle glass-recessed">
            <button
              className={`auth-method-btn${method === 'otp' ? ' auth-method-btn--active' : ''}`}
              onClick={() => setMethod('otp')}
            >
              קוד OTP
            </button>
            <button
              className={`auth-method-btn${method === 'password' ? ' auth-method-btn--active' : ''}`}
              onClick={() => setMethod('password')}
            >
              סיסמה
            </button>
          </div>

          <InputField
            label="מספר טלפון"
            placeholder="05X-XXX-XXXX"
            icon="phone"
            type="tel"
          />

          {method === 'otp' ? (
            <InputField
              label="קוד אימות (OTP)"
              placeholder="הזן קוד 6 ספרות"
              icon="sms"
              type="number"
            />
          ) : (
            <InputField
              label="סיסמה"
              placeholder="הזן סיסמה"
              icon="lock"
              type="password"
            />
          )}

          {method === 'otp' && (
            <button className="auth-otp-send text-label-bold">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>send</span>
              שלח קוד SMS
            </button>
          )}

          <Button variant="primary" full onClick={() => navigate('/dashboard')}>
            כניסה
          </Button>

          {/* Divider */}
          <div className="auth-divider">
            <span className="auth-divider__line" />
            <span className="text-label-light auth-divider__text">או</span>
            <span className="auth-divider__line" />
          </div>

          {/* Google */}
          <Button variant="glass" full icon="google">
            כניסה עם Google
          </Button>

          {/* Links */}
          <div className="auth-links">
            <button className="auth-link text-label-light" onClick={() => navigate('/forgot-password')}>
              שכחתי סיסמה
            </button>
            <button className="auth-link text-label-bold" onClick={() => navigate('/register')}>
              הרשמה
            </button>
          </div>

        </GlassCard>
      </div>
    </div>
  )
}
