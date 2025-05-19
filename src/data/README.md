# Struktur Data Chill Movie Apps

Folder ini berisi semua data dummy yang digunakan dalam aplikasi Chill Movie Apps. Struktur ini dibuat untuk memisahkan data dari komponen UI, mengikuti praktik terbaik dalam pengembangan React.

## Struktur Folder

Berikut adalah struktur folder data:

```
data/
├── constants.js    # Konstanta yang digunakan di seluruh aplikasi
├── favorites.js    # Data film favorit untuk komponen MovieList
├── index.js        # File ekspor utama untuk semua data
├── movies.js       # Data film untuk carousel dan tampilan utama
├── README.md       # Dokumentasi struktur data
└── watchlist.js    # Data watchlist untuk komponen WatchlistManager
```

## Penggunaan

Untuk menggunakan data dalam komponen, cukup impor dari folder data:

```jsx
// Impor data
import { continueWatchingMovies, topRatingMovies, trendingMovies } from '../data';

// Impor konstanta
import { MOVIE_STATUS, BADGE_TYPES, VIEW_TYPES } from '../data';
```

## Deskripsi File

### constants.js

Berisi konstanta-konstanta yang digunakan di seluruh aplikasi:

- `MOVIE_STATUS`: Status film untuk watchlist (pending, watched)
- `BADGE_TYPES`: Tipe badge untuk film (episode, top)
- `VIEW_TYPES`: Tipe tampilan film (landscape, portrait)

### favorites.js

Berisi data default film favorit yang digunakan sebagai nilai awal jika tidak ada data tersimpan di localStorage.

### movies.js

Berisi data film untuk carousel di halaman utama:

- `continueWatchingMovies`: Film yang sedang ditonton
- `topRatingMovies`: Film dengan rating tertinggi
- `trendingMovies`: Film yang sedang trending

### watchlist.js

Berisi data default watchlist yang digunakan sebagai nilai awal jika tidak ada data tersimpan di localStorage.

## Praktik Terbaik

1. **Pemisahan Data dan UI**: Memisahkan data dari komponen UI membuat kode lebih mudah dikelola dan diuji.

2. **Penggunaan Konstanta**: Menggunakan konstanta untuk nilai yang digunakan berulang kali di seluruh aplikasi.

3. **Struktur Modular**: Memecah data menjadi file-file terpisah berdasarkan fungsinya.

4. **Ekspor Terpusat**: Menggunakan file index.js sebagai titik masuk utama untuk semua data.