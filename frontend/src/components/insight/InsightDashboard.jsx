import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import InsightHeader from './InsightHeader'
import ThreatsTab from './ThreatsTab'
import EventsTab from './EventsTab'
import DevicesTab from './DevicesTab'
import AnalysisComparisonTab from './AnalysisComparisonTab'
import { generateInsightData } from '../../utils/insightDataGenerator'

function InsightDashboard() {
  const [activeTab, setActiveTab] = useState('analysis') // Default to analysis tab
  const location = useLocation()
  const navigate = useNavigate()
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  
  // Get analysis results from navigation state
  const analysisResult = location.state?.result || null
  
  // Generate insight data based on analysis
  const insightData = generateInsightData(analysisResult)
  
  const handleBack = () => {
    navigate('/', { state: { result: analysisResult, viewResult: true } })
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'analysis':
        return <AnalysisComparisonTab data={insightData} analysisResult={analysisResult} />
      case 'threats':
        return <ThreatsTab data={insightData} analysisResult={analysisResult} />
      case 'events':
        return <EventsTab data={insightData} />
      case 'devices':
        return <DevicesTab data={insightData} />
      case 'agent':
        return (
          <div className="insight-tab-placeholder">
            <h3>Agent Configuration</h3>
            <p>Agent settings and SDK integration details would appear here.</p>
          </div>
        )
      default:
        return <AnalysisComparisonTab data={insightData} analysisResult={analysisResult} />
    }
  }

  return (
    <div className="insight-dashboard">
      <InsightHeader 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        appName={analysisResult?.app_name || 'Demo App'}
        onBack={handleBack}
      />
      
      <main className="insight-dashboard__content">
        {renderTab()}
      </main>
    </div>
  )
}

export default InsightDashboard
