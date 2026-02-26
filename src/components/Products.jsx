import { useRef, useEffect } from 'react'

function useScrollFadeIn(threshold = 0.15) {
  const ref = useRef()

  useEffect(() => {
    const el = ref.current
    if (!el) return

    el.style.opacity = '0'
    el.style.transform = 'translateY(24px)'
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease'

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          observer.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return ref
}

function TierRow({ period, price, badge, onGetAccess }) {
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
        className="btn-outline"
        style={{ padding: '8px 16px', whiteSpace: 'nowrap' }}
      >
        Get Access
      </button>
    </div>
  )
}

function ProductCard({ name, onGetAccess }) {
  const ref = useScrollFadeIn()

  return (
    <div ref={ref} className="product-card">
      {/* Card header */}
      <div style={{ marginBottom: '24px' }}>
        <div className="sub-label">// PRODUCT</div>
        <h3
          style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
            fontSize: '28px',
            letterSpacing: '-0.01em',
            color: '#e8e8e8',
            marginBottom: '16px',
          }}
        >
          {name}
        </h3>
        <div style={{ borderBottom: '1px solid #2a2a2a', paddingBottom: '20px' }}>
          <p
            style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '13px',
              color: '#555555',
              fontStyle: 'italic',
              lineHeight: 1.6,
            }}
          >
            {/* Description placeholder */}
            — description coming soon —
          </p>
        </div>
      </div>

      {/* Pricing tiers */}
      <div>
        <TierRow
          period="Monthly"
          price="€7/mo"
          onGetAccess={() => onGetAccess(name, 'Monthly', '€7')}
        />
        <TierRow
          period="Lifetime"
          price="€15 one-time"
          badge="BEST VALUE"
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
      {/* Section label */}
      <div ref={labelRef} style={{ marginBottom: '48px' }}>
        <div className="label-comment">// PRODUCTS</div>
        <div className="section-rule" />
      </div>

      {/* Product cards */}
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <ProductCard name="Aftermath" onGetAccess={onGetAccess} />
        <ProductCard name="Project Delta" onGetAccess={onGetAccess} />
      </div>
    </section>
  )
}
