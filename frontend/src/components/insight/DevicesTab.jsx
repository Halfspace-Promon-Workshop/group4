import StackedAreaChart from './charts/StackedAreaChart'
import DonutChart from './charts/DonutChart'

function DevicesTab({ data }) {
  const weeklyDevices = data.weeklyDevices || []
  const totalDevices = data.totalDevices || 7248
  const devicesByOS = data.devicesByOS || { android: 65, ios: 35 }

  // Prepare data for donut charts
  const topAppsData = [
    { label: 'com.promon.sales_demo_A', value: 70 },
    { label: 'com.promon.sales_demo_B', value: 30 }
  ]

  const osData = [
    { label: 'Android', value: devicesByOS.android },
    { label: 'iOS', value: devicesByOS.ios }
  ]

  return (
    <div className="devices-tab">
      {/* Trending Active Devices */}
      <div className="devices-tab__trending">
        <div className="devices-tab__header">
          <h3 className="devices-tab__title">Trending active devices</h3>
          <div className="devices-tab__total">
            Total count <strong>{(totalDevices / 1000).toFixed(3)}K</strong>
          </div>
        </div>
        
        <div className="devices-tab__chart">
          <StackedAreaChart data={weeklyDevices} height={320} />
        </div>
      </div>

      {/* Bottom Row - Donut Charts */}
      <div className="devices-tab__bottom-row">
        {/* Top 5 Apps */}
        <div className="devices-tab__card">
          <h3 className="devices-tab__card-title">Top 5 Apps by device count</h3>
          <DonutChart 
            data={topAppsData} 
            size={180}
            colors={['#6366f1', '#10b981']}
          />
        </div>

        {/* Devices per OS */}
        <div className="devices-tab__card">
          <h3 className="devices-tab__card-title">Devices per OS</h3>
          <DonutChart 
            data={osData} 
            size={180}
            colors={['#6366f1', '#10b981']}
          />
        </div>
      </div>
    </div>
  )
}

export default DevicesTab
