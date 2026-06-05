import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import { useAppState } from '../../context/AppStateContext'
import { updateUserProfile } from '../../lib/db'
import { supabase } from '../../lib/supabase'
import { Confirm } from '../../components/Modal/Modal'
import Avatar from '../../components/Avatar/Avatar'
import SectionHead from '../../components/SectionHead/SectionHead'
import Icon from '../../components/Icon/Icon'

export default function ProfilePage() {
  const { profile, refresh } = useUser()
  const { showToast } = useAppState()
  const navigate = useNavigate()
  const [f, setF] = useState({ first: profile?.first_name || '', last: profile?.last_name || '', phone: profile?.phone || '' })
  const [signOutConfirm, setSignOutConfirm] = useState(false)
  const [saving, setSaving] = useState(false)

  const dirty = f.first !== (profile?.first_name || '') || f.last !== (profile?.last_name || '') || f.phone !== (profile?.phone || '')

  const save = async () => {
    setSaving(true)
    await updateUserProfile(profile.id, { first_name: f.first, last_name: f.last, phone: f.phone })
    await refresh()
    showToast('השינויים נשמרו')
    setSaving(false)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const Field = ({ label, value, onChange, readOnly }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-2)', paddingInlineStart: 4 }}>{label}</label>
      {readOnly ? (
        <div className="field" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ink-2)', opacity: 0.85 }}>
          {value}<span style={{ marginInlineStart: 'auto', color: 'var(--ink-3)' }}><Icon name="lock" size={16}/></span>
        </div>
      ) : (
        <input className="field" value={value} onChange={e => onChange(e.target.value)} />
      )}
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 90 }}>
      <h1 style={{ margin: '2px 4px', fontSize: 26, fontWeight: 800 }}>הפרופיל שלי</h1>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ position: 'relative' }}>
          <Avatar size={104} firstName={profile?.first_name} lastName={profile?.last_name} avatarUrl={profile?.avatar_url} />
          <button className="tap" aria-label="שנה תמונה"
            style={{ position: 'absolute', bottom: -2, insetInlineStart: -2, width: 36, height: 36, borderRadius: '50%', display: 'grid', placeItems: 'center', color: '#fff', background: 'linear-gradient(180deg, var(--blue-300), var(--blue))', border: '3px solid var(--bg)', boxShadow: '0 4px 12px var(--blue-glow)' }}>
            <Icon name="camera" size={18} />
          </button>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 800, fontSize: 20 }}>{profile?.first_name} {profile?.last_name}</div>
          {profile?.plan_type === 'premium' && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 5, padding: '4px 12px', borderRadius: 999, fontSize: 13, fontWeight: 700, color: '#fff', background: 'linear-gradient(180deg, #FFD479, #F5A623)', boxShadow: '0 4px 12px rgba(245,166,35,0.3)' }}>
              <Icon name="star" size={14} /> פרימיום
            </span>
          )}
        </div>
      </div>

      <div className="glass" style={{ borderRadius: 24, padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <SectionHead title="פרטים אישיים" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="שם פרטי"    value={f.first} onChange={v => setF({ ...f, first: v })} />
          <Field label="שם משפחה"   value={f.last}  onChange={v => setF({ ...f, last: v })} />
        </div>
        <Field label="טלפון" value={f.phone} onChange={v => setF({ ...f, phone: v })} />
        <Field label="אימייל" value={profile?.email || ''} readOnly />
      </div>

      <button className="btn btn-primary" disabled={!dirty || saving} onClick={save}
        style={{ height: 54, width: '100%', opacity: dirty && !saving ? 1 : 0.45, pointerEvents: dirty && !saving ? 'auto' : 'none' }}>
        {saving ? 'שומר…' : 'שמור שינויים'}
      </button>

      <button className="btn btn-ghost" onClick={() => setSignOutConfirm(true)}
        style={{ height: 48, width: '100%', color: 'var(--neg)' }}>
        <Icon name="logout" size={18} /> התנתקות
      </button>

      <Confirm open={signOutConfirm} title="התנתקות" danger confirmLabel="התנתק"
        body="האם אתה בטוח שברצונך להתנתק?"
        onConfirm={signOut} onClose={() => setSignOutConfirm(false)} />
    </div>
  )
}
