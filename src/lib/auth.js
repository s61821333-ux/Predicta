import { supabase } from './supabase'

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  })
  return { error }
}

export async function sendRegistrationOtp({ email, firstName, lastName }) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      data: { first_name: firstName.trim(), last_name: lastName.trim() },
      shouldCreateUser: true,
    },
  })
  if (error) {
    const msg = error.message ?? ''
    if (msg.toLowerCase().includes('otp_disabled') || msg.toLowerCase().includes('signups not allowed')) {
      error.message = 'שליחת קודים באימייל אינה מופעלת בפרויקט Supabase. יש להפעיל Email Provider תחת Authentication → Providers.'
    }
  }
  return { error }
}

export async function verifyOtpAndRegisterPasskey({ email, token, firstName, lastName }) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  })
  if (error) return { error, session: null }

  if (data.user) {
    await supabase.from('users').upsert({
      id: data.user.id,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email,
    })
    await supabase.from('user_settings').upsert({ user_id: data.user.id })
  }

  const { error: passkeyError } = await registerPasskey()
  if (passkeyError) return { error: passkeyError, session: data.session }

  return { error: null, session: data.session }
}

export async function signInWithPasskey() {
  const { data, error } = await supabase.auth.signInWithPasskey()
  if (error) {
    const msg = error.message ?? ''
    if (msg.includes('RP ID') || msg.includes('rpId') || msg.includes('invalid for this domain')) {
      error.message = 'מפתח הגישה מוגדר לדומיין הייצור בלבד. כנס דרך הכתובת הרשמית של האפליקציה.'
    }
    return { error, session: null }
  }
  return { data, session: data?.session, error: null }
}

export async function registerPasskey() {
  const { error } = await supabase.auth.registerPasskey()
  if (error) {
    const msg = error.message ?? ''
    if (msg.includes('RP ID') || msg.includes('rpId') || msg.includes('invalid for this domain')) {
      error.message = 'מפתח הגישה מוגדר לדומיין הייצור בלבד. כנס דרך הכתובת הרשמית של האפליקציה.'
    }
    return { error }
  }
  return { error: null }
}

export async function getCurrentUserProfile() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { profile: null, error: null }

  const { data, error } = await supabase
    .from('users')
    .select('id, first_name, last_name, email, phone, plan_type, avatar_url')
    .eq('id', user.id)
    .single()

  return { profile: data, error }
}
