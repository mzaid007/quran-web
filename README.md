# Al-Qur'an Web (القرآن الكريم)

A modern, responsive, and ad-free Quran web application built with **React**, **Vite**, **TypeScript**, and **Tailwind CSS**.

---

## Features

- **Translation Options**:
  - **The Clear Quran**: Full 6,236 verses translated by **Dr. Mustafa Khattab**.
  - **Roman Urdu**: Complete contemporary Urdu translation in Latin script by **Syed Abul A'la Maududi (*Tafheem-ul-Quran*)** for Urdu learners who read English script.
  - **Saheeh International**: Standard English literal translation.
  - **Tafsir al-Jalalayn**: Classical explanatory commentary.
- **Multi-Device Cloud Sync (Neon PostgreSQL)**:
  - Resume reading across mobile, tablet, and desktop.
  - Seamless email-only device pairing without passwords or tracking.
  - Built-in conflict override guard when switching active devices.
  - Syncs reading progress (`Last Read`), bookmarks, and reader settings.
- **Go-To-Verse Navigation**:
  - Sticky header Ayah dropdown and Surah card jump bar with smooth scroll and visual highlight pulse.
- **Authentic Arabic Typography**:
  - **Medina Uthmani Script**: King Fahad Glorious Quran Printing Complex font (`hafs-android.ttf`).
  - **IndoPak Script**: Authentic South Asian Nastaliq calligraphy (`qalammajeed3-android.ttf`).
- **Word-by-Word (WBW)**: Interactive token-by-token Arabic vocabulary breakdown and translation (Beta learning aid).
- **Transliteration**: Phonetic pronunciation with accurate vowel elongation and tajweed emphasis.
- **Audio Recitations**: Ayah-by-Ayah streaming playback with auto-scrolling (Mishary Rashid Alafasy, Saad Al-Ghamdi, Abdur-Rahman As-Sudais, Mahmoud Khalil Al-Husary).
- **Reading Progress & Persistence**:
  - One-click **"Mark as Last Read"** with quick resume button and smooth viewport centering.
  - Multi-verse **Bookmarks** saved locally and synced to Neon cloud.
- **Themes & Responsive Design**: Elegant Emerald/Teal palette with seamless Light and Dark mode support.
- **100% Ad-Free & Privacy First**: Completely self-contained application with minimal data footprint.

---

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS + Lucide Icons
- **Deployment**: Vercel ready

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm

### Installation

```bash
git clone https://github.com/mzaid007/quran-web.git
cd quran-web
npm install
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Environment Variables

For multi-device sync with Neon PostgreSQL, configure the following in your Vercel Project Settings or local `.env`:

```env
DATABASE_URL=postgres://user:password@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
```

---

## License

Open-source and free for personal and community use.
