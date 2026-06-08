import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar   from './components/Navbar'
import Hero     from './components/Hero'
import WorkPage from './pages/WorkPage'
import PrivacyPage from './pages/PrivacyPage'

// ── Below-fold: lazy load (split into separate chunks)
const Ticker       = lazy(() => import('./components/Ticker'))
const Services     = lazy(() => import('./components/Services'))
const Process      = lazy(() => import('./components/Process'))
const Portfolio    = lazy(() => import('./components/Portfolio'))
const Testimonials = lazy(() => import('./components/Testimonials'))
const TechStack    = lazy(() => import('./components/TechStack'))
const ContactForm  = lazy(() => import('./components/ContactForm'))
const Footer       = lazy(() => import('./components/Footer'))

function Home() {
  return (
    <div className="noise min-h-screen">
      <Navbar />
      <Hero />
      <Suspense fallback={null}>
        <Ticker />
        <Services />
        <Process />
        <Portfolio />
        <Testimonials />
        <TechStack />
        <ContactForm />
        <Footer />
      </Suspense>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/work/:slug" element={<WorkPage />} />
        <Route path="/privacy"    element={<PrivacyPage />} />
      </Routes>
    </BrowserRouter>
  )
}
