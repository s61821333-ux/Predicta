import GlassCard from '../GlassCard/GlassCard'
import './BalanceCard.css'

/*
 * Large bento card — total balance.
 * Mirrors the md:col-span-8 card in liquid_glass_1/code.html.
 *
 * GlassCard (panel)
 * └── header row
 *     ├── label + display-xl amount
 *     └── icon (glass-panel pill)
 * └── trend row
 *     ├── arrow icon (primary-fixed bg)
 *     ├── percentage (orange)
 *     └── label (muted)
 * └── decoration icon (absolute, faint)
 */
export default function BalanceCard({
  currency  = '₪',
  amount    = '124,500',
  trend     = '+4.2%',
  trendLabel= 'vs last month',
}) {
  return (
    <GlassCard className="balance-card">

      {/* Header: label + amount | wallet icon */}
      <div className="balance-card__header">
        <div>
          <span className="balance-card__label text-label-bold">Total Balance</span>
          <p className="balance-card__amount text-display-xl">
            {currency} {amount}
          </p>
        </div>
        <span className="material-symbols-outlined balance-card__icon glass-panel">
          account_balance_wallet
        </span>
      </div>

      {/* Trend row */}
      <div className="balance-card__trend">
        <span className="material-symbols-outlined balance-card__trend-arrow">arrow_upward</span>
        <span className="balance-card__trend-pct text-label-bold">{trend}</span>
        <span className="balance-card__trend-label text-label-light">{trendLabel}</span>
      </div>

      {/* Decorative background glyph */}
      <span className="material-symbols-outlined balance-card__decoration">texture</span>

    </GlassCard>
  )
}
