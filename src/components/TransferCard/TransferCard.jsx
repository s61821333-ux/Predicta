import GlassCard from '../GlassCard/GlassCard'
import Button from '../Button/Button'
import './TransferCard.css'

/*
 * Quick-transfer bento card.
 * Mirrors the md:col-span-4 card in liquid_glass_1/code.html.
 *
 * GlassCard (panel)
 * ├── label
 * ├── rows (glass-recessed)
 * │   ├── recipient row
 * │   └── amount row
 * └── Button (primary, full-width)
 */
export default function TransferCard({
  recipient = 'Sarah Jenkins',
  amount    = '₪ 500',
  currency  = 'ILS',
  onSend,
}) {
  return (
    <GlassCard className="transfer-card">

      <span className="transfer-card__label text-label-bold">Quick Transfer</span>

      <div className="transfer-card__rows">
        {/* Recipient row */}
        <div className="transfer-card__row transfer-card__row--recipient glass-recessed">
          <span className="text-body-md">{`To: ${recipient}`}</span>
          <span className="material-symbols-outlined">expand_more</span>
        </div>

        {/* Amount row */}
        <div className="transfer-card__row glass-recessed">
          <span className="transfer-card__amount">{amount}</span>
          <span className="transfer-card__currency text-label-bold">{currency}</span>
        </div>
      </div>

      <Button variant="primary" full onClick={onSend}>Send Money</Button>

    </GlassCard>
  )
}
