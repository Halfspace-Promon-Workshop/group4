import AreaChart from './charts/AreaChart'

function EventsTab({ data }) {
  const dailyIngest = data.dailyIngest || []
  const latestEvents = data.latestEvents || []
  const totalVolume = data.dailyIngestTotal || 118559

  return (
    <div className="events-tab">
      {/* Daily Ingest Chart */}
      <div className="events-tab__chart-section">
        <div className="events-tab__chart-header">
          <h3 className="events-tab__title">Daily ingest</h3>
          <div className="events-tab__total">
            Total volume <strong>{(totalVolume / 1000).toFixed(3)}K</strong>
          </div>
        </div>
        
        <div className="events-tab__chart">
          <AreaChart 
            data={dailyIngest} 
            height={300}
            color="#6366f1"
          />
        </div>
        
        {/* Timeline scrubber mock */}
        <div className="events-tab__timeline">
          <div className="events-tab__timeline-track">
            <div className="events-tab__timeline-range" style={{ left: '70%', width: '20%' }}></div>
          </div>
        </div>
      </div>

      {/* Latest Events Table */}
      <div className="events-tab__table-section">
        <h3 className="events-tab__title">Latest events</h3>
        
        <div className="events-tab__table-container">
          <table className="events-tab__table">
            <thead>
              <tr>
                <th>Device Slug</th>
                <th>Version</th>
                <th>OS</th>
                <th>Result</th>
                <th>Event</th>
                <th>Timestamp</th>
                <th>Shield Ve</th>
              </tr>
            </thead>
            <tbody>
              {latestEvents.map((event) => (
                <tr key={event.id}>
                  <td>
                    <div className="events-tab__device">
                      <span className="events-tab__device-badge">
                        {event.deviceSlug.split('-').map(w => w[0].toUpperCase()).join('')}
                      </span>
                      <div className="events-tab__device-info">
                        <span className="events-tab__device-slug">{event.deviceSlug}</span>
                        <span className="events-tab__device-package">{event.packageName}</span>
                      </div>
                    </div>
                  </td>
                  <td>{event.version}</td>
                  <td>{event.os}</td>
                  <td>
                    <span className={`events-tab__result events-tab__result--${event.result.toLowerCase()}`}>
                      {event.result}
                    </span>
                  </td>
                  <td>
                    <span className="events-tab__event-type">
                      <span className={`events-tab__event-indicator events-tab__event-indicator--${event.result.toLowerCase()}`}></span>
                      {event.eventType}
                    </span>
                  </td>
                  <td>{event.timestamp}</td>
                  <td>{event.shieldVersion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default EventsTab
