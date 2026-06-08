const items = [
  'Разработка сайтов','Telegram-боты','Автоматизация','Web Apps',
  'E-Commerce','CRM Системы','Лендинги','AI-решения',
  'Разработка сайтов','Telegram-боты','Автоматизация','Web Apps',
  'E-Commerce','CRM Системы','Лендинги','AI-решения',
]

export default function Ticker() {
  return (
    <div className="overflow-hidden border-t border-b border-gold/10 bg-navy-2 py-3">
      <div className="flex whitespace-nowrap animate-ticker">
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-5 font-head text-sm tracking-[3px] text-muted px-8">
            <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
            {item.toUpperCase()}
          </span>
        ))}
      </div>
    </div>
  )
}
