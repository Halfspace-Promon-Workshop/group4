import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function SecurityBrief({ result, onReset, onViewInsight }) {
  // Extract recommended products from the promon_mapping
  const recommendedProducts = result.promon_mapping?.recommended_products || null
  
  return (
    <div className="security-brief">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 600,
          color: 'var(--text-primary)'
        }}>
          Security Analysis Complete
        </h2>
        <button
          className="btn"
          onClick={onReset}
          style={{
            background: 'var(--bg-tertiary)',
            color: 'var(--text-secondary)',
          }}
        >
          ← New Analysis
        </button>
      </div>
      
      <div className="security-brief__content">
        <div className="markdown">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              table: ({ children }) => (
                <div style={{ overflowX: 'auto' }}>
                  <table>{children}</table>
                </div>
              ),
              a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
            }}
          >
            {result.brief_markdown}
          </ReactMarkdown>
        </div>
      </div>
      
      {/* Recommended Promon Products Section */}
      {recommendedProducts && (
        <div className="products-section">
          <h3 className="products-section__title">
            🛡️ Recommended Promon Products
          </h3>
          
          {/* Essential Products */}
          {recommendedProducts.essential?.length > 0 && (
            <div className="products-category">
              <h4 className="products-category__title products-category__title--essential">
                Essential Products
              </h4>
              <div className="products-grid">
                {recommendedProducts.essential.map((item, idx) => (
                  <div key={idx} className="product-card product-card--essential">
                    <div className="product-card__header">
                      <span className="product-card__badge product-card__badge--essential">Essential</span>
                      <h5 className="product-card__name">{item.product}</h5>
                    </div>
                    <p className="product-card__reason">{item.reason}</p>
                    {item.threats_addressed?.length > 0 && (
                      <div className="product-card__threats">
                        <span className="product-card__threats-label">Addresses:</span>
                        <div className="product-card__tags">
                          {item.threats_addressed.map((threat, tidx) => (
                            <span key={tidx} className="product-card__tag">{threat}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Recommended Products */}
          {recommendedProducts.recommended?.length > 0 && (
            <div className="products-category">
              <h4 className="products-category__title products-category__title--recommended">
                Recommended Additions
              </h4>
              <div className="products-grid">
                {recommendedProducts.recommended.map((item, idx) => (
                  <div key={idx} className="product-card product-card--recommended">
                    <div className="product-card__header">
                      <span className="product-card__badge product-card__badge--recommended">Recommended</span>
                      <h5 className="product-card__name">{item.product}</h5>
                    </div>
                    <p className="product-card__reason">{item.reason}</p>
                    {item.threats_addressed?.length > 0 && (
                      <div className="product-card__threats">
                        <span className="product-card__threats-label">Addresses:</span>
                        <div className="product-card__tags">
                          {item.threats_addressed.map((threat, tidx) => (
                            <span key={tidx} className="product-card__tag">{threat}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Optional Products */}
          {recommendedProducts.optional?.length > 0 && (
            <div className="products-category">
              <h4 className="products-category__title products-category__title--optional">
                Optional Enhancements
              </h4>
              <div className="products-grid">
                {recommendedProducts.optional.map((item, idx) => (
                  <div key={idx} className="product-card product-card--optional">
                    <div className="product-card__header">
                      <span className="product-card__badge product-card__badge--optional">Optional</span>
                      <h5 className="product-card__name">{item.product}</h5>
                    </div>
                    <p className="product-card__reason">{item.reason}</p>
                    {item.threats_addressed?.length > 0 && (
                      <div className="product-card__threats">
                        <span className="product-card__threats-label">Addresses:</span>
                        <div className="product-card__tags">
                          {item.threats_addressed.map((threat, tidx) => (
                            <span key={tidx} className="product-card__tag">{threat}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* View in Insight CTA */}
      <div className="insight-cta">
        <div className="insight-cta__content">
          <div className="insight-cta__icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <div className="insight-cta__text">
            <h3>See How This Compares to Real Threats</h3>
            <p>
              View your analysis in Promon Insight to see how your app's vulnerabilities 
              correlate with threats we detect across {(67370).toLocaleString()} protected app instances.
            </p>
          </div>
          <button className="btn btn--primary btn--large" onClick={onViewInsight}>
            View in Promon Insight
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Analysis Metadata */}
      <div className="analysis-details">
        <h3 className="analysis-details__title">
          Analysis Details
        </h3>
        
        <div className="analysis-details__grid">
          <div className="analysis-details__item">
            <div className="analysis-details__label">App Name</div>
            <div className="analysis-details__value">{result.app_name}</div>
          </div>
          
          <div className="analysis-details__item">
            <div className="analysis-details__label">Platform</div>
            <div className="analysis-details__value">{result.platform}</div>
          </div>
          
          <div className="analysis-details__item">
            <div className="analysis-details__label">Capabilities Identified</div>
            <div className="analysis-details__value">{result.capabilities?.capabilities?.length || 0}</div>
          </div>
          
          <div className="analysis-details__item">
            <div className="analysis-details__label">Attack Vectors</div>
            <div className="analysis-details__value">{result.attack_surface?.attack_vectors?.length || 0}</div>
          </div>
          
          <div className="analysis-details__item">
            <div className="analysis-details__label">Risk Level</div>
            <div className={`analysis-details__value analysis-details__value--${(result.attack_surface?.overall_risk_level || 'low').toLowerCase()}`}>
              {result.attack_surface?.overall_risk_level || 'N/A'}
            </div>
          </div>
          
          <div className="analysis-details__item">
            <div className="analysis-details__label">Protections Mapped</div>
            <div className="analysis-details__value">{result.promon_mapping?.protections?.length || 0}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SecurityBrief
