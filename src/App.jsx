import { useState } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Products from './components/Products'
import Donations from './components/Donations'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import CheckoutModal from './components/CheckoutModal'
import StarField from './components/StarField'

export default function App() {
  const [modal, setModal] = useState(null) // { product, tier, price }

  const handleGetAccess = (product, tier, price) => {
    setModal({ product, tier, price })
  }

  const handleCloseModal = () => {
    setModal(null)
  }

  return (
    <>
      <StarField />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Nav />
        <main>
          <Hero />
          <Products onGetAccess={handleGetAccess} />
          <Donations />
          <FAQ />
        </main>
        <Footer />
        {modal && (
          <CheckoutModal
            product={modal.product}
            tier={modal.tier}
            price={modal.price}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </>
  )
}
