import { useNavigate, useLocation } from 'react-router-dom'
import TopBar    from '../components/TopBar/TopBar'
import BottomNav from '../components/BottomNav/BottomNav'
import { supabase } from '../lib/supabase'
import { useUser } from '../context/UserContext'
import './AppShell.css'

export default function AppShell({ children }) {
  const { displayName, loading } = useUser()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className="app-shell organic-bg" dir="rtl">
      <div className="app-blob app-blob--top"    aria-hidden="true" />
      <div className="app-blob app-blob--bottom" aria-hidden="true" />

      <TopBar userName={loading ? '...' : displayName} onNavigate={navigate} onLogout={handleLogout} />

      <main className="app-main page-transition-wrapper">
        {children}
      </main>

      <BottomNav activePath={pathname} onNavigate={navigate} />
    </div>
  )
}
