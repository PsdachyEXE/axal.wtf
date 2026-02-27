import useScrollFadeIn from '../hooks/useScrollFadeIn'

const FEATURES = [
  'Instant delivery',
  'Discord support',
  'Reliable',
  'Strongest on the market',
  'Priority support',
]

const PRODUCTS = [
  { name: 'Aftermath', status: 'UNDETECTED', features: FEATURES },
  { name: 'Project Delta', status: 'UNDETECTED', features: FEATURES },
]

function TierRow({ period, price, badge, recommended, onGetAccess }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 0',
        borderBottom: '1px solid #2a2a2a',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div>
          <div
            style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '12px',
              color: '#aaaaaa',
              fontWeight: 400,
              marginBottom: '2px',
            }}
          >
            {period}
          </div>
          <div
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: '18px',
              color: '#e8e8e8',
            }}
          >
            {price}
          </div>
        </div>
        {badge && (
          <span
            style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '9px',
              fontWeight: 500,
              color: '#0a0a0a',
              background: '#e8e8e8',
              padding: '3px 7px',
              letterSpacing: '0.08em',
              lineHeight: 1,
            }}
          >
            {badge}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={onGetAccess}
        className={recommended ? 'btn-primary' : 'btn-outline'}
        style={{ padding: '8px 16px', whiteSpace: 'nowrap' }}
        aria-label={`Get ${period.toLowerCase()} access — ${price}`}
      >
        Get Access
      </button>
    </div>
  )
}

function ProductCard({ name, status, features, onGetAccess }) {
  const ref = useScrollFadeIn()

  return (
    <div ref={ref} className="product-card">
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div className="sub-label">// PRODUCT</div>
          {status && (
            <span className={`status-badge status-badge--${status.toLowerCase()}`}>
              <span className="status-badge__dot" aria-hidden="true">
                <span className="status-badge__ping" />
                <span className="status-badge__core" />
              </span>
              {status}
            </span>
          )}
        </div>
        <h3
          style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
            fontSize: '28px',
            letterSpacing: '-0.01em',
            color: '#e8e8e8',
            marginBottom: '20px',
          }}
        >
          {name}
        </h3>

        <ul className="feature-list">
          {features.map((f) => (
            <li key={f} className="feature-list__item">
              <span className="feature-list__check">✓</span>
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: '4px' }}>
        <TierRow
          period="Monthly"
          price="€7/mo"
          onGetAccess={() => onGetAccess(name, 'Monthly', '€7')}
        />
        <TierRow
          period="Lifetime"
          price="€15 one-time"
          badge="BEST VALUE"
          recommended
          onGetAccess={() => onGetAccess(name, 'Lifetime', '€15')}
        />
      </div>
    </div>
  )
}

export default function Products({ onGetAccess }) {
  const labelRef = useScrollFadeIn()

  return (
    <section
      id="products"
      style={{
        padding: '100px 24px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <div ref={labelRef} style={{ marginBottom: '48px' }}>
        <div className="label-comment">// PRODUCTS</div>
        <div className="section-rule" />
      </div>

      <div className="products-grid">
        {PRODUCTS.map((p) => (
          <ProductCard key={p.name} {...p} onGetAccess={onGetAccess} />
        ))}
      </div>
    </section>
  )
}
