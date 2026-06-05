import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { fetchUserProfile, fetchUserSettings } from '../lib/db'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [profile, setProfile] = useState(null)
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setProfile(null)
      setSettings(null)
      setLoading(false)
      return
    }

    const [{ data: profileData }, { data: settingsData }] = await Promise.all([
      fetchUserProfile(user.id),
      fetchUserSettings(user.id),
    ])

    // Merge Google OAuth metadata into profile when DB row is missing names
    const meta = user.user_metadata || {}
    const merged = profileData
      ? {
          ...profileData,
          first_name: profileData.first_name || meta.given_name || meta.full_name?.split(' ')[0] || '',
          last_name:  profileData.last_name  || meta.family_name || meta.full_name?.split(' ').slice(1).join(' ') || '',
          avatar_url: profileData.avatar_url || meta.avatar_url || meta.picture || null,
          email:      profileData.email      || user.email || '',
        }
      : null

    setProfile(merged)
    setSettings(settingsData)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      refresh()
    })
    return () => subscription.unsubscribe()
  }, [refresh])

  const value = useMemo(() => {
    const firstName = profile?.first_name?.trim() || ''
    const lastName = profile?.last_name?.trim() || ''
    const displayName = [firstName, lastName].filter(Boolean).join(' ') || profile?.email || 'משתמש'
    const initials = firstName ? firstName[0] : (profile?.email?.[0]?.toUpperCase() ?? '?')

    return {
      profile,
      settings,
      loading,
      refresh,
      displayName,
      initials,
      planLabel: profile?.plan_type === 'premium' ? 'פרימיום' : 'חשבון חינמי',
    }
  }, [profile, settings, loading, refresh])

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}
