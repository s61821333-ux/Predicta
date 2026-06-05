import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

import LandingPage        from './pages/LandingPage/LandingPage'
import LoginPage          from './pages/LoginPage/LoginPage'
import RegisterPage       from './pages/RegisterPage/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage/ForgotPasswordPage'

import DashboardPage      from './pages/DashboardPage/DashboardPage'
import NewTransactionPage from './pages/NewTransactionPage/NewTransactionPage'
import ReportsPage        from './pages/ReportsPage/ReportsPage'
import AIChatPage         from './pages/AIChatPage/AIChatPage'
import SearchPage         from './pages/SearchPage/SearchPage'
import ProfilePage        from './pages/ProfilePage/ProfilePage'
import SettingsPage       from './pages/SettingsPage/SettingsPage'
import AdminPage          from './pages/AdminPage/AdminPage'

import ProtectedRoute      from './components/ProtectedRoute/ProtectedRoute'
import AuthenticatedLayout from './layouts/AuthenticatedLayout'
import AppShell            from './layouts/AppShell'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                element={<LandingPage />} />
        <Route path="/login"           element={<LoginPage />} />
        <Route path="/register"        element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route element={<ProtectedRoute><AuthenticatedLayout /></ProtectedRoute>}>
          <Route element={<AppShell />}>
            <Route path="/dashboard"       element={<DashboardPage />} />
            <Route path="/new-transaction" element={<NewTransactionPage />} />
            <Route path="/reports"         element={<ReportsPage />} />
            <Route path="/ai-chat"         element={<AIChatPage />} />
            <Route path="/search"          element={<SearchPage />} />
            <Route path="/profile"         element={<ProfilePage />} />
            <Route path="/settings"        element={<SettingsPage />} />
            <Route path="/admin"           element={<AdminPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
