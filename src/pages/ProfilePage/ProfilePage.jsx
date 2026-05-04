import { useNavigate } from 'react-router-dom'
import AppShell   from '../../layouts/AppShell'
import GlassCard  from '../../components/GlassCard/GlassCard'
import InputField from '../../components/InputField/InputField'
import Button     from '../../components/Button/Button'
import Badge      from '../../components/Badge/Badge'
import './ProfilePage.css'

export default function ProfilePage() {
  const navigate = useNavigate()

  return (
    <AppShell>
      <div className="page-header">
        <h1 className="text-headline-lg">פרופיל</h1>
        <p className="text-body-md page-subtitle">פרטים אישיים והגדרות חשבון</p>
      </div>

      {/* ── Avatar + plan ── */}
      <GlassCard className="profile-hero-card" variant="heavy">
        <div className="profile-avatar">
          <span className="text-display-xl profile-avatar__initials">נ</span>
        </div>
        <div className="profile-hero__info">
          <h2 className="text-headline-md">נועה כהן</h2>
          <p className="text-label-light" style={{ color: 'var(--color-on-surface-variant)' }}>noa.cohen@example.com</p>
          <Badge color="primary">חשבון חינמי</Badge>
        </div>
        <button className="profile-avatar__edit glass-recessed">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>photo_camera</span>
        </button>
      </GlassCard>

      {/* ── Personal details ── */}
      <GlassCard className="profile-section-card">
        <h3 className="text-headline-md profile-section__title">פרטים אישיים</h3>

        <div className="profile-name-row">
          <InputField label="שם פרטי"  defaultValue="נועה" icon="person" />
          <InputField label="שם משפחה" defaultValue="כהן"  icon="person" />
        </div>

        <InputField label="מספר טלפון" defaultValue="052-000-0000" icon="phone" type="tel" />
        <InputField label="אימייל"     defaultValue="noa.cohen@example.com" icon="mail" type="email" />

        <Button variant="primary" full icon="save">שמור שינויים</Button>
      </GlassCard>

      {/* ── Security ── */}
      <GlassCard className="profile-section-card">
        <h3 className="text-headline-md profile-section__title">אבטחה</h3>
        <InputField label="סיסמה נוכחית" placeholder="••••••••" icon="lock" type="password" />
        <InputField label="סיסמה חדשה"   placeholder="לפחות 8 תווים" icon="lock_reset" type="password" />
        <Button variant="glass" full icon="security">עדכן סיסמה</Button>
      </GlassCard>

      {/* ── Partner / shared budget ── */}
      <GlassCard className="profile-section-card">
        <div className="profile-partner__header">
          <h3 className="text-headline-md profile-section__title">תקציב משותף</h3>
          <Badge color="primary">פרימיום</Badge>
        </div>
        <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
          נהל תקציב משותף עם בן/בת הזוג. שניכם תוכלו לצפות ולהוסיף עסקאות.
        </p>

        <div className="profile-partner-placeholder glass-recessed">
          <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'var(--color-outline)', fontVariationSettings: "'FILL' 1" }}>group</span>
          <p className="text-label-light" style={{ color: 'var(--color-on-surface-variant)', textAlign: 'center' }}>
            עדיין לא הוספת שותף/ה לתקציב
          </p>
        </div>

        <InputField label="אימייל שותף/ה" placeholder="partner@example.com" icon="person_add" type="email" />
        <Button variant="glass" full icon="send">שלח הזמנה</Button>
      </GlassCard>

      {/* ── Upgrade ── */}
      <GlassCard className="profile-upgrade-card" variant="heavy">
        <div className="profile-upgrade__content">
          <span className="material-symbols-outlined" style={{ fontSize: 36, color: 'var(--color-primary-container)', fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
          <div>
            <h3 className="text-headline-md">שדרג לפרימיום</h3>
            <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)', marginTop: 4 }}>
              AI מלא · תקציב משותף · תחזית 12 חודשים
            </p>
          </div>
        </div>
        <Button variant="primary" full icon="arrow_back">שדרג עכשיו — ₪29/חודש</Button>
      </GlassCard>

      {/* ── Logout ── */}
      <Button variant="glass" full icon="logout" onClick={() => navigate('/')}>
        התנתק
      </Button>
    </AppShell>
  )
}
