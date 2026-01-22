/**
 * Stacked Area Chart for showing Android vs iOS trends
 */

function StackedAreaChart({ data, height = 300 }) {
  if (!data || data.length === 0) return null

  const padding = { top: 30, right: 20, bottom: 40, left: 50 }
  const width = 700
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  // Calculate max value
  const maxValue = Math.max(...data.map(d => d.total)) * 1.1

  // Scale functions
  const xScale = (index) => padding.left + (index / (data.length - 1)) * chartWidth
  const yScale = (value) => padding.top + chartHeight - (value / maxValue) * chartHeight

  // Generate paths for stacked areas
  // iOS is on top (total), Android is on bottom
  const totalPath = data.map((d, i) => {
    const x = xScale(i)
    const y = yScale(d.total)
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
  }).join(' ') + ` L ${xScale(data.length - 1)} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`

  const androidPath = data.map((d, i) => {
    const x = xScale(i)
    const y = yScale(d.android)
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
  }).join(' ') + ` L ${xScale(data.length - 1)} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`

  // Line paths
  const totalLine = data.map((d, i) => {
    const x = xScale(i)
    const y = yScale(d.total)
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
  }).join(' ')

  const androidLine = data.map((d, i) => {
    const x = xScale(i)
    const y = yScale(d.android)
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
  }).join(' ')

  return (
    <div className="stacked-area-chart">
      <svg viewBox={`0 0 ${width} ${height}`} className="stacked-area-chart__svg">
        {/* Grid lines */}
        {[0, 100, 200, 300, 400, 500].map(tick => (
          <line
            key={tick}
            x1={padding.left}
            y1={yScale(tick)}
            x2={width - padding.right}
            y2={yScale(tick)}
            stroke="#e5e7eb"
            strokeWidth="1"
            strokeDasharray="4"
          />
        ))}

        {/* iOS area (total - rendered first, behind) */}
        <path d={totalPath} fill="#10b98140" />
        
        {/* Android area (on top) */}
        <path d={androidPath} fill="#6366f1" />

        {/* Lines */}
        <path d={totalLine} fill="none" stroke="#10b981" strokeWidth="2" />
        <path d={androidLine} fill="none" stroke="#6366f1" strokeWidth="2" />

        {/* Data points and labels */}
        {data.map((d, i) => (
          <g key={i}>
            {/* Total point */}
            <circle cx={xScale(i)} cy={yScale(d.total)} r="4" fill="#10b981" />
            <text 
              x={xScale(i)} 
              y={yScale(d.total) - 10} 
              textAnchor="middle" 
              className="stacked-area-chart__value"
            >
              {d.total}
            </text>
            
            {/* X-axis label */}
            <text 
              x={xScale(i)} 
              y={height - 10} 
              textAnchor="middle" 
              className="stacked-area-chart__label"
            >
              {d.week}
            </text>
          </g>
        ))}

        {/* Y-axis labels */}
        {[0, 100, 200, 300, 400, 500].filter(t => t <= maxValue).map(tick => (
          <text
            key={tick}
            x={padding.left - 10}
            y={yScale(tick)}
            textAnchor="end"
            alignmentBaseline="middle"
            className="stacked-area-chart__label"
          >
            {tick}
          </text>
        ))}
      </svg>

      {/* Legend */}
      <div className="stacked-area-chart__legend">
        <div className="stacked-area-chart__legend-item">
          <span className="stacked-area-chart__legend-line" style={{ backgroundColor: '#6366f1' }}></span>
          <span>—○—</span>
          <span>Total</span>
        </div>
        <div className="stacked-area-chart__legend-item">
          <span className="stacked-area-chart__legend-line" style={{ backgroundColor: '#6366f1' }}></span>
          <span>Android</span>
        </div>
        <div className="stacked-area-chart__legend-item">
          <span className="stacked-area-chart__legend-line" style={{ backgroundColor: '#10b981' }}></span>
          <span>iOS</span>
        </div>
      </div>
    </div>
  )
}

export default StackedAreaChart
