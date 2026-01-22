function StatCard({ title, value, highlighted = false, trend = null }) {
  return (
    <div className={`stat-card ${highlighted ? 'stat-card--highlighted' : ''}`}>
      <div className="stat-card__title">{title}</div>
      <div className="stat-card__value">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      {trend && (
        <div className={`stat-card__trend stat-card__trend--${trend.direction}`}>
          {trend.direction === 'up' ? '↑' : '↓'} {trend.value}%
        </div>
      )}
    </div>
  )
}

export default StatCard
