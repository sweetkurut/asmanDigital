import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json({ limit: '10kb' }));

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['POST'],
  allowedHeaders: ['Content-Type'],
}));

const contactLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    error: 'Too many requests. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function sendTelegramMessage(name, phone, email, message) {
  const timestamp = new Date().toLocaleString('ru-RU', {
    timeZone: 'Asia/Bishkek',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const text = [
    `🔔 <b>Новая заявка с сайта!</b>`,
    ``,
    `👤 <b>Имя:</b> ${escapeHtml(name)}`,
    `📞 <b>Телефон:</b> ${escapeHtml(phone)}`,
    `📧 <b>Email:</b> ${escapeHtml(email)}`,
    ``,
    `💬 <b>Сообщение:</b>`,
    `<i>${escapeHtml(message)}</i>`,
    ``,
    `━━━━━━━━━━━━━━━━━━━━`,
    `🕐 ${timestamp}`,
    `🌐 Источник: asmandigital.com`,
  ].join('\n');

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  });

  const data = await response.json();

  if (!data.ok) {
    console.error('Telegram API error:', data);
    throw new Error(`Telegram API error: ${data.description}`);
  }

  return data;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function validateContactForm(body) {
  const errors = [];
  const { name, phone, email, message } = body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters.');
  } else if (name.length > 100) {
    errors.push('Name is too long (max 100 characters).');
  }

  const phoneRegex = /^[\d\s+\-()]{5,30}$/;
  if (!phone || typeof phone !== 'string' || !phoneRegex.test(phone.trim())) {
    errors.push('Please provide a valid phone number.');
  } else if (phone.length > 30) {
    errors.push('Phone number is too long.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    errors.push('Please provide a valid email address.');
  } else if (email.length > 100) {
    errors.push('Email is too long (max 100 characters).');
  }

  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    errors.push('Message must be at least 10 characters.');
  } else if (message.length > 2000) {
    errors.push('Message is too long (max 2000 characters).');
  }

  return errors;
}

app.post('/api/contact', contactLimiter, async (req, res) => {
  try {
    const errors = validateContactForm(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const { name, phone, email, message } = req.body;

    await sendTelegramMessage(name.trim(), phone.trim(), email.trim(), message.trim());

    console.log(`✅ Contact form submitted: ${name} (${email})`);

    return res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully!',
    });
  } catch (error) {
    console.error('❌ Error processing contact form:', error.message);

    return res.status(500).json({
      success: false,
      error: 'Failed to send message. Please try again later.',
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Contact endpoint: POST http://localhost:${PORT}/api/contact`);
  console.log(`💚 Health check: GET http://localhost:${PORT}/api/health\n`);

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('⚠️  WARNING: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set in .env file!');
  }
});
