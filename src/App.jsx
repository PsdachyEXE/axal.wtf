import Nav from './components/Nav'
import Hero from './components/Hero'
import Products from './components/Products'
import Donations from './components/Donations'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Products />
        <Donations />
      </main>
      <Footer />
    </>
  )
}
