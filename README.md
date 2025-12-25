# 📖 Manga Reader App

Aplikasi **React Native/Expo** untuk membaca manga dan light novel dengan fitur lengkap: zoom, pan, swipe, bookmark, offline save, dan history tracking.  

---

## 🚀 Features
- 📑 **Page Viewer**  
  - Zoom, pan, swipe gesture untuk membaca manga dengan nyaman.  
  - Tombol navigasi Prev/Next.  
  - Simpan chapter ke **offline storage**.  
  - Tambah manga ke **bookmark**.  
  - Auto-save ke **history** setiap kali pindah halaman.  

- ⭐ **Bookmark Screen**  
  - Simpan manga favorit.  
  - Tampilkan judul, cover, dan tanggal disimpan.  
  - Hapus bookmark langsung dari daftar.  

- 🕒 **History Screen**  
  - Catat manga terakhir dibaca.  
  - Simpan posisi halaman terakhir.  
  - Lanjutkan membaca dari halaman terakhir.  
  - Clear history dengan satu tombol.  

---

## 🛠 Tech Stack
- **React Native** (Expo)  
- **TypeScript**  
- **AsyncStorage** untuk penyimpanan lokal  
- **expo-file-system** untuk offline save  
- **react-native-image-pan-zoom** untuk zoom & pan gambar  
- **react-navigation** untuk navigasi antar screen  

---

## 📂 Project Structure
```
src/
 ├── screens/
 │    ├── PageViewer.tsx
 │    ├── BookmarkScreen.tsx
 │    └── HistoryScreen.tsx
 ├── components/
 ├── navigation/
 └── App.tsx
```

---

## ⚙️ Installation
1. Clone repo:
   ```bash
   git clone https://github.com/username/manga-reader-app.git
   cd manga-reader-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run app:
   ```bash
   expo start
   ```

---

## 📌 Usage
- Buka manga dari API/local storage → otomatis masuk ke **PageViewer**.  
- Tekan ⭐ untuk menambahkan ke **Bookmark**.  
- Bookmark bisa dilihat di **BookmarkScreen**.  
- History otomatis tersimpan setiap kali pindah halaman → bisa dilihat di **HistoryScreen**.  

---

## 🗑 Known Issues
- Judul `"Unknown Title"` muncul kalau `title` tidak dikirim saat navigate. Pastikan screen asal selalu mengirim `title`.  
- Bookmark duplikat dicegah dengan cek `mangaId + chapterId` atau `title + pages.length`.  

---

## 🤝 Contributing
Pull request welcome! Pastikan kode rapi dan konsisten dengan TypeScript + ESLint.  

---

## 📜 License
MIT License.  
