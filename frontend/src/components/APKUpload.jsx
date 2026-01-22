import { useState, useRef } from 'react'

function APKUpload({ 
  file, 
  onFileChange, 
  appName, 
  onAppNameChange, 
  onAnalyze, 
  canAnalyze, 
  isAnalyzing 
}) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.name.toLowerCase().endsWith('.apk')) {
      onFileChange(droppedFile)
    }
  }

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      onFileChange(selectedFile)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="apk-upload">
      <h2 className="card__title">Upload APK</h2>
      
      <div className="form-group">
        <label className="form-label">
          App Name Override <span className="form-label--optional">(optional)</span>
        </label>
        <input
          type="text"
          value={appName}
          onChange={(e) => onAppNameChange(e.target.value)}
          placeholder="Leave empty to use name from APK"
          disabled={isAnalyzing}
          className="form-input"
        />
      </div>
      
      <div className="form-group">
        <label className="form-label">APK File</label>
        <div
          className={`apk-upload__dropzone ${isDragging ? 'apk-upload__dropzone--active' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".apk"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            disabled={isAnalyzing}
          />
          
          <div className="apk-upload__icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <p className="apk-upload__text">
            {isDragging 
              ? 'Drop your APK file here' 
              : 'Drag & drop an APK file here, or click to browse'
            }
          </p>
          <p className="apk-upload__hint">Maximum file size: 100MB</p>
        </div>
      </div>
      
      {file && (
        <div className="apk-upload__file">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0052FF" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <div className="apk-upload__fileinfo">
            <span className="apk-upload__filename">{file.name}</span>
            <span className="apk-upload__filesize">{formatFileSize(file.size)}</span>
          </div>
          <button
            className="apk-upload__remove"
            onClick={(e) => {
              e.stopPropagation()
              onFileChange(null)
            }}
            disabled={isAnalyzing}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      )}
      
      <div className="description-input__footer">
        <span></span>
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
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
              Analyze Threats
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default APKUpload
