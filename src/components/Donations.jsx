import { useRef, useEffect, useState } from 'react'

function useScrollFadeIn(threshold = 0.1) {
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

// Mock static data — replace with WebSocket/SSE endpoint
const mockDonations = [
  {
    id: 1,
    name: 'Orange451',
    amount: '€67.00',
    message: 'Keep up the amazing work!',
    time: '2m ago',
  },
  {
    id: 2,
    name: 'Anonymous',
    amount: '€7.00',
    message: null,
    time: '18m ago',
  },
  {
    id: 3,
    name: 'CompillerError',
    amount: '€41.00',
    message: 'Aftermath is nothing without Axal',
    time: '1h ago',
  },
  {
    id: 4,
    name: 'Anonymous',
    amount: '€7.00',
    message: null,
    time: '3h ago',
  },
  {
    id: 5,
    name: 'The big Yahoo',
    amount: '€15.00',
    message: 'Project Delta is exactly what I needed — thank you!',
    time: '5h ago',
  },
]

const mockTopDonors = [
  { rank: 1, name: 'Orange451', total: '€148.00' },
  { rank: 2, name: 'Anonymous', total: '€97.00' },
  { rank: 3, name: 'The big Yahoo', total: '€63.00' },
]

function PulsingDot() {
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: '8px', height: '8px' }}>
      <span
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: '#22c55e',
          animation: 'ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite',
        }}
      />
      <span
        style={{
          position: 'relative',
          display: 'block',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#22c55e',
        }}
      />
    </span>
  )
}

function DonationRow({ donation, isLast }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto auto',
        gap: '16px',
        alignItems: 'start',
        padding: '16px 0',
        borderBottom: isLast ? 'none' : '1px solid #1e1e1e',
      }}
    >
      {/* Left: name + message */}
      <div>
        <div
          style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '13px',
            fontWeight: 500,
            color: '#e8e8e8',
            marginBottom: donation.message ? '4px' : 0,
          }}
        >
          {donation.name}
        </div>
        {donation.message && (
          <div
            style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '11px',
              color: '#555555',
              fontWeight: 300,
              lineHeight: 1.5,
            }}
          >
            "{donation.message}"
          </div>
        )}
      </div>

      {/* Center: amount */}
      <div
        style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 700,
          fontSize: '15px',
          color: '#e8e8e8',
          whiteSpace: 'nowrap',
        }}
      >
        {donation.amount}
      </div>

      {/* Right: time */}
      <div
        style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: '11px',
          color: '#555555',
          fontWeight: 300,
          whiteSpace: 'nowrap',
        }}
      >
        {donation.time}
      </div>
    </div>
  )
}

const PRESET_AMOUNTS = ['€5', '€10', '€15', '€25']

export default function Donations() {
  const headerRef = useScrollFadeIn()
  const feedRef = useScrollFadeIn()
  const leaderboardRef = useScrollFadeIn()
  const formRef = useScrollFadeIn()

  const [donorName, setDonorName] = useState('')
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [selectedPreset, setSelectedPreset] = useState(null)

  const handlePreset = (preset) => {
    setSelectedPreset(preset)
    setAmount(preset.replace('€', ''))
  }

  return (
    <section
      id="donations"
      style={{
        padding: '100px 24px',
        borderTop: '1px solid #1e1e1e',
        background: 'rgba(255,255,255,0.005)',
      }}
    >
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section header */}
        <div ref={headerRef} style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '4px' }}>
            <div className="label-comment">// DONATIONS</div>
            {/* Live indicator */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                border: '1px solid #1e1e1e',
                padding: '3px 10px',
              }}
            >
              <PulsingDot />
              <span
                style={{
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '10px',
                  fontWeight: 500,
                  color: '#22c55e',
                  letterSpacing: '0.12em',
                }}
              >
                LIVE
              </span>
            </div>
          </div>
          <div className="section-rule" />
        </div>

        {/* Two-column layout */}
        <div
          className="donations-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 320px',
            gap: '48px',
            alignItems: 'start',
          }}
        >
          {/* Donation feed */}
          <div ref={feedRef}>
            <div className="sub-label">Recent</div>
            <div style={{ borderTop: '1px solid #2a2a2a' }}>
              {mockDonations.map((donation, i) => (
                <DonationRow
                  key={donation.id}
                  donation={donation}
                  isLast={i === mockDonations.length - 1}
                />
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div ref={leaderboardRef}>
            <div className="sub-label">Top Donors</div>
            <div style={{ border: '1px solid #2a2a2a' }}>
              {mockTopDonors.map((donor, i) => (
                <div
                  key={donor.rank}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    borderBottom: i < mockTopDonors.length - 1 ? '1px solid #1e1e1e' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span
                      style={{
                        fontFamily: 'DM Mono, monospace',
                        fontSize: '11px',
                        color: '#2a2a2a',
                        fontWeight: 500,
                        width: '20px',
                      }}
                    >
                      #{donor.rank}
                    </span>
                    <span
                      style={{
                        fontFamily: 'DM Mono, monospace',
                        fontSize: '13px',
                        color: i === 0 ? '#e8e8e8' : '#aaaaaa',
                        fontWeight: i === 0 ? 500 : 400,
                      }}
                    >
                      {donor.name}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: 'Syne, sans-serif',
                      fontWeight: 700,
                      fontSize: '14px',
                      color: i === 0 ? '#e8e8e8' : '#aaaaaa',
                    }}
                  >
                    {donor.total}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Donation input form */}
        <div
          ref={formRef}
          style={{
            marginTop: '48px',
            borderTop: '1px solid #1e1e1e',
            paddingTop: '40px',
          }}
        >
          <div style={{ marginBottom: '28px' }}>
            <div className="label-comment">// LEAVE A DONATION</div>
            <div className="section-rule" />
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            {/* Amount presets */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="form-label">Amount</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                {PRESET_AMOUNTS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePreset(preset)}
                    className={`preset-btn${selectedPreset === preset ? ' selected' : ''}`}
                  >
                    {preset}
                  </button>
                ))}
                <span
                  style={{
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '12px',
                    color: '#555555',
                    padding: '0 4px',
                  }}
                >
                  or
                </span>
                <div style={{ position: 'relative', flex: '1', minWidth: '120px', maxWidth: '180px' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontFamily: 'DM Mono, monospace',
                      fontSize: '13px',
                      color: '#555555',
                      pointerEvents: 'none',
                    }}
                  >
                    €
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="custom"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value)
                      setSelectedPreset(null)
                    }}
                    className="form-input"
                    style={{ paddingLeft: '26px' }}
                  />
                </div>
              </div>
            </div>

            {/* Name + Message in a row */}
            <div
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}
              className="donate-fields"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="form-label">Name (optional)</label>
                <input
                  type="text"
                  placeholder="Anonymous"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="form-label">Message (optional)</label>
                <input
                  type="text"
                  placeholder="say something..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            {/* Submit */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-outline"
                style={{ padding: '12px 28px' }}
              >
                Donate →
              </button>
              <span
                style={{
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '10px',
                  fontWeight: 300,
                  color: '#2a2a2a',
                  letterSpacing: '0.04em',
                }}
              >
                // payment processing not yet integrated
              </span>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
