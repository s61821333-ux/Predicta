import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/AuthLayout/AuthLayout'
import Button from '../../components/Button/Button'
import InputField from '../../components/InputField/InputField'
import { signUpUser } from '../../lib/auth'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password.length < 8) {
      setError('הסיסמה חייבת להכיל לפחות 8 תווים')
      return
    }

    if (password !== confirmPassword) {
      setError('הסיסמאות אינן תואמות')
      return
    }

    setLoading(true)

    const { error: signUpError, session } = await signUpUser({
      email,
      password,
      firstName,
      lastName,
      phone,
    })

    setLoading(false)

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    if (session) {
      navigate('/dashboard')
      return
    }

    setSuccess('החשבון נוצר! בדוק את תיבת האימייל לאישור ואז התחבר.')
  }

  return (
    <AuthLayout
      mode="register"
      title="יצירת חשבון"
      subtitle="הפרטים שלך נשמרים ב-Supabase Auth ובטבלת users"
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-form__row">
          <InputField
            label="שם פרטי"
            placeholder="נועה"
            icon="person"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            autoComplete="given-name"
          />
          <InputField
            label="שם משפחה"
            placeholder="כהן"
            icon="person"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            autoComplete="family-name"
          />
        </div>

        <InputField
          label="מספר טלפון"
          placeholder="05X-XXX-XXXX"
          icon="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
        />

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
          placeholder="לפחות 8 תווים"
          icon="lock"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
        />
        <p className="auth-form__hint">הסיסמה נשמרת ב-Supabase Auth (מוצפנת)</p>

        <InputField
          label="אימות סיסמה"
          placeholder="הזן שוב את הסיסמה"
          icon="lock_reset"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
        />

        {error && (
          <p className="auth-alert auth-alert--error" role="alert">{error}</p>
        )}

        {success && (
          <p className="auth-alert auth-alert--success" role="status">{success}</p>
        )}

        <Button variant="primary" full type="submit" disabled={loading} icon="person_add">
          {loading ? 'יוצר חשבון...' : 'צור חשבון'}
        </Button>
      </form>
    </AuthLayout>
  )
}
