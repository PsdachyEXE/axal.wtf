import { useRef, useEffect } from 'react'
import LogoModel from './LogoModel'

function FadeInSection({ children, delay = 0 }) {
  const ref = useRef()

  useEffect(() => {
    const el = ref.current
    if (!el) return

    el.style.opacity = '0'
    el.style.transform = 'translateY(20px)'
    el.style.transition = `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`

    const timeout = setTimeout(() => {
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    }, 50)

    return () => clearTimeout(timeout)
  }, [delay])

  return <div ref={ref}>{children}</div>
}

export default function Hero() {
  return (
    <section
      id="hero"
      aria-label="Hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        paddingTop: '60px',
      }}
    >
      <div className="hero-overlay" />

      {/* Content container */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '80px 24px',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          alignItems: 'center',
          gap: '48px',
          position: 'relative',
          zIndex: 1,
        }}
        className="hero-grid"
      >
        {/* Left: Text */}
        <div>
          <FadeInSection delay={0.1}>
            <div
              style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '11px',
                fontWeight: 400,
                color: '#555555',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: '24px',
                borderLeft: '2px solid #2a2a2a',
                paddingLeft: '12px',
              }}
            >
              // something 
            </div>
          </FadeInSection>

          <FadeInSection delay={0.2}>
            <h1
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(80px, 12vw, 150px)',
                lineHeight: 0.9,
                letterSpacing: '-0.03em',
                color: '#e8e8e8',
                marginBottom: '32px',
              }}
            >
              AXAL
            </h1>
          </FadeInSection>

          <FadeInSection delay={0.35}>
            <p
              style={{
                fontFamily: 'DM Mono, monospace',
                fontWeight: 300,
                fontSize: '15px',
                color: '#aaaaaa',
                lineHeight: 1.7,
                maxWidth: '420px',
                marginBottom: '48px',
              }}
            >
              // idk
            </p>
          </FadeInSection>

          <FadeInSection delay={0.5}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap' }}>
              <a href="#products" className="btn-primary" style={{ padding: '12px 28px' }}>
                VIEW PRODUCTS
              </a>
              <a
                href="#donations"
                className="nav-link"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                Donations →
              </a>
            </div>
          </FadeInSection>
        </div>

        {/* Right: 3D Logo */}
        <FadeInSection delay={0.4}>
          <div
            style={{
              width: '100%',
              aspectRatio: '1 / 1',
              maxWidth: '480px',
              marginLeft: 'auto',
              position: 'relative',
            }}
            className="three-canvas"
            role="img"
            aria-label="Axal 3D logo"
          >
            <LogoModel />
          </div>
        </FadeInSection>
      </div>

      <div className="hero-fade" />
    </section>
  )
}
