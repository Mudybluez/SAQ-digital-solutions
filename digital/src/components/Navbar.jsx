import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useContent } from '../context/ContentContext'

const links = [
  { label: 'Услуги',    href: '#services' },
  { label: 'Процесс',   href: '#process'  },
  { label: 'Портфолио', href: '#portfolio'},
  { label: 'О нас',     href: '#about'    },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open,     setOpen]     = useState(false)
  const { theme, toggleTheme } = useContent()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0,   opacity: 1  }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-12 py-4 transition-all duration-300 ${
          scrolled
            ? 'bg-navy/95 backdrop-blur-md border-b border-gold/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
            : 'bg-gradient-to-b from-navy/80 to-transparent'
        }`}
      >
        {/* Logo */}
        <a href="#home" className="flex items-center gap-3 group">
          <img src={theme === 'light' ? '/assets/digital_logo_light_no_bg.png' : '/assets/digital_logo_dark.png'} alt="SAQ Digital Systems" className="h-9 w-auto" />
          <span className="font-head font-[800] text-xl tracking-[-0.5px] text-gold group-hover:text-gold-glow transition-colors leading-none">
            SAQ<br />
            <span className="text-[10px] tracking-[2px] text-gold/70 font-body font-semibold uppercase">Digital Systems</span>
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-9">
          {links.map(l => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-xs font-semibold tracking-[2px] uppercase text-muted hover:text-gold transition-colors duration-200"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <button
              onClick={toggleTheme}
              className="text-muted hover:text-gold transition-colors p-1.5 focus:outline-none flex items-center justify-center cursor-pointer"
              title={theme === 'dark' ? 'Светлая тема' : 'Темная тема'}
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </li>
          <li>
            <a
              href="#contact"
              className="clip-hex bg-gold text-navy text-xs font-bold tracking-[1.5px] uppercase px-6 py-3 hover:bg-gold-glow transition-colors duration-200"
            >
              Связаться
            </a>
          </li>
        </ul>

        {/* Mobile controls */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            onClick={toggleTheme}
            className="text-gold p-1 focus:outline-none flex items-center justify-center cursor-pointer"
            title={theme === 'dark' ? 'Светлая тема' : 'Темная тема'}
          >
            {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          
          <button
            className="text-gold p-1"
            onClick={() => setOpen(v => !v)}
            aria-label="Меню"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{   opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-40 bg-navy/98 backdrop-blur-xl flex flex-col items-center justify-center gap-10 md:hidden"
          >
            {links.map(l => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-head text-4xl font-[800] tracking-[-1px] text-ink hover:text-gold transition-colors"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="clip-hex bg-gold text-navy font-bold tracking-[2px] uppercase px-10 py-4 text-sm mt-4"
            >
              Связаться
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
