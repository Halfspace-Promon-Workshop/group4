import { useState, useEffect } from 'react'
import { getAIProviders } from '../api/analyze'

const PROVIDER_ICONS = {
  openai: '🤖',
  anthropic: '🧠',
  google: '✨'
}

function AIProviderSelector({ value, onChange, disabled }) {
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchProviders() {
      try {
        const data = await getAIProviders()
        setProviders(data.providers || [])
        
        // If no value set yet, use the default
        if (!value && data.default) {
          onChange(data.default)
        }
      } catch (err) {
        console.error('Failed to fetch AI providers:', err)
        setError('Failed to load AI providers')
      } finally {
        setLoading(false)
      }
    }
    
    fetchProviders()
  }, [])

  if (loading) {
    return (
      <div className="ai-provider-selector ai-provider-selector--loading">
        <span className="ai-provider-selector__loading">Loading AI providers...</span>
      </div>
    )
  }

  if (error || providers.length === 0) {
    return (
      <div className="ai-provider-selector ai-provider-selector--error">
        <span className="ai-provider-selector__error">
          {error || 'No AI providers configured. Please add API keys to .env file.'}
        </span>
      </div>
    )
  }

  // If only one provider, show it as selected without dropdown
  if (providers.length === 1) {
    return (
      <div className="ai-provider-selector ai-provider-selector--single">
        <label className="form-label">AI Provider</label>
        <div className="ai-provider-selector__single-provider">
          <span className="ai-provider-selector__icon">{PROVIDER_ICONS[providers[0].id] || '🤖'}</span>
          <span className="ai-provider-selector__name">{providers[0].name}</span>
          <span className="ai-provider-selector__model">{providers[0].model}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="ai-provider-selector">
      <label className="form-label">AI Provider</label>
      <select
        className="ai-provider-selector__select"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {providers.map((provider) => (
          <option key={provider.id} value={provider.id}>
            {provider.name} ({provider.model})
          </option>
        ))}
      </select>
    </div>
  )
}

export default AIProviderSelector
