function ProgressIndicator({ label, value, percentage, highlighted = false }) {
  return (
    <div className={`progress-indicator ${highlighted ? 'progress-indicator--highlighted' : ''}`}>
      <div className="progress-indicator__header">
        <span className="progress-indicator__label">{label}</span>
        <span className="progress-indicator__percentage">{percentage}% of all threats</span>
      </div>
      <div className="progress-indicator__value">{value.toLocaleString()}</div>
      <div className="progress-indicator__bar-container">
        <div 
          className="progress-indicator__bar" 
          style={{ width: `${Math.min(percentage * 2, 100)}%` }}
        ></div>
      </div>
    </div>
  )
}

export default ProgressIndicator
