import { useEffect, useRef, useState } from 'react'
import { initiateCheckout } from '../api/checkout'

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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) { setError('Please enter your full name.'); return }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await initiateCheckout({ product, tier, price, name: name.trim(), email: email.trim() })
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
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
        {success ? (
          <div style={{ padding: '32px', textAlign: 'center' }}>
            <div
              style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '12px',
                color: '#22c55e',
                letterSpacing: '0.06em',
                marginBottom: '16px',
              }}
            >
              // request received
            </div>
            <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '13px', color: '#aaaaaa', lineHeight: 1.6 }}>
              We'll be in touch at <strong style={{ color: '#e8e8e8' }}>{email}</strong> shortly.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{ padding: '24px 32px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <FormField label="Full Name">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(null) }}
                className="form-input"
                autoComplete="name"
              />
            </FormField>

            <FormField label="Email Address">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null) }}
                className="form-input"
                autoComplete="email"
              />
            </FormField>

            {error && (
              <div
                style={{
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '11px',
                  color: '#ef4444',
                  letterSpacing: '0.04em',
                }}
              >
                {error}
              </div>
            )}

            <div style={{ marginTop: '8px' }}>
              <button
                type="submit"
                className="modal-submit"
                style={{ opacity: loading ? 0.5 : 1 }}
                disabled={loading}
              >
                {loading ? 'PROCESSING...' : 'PROCEED TO PAYMENT →'}
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
              // payment processed via ___
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
