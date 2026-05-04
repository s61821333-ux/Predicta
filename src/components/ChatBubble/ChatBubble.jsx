import StatWidget from '../StatWidget/StatWidget'
import Button from '../Button/Button'
import ProgressBar from '../ProgressBar/ProgressBar'
import './ChatBubble.css'

/*
 * Chat message bubble — AI or User variant.
 * Mirrors the message structure in ai_liquid_glass/code.html.
 *
 * AI variant:
 *   wrap (self-start)
 *   ├── sender label (icon + "Predicta AI")
 *   └── bubble (glass-panel-heavy + liquid-texture)
 *       ├── title (optional)
 *       ├── body text
 *       ├── bento grid of StatWidgets (optional)
 *       ├── ProgressBar (optional)
 *       └── action Button (optional)
 *
 * User variant:
 *   wrap (self-end)
 *   └── bubble (glass-panel, text-right)
 *       └── body text
 */
export default function ChatBubble({
  isAI        = false,
  title,
  children,
  stats,       // [{ label, value, accent? }]
  progress,    // { value, currentLabel, budgetLabel }
  actionLabel, // text for glass action button
  onAction,
}) {
  return (
    <div className={`chat-bubble-wrap chat-bubble-wrap--${isAI ? 'ai' : 'user'}`}>

      {/* Sender label — AI only */}
      {isAI && (
        <div className="chat-bubble__sender text-label-bold">
          <span
            className="material-symbols-outlined chat-bubble__sender-icon"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            psychology
          </span>
          Predicta AI
        </div>
      )}

      {/* Bubble surface */}
      <div className={`chat-bubble__body chat-bubble__body--${isAI ? 'ai' : 'user'} ${isAI ? 'glass-panel-heavy liquid-texture' : 'glass-panel'}`}>

        {/* Ambient glow (AI only) */}
        {isAI && <div className="chat-bubble__glow" />}

        {title && <h3 className="text-headline-md" style={{ marginBottom: 16 }}>{title}</h3>}

        <div className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
          {children}
        </div>

        {/* Inline 2-column stat grid */}
        {stats?.length > 0 && (
          <div className="chat-bubble__bento">
            {stats.map(s => (
              <StatWidget key={s.label} label={s.label} value={s.value} accent={s.accent ?? true} />
            ))}
          </div>
        )}

        {/* Budget progress bar */}
        {progress && (
          <ProgressBar
            value={progress.value}
            currentLabel={progress.currentLabel}
            budgetLabel={progress.budgetLabel}
          />
        )}

        {/* Optional glass action button */}
        {actionLabel && (
          <div className="chat-bubble__actions">
            <Button variant="glass" icon="visibility" onClick={onAction}>
              {actionLabel}
            </Button>
          </div>
        )}

      </div>
    </div>
  )
}
