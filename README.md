# 👑 Diana Scorpi — Premium Media Kit 2026

Естетичний та сучасний інтерактивний Media Kit для TikTok & Instagram кріейторки **Diana Scorpi**.

## 🚀 Деплой на GitHub Pages (Безкоштовний хостинг)

Сайт абсолютно готовий до безкоштовного хостингу через **GitHub Pages**. Для цього потрібно виконати кілька простих кроків:

### Крок 1: Створення репозиторію на GitHub
1. Зайдіть на [GitHub.com](https://github.com) та авторизуйтесь.
2. Натисніть **New Repository** (Створити новий репозиторій).
3. Назвіть репозиторій, наприклад `media-kit` або `diana-scorpi`.
4. Зробіть його **Public** (Публічним).

### Крок 2: Завантаження коду
У терміналі (або через програмку GitHub Desktop) виконайте:

```bash
git init
git add .
git commit -m "Initial commit: Media Kit 2026"
git branch -M main
git remote add origin https://github.com/ВАШ_НІКНЕЙМ/media-kit.git
git push -u origin main
```

### Крок 3: Увімкнення GitHub Pages
1. Перейдіть у ваш репозиторій на GitHub -> **Settings** (Налаштування).
2. Ліворуч виберіть вкладку **Pages**.
3. У розділі **Build and deployment**:
   - Source: `Deploy from a branch`
   - Branch: виберіть `main` і папку `/ (root)`
4. Натисніть **Save**.
5. Зачекайте 1-2 хвилини — ваша лінка з'явиться зверху (наприклад `https://your-username.github.io/media-kit/`)!

---

## 🛠️ Локальне протестувати на ПК (Windows / PowerShell)

Для локального перегляду можна використати Python або Node.js сервер:

```powershell
# Варіант 1: Через Python
python -m http.server 8000

# Варіант 2: Через npx serve
npx serve .
```

Після цього відкрийте `http://localhost:8000` у браузері.
