function AnalysisProgress({ stages }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return '✓'
      case 'in_progress':
        return null // Will show spinner
      case 'error':
        return '✕'
      default:
        return '○'
    }
  }

  return (
    <div className="analysis-progress">
      <h3 className="analysis-progress__title">Analysis Progress</h3>
      
      <div className="analysis-progress__stages">
        {stages.map((stage) => (
          <div 
            key={stage.stage} 
            className={`progress-stage progress-stage--${stage.status}`}
          >
            <span className="progress-stage__icon">
              {stage.status === 'in_progress' ? (
                <span className="progress-stage__spinner"></span>
              ) : (
                getStatusIcon(stage.status)
              )}
            </span>
            <span className="progress-stage__name">
              Stage {stage.stage}: {stage.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AnalysisProgress
