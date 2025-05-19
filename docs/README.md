# Chill Movie Apps

![Chill Movie Apps Logo](/src/assets/images/logo/LogoWithBG.png)

## Deskripsi

Chill Movie Apps adalah aplikasi streaming film berbasis web yang memungkinkan pengguna untuk menjelajahi dan menonton berbagai film dan acara TV. Aplikasi ini dibangun menggunakan React dan Vite untuk memberikan pengalaman pengguna yang cepat dan responsif.

## Fitur Utama

- **Autentikasi Pengguna**: Sistem login dan registrasi untuk manajemen akun pengguna
- **Halaman Beranda**: Menampilkan film-film populer, film yang sedang ditonton, dan rekomendasi
- **Carousel Film**: Tampilan film yang interaktif dan menarik
- **Responsif**: Tampilan yang optimal di berbagai perangkat (desktop, tablet, mobile)

## Teknologi yang Digunakan

- **Frontend**: React 19
- **Routing**: React Router DOM 7.5
- **Build Tool**: Vite 6.2
- **Linting**: ESLint 9.21

## Struktur Proyek

```
├── assets/            # Aset statis (gambar, logo, dll)
├── src/
│   ├── components/    # Komponen React yang dapat digunakan kembali
│   │   ├── auth/      # Komponen terkait autentikasi
│   │   ├── home/      # Komponen untuk halaman beranda
│   │   └── layout/    # Komponen layout (header, footer)
│   ├── pages/         # Halaman utama aplikasi
│   ├── styles/        # File CSS global
│   ├── App.jsx        # Komponen utama aplikasi
│   └── main.jsx       # Entry point aplikasi
└── index.html         # File HTML utama
```

## Cara Instalasi

1. Clone repositori ini
   ```bash
   git clone https://github.com/username/chill-movie-apps.git
   cd chill-movie-apps
   ```

2. Install dependensi
   ```bash
   npm install
   ```

3. Jalankan aplikasi dalam mode development
   ```bash
   npm run dev
   ```

4. Buka browser dan akses `http://localhost:5173`

## Build untuk Production

Untuk membuat versi production dari aplikasi:

```bash
npm run build
```

Untuk preview build production:

```bash
npm run preview
```


---

Dibuat dengan ❤️ dari Dapuk
