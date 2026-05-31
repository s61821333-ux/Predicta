import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../../layouts/AppShell'
import GlassCard from '../../components/GlassCard/GlassCard'
import InputField from '../../components/InputField/InputField'
import Button from '../../components/Button/Button'
import Badge from '../../components/Badge/Badge'
import { useUser } from '../../context/UserContext'
import { updateUserProfile } from '../../lib/db'
import { uploadAvatar } from '../../lib/storage'
import { supabase } from '../../lib/supabase'
import './ProfilePage.css'

export default function ProfilePage() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const { profile, displayName, initials, planLabel, refresh, loading } = useUser()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name ?? '')
      setLastName(profile.last_name ?? '')
      setPhone(profile.phone ?? '')
      setEmail(profile.email ?? '')
      setAvatarUrl(profile.avatar_url ?? null)
    }
  }, [profile])

  function openAvatarPicker() {
    if (!uploadingAvatar) fileInputRef.current?.click()
  }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !profile?.id) return

    setMessage('')
    setUploadingAvatar(true)

    const { publicUrl, error: uploadError } = await uploadAvatar(profile.id, file)

    if (uploadError) {
      setUploadingAvatar(false)
      setMessage(uploadError.message)
      return
    }

    const { error: profileError } = await updateUserProfile(profile.id, {
      avatar_url: publicUrl,
    })

    setUploadingAvatar(false)

    if (profileError) {
      setMessage(profileError.message || 'שמירת התמונה בפרופיל נכשלה')
      return
    }

    setAvatarUrl(`${publicUrl}?t=${Date.now()}`)
    setMessage('תמונת הפרופיל עודכנה בהצלחה')
    refresh()
  }

  async function handleSave() {
    if (!profile?.id) return
    setSaving(true)
    setMessage('')

    const { error } = await updateUserProfile(profile.id, {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      phone: phone.trim() || null,
    })

    setSaving(false)
    if (error) {
      setMessage(error.message)
      return
    }
    setMessage('הפרטים נשמרו בהצלחה')
    refresh()
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/')
  }

  const showImage = Boolean(avatarUrl) && !uploadingAvatar

  return (
    <AppShell>
      <div className="page-header">
        <h1 className="text-headline-lg">פרופיל</h1>
        <p className="text-body-md page-subtitle">פרטים אישיים מהמסד נתונים</p>
      </div>

      <GlassCard className="profile-hero-card" variant="heavy">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="profile-avatar__input"
          aria-hidden="true"
          tabIndex={-1}
          onChange={handleAvatarChange}
        />

        <div className={`profile-avatar${uploadingAvatar ? ' profile-avatar--loading' : ''}`}>
          {showImage ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="profile-avatar__img"
            />
          ) : (
            <span className="text-display-xl profile-avatar__initials">
              {uploadingAvatar ? '' : loading ? '…' : initials}
            </span>
          )}
          {uploadingAvatar && (
            <div className="profile-avatar__loader" aria-label="מעלה תמונה">
              <span className="profile-avatar__spinner" />
            </div>
          )}
        </div>

        <div className="profile-hero__info">
          <h2 className="text-headline-md">{loading ? 'טוען...' : displayName}</h2>
          <p className="text-label-light" style={{ color: 'var(--color-on-surface-variant)' }}>
            {email || '—'}
          </p>
          <Badge color="primary">{planLabel}</Badge>
        </div>

        <button
          type="button"
          className="profile-avatar__edit glass-recessed"
          onClick={openAvatarPicker}
          disabled={uploadingAvatar || loading}
          aria-label="העלאת תמונת פרופיל"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            {uploadingAvatar ? 'hourglass_top' : 'photo_camera'}
          </span>
        </button>
      </GlassCard>

      <GlassCard className="profile-section-card">
        <h3 className="text-headline-md profile-section__title">פרטים אישיים</h3>

        <div className="profile-name-row">
          <InputField
            label="שם פרטי"
            icon="person"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <InputField
            label="שם משפחה"
            icon="person"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <InputField
          label="מספר טלפון"
          icon="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <InputField label="אימייל" icon="mail" type="email" value={email} disabled />

        {message && (
          <p
            className={`auth-alert ${
              message.includes('נכשל') ||
              message.includes('גדול') ||
              message.includes('לא נתמך') ||
              message.includes('error')
                ? 'auth-alert--error'
                : 'auth-alert--success'
            }`}
            role="alert"
          >
            {message}
          </p>
        )}

        <Button variant="primary" full icon="save" onClick={handleSave} disabled={saving || uploadingAvatar}>
          {saving ? 'שומר...' : 'שמור שינויים'}
        </Button>
      </GlassCard>

      <GlassCard className="profile-section-card">
        <div className="profile-partner__header">
          <h3 className="text-headline-md profile-section__title">תקציב משותף</h3>
          <Badge color="primary">פרימיום</Badge>
        </div>
        <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
          {profile?.partner_id
            ? 'מחובר לשותף/ה לתקציב משותף.'
            : 'עדיין לא הוספת שותף/ה לתקציב.'}
        </p>
      </GlassCard>

      <Button variant="glass" full icon="logout" onClick={handleLogout}>
        התנתק
      </Button>
    </AppShell>
  )
}
