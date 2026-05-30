# YuStack — Landing Page

Лендінг для компанії **YuStack**, що спеціалізується на розробці Telegram-ботів, веб-сайтів та автоматизації.

## Структура проєкту

```
yustack/
├── index.html          # Головна сторінка
├── css/
│   └── style.css       # Всі стилі (змінні, компоненти, анімації)
├── js/
│   └── main.js         # Scroll reveal, typewriter, активні посилання
├── assets/
│   └── favicon.svg     # Іконка сайту
└── README.md           # Цей файл
```

## Технології

- **HTML5** — семантична розмітка
- **CSS3** — кастомні властивості, grid, flexbox, анімації
- **Vanilla JS** — IntersectionObserver, без зовнішніх залежностей
- **Шрифти** — JetBrains Mono + Space Mono (Google Fonts)

## Запуск

Відкрий `index.html` у браузері або запусти локальний сервер:

```bash
# Python
python3 -m http.server 8080

# Node.js (npx)
npx serve .
```

## Кастомізація

| Що змінити          | Де                                     |
|---------------------|----------------------------------------|
| Кольори / шрифти    | `css/style.css` → `:root { ... }`      |
| Тексти / секції     | `index.html`                           |
| Анімації / логіка   | `js/main.js`                           |
| Контакти            | `index.html` → секція `#contact`       |

## Контакти YuStack

- Telegram: [@yustack](https://t.me/yustack)
- Email: hello@yustack.dev
- GitHub: [github.com/yustack](https://github.com/yustack)
