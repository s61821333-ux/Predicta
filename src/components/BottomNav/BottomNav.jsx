import './BottomNav.css'

const DEFAULT_ITEMS = [
  { icon: 'home_app_logo',  label: 'בית',    path: '/dashboard'       },
  { icon: 'add_circle',     label: 'הוסף',   path: '/new-transaction' },
  { icon: 'search',         label: 'חיפוש',  path: '/search'          },
  { icon: 'psychology',     label: 'AI',     path: '/ai-chat'         },
  { icon: 'account_circle', label: 'פרופיל', path: '/profile'         },
]

export default function BottomNav({ activePath = '/dashboard', onNavigate, items }) {
  const navItems = items ?? DEFAULT_ITEMS

  return (
    <nav className="bottom-nav glass-panel">
      {navItems.map(({ icon, label, path }) => {
        const isActive = activePath === path
        return (
          <a
            key={path}
            href="#"
            className={`bottom-nav__item${isActive ? ' bottom-nav__item--active' : ''}`}
            onClick={e => { e.preventDefault(); onNavigate?.(path) }}
          >
            <span
              className="material-symbols-outlined"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {icon}
            </span>
            <span className="bottom-nav__label">{label}</span>
          </a>
        )
      })}
    </nav>
  )
}
