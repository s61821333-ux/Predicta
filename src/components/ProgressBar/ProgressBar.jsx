import './ProgressBar.css'

export default function ProgressBar({ value = 85, currentLabel, budgetLabel }) {
  return (
    <div className="progress-bar">
      <div className="progress-bar__track glass-recessed">
        <div className="progress-bar__fill" style={{ width: `${Math.min(value, 100)}%` }}>
          <div className="progress-bar__shine" />
        </div>
      </div>
      {(currentLabel || budgetLabel) && (
        <div className="progress-bar__labels">
          <span className="text-label-light">{currentLabel}</span>
          <span className="text-label-light">{budgetLabel}</span>
        </div>
      )}
    </div>
  )
}
