# YuStack — Landing Page

Лендінг для **YuStack** — розробка Telegram-ботів, які ведуть клієнтів до запису й оплати.

## Структура проєкту

```
yustack/
├── index.html            # Головна сторінка (лендінг, 1 екран = офер для клієнта)
├── css/
│   └── style.css         # Всі стилі (змінні, компоненти, анімації, адаптив)
├── js/
│   ├── logo-3d.js        # 3D-лого на фоні hero (three.js r128, vanilla)
│   ├── typing.js         # Друкований слоган-хук під заголовком
│   ├── brief.js          # Форма-бриф → відкриває Telegram з готовим текстом
│   └── scroll-reveal.js  # Поява блоків під час скролу (IntersectionObserver)
├── images/
│   ├── favicon.svg       # Іконка сайту
│   └── gv.jpg            # Фото салону Galyna Voinska (відгук)
└── README.md
```

## Технології

- **HTML5 + CSS3** — семантична розмітка, кастомні властивості, grid, анімації
- **Vanilla JS** — без фреймворків і без збірки
- **three.js r128 (CDN)** — 3D-лого: глянцевий куб із PBR-відображенням, «Y»-гліф, партиклі, свічення
- **Шрифти** — Inter + JetBrains Mono (Google Fonts)

## Запуск

```bash
# Python
python3 -m http.server 8080

# Node.js (npx)
npx serve .
```

## Кастомізація

| Що змінити        | Де                                     |
|-------------------|----------------------------------------|
| Кольори / шрифти  | `css/style.css` → `:root { ... }`      |
| Тексти / секції   | `index.html`                           |
| 3D-лого           | `js/logo-3d.js`                        |
| Контакти          | `index.html` → секція `#contact`       |

## Контакти YuStack

- Telegram: [@YuraWoin](https://t.me/YuraWoin)
- Instagram: [yustack7](https://www.instagram.com/yustack7)
- Email: [uravoinskij@gmail.com](mailto:uravoinskij@gmail.com)
- GitHub: [github.com/YuraWoin/yustack](https://github.com/YuraWoin/yustack)
- Сайт (Netlify): https://yustack.netlify.app/