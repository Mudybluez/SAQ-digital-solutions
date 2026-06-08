import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-navy border-t border-gold/10">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="SAQ Digital Systems" className="h-8 w-auto" />
              <span className="font-head text-2xl font-[800] tracking-[-0.5px] text-gold">SAQ Digital Systems</span>
            </div>
            <p className="text-[14px] text-muted leading-[1.7] max-w-xs">
              IT-студия полного цикла. Создаём цифровые продукты, которые работают и приносят результат.
            </p>
          </div>

          {/* Services */}
          <div>
            <p className="text-[11px] font-bold tracking-[3px] uppercase text-gold mb-4">Услуги</p>
            <ul className="space-y-3">
              {['Разработка сайтов','Telegram-боты','Автоматизация','Web-приложения'].map(s => (
                <li key={s}>
                  <a href="#services" className="text-[14px] text-muted hover:text-ink transition-colors">{s}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[11px] font-bold tracking-[3px] uppercase text-gold mb-4">Контакты</p>
            <ul className="space-y-3">
              <li><a href="https://t.me/saqdev" className="text-[14px] text-muted hover:text-gold transition-colors">Telegram</a></li>
              <li><a href="mailto:hello@saq.digital" className="text-[14px] text-muted hover:text-gold transition-colors">hello@saq.digital</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-gold/10 pt-7">
          <p className="text-[13px] text-muted">© 2025 SAQ Digital Systems. Все права защищены.</p>
          <Link to="/privacy"
             className="text-[13px] text-muted/50 hover:text-muted transition-colors underline underline-offset-2">
            Политика конфиденциальности
          </Link>
          <div className="flex gap-3">
            {/* Telegram */}
            <a href="https://t.me/saqdev" target="_blank" rel="noopener"
               className="w-9 h-9 border border-gold/15 flex items-center justify-center text-muted hover:border-gold hover:text-gold transition-all duration-200"
               aria-label="Telegram"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a href="#" className="w-9 h-9 border border-gold/15 flex items-center justify-center text-muted hover:border-gold hover:text-gold transition-all duration-200" aria-label="Instagram">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="2" y="2" width="20" height="20" rx="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
