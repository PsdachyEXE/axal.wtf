import { useEffect, useRef, useState } from 'react'

const TIER_DATA = {
  Monthly: { label: 'Monthly', suffix: '/mo', note: 'Billed monthly. Cancel anytime.' },
  Lifetime: { label: 'Lifetime', suffix: ' one-time', note: 'One-time payment. Permanent access.' },
}

function FormField({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label className="form-label">{label}</label>
      {children}
    </div>
  )
}

export default function CheckoutModal({ product, tier, price, onClose }) {
  const overlayRef = useRef()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const tierInfo = TIER_DATA[tier] ?? TIER_DATA.Monthly

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose()
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.88)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          background: '#0d0d0d',
          border: '1px solid #2a2a2a',
          position: 'relative',
          animation: 'modalIn 0.2s ease',
        }}
      >
        <style>{`
          @keyframes modalIn {
            from { opacity: 0; transform: translateY(12px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        <button onClick={onClose} className="modal-close" aria-label="Close">×</button>

        {/* Header */}
        <div style={{ padding: '28px 32px 24px', borderBottom: '1px solid #1e1e1e' }}>
          <div className="label-comment">// CHECKOUT</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap', marginTop: '10px' }}>
            <h2
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                fontSize: '26px',
                letterSpacing: '-0.01em',
                color: '#e8e8e8',
                margin: 0,
              }}
            >
              {product}
            </h2>
            <span
              style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '10px',
                fontWeight: 500,
                color: '#0a0a0a',
                background: '#e8e8e8',
                padding: '3px 8px',
                letterSpacing: '0.08em',
              }}
            >
              {tierInfo.label.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Order summary */}
        <div style={{ padding: '20px 32px', borderBottom: '1px solid #1e1e1e' }}>
          <div
            style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '10px',
              fontWeight: 500,
              color: '#555555',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '14px',
            }}
          >
            Order Summary
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '13px', color: '#aaaaaa' }}>
                {product} — {tierInfo.label}
              </span>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px', color: '#e8e8e8' }}>
                {price}
                <span
                  style={{
                    fontFamily: 'DM Mono, monospace',
                    fontWeight: 300,
                    fontSize: '11px',
                    color: '#555555',
                    marginLeft: '3px',
                  }}
                >
                  {tierInfo.suffix}
                </span>
              </span>
            </div>

            <div
              style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '11px',
                fontWeight: 300,
                color: '#555555',
                borderTop: '1px solid #1e1e1e',
                paddingTop: '10px',
              }}
            >
              {tierInfo.note}
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => e.preventDefault()}
          style={{ padding: '24px 32px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          <FormField label="Full Name">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              autoComplete="name"
            />
          </FormField>

          <FormField label="Email Address">
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              autoComplete="email"
            />
          </FormField>

          <div style={{ marginTop: '8px' }}>
            <button type="button" className="modal-submit">
              PROCEED TO PAYMENT →
            </button>
          </div>

          <div
            style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '10px',
              fontWeight: 300,
              color: '#2a2a2a',
              letterSpacing: '0.04em',
              textAlign: 'center',
            }}
          >
            // payment processing not yet integrated
          </div>
        </form>
      </div>
    </div>
  )
}
