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

    // Seed default projects if empty
    const checkRes = await client.query("SELECT COUNT(*) as count FROM projects");
    const count = parseInt(checkRes.rows[0].count, 10);

    if (count === 0) {
      console.log("[portfolio-db] Seeding default projects into Postgres...");
      const insertQuery = `
        INSERT INTO projects (
          slug, title, description, category, tags, image, link, overview, facts,
          challenge, solution, solution_points, results_title, results, screens
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
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
        }
      ];

      for (const item of seedData) {
        await client.query(insertQuery, [
          item.slug, item.title, item.description, item.category,
          JSON.stringify(item.tags), item.image, item.link || null,
          item.overview, JSON.stringify(item.facts), item.challenge,
          item.solution, JSON.stringify(item.solution_points),
          item.results_title, JSON.stringify(item.results),
          JSON.stringify(item.screens)
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
      challenge, solution, solution_points, results_title, results, screens
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    RETURNING id
  `;
  const res = await pool.query(query, [
    project.slug, project.title, project.description, project.category,
    JSON.stringify(project.tags), project.image, project.link || null,
    project.overview, JSON.stringify(project.facts), project.challenge,
    project.solution, JSON.stringify(project.solution_points),
    project.results_title, JSON.stringify(project.results),
    JSON.stringify(project.screens)
  ]);
  return res.rows[0].id;
}

export async function updateProject(id, project) {
  const query = `
    UPDATE projects SET
      slug = $1, title = $2, description = $3, category = $4,
      tags = $5, image = $6, link = $7, overview = $8, facts = $9,
      challenge = $10, solution = $11, solution_points = $12,
      results_title = $13, results = $14, screens = $15
    WHERE id = $16
  `;
  await pool.query(query, [
    project.slug, project.title, project.description, project.category,
    JSON.stringify(project.tags), project.image, project.link || null,
    project.overview, JSON.stringify(project.facts), project.challenge,
    project.solution, JSON.stringify(project.solution_points),
    project.results_title, JSON.stringify(project.results),
    JSON.stringify(project.screens),
    id
  ]);
}

export async function deleteProject(id) {
  await pool.query("DELETE FROM projects WHERE id = $1", [id]);
}

export default pool;
