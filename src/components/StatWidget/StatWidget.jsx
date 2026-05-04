import './StatWidget.css'

/*
 * Recessed stat cell — label on top, large value below.
 * accent=true → orange value; accent=false → muted value.
 * From the insights chat bubble bento grid in ai_liquid_glass/code.html.
 */
export default function StatWidget({ label, value, accent = true }) {
  return (
    <div className="stat-widget glass-recessed">
      <span className="stat-widget__label text-label-light">{label}</span>
      <span className={`stat-widget__value text-display-xl ${accent ? 'stat-widget__value--accent' : 'stat-widget__value--muted'}`}>
        {value}
      </span>
    </div>
  )
}
