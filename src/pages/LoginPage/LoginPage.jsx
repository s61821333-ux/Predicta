import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/AuthLayout/AuthLayout'
import Button from '../../components/Button/Button'
import InputField from '../../components/InputField/InputField'
import { signInUser } from '../../lib/auth'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: signInError, session } = await signInUser({ email, password })

    setLoading(false)

    if (signInError || !session) {
      setError('Invalid email or password')
      return
    }

    navigate('/dashboard')
  }

  return (
    <AuthLayout
      mode="login"
      title="כניסה לחשבון"
      subtitle="הזן אימייל וסיסמה כדי להתחבר"
    >
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

        <InputField
          label="סיסמה"
          placeholder="הזן את הסיסמה שלך"
          icon="lock"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        <button
          type="button"
          className="auth-form__forgot"
          onClick={() => navigate('/forgot-password')}
        >
          שכחתי סיסמה
        </button>

        {error && (
          <p className="auth-alert auth-alert--error" role="alert">{error}</p>
        )}

        <Button variant="primary" full type="submit" disabled={loading} icon="login">
          {loading ? 'מתחבר...' : 'כניסה'}
        </Button>
      </form>
    </AuthLayout>
  )
}
