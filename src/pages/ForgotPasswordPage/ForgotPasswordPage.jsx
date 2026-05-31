import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/AuthLayout/AuthLayout'
import Button from '../../components/Button/Button'
import InputField from '../../components/InputField/InputField'
import { supabase } from '../../lib/supabase'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    })

    setLoading(false)

    if (resetError) {
      setError(resetError.message)
      return
    }

    setSuccess('נשלח קישור לאיפוס סיסמה לאימייל שלך.')
  }

  return (
    <AuthLayout
      mode="login"
      title="שחזור סיסמה"
      subtitle="נשלח לך קישור לאיפוס דרך Supabase Auth"
      footer={
        <button type="button" className="auth-form__forgot" onClick={() => navigate('/login')}>
          חזרה לכניסה
        </button>
      }
    >
      {success ? (
        <p className="auth-alert auth-alert--success" role="status">{success}</p>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <InputField
            label="כתובת אימייל"
            placeholder="you@example.com"
            icon="mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          {error && (
            <p className="auth-alert auth-alert--error" role="alert">{error}</p>
          )}

          <Button variant="primary" full type="submit" disabled={loading} icon="send">
            {loading ? 'שולח...' : 'שלח קישור לאיפוס'}
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}
