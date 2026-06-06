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

  const { error: passkeyError } = await supabase.auth.registerPasskey()
  if (passkeyError) return { error: passkeyError, session: data.session }

  return { error: null, session: data.session }
}

export async function signInWithPasskey() {
  const { data, error } = await supabase.auth.signInWithPasskey()
  if (error) return { error, session: null }
  return { data, session: data?.session, error: null }
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
