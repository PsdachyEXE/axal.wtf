import { useState } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Products from './components/Products'
import Donations from './components/Donations'
import Footer from './components/Footer'
import CheckoutModal from './components/CheckoutModal'

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
      <Nav />
      <main>
        <Hero />
        <Products onGetAccess={handleGetAccess} />
        <Donations />
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
    </>
  )
}
