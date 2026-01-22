import { useState } from 'react'

const TABS = [
  { id: 'analysis', label: 'Your Analysis', icon: '📊' },
  { id: 'threats', label: 'Threats' },
  { id: 'events', label: 'Events' },
  { id: 'devices', label: 'Devices' },
  { id: 'agent', label: 'Agent' }
]

function InsightHeader({ activeTab, onTabChange, appName, onBack }) {
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  return (
    <header className="insight-header">
      <div className="insight-header__top">
        <div className="insight-header__brand">
          <button className="insight-header__back" onClick={onBack} title="Back to Report">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 className="insight-header__title">Insight</h1>
          <span className="insight-header__badge">Preview</span>
        </div>
        
        <div className="insight-header__controls">
          <div className="insight-header__date-range">
            <span>Date range</span>
            <input 
              type="date" 
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            />
            <span>–</span>
            <input 
              type="date" 
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            />
          </div>
          
          <div className="insight-header__timezone">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            <span>UTC+01:00</span>
          </div>
          
          <div className="insight-header__app-filter">
            <span>App filter</span>
            <select defaultValue={appName || 'all'}>
              <option value="all">All Apps</option>
              <option value={appName}>{appName}</option>
            </select>
          </div>
        </div>
      </div>
      
      <nav className="insight-header__tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`insight-header__tab ${activeTab === tab.id ? 'insight-header__tab--active' : ''} ${tab.id === 'analysis' ? 'insight-header__tab--highlight' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.icon && <span className="insight-header__tab-icon">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  )
}

export default InsightHeader
