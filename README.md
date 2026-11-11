<div align="center">

# 🍳 ResepinAja
### *Find Recipes. Cook with Ease.*

Platform penemuan resep masakan, perencanaan menu harian, dan pencatatan belanja berbasis **Progressive Web App (PWA)** dengan kemampuan **Offline-First**.

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.11-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-557A46?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

---

</div>

## 📌 Daftar Isi
1. [Tentang Proyek](#-tentang-proyek)
2. [Identitas Pengembang & Kelompok](#-identitas-pengembang--kelompok)
3. [Fitur Utama](#-fitur-utama)
4. [Tampilan Antarmuka & UX Mewah](#-tampilan-antarmuka--ux-mewah)
5. [Spesifikasi Teknologi (Tech Stack)](#-spesifikasi-teknologi-tech-stack)
6. [Struktur Folder Proyek](#-struktur-folder-proyek)
7. [Panduan Instalasi & Menjalankan Lokal](#-panduan-instalasi--menjalankan-lokal)
8. [Setup Database Supabase](#-setup-database-supabase)
9. [Fitur PWA & Offline Support](#-fitur-pwa--offline-support)
10. [Panduan Deployment ke Vercel](#-panduan-deployment-ke-vercel)

---

## 📖 Tentang Proyek

**ResepinAja** adalah aplikasi web modern yang dirancang untuk memecahkan kebingungan harian: *"Hari ini mau masak apa?"*. Aplikasi ini memudahkan pengguna menemukan resep masakan nusantara maupun mancanegara berdasarkan bahan yang ada di kulkas, mengelola resep pribadi, merancang jadwal menu makan mingguan, serta menyusun daftar belanja bahan secara otomatis.

Dikembangkan dengan pendekatan **Mobile-First & Desktop-Responsive PWA**, aplikasi ini dapat diinstal di smartphone maupun laptop layaknya aplikasi *native*, serta dapat diakses penuh meskipun perangkat dalam kondisi **offline tanpa koneksi internet**.

### 🎯 Target Pengguna
- **Mahasiswa**: Membutuhkan ide masakan praktis, hemat, dan memanfaatkan bahan yang ada di kos.
- **Pekerja Sibuk**: Membutuhkan resep cepat saji (≤ 20 menit) untuk sarapan atau makan malam.
- **Ibu Rumah Tangga / Keluarga**: Perencanaan variasi menu mingguan dan daftar belanja kebutuhan dapur.
- **Pencinta Kuliner**: Menyimpan dan mendokumentasikan kreasi resep pribadi.

---

## 👥 Identitas Pengembang & Kelompok

| Data Mahasiswa | Keterangan |
| :--- | :--- |
| **Nama Lengkap** | **Ahmad Dika Styansah** |
| **NIM** | **21120124130052** |
| **Kelompok** | **Kelompok 23** |
| **Email** | `dikatzy@gmail.com` |
| **Program Studi** | Teknik Komputer |
| **Fakultas / Universitas** | Fakultas Teknik / Universitas Diponegoro |
| **Mata Kuliah** | Praktikum Pemrograman Perangkat Bergerak |

> 💡 **Info Kontak**: Halaman **Info Kontak** telah tersedia di aplikasi (`/kontak`) yang menampilkan profil pengembang, kontak email (`dikatzy@gmail.com`), tautan GitHub, dan fasilitas salin cepat identitas pengembang.

---

## 🚀 Fitur Utama

Sesuai dengan *Product Requirements Document (PRD)*, ResepinAja memiliki 10 fitur komprehensif:

### 1. 🏠 Home / Dashboard
- **Animasi Startup**: Splash screen animasi topi koki dengan bilah proses pembuka saat aplikasi pertama kali dimuat.
- **Personalized Greeting**: Ucapan selamat pagi/siang/sore/malam dinamis sesuai jam pengguna.
- **Hero Search Bar**: Kolom pencarian resep instan dengan kata kunci saran populer.
- **Live Counter Banner**: Statistik langsung total koleksi resep, jumlah kategori, dan total resep favorit.
- **Kategori Masakan Interaktif**: Pilihan 8 kategori masakan dengan ikon dan warna khas.
- **Resep Rekomendasi Hari Ini**: Kartu resep sorotan (*featured card*) bergaya modern.
- **Resep Populer, Cepat (≤ 20 Menit), & Terbaru**: Pembagian kurasi resep sesuai kebutuhan waktu.

### 2. 🔍 Recipe Explorer
- Pencarian cerdas berdasarkan nama resep, bumbu, atau kategori.
- Filter multi-kategori: *Makanan Utama, Sarapan, Camilan, Minuman, Dessert, Sup & Soto, Seafood, Vegetarian*.
- Filter tingkat kesulitan: *Mudah, Sedang, Sulit*.
- Pengurutan (*Sorting*): *Terbaru, Terlama, Waktu Tercepat, Nama A-Z, Nama Z-A*.

### 3. 📄 Recipe Detail Interaktif
- Foto makanan resolusi tinggi dengan efek *lazy loading blur-up*.
- Informasi waktu persiapan, waktu memasak, total durasi, dan tingkat kesulitan.
- **Dynamic Servings Scaler**: Pengatur porsi (`-` dan `+`) yang secara otomatis menghitung ulang takaran seluruh bahan masakan.
- **Interactive Cooking Mode**: Setiap langkah memasak dapat dicentang dengan bilah kemajuan (*progress bar*) dan notifikasi selebrasi saat semua langkah selesai.
- Tombol **"Ke Daftar Belanja"**: Memasukkan seluruh bahan resep ke daftar belanja hanya dengan sekali klik.
- Tombol **Bagikan Tautan**: Salin tautan resep langsung ke papan klip (*clipboard*).

### 4. 🥦 Ingredient Search (Cari dari Bahan)
- Masukkan bahan-bahan yang tersedia di dapur (misal: *ayam, telur, bawang*).
- Algoritma pencocokan menghitung **persentase kecocokan (*match percentage*)** untuk setiap resep.
- Menampilkan resep teratas yang dapat langsung dimasak tanpa perlu belanja tambahan.

### 5. 👨‍🍳 My Recipes (Koleksi Resep Pribadi)
- Manajemen CRUD penuh (*Create, Read, Update, Delete*).
- Tambahkan foto, durasi persiapan, waktu memasak, porsi, kategori, takaran bahan, dan tahapan instruksi.
- Label khusus *"Resep Saya"* pada setiap hidangan buatan pengguna.

### 6. ❤️ Favorites
- Simpan resep favorit dengan tombol hati (*heart pop micro-animation*).
- Akses cepat ke seluruh resep kesukaan pengguna.
- Sinkronisasi instan ke penyimpanan lokal.

### 7. 📅 Meal Planner (Rencana Menu Mingguan)
- Kalender mingguan interaktif untuk mengatur menu harian.
- 4 slot makan per hari: *Sarapan 🌅, Makan Siang ☀️, Makan Malam 🌙, dan Camilan 🍪*.
- Pilih resep langsung dari daftar koleksi ke dalam jadwal yang diinginkan.

### 8. 🛍️ Shopping List (Daftar Belanja Bahan)
- Catat bahan belanjaan secara manual atau ambil otomatis dari detail resep.
- Tandai bahan yang sudah dibeli dengan *checklist*.
- Bilah persentase kelengkapan belanja (*progress bar* belanja).
- Filter pembersihan: Hapus bahan yang sudah selesai dibeli atau bersihkan seluruh daftar.

### 9. 👤 Profil Mahasiswa & Pengguna
- Menampilkan Nama, NIM, Kelompok, dan Email.
- Lencana identitas resmi untuk keperluan penilaian tugas kuliah.
- Statistik ringkasan: jumlah resep dibuat, total favorit, menu terjadwal, dan item belanjaan.

### 10. ⚙️ Pengaturan & Backup Data
- **Ekspor Data**: Mengunduh seluruh data aplikasi ke file cadangan `.json`.
- **Impor Data**: Memulihkan data resep, favorit, jadwal, dan belanja dari file `.json`.
- **Tentang Proyek**: Modal interaktif berisi rincian PRD, identitas tim, dan arsitektur sistem.
- **Reset Data**: Fitur pembersihan penyimpanan lokal dengan konfirmasi keamanan.

### 11. 📇 Info Kontak & Tim Pengembang
- Halaman identitas resmi pengembang: **Ahmad Dika Styansah** (NIM: **21120124130052**, Kelompok: **23**).
- Tombol salin satu-klik (*One-Click Copy*) untuk NIM, Kelompok, dan seluruh data identitas mahasiswa.
- Tautan kontak email mahasiswa dan repositori GitHub pengembang.
- Formulir umpan balik (*Feedback Form*) langsung untuk pengguna.

---

## 🎨 Tampilan Antarmuka & UX Mewah

Aplikasi dibangun mengikuti filosofi desain: *Modern, Warm, Clean, Premium, Minimalist, Fresh, & Appetizing*.

| Token Desain | Nilai Warna | Kegunaan |
| :--- | :--- | :--- |
| **Primary Background** | `#FAF9F6` | Latar belakang hangat dan natural |
| **Surface** | `#FFFFFF` | Latar kartu dan panel konten |
| **Primary Green** | `#557A46` | Warna utama tombol, aksen aktif, dan identitas kuliner |
| **Secondary Green** | `#8DAA75` | Lencana, highlight, dan aksen pelengkap |
| **Accent Orange** | `#E99552` | Aksen hidangan lezat dan highlight rating/porsi |
| **Soft Cream** | `#F1EBDD` | Tag kategori dan elemen lembut |
| **Primary Text** | `#252820` | Teks judul dengan kontras tinggi |
| **Secondary Text** | `#77786F` | Teks deskripsi dan metadata sekunder |
| **Border Color** | `#EAE8E1` | Garis batas tipis yang elegan |

### 💫 Sentuhan Mikroanimasi & Liquid Glass Design:
- **iOS Liquid Glass Floating Capsule Navigation**: Bilah navigasi atas (Desktop) dan bilah navigasi bawah (Mobile) dirancang melayang (*floating capsule*) dengan efek kaca cair (*liquid glass / frosted glassmorphism blur-2xl*) ala iOS iPhone dengan pantulan specular dan border halus.
- **Startup Splash Animation**: Layar intro memukau saat membuka aplikasi.
- **Heart Pop Bounce**: Animasi pegas pada ikon favorit saat ditekan.
- **Floating Luxury Toast Notification**: Notifikasi mengambang saat aksi berhasil dilakukan.
- **Shimmer Skeleton Loader**: Animasi bayangan saat gambar makanan sedang dimuat.
- **Corner PWA Install Banner**: Notifikasi instalasi di pojok bawah dengan opsi *"Ya, Pasang"*, *"Tidak, Nanti"*, atau tombol silang *(X)*.

---

## 🛠️ Spesifikasi Teknologi (Tech Stack)

- **Frontend Framework**: [React 18.3.1](https://reactjs.org/)
- **Build Tool & Bundler**: [Vite 5.4.3](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3.4.11](https://tailwindcss.com/) dengan PostCSS & Autoprefixer
- **Routing**: [React Router v6.26.2](https://reactrouter.com/) (dengan `React.lazy()` & code-splitting)
- **Icons**: [Lucide React 0.441.0](https://lucide.dev/)
- **PWA Engine**: [vite-plugin-pwa 0.20.5](https://vite-pwa-org.netlify.app/) (Workbox caching & manifest)
- **Local Database**: HTML5 LocalStorage *(Offline-First Persistence)*
- **Cloud Database (Opsional)**: [Supabase](https://supabase.com/) (PostgreSQL dengan Row Level Security)
- **Deployment Target**: [Vercel](https://vercel.com/)

---

## 📁 Struktur Folder Proyek

```
d:\ResepinAja\
├── public/
│   ├── favicon.svg                # Favicon aplikasi
│   └── icons/
│       ├── icon-192.png           # Ikon PWA 192x192
│       └── icon-512.png           # Ikon PWA 512x512 (maskable)
├── src/
│   ├── assets/                    # Aset grafis statis
│   ├── components/
│   │   ├── forms/
│   │   │   └── RecipeForm.jsx     # Formulir input/edit resep
│   │   ├── layout/
│   │   │   ├── BottomNav.jsx      # Navigasi bawah untuk mobile
│   │   │   ├── Layout.jsx         # Pembungkus layout utama responsif
│   │   │   └── Navbar.jsx         # Navigasi atas desktop & mobile
│   │   └── ui/
│   │       ├── CategoryCard.jsx   # Kartu kategori masakan
│   │       ├── EmptyState.jsx     # Tampilan status kosong
│   │       ├── FilterBar.jsx      # Bilah filter & pengurutan
│   │       ├── InstallPrompt.jsx  # Pop-up pasang PWA di pojok bawah
│   │       ├── LazyImage.jsx      # Gambar dengan shimmer skeleton & fallback
│   │       ├── Modal.jsx          # Modal dialog interaktif
│   │       ├── PageLoader.jsx     # Loader transisi antar halaman
│   │       ├── RecipeCard.jsx     # Kartu resep dengan efek mikroanimasi
│   │       ├── SearchBar.jsx      # Kolom pencarian resep
│   │       └── StartupSplash.jsx  # Animasi intro pembuka aplikasi
│   ├── context/
│   │   └── ToastContext.jsx       # Manajemen notifikasi toast mengambang
│   ├── data/
│   │   └── sampleRecipes.js       # 12 resep bawaan nusantara & mancanegara
│   ├── hooks/
│   │   ├── useFavorites.js        # Hook pengelolaan resep favorit
│   │   ├── useMealPlanner.js      # Hook jadwal menu mingguan
│   │   ├── useProfile.js          # Hook profil (Nama, NIM, Kelompok)
│   │   ├── useRecipes.js          # Hook data resep (bawaan + resep pribadi)
│   │   └── useShoppingList.js     # Hook daftar belanja bahan
│   ├── pages/
│   │   ├── Explore.jsx            # Halaman Jelajah Resep
│   │   ├── Favorites.jsx          # Halaman Resep Favorit
│   │   ├── Home.jsx               # Halaman Beranda Utama
│   │   ├── IngredientSearch.jsx   # Halaman Cari Resep dari Bahan
│   │   ├── MealPlanner.jsx        # Halaman Perencanaan Menu
│   │   ├── MyRecipes.jsx          # Halaman Koleksi Resep Pribadi (CRUD)
│   │   ├── Profile.jsx            # Halaman Profil & Identitas Mahasiswa
│   │   ├── RecipeDetail.jsx       # Halaman Detail & Mode Memasak
│   │   ├── Settings.jsx           # Halaman Pengaturan & Backup Data
│   │   └── ShoppingList.jsx       # Halaman Daftar Belanja Bahan
│   ├── utils/
│   │   ├── helpers.js             # Fungsi utilitas (durasi, filter, kalkulasi)
│   │   ├── localStorage.js        # Utilitas penyimpanan lokal & ekspor/impor
│   │   └── supabase.js            # Inisialisasi client Supabase
│   ├── App.jsx                    # Routing & konfigurasi lazy loading
│   ├── index.css                  # Style global & Tailwind utilities
│   └── main.jsx                   # Titik masuk utama & registrasi Service Worker
├── supabase/
│   ├── full_setup.sql             # SQL Schema lengkap + RLS + Seed 12 resep
│   └── migrations/
│       ├── 001_initial_schema.sql # Skema tabel & trigger
│       └── 002_seed_recipes.sql   # Data awal resep masakan
├── .env                           # Konfigurasi environment lokal
├── .env.example                   # Template variabel environment
├── .gitignore                     # Daftar pengecualian Git
├── index.html                     # HTML template utama PWA
├── package.json                   # Dependensi & skrip proyek
├── postcss.config.js              # Konfigurasi PostCSS
├── tailwind.config.js             # Konfigurasi tema & animasi Tailwind
├── vercel.json                    # Konfigurasi routing SPA & header Vercel
└── vite.config.js                 # Konfigurasi Vite & Workbox PWA
```

---

## 💻 Panduan Instalasi & Menjalankan Lokal

### Prasyarat
- [Node.js](https://nodejs.org/) versi 18 atau lebih baru.
- Paket manajer [pnpm](https://pnpm.io/) (atau `npm` / `yarn`).

### Langkah-langkah:

1. **Clone atau Masuk ke Direktori Proyek**:
   ```bash
   cd d:\ResepinAja
   ```

2. **Pasang Dependensi**:
   ```bash
   pnpm install --ignore-scripts
   ```

3. **Konfigurasi Environment Variable**:
   File `.env` sudah tersedia secara otomatis. Jika diperlukan, sesuaikan nilai kredensial Supabase Anda:
   ```env
   VITE_SUPABASE_URL=https://urelntbrlxwvssfglwll.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_3EDlVkDSw2u-UDA2rWcU4Q_21ScHIPg
   ```

4. **Jalankan Server Development**:
   ```bash
   pnpm run dev
   ```
   Aplikasi akan aktif di `http://localhost:5173`. Buka tautan tersebut pada peramban Anda.

5. **Build untuk Produksi**:
   ```bash
   pnpm run build
   ```

6. **Uji Coba Hasil Build**:
   ```bash
   pnpm run preview
   ```

---

## 🗄️ Setup Database Supabase

Jika ingin menghubungkan aplikasi dengan database cloud Supabase:

1. Buka [Supabase Dashboard](https://supabase.com/dashboard) dan pilih project Anda.
2. Masuk ke menu **SQL Editor** pada navigasi kiri.
3. Buka file `supabase/full_setup.sql`, salin seluruh kodenya, tempelkan ke SQL Editor, lalu klik tombol **Run**.
4. Skema database, trigger otomatis `updated_at`, fungsi pembuatan profil akun baru, kebijakan Row Level Security (RLS), serta 12 seed data resep awal akan langsung terpasang.

---

## 📱 Fitur PWA & Offline Support

ResepinAja memenuhi seluruh standar instalasi Progressive Web App:
- **Ikon Standar**: Ikon resolusi 192px dan 512px (maskable).
- **Service Worker Otomatis**: Melakukan precache terhadap file HTML, CSS, JavaScript, dan ikon statis.
- **Cache-First Gambar Makanan**: Gambar dari Unsplash disimpan dalam cache browser lokal hingga 30 hari.
- **Instalasi Satu Klik**: Klik tombol **"Ya, Pasang"** pada pop-up di pojok bawah layar atau ikon komputer di bilah alamat browser untuk menginstal aplikasi ke perangkat.

---

## ☁️ Panduan Deployment ke Vercel

Proyek ini sudah dilengkapi konfigurasi `vercel.json` untuk menangani *Single Page Application (SPA) rewrite* dan caching aset statis.

1. Pasang Vercel CLI (jika belum terpasang):
   ```bash
   pnpm add -g vercel
   ```

2. Lakukan deployment langsung dari terminal:
   ```bash
   vercel --prod
   ```

3. Pada **Vercel Dashboard ➔ Project Settings ➔ Environment Variables**, masukkan:
   - `VITE_SUPABASE_URL` = URL project Supabase Anda
   - `VITE_SUPABASE_ANON_KEY` = Anon key Supabase Anda

---

<div align="center">

**ResepinAja** · *Dibuat dengan ❤️ untuk kemudahan memasak setiap hari.*

</div>
