/**
 * Generates mock Insight dashboard data based on analysis results
 * Combines static benchmarks with generated statistics from the analysis
 */

// Static benchmark data (based on real Insight screenshots)
const STATIC_BENCHMARKS = {
  totalThreats: 67370,
  severeThreats: 12277,
  appsShielded: 2,
  liveDays: 906,
  
  // Threat distribution
  threatIndicators: {
    rootingJailbreak: { count: 33685, percentage: 50 },
    emulator: { count: 2479, percentage: 4 },
    hookingFramework: { count: 2454, percentage: 4 },
    debugger: { count: 2438, percentage: 4 },
    repackaging: { count: 2390, percentage: 4 },
    developerOptions: { count: 2321, percentage: 3 },
    installedPackages: { count: 1364, percentage: 2 }
  },
  
  // Regional threat data for the map
  regions: {
    northAmerica: { threats: 8420, intensity: 0.4 },
    southAmerica: { threats: 5230, intensity: 0.3 },
    europe: { threats: 12450, intensity: 0.5 },
    russia: { threats: 18900, intensity: 0.9 },
    asia: { threats: 15600, intensity: 0.7 },
    africa: { threats: 3200, intensity: 0.2 },
    oceania: { threats: 2100, intensity: 0.15 }
  },
  
  // Daily ingest data (last 180 days)
  dailyIngestTotal: 118559,
  
  // Device stats
  totalDevices: 7248,
  devicesByOS: {
    android: 65,
    ios: 35
  }
}

// Map attack vectors to Insight threat categories
const ATTACK_TO_THREAT_MAPPING = {
  'rooting': 'rootingJailbreak',
  'jailbreak': 'rootingJailbreak',
  'root': 'rootingJailbreak',
  'emulator': 'emulator',
  'simulator': 'emulator',
  'hook': 'hookingFramework',
  'frida': 'hookingFramework',
  'xposed': 'hookingFramework',
  'debug': 'debugger',
  'repackag': 'repackaging',
  'tamper': 'repackaging',
  'clone': 'repackaging',
  'reverse': 'repackaging'
}

/**
 * Generate insight data from analysis results
 */
export function generateInsightData(analysisResult) {
  const baseData = { ...STATIC_BENCHMARKS }
  
  if (!analysisResult) {
    return {
      ...baseData,
      matchedThreats: [],
      correlations: [],
      dailyIngest: generateDailyIngestData(),
      weeklyDevices: generateWeeklyDeviceData(),
      latestEvents: generateMockEvents(analysisResult?.app_name || 'Demo App')
    }
  }
  
  // Find which threats from analysis match Insight categories
  const matchedThreats = findMatchingThreats(analysisResult)
  
  // Generate correlations between analysis and Insight data
  const correlations = generateCorrelations(analysisResult, matchedThreats)
  
  // Adjust some numbers based on analysis severity
  const riskMultiplier = getRiskMultiplier(analysisResult.attack_surface?.overall_risk_level)
  
  return {
    ...baseData,
    // Slightly adjust numbers based on app's risk profile
    totalThreats: Math.round(baseData.totalThreats * (0.9 + riskMultiplier * 0.2)),
    severeThreats: Math.round(baseData.severeThreats * (0.85 + riskMultiplier * 0.3)),
    matchedThreats,
    correlations,
    dailyIngest: generateDailyIngestData(),
    weeklyDevices: generateWeeklyDeviceData(),
    latestEvents: generateMockEvents(analysisResult.app_name)
  }
}

/**
 * Find attack vectors that match Insight threat categories
 */
function findMatchingThreats(analysisResult) {
  const matched = []
  const attackVectors = analysisResult.attack_surface?.attack_vectors || []
  
  for (const vector of attackVectors) {
    const vectorNameLower = vector.name.toLowerCase()
    const vectorDescLower = vector.description.toLowerCase()
    
    for (const [keyword, threatCategory] of Object.entries(ATTACK_TO_THREAT_MAPPING)) {
      if (vectorNameLower.includes(keyword) || vectorDescLower.includes(keyword)) {
        const benchmark = STATIC_BENCHMARKS.threatIndicators[threatCategory]
        if (benchmark && !matched.find(m => m.category === threatCategory)) {
          matched.push({
            category: threatCategory,
            attackVector: vector.name,
            count: benchmark.count,
            percentage: benchmark.percentage,
            likelihood: vector.likelihood
          })
        }
      }
    }
  }
  
  return matched
}

/**
 * Generate correlation messages between analysis and Insight data
 */
function generateCorrelations(analysisResult, matchedThreats) {
  const correlations = []
  
  for (const match of matchedThreats) {
    const categoryLabels = {
      rootingJailbreak: 'Rooting/Jailbreak',
      emulator: 'Emulator',
      hookingFramework: 'Hooking Framework',
      debugger: 'Debugger',
      repackaging: 'Repackaging',
      developerOptions: 'Developer Options',
      installedPackages: 'Installed Packages'
    }
    
    correlations.push({
      analysisRisk: match.attackVector,
      insightCategory: categoryLabels[match.category],
      insightCount: match.count,
      message: `Your "${match.attackVector}" risk correlates with ${match.count.toLocaleString()} ${categoryLabels[match.category]} threats detected across protected apps.`
    })
  }
  
  // Add general correlation if we have attack vectors but no direct matches
  if (correlations.length === 0 && analysisResult.attack_surface?.attack_vectors?.length > 0) {
    correlations.push({
      analysisRisk: 'General Mobile Threats',
      insightCategory: 'All Categories',
      insightCount: STATIC_BENCHMARKS.totalThreats,
      message: `Your app faces similar threat patterns to the ${STATIC_BENCHMARKS.totalThreats.toLocaleString()} total threats we've detected across all protected apps.`
    })
  }
  
  return correlations
}

/**
 * Get risk multiplier based on overall risk level
 */
function getRiskMultiplier(riskLevel) {
  switch (riskLevel) {
    case 'Critical': return 1.0
    case 'High': return 0.75
    case 'Medium': return 0.5
    case 'Low': return 0.25
    default: return 0.5
  }
}

/**
 * Generate mock daily ingest data for the chart
 */
function generateDailyIngestData() {
  const data = []
  const now = new Date()
  
  for (let i = 180; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    // Base value with some seasonality
    let value = 100 + Math.sin(i / 30) * 30
    
    // Add some random noise
    value += (Math.random() - 0.5) * 40
    
    // Spike around holidays (simulate increased activity)
    if (i < 30 && i > 15) {
      value *= 1.5
    }
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(Math.max(50, value))
    })
  }
  
  return data
}

/**
 * Generate weekly device trend data
 */
function generateWeeklyDeviceData() {
  return [
    { week: 'W1', total: 110, android: 72, ios: 38 },
    { week: 'W2', total: 254, android: 165, ios: 89 },
    { week: 'W3', total: 467, android: 304, ios: 163 },
    { week: 'W4', total: 283, android: 184, ios: 99 },
    { week: 'W5', total: 301, android: 196, ios: 105 },
    { week: 'W6', total: 294, android: 191, ios: 103 }
  ]
}

/**
 * Generate mock event log entries
 */
function generateMockEvents(appName = 'Demo App') {
  const events = []
  const eventTypes = ['Rooted/Jailbroken', 'Repackaging', 'Debugger', 'Hooking Framework', 'Emulator']
  const deviceSlugs = [
    'blind-magenta-gayal',
    'swift-azure-falcon',
    'calm-crimson-wolf',
    'bold-emerald-tiger',
    'quiet-golden-bear'
  ]
  const osOptions = ['iOS', 'Android']
  const now = new Date()
  
  for (let i = 0; i < 10; i++) {
    const eventDate = new Date(now)
    eventDate.setMinutes(eventDate.getMinutes() - i * 15)
    
    events.push({
      id: i + 1,
      deviceSlug: deviceSlugs[i % deviceSlugs.length],
      packageName: `com.${appName.toLowerCase().replace(/\s+/g, '.')}.app`,
      version: '1.24',
      os: osOptions[Math.floor(Math.random() * 2)],
      result: Math.random() > 0.3 ? 'FALSE' : 'TRUE',
      eventType: eventTypes[i % eventTypes.length],
      timestamp: eventDate.toLocaleString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }),
      shieldVersion: '7.3.0'
    })
  }
  
  return events
}

export default generateInsightData
