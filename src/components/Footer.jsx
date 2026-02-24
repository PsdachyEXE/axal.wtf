export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid #1e1e1e',
        padding: '32px 24px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        {/* Left: Wordmark */}
        <span
          style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
            fontSize: '16px',
            letterSpacing: '0.05em',
            color: '#555555',
          }}
        >
          AXAL
        </span>

        {/* Center: domain */}
        <span
          style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '12px',
            fontWeight: 300,
            color: '#2a2a2a',
            letterSpacing: '0.08em',
          }}
        >
          axal.wtf
        </span>

        {/* Right: copyright */}
        <span
          style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '11px',
            fontWeight: 300,
            color: '#2a2a2a',
            letterSpacing: '0.04em',
          }}
        >
          © 2025 AXAL
        </span>
      </div>
    </footer>
  )
}
