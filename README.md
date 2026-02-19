# ✨ LifeQuran PWA

> **Istiqomah Setiap Hari** — A Progressive Web App for Digital Quran Reading with Gamification

[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![code style: tailwind](https://img.shields.io/badge/style-Tailwind%20CSS-green.svg)](https://tailwindcss.com)
[![mobile first](https://img.shields.io/badge/design-Mobile%20First-orange.svg)](docs/specs.md)
[![pwa](https://img.shields.io/badge/app-PWA-purple.svg)](https://web.dev/progressive-web-apps)
[![offline ready](https://img.shields.io/badge/offline-Ready%20✓-success.svg)](docs/specs.md#offline-strategy)

---

## 📖 Overview

**LifeQuran** adalah aplikasi Al-Quran digital yang modern, responsif, dan dapat diakses offline. Dilengkapi dengan fitur gamifikasi untuk meningkatkan motivasi membaca Quran secara rutin. Aplikasi ini dibangun dengan teknologi terkini dan dirancang khusus untuk perangkat mobile dengan dukungan penuh untuk mode offline.

**Fitur Unggulan:**
- 📱 **Mobile-First Design** — Optimal untuk smartphone (480px max-width)
- 📡 **Offline-First** — Baca Quran tanpa internet setelah dibuka sekali
- 🎮 **Gamifikasi** — XP, level, streak harian, daily challenge, badge
- 🔖 **Bookmark Ayat** — Simpan ayat favorit dengan mudah
- 📊 **Progress Tracking** — Pantau statistik bacaan (halaman, waktu, riwayat)
- 🌓 **Dark Mode** — Nyaman untuk membaca di malam hari
- 🌐 **Multi-Bahasa** — Support Bahasa Indonesia & English
- ⚡ **PWA** — Install seperti aplikasi native
- 🔒 **Privacy-First** — Semua data disimpan lokal, tanpa server eksternal

---

## 🚀 Quick Start

### Prasyarat
- **Node.js** 18+ dan **npm** 9+
- Modern browser (Chrome, Firefox, Safari, Edge)

### Instalasi

```bash
# Clone repository
git clone https://github.com/tamaproject360/lifequranpwa.git
cd lifequranpwa

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Buka **http://localhost:5173** di browser Anda.

### Build & Deploy

```bash
# Build untuk production
npm run build

# Preview build lokal
npm run preview
```

Output build ada di folder `dist/` yang siap di-deploy ke hosting statis (Vercel, Netlify, GitHub Pages, dll).

---

## ✅ Fitur

### 📚 Membaca Quran
- [x] 114 Surah Al-Quran lengkap dengan terjemahan Bahasa Indonesia
- [x] Navigasi per Surah, Juz, atau ayat tertentu
- [x] Teks Arab + Terjemahan + Transliterasi (settable)
- [x] Ukuran font dinamis (small, medium, large, xlarge)
- [x] Paginasi lancar antar ayat

### 🎯 Gamifikasi
- [x] Sistem XP & Level (1–10, reset otomatis per siklus)
- [x] Streak harian dengan freeze option
- [x] Daily Challenge (target halaman per hari)
- [x] Achievement/Badge sistem
- [x] Local leaderboard

### 📊 Progress & Analytics
- [x] Total halaman dibaca
- [x] Total waktu membaca
- [x] Riwayat sesi bacaan per hari
- [x] Progress bar keseluruhan Quran (604 halaman)
- [x] Grafik & statistik interaktif

### 🔖 User Features
- [x] Bookmark ayat dengan preview
- [x] Custom username & avatar
- [x] Pengaturan lengkap (dark mode, bahasa, qari, reminder)
- [x] Last reading position (auto-resume)
- [x] Splash screen onboarding

### 🌐 Technical
- [x] Offline-first dengan Service Worker
- [x] Cache strategy CacheFirst untuk API Quran
- [x] LocalStorage persistence (semua data lokal)
- [x] Dark mode native
- [x] PWA installable
- [x] Mobile-responsive (480px constraint)
- [x] TypeScript strict mode

---

## 💻 Tech Stack

| Layer | Technology |
|---|---|
| **UI Framework** | React 18 + TypeScript |
| **Build Tool** | Vite 5 |
| **Styling** | Tailwind CSS 3 |
| **Icons** | Lucide React |
| **PWA** | vite-plugin-pwa + Workbox |
| **State Management** | React Context API |
| **Data Persistence** | Browser localStorage |
| **API Client** | Fetch API |
| **Quran API** | [api.alquran.cloud/v1](https://api.alquran.cloud/v1) |
| **Linter** | ESLint 9 + Prettier |
| **Package Manager** | npm |

**Tidak ada backend atau database eksternal.** Semua data bersifat lokal pada perangkat pengguna.

---

## 📁 Project Structure

Dokumentasi lengkap folder structure ada di [docs/specs.md#folder--file-project-structure](docs/specs.md#folder--file-project-structure).

```
lifequranpwa/
├── src/
│   ├── pages/           # Halaman utama (Home, Quran, Progress, Gamification, Profile)
│   ├── components/      # Reusable components
│   ├── context/         # AppContext (global state)
│   ├── services/        # API calls & business logic
│   ├── data/            # Static data (SURAHS, LEVELS, translations)
│   ├── i18n/            # Translations (id, en)
│   ├── types/           # TypeScript interfaces
│   └── lib/             # Utilities & helpers
├── docs/
│   └── specs.md         # Architecture & guidelines (baca ini!)
├── public/              # Static assets
└── vite.config.ts       # Vite + PWA configuration
```

---

## 🛠️ Development

### Available Commands

```bash
# Development server dengan hot reload
npm run dev

# Type checking (no build)
npm run typecheck

# ESLint & fix
npm run lint

# Production build
npm run build

# Preview production build
npm run preview
```

### Code Style & Guidelines

Lihat [docs/specs.md](docs/specs.md) untuk panduan lengkap tentang:
- TypeScript conventions
- React component patterns
- Naming conventions
- Error handling
- UI/UX patterns
- Accessibility standards

**Ringkasan:**
- ✅ TypeScript strict mode
- ✅ Functional components dengan hooks
- ✅ Context API untuk state global
- ✅ Tailwind CSS (no custom CSS kecuali global)
- ✅ Relative imports (no alias)
- ✅ camelCase untuk variabel/function, PascalCase untuk component/type

---

## 🔌 API Integration

### Quran Data
- **Source:** [api.alquran.cloud/v1](https://api.alquran.cloud/v1)
- **Endpoints:**
  - `/surah/{number}` — Teks Arab
  - `/surah/{number}/id.indonesian` — Terjemahan Indonesia
  - `/juz/{number}/quran-uthmani` — Data per Juz

### Caching Strategy
Lihat [docs/specs.md#offline-strategy](docs/specs.md#offline-strategy) untuk detail caching:

| Layer | Strategy | TTL |
|---|---|---|
| Static assets | Service Worker precache | Selamanya |
| Quran API | CacheFirst (network) + localStorage | 1 tahun |
| Audio CDN | CacheFirst | 30 hari |
| User data | localStorage | Permanen |

**Unlimited requests** — API alquran.cloud tidak rate-limited dan aman untuk production.

---

## 📱 PWA & Offline

### Install Aplikasi
1. Buka di browser Chrome/Edge/Firefox
2. Klik ⋮ (menu) → "Install app" / "Add to Home Screen"
3. Aplikasi siap digunakan offline

### Offline Behavior
- ✅ **Surah yang sudah dibaca** → Tersedia offline
- ✅ **Profil & progress** → Tersimpan lokal
- ❌ **Surah baru** → Pesan error informatif

**Rekomendasi:** Buka beberapa surah saat online agar tersedia offline saat perjalanan.

---

## 🤝 Contributing

Kontribusi sangat diterima! Silakan ikuti panduan di bawah:

### Setup Development Environment
```bash
git clone https://github.com/tamaproject360/lifequranpwa.git
cd lifequranpwa
npm install
npm run dev
```

### Membuat Feature Baru
1. **Baca specs.md** — Pahami arsitektur & code style
2. **Buat branch** — `git checkout -b feature/nama-fitur`
3. **Implementasi** — Ikuti conventions di docs/specs.md
4. **Test** — Jalankan `npm run typecheck` dan `npm run lint`
5. **Commit** — `git commit -m "feat: deskripsi fitur"`
6. **Push & PR** — Create Pull Request dengan deskripsi jelas

### Code Review Checklist
- [ ] Mengikuti code style di specs.md
- [ ] TypeScript strict mode pass
- [ ] ESLint green (no warnings)
- [ ] Responsive design (480px tested)
- [ ] Dark mode supported
- [ ] Offline scenario tested
- [ ] i18n strings (id + en)

---

## 📄 License

MIT License © 2026 LifeQuran Contributors

---

## 🙏 Acknowledgments

- **Al-Quran API** — [alquran.cloud](https://www.alquran.cloud)
- **Quran Translation** — [ID.Indonesian Translation](https://id.quran.com)
- **Icons** — [Lucide React](https://lucide.dev)
- **Styling** — [Tailwind CSS](https://tailwindcss.com)
- **Build Tool** — [Vite](https://vitejs.dev)

---

## 📞 Support & Feedback

- 📧 Email: [support email belum diisi]
- 🌐 Website: [website belum diisi]
- 💬 Issues: [GitHub Issues](https://github.com/tamaproject360/lifequranpwa/issues)
- 💡 Discussions: [GitHub Discussions](https://github.com/tamaproject360/lifequranpwa/discussions)

---

## 🗓️ Roadmap

### v1.0 (Current)
- [x] Core Quran reading
- [x] Gamification system
- [x] Offline support
- [x] Dark mode
- [x] PWA installable

### v1.1 (Upcoming)
- [ ] Audio Quran playback (qari selection)
- [ ] Multi-language UI improvements
- [ ] Advanced search & filters
- [ ] Social features (sharing, leaderboard sync to server)
- [ ] Tafsir integration

### v2.0 (Future)
- [ ] Backend sync (optional)
- [ ] Mobile apps (iOS/Android via Capacitor)
- [ ] Quran memorization challenge
- [ ] Community features
- [ ] Admin dashboard

---

<div align="center">

**Dibuat dengan ❤️ untuk Umat Muslim**

[⭐ Star this repo](https://github.com/tamaproject360/lifequranpwa) jika bermanfaat!

</div>
