import { useRef, useEffect } from 'react'

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
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        paddingTop: '60px',
      }}
    >
      {/* Grid overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(42, 42, 42, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(42, 42, 42, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

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
              // GAME DEV TOOLS
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
              C:\Gays 
            </p>
          </FadeInSection>

          <FadeInSection delay={0.5}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap' }}>
              <a
                href="#products"
                style={{
                  fontFamily: 'DM Mono, monospace',
                  fontWeight: 500,
                  fontSize: '13px',
                  color: '#0a0a0a',
                  textDecoration: 'none',
                  letterSpacing: '0.06em',
                  background: '#e8e8e8',
                  padding: '12px 28px',
                  display: 'inline-block',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.target.style.background = '#ffffff')}
                onMouseLeave={(e) => (e.target.style.background = '#e8e8e8')}
              >
                VIEW PRODUCTS
              </a>
              <a
                href="#donations"
                style={{
                  fontFamily: 'DM Mono, monospace',
                  fontWeight: 400,
                  fontSize: '13px',
                  color: '#aaaaaa',
                  textDecoration: 'none',
                  letterSpacing: '0.04em',
                  transition: 'color 0.2s',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#e8e8e8')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#aaaaaa')}
              >
                Donations →
              </a>
            </div>
          </FadeInSection>
        </div>

        {/* Right: Hero GIF */}
        <FadeInSection delay={0.4}>
          <div
            style={{
              width: '100%',
              maxWidth: '480px',
              marginLeft: 'auto',
              position: 'relative',
            }}
            className="three-canvas"
          >
            <img
              src="/hero.gif"
              alt=""
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </div>
        </FadeInSection>
      </div>

      {/* Bottom fade */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '120px',
          background: 'linear-gradient(to bottom, transparent, #0a0a0a)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
    </section>
  )
}
