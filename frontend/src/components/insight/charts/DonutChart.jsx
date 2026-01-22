/**
 * Simple SVG Donut Chart
 */

function DonutChart({ data, size = 200, colors = ['#6366f1', '#10b981'] }) {
  if (!data || data.length === 0) return null

  const total = data.reduce((sum, item) => sum + item.value, 0)
  const center = size / 2
  const radius = size * 0.35
  const innerRadius = radius * 0.6

  let currentAngle = -90 // Start from top

  const segments = data.map((item, index) => {
    const percentage = item.value / total
    const angle = percentage * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    currentAngle = endAngle

    const startAngleRad = (startAngle * Math.PI) / 180
    const endAngleRad = (endAngle * Math.PI) / 180

    const x1 = center + radius * Math.cos(startAngleRad)
    const y1 = center + radius * Math.sin(startAngleRad)
    const x2 = center + radius * Math.cos(endAngleRad)
    const y2 = center + radius * Math.sin(endAngleRad)

    const x3 = center + innerRadius * Math.cos(endAngleRad)
    const y3 = center + innerRadius * Math.sin(endAngleRad)
    const x4 = center + innerRadius * Math.cos(startAngleRad)
    const y4 = center + innerRadius * Math.sin(startAngleRad)

    const largeArc = angle > 180 ? 1 : 0

    const path = `
      M ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}
      Z
    `

    // Calculate label position
    const midAngle = ((startAngle + endAngle) / 2 * Math.PI) / 180
    const labelRadius = radius * 1.4
    const labelX = center + labelRadius * Math.cos(midAngle)
    const labelY = center + labelRadius * Math.sin(midAngle)

    return {
      path,
      color: colors[index % colors.length],
      label: item.label,
      value: item.value,
      percentage: Math.round(percentage * 100),
      labelX,
      labelY,
      textAnchor: labelX > center ? 'start' : 'end'
    }
  })

  return (
    <div className="donut-chart">
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        {segments.map((segment, index) => (
          <path
            key={index}
            d={segment.path}
            fill={segment.color}
            stroke="#fff"
            strokeWidth="2"
          />
        ))}
      </svg>
      <div className="donut-chart__legend">
        {segments.map((segment, index) => (
          <div key={index} className="donut-chart__legend-item">
            <span 
              className="donut-chart__legend-color" 
              style={{ backgroundColor: segment.color }}
            ></span>
            <span className="donut-chart__legend-label">{segment.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DonutChart
