import { useState, useEffect } from 'react'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`nav-bar${scrolled ? ' scrolled' : ''}`} aria-label="Main navigation">
      <div className="nav-inner">
        <a href="#" className="nav-wordmark" aria-label="Axal — back to top">AXAL</a>
        <div className="nav-right">
          <a href="#products" className="nav-link">Products</a>
          <a href="#donations" className="nav-link">Donations</a>
          <a href="#products" className="nav-cta">Get Access</a>
        </div>
      </div>
    </nav>
  )
}
