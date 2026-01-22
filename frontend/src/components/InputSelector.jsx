function InputSelector({ mode, onChange, disabled }) {
  return (
    <div className="input-selector">
      <button
        className={`input-selector__btn ${mode === 'description' ? 'input-selector__btn--active' : ''}`}
        onClick={() => onChange('description')}
        disabled={disabled}
      >
        <span>📝</span>
        Paste Description
      </button>
      <button
        className={`input-selector__btn ${mode === 'apk' ? 'input-selector__btn--active' : ''}`}
        onClick={() => onChange('apk')}
        disabled={disabled}
      >
        <span>📦</span>
        Upload APK
      </button>
      <button
        className={`input-selector__btn ${mode === 'search' ? 'input-selector__btn--active' : ''}`}
        onClick={() => onChange('search')}
        disabled={disabled}
      >
        <span>🔍</span>
        Search Play Store
      </button>
    </div>
  )
}

export default InputSelector
