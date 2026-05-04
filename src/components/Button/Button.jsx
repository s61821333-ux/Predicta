import './Button.css'

export default function Button({
  variant = 'primary',
  full = false,
  icon,
  children,
  onClick,
  className = '',
  ...props
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    full ? 'btn--full' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <button className={classes} onClick={onClick} {...props}>
      {icon && <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{icon}</span>}
      {children}
    </button>
  )
}
