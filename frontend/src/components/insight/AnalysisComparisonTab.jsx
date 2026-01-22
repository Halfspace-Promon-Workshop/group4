/**
 * Analysis Comparison Tab - Shows data from our analysis compared to Insight data
 */

import StatCard from './StatCard'

function AnalysisComparisonTab({ data, analysisResult }) {
  if (!analysisResult) {
    return (
      <div className="insight-tab-placeholder">
        <h3>No Analysis Data</h3>
        <p>Run an analysis first to see comparison data here.</p>
      </div>
    )
  }

  const capabilities = analysisResult.capabilities?.capabilities || []
  const attackVectors = analysisResult.attack_surface?.attack_vectors || []
  const protections = analysisResult.promon_mapping?.protections || []
  const overallRisk = analysisResult.attack_surface?.overall_risk_level || 'Medium'
  
  // Calculate risk distribution
  const riskDistribution = {
    high: attackVectors.filter(v => v.likelihood === 'High').length,
    medium: attackVectors.filter(v => v.likelihood === 'Medium').length,
    low: attackVectors.filter(v => v.likelihood === 'Low').length
  }
  
  // Map capabilities to categories
  const capabilityCategories = capabilities.reduce((acc, cap) => {
    const category = cap.capability.toLowerCase().includes('auth') ? 'Authentication' :
                     cap.capability.toLowerCase().includes('payment') ? 'Payments' :
                     cap.capability.toLowerCase().includes('data') ? 'Data Handling' :
                     cap.capability.toLowerCase().includes('api') ? 'API/Network' :
                     'Other'
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {})

  // Get threat types for comparison
  const threatTypes = attackVectors.reduce((acc, vector) => {
    const type = vector.name.toLowerCase().includes('revers') ? 'Reverse Engineering' :
                 vector.name.toLowerCase().includes('tamper') ? 'Tampering' :
                 vector.name.toLowerCase().includes('credential') ? 'Credential Theft' :
                 vector.name.toLowerCase().includes('repackag') ? 'Repackaging' :
                 vector.name.toLowerCase().includes('inject') ? 'Code Injection' :
                 vector.name.toLowerCase().includes('man-in') ? 'MITM Attack' :
                 'Other'
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {})

  return (
    <div className="analysis-comparison-tab">
      {/* Header Stats */}
      <div className="analysis-comparison-tab__header">
        <h2 className="analysis-comparison-tab__title">
          📊 Your App Analysis vs. Industry Data
        </h2>
        <p className="analysis-comparison-tab__subtitle">
          Comparing <strong>{analysisResult.app_name}</strong>'s security profile against {data.totalThreats?.toLocaleString()} threats detected across Promon-protected apps
        </p>
      </div>

      {/* Summary Stats */}
      <div className="analysis-comparison-tab__stats">
        <StatCard title="Capabilities Found" value={capabilities.length} />
        <StatCard title="Attack Vectors" value={attackVectors.length} />
        <StatCard title="Protections Mapped" value={protections.length} />
        <StatCard 
          title="Overall Risk" 
          value={overallRisk}
          highlighted={overallRisk === 'High' || overallRisk === 'Critical'}
        />
      </div>

      {/* Risk Distribution Comparison */}
      <div className="analysis-comparison-tab__section">
        <h3 className="analysis-comparison-tab__section-title">Risk Distribution</h3>
        <div className="analysis-comparison-tab__risk-grid">
          <div className="risk-comparison-card">
            <h4>Your App</h4>
            <div className="risk-bars">
              <div className="risk-bar">
                <span className="risk-bar__label">High Risk</span>
                <div className="risk-bar__track">
                  <div 
                    className="risk-bar__fill risk-bar__fill--high" 
                    style={{ width: `${(riskDistribution.high / attackVectors.length * 100) || 0}%` }}
                  ></div>
                </div>
                <span className="risk-bar__value">{riskDistribution.high}</span>
              </div>
              <div className="risk-bar">
                <span className="risk-bar__label">Medium Risk</span>
                <div className="risk-bar__track">
                  <div 
                    className="risk-bar__fill risk-bar__fill--medium" 
                    style={{ width: `${(riskDistribution.medium / attackVectors.length * 100) || 0}%` }}
                  ></div>
                </div>
                <span className="risk-bar__value">{riskDistribution.medium}</span>
              </div>
              <div className="risk-bar">
                <span className="risk-bar__label">Low Risk</span>
                <div className="risk-bar__track">
                  <div 
                    className="risk-bar__fill risk-bar__fill--low" 
                    style={{ width: `${(riskDistribution.low / attackVectors.length * 100) || 0}%` }}
                  ></div>
                </div>
                <span className="risk-bar__value">{riskDistribution.low}</span>
              </div>
            </div>
          </div>
          
          <div className="risk-comparison-card">
            <h4>Industry Average</h4>
            <div className="risk-bars">
              <div className="risk-bar">
                <span className="risk-bar__label">High Risk</span>
                <div className="risk-bar__track">
                  <div className="risk-bar__fill risk-bar__fill--high" style={{ width: '35%' }}></div>
                </div>
                <span className="risk-bar__value">35%</span>
              </div>
              <div className="risk-bar">
                <span className="risk-bar__label">Medium Risk</span>
                <div className="risk-bar__track">
                  <div className="risk-bar__fill risk-bar__fill--medium" style={{ width: '45%' }}></div>
                </div>
                <span className="risk-bar__value">45%</span>
              </div>
              <div className="risk-bar">
                <span className="risk-bar__label">Low Risk</span>
                <div className="risk-bar__track">
                  <div className="risk-bar__fill risk-bar__fill--low" style={{ width: '20%' }}></div>
                </div>
                <span className="risk-bar__value">20%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Threat Type Comparison */}
      <div className="analysis-comparison-tab__section">
        <h3 className="analysis-comparison-tab__section-title">Threat Categories Comparison</h3>
        <div className="threat-comparison">
          <table className="threat-comparison__table">
            <thead>
              <tr>
                <th>Threat Type</th>
                <th>Your App</th>
                <th>Industry (% of apps affected)</th>
                <th>Insight Detections</th>
              </tr>
            </thead>
            <tbody>
              <tr className={threatTypes['Reverse Engineering'] ? 'highlighted' : ''}>
                <td>Reverse Engineering</td>
                <td>{threatTypes['Reverse Engineering'] ? '⚠️ Detected' : '✅ Not Found'}</td>
                <td>78%</td>
                <td>45,230</td>
              </tr>
              <tr className={threatTypes['Tampering'] ? 'highlighted' : ''}>
                <td>Runtime Tampering</td>
                <td>{threatTypes['Tampering'] ? '⚠️ Detected' : '✅ Not Found'}</td>
                <td>65%</td>
                <td>33,685</td>
              </tr>
              <tr className={threatTypes['Credential Theft'] ? 'highlighted' : ''}>
                <td>Credential Theft</td>
                <td>{threatTypes['Credential Theft'] ? '⚠️ Detected' : '✅ Not Found'}</td>
                <td>52%</td>
                <td>28,450</td>
              </tr>
              <tr className={threatTypes['Repackaging'] ? 'highlighted' : ''}>
                <td>Repackaging</td>
                <td>{threatTypes['Repackaging'] ? '⚠️ Detected' : '✅ Not Found'}</td>
                <td>45%</td>
                <td>2,390</td>
              </tr>
              <tr className={threatTypes['Code Injection'] ? 'highlighted' : ''}>
                <td>Code Injection</td>
                <td>{threatTypes['Code Injection'] ? '⚠️ Detected' : '✅ Not Found'}</td>
                <td>38%</td>
                <td>2,454</td>
              </tr>
              <tr className={threatTypes['MITM Attack'] ? 'highlighted' : ''}>
                <td>MITM Attacks</td>
                <td>{threatTypes['MITM Attack'] ? '⚠️ Detected' : '✅ Not Found'}</td>
                <td>42%</td>
                <td>18,920</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Capabilities Breakdown */}
      <div className="analysis-comparison-tab__section">
        <h3 className="analysis-comparison-tab__section-title">App Capabilities Breakdown</h3>
        <div className="capabilities-chart">
          {Object.entries(capabilityCategories).map(([category, count]) => (
            <div key={category} className="capability-item">
              <div className="capability-item__header">
                <span className="capability-item__name">{category}</span>
                <span className="capability-item__count">{count} capabilities</span>
              </div>
              <div className="capability-item__bar">
                <div 
                  className="capability-item__fill"
                  style={{ width: `${(count / capabilities.length * 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attack Vectors Detail */}
      <div className="analysis-comparison-tab__section">
        <h3 className="analysis-comparison-tab__section-title">Identified Attack Vectors</h3>
        <div className="attack-vectors-list">
          {attackVectors.map((vector, idx) => (
            <div key={idx} className={`attack-vector-card attack-vector-card--${vector.likelihood.toLowerCase()}`}>
              <div className="attack-vector-card__header">
                <span className={`attack-vector-card__risk attack-vector-card__risk--${vector.likelihood.toLowerCase()}`}>
                  {vector.likelihood}
                </span>
                <h4 className="attack-vector-card__name">{vector.name}</h4>
              </div>
              <p className="attack-vector-card__description">{vector.description}</p>
              <div className="attack-vector-card__impact">
                <strong>Business Impact:</strong> {vector.business_impact}
              </div>
              {data.matchedThreats?.find(m => 
                m.attackVector.toLowerCase().includes(vector.name.toLowerCase().split(' ')[0])
              ) && (
                <div className="attack-vector-card__insight-match">
                  🔗 Matches Insight category with {
                    data.matchedThreats.find(m => 
                      m.attackVector.toLowerCase().includes(vector.name.toLowerCase().split(' ')[0])
                    )?.count.toLocaleString()
                  } detections
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Protection Coverage */}
      <div className="analysis-comparison-tab__section">
        <h3 className="analysis-comparison-tab__section-title">Promon Protection Coverage</h3>
        <div className="protection-coverage">
          <div className="protection-coverage__visual">
            <div className="coverage-donut">
              <svg viewBox="0 0 100 100" className="coverage-donut__svg">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="12"
                  strokeDasharray={`${(protections.length / attackVectors.length * 251.2) || 0} 251.2`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
                <text x="50" y="50" textAnchor="middle" dy="0.35em" className="coverage-donut__text">
                  {attackVectors.length > 0 ? Math.round(protections.length / attackVectors.length * 100) : 0}%
                </text>
              </svg>
            </div>
            <div className="protection-coverage__stats">
              <div className="coverage-stat">
                <span className="coverage-stat__value">{protections.length}</span>
                <span className="coverage-stat__label">Threats Protected</span>
              </div>
              <div className="coverage-stat">
                <span className="coverage-stat__value">{attackVectors.length}</span>
                <span className="coverage-stat__label">Total Threats</span>
              </div>
            </div>
          </div>
          <p className="protection-coverage__description">
            With Promon Shield and recommended extensions, {protections.length} out of {attackVectors.length} identified 
            attack vectors would be protected. This represents comprehensive coverage against the most critical threats 
            facing your application.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AnalysisComparisonTab
