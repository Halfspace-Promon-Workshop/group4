const ROLES = [
  {
    id: 'sales',
    label: 'Sales / Account Executive',
    description: 'Balanced technical and business focus for customer meetings',
    icon: '💼'
  },
  {
    id: 'executive',
    label: 'Executive / C-Suite',
    description: 'Strategic focus with financial impact and ROI emphasis',
    icon: '👔'
  },
  {
    id: 'technical',
    label: 'Technical / Security Engineer',
    description: 'Deep technical details, attack techniques, and implementation',
    icon: '🔧'
  },
  {
    id: 'compliance',
    label: 'Compliance / Risk Manager',
    description: 'Regulatory focus with framework mapping and audit support',
    icon: '📋'
  }
]

function RoleSelector({ value, onChange, disabled }) {
  return (
    <div className="role-selector">
      <label className="form-label">
        Report Audience
        <span className="form-label--hint">The report will be tailored to this audience</span>
      </label>
      <div className="role-selector__options">
        {ROLES.map(role => (
          <button
            key={role.id}
            type="button"
            className={`role-selector__option ${value === role.id ? 'role-selector__option--active' : ''}`}
            onClick={() => onChange(role.id)}
            disabled={disabled}
          >
            <span className="role-selector__icon">{role.icon}</span>
            <div className="role-selector__content">
              <span className="role-selector__label">{role.label}</span>
              <span className="role-selector__desc">{role.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default RoleSelector
