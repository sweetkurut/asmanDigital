# Developer Portfolio

Этот проект представляет собой портфолио разработчика с frontend на React/Vite и backend на Node.js/Express.

## Структура проекта

- `src/` - Исходный код frontend (React + TypeScript)
- `server/` - Backend API (Node.js + Express)
- `public/` - Статические файлы

## Локальная разработка

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
npm run dev
```

## Docker развертывание

Проект настроен для развертывания с помощью Docker Compose.

### Переменные окружения

Создайте файл `.env` в корне проекта со следующими переменными:

```
TELEGRAM_BOT_TOKEN=ваш_токен_бота
TELEGRAM_CHAT_ID=ваш_chat_id
CORS_ORIGIN=*
PORT=3001
```

### Сборка и запуск

1. Убедитесь, что Docker и Docker Compose установлены.

2. Соберите и запустите контейнеры:

```bash
docker-compose up --build
```

3. Приложение будет доступно:
   - Frontend: http://localhost
   - Backend API: http://localhost:3001

### Развертывание на сервере

1. Загрузите весь проект на сервер.

2. Установите переменные окружения в `.env`.

3. Запустите:

```bash
docker-compose up -d --build
```

4. Настройте nginx или другой reverse proxy для обслуживания на нужном домене.

### Остановка

```bash
docker-compose down
```
