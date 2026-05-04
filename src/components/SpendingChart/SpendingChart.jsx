import GlassCard from '../GlassCard/GlassCard'
import './SpendingChart.css'

const DEFAULT_DATA = [
  { day: 'Mon', pct: 60 },
  { day: 'Tue', pct: 40 },
  { day: 'Wed', pct: 80, active: true },
  { day: 'Thu', pct: 50 },
  { day: 'Fri', pct: 70 },
]

/*
 * Spending bar chart bento card.
 * Mirrors the md:col-span-6 spending card in liquid_glass_1/code.html.
 *
 * GlassCard (panel)
 * ├── header (label | more icon)
 * └── bar area
 *     └── ChartCol ×n
 *         ├── bar (glass-panel or active variant)
 *         └── day label
 */
export default function SpendingChart({ data = DEFAULT_DATA }) {
  return (
    <GlassCard className="spending-chart">

      <div className="spending-chart__header">
        <span className="spending-chart__label text-label-bold">Spending Analysis</span>
        <span className="material-symbols-outlined">more_horiz</span>
      </div>

      <div className="spending-chart__bars">
        {data.map(({ day, pct, active }) => (
          <div key={day} className="spending-chart__col">
            <div
              className={`spending-chart__bar glass-panel${active ? ' spending-chart__bar--active' : ''}`}
              style={{ height: `${pct}%` }}
            />
            <span className={`spending-chart__day text-label-light${active ? ' spending-chart__day--active' : ''}`}>
              {day}
            </span>
          </div>
        ))}
      </div>

    </GlassCard>
  )
}
