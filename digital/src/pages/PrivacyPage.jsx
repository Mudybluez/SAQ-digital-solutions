import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Политика конфиденциальности — SAQ Digital Systems'
  }, [])

  return (
    <div className="min-h-screen bg-navy text-ink font-body">
      {/* ── NAVBAR ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-navy/90 backdrop-blur-md border-b border-gold/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/logo.png" alt="SAQ" className="h-8 w-auto" />
            <span className="font-head font-[800] text-lg tracking-[-0.5px] text-gold">
              SAQ<br />
              <span className="text-[10px] tracking-[2px] text-gold/70 font-body font-semibold uppercase">Digital Systems</span>
            </span>
          </Link>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted hover:text-gold transition-colors text-sm"
          >
            <ArrowLeft size={15} /> На главную
          </button>
        </div>
      </header>

      {/* ── CONTENT ── */}
      <main className="max-w-[800px] mx-auto px-6 pt-32 pb-24">
        <h1 className="font-head font-[800] text-[clamp(36px,5vw,58px)] leading-[1.1] tracking-[-1px] mb-2 text-ink">
          Политика конфиденциальности
        </h1>
        <p className="font-mono text-[12px] text-gold uppercase tracking-[2px] mb-12">
          Дата последнего обновления: 6 июня 2026 года
        </p>

        <div className="prose prose-invert max-w-none text-[15px] text-muted leading-[1.8] space-y-8">
          <p>
            Настоящая политика конфиденциальности определяет порядок сбора, обработки и защиты персональных данных пользователей сайта{' '}
            <strong className="text-ink font-semibold">SAQ Digital Systems</strong> (далее — Сайт), управляемого ИП SAQ Creative Agency в лице Малаева Е. (далее — Оператор).
          </p>

          <p>
            Мы осуществляем сбор и обработку персональных данных в строгом соответствии с Законом Республики Казахстан от 21 мая 2013 года № 94-V «О персональных данных и их защите».
          </p>

          <div className="border-t border-gold/10 pt-8">
            <h2 className="font-head font-[700] text-xl text-gold uppercase tracking-[1px] mb-4">1. Какие данные мы собираем</h2>
            <p>При заполнении формы обратной связи на нашем Сайте, вы добровольно предоставляете следующие персональные данные:</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>Имя (для обращения к вам);</li>
              <li>Контактная информация (номер телефона, имя пользователя Telegram или адрес электронной почты);</li>
              <li>Косвенные технические данные (IP-адрес, файлы Cookie и параметры браузера, собираемые автоматически при просмотре Сайта).</li>
            </ul>
          </div>

          <div className="border-t border-gold/10 pt-8">
            <h2 className="font-head font-[700] text-xl text-gold uppercase tracking-[1px] mb-4">2. Цели сбора и обработки данных</h2>
            <p>Мы используем собранные персональные данные исключительно для следующих целей:</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>Обратная связь с вами по вашему запросу;</li>
              <li>Обсуждение, оценка стоимости и согласование технического задания вашего проекта;</li>
              <li>Подготовка и заключение официального договора на оказание услуг по веб-разработке;</li>
              <li>Анализ посещаемости Сайта и оптимизация его интерфейса с целью улучшения пользовательского опыта.</li>
            </ul>
          </div>

          <div className="border-t border-gold/10 pt-8">
            <h2 className="font-head font-[700] text-xl text-gold uppercase tracking-[1px] mb-4">3. Правовые основания для обработки</h2>
            <p>
              Обработка персональных данных осуществляется на основании вашего прямого и сознательного согласия, которое вы выражаете, ставя отметку («галочку») перед отправкой любой формы на Сайте. Мы не собираем и не обрабатываем персональные данные без вашего явного согласия.
            </p>
          </div>

          <div className="border-t border-gold/10 pt-8">
            <h2 className="font-head font-[700] text-xl text-gold uppercase tracking-[1px] mb-4">4. Защита и хранение персональных данных</h2>
            <p>
              Оператор принимает необходимые правовые, организационные и технические меры для защиты персональных данных от несанкционированного или случайного доступа, уничтожения, изменения, блокирования, копирования, распространения, а также от иных неправомерных действий третьих лиц:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>Данные передаются по защищенному протоколу HTTPS;</li>
              <li>Доступ к базе данных строго ограничен и предоставляется только лицам, непосредственно задействованным в коммуникации с клиентами.</li>
            </ul>
            <p className="mt-4">
              Мы храним ваши персональные данные в течение срока, необходимого для достижения целей их сбора, или до момента получения требования об их уничтожении.
            </p>
          </div>

          <div className="border-t border-gold/10 pt-8">
            <h2 className="font-head font-[700] text-xl text-gold uppercase tracking-[1px] mb-4">5. Передача данных третьим лицам</h2>
            <p>
              Оператор обязуется не продавать, не обменивать и не передавать ваши персональные данные третьим лицам. Исключение составляют случаи, предусмотренные законодательством Республики Казахстан.
            </p>
          </div>

          <div className="border-t border-gold/10 pt-8">
            <h2 className="font-head font-[700] text-xl text-gold uppercase tracking-[1px] mb-4">6. Права пользователей</h2>
            <p>В соответствии с законодательством Республики Казахстан вы имеете право:</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>Знать о наличии у нас ваших персональных данных и получать информацию о целях их обработки;</li>
              <li>Требовать изменения или обновления ваших персональных данных в случае их неточности;</li>
              <li>Отозвать свое согласие на обработку персональных данных и требовать их полного удаления из наших систем.</li>
            </ul>
            <p className="mt-4">
              Для осуществления любого из этих прав отправьте запрос на адрес электронной почты:{' '}
              <a href="mailto:malayevyerkanat@gmail.com" className="text-gold underline hover:text-gold-glow transition-colors">
                malayevyerkanat@gmail.com
              </a>{' '}
              или напишите напрямую в Telegram:{' '}
              <a href="https://t.me/saq_digital_systems" target="_blank" rel="noopener" className="text-gold underline hover:text-gold-glow transition-colors">
                @saq_digital_systems
              </a>.
            </p>
          </div>

          <div className="border-t border-gold/10 pt-8">
            <h2 className="font-head font-[700] text-xl text-gold uppercase tracking-[1px] mb-4">7. Изменение политики конфиденциальности</h2>
            <p>
              Мы оставляем за собой право вносить изменения в настоящую Политику в случае изменения законодательства РК или функционала Сайта. Новая редакция Политики вступает в силу с момента ее публикации на этой странице.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
