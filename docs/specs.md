# Repository Guidelines

## Project Overview

**LifeQuran PWA** adalah aplikasi Al-Quran digital berbasis Progressive Web App (PWA) yang dirancang untuk platform mobile-first (max-width 480px). Aplikasi ini memungkinkan pengguna membaca Al-Quran dengan terjemahan Bahasa Indonesia, melacak progres bacaan, serta mendapatkan motivasi melalui sistem gamifikasi (XP, level, streak, badge).

**Tagline:** _Istiqomah Setiap Hari_

### Fitur Utama
- Baca 114 surah Al-Quran dengan teks Arab + terjemahan Bahasa Indonesia
- Navigasi berdasarkan Surah, Juz, atau pencarian
- Sistem gamifikasi: XP, level (1–10), streak harian, daily challenge, achievement/badge
- Bookmark ayat
- Progres bacaan (total halaman, total waktu, riwayat sesi)
- Pengaturan: dark mode, ukuran font, bahasa (id/en), qari audio
- Offline-first: data tersimpan di localStorage + dicache oleh Service Worker
- Splash screen satu kali saat pertama kali dibuka

---

## Tech Stack

| Kategori | Teknologi |
|---|---|
| Framework UI | React 18 + TypeScript |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Icons | Lucide React |
| PWA / Offline | vite-plugin-pwa (Workbox) |
| State Management | React Context API (`AppContext`) |
| Persistensi Data | `localStorage` (profil, bookmark, progress, challenge, sesi) |
| Quran API | [api.alquran.cloud/v1](https://api.alquran.cloud/v1) |
| Audio Quran | cdn.islamic.network |
| Bahasa | TypeScript strict mode |
| Linter | ESLint 9 + eslint-plugin-react-hooks |

> **Tidak ada backend / database eksternal.** Supabase telah dihapus. Seluruh data bersifat lokal pada perangkat pengguna.

---

## Folder & File Project Structure

```
lifequranpwa/
├── public/
│   └── manifest.json              # Web App Manifest (nama, ikon, warna tema)
├── src/
│   ├── main.tsx                   # Entry point — merender <AppProvider><App/>
│   ├── App.tsx                    # Root component: SplashScreen + routing tab/view
│   ├── index.css                  # Global styles (Tailwind directives)
│   ├── vite-env.d.ts              # Vite env types
│   │
│   ├── components/
│   │   └── layout/
│   │       └── BottomNav.tsx      # Bottom navigation bar (5 tab)
│   │
│   ├── context/
│   │   └── AppContext.tsx         # Global state & business logic (satu-satunya context)
│   │
│   ├── data/
│   │   └── surahs.ts             # Data statis: SURAHS[], LEVELS[], DAILY_VERSES[], BADGES[]
│   │
│   ├── i18n/
│   │   └── translations.ts       # String UI dalam bahasa 'id' dan 'en'
│   │
│   ├── lib/
│   │   └── supabase.ts           # Stub kosong (supabase telah dihapus)
│   │
│   ├── pages/
│   │   ├── HomePage.tsx          # Tab: Beranda — level, streak, daily challenge, verse of day
│   │   ├── QuranPage.tsx         # Tab: Quran — daftar surah, juz, bookmark, search
│   │   ├── ReadingPage.tsx       # View: Baca ayat — teks Arab + terjemahan per ayat
│   │   ├── ProgressPage.tsx      # Tab: Progres — statistik bacaan, grafik, riwayat sesi
│   │   ├── GamificationPage.tsx  # Tab: Gamifikasi — level, badge, leaderboard lokal
│   │   └── ProfilePage.tsx       # Tab: Profil — pengaturan, username, dark mode, dll
│   │
│   ├── services/
│   │   └── quranApi.ts           # Fetch + cache surah dari alquran.cloud API
│   │
│   └── types/
│       └── index.ts              # Semua TypeScript interface dan type aliases
│
├── docs/
│   └── specs.md                  # Dokumen ini
│
├── supabase/
│   └── migrations/               # File SQL lama (tidak aktif, bisa diabaikan)
│
├── vite.config.ts                # Konfigurasi Vite + VitePWA
├── tailwind.config.js            # Konfigurasi Tailwind CSS
├── tsconfig.app.json             # TypeScript config untuk src/
├── tsconfig.json                 # TypeScript root config
├── index.html                    # HTML entry dengan <div id="root">
└── package.json
```

### Routing / Navigation

Aplikasi tidak menggunakan React Router. Navigasi menggunakan dua state pada `AppContext`:

| State | Type | Nilai |
|---|---|---|
| `activeTab` | `TabName` | `'home' \| 'quran' \| 'progress' \| 'gamification' \| 'profile'` |
| `appView` | `AppView` | `'main' \| 'reading' \| 'surah-list' \| 'juz-list' \| 'bookmarks' \| 'search'` |

- Ketika `appView === 'reading'`, `ReadingPage` ditampilkan fullscreen di atas semua konten (z-index 30).
- Ketika `appView === 'main'`, halaman aktif dari `activeTab` ditampilkan.
- `BottomNav` selalu tersembunyi saat `appView !== 'main'`.

---

## Commands

```bash
# Development server (http://localhost:5173)
npm run dev

# Build produksi (output ke dist/)
npm run build

# Preview build produksi
npm run preview

# Type checking tanpa build
npm run typecheck

# Linting
npm run lint
```

---

## Code Style

### TypeScript

- Gunakan **strict mode** (`tsconfig.app.json` mengaktifkan `strict: true`).
- Semua interface dan type ada di `src/types/index.ts` — jangan buat interface inline di file komponen kecuali hanya untuk props lokal.
- Hindari `any`. Gunakan `unknown` jika tipe tidak pasti, lalu narrowing.
- Gunakan **type alias** untuk union pendek: `type AppView = 'main' | 'reading' | ...`
- Gunakan **interface** untuk objek/data model: `interface UserProfile { ... }`
- Selalu sertakan tipe return function async: `async function foo(): Promise<Bar>`

```typescript
// ✅ Benar
function getLevelFromXP(xp: number): number { ... }

// ❌ Hindari
function getLevelFromXP(xp) { ... }
```

### (React) Components

- **Semua komponen adalah functional component** dengan TypeScript.
- Export default untuk setiap file halaman/komponen (satu komponen per file).
- Gunakan **named export** hanya untuk hooks atau helper function kecil (`export function useApp()`).
- Props interface ditulis inline saat sederhana, atau diekspor jika dipakai di lebih dari satu file:

```tsx
// Komponen dengan props
export default function Card({ title, darkMode }: { title: string; darkMode: boolean }) { ... }

// Komponen halaman — tidak ada props eksternal, mengambil data dari useApp()
export default function HomePage() {
  const { profile, dailyChallenge } = useApp();
  ...
}
```

- Gunakan `useCallback` untuk semua event handler yang di-pass sebagai prop atau yang ada di dalam `useEffect` dependency array.
- Gunakan `useEffect` hanya untuk side effects (localStorage sync, DOM class toggle). Jangan gunakan untuk derived state — hitung langsung di body komponen.

### Imports

Urutan import yang konsisten:

```typescript
// 1. React & built-in hooks
import { useState, useEffect, useCallback } from 'react';

// 2. Paket eksternal
import { Flame, Star } from 'lucide-react';

// 3. Context / hooks internal
import { useApp } from '../context/AppContext';

// 4. Komponen
import BottomNav from '../components/layout/BottomNav';

// 5. Data statis
import { SURAHS, LEVELS } from '../data/surahs';

// 6. Tipe
import type { Surah, TabName } from '../types';
```

Gunakan **relative path** dari lokasi file saat ini. Tidak ada alias path (`@/`) dikonfigurasi.

### Naming Conventions

| Entitas | Konvensi | Contoh |
|---|---|---|
| Komponen React | PascalCase | `ReadingPage`, `BottomNav` |
| Hooks | camelCase dengan prefix `use` | `useApp` |
| Functions / variables | camelCase | `getLevelFromXP`, `darkMode` |
| Constants (data statis) | UPPER_SNAKE_CASE | `SURAHS`, `LEVELS`, `DAILY_VERSES` |
| Types / Interfaces | PascalCase | `UserProfile`, `TabName` |
| localStorage keys | `lifequran_` prefix | `lifequran_profile`, `lifequran_bookmarks` |
| API cache keys | `lifequran_surahcache_v1_` prefix | `lifequran_surahcache_v1_surah_1` |
| File komponen | PascalCase.tsx | `HomePage.tsx` |
| File non-komponen | camelCase.ts | `quranApi.ts`, `translations.ts` |
| CSS classes | Tailwind utility — tidak ada custom class kecuali di `index.css` |

### Error Handling

- Semua fungsi async di `quranApi.ts` menggunakan try/catch dan melempar `Error` dengan pesan yang jelas dalam bahasa Indonesia.
- Komponen yang fetch data harus menangani state loading dan error dengan UI fallback.
- Operasi `localStorage` selalu dibungkus try/catch (storage bisa penuh).
- **Jangan** gunakan `console.log` di production code — gunakan hanya untuk debugging sementara.

```typescript
// ✅ Pola error handling quranApi
try {
  const data = await fetch(url);
  ...
} catch {
  throw new Error('Tidak ada koneksi internet. Buka surah ini saat online terlebih dahulu.');
}
```

---

## UI Components

Aplikasi tidak menggunakan library komponen eksternal (tidak ada shadcn/ui, Material UI, dll). Semua UI dibangun dari **Tailwind CSS utility classes**.

### Komponen yang Sudah Ada

| Komponen | Path | Deskripsi |
|---|---|---|
| `BottomNav` | `src/components/layout/BottomNav.tsx` | Navigation bar bawah — 5 tab, ikon Lucide, label dari i18n |

### Pola UI yang Digunakan

**Dark Mode Pattern** — setiap komponen halaman membaca `darkMode` dari `useApp()` dan mendefinisikan local variable untuk class:

```tsx
const { darkMode } = useApp();
const bg    = darkMode ? 'bg-gray-950'  : 'bg-gray-50';
const card  = darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100';
const text  = darkMode ? 'text-gray-100' : 'text-gray-800';
const muted = darkMode ? 'text-gray-400' : 'text-gray-500';
```

**Card Pattern:**
```tsx
<div className={`${card} rounded-2xl border p-4 shadow-sm`}>
  ...
</div>
```

**Gradient Header Pattern** (digunakan di HomePage, GamificationPage):
```tsx
<div style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 40%, #34d399 100%)' }}>
  ...
</div>
```

**Button Primary:**
```tsx
<button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-semibold transition-colors">
  Label
</button>
```

**Warna Aksen Utama:** `emerald-500` (`#10b981`) — semua highlight, active state, dan CTA menggunakan warna ini.

---

## Accessibility

- Seluruh `<button>` harus memiliki teks visible atau `aria-label` yang mendeskripsikan aksi.
- Ikon Lucide selalu disertai label teks (di BottomNav, card header, dll) — tidak boleh ikon saja tanpa keterangan.
- Gunakan elemen semantik HTML: `<nav>`, `<main>`, `<section>`, `<button>` (bukan `<div onClick>`).
- Kontras warna mengikuti Tailwind defaults yang memenuhi WCAG AA untuk text.
- Font size minimum: `text-xs` (12px) — jangan di bawah itu.
- Ukuran touch target minimum: 44×44px (gunakan `p-2` atau lebih besar untuk tombol ikon).

---

## Design System

### Warna

| Token | Kelas Tailwind | Hex | Penggunaan |
|---|---|---|---|
| Primary | `emerald-500` | `#10b981` | Aksen utama, active state, CTA |
| Primary Dark | `emerald-600` | `#059669` | Hover state, gradient start |
| Primary Light | `emerald-400` | `#34d399` | Gradient end, highlight |
| Background Light | `gray-50` | `#f9fafb` | App background (light mode) |
| Background Dark | `gray-950` | `#030712` | App background (dark mode) |
| Card Light | `white` | `#ffffff` | Card background (light) |
| Card Dark | `gray-900` | `#111827` | Card background (dark) |
| Border Light | `gray-100` | `#f3f4f6` | Border (light) |
| Border Dark | `gray-800` | `#1f2937` | Border (dark) |
| Text Muted Light | `gray-500` | `#6b7280` | Secondary text (light) |
| Text Muted Dark | `gray-400` | `#9ca3af` | Secondary text (dark) |
| Danger | `red-500` | `#ef4444` | Error, delete |
| Warning | `amber-500` | `#f59e0b` | Streak, warning |
| Info | `blue-500` | `#3b82f6` | Info badge |

### Tipografi

| Kelas Tailwind | Penggunaan |
|---|---|
| `text-2xl font-bold` | Judul halaman, nama pengguna |
| `text-xl font-bold` | Sub-heading section |
| `text-base font-semibold` | Label kartu |
| `text-sm` | Body text, deskripsi |
| `text-xs` | Label kecil, caption, nav label |
| Font Arab | Sistem default browser (`font-arabic` belum dikonfigurasi khusus) |

### Spasi & Layout

- **Max width container:** `480px` — di-center secara horizontal (`style={{ maxWidth: 480, margin: '0 auto' }}`)
- **Bottom padding halaman:** `pb-24` — memberi ruang untuk `BottomNav`
- **Border radius standar:** `rounded-2xl` (16px) untuk kartu, `rounded-xl` (12px) untuk tombol
- **Gap standar:** `gap-3` (12px) untuk list item, `gap-4` (16px) untuk section

### Breakpoints

Aplikasi adalah **mobile-only** (tidak ada responsive breakpoint Tailwind yang digunakan). Tampilan desktop tetap dalam lebar 480px di tengah layar.

### Animasi

- Hanya menggunakan `transition-colors` dan `transition-all duration-200` dari Tailwind.
- Splash screen menggunakan `animation: 'pulse 2s infinite'` via inline style.
- Tidak ada library animasi eksternal.

### Ukuran Font Quran (dinamis dari settings)

| Setting `fontSize` | Kelas Tailwind Teks Arab |
|---|---|
| `small` | `text-2xl` |
| `medium` | `text-3xl` |
| `large` | `text-4xl` |
| `xlarge` | `text-5xl` |

---

## State Management — AppContext

`AppContext` (`src/context/AppContext.tsx`) adalah satu-satunya global state. Semua komponen mengakses data via hook `useApp()`.

### Data yang Dikelola

| State | Type | Persistensi |
|---|---|---|
| `profile` | `UserProfile` | localStorage `lifequran_profile` |
| `bookmarks` | `Bookmark[]` | localStorage `lifequran_bookmarks` |
| `achievements` | `Achievement[]` | localStorage `lifequran_achievements` |
| `dailyChallenge` | `DailyChallenge \| null` | localStorage `lifequran_challenge_<tanggal>` |
| `activeTab` | `TabName` | In-memory |
| `appView` | `AppView` | In-memory |
| `selectedSurahNumber` | `number` | In-memory |
| `selectedAyahNumber` | `number` | In-memory |

### Aksi yang Tersedia

| Fungsi | Deskripsi |
|---|---|
| `addXP(amount)` | Tambah XP dan hitung ulang level |
| `toggleBookmark(...)` | Tambah/hapus bookmark ayat |
| `isBookmarked(surah, ayah)` | Cek apakah ayat sudah di-bookmark |
| `completeDailyChallenge()` | Tandai tantangan harian selesai (+25 XP) |
| `updateSettings(settings)` | Update pengaturan pengguna |
| `recordReadingSession(...)` | Catat sesi baca, update streak, tambah XP |
| `checkAndUpdateStreak()` | Perbarui streak harian |
| `openReading(surah, ayah?)` | Buka halaman baca pada surah tertentu |
| `setActiveTab(tab)` | Ganti tab aktif |
| `setAppView(view)` | Ganti view aktif |

### Sistem XP & Level

- Setiap halaman yang dibaca = +10 XP
- Menyelesaikan daily challenge = +25 XP
- Level dihitung dari `LEVELS[]` di `src/data/surahs.ts` (10 level)
- Level ditampilkan dengan emoji badge (🌱 → 🌟)

---

## Offline Strategy

| Layer | Mekanisme | TTL |
|---|---|---|
| Aset statis (JS/CSS/HTML) | Service Worker precache (Workbox) | Selamanya (sampai app update) |
| Data Quran API | `CacheFirst` Workbox + localStorage | 1 tahun (network), permanen (localStorage) |
| Audio Quran CDN | `CacheFirst` Workbox | 30 hari |
| Profil & progress user | localStorage murni | Permanen |
| Data statis (SURAHS, LEVELS) | Bundle JS (tidak butuh network) | N/A |

Surah yang **belum pernah dibuka saat online** tidak akan tersedia offline. Tampilkan pesan error yang informatif dalam kondisi ini.
