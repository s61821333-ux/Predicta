import { useNavigate, useLocation } from 'react-router-dom'
import TopBar    from '../components/TopBar/TopBar'
import BottomNav from '../components/BottomNav/BottomNav'
import './AppShell.css'

export default function AppShell({ children, userName = 'נועה' }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <div className="app-shell organic-bg" dir="rtl">
      <div className="app-blob app-blob--top"    aria-hidden="true" />
      <div className="app-blob app-blob--bottom" aria-hidden="true" />

      <TopBar userName={userName} onNavigate={navigate} />

      <main className="app-main page-transition-wrapper">
        {children}
      </main>

      <BottomNav activePath={pathname} onNavigate={navigate} />
    </div>
  )
}
