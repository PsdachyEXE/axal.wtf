import { useEffect, useRef } from 'react'

export default function StarField() {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf

    const stars = []
    const drifters = []

    function seed() {
      stars.length = 0
      drifters.length = 0
      const w = window.innerWidth
      const h = window.innerHeight

      for (let i = 0; i < 120; i++) {
        const max = Math.random() * 0.4 + 0.1
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1 + 0.3,
          opacity: Math.random() * max,
          min: Math.random() * 0.03 + 0.01,
          max,
          delta: (Math.random() * 0.003 + 0.001) * (Math.random() < 0.5 ? 1 : -1),
        })
      }

      for (let i = 0; i < 28; i++) {
        drifters.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.2 + 0.5,
          opacity: Math.random() * 0.2 + 0.04,
          vy: Math.random() * 0.3 + 0.1,
          vx: (Math.random() - 0.5) * 0.08,
          phase: Math.random() * Math.PI * 2,
        })
      }
    }

    function resize() {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      ctx.scale(dpr, dpr)
      seed()
    }

    function draw() {
      const w = window.innerWidth
      const h = window.innerHeight
      ctx.clearRect(0, 0, w, h)

      for (const s of stars) {
        if (!reduced) {
          s.opacity += s.delta
          if (s.opacity >= s.max) { s.opacity = s.max; s.delta = -Math.abs(s.delta) }
          if (s.opacity <= s.min) { s.opacity = s.min; s.delta = Math.abs(s.delta) }
        }
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${s.opacity})`
        ctx.fill()
      }

      for (const d of drifters) {
        if (!reduced) {
          d.phase += 0.008
          d.y += d.vy
          d.x += Math.sin(d.phase) * 0.25 + d.vx
          if (d.y > h + d.r) { d.y = -d.r; d.x = Math.random() * w }
          if (d.x > w + d.r) d.x = -d.r
          if (d.x < -d.r) d.x = w + d.r
        }
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${d.opacity})`
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  )
}
