export default function Avatar({ size = 44, firstName = '', lastName = '', avatarUrl }) {
  const initials = (firstName?.[0] || '') + (lastName?.[0] || '') || '?'
  if (avatarUrl) {
    return (
      <div style={{
        width: size, height: size, borderRadius: '50%', flexShrink: 0, overflow: 'hidden',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.45), 0 3px 10px rgba(45,111,240,0.35)',
      }}>
        <img src={avatarUrl} alt={initials} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    )
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      display: 'grid', placeItems: 'center', color: '#fff', overflow: 'hidden',
      fontWeight: 700, fontSize: size * 0.4, letterSpacing: '0.02em',
      background: 'linear-gradient(150deg, #6FA2FF, #2D6FF0 60%, #6A4DF0)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.45), 0 3px 10px rgba(45,111,240,0.35)',
    }}>
      {initials}
    </div>
  )
}
