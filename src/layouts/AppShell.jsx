import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useUser } from '../context/UserContext'
import { useTheme } from '../context/ThemeContext'
import { useAppState } from '../context/AppStateContext'
import { Logo, LogoLockup, AiOrb } from '../components/Logo/Logo'
import Avatar from '../components/Avatar/Avatar'
import ThemeToggle from '../components/ThemeToggle/ThemeToggle'
import Icon from '../components/Icon/Icon'
import Toast from '../components/Toast/Toast'

function useWide() {
  const [wide, setWide] = useState(window.innerWidth >= 900)
  useEffect(() => {
    const on = () => setWide(window.innerWidth >= 900)
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return wide
}

const BOTTOM_NAV = [
  { path: '/dashboard',       icon: 'home',    label: 'בית' },
  { path: '/search',          icon: 'search',  label: 'חיפוש' },
  { path: '/new-transaction', icon: 'add',     label: 'הוסף', fab: true },
  { path: '/ai-chat',         icon: 'spark',   label: 'מוח',  ai: true },
  { path: '/profile',         icon: 'profile', label: 'פרופיל' },
]

const SIDE_NAV = [
  { path: '/dashboard',       icon: 'home',    label: 'סקירה' },
  { path: '/new-transaction', icon: 'add',     label: 'עסקה חדשה' },
  { path: '/reports',         icon: 'trend',   label: 'דוחות' },
  { path: '/ai-chat',         icon: 'spark',   label: 'יועץ AI', ai: true },
  { path: '/search',          icon: 'search',  label: 'חיפוש' },
  { path: '/profile',         icon: 'profile', label: 'פרופיל' },
  { path: '/settings',        icon: 'gear',    label: 'הגדרות' },
]

function MobileStatusBar() {
  const now = new Date()
  const h = String(now.getHours()).padStart(2, '0')
  const m = String(now.getMinutes()).padStart(2, '0')
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 26px 4px', fontWeight: 700, fontSize: 15, color: 'var(--ink)', flexShrink: 0 }}>
      <span className="tnum">{h}:{m}</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="7" width="3" height="5" rx="0.7"/><rect x="5" y="4.5" width="3" height="7.5" rx="0.7"/><rect x="10" y="2" width="3" height="10" rx="0.7"/><rect x="15" y="0" width="3" height="12" rx="0.7" opacity="0.4"/></svg>
        <svg width="26" height="12" viewBox="0 0 26 12" fill="currentColor"><rect x="0.5" y="0.5" width="22" height="11" rx="3" fill="none" stroke="currentColor" strokeOpacity="0.4"/><rect x="2" y="2" width="17" height="8" rx="1.6"/><rect x="24" y="4" width="1.6" height="4" rx="0.8" opacity="0.4"/></svg>
      </span>
    </div>
  )
}

function MobileTopBar({ navigate }) {
  const { profile } = useUser()
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 30, padding: '10px 16px 10px' }}>
      <div className="glass glass-strong" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px 9px 14px', borderRadius: 22 }}>
        <button className="tap" onClick={() => navigate('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <Logo size={34} />
          <span style={{ fontWeight: 800, fontSize: 19, letterSpacing: '-0.02em' }}>Predicta</span>
        </button>
        <div style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
          <ThemeToggle />
          <button className="tap" onClick={() => navigate('/settings')} aria-label="הגדרות"
            style={{ width: 42, height: 42, borderRadius: '50%', display: 'grid', placeItems: 'center', background: 'var(--glass-2)', border: '1px solid var(--glass-line)', color: 'var(--ink)', boxShadow: 'var(--shadow)', backdropFilter: 'blur(20px)' }}>
            <Icon name="gear" size={20} />
          </button>
          <button className="tap" onClick={() => navigate('/profile')} aria-label="פרופיל">
            <Avatar size={42} firstName={profile?.first_name} lastName={profile?.last_name} avatarUrl={profile?.avatar_url} />
          </button>
        </div>
      </div>
    </header>
  )
}

function MobileBottomNav({ location, navigate }) {
  return (
    <nav style={{ position: 'sticky', bottom: 0, zIndex: 40, padding: '8px 14px calc(env(safe-area-inset-bottom,0px) + 12px)', pointerEvents: 'none' }}>
      <div className="glass glass-strong" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '8px 8px', borderRadius: 26, pointerEvents: 'auto', height: 68 }}>
        {BOTTOM_NAV.map(item => {
          if (item.fab) return (
            <button key={item.path} className="tap" onClick={() => navigate(item.path)} aria-label={item.label}
              style={{ width: 60, height: 60, borderRadius: 20, marginTop: -26, color: '#fff', display: 'grid', placeItems: 'center', background: 'linear-gradient(180deg, var(--blue-300), var(--blue))', boxShadow: '0 1px 0 rgba(255,255,255,0.5) inset, 0 10px 24px var(--blue-glow)' }}>
              <Icon name="add" size={28} sw={2.4} />
            </button>
          )
          const on = location.pathname === item.path
          return (
            <button key={item.path} className="tap" onClick={() => navigate(item.path)} aria-label={item.label}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, width: 56, color: on ? 'var(--blue)' : 'var(--ink-3)' }}>
              {item.ai && on ? <AiOrb size={24} /> : <Icon name={item.icon} size={24} sw={on ? 2.3 : 1.9} />}
              <span style={{ fontSize: 11, fontWeight: on ? 700 : 600 }}>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

function DesktopSideNav({ location, navigate }) {
  const { profile } = useUser()
  return (
    <aside style={{ width: 252, flexShrink: 0, padding: '20px 14px 20px 0', height: '100%', position: 'sticky', top: 0 }}>
      <div className="glass" style={{ height: '100%', borderRadius: 28, padding: 16, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '8px 8px 18px' }}><LogoLockup size={34} /></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {SIDE_NAV.map(item => {
            const on = location.pathname === item.path
            return (
              <button key={item.path} className="tap" onClick={() => navigate(item.path)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 15, fontWeight: on ? 700 : 600, fontSize: 15.5, textAlign: 'start', color: on ? '#fff' : 'var(--ink-2)', background: on ? 'linear-gradient(180deg, var(--blue-300), var(--blue))' : 'transparent', boxShadow: on ? '0 8px 20px var(--blue-glow)' : 'none' }}>
                {item.ai ? <AiOrb size={24} /> : <Icon name={item.icon} size={22} sw={on ? 2.2 : 1.9} />}
                {item.label}
              </button>
            )
          })}
        </div>
        <div className="glass-2" style={{ borderRadius: 18, padding: 10, display: 'flex', alignItems: 'center', gap: 10, border: '1px solid var(--hairline)' }}>
          <button className="tap" onClick={() => navigate('/profile')} style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
            <Avatar size={40} firstName={profile?.first_name} lastName={profile?.last_name} avatarUrl={profile?.avatar_url} />
            <div style={{ textAlign: 'start', lineHeight: 1.2 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{profile?.first_name} {profile?.last_name}</div>
              <div style={{ fontSize: 12, color: 'var(--blue)' }}>{profile?.plan_type === 'premium' ? 'פרימיום' : 'חינמי'}</div>
            </div>
          </button>
          <ThemeToggle size={38} />
        </div>
      </div>
    </aside>
  )
}

export default function AppShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const wide = useWide()
  const { toast } = useAppState()
  const isChat = location.pathname === '/ai-chat'

  return (
    <>
      <div className="amb"><b/><b/><b/></div>
      {wide ? (
        <div style={{ display: 'flex', flexDirection: 'row', height: '100vh', position: 'relative', zIndex: 1 }}>
          <DesktopSideNav location={location} navigate={navigate} />
          <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '26px 28px 40px', height: '100vh' }}>
            <div style={{ maxWidth: isChat ? 760 : 1080, margin: '0 auto', height: isChat ? 'calc(100vh - 66px)' : 'auto' }}>
              <Outlet />
            </div>
          </main>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative', zIndex: 1, overflow: 'hidden' }}>
          <MobileStatusBar />
          <MobileTopBar navigate={navigate} />
          <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: isChat ? '6px 16px 6px' : '8px 16px 16px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: isChat ? 1 : 'none', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <Outlet />
            </div>
          </main>
          <MobileBottomNav location={location} navigate={navigate} />
        </div>
      )}
      <Toast msg={toast} show={!!toast} />
    </>
  )
}
