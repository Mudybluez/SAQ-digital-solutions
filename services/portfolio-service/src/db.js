import pg from "pg";

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || "postgres://saq_user:saq_pass@db:5432/saq_db";

const pool = new Pool({
  connectionString,
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

      const seedData = [
        {
          slug: "foodmood",
          title: "FoodMood Platform",
          description: "Платформа для доставки и заказов",
          category: "Web App · Mockup",
          tags: ["WEB APP", "API", "DASHBOARD"],
          image: "night",
          link: "",
          overview: "FoodMood объединил онлайн-меню, оформление заказа, оплату и логистику доставки в одной платформе. Раньше заказы принимались в трёх разных чатах — теперь это единый поток с автоматическим распределением по кухням и курьерам.",
          facts: {
            "Тип": "Веб-приложение",
            "Модули": "Гость, Кухня, Курьер",
            "Интеграции": "Kaspi Pay, карты",
            "Нагрузка": "до 1 200 заказов/день"
          },
          challenge: "Сеть из шести точек теряла заказы: операторы вручную переписывали их из мессенджеров в кассу, путали адреса, не видели загрузку кухонь в реальном времени. Нужна была система, которая держит весь путь заказа от корзины до двери клиента.",
          solution: "Спроектировали платформу из трёх связанных интерфейсов с общим ядром заказов и реальным временем через веб-сокеты.",
          solution_points: [
            "Витрина меню с корзиной и оплатой Kaspi",
            "Панель кухни: статусы и таймеры приготовления",
            "Приложение курьера с картой и маршрутом",
            "Админка: аналитика продаж и отчёты"
          ],
          results_title: "Заказы — в одном потоке",
          results: [
            { num: "−40%", lbl: "времени на обработку заказа" },
            { num: "×2,3", lbl: "рост повторных заказов" },
            { num: "0", lbl: "потерянных заявок за квартал" }
          ],
          screens: [
            { grad: "night" },
            { grad: "horizon" },
            { grad: "night" }
          ]
        },
        {
          slug: "restaurant",
          title: "Restaurant Landing",
          description: "Лендинг ресторана · Астана",
          category: "Landing · Mockup",
          tags: ["LANDING", "SEO", "FORMS"],
          image: "gold",
          link: "https://example.com/restaurant",
          overview: "Современный интерактивный лендинг для премиального мясного ресторана в Астане. Сфокусирован на визуальной презентации меню, атмосфере и быстром бронировании столов.",
          facts: {
            "Тип": "Промо-лендинг",
            "Локация": "Астана, Казахстан",
            "Дизайн": "Премиальный темный",
            "Интеграция": "Бронь в CRM / Telegram"
          },
          challenge: "Ресторан тратил бюджет на Instagram-трафик, но конверсия в бронирования оставалась низкой. Пользователи не могли удобно посмотреть меню с телефона и не получали быстрого подтверждения брони.",
          solution: "Создали быстрый адаптивный лендинг с акцентом на сочные фотографии блюд и интерактивную форму резерва столов.",
          solution_points: [
            "Оптимизированное мобильное меню блюд",
            "Форма бронирования столов в 2 клика",
            "Автоматическое уведомление хостес в Telegram",
            "Полное SEO-позиционирование под Астану"
          ],
          results_title: "Бронирования выросли",
          results: [
            { num: "+45%", lbl: "рост конверсии из рекламы" },
            { num: "<2 мин", lbl: "среднее подтверждение брони" },
            { num: "×3", lbl: "окупаемость инвестиций" }
          ],
          screens: [
            { grad: "gold" },
            { grad: "night" },
            { grad: "gold" }
          ]
        },
        {
          slug: "clinic",
          title: "Med Clinic Website",
          description: "Сайт медицинской клиники",
          category: "Website · Mockup",
          tags: ["WEBSITE", "CMS", "BOOKING"],
          image: "horizon",
          link: "",
          overview: "Многостраничный сайт клиники с понятной структурой услуг и онлайн-записью. Контент-менеджер обновляет врачей, цены и расписание сам — без программиста.",
          facts: {
            "Тип": "Корпоративный сайт",
            "Страниц": "до 8",
            "CMS": "Своя панель",
            "Запись": "Онлайн-календарь"
          },
          challenge: "Старый сайт не обновлялся два года: устаревшие цены, неактуальные врачи, запись только по телефону в часы работы. Пациенты не находили нужную услугу и уходили к конкурентам.",
          solution: "Перестроили структуру вокруг услуг и врачей, добавили CMS и онлайн-запись с подтверждением.",
          solution_points: [
            "Каталог услуг с ценами и описанием",
            "Карточки врачей и расписание",
            "Онлайн-запись с выбором времени",
            "CMS-панель для самостоятельных правок"
          ],
          results_title: "Запись круглосуточно",
          results: [
            { num: "+78%", lbl: "онлайн-записей" },
            { num: "8", lbl: "страниц под услуги" },
            { num: "24/7", lbl: "доступ к записи" }
          ],
          screens: [
            { grad: "horizon" },
            { grad: "gold" },
            { grad: "horizon" }
          ]
        },
        {
          slug: "logistics",
          title: "Logistics Dashboard",
          description: "Панель управления логистикой",
          category: "Dashboard · Mockup",
          tags: ["PLATFORM", "DATA", "REALTIME"],
          image: "image",
          link: "",
          overview: "Информационная панель (дашборд) для диспетчеров транспортной компании. Вся информация о статусах рейсов, загрузке транспорта и маршрутах обновляется в реальном времени.",
          facts: {
            "Тип": "B2B Панель",
            "Обновление": "В реальном времени",
            "Технологии": "Websockets / Canvas",
            "Интерфейс": "Сложные графики"
          },
          challenge: "Диспетчеры компании контролировали рейсы через Excel и рации. Из-за отсутствия единой картины возникали простои транспорта и задержки в координации водителей.",
          solution: "Разработали закрытый веб-интерфейс, объединяющий GPS-данные машин, график отгрузок и аналитику эффективности в одном дашборде.",
          solution_points: [
            "Интерактивная карта движения автопарка",
            "Автоматическое вычисление простоев и задержек",
            "Быстрый поиск и фильтрация по статусам",
            "Система уведомлений о нештатных ситуациях"
          ],
          results_title: "Контроль без Excel",
          results: [
            { num: "−25%", lbl: "сокращение простоев транспорта" },
            { num: "100%", lbl: "прозрачность перевозок" },
            { num: "5 мин", lbl: "время обучения диспетчера" }
          ],
          screens: [
            { grad: "image" },
            { grad: "horizon" },
            { grad: "image" }
          ]
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
