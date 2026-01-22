/**
 * Analysis History Management
 * Stores and retrieves previous analyses from localStorage
 */

const STORAGE_KEY = 'promon_lens_history'
const MAX_HISTORY = 10 // Keep last 10 analyses

/**
 * Get all saved analyses
 */
export function getAnalysisHistory() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error reading analysis history:', error)
    return []
  }
}

/**
 * Save a new analysis to history
 */
export function saveAnalysis(result) {
  try {
    const history = getAnalysisHistory()
    
    // Create history entry
    const entry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      app_name: result.app_name,
      platform: result.platform,
      overall_risk: result.attack_surface?.overall_risk_level || 'Unknown',
      capabilities_count: result.capabilities?.capabilities?.length || 0,
      attack_vectors_count: result.attack_surface?.attack_vectors?.length || 0,
      protections_count: result.promon_mapping?.protections?.length || 0,
      // Store the full result for viewing later
      result: result
    }
    
    // Add to beginning of array
    history.unshift(entry)
    
    // Keep only last MAX_HISTORY entries
    const trimmedHistory = history.slice(0, MAX_HISTORY)
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory))
    
    return entry
  } catch (error) {
    console.error('Error saving analysis:', error)
    return null
  }
}

/**
 * Get a specific analysis by ID
 */
export function getAnalysisById(id) {
  const history = getAnalysisHistory()
  return history.find(entry => entry.id === id)
}

/**
 * Delete an analysis from history
 */
export function deleteAnalysis(id) {
  try {
    const history = getAnalysisHistory()
    const filtered = history.filter(entry => entry.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    return true
  } catch (error) {
    console.error('Error deleting analysis:', error)
    return false
  }
}

/**
 * Clear all history
 */
export function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (error) {
    console.error('Error clearing history:', error)
    return false
  }
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(isoString) {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}
