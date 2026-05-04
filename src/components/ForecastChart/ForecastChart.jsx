import GlassCard from '../GlassCard/GlassCard'
import Badge from '../Badge/Badge'
import './ForecastChart.css'

/*
 * AI Forecast bento card with SVG area chart.
 * Mirrors the md:col-span-6 forecast card in liquid_glass_1/code.html.
 *
 * GlassCard (panel)
 * ├── header (label | Badge)
 * ├── headline value
 * ├── subtitle
 * └── SVG area chart (absolute, bottom of card)
 */
export default function ForecastChart({
  value    = 'Expected: ₪ 132K',
  subtitle = 'Based on your current trajectory.',
}) {
  return (
    <GlassCard className="forecast-chart">

      <div className="forecast-chart__header">
        <span className="forecast-chart__label text-label-bold">AI Forecast</span>
        <Badge color="primary">Predictive</Badge>
      </div>

      <h3 className="forecast-chart__value text-headline-md">{value}</h3>
      <p  className="forecast-chart__sub  text-body-md">{subtitle}</p>

      {/* Gradient area line chart */}
      <div className="forecast-chart__svg-wrap">
        <svg viewBox="0 0 100 50" preserveAspectRatio="none">
          <defs>
            <linearGradient id="forecast-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor="#FF6B00" stopOpacity="0.20" />
              <stop offset="100%" stopColor="#FF6B00" stopOpacity="0"    />
            </linearGradient>
          </defs>
          {/* Filled area */}
          <path
            d="M0,50 Q20,40 40,30 T80,20 T100,10 L100,50 L0,50 Z"
            fill="url(#forecast-gradient)"
          />
          {/* Line with orange glow */}
          <path
            d="M0,50 Q20,40 40,30 T80,20 T100,10"
            fill="none"
            stroke="#FF6B00"
            strokeWidth="1.5"
            style={{ filter: 'drop-shadow(0 0 8px rgba(255,107,0,0.60))' }}
          />
        </svg>
      </div>

    </GlassCard>
  )
}
