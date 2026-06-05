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

export async function signUpUser({ email, password, firstName, lastName, phone }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone?.trim() || null,
      },
    },
  })

  if (error) return { error, session: null }

  if (data.user && data.session) {
    const { error: profileError } = await supabase.from('users').upsert({
      id: data.user.id,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email,
      phone: phone?.trim() || null,
    })

    if (profileError) return { error: profileError, session: data.session }

    await supabase.from('user_settings').upsert({ user_id: data.user.id })
  }

  return { data, session: data.session, error: null }
}

export async function signInUser({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error, session: null }

  return { data, session: data.session, error: null }
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
