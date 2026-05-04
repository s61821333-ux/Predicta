/* Base glass surface wrapper — no extra CSS needed, uses globals.css utilities */
const VARIANT_CLASS = {
  panel:    'glass-panel',
  heavy:    'glass-panel-heavy',
  recessed: 'glass-recessed',
}

export default function GlassCard({
  variant = 'panel',
  className = '',
  style,
  children,
}) {
  return (
    <div
      className={`${VARIANT_CLASS[variant]} ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}
