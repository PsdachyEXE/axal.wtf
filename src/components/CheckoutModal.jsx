import { useEffect, useRef, useState } from 'react'

const TIER_DATA = {
  Monthly: { label: 'Monthly', suffix: '/mo', note: 'Billed monthly. Cancel anytime.' },
  Lifetime: { label: 'Lifetime', suffix: ' one-time', note: 'One-time payment. Permanent access.' },
}

const inputStyle = {
  width: '100%',
  background: '#111111',
  border: '1px solid #2a2a2a',
  color: '#e8e8e8',
  fontFamily: 'DM Mono, monospace',
  fontSize: '13px',
  fontWeight: 400,
  padding: '11px 14px',
  outline: 'none',
  transition: 'border-color 0.2s',
  borderRadius: 0,
  appearance: 'none',
  WebkitAppearance: 'none',
}

function FormField({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label
        style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: '10px',
          fontWeight: 500,
          color: '#555555',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}

export default function CheckoutModal({ product, tier, price, onClose }) {
  const overlayRef = useRef()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [focusedField, setFocusedField] = useState(null)

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

  const focusStyle = (field) =>
    focusedField === field
      ? { ...inputStyle, borderColor: '#555555' }
      : inputStyle

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

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: '1px solid transparent',
            color: '#555555',
            fontFamily: 'DM Mono, monospace',
            fontSize: '18px',
            lineHeight: 1,
            padding: '4px 8px',
            cursor: 'pointer',
            transition: 'border-color 0.2s, color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#555555'
            e.currentTarget.style.color = '#e8e8e8'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'transparent'
            e.currentTarget.style.color = '#555555'
          }}
          aria-label="Close"
        >
          ×
        </button>

        {/* Header */}
        <div
          style={{
            padding: '28px 32px 24px',
            borderBottom: '1px solid #1e1e1e',
          }}
        >
          <div
            style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '10px',
              fontWeight: 500,
              color: '#555555',
              letterSpacing: '0.15em',
              marginBottom: '10px',
            }}
          >
            // CHECKOUT
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
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
        <div
          style={{
            padding: '20px 32px',
            borderBottom: '1px solid #1e1e1e',
          }}
        >
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
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '13px',
                  color: '#aaaaaa',
                }}
              >
                {product} — {tierInfo.label}
              </span>
              <span
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 700,
                  fontSize: '16px',
                  color: '#e8e8e8',
                }}
              >
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
          style={{
            padding: '24px 32px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <FormField label="Full Name">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={focusStyle('name')}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              autoComplete="name"
            />
          </FormField>

          <FormField label="Email Address">
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={focusStyle('email')}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              autoComplete="email"
            />
          </FormField>

          {/* Submit */}
          <div style={{ marginTop: '8px' }}>
            <button
              type="button"
              style={{
                width: '100%',
                fontFamily: 'DM Mono, monospace',
                fontWeight: 500,
                fontSize: '13px',
                letterSpacing: '0.06em',
                color: '#0a0a0a',
                background: '#e8e8e8',
                border: 'none',
                padding: '14px 28px',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#e8e8e8')}
            >
              PROCEED TO PAYMENT →
            </button>
          </div>

          {/* Disclaimer */}
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
