import AppShell  from '../../layouts/AppShell'
import GlassCard from '../../components/GlassCard/GlassCard'
import StatWidget from '../../components/StatWidget/StatWidget'
import Badge      from '../../components/Badge/Badge'
import Button     from '../../components/Button/Button'
import './AdminPage.css'

const USERS = [
  { id: 1, name: 'נועה כהן',     email: 'noa@example.com',    plan: 'חינמי',  status: 'פעיל',  joined: '01/01/2025', txns: 124 },
  { id: 2, name: 'דניאל לוי',    email: 'daniel@example.com', plan: 'פרימיום',status: 'פעיל',  joined: '15/02/2025', txns: 87  },
  { id: 3, name: 'מיכל אברהם',   email: 'michal@example.com', plan: 'פרימיום',status: 'פעיל',  joined: '03/03/2025', txns: 256 },
  { id: 4, name: 'אורן שפירא',   email: 'oren@example.com',   plan: 'חינמי',  status: 'חסום',  joined: '20/03/2025', txns: 12  },
  { id: 5, name: 'רחל גרין',     email: 'rachel@example.com', plan: 'חינמי',  status: 'פעיל',  joined: '01/04/2025', txns: 45  },
]

const LOGS = [
  { time: '08:42', event: 'משתמש חדש נרשם — daniel@example.com',        level: 'info'  },
  { time: '09:15', event: 'שגיאת Gemini API — rate limit',               level: 'warn'  },
  { time: '10:01', event: 'גיבוי מסד נתונים הושלם בהצלחה',              level: 'info'  },
  { time: '11:33', event: 'ניסיון כניסה נכשל — oren@example.com (×3)',   level: 'error' },
  { time: '12:05', event: '147 עסקאות קוטלגו ע"י AI אוטומטית',          level: 'info'  },
]

export default function AdminPage() {
  return (
    <AppShell>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1 className="text-headline-lg">פאנל ניהול</h1>
          <Badge color="primary">Admin</Badge>
        </div>
        <p className="text-body-md page-subtitle">ניהול מערכת ומשתמשים</p>
      </div>

      {/* ── System stats ── */}
      <div className="admin-stats">
        <StatWidget label="משתמשים"    value="30,421"  accent={false} />
        <StatWidget label="פרימיום"    value="2,140"   accent={true}  />
        <StatWidget label="עסקאות"     value="412K"    accent={false} />
        <StatWidget label="AI שאילתות" value="89,200"  accent={true}  />
      </div>

      {/* ── API status ── */}
      <GlassCard className="admin-api-card">
        <h3 className="text-headline-md admin-section-title">סטטוס שירותים</h3>
        {[
          { name: 'Supabase DB',     status: 'תקין',    ok: true  },
          { name: 'Gemini API',      status: 'אזהרה',   ok: false },
          { name: 'SendGrid Email',  status: 'תקין',    ok: true  },
          { name: 'Supabase Storage',status: 'תקין',    ok: true  },
        ].map(({ name, status, ok }) => (
          <div key={name} className="admin-service-row">
            <div className={`admin-service__dot ${ok ? 'admin-service__dot--ok' : 'admin-service__dot--warn'}`} />
            <span className="text-label-bold">{name}</span>
            <span className={`text-label-light admin-service__status ${ok ? '' : 'admin-service__status--warn'}`}>
              {status}
            </span>
          </div>
        ))}
      </GlassCard>

      {/* ── Users table ── */}
      <GlassCard className="admin-users-card">
        <div className="admin-users__header">
          <h3 className="text-headline-md admin-section-title">משתמשים</h3>
          <div className="admin-users__actions">
            <Button variant="glass" icon="filter_list">סינון</Button>
            <Button variant="glass" icon="download">ייצוא</Button>
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="text-label-bold">שם</th>
                <th className="text-label-bold">תוכנית</th>
                <th className="text-label-bold">עסקאות</th>
                <th className="text-label-bold">סטטוס</th>
                <th className="text-label-bold">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {USERS.map(u => (
                <tr key={u.id} className="admin-table__row">
                  <td>
                    <div className="admin-user-cell">
                      <div className="admin-user__avatar">
                        <span className="text-label-bold">{u.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-label-bold">{u.name}</p>
                        <p className="text-label-light">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge color={u.plan === 'פרימיום' ? 'primary' : undefined}>
                      {u.plan}
                    </Badge>
                  </td>
                  <td className="text-label-bold" dir="ltr">{u.txns}</td>
                  <td>
                    <span className={`admin-status-badge ${u.status === 'פעיל' ? 'admin-status-badge--ok' : 'admin-status-badge--blocked'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <button className="admin-action-btn" title="עריכה">
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
                      </button>
                      <button className="admin-action-btn admin-action-btn--danger" title="חסימה">
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>block</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* ── System logs ── */}
      <GlassCard className="admin-logs-card">
        <h3 className="text-headline-md admin-section-title">לוג מערכת</h3>
        {LOGS.map(({ time, event, level }) => (
          <div key={time + event} className={`admin-log-row admin-log-row--${level}`}>
            <span className="text-label-light admin-log__time" dir="ltr">{time}</span>
            <span className={`admin-log__dot admin-log__dot--${level}`} />
            <span className="text-label-bold admin-log__event">{event}</span>
          </div>
        ))}
        <Button variant="glass" full icon="refresh">רענן לוג</Button>
      </GlassCard>

      {/* ── Global settings ── */}
      <GlassCard className="admin-global-card">
        <h3 className="text-headline-md admin-section-title">הגדרות גלובליות</h3>
        <Button variant="glass" full icon="rate_review">הגדרות Gemini API</Button>
        <Button variant="glass" full icon="mail">הגדרות SendGrid</Button>
        <Button variant="glass" full icon="shield">הגדרות RLS / אבטחה</Button>
        <Button variant="glass" full icon="notifications">הגדרות שליחת אימייל</Button>
      </GlassCard>
    </AppShell>
  )
}
