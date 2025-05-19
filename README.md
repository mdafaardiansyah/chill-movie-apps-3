# Chill Movie Apps - V2.0.0

![Chill Movie Apps Logo](/src/assets/images/logo/LogoWithBG.png)

## Deskripsi

Chill Movie Apps adalah aplikasi streaming film berbasis web yang memungkinkan pengguna untuk menjelajahi dan menonton berbagai film dan acara TV. Aplikasi ini dibangun menggunakan React dan Vite untuk memberikan pengalaman pengguna yang cepat dan responsif.

## Fitur Utama

- **Autentikasi Pengguna**: Sistem login dan registrasi untuk manajemen akun pengguna
- **Halaman Beranda**: Menampilkan film-film populer, film yang sedang ditonton, dan rekomendasi
- **Carousel Film**: Tampilan film yang interaktif dan menarik
- **Responsif**: Tampilan yang optimal di berbagai perangkat (desktop, tablet, mobile)
- **Manajemen Film Favorit**: Pengguna dapat menambahkan, mengedit, dan menghapus film favorit mereka
- **Watchlist Manager**: Fitur untuk mengelola daftar film yang ingin ditonton
- **Penyimpanan Lokal**: Data film favorit dan watchlist disimpan di localStorage untuk persistensi data
- **Dropdown Genre**: Navigasi genre film yang mudah diakses melalui dropdown menu
- **Profil Pengguna**: Dropdown menu untuk akses cepat ke pengaturan profil dan logout

## Rute Navigasi

Aplikasi ini memiliki beberapa rute navigasi utama:

1. **Halaman Login** ( `/` atau `/login`)
   - Pengguna dapat memasukkan username dan kata sandi
   - Setelah berhasil login, pengguna akan diarahkan ke Halaman Beranda
   - Terdapat tautan untuk menuju ke Halaman Register bagi pengguna baru

2. **Halaman Register** (`/register`)
   - Pengguna baru dapat mendaftarkan akun dengan mengisi formulir pendaftaran
   - Setelah berhasil mendaftar, pengguna akan diarahkan ke Halaman Login

3. **Halaman Beranda** (`/home`)
   - Halaman utama yang menampilkan konten film dan acara TV
   - Terdapat tombol Logout di header untuk keluar dari akun dan kembali ke Halaman Login
   - Navigasi ke berbagai kategori film dan acara TV
   - Dropdown menu profil pengguna untuk akses cepat ke pengaturan dan logout

4. **Halaman My List** (`/mylist`)
   - Menampilkan daftar film favorit pengguna
   - Fitur watchlist untuk mengelola film yang ingin ditonton
   - Pengguna dapat menambah, mengedit, dan menghapus film dari daftar

## Teknologi yang Digunakan

### Frontend
- **Framework**: React 19
- **Routing**: React Router DOM 7.5
- **Build Tool**: Vite 6.2
- **Linting**: ESLint 9.21

### DevOps & Deployment
- **Containerization**: Docker
- **CI/CD**: Jenkins
- **Orchestration**: Docker Compose
- **Web Server**: Nginx
- **Notifikasi**: Discord Webhook

## Struktur Proyek

```
├── deployments/         # Konfigurasi deployment
│   ├── docker/          # Konfigurasi Docker
│   │   ├── Dockerfile   # Definisi image Docker
│   │   └── nginx.conf   # Konfigurasi Nginx untuk container
│   ├── jenkins/         # Konfigurasi Jenkins
│   │   └── Jenkinsfile  # Pipeline CI/CD
│   └── nginx/           # Konfigurasi Nginx untuk server
│       └── site.conf    # Konfigurasi site untuk Nginx
├── docker-compose.yml   # Konfigurasi Docker Compose
├── src/                 # Kode sumber aplikasi
│   ├── components/      # Komponen React yang dapat digunakan kembali
│   │   ├── auth/        # Komponen terkait autentikasi
│   │   ├── home/        # Komponen untuk halaman beranda
│   │   └── layout/      # Komponen layout (header, footer)
│   ├── pages/           # Halaman utama aplikasi
│   ├── styles/          # File CSS global
│   ├── App.jsx          # Komponen utama aplikasi
│   └── main.jsx         # Entry point aplikasi
└── index.html           # File HTML utama
```

## Cara Instalasi

### Pengembangan Lokal

1. Clone repositori ini
   ```bash
   git clone https://github.com/mdafaardiansyah/chill-apps-reactjs-1.git

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

### Menjalankan dengan Docker Compose

1. Pastikan Docker dan Docker Compose sudah terinstal di sistem !

2. Clone repositori ini
   ```bash
   git clone https://github.com/mdafaardiansyah/chill-apps-reactjs-1.git
   cd chill-movie-apps
   ```

3. Jalankan aplikasi menggunakan Docker Compose
   ```bash
   docker compose up -d
   ```

4. Buka browser dan akses `http://localhost:3001`

## Deployment

Arsitektur Deployment ![Arsitektur Deployment](/docs/chill-movies-1b.png)

### Arsitektur Deployment

Aplikasi ini menggunakan arsitektur deployment sebagai berikut:

1. **CI/CD Pipeline dengan Jenkins**:
   - Checkout kode dari repository
   - Install dependencies
   - Linting dan security scan
   - Build aplikasi
   - Build dan push Docker image
   - Deploy ke server
   - Smoke test

2. **Containerization dengan Docker**:
   - Multi-stage build untuk optimasi ukuran image
   - Nginx sebagai web server di dalam container

3. **Orchestration dengan Docker Compose**:
   - Menjalankan container aplikasi
   - Konfigurasi jaringan
   - Health check

4. **Reverse Proxy dengan Nginx**:
   - Mengatur routing ke aplikasi
   - SSL/TLS termination
   - Caching statis

### Mengakses Aplikasi yang Sudah Di-deploy

Aplikasi yang sudah di-deploy dapat diakses melalui URL berikut:

-  **Prodution Deployments : [https://hsba1b-chill.glanze.site](https://hsba1b-chill.glanze.site)** 
   ```bash
   https://hsba1b-chill.glanze.site/


   Routes :

   https://hsba1b-chill.glanze.site/login

   https://hsba1b-chill.glanze.site/register

   https://hsba1b-chill.glanze.site/home
   ```

## Fitur Interaktif

### Manajemen Film Favorit
Pengguna dapat mengelola daftar film favorit mereka dengan fitur-fitur berikut:
- Menambahkan film baru ke daftar favorit dengan judul, genre, dan rating
- Mengedit informasi film yang sudah ada
- Menghapus film dari daftar favorit
- Data film favorit disimpan di localStorage untuk persistensi data

### Watchlist Manager
Fitur untuk mengelola daftar film yang ingin ditonton:
- Menambahkan film ke watchlist dengan judul dan status (ditonton/belum ditonton)
- Mengubah status film dalam watchlist
- Menghapus film dari watchlist
- Data watchlist disimpan di localStorage untuk persistensi data

### Dropdown Menu Profil
Menu dropdown pada header aplikasi yang memberikan akses cepat ke:
- Pengaturan profil pengguna
- Opsi logout
- Navigasi ke halaman lain

### Navigasi Genre
Navigasi genre film yang mudah diakses:
- Daftar genre film yang tersedia
- Dropdown menu genre di footer aplikasi
- Filter film berdasarkan genre

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
