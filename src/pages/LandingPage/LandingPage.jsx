import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button/Button'
import GlassCard from '../../components/GlassCard/GlassCard'
import Badge from '../../components/Badge/Badge'
import './LandingPage.css'

const FEATURES = [
  {
    icon: 'timeline',
    title: 'תחזית 6 חודשים',
    desc: 'ראה את תזרים המזומנים שלך קדימה ואחורה בתרשים אחד',
  },
  {
    icon: 'psychology',
    title: 'ניתוח AI חכם',
    desc: 'הבינה המלאכותית מנתחת את ההוצאות שלך ומציעה המלצות חיסכון',
  },
  {
    icon: 'group',
    title: 'תקציב משותף',
    desc: 'נהל תקציב משותף עם בן/בת הזוג ללא חשבון בנק משותף',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="landing organic-bg" dir="rtl">
      <div className="app-blob app-blob--top"    aria-hidden="true" />
      <div className="app-blob app-blob--bottom" aria-hidden="true" />

      {/* ── Header ── */}
      <header className="landing__header glass-panel">
        <div className="landing__brand">
          <span className="material-symbols-outlined landing__logo-icon">bubble_chart</span>
          <span className="text-headline-md landing__logo-name">Predicta</span>
        </div>
        <Button variant="glass" onClick={() => navigate('/login')}>כניסה</Button>
      </header>

      {/* ── Hero ── */}
      <section className="landing__hero animate-fade-in-up">
        <Badge color="primary">חדש · AI פיננסי</Badge>

        <h1 className="text-display-xl landing__hero-title">
          ניהול תקציב<br />
          <span className="landing__hero-accent">חכם ומדויק</span>
        </h1>

        <p className="text-body-lg landing__hero-sub">
          תיעוד עסקאות פיננסיות מהיר עם בינה מלאכותית מובנית —
          תחזית תזרים בזמן אמת, קטגוריזציה אוטומטית וניתוח חכם.
        </p>

        <div className="landing__cta-row">
          <Button variant="primary" onClick={() => navigate('/register')} icon="arrow_back">
            התחל בחינם
          </Button>
          <Button variant="glass" onClick={() => navigate('/login')}>
            כבר יש לי חשבון
          </Button>
        </div>

        {/* Mock dashboard preview card */}
        <GlassCard className="landing__preview" variant="panel">
          <div className="landing__preview-header">
            <span className="text-label-bold" style={{ color: 'var(--color-on-surface-variant)' }}>יתרה כוללת</span>
            <Badge color="primary">+4.2%</Badge>
          </div>
          <p className="text-display-xl landing__preview-amount" dir="ltr">₪ 124,500</p>
          <div className="landing__preview-bars">
            {[60, 40, 80, 50, 70, 55, 90].map((h, i) => (
              <div key={i} className="landing__preview-bar" style={{ height: `${h}%`, opacity: i === 6 ? 1 : 0.4 + i * 0.08 }} />
            ))}
          </div>
        </GlassCard>
      </section>

      {/* ── Features ── */}
      <section className="landing__features animate-fade-in-up delay-200">
        <h2 className="text-headline-md landing__section-title">למה Predicta?</h2>
        <div className="landing__feature-grid">
          {FEATURES.map(({ icon, title, desc }, idx) => (
            <GlassCard key={title} className={`landing__feature-card animate-scale-in delay-${(idx + 1) * 100}`}>
              <span className="material-symbols-outlined landing__feature-icon"
                style={{ fontVariationSettings: "'FILL' 1", color: 'var(--color-primary-container)', fontSize: 32 }}>
                {icon}
              </span>
              <h3 className="text-label-bold landing__feature-title">{title}</h3>
              <p className="text-body-md landing__feature-desc">{desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="landing__footer-cta">
        <GlassCard variant="heavy" className="landing__footer-card">
          <h2 className="text-headline-lg">מוכן להשתלט על התקציב?</h2>
          <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)', marginTop: 8 }}>
            הצטרף לאלפי משתמשים שכבר מנהלים את הכסף שלהם בצורה חכמה יותר
          </p>
          <Button variant="primary" full onClick={() => navigate('/register')} icon="arrow_back"
            style={{ marginTop: 24 }}>
            הרשמה חינמית
          </Button>
        </GlassCard>
      </section>
    </div>
  )
}
