import { useState, useEffect } from 'react'
import { getAnalysisHistory, deleteAnalysis, clearHistory, formatTimestamp } from '../utils/analysisHistory'

function AnalysisHistory({ onSelectAnalysis, onClose }) {
  const [history, setHistory] = useState([])
  
  useEffect(() => {
    setHistory(getAnalysisHistory())
  }, [])
  
  const handleDelete = (id, e) => {
    e.stopPropagation()
    if (deleteAnalysis(id)) {
      setHistory(getAnalysisHistory())
    }
  }
  
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all analysis history?')) {
      clearHistory()
      setHistory([])
    }
  }
  
  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Critical': return 'var(--risk-critical)'
      case 'High': return 'var(--risk-high)'
      case 'Medium': return 'var(--risk-medium)'
      case 'Low': return 'var(--risk-low)'
      default: return 'var(--text-muted)'
    }
  }

  return (
    <div className="history-modal">
      <div className="history-modal__backdrop" onClick={onClose}></div>
      <div className="history-modal__content">
        <div className="history-modal__header">
          <h2>Previous Analyses</h2>
          <button className="history-modal__close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        
        {history.length === 0 ? (
          <div className="history-modal__empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <p>No previous analyses found</p>
            <span>Your analysis history will appear here</span>
          </div>
        ) : (
          <>
            <div className="history-modal__list">
              {history.map((entry) => (
                <div 
                  key={entry.id} 
                  className="history-item"
                  onClick={() => onSelectAnalysis(entry.result)}
                >
                  <div className="history-item__main">
                    <div className="history-item__header">
                      <h3 className="history-item__name">{entry.app_name}</h3>
                      <span 
                        className="history-item__risk"
                        style={{ color: getRiskColor(entry.overall_risk) }}
                      >
                        {entry.overall_risk} Risk
                      </span>
                    </div>
                    <div className="history-item__meta">
                      <span className="history-item__platform">{entry.platform}</span>
                      <span className="history-item__time">{formatTimestamp(entry.timestamp)}</span>
                    </div>
                    <div className="history-item__stats">
                      <span>{entry.capabilities_count} capabilities</span>
                      <span>•</span>
                      <span>{entry.attack_vectors_count} threats</span>
                      <span>•</span>
                      <span>{entry.protections_count} protections</span>
                    </div>
                  </div>
                  <button 
                    className="history-item__delete"
                    onClick={(e) => handleDelete(entry.id, e)}
                    title="Delete"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            
            <div className="history-modal__footer">
              <button className="btn btn--secondary" onClick={handleClearAll}>
                Clear All History
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AnalysisHistory
