import { useTranslation } from 'react-i18next'

const tickerKeys = [
  'ticker_web_dev', 'ticker_tg_bots', 'ticker_automation', 'ticker_web_apps',
  'ticker_ecommerce', 'ticker_crm', 'ticker_landings', 'ticker_ai_solutions'
]

const items = [...tickerKeys, ...tickerKeys]

export default function Ticker() {
  const { t } = useTranslation()

  return (
    <div className="overflow-hidden border-t border-b border-gold/10 bg-navy-2 py-3">
      <div className="flex whitespace-nowrap animate-ticker">
        {items.map((key, i) => (
          <span key={i} className="inline-flex items-center gap-5 font-head text-sm tracking-[3px] text-muted px-8">
            <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
            {t(key).toUpperCase()}
          </span>
        ))}
      </div>
    </div>
  )
}
