import Icon from '../Icon/Icon'

const ICON_MAP = {
  'אוכל': 'food', 'מזון': 'food',
  'תחבורה': 'car', 'רכב': 'car', 'דלק': 'car',
  'קניות': 'bag', 'ביגוד': 'clothes',
  'בריאות': 'health',
  'בילויים': 'fun', 'בידור': 'fun',
  'חשבונות': 'bills', 'תקשורת': 'bills', 'ביטוח': 'bills',
  'חינוך': 'school',
  'דיור': 'homecat', 'שכר דירה': 'homecat',
  'משכורת': 'salary',
  'פרילנס': 'freelance',
  'מתנות': 'gift', 'מתנה': 'gift',
  'החזרים': 'refund', 'החזר': 'refund',
  'חסכונות': 'savings', 'חיסכון': 'savings',
  'השקעות': 'trend',
  'הכנסה': 'salary',
}

export function getIconForCategory(name, iconName) {
  if (iconName && iconName !== 'other') return iconName
  return ICON_MAP[name] || 'other'
}

export default function CatChip({ color = '#8A93A8', name = '', iconName, size = 46, r }) {
  const radius = r ?? Math.round(size * 0.34)
  const icon = getIconForCategory(name, iconName)
  return (
    <div style={{
      width: size, height: size, borderRadius: radius, flexShrink: 0,
      display: 'grid', placeItems: 'center', position: 'relative', overflow: 'hidden',
      color: '#fff', background: color,
      boxShadow: `0 ${size * 0.13}px ${size * 0.32}px -4px ${color}88, inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -2px 5px rgba(0,0,0,0.18)`,
    }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(155deg, rgba(255,255,255,0.45), rgba(255,255,255,0.04) 52%, rgba(0,0,0,0.12))', pointerEvents: 'none' }} />
      <Icon name={icon} size={Math.round(size * 0.52)} sw={2.15} style={{ position: 'relative', filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.18))' }} />
    </div>
  )
}
