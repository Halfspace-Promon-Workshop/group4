/**
 * SVG World Map showing threat density by region
 * Uses simplified but recognizable country/continent paths
 */

function ThreatMap({ regions }) {
  // Get color intensity based on threat level (0-1)
  const getRegionColor = (intensity) => {
    if (intensity >= 0.8) return '#059669' // High - dark teal
    if (intensity >= 0.5) return '#10b981' // Medium-high
    if (intensity >= 0.3) return '#34d399' // Medium
    if (intensity >= 0.15) return '#6ee7b7' // Low-medium
    return '#d1d5db' // No data - gray
  }

  return (
    <div className="threat-map">
      <h3 className="threat-map__title">Global threat map</h3>
      <div className="threat-map__container">
        <svg viewBox="0 0 1000 500" className="threat-map__svg" preserveAspectRatio="xMidYMid meet">
          {/* Background */}
          <rect width="1000" height="500" fill="#f9fafb" />
          
          {/* North America - USA */}
          <path
            d="M120,120 L180,100 L220,105 L250,120 L270,140 L260,180 L240,200 L200,210 L160,200 L130,180 L100,160 L90,140 Z"
            fill={getRegionColor(regions?.northAmerica?.intensity || 0.4)}
            stroke="#fff"
            strokeWidth="1"
          />
          {/* Canada */}
          <path
            d="M100,60 L150,50 L200,55 L250,60 L280,80 L270,110 L250,120 L200,115 L150,100 L110,90 L90,80 Z"
            fill={getRegionColor(regions?.northAmerica?.intensity || 0.4)}
            stroke="#fff"
            strokeWidth="1"
          />
          {/* Alaska */}
          <path
            d="M50,70 L80,60 L100,70 L90,90 L60,95 Z"
            fill={getRegionColor(regions?.northAmerica?.intensity || 0.4)}
            stroke="#fff"
            strokeWidth="1"
          />
          {/* Mexico */}
          <path
            d="M130,200 L160,200 L180,220 L170,260 L140,270 L120,250 L110,220 Z"
            fill={getRegionColor(regions?.northAmerica?.intensity || 0.35)}
            stroke="#fff"
            strokeWidth="1"
          />
          
          {/* Central America */}
          <path
            d="M170,270 L190,275 L200,300 L180,310 L165,295 Z"
            fill={getRegionColor(regions?.southAmerica?.intensity || 0.25)}
            stroke="#fff"
            strokeWidth="1"
          />
          
          {/* South America - Brazil */}
          <path
            d="M220,320 L280,310 L310,340 L300,400 L260,430 L220,420 L200,380 L210,340 Z"
            fill={getRegionColor(regions?.southAmerica?.intensity || 0.3)}
            stroke="#fff"
            strokeWidth="1"
          />
          {/* Argentina/Chile */}
          <path
            d="M220,420 L250,430 L240,480 L210,490 L200,460 L210,440 Z"
            fill={getRegionColor(regions?.southAmerica?.intensity || 0.25)}
            stroke="#fff"
            strokeWidth="1"
          />
          {/* Colombia/Venezuela */}
          <path
            d="M200,300 L250,290 L270,310 L260,330 L220,320 L200,310 Z"
            fill={getRegionColor(regions?.southAmerica?.intensity || 0.3)}
            stroke="#fff"
            strokeWidth="1"
          />
          
          {/* Europe - Western */}
          <path
            d="M440,100 L470,90 L500,95 L510,120 L500,150 L470,160 L440,150 L430,120 Z"
            fill={getRegionColor(regions?.europe?.intensity || 0.5)}
            stroke="#fff"
            strokeWidth="1"
          />
          {/* UK/Ireland */}
          <path
            d="M420,90 L440,85 L445,110 L435,125 L420,115 Z"
            fill={getRegionColor(regions?.europe?.intensity || 0.55)}
            stroke="#fff"
            strokeWidth="1"
          />
          {/* Scandinavia */}
          <path
            d="M480,50 L510,45 L530,60 L520,100 L490,95 L475,70 Z"
            fill={getRegionColor(regions?.europe?.intensity || 0.45)}
            stroke="#fff"
            strokeWidth="1"
          />
          {/* Eastern Europe */}
          <path
            d="M510,100 L550,95 L570,120 L560,160 L530,165 L510,150 L505,120 Z"
            fill={getRegionColor(regions?.europe?.intensity || 0.5)}
            stroke="#fff"
            strokeWidth="1"
          />
          {/* Spain/Portugal */}
          <path
            d="M420,150 L450,145 L460,170 L440,185 L415,175 Z"
            fill={getRegionColor(regions?.europe?.intensity || 0.45)}
            stroke="#fff"
            strokeWidth="1"
          />
          {/* Italy */}
          <path
            d="M475,155 L490,150 L500,180 L485,200 L470,185 Z"
            fill={getRegionColor(regions?.europe?.intensity || 0.5)}
            stroke="#fff"
            strokeWidth="1"
          />
          
          {/* Russia */}
          <path
            d="M570,50 L700,40 L820,50 L880,70 L900,100 L880,140 L800,150 L700,145 L600,140 L570,120 L560,80 Z"
            fill={getRegionColor(regions?.russia?.intensity || 0.9)}
            stroke="#fff"
            strokeWidth="1"
          />
          {/* Russia Far East */}
          <path
            d="M880,70 L950,80 L970,120 L950,160 L900,150 L880,140 L890,100 Z"
            fill={getRegionColor(regions?.russia?.intensity || 0.85)}
            stroke="#fff"
            strokeWidth="1"
          />
          
          {/* Middle East */}
          <path
            d="M540,180 L590,175 L620,200 L610,240 L570,250 L540,230 L530,200 Z"
            fill={getRegionColor(regions?.asia?.intensity || 0.6)}
            stroke="#fff"
            strokeWidth="1"
          />
          {/* Saudi Arabia */}
          <path
            d="M560,240 L600,235 L620,270 L590,290 L555,280 Z"
            fill={getRegionColor(regions?.asia?.intensity || 0.55)}
            stroke="#fff"
            strokeWidth="1"
          />
          
          {/* Africa - North */}
          <path
            d="M420,190 L500,185 L530,200 L540,240 L500,260 L440,250 L410,220 Z"
            fill={getRegionColor(regions?.africa?.intensity || 0.2)}
            stroke="#fff"
            strokeWidth="1"
          />
          {/* Central/East Africa */}
          <path
            d="M480,260 L540,270 L560,320 L530,370 L480,380 L450,340 L460,290 Z"
            fill={getRegionColor(regions?.africa?.intensity || 0.25)}
            stroke="#fff"
            strokeWidth="1"
          />
          {/* West Africa */}
          <path
            d="M400,260 L450,250 L460,290 L440,320 L400,310 L385,280 Z"
            fill={getRegionColor(regions?.africa?.intensity || 0.2)}
            stroke="#fff"
            strokeWidth="1"
          />
          {/* South Africa */}
          <path
            d="M480,380 L530,370 L540,420 L510,450 L470,440 L460,400 Z"
            fill={getRegionColor(regions?.africa?.intensity || 0.3)}
            stroke="#fff"
            strokeWidth="1"
          />
          
          {/* India */}
          <path
            d="M650,200 L700,190 L720,230 L700,290 L660,300 L640,260 L635,220 Z"
            fill={getRegionColor(regions?.asia?.intensity || 0.7)}
            stroke="#fff"
            strokeWidth="1"
          />
          
          {/* China */}
          <path
            d="M720,140 L800,130 L850,160 L840,220 L780,240 L720,230 L700,190 L710,160 Z"
            fill={getRegionColor(regions?.asia?.intensity || 0.75)}
            stroke="#fff"
            strokeWidth="1"
          />
          
          {/* Southeast Asia */}
          <path
            d="M750,260 L800,250 L830,290 L810,340 L760,350 L740,310 Z"
            fill={getRegionColor(regions?.asia?.intensity || 0.65)}
            stroke="#fff"
            strokeWidth="1"
          />
          
          {/* Japan */}
          <path
            d="M880,160 L900,155 L910,190 L895,220 L875,210 L870,180 Z"
            fill={getRegionColor(regions?.asia?.intensity || 0.7)}
            stroke="#fff"
            strokeWidth="1"
          />
          
          {/* Korea */}
          <path
            d="M855,175 L870,170 L875,200 L860,210 L850,195 Z"
            fill={getRegionColor(regions?.asia?.intensity || 0.65)}
            stroke="#fff"
            strokeWidth="1"
          />
          
          {/* Indonesia */}
          <path
            d="M780,350 L850,340 L890,360 L870,390 L810,400 L770,380 Z"
            fill={getRegionColor(regions?.asia?.intensity || 0.5)}
            stroke="#fff"
            strokeWidth="1"
          />
          
          {/* Australia */}
          <path
            d="M820,400 L900,390 L950,420 L940,470 L880,490 L820,470 L800,430 Z"
            fill={getRegionColor(regions?.oceania?.intensity || 0.15)}
            stroke="#fff"
            strokeWidth="1"
          />
          
          {/* New Zealand */}
          <path
            d="M960,450 L975,445 L980,475 L965,485 L955,470 Z"
            fill={getRegionColor(regions?.oceania?.intensity || 0.1)}
            stroke="#fff"
            strokeWidth="1"
          />
          
          {/* Greenland */}
          <path
            d="M320,30 L380,25 L400,50 L380,80 L340,85 L310,60 Z"
            fill={getRegionColor(0.1)}
            stroke="#fff"
            strokeWidth="1"
          />
        </svg>
        
        {/* Legend */}
        <div className="threat-map__legend">
          <div className="threat-map__legend-item">
            <span className="threat-map__legend-color" style={{ backgroundColor: '#059669' }}></span>
            <span>High (874+)</span>
          </div>
          <div className="threat-map__legend-bar">
            <div className="threat-map__legend-gradient"></div>
          </div>
          <div className="threat-map__legend-item">
            <span className="threat-map__legend-color" style={{ backgroundColor: '#d1fae5' }}></span>
            <span>Low (1)</span>
          </div>
        </div>
        
        {/* Region labels */}
        <div className="threat-map__labels">
          <span className="threat-map__label" style={{ left: '15%', top: '25%' }}>North America</span>
          <span className="threat-map__label" style={{ left: '22%', top: '70%' }}>South America</span>
          <span className="threat-map__label" style={{ left: '45%', top: '25%' }}>Europe</span>
          <span className="threat-map__label" style={{ left: '45%', top: '55%' }}>Africa</span>
          <span className="threat-map__label" style={{ left: '70%', top: '15%' }}>Russia</span>
          <span className="threat-map__label" style={{ left: '72%', top: '45%' }}>Asia</span>
          <span className="threat-map__label" style={{ left: '85%', top: '80%' }}>Oceania</span>
        </div>
      </div>
    </div>
  )
}

export default ThreatMap
