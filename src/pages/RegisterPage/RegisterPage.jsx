import { useNavigate } from 'react-router-dom'
import Button     from '../../components/Button/Button'
import InputField from '../../components/InputField/InputField'
import GlassCard  from '../../components/GlassCard/GlassCard'
import './AuthPage.css'

export default function RegisterPage() {
  const navigate = useNavigate()

  return (
    <div className="auth-page organic-bg" dir="rtl">
      <div className="app-blob app-blob--top"    aria-hidden="true" />
      <div className="app-blob app-blob--bottom" aria-hidden="true" />

      <button className="auth-back" onClick={() => navigate('/')}>
        <span className="material-symbols-outlined">arrow_forward</span>
      </button>

      <div className="auth-content animate-fade-in-up">
        <div className="auth-brand">
          <span className="material-symbols-outlined auth-brand__icon">bubble_chart</span>
          <span className="text-headline-md auth-brand__name">Predicta</span>
        </div>

        <h1 className="text-headline-lg auth-title">צור חשבון</h1>
        <p className="text-body-md auth-sub">הצטרף לניהול תקציב חכם</p>

        <GlassCard variant="panel" className="auth-card">

          <div className="auth-name-row">
            <InputField label="שם פרטי" placeholder="נועה" icon="person" />
            <InputField label="שם משפחה" placeholder="כהן" icon="person" />
          </div>

          <InputField
            label="מספר טלפון"
            placeholder="05X-XXX-XXXX"
            icon="phone"
            type="tel"
          />

          <InputField
            label="כתובת אימייל"
            placeholder="noa@example.com"
            icon="mail"
            type="email"
          />

          <InputField
            label="סיסמה"
            placeholder="לפחות 8 תווים"
            icon="lock"
            type="password"
          />

          <div className="auth-info">
            <span className="material-symbols-outlined auth-info__icon">info</span>
            <p className="auth-info__text">
              לאחר ההרשמה, נשלח קוד אימות (OTP) למספר הטלפון שלך
            </p>
          </div>

          <Button variant="primary" full onClick={() => navigate('/dashboard')} icon="arrow_back">
            צור חשבון
          </Button>

          <div className="auth-divider">
            <span className="auth-divider__line" />
            <span className="text-label-light auth-divider__text">או</span>
            <span className="auth-divider__line" />
          </div>

          <Button variant="glass" full icon="google">
            הרשמה עם Google
          </Button>

          <div className="auth-links">
            <span className="text-label-light" style={{ color: 'var(--color-on-surface-variant)' }}>
              כבר יש לך חשבון?
            </span>
            <button className="auth-link text-label-bold" onClick={() => navigate('/login')}>
              כניסה
            </button>
          </div>

        </GlassCard>
      </div>
    </div>
  )
}
