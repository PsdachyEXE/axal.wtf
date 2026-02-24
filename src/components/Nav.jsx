import { useState, useEffect } from 'react'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: 'Products', href: '#products' },
    { label: 'Donations', href: '#donations' },
  ]

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'background 0.3s ease, border-color 0.3s ease',
        background: scrolled
          ? 'rgba(10, 10, 10, 0.85)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled
          ? '1px solid #2a2a2a'
          : '1px solid transparent',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Wordmark */}
        <a
          href="#"
          style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
            fontSize: '20px',
            letterSpacing: '0.05em',
            color: '#e8e8e8',
            textDecoration: 'none',
          }}
        >
          AXAL
        </a>

        {/* Right nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                fontFamily: 'DM Mono, monospace',
                fontWeight: 400,
                fontSize: '13px',
                color: '#aaaaaa',
                textDecoration: 'none',
                letterSpacing: '0.04em',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.target.style.color = '#e8e8e8')}
              onMouseLeave={(e) => (e.target.style.color = '#aaaaaa')}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#products"
            style={{
              fontFamily: 'DM Mono, monospace',
              fontWeight: 500,
              fontSize: '13px',
              color: '#e8e8e8',
              textDecoration: 'none',
              letterSpacing: '0.04em',
              border: '1px solid #555555',
              padding: '7px 16px',
              transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#e8e8e8'
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#555555'
            }}
          >
            Get Access
          </a>
        </div>
      </div>
    </nav>
  )
}
