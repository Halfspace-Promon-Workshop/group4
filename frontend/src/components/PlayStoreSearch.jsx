import { useState, useEffect, useCallback } from 'react'
import { searchPlayStore, getPlayStoreApp } from '../api/analyze'

function PlayStoreSearch({ 
  onAppSelect, 
  onAnalyze, 
  canAnalyze, 
  isAnalyzing,
  selectedApp,
  setSelectedApp 
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [error, setError] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setHasSearched(false)
      return
    }

    const timer = setTimeout(async () => {
      setIsSearching(true)
      setError(null)
      setHasSearched(true)
      
      try {
        const apps = await searchPlayStore(query)
        setResults(apps)
      } catch (err) {
        setError(err.response?.data?.detail || err.message || 'Search failed')
        setResults([])
      } finally {
        setIsSearching(false)
      }
    }, 500) // 500ms debounce

    return () => clearTimeout(timer)
  }, [query])

  const handleSelectApp = useCallback(async (app) => {
    setIsLoadingDetails(true)
    setError(null)
    
    try {
      const details = await getPlayStoreApp(app.app_id)
      setSelectedApp(details)
      onAppSelect(details)
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to load app details')
    } finally {
      setIsLoadingDetails(false)
    }
  }, [onAppSelect, setSelectedApp])

  const handleClearSelection = () => {
    setSelectedApp(null)
    onAppSelect(null)
  }

  const formatInstalls = (installs) => {
    if (!installs) return 'N/A'
    return installs
  }

  const renderStars = (score) => {
    if (!score) return null
    const fullStars = Math.floor(score)
    const hasHalf = score - fullStars >= 0.5
    
    return (
      <div className="playstore-rating">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`star ${i < fullStars ? 'star--filled' : i === fullStars && hasHalf ? 'star--half' : ''}`}>
            ★
          </span>
        ))}
        <span className="playstore-rating__value">{score.toFixed(1)}</span>
      </div>
    )
  }

  // Show selected app details
  if (selectedApp) {
    return (
      <div className="playstore-search">
        <div className="playstore-selected">
          <div className="playstore-selected__header">
            <h3>Selected App</h3>
            <button 
              className="playstore-selected__change"
              onClick={handleClearSelection}
              disabled={isAnalyzing}
            >
              Change Selection
            </button>
          </div>
          
          <div className="playstore-selected__app">
            <img 
              src={selectedApp.icon} 
              alt={selectedApp.title}
              className="playstore-selected__icon"
            />
            <div className="playstore-selected__info">
              <h4 className="playstore-selected__title">{selectedApp.title}</h4>
              <p className="playstore-selected__developer">{selectedApp.developer}</p>
              <div className="playstore-selected__meta">
                {renderStars(selectedApp.score)}
                {selectedApp.installs && (
                  <span className="playstore-selected__installs">
                    {formatInstalls(selectedApp.installs)} installs
                  </span>
                )}
                {selectedApp.genre && (
                  <span className="playstore-selected__category">{selectedApp.genre}</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="playstore-selected__description">
            <h5>Description Preview</h5>
            <p>{selectedApp.description?.substring(0, 500)}...</p>
          </div>
          
          <a 
            href={selectedApp.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="playstore-selected__link"
          >
            View on Play Store →
          </a>
        </div>
        
        <div className="playstore-search__footer">
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
              'Analyze Security'
            )}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="playstore-search">
      <div className="form-group">
        <label className="form-label">
          Search Play Store
          <span className="form-label--hint">Enter an app name, package ID, or paste a Play Store URL</span>
        </label>
        <div className="playstore-search__input-wrapper">
          <input
            type="text"
            className="form-input playstore-search__input"
            placeholder="Search or paste URL (e.g., https://play.google.com/store/apps/details?id=...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isAnalyzing || isLoadingDetails}
          />
          {isSearching && (
            <div className="playstore-search__spinner">
              <div className="btn-spinner"></div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="playstore-search__error">
          {error}
        </div>
      )}

      {isLoadingDetails && (
        <div className="playstore-search__loading">
          <div className="btn-spinner"></div>
          <span>Loading app details...</span>
        </div>
      )}

      {!isLoadingDetails && hasSearched && results.length === 0 && !isSearching && (
        <div className="playstore-search__empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <p>No apps found for "{query}"</p>
          <span>Try a different search term</span>
        </div>
      )}

      {!isLoadingDetails && results.length > 0 && (
        <div className="playstore-search__results">
          <div className="playstore-search__results-header">
            <span>{results.length} apps found</span>
          </div>
          <div className="playstore-search__grid">
            {results.map((app) => (
              <button
                key={app.app_id}
                className="playstore-app-card"
                onClick={() => handleSelectApp(app)}
                disabled={isLoadingDetails}
              >
                <img 
                  src={app.icon} 
                  alt={app.title}
                  className="playstore-app-card__icon"
                />
                <div className="playstore-app-card__info">
                  <h4 className="playstore-app-card__title">{app.title}</h4>
                  <p className="playstore-app-card__developer">{app.developer}</p>
                  {app.score && (
                    <div className="playstore-app-card__rating">
                      <span className="star star--filled">★</span>
                      <span>{app.score.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {!hasSearched && (
        <div className="playstore-search__hint">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <h4>Search for an Android App</h4>
          <p>Find apps on Google Play Store and analyze their security posture based on their description and metadata.</p>
          <div className="playstore-search__examples">
            <span>Try:</span>
            <code>Netflix</code>
            <code>com.netflix.mediaclient</code>
            <code>play.google.com/store/apps/details?id=...</code>
          </div>
        </div>
      )}
    </div>
  )
}

export default PlayStoreSearch
