import StatCard from './StatCard'
import ThreatMap from './ThreatMap'
import ProgressIndicator from './charts/ProgressIndicator'

function ThreatsTab({ data, analysisResult }) {
  const threatIndicators = data.threatIndicators || {}
  const matchedCategories = (data.matchedThreats || []).map(m => m.category)
  const correlations = data.correlations || []
  
  const indicators = [
    { key: 'rootingJailbreak', label: 'Rooting/Jailbreak' },
    { key: 'emulator', label: 'Emulator' },
    { key: 'hookingFramework', label: 'Hooking Framework' }
  ]
  
  const additionalIndicators = [
    { key: 'debugger', label: 'DEBUGGER' },
    { key: 'repackaging', label: 'REPACKAGING' },
    { key: 'developerOptions', label: 'DEVELOPER OPTIONS' },
    { key: 'installedPackages', label: 'INSTALLED PACKAGES' }
  ]

  return (
    <div className="threats-tab">
      {/* Stat Cards Row */}
      <div className="threats-tab__stats">
        <StatCard 
          title="Threats" 
          value={data.totalThreats} 
        />
        <StatCard 
          title="Severe Threats" 
          value={data.severeThreats}
          highlighted={true}
        />
        <StatCard 
          title="Apps shielded" 
          value={data.appsShielded} 
        />
        <StatCard 
          title="Live for (Days)" 
          value={data.liveDays} 
        />
      </div>
      
      {/* Enhanced Correlation Panel */}
      {correlations.length > 0 && (
        <div className="threats-tab__correlation">
          <div className="threats-tab__correlation-header">
            <span className="threats-tab__correlation-icon">🔗</span>
            <h3 className="threats-tab__correlation-title">
              Your Analysis Matches Real Threat Data
            </h3>
          </div>
          <p className="threats-tab__correlation-subtitle">
            Based on your security analysis of <strong>{analysisResult?.app_name || 'your app'}</strong>, 
            here's how your vulnerabilities correlate with threats we detect across protected apps:
          </p>
          <div className="threats-tab__correlation-list">
            {correlations.map((correlation, idx) => (
              <div key={idx} className="threats-tab__correlation-item">
                <div className="threats-tab__correlation-arrow">→</div>
                <div className="threats-tab__correlation-content">
                  <strong>{correlation.analysisRisk}</strong>
                  <span className="threats-tab__correlation-insight">
                    correlates with <strong>{correlation.insightCount.toLocaleString()}</strong> {correlation.insightCategory} threats
                  </span>
                </div>
                <div className="threats-tab__correlation-badge">
                  {Math.round((correlation.insightCount / data.totalThreats) * 100)}% of total
                </div>
              </div>
            ))}
          </div>
          
          {/* Summary metrics */}
          <div className="threats-tab__correlation-summary">
            <div className="correlation-metric">
              <span className="correlation-metric__value">{correlations.length}</span>
              <span className="correlation-metric__label">Matched Categories</span>
            </div>
            <div className="correlation-metric">
              <span className="correlation-metric__value">
                {correlations.reduce((sum, c) => sum + c.insightCount, 0).toLocaleString()}
              </span>
              <span className="correlation-metric__label">Related Detections</span>
            </div>
            <div className="correlation-metric">
              <span className="correlation-metric__value">
                {Math.round((correlations.reduce((sum, c) => sum + c.insightCount, 0) / data.totalThreats) * 100)}%
              </span>
              <span className="correlation-metric__label">Threat Coverage</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Global Threat Map */}
      <div className="threats-tab__map-section">
        <ThreatMap regions={data.regions} />
      </div>
      
      {/* Key Indicators */}
      <div className="threats-tab__indicators">
        <h3 className="threats-tab__section-title">Key indicators</h3>
        
        <div className="threats-tab__indicators-main">
          {indicators.map(ind => (
            <ProgressIndicator
              key={ind.key}
              label={ind.label}
              value={threatIndicators[ind.key]?.count || 0}
              percentage={threatIndicators[ind.key]?.percentage || 0}
              highlighted={matchedCategories.includes(ind.key)}
            />
          ))}
        </div>
        
        <div className="threats-tab__indicators-grid">
          {additionalIndicators.map(ind => (
            <div 
              key={ind.key} 
              className={`threats-tab__indicator-card ${matchedCategories.includes(ind.key) ? 'threats-tab__indicator-card--highlighted' : ''}`}
            >
              <div className="threats-tab__indicator-value">
                {(threatIndicators[ind.key]?.count || 0).toLocaleString()}
              </div>
              <div className="threats-tab__indicator-label">{ind.label}</div>
              {matchedCategories.includes(ind.key) && (
                <div className="threats-tab__indicator-match">🔗 Matches your analysis</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ThreatsTab
