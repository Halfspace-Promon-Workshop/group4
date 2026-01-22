import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Header from './components/Header'
import InputSelector from './components/InputSelector'
import DescriptionInput from './components/DescriptionInput'
import APKUpload from './components/APKUpload'
import RoleSelector from './components/RoleSelector'
import AnalysisProgress from './components/AnalysisProgress'
import SecurityBrief from './components/SecurityBrief'
import AnalysisHistory from './components/AnalysisHistory'
import InsightDashboard from './components/insight/InsightDashboard'
import { analyzeDescription, analyzeAPK } from './api/analyze'
import { saveAnalysis, getAnalysisHistory } from './utils/analysisHistory'

function MainApp() {
  const [inputMode, setInputMode] = useState('description')
  const [description, setDescription] = useState('')
  const [appName, setAppName] = useState('')
  const [apkFile, setApkFile] = useState(null)
  const [targetAudience, setTargetAudience] = useState('sales')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [stages, setStages] = useState([])
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [showHistory, setShowHistory] = useState(false)
  
  const navigate = useNavigate()
  const location = useLocation()
  
  // Check if we're coming back from Insight with a result to view
  useEffect(() => {
    if (location.state?.result && location.state?.viewResult) {
      setResult(location.state.result)
      // Clear the state so refresh shows the form
      window.history.replaceState({}, document.title)
      // Scroll to top
      window.scrollTo(0, 0)
    }
  }, [location.state])
  
  // Check if there's history
  const hasHistory = getAnalysisHistory().length > 0

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setError(null)
    setResult(null)
    
    setStages([
      { stage: 1, name: 'Inferring Capabilities', status: 'pending' },
      { stage: 2, name: 'Analyzing Attack Surface', status: 'pending' },
      { stage: 3, name: 'Mapping Promon Protections', status: 'pending' },
      { stage: 4, name: 'Generating Security Brief', status: 'pending' },
    ])

    try {
      let response
      
      const simulateStages = async () => {
        for (let i = 1; i <= 4; i++) {
          setStages(prev => prev.map(s => 
            s.stage === i ? { ...s, status: 'in_progress' } : 
            s.stage < i ? { ...s, status: 'completed' } : s
          ))
          await new Promise(r => setTimeout(r, 2000 + Math.random() * 1000))
        }
      }
      
      const stagePromise = simulateStages()
      
      if (inputMode === 'description') {
        response = await analyzeDescription(description, appName || undefined, targetAudience)
      } else {
        response = await analyzeAPK(apkFile, appName || undefined, targetAudience)
      }
      
      await stagePromise
      
      setStages(prev => prev.map(s => ({ ...s, status: 'completed' })))
      setResult(response)
      
      // Save to history
      saveAnalysis(response)
      
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Analysis failed')
      setStages(prev => prev.map(s => 
        s.status === 'in_progress' ? { ...s, status: 'error' } : s
      ))
    } finally {
      setIsAnalyzing(false)
    }
  }

  const canAnalyze = inputMode === 'description' 
    ? description.trim().length >= 50 
    : apkFile !== null

  const handleReset = () => {
    setResult(null)
    setStages([])
    setError(null)
    window.scrollTo(0, 0)
  }
  
  const handleViewInsight = () => {
    navigate('/insight', { state: { result } })
  }
  
  const handleSelectFromHistory = (selectedResult) => {
    setResult(selectedResult)
    setShowHistory(false)
    window.scrollTo(0, 0)
  }

  return (
    <div className="app">
      <Header />
      
      {!result && (
        <>
          {/* History Button */}
          {hasHistory && (
            <div className="history-button-container">
              <button 
                className="btn btn--secondary history-button"
                onClick={() => setShowHistory(true)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                View Previous Analyses
              </button>
            </div>
          )}
          
          <InputSelector 
            mode={inputMode} 
            onChange={setInputMode} 
            disabled={isAnalyzing}
          />
          
          <div className="card">
            {inputMode === 'description' ? (
              <DescriptionInput
                value={description}
                onChange={setDescription}
                appName={appName}
                onAppNameChange={setAppName}
                onAnalyze={handleAnalyze}
                canAnalyze={canAnalyze}
                isAnalyzing={isAnalyzing}
              />
            ) : (
              <APKUpload
                file={apkFile}
                onFileChange={setApkFile}
                appName={appName}
                onAppNameChange={setAppName}
                onAnalyze={handleAnalyze}
                canAnalyze={canAnalyze}
                isAnalyzing={isAnalyzing}
              />
            )}
          </div>
          
          <div className="card">
            <RoleSelector
              value={targetAudience}
              onChange={setTargetAudience}
              disabled={isAnalyzing}
            />
          </div>
          
          {(isAnalyzing || stages.length > 0) && (
            <AnalysisProgress stages={stages} />
          )}
          
          {error && (
            <div className="error">
              <div className="error__title">Analysis Error</div>
              <div>{error}</div>
            </div>
          )}
        </>
      )}
      
      {result && (
        <SecurityBrief 
          result={result} 
          onReset={handleReset}
          onViewInsight={handleViewInsight}
        />
      )}
      
      {/* History Modal */}
      {showHistory && (
        <AnalysisHistory 
          onSelectAnalysis={handleSelectFromHistory}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/insight" element={<InsightDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
