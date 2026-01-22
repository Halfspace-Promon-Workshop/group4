function DescriptionInput({ 
  value, 
  onChange, 
  appName, 
  onAppNameChange, 
  onAnalyze, 
  canAnalyze, 
  isAnalyzing 
}) {
  const placeholder = `Paste the app store description here...

Example:
SecureBank Mobile lets you manage your accounts, transfer money, pay bills, and deposit checks using your phone's camera. 

Features include fingerprint login, real-time fraud alerts, and person-to-person payments. Apply for loans and credit cards directly in the app.

Enable notifications for transaction alerts and spending insights.

The more detailed the description, the better the analysis.`

  return (
    <div className="description-input">
      <h2 className="card__title">App Description</h2>
      
      <div className="form-group">
        <label className="form-label">
          App Name <span className="form-label--optional">(optional)</span>
        </label>
        <input
          type="text"
          value={appName}
          onChange={(e) => onAppNameChange(e.target.value)}
          placeholder="e.g., SecureBank Mobile"
          disabled={isAnalyzing}
          className="form-input"
        />
      </div>
      
      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          className="description-input__field"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={isAnalyzing}
        />
      </div>
      
      <div className="description-input__footer">
        <span className="description-input__hint">
          {value.length < 50 
            ? `${50 - value.length} more characters needed`
            : `${value.length} characters`
          }
        </span>
        
        <button
          className="btn btn--primary"
          onClick={onAnalyze}
          disabled={!canAnalyze || isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <span className="btn-spinner"></span>
              Analyzing...
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
              Analyze Threats
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default DescriptionInput
