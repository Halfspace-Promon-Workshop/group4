import axios from 'axios'

const API_BASE = '/api'

/**
 * Analyze an app from its description
 * @param {string} description - App description text
 * @param {string} [appName] - Optional app name
 * @param {string} [targetAudience] - Target audience (technical/executive/sales/compliance)
 * @returns {Promise<Object>} Security brief response
 */
export async function analyzeDescription(description, appName, targetAudience = 'sales') {
  const response = await axios.post(`${API_BASE}/analyze/description`, {
    description,
    app_name: appName,
    platform: 'Android',
    target_audience: targetAudience
  })
  return response.data
}

/**
 * Analyze an app from its APK file
 * @param {File} file - APK file
 * @param {string} [appName] - Optional app name override
 * @param {string} [targetAudience] - Target audience (technical/executive/sales/compliance)
 * @returns {Promise<Object>} Security brief response
 */
export async function analyzeAPK(file, appName, targetAudience = 'sales') {
  const formData = new FormData()
  formData.append('file', file)
  if (appName) {
    formData.append('app_name', appName)
  }
  formData.append('target_audience', targetAudience)
  
  const response = await axios.post(`${API_BASE}/analyze/apk`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

/**
 * Get APK metadata without full analysis
 * @param {File} file - APK file
 * @returns {Promise<Object>} APK metadata
 */
export async function getAPKMetadata(file) {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await axios.get(`${API_BASE}/analyze/apk/metadata`, {
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

/**
 * Check API health
 * @returns {Promise<Object>} Health status
 */
export async function checkHealth() {
  const response = await axios.get(`${API_BASE}/health`)
  return response.data
}
