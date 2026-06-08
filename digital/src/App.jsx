import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar   from './components/Navbar'
import Hero     from './components/Hero'
import WorkPage from './pages/WorkPage'
import PrivacyPage from './pages/PrivacyPage'
import { ContentProvider } from './context/ContentContext'

// ── Below-fold: lazy load (split into separate chunks)
const Ticker       = lazy(() => import('./components/Ticker'))
const Services     = lazy(() => import('./components/Services'))
const Process      = lazy(() => import('./components/Process'))
const Portfolio    = lazy(() => import('./components/Portfolio'))
const Testimonials = lazy(() => import('./components/Testimonials'))
const TechStack    = lazy(() => import('./components/TechStack'))
const ContactForm  = lazy(() => import('./components/ContactForm'))
const Footer       = lazy(() => import('./components/Footer'))
const AdminPage    = lazy(() => import('./pages/AdminPage'))

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
    <ContentProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen bg-navy flex items-center justify-center text-gold">Загрузка...</div>}>
          <Routes>
            <Route path="/"           element={<Home />} />
            <Route path="/work/:slug" element={<WorkPage />} />
            <Route path="/privacy"    element={<PrivacyPage />} />
            <Route path="/admin"      element={<AdminPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ContentProvider>
  )
}
