# Руководство по развертыванию SAQ Digital Solutions на VDS

Данное руководство описывает пошаговый процесс переноса, запуска и привязки домена для микросервисной платформы **SAQ Digital Solutions** на арендованном VDS (предполагается ОС **Ubuntu Server 22.04 / 24.04 LTS**).

---

## Архитектура развертывания

Для обеспечения безопасности и простоты управления сертификатами SSL, схема работы на сервере выглядит следующим образом:

```
[ Клиент (HTTPS) ] ──> [ Внешний Nginx на VDS (SSL-терминация) ]
                                    │
                                    ▼ (Проксирует локально на 127.0.0.1:3000)
                       [ Docker Compose: api-gateway (Nginx) ]
                                    │
               ┌────────────────────┼────────────────────┐
               ▼ (Static)           ▼ (API)              ▼ (API)
          [ frontend ]          [ leads ]          [ portfolio ]
                                    │                    │
                                    ▼ (Notify)           ▼ (DB)
                              [ notifications ]        [ db (Postgres) ]
```

---

## Шаг 1: Настройка DNS-записей домена

Чтобы домен указывал на ваш сервер, перейдите в панель управления вашего регистратора доменов (или DNS-провайдера, например, Cloudflare) и добавьте следующие записи:

| Тип | Имя (Хост) | Значение (IP-адрес) | TTL |
|:---|:---|:---|:---|
| **A** | `@` (или пустое) | `IP_ВАШЕГО_VDS` | Авто / 3600 |
| **A** | `www` | `IP_ВАШЕГО_VDS` | Авто / 3600 |

> [!NOTE]
> Обновление DNS-записей в глобальной сети может занять от 15 минут до 24 часов (обычно происходит в течение 1–2 часов).

---

## Шаг 2: Подключение к VDS по SSH

Откройте терминал на вашем компьютере и подключитесь к серверу:

```bash
ssh root@IP_ВАШЕГО_VDS
```
Введите пароль, полученный от хостинг-провайдера.

---

## Шаг 3: Установка Docker и Docker Compose на VDS

Выполните следующие команды для обновления системы и установки Docker:

```bash
# Обновление списка пакетов
sudo apt update && sudo apt upgrade -y

# Установка необходимых зависимостей
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common gnupg lsb-release

# Добавление официального GPG ключа Docker
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Добавление репозитория Docker
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Установка Docker Engine и Docker Compose
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Проверка установки
docker --version
docker compose version
```

---

## Шаг 4: Клонирование проекта и настройка окружения

1. **Клонируйте репозиторий** на VDS (рекомендуется разместить в директории `/var/www/saq-digital`):
   ```bash
   sudo mkdir -p /var/www
   sudo chown -R $USER:$USER /var/www
   cd /var/www
   # Клонируем проект (замените на URL вашего репозитория)
   git clone <URL_РЕПОЗИТОРИЯ> saq-digital
   cd saq-digital
   ```

2. **Безопасность портов:**
   В файле [docker-compose.yml](file:///C:/Users/mandd/Documents/Visual_Studio_Repositories/SAQ-Digital_Solutions/docker-compose.yml) порт шлюза по умолчанию опубликован как `"3000:80"`. Это означает, что шлюз доступен извне по IP. Чтобы закрыть его от внешнего мира и разрешить доступ только локальному Nginx-прокси, отредактируйте файл на сервере (например, через `nano docker-compose.yml`):
   
   ```yaml
     gateway:
       build: ./api-gateway
       ports:
         - "127.0.0.1:3000:80" # Ограничиваем доступ только локальной петлей
   ```

3. **Создание `.env` файла:**
   Создайте файл `.env` на сервере на основе локального шаблона [.env](file:///C:/Users/mandd/Documents/Visual_Studio_Repositories/SAQ-Digital_Solutions/.env):
   ```bash
   nano .env
   ```
   Заполните его актуальными продакшн-значениями:
   ```ini
   # Пароль для входа в админ-панель
   ADMIN_PASSWORD=выберите_сложный_пароль_админа
   
   # Настройки Telegram-уведомлений
   TELEGRAM_BOT_TOKEN=ваш_токен_бота
   TELEGRAM_CHAT_ID=id_чата_для_заявок
   # TELEGRAM_TOPIC_ID=id_топика_если_нужно
   
   # Настройки почты (SMTP)
   SMTP_HOST=smtp.yandex.ru
   SMTP_PORT=465
   SMTP_USER=leads@yourdomain.kz
   SMTP_PASS=пароль_приложения_почты
   LEAD_EMAIL_TO=admin@yourdomain.kz
   ```

---

## Шаг 5: Запуск проекта в Docker Compose

Запустите сборку и запуск контейнеров в фоновом режиме:

```bash
docker compose up -d --build
```

Убедитесь, что все контейнеры работают корректно:
```bash
docker compose ps
```
Вы должны увидеть запущенные контейнеры для `gateway`, `frontend`, `leads`, `portfolio`, `notifications` и `db`.

---

## Шаг 6: Настройка внешнего Nginx и SSL (Certbot)

Чтобы связать домен с работающим Docker-контейнером и включить безопасное HTTPS-соединение:

1. **Установите Nginx на самом VDS-сервере:**
   ```bash
   sudo apt install -y nginx
   ```

2. **Создайте конфигурационный файл для вашего домена:**
   ```bash
   sudo nano /etc/nginx/sites-available/saq-digital
   ```
   Вставьте следующую конфигурацию (замените `yourdomain.kz` на ваш реальный домен):
   ```nginx
   server {
       listen 80;
       server_name yourdomain.kz www.yourdomain.kz;

       client_max_body_size 12M;

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

3. **Активируйте конфигурацию и перезапустите Nginx:**
   ```bash
   # Создаем символическую ссылку для активации сайта
   sudo ln -s /etc/nginx/sites-available/saq-digital /etc/nginx/sites-enabled/
   
   # Отключаем дефолтный конфиг Nginx, чтобы не было конфликтов
   sudo rm /etc/nginx/sites-enabled/default
   
   # Проверяем конфигурацию Nginx на ошибки
   sudo nginx -t
   
   # Перезапускаем веб-сервер
   sudo systemctl restart nginx
   ```

4. **Выпуск SSL-сертификата Let's Encrypt с помощью Certbot:**
   ```bash
   # Установка Certbot и плагина для Nginx
   sudo apt install -y certbot python3-certbot-nginx
   
   # Запуск получения сертификата
   sudo certbot --nginx -d yourdomain.kz -d www.yourdomain.kz
   ```
   Во время процесса:
   - Введите ваш e-mail для получения уведомлений об окончании действия сертификата.
   - Согласитесь с условиями использования (A).
   - Выберите автоматическое перенаправление HTTP -> HTTPS (обычно Certbot делает это автоматически).

5. **Проверка автопродления сертификата:**
   Let's Encrypt выпускает сертификаты на 90 дней. Certbot автоматически создает системную задачу для их продления. Проверить работоспособность автопродления можно командой:
   ```bash
   sudo certbot renew --dry-run
   ```

---

## Мониторинг и обслуживание

* **Просмотр логов контейнеров:**
  ```bash
  docker compose logs -f --tail=100
  ```
* **Остановка платформы:**
  ```bash
  docker compose down
  ```
* **Обновление кода на сервере:**
  ```bash
  git pull origin main
  docker compose up -d --build
  ```
