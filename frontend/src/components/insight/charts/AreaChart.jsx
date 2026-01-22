/**
 * Simple SVG Area Chart for displaying time series data
 */

function AreaChart({ data, height = 300, color = '#6366f1' }) {
  if (!data || data.length === 0) return null

  const padding = { top: 20, right: 20, bottom: 40, left: 50 }
  const width = 900
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  // Calculate min/max values
  const values = data.map(d => d.value)
  const minValue = 0
  const maxValue = Math.max(...values) * 1.1

  // Scale functions
  const xScale = (index) => padding.left + (index / (data.length - 1)) * chartWidth
  const yScale = (value) => padding.top + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight

  // Generate path for area
  const areaPath = data.map((d, i) => {
    const x = xScale(i)
    const y = yScale(d.value)
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
  }).join(' ') + ` L ${xScale(data.length - 1)} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`

  // Generate path for line
  const linePath = data.map((d, i) => {
    const x = xScale(i)
    const y = yScale(d.value)
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
  }).join(' ')

  // Y-axis ticks
  const yTicks = [0, 50, 100, 150, 200, 250]

  // X-axis labels (show every 30 days)
  const xLabels = data.filter((_, i) => i % 30 === 0 || i === data.length - 1)

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="area-chart">
      {/* Grid lines */}
      {yTicks.map(tick => (
        <line
          key={tick}
          x1={padding.left}
          y1={yScale(tick)}
          x2={width - padding.right}
          y2={yScale(tick)}
          stroke="#e5e7eb"
          strokeWidth="1"
        />
      ))}

      {/* Area fill */}
      <path
        d={areaPath}
        fill={`${color}20`}
      />

      {/* Line */}
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="2"
      />

      {/* Y-axis labels */}
      {yTicks.map(tick => (
        <text
          key={tick}
          x={padding.left - 10}
          y={yScale(tick)}
          textAnchor="end"
          alignmentBaseline="middle"
          className="area-chart__label"
        >
          {tick}
        </text>
      ))}

      {/* X-axis labels */}
      {xLabels.map((d, i) => {
        const index = data.indexOf(d)
        return (
          <text
            key={i}
            x={xScale(index)}
            y={height - 10}
            textAnchor="middle"
            className="area-chart__label"
          >
            {d.date.slice(0, 10)}
          </text>
        )
      })}
    </svg>
  )
}

export default AreaChart
