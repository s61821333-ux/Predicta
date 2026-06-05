export function Logo({ size = 40, radius, glow = true }) {
  const r = radius ?? size * 0.28
  return (
    <div style={{
      width: size, height: size, borderRadius: r, position: 'relative',
      background: 'linear-gradient(150deg, #6FA2FF 0%, #2D6FF0 52%, #1A49AE 100%)',
      boxShadow: glow
        ? '0 6px 18px rgba(45,111,240,0.45), inset 0 1px 0 rgba(255,255,255,0.5)'
        : 'inset 0 1px 0 rgba(255,255,255,0.5)',
      display: 'grid', placeItems: 'center', overflow: 'hidden', flexShrink: 0,
    }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.45), rgba(255,255,255,0) 46%)' }} />
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 32 32" fill="none" style={{ position: 'relative' }}>
        <path d="M9 26V6h9.5a6.5 6.5 0 0 1 0 13H9" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="22.5" cy="9.5" r="2.6" fill="#fff"/>
      </svg>
    </div>
  )
}

export function LogoLockup({ size = 38 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
      <Logo size={size} />
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, gap: 3 }}>
        <span style={{ fontWeight: 800, fontSize: size * 0.5, letterSpacing: '-0.02em', color: 'var(--ink)' }}>Predicta</span>
        <span style={{ fontSize: size * 0.27, color: 'var(--ink-2)', fontWeight: 600 }}>הכסף שלך, בבהירות</span>
      </div>
    </div>
  )
}

export function AiOrb({ size = 40, thinking = false }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', position: 'relative',
      background: 'radial-gradient(120% 120% at 30% 25%, #8FD2FF 0%, #4D8BFF 38%, #2D6FF0 66%, #6A4DF0 100%)',
      boxShadow: '0 4px 16px rgba(45,111,240,0.5), inset 0 1.5px 2px rgba(255,255,255,0.6), inset 0 -3px 6px rgba(26,73,174,0.5)',
      overflow: 'hidden', flexShrink: 0,
      animation: thinking ? 'orbPulse 1.4s ease-in-out infinite' : 'none',
    }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(60% 50% at 32% 22%, rgba(255,255,255,0.85), rgba(255,255,255,0) 60%)' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
        <svg width={size * 0.46} height={size * 0.46} viewBox="0 0 24 24" fill="#fff"
          style={{ opacity: 0.95, filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.7))' }}>
          <path d="M12 2l1.7 6.1L20 10l-6.3 1.5L12 18l-1.7-6.5L4 10l6.3-1.9L12 2Z"/>
        </svg>
      </div>
    </div>
  )
}
