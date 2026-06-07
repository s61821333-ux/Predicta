import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { registerPasskey } from '../../lib/auth'

export default function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // User arrived via magic link — try to register a passkey for them
        const { error } = await registerPasskey()
        if (error) {
          // Passkey creation failed or was dismissed — still go to dashboard
          navigate('/dashboard', { replace: true })
        } else {
          navigate('/dashboard', { replace: true })
        }
      } else if (!session) {
        navigate('/login', { replace: true })
      }
    })
  }, [navigate])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--ink-2)', fontSize: 16 }}>מאמת…</p>
    </div>
  )
}
