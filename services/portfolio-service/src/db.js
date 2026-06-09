import pg from "pg";

const { Pool } = pg;

// Собираем подключение динамически. Если переменных нет - используем дефолты
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'saq_user',
  host: process.env.DB_HOST || 'db',
  database: process.env.POSTGRES_DB || 'saq_db',
  password: process.env.POSTGRES_PASSWORD || 'saq_pass',
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

export async function initDb() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(255) NOT NULL,
        tags JSONB NOT NULL,
        image TEXT NOT NULL,
        link TEXT,
        overview TEXT NOT NULL,
        facts JSONB NOT NULL,
        challenge TEXT NOT NULL,
        solution TEXT NOT NULL,
        solution_points JSONB NOT NULL,
        results_title VARCHAR(255) NOT NULL,
        results JSONB NOT NULL,
        screens JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("[portfolio-db] Projects table is ready.");

    // Add translations column if not exists
    await client.query(`
      ALTER TABLE projects ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb;
    `);
    console.log("[portfolio-db] Projects translations column is ready.");

    await client.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        key VARCHAR(255) PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("[portfolio-db] Site settings table is ready.");

    // Seed default projects if empty
    const checkRes = await client.query("SELECT COUNT(*) as count FROM projects");
    const count = parseInt(checkRes.rows[0].count, 10);

    if (count === 0) {
      console.log("[portfolio-db] Seeding default projects into Postgres...");
      const insertQuery = `
        INSERT INTO projects (
          slug, title, description, category, tags, image, link, overview, facts,
          challenge, solution, solution_points, results_title, results, screens, translations
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      `;

      const BASE = 'https://saqdigital.kz';
      const seedData = [
        {
          slug: 'zenscribe',
          title: 'ZenScribe',
          description: 'AI-платформа, которая превращает YouTube-видео в конспект, тест и карточки за секунды.',
          category: 'Web App',
          tags: ['AI', 'PLATFORM', 'SAAS', 'WEBAPP'],
          image: `${BASE}/uploads/img-1780582900121-959131768.png`,
          link: 'https://madiproject.home.ruletk.com/',
          overview: 'Полноценный AI SaaS — пользователь вставляет YouTube-ссылку, и платформа автоматически генерирует конспект, 10 вопросов для квиза, флэш-карточки и полный транскрипт. Уникальная функция — интерактивная карта знаний: все разборы отображаются как созвездие с семантическими связями между темами.',
          facts: {
            'Тип': 'AI SaaS / Web App',
            'AI-движок': 'Google Gemini 2.5 Flash',
            'Технологии': 'React · Node.js · Python · Docker',
            'Архитектура': 'Микросервисы + RabbitMQ',
          },
          challenge: 'Студенты и исследователи тратят часы на конспектирование видеолекций и подкастов вручную. Готового инструмента, который бы сразу давал структурированный разбор с тестом и карточками для запоминания, не существовало — особенно с поддержкой русского и казахского языков.',
          solution: 'Построили микросервисную платформу на Docker: отдельные сервисы для загрузки, AI-обработки через Gemini 2.5 Flash и поиска с Redis-кэшированием. Все сервисы общаются через RabbitMQ — тяжёлая обработка видео не блокирует интерфейс. Уникальная карта знаний визуализирует семантические связи между всеми разборами пользователя.',
          solution_points: [
            'YouTube URL / загрузка файла / запись аудио — три источника контента',
            'AI-генерация: конспект, квиз (10 вопросов), флэш-карточки, полный транскрипт',
            'Интерактивная карта знаний — созвездие из всех разборов с семантическими связями',
            'Микросервисная архитектура: Nginx · API Gateway · Upload · AI Worker · Search',
            'Асинхронная обработка через RabbitMQ — без зависания интерфейса',
            'Поддержка языков: EN · RU · KZ',
            'Токенная монетизация: Lite $2.50 / Pro $7.50 / Pay-per-request $0.25',
            'Кинематографический UI: частицы-звёзды с физикой пружины, 3D-переходы',
          ],
          results_title: 'Видео → знания за 30 секунд',
          results: [
            { num: '60 000+', lbl: 'AI-слов сгенерировано для одного пользователя' },
            { num: '3 языка', lbl: 'EN · RU · KZ из коробки' },
            { num: '239', lbl: 'коммитов — серьёзная production-кодовая база' },
          ],
          screens: [
            `${BASE}/uploads/img-1780583047291-971199850.png`,
            `${BASE}/uploads/img-1780583073428-280961668.png`,
            `${BASE}/uploads/img-1780583095886-148478579.png`,
            `${BASE}/uploads/img-1780583309004-538030375.png`,
            `${BASE}/uploads/img-1780583380873-887058771.png`,
            `${BASE}/uploads/img-1780583539465-948739242.png`,
          ],
          translations: {
            en: {
              title: 'ZenScribe',
              subtitle: 'AI Video Analysis Platform',
              desc: 'AI platform that turns YouTube videos into summaries, quizzes, and cards in seconds.',
              overview: 'Full AI SaaS — the user inserts a YouTube link, and the platform automatically generates a summary, 10 quiz questions, flashcards, and a full transcript. Unique feature — interactive knowledge map: all analyses are displayed as a constellation with semantic links between topics.',
              challenge: 'Students and researchers spend hours summarizing video lectures and podcasts manually. There was no ready-made tool that would immediately provide a structured analysis with a test and cards for memorization — especially with support for Russian and Kazakh languages.',
              solution: 'Built a microservice platform on Docker: separate services for upload, AI processing via Gemini 2.5 Flash, and search with Redis caching. All services communicate via RabbitMQ — heavy video processing does not block the interface. A unique knowledge map visualizes semantic connections between all user analyses.',
              solution_points: [
                'YouTube URL / file upload / audio recording — three content sources',
                'AI generation: summary, quiz (10 questions), flashcards, full transcript',
                'Interactive knowledge map — constellation of all analyses with semantic connections',
                'Microservice architecture: Nginx · API Gateway · Upload · AI Worker · Search',
                'Asynchronous processing via RabbitMQ — without interface freezing',
                'Language support: EN · RU · KZ',
                'Token monetization: Lite $2.50 / Pro $7.50 / Pay-per-request $0.25',
                'Cinematic UI: star particles with spring physics, 3D transitions'
              ],
              results_title: 'Video → knowledge in 30 seconds',
              results: [
                { num: '60 000+', lbl: 'AI words generated for one user' },
                { num: '3 languages', lbl: 'EN · RU · KZ out of the box' },
                { num: '239', lbl: 'commits — solid production codebase' }
              ],
              facts: {
                'Type': 'AI SaaS / Web App',
                'AI Engine': 'Google Gemini 2.5 Flash',
                'Technologies': 'React · Node.js · Python · Docker',
                'Architecture': 'Microservices + RabbitMQ'
              }
            },
            kk: {
              title: 'ZenScribe',
              subtitle: 'Бейнелерді талдауға арналған AI платформасы',
              desc: 'YouTube бейнесін бірнеше секундта конспектіге, тестке және карточкаларға айналдыратын AI платформасы.',
              overview: 'Толыққанды AI SaaS — пайдаланушы YouTube сілтемесін қояды, ал платформа автоматты түрде конспект, 10 тест сұрағын, флэш-карточкаларды және толық транскриптті жасайды. Бірегей мүмкіндік — интерактивті білім картасы: барлық талдаулар тақырыптар арасындағы семантикалық байланыстары бар шоқжұлдыз ретінде көрсетіледі.',
              challenge: 'Студенттер мен зерттеушілер бейне дәрістер мен подкасттарды қолмен конспектілеуге сағаттап уақыт жұмсайды. Тест және есте сақтау карточкаларымен бірден құрылымдалған талдауды беретін дайын құрал — әсіресе орыс және қазақ тілдерін қолдайтын құрал болған жоқ.',
              solution: 'Docker-де микросервистік платформа құрдық: жүктеу, Gemini 2.5 Flash арқылы AI өңдеу және Redis кэштеуімен іздеу үшін жеке сервистер. Барлық сервистер RabbitMQ арқылы байланысады — ауыр бейне өңдеу интерфейсті блоктамайды. Бірегей білім картасы пайдаланушының барлық талдаулары арасындағы семантикалық байланыстарды визуализациялайды.',
              solution_points: [
                'YouTube сілтемесі / файлды жүктеу / аудио жазу — мазмұнның үш көзі',
                'AI генерациясы: конспект, тест (10 сұрақ), флэш-карточкалар, толық транскрипт',
                'Интерактивті білім картасы — семантикалық байланыстары бар барлық талдаулардың шоқжұлдызы',
                'Микросервистік сәулет: Nginx · API Gateway · Upload · AI Worker · Search',
                'RabbitMQ арқылы асинхронды өңдеу — интерфейстің қатып қалуынсыз',
                'Тілдерді қолдау: EN · RU · KZ',
                'Токендік монетизация: Lite $2.50 / Pro $7.50 / Pay-per-request $0.25',
                'Кинематографиялық UI: серіппелі физикасы бар жұлдызды бөлшектер, 3D ауысулар'
              ],
              results_title: '30 секундта бейне → білім',
              results: [
                { num: '60 000+', lbl: 'бір пайдаланушы үшін сөздерді AI генерациясы' },
                { num: '3 тіл', lbl: 'EN · RU · KZ қораптан' },
                { num: '239', lbl: 'коммит — сенімді өндірістік код базасы' }
              ],
              facts: {
                'Түрі': 'AI SaaS / Web App',
                'AI қозғалтқышы': 'Google Gemini 2.5 Flash',
                'Технологиялар': 'React · Node.js · Python · Docker',
                'Сәулеті': 'Микросервистер + RabbitMQ'
              }
            }
          }
        },
        {
          slug: 'dilyara-resort',
          title: 'Dilyara Resort',
          description: 'Сайт курортного центра на первой береговой линии озера Алаколь с онлайн-бронированием.',
          category: 'Лендинг',
          tags: ['LANDING', 'HOTEL', 'BOOKING', 'RESORT'],
          image: `${BASE}/uploads/img-1780581880804-241102477.png`,
          link: 'https://dilyararesortcenter.kz/',
          overview: 'Лендинг для семейного курортного центра на первой береговой линии озера Алаколь. Сайт закрывает всё — от первого знакомства с объектом до бронирования в WhatsApp: пять типов номеров с сезонными тарифами, фотогалерея, кафе-бар Terrazza, карта и прямые контакты.',
          facts: {
            'Тип': 'Landing Page',
            'Клиент': 'Dilyara Resort Center',
            'Локация': 'Озеро Алаколь, Жарбулак',
            'Сезон запуска': 'Лето 2026',
          },
          challenge: 'Курорт принимал гостей, но бронирования шли только по сарафанному радио и личным звонкам. Не было ни сайта, ни актуальных цен в открытом доступе — клиентам приходилось писать в директ и ждать ответа, чтобы узнать стоимость номера.',
          solution: 'Разработали лендинг с подробными карточками каждого типа номеров, сезонными таблицами цен и кнопкой бронирования через WhatsApp. Гость видит фото, тарифы по трём сезонам и может написать в один клик — без звонков и ожидания.',
          solution_points: [
            'Пять типов номеров с фотогалереями и полным описанием',
            'Сезонные таблицы цен (низкий / высокий / бархатный сезон)',
            'Бронирование через WhatsApp с предзаполненным сообщением',
            'Секция кафе-бара Terrazza с атмосферными фото',
            'Встроенная карта Google с точным расположением',
            'Детская политика и условия отмены бронирования',
            'Мобильная адаптация под телефон',
          ],
          results_title: 'Курорт теперь бронируют онлайн',
          results: [
            { num: '5', lbl: 'типов номеров с актуальными ценами' },
            { num: '3', lbl: 'сезонных тариха на каждый номер' },
            { num: '1 клик', lbl: 'до бронирования через WhatsApp' },
          ],
          screens: [
            `${BASE}/uploads/img-1780582186333-313026605.png`,
            `${BASE}/uploads/img-1780582202997-111711793.png`,
            `${BASE}/uploads/img-1780582223067-380229256.png`,
            `${BASE}/uploads/img-1780582254120-592943777.png`,
            `${BASE}/uploads/img-1780582274196-251327468.png`,
            `${BASE}/uploads/img-1780582293559-870734338.png`,
          ],
          translations: {
            en: {
              title: 'Dilyara Resort',
              subtitle: 'Resort Center on Lake Alakol',
              desc: 'Resort center website on the first coastline of Lake Alakol with online booking.',
              overview: 'Landing page for a family resort center on the first coastline of Lake Alakol. The website handles everything — from the first introduction to the property to booking via WhatsApp: five room types with seasonal rates, a photo gallery, Terrazza cafe-bar, a map, and direct contacts.',
              challenge: 'The resort accepted guests, but bookings were only made by word of mouth and personal calls. There was no website or up-to-date prices in the public domain — clients had to write to direct message and wait for an answer to find out the room rate.',
              solution: 'Developed a landing page with detailed cards for each room type, seasonal price tables, and a booking button via WhatsApp. The guest sees photos, rates for three seasons, and can write in one click — without calls and waiting.',
              solution_points: [
                'Five room types with photo galleries and full descriptions',
                'Seasonal price tables (low / high / velvet season)',
                'Booking via WhatsApp with a pre-filled message',
                'Terrazza cafe-bar section with atmospheric photos',
                'Embedded Google Map with exact location',
                'Child policy and booking cancellation terms',
                'Mobile adaptation for phones'
              ],
              results_title: 'The resort is now booked online',
              results: [
                { num: '5', lbl: 'room types with up-to-date prices' },
                { num: '3', lbl: 'seasonal rates for each room' },
                { num: '1 click', lbl: 'to book via WhatsApp' }
              ],
              facts: {
                'Type': 'Landing Page',
                'Client': 'Dilyara Resort Center',
                'Location': 'Lake Alakol, Zharbulak',
                'Launch Season': 'Summer 2026'
              }
            },
            kk: {
              title: 'Dilyara Resort',
              subtitle: 'Алакөл көліндегі демалыс орталығы',
              desc: 'Алакөл көлінің бірінші жағалау сызығындағы онлайн-брондау мүмкіндігі бар демалыс орталығының сайты.',
              overview: 'Алакөл көлінің бірінші жағалау сызығындағы отбасылық демалыс орталығына арналған лендинг. Сайт бәрін шешеді — нысанмен алғашқы танысудан бастап WhatsApp-та брондауға дейін: маусымдық тарифтері бар бөлмелердің бес түрі, фотогалерея, Terrazza кафе-бары, карта және тікелей байланыс деректері.',
              challenge: 'Демалыс орны қонақтарды қабылдады, бірақ брондау тек ауызша и жеке қоңыраулар арқылы жүргізілді. Сайт та, ашық қолжетімділіктегі өзекті бағалар да болған жоқ — бөлме құнын білу үшін клиенттер директке жазып, жауап күтуге мәжбүр болды.',
              solution: 'Әрбір бөлме түрінің егжей-тегжейлі карточкалары, маусымдық баға кестелері және WhatsApp арқылы брондау батырмасы бар лендинг әзірледік. Қонақ фотосуреттерді, үш маусым бойынша тарифтерді көреді және қоңырауларсыз және күтпестен бір рет басу арқылы жаза алады.',
              solution_points: [
                'Фотогалереялары мен толық сипаттамасы бар бөлмелердің бес түрі',
                'Маусымдық баға кестелері (төмен / жоғары / маусымаралық)',
                'Алдын ала толтырылған хабарламамен WhatsApp арқылы брондау',
                'Terrazza кафе-барының атмосфералық фотосуреттері бар секциясы',
                'Нақты орналасқан жері бар ендірілген Google картасы',
                'Балалар саясаты және брондаудан бас тарту шарттары',
                'Телефонға арналған мобильді адаптация'
              ],
              results_title: 'Демалыс орны енді онлайн брондалады',
              results: [
                { num: '5', lbl: 'өзекті бағалары бар бөлмелердің түрі' },
                { num: '3', lbl: 'әр бөлмеге маусымдық тариф' },
                { num: '1 клик', lbl: 'WhatsApp арқылы брондауға дейін' }
              ],
              facts: {
                'Түрі': 'Landing Page',
                'Клиент': 'Dilyara Resort Center',
                'Орналасқан жері': 'Алакөл көлі, Жарбұлақ',
                'Іске қосу маусымы': 'Жаз 2026'
              }
            }
          }
        },
        {
          slug: 'aya-platform',
          title: 'AYA Platform',
          description: 'Единая платформа для казахстанского независимого кино, музыки и подкастов с питчингом проектов.',
          category: 'Web App',
          tags: ['PLATFORM', 'STREAMING', 'WEBAPP', 'KZ'],
          image: `${BASE}/uploads/img-1780583838686-117692597.png`,
          link: 'https://aya-platform-ruddy.vercel.app/',
          overview: 'AYA (Art Yearns Action) — платформа для независимого казахстанского контента: смотреть фильмы, слушать подкасты, поддерживать авторов через питчинг и находить команду для съёмок. Это одновременно стриминг и краудфандинг — казахстанский гибрид Vimeo и Kickstarter для творческих людей.',
          facts: {
            'Тип': 'Web App / Streaming Platform',
            'Язык': 'RU · KZ · EN',
            'Категории': 'Кино · Короткий метр · Документальное · Подкасты · Клипы · Анимация',
          },
          challenge: 'Независимые казахстанские режиссёры, музыканты и подкастеры не имели единой площадки для публикации и монетизации своего контента. YouTube не поддерживает питчинг, Kickstarter не локализован — авторам приходилось использовать 3–4 разных сервиса одновременно.',
          solution: 'Разработали полноценную платформу с каталогом контента по категориям, конструктором поиска, видеоплеером с рекомендациями и разделом питчинга — где авторы публикуют идеи и собирают поддержку от сообщества. Подписка AYA+ даёт доступ без рекламы и офлайн-загрузки.',
          solution_points: [
            'Каталог контента: фильмы, короткий метр, документальное, подкасты, клипы, соц. ролики, анимация',
            'Конструктор поиска — фильтр по типу, жанру и особенностям',
            'Питчинг — краудфандинг идей: авторы публикуют проект, сообщество поддерживает',
            'Видеоплеер с боковой панелью рекомендаций',
            'Загрузка контента авторами через кнопку «+ Загрузить»',
            'AYA+ подписка: без рекламы, офлайн, премиум-функции',
            'Авторизация и профили создателей с @username',
          ],
          results_title: 'Своя платформа для своего кино',
          results: [
            { num: '8', lbl: 'категорий контента на одной платформе' },
            { num: '19', lbl: 'активных питч-проектов на старте' },
            { num: '2-в-1', lbl: 'стриминг + краудфандинг в одном продукте' },
          ],
          screens: [
            `${BASE}/uploads/img-1780583848137-821189075.png`,
            `${BASE}/uploads/img-1780583854667-743418866.png`,
            `${BASE}/uploads/img-1780583861692-528258433.png`,
            `${BASE}/uploads/img-1780583869841-784529918.png`,
            `${BASE}/uploads/img-1780583879079-182234571.png`,
            `${BASE}/uploads/img-1780583886205-837643646.png`,
          ],
          translations: {
            en: {
              title: 'AYA Platform',
              subtitle: 'Independent Cinema & Music',
              desc: 'Unified platform for Kazakhstani independent cinema, music, and podcasts with project pitching.',
              overview: 'AYA (Art Yearns Action) — a platform for independent Kazakhstani content: watch movies, listen to podcasts, support authors through pitching, and find a team for shooting. It is both streaming and crowdfunding — a Kazakhstani hybrid of Vimeo and Kickstarter for creative people.',
              challenge: 'Independent Kazakhstani directors, musicians, and podcasters did not have a single platform to publish and monetize their content. YouTube does not support pitching, Kickstarter is not localized — authors had to use 3-4 different services simultaneously.',
              solution: 'Developed a full-fledged platform with a content catalog by category, a search builder, a video player with recommendations, and a pitching section — where authors publish ideas and collect support from the community. AYA+ subscription provides access without ads and offline downloads.',
              solution_points: [
                'Content catalog: movies, short film, documentary, podcasts, clips, social videos, animation',
                'Search builder — filter by type, genre, and features',
                'Pitching — crowdfunding ideas: authors publish a project, community supports',
                'Video player with recommendations sidebar',
                'Content upload by authors via the "+ Upload" button',
                'AYA+ subscription: ad-free, offline, premium features',
                'Authorization and creator profiles with @username'
              ],
              results_title: 'Own platform for own cinema',
              results: [
                { num: '8', lbl: 'content categories on one platform' },
                { num: '19', lbl: 'active pitch projects at start' },
                { num: '2-in-1', lbl: 'streaming + crowdfunding in one product' }
              ],
              facts: {
                'Type': 'Web App / Streaming Platform',
                'Languages': 'RU · KZ · EN',
                'Categories': 'Cinema · Short Film · Documentary · Podcasts · Animation'
              }
            },
            kk: {
              title: 'AYA Platform',
              subtitle: 'Тәуелсіз кино және музыка',
              desc: 'Жобаларды питчингтеу мүмкіндігі бар қазақстандық тәуелсіз кино, музыка және подкасттарға арналған бірыңғай платформа.',
              overview: 'AYA (Art Yearns Action) — тәуелсіз қазақстандық контентке арналған платформа: фильмдер көру, подкасттар тыңдау, питчинг арқылы авторларды қолдау және түсірілімге команда табу. Бұл бір уақытта стриминг және краудфандинг — шығармашылық адамдарға арналған Vimeo мен Kickstarter-дің қазақстандық гибриді.',
              challenge: 'Тәуелсіз қазақстандық режиссерлердің, музыканттардың және подкастерлердің өз контентін жариялау және монетизациялау үшін бірыңғай алаңы болған жоқ. YouTube питчингті қолдамайды, Kickstarter локализацияланбаған — авторларға бір уақытта 3-4 түрлі сервисті пайдалануға тура келді.',
              solution: 'Санаттар бойынша контент каталогы, іздеу конструкторы, ұсыныстары бар бейне ойнатқыш және питчинг бөлімі — авторлар идеяларды жариялайтын және қауымдастықтан қолдау жинайтын толыққанды платформа әзірледік. AYA+ жазылымы жарнамасыз және офлайн жүктеусіз қол жеткізуге мүмкіндік береді.',
              solution_points: [
                'Контент каталогы: фильмдер, қысқа метр, деректі фильмдер, подкасттар, клиптер, әлеуметтік бейнелер, анимация',
                'Іздеу конструкторы — түрі, жанры және ерекшеліктері бойынша сүзгі',
                'Питчинг — идеяларды краудфандингтеу: авторлар жобаны жариялайды, қауымдастық қолдайды',
                'Ұсыныстардың бүйірлік панелі бар бейне ойнатқыш',
                '«+ Жүктеу» батырмасы арқылы авторлардың контентті жүктеуі',
                'AYA+ жазылымы: жарнамасыз, офлайн, премиум мүмкіндіктер',
                'Авторизация және @username бар авторлардың профильдері'
              ],
              results_title: 'Өз киномызға өз платформамыз',
              results: [
                { num: '8', lbl: 'бір платформада контент санаттары' },
                { num: '19', lbl: 'бастапқыда белсенді питч-жобалар' },
                { num: '2-еуі 1-де', lbl: 'бір өнімде стриминг + краудфандинг' }
              ],
              facts: {
                'Түрі': 'Web App / Streaming Platform',
                'Тілдер': 'RU · KZ · EN',
                'Санаттар': 'Кино · Қысқа метр · Деректі · Подкасттар · Анимация'
              }
            }
          }
        },
        {
          slug: 'foodmood',
          title: 'FoodMood',
          description: 'Веб-платформа для сокращения пищевых отходов: OCR-сканер чеков, отслеживание еды и аналитика устойчивости.',
          category: 'Web App',
          tags: ['WEB APP', 'API', 'DASHBOARD'],
          image: `${BASE}/uploads/img-1780581470775-88272368.png`,
          link: null,
          overview: 'Полноценная SaaS-платформа для борьбы с пищевыми отходами. Пользователь сканирует чек из магазина — AI автоматически распознаёт продукты, цены и сроки годности, добавляет в кладовую и отслеживает потребление. Платформа считает сэкономленные деньги, сокращение CO₂ и показывает личный рейтинг устойчивости.',
          facts: {
            'Тип': 'Web App / SaaS',
            'Языки': 'EN · RU · KZ',
            'Аудитория': '46 000+ домохозяйств',
            'Технологии': 'React · TypeScript · Vite',
          },
          challenge: 'Треть всей купленной еды выбрасывается — люди не следят за сроками годности, покупают лишнее и не видят, сколько денег уходит на выброшенные продукты. Нужна была система, которая делает управление едой простым и даёт мотивацию не тратить впустую.',
          solution: 'Разработали платформу с умным OCR-сканером чеков: пользователь фотографирует чек — система сама добавляет все продукты, конвертирует цены в тенге и ставит напоминания о сроках. Геймификация с уровнями и достижениями превращает экономию еды в привычку.',
          solution_points: [
            'OCR-сканер чеков — AI распознаёт продукты и цены за секунды',
            'Кладовая с напоминаниями об истекающих сроках годности',
            'Дашборд аналитики: CO₂, деньги, еда в кг',
            'Система достижений и уровней (Waste Warrior, Eco Champion и др.)',
            'Раздел рецептов на основе того, что есть в кладовой',
            'Community — делиться едой с соседями и сообществом',
            'Три тарифных плана: Free / $7.99 / $14.99',
            'Мультиязычность: EN · RU · KZ',
          ],
          results_title: 'Меньше отходов — больше денег',
          results: [
            { num: '46K+', lbl: 'домохозяйств-пользователей' },
            { num: '3', lbl: 'языка из коробки' },
            { num: 'OCR', lbl: 'автоматическое распознавание чеков' },
          ],
          screens: [
            `${BASE}/uploads/img-1780581317570-49675907.png`,
            `${BASE}/uploads/img-1780581311831-378981847.png`,
            `${BASE}/uploads/img-1780581320888-282103794.png`,
            `${BASE}/uploads/img-1780581331257-865266990.png`,
            `${BASE}/uploads/img-1780581339484-11596631.png`,
            `${BASE}/uploads/img-1780581353425-362479987.png`,
            `${BASE}/uploads/img-1780581368101-1837178.png`,
          ],
          translations: {
            en: {
              title: 'FoodMood',
              subtitle: 'Food Waste Tracker',
              desc: 'Web platform to reduce food waste: OCR receipt scanner, food tracking, and sustainability analytics.',
              overview: 'Full SaaS platform to fight food waste. The user scans a receipt from the store — AI automatically recognizes products, prices, and expiration dates, adds them to the pantry, and tracks consumption. The platform calculates saved money, CO₂ reduction, and shows a personal sustainability rating.',
              challenge: 'A third of all purchased food is thrown away — people do not track expiration dates, buy too much, and do not see how much money goes to discarded products. A system was needed that makes food management simple and provides motivation not to waste.',
              solution: 'Developed a platform with a smart OCR receipt scanner: the user takes a picture of the receipt — the system itself adds all products, converts prices to tenge, and sets reminders about deadlines. Gamification with levels and achievements turns food saving into a habit.',
              solution_points: [
                'OCR receipt scanner — AI recognizes products and prices in seconds',
                'Pantry with reminders of expiring dates',
                'Analytics dashboard: CO₂, money, food in kg',
                'System of achievements and levels (Waste Warrior, Eco Champion, etc.)',
                'Recipe section based on what is in the pantry',
                'Community — sharing food with neighbors and community',
                'Three subscription plans: Free / $7.99 / $14.99',
                'Multilingual: EN · RU · KZ'
              ],
              results_title: 'Less waste — more money',
              results: [
                { num: '46K+', lbl: 'user households' },
                { num: '3', lbl: 'languages out of the box' },
                { num: 'OCR', lbl: 'automatic receipt recognition' }
              ],
              facts: {
                'Type': 'Web App / SaaS',
                'Languages': 'EN · RU · KZ',
                'Audience': '46 000+ households',
                'Technologies': 'React · TypeScript · Vite'
              }
            },
            kk: {
              title: 'FoodMood',
              subtitle: 'Тағам қалдықтарын бақылаушы',
              desc: 'Тағам қалдықтарын азайтуға арналған веб-платформа: чекті OCR-сканерлеу, тағамды қадағалау және тұрақтылық талдауы.',
              overview: 'Тағам қалдықтарымен күресуге арналған толыққанды SaaS платформасы. Пайдаланушы дүкеннен чекті сканерлейді — AI автоматты түрде өнімдерді, бағаларды және жарамдылық мерзімін таниды, қоймаға қосады және тұтынуды бақылайды. Платформа үнемделген ақшаны, CO₂ азаюын есептейді және жеке тұрақтылық рейтингін көрсетеді.',
              challenge: 'Сатып алынған барлық тағамның үштен бірі лақтырылады — адамдар жарамдылық мерзімін бақыламайды, артық сатып алады және лақтырылған өнімдерге қанша ақша кететінін көрмейді. Тағамды басқаруды қарапайым ететін және ысырап етпеуге ынталандыратын жүйе қажет болды.',
              solution: 'Ақылды OCR чек сканері бар платформа әзірледік: пайдаланушы чекті суретке түсіреді — жүйенің өзі барлық өнімді қосады, бағаны теңгеге айналдырады және мерзімдер туралы ескертулер орнатады. Деңгейлер мен жетістіктер бар геймификация тағамды үнемдеуді әдетке айналдырады.',
              solution_points: [
                'OCR чек сканері — AI өнімдер мен бағаларды бірнеше секундта таниды',
                'Жарамдылық мерзімі өтіп бара жатқан өнімдер туралы ескертулері бар қойма',
                'Талдау дашборды: CO₂, ақша, кг түріндегі тағам',
                'Жетістіктер мен деңгейлер жүйесі (Waste Warrior, Eco Champion және т.б.)',
                'Қоймада бар нәрселер негізінде рецепттер бөлімі',
                'Community — көршілермен және қауымдастықпен тамақ бөлісу',
                'Үш тарифтік жоспар: Тегін / $7.99 / $14.99',
                'Мультитілділік: EN · RU · KZ'
              ],
              results_title: 'Аз қалдық — көп ақша',
              results: [
                { num: '46K+', lbl: 'пайдаланушы үй шаруашылықтары' },
                { num: '3', lbl: 'тіл қораптан' },
                { num: 'OCR', lbl: 'чекті автоматты түрде тану' }
              ],
              facts: {
                'Түрі': 'Web App / SaaS',
                'Тілдер': 'EN · RU · KZ',
                'Аудиториясы': '46 000+ үй шаруашылықтары',
                'Технологиялар': 'React · TypeScript · Vite'
              }
            }
          }
        }
      ];

      for (const item of seedData) {
        await client.query(insertQuery, [
          item.slug, item.title, item.description, item.category,
          JSON.stringify(item.tags), item.image, item.link || null,
          item.overview, JSON.stringify(item.facts), item.challenge,
          item.solution, JSON.stringify(item.solution_points),
          item.results_title, JSON.stringify(item.results),
          JSON.stringify(item.screens),
          JSON.stringify(item.translations || {})
        ]);
      }
      console.log("[portfolio-db] Seeding completed!");
    }
  } finally {
    client.release();
  }
}

export async function getAllProjects() {
  const res = await pool.query("SELECT * FROM projects ORDER BY id DESC");
  return res.rows;
}

export async function getProjectBySlug(slug) {
  const res = await pool.query("SELECT * FROM projects WHERE slug = $1", [slug]);
  return res.rows[0] || null;
}

export async function insertProject(project) {
  const query = `
    INSERT INTO projects (
      slug, title, description, category, tags, image, link, overview, facts,
      challenge, solution, solution_points, results_title, results, screens, translations
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
    RETURNING id
  `;
  const res = await pool.query(query, [
    project.slug, project.title, project.description, project.category,
    JSON.stringify(project.tags), project.image, project.link || null,
    project.overview, JSON.stringify(project.facts), project.challenge,
    project.solution, JSON.stringify(project.solution_points),
    project.results_title, JSON.stringify(project.results),
    JSON.stringify(project.screens),
    JSON.stringify(project.translations || {})
  ]);
  return res.rows[0].id;
}

export async function updateProject(id, project) {
  const query = `
    UPDATE projects SET
      slug = $1, title = $2, description = $3, category = $4,
      tags = $5, image = $6, link = $7, overview = $8, facts = $9,
      challenge = $10, solution = $11, solution_points = $12,
      results_title = $13, results = $14, screens = $15, translations = $16
    WHERE id = $17
  `;
  await pool.query(query, [
    project.slug, project.title, project.description, project.category,
    JSON.stringify(project.tags), project.image, project.link || null,
    project.overview, JSON.stringify(project.facts), project.challenge,
    project.solution, JSON.stringify(project.solution_points),
    project.results_title, JSON.stringify(project.results),
    JSON.stringify(project.screens),
    JSON.stringify(project.translations || {}),
    id
  ]);
}

export async function deleteProject(id) {
  await pool.query("DELETE FROM projects WHERE id = $1", [id]);
}

export async function getSettings(key) {
  const res = await pool.query("SELECT value FROM site_settings WHERE key = $1", [key]);
  return res.rows[0] ? res.rows[0].value : null;
}

export async function upsertSettings(key, value) {
  const query = `
    INSERT INTO site_settings (key, value, updated_at)
    VALUES ($1, $2, CURRENT_TIMESTAMP)
    ON CONFLICT (key) DO UPDATE
    SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP
  `;
  await pool.query(query, [key, JSON.stringify(value)]);
}

export default pool;
