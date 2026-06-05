import { useNavigate } from 'react-router-dom'
import { Logo } from '../../components/Logo/Logo'
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle'
import Icon from '../../components/Icon/Icon'

const FEATURES = [
  { icon: 'wallet',   title: 'יתרה בזמן אמת',      desc: 'עקוב אחר ההוצאות וההכנסות שלך בקלות' },
  { icon: 'trend',    title: 'דוחות חכמים',          desc: 'ניתוח מעמיק של דפוסי ההוצאות שלך' },
  { icon: 'spark',    title: 'יועץ AI אישי',         desc: 'פְּרֶדִי — הבינה המלאכותית הפיננסית שלך' },
  { icon: 'bell',     title: 'התראות תקציב',         desc: 'קבל התראות לפני שחורגים מהתקציב' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div className="amb"><b/><b/><b/></div>

      <header style={{ position: 'sticky', top: 0, zIndex: 30, padding: '14px 20px' }}>
        <div className="glass glass-strong" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderRadius: 20, maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Logo size={36} />
            <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em' }}>Predicta</span>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <ThemeToggle />
            <button className="btn btn-ghost tap" onClick={() => navigate('/login')} style={{ height: 40, padding: '0 18px', fontSize: 14 }}>כניסה</button>
            <button className="btn btn-primary tap" onClick={() => navigate('/register')} style={{ height: 40, padding: '0 18px', fontSize: 14 }}>הרשמה חינם</button>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px 80px', position: 'relative', zIndex: 1 }}>
        <div className="enter" style={{ textAlign: 'center', maxWidth: 640, marginBottom: 56 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 999, background: 'var(--glass-2)', border: '1px solid var(--glass-line)', fontSize: 13.5, fontWeight: 700, color: 'var(--blue)', marginBottom: 22 }}>
            <Icon name="spark" size={15} /> הכסף שלך, בבהירות
          </div>
          <h1 style={{ margin: '0 0 20px', fontSize: 'clamp(38px, 7vw, 62px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em' }}>
            נהל את הכסף שלך<br />
            <span style={{ background: 'linear-gradient(135deg, var(--blue-300), var(--blue))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              בחכמה ובפשטות
            </span>
          </h1>
          <p style={{ fontSize: 18, color: 'var(--ink-2)', lineHeight: 1.6, marginBottom: 36 }}>
            אפליקציית ניהול הכספים שמחברת בין הוצאות, תקציבים, ויועץ AI אישי — הכל במקום אחד.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary tap" onClick={() => navigate('/register')} style={{ height: 54, fontSize: 17, padding: '0 28px' }}>
              <Icon name="arrowDown" size={20} sw={2.4} /> התחל בחינם
            </button>
            <button className="btn btn-ghost tap" onClick={() => navigate('/login')} style={{ height: 54, fontSize: 16, padding: '0 22px' }}>
              כניסה לחשבון קיים
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16, width: '100%', maxWidth: 940 }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="glass enter" style={{ borderRadius: 24, padding: 22, animationDelay: `${i * 0.08}s` }}>
              <div style={{ width: 46, height: 46, borderRadius: 14, display: 'grid', placeItems: 'center', marginBottom: 14, color: '#fff', background: 'linear-gradient(150deg, var(--blue-300), var(--blue))', boxShadow: '0 6px 16px var(--blue-glow)' }}>
                <Icon name={f.icon} size={22} sw={2.1} />
              </div>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>{f.title}</div>
              <div style={{ color: 'var(--ink-2)', fontSize: 14, lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
