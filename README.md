# 🎓 Eğitim Platformu - Emir Taha için İnteraktif Öğrenme Sistemi

Modern, etkileşimli ve gamification öğeleriyle donatılmış bir eğitim platformu. Bu platform, öğrencilerin matematik, fen bilgisi, Türkçe ve İngilizce derslerinde eğlenerek öğrenmelerini sağlar.

## 📋 İçindekiler

- [Özellikler](#-özellikler)
- [Teknolojiler](#-teknolojiler)
- [Kurulum](#-kurulum)
- [Kullanım](#-kullanım)
- [Proje Yapısı](#-proje-yapısı)
- [Firebase Yapılandırması](#-firebase-yapılandırması)
- [Öğrenci ve Veli Panelleri](#-öğrenci-ve-veli-panelleri)
- [Gamification Sistemi](#-gamification-sistemi)
- [Katkıda Bulunma](#-katkıda-bulunma)

## ✨ Özellikler

### 🎮 Gamification Sistemi

- **Puan Sistemi**: Her doğru cevap için puan kazanma (+20 Puan)
- **Seviye Sistemi**: Puanlara göre otomatik seviye atlama (Bronz, Gümüş, Altın, Platin, Elmas)
- **Rozet Sistemi**: Başarılar için özel rozetler
  - 🎯 İlk Adım (Herhangi bir aktivite tamamlama)
  - 🧮 Matematik Dehası (10+ doğru matematik)
  - 🔭 Fen Kaşifi (10+ doğru fen)
  - 📖 Kelime Ustası (10+ doğru türkçe)
  - 🇬🇧 English Master (10+ doğru ingilizce)
  - 👑 Şampiyon (500+ puan)

### 📚 Ders Modülleri

- **Matematik**: 100 soru (Sayılar, Kesirler, Geometri, Cebir, Veri Analizi, Koordinat Sistemi)
- **Fen Bilgisi**: 100 soru (Güneş Sistemi, İnsan Vücudu, Sindirim, Dolaşım, Ekosistem)
- **Türkçe**: 100 soru (Sözcük Anlamı, Dil Bilgisi, Fiiller, Noktalama, Edebî Türler)
- **İngilizce**: 100 soru (Present Simple, Past Simple, Comparatives, Modal Verbs)

### 🤖 Akıllı Öğrenme

- **AI Öğrenme Planı**: Emir Taha'nın zayıf olduğu konuları tespit eden ve özel çalışma önerileri sunan AI destekli panel.
- **Ders Analizi**: Hangi derslerde başarılı, hangilerinde daha çok vakit harcadığını analiz eder.

### 📊 İstatistik ve Takip

- Günlük aktivite takibi
- Ders bazında başarı oranları
- Geçilen/atlanan soru istatistikleri
- Harcanan süre analizi
- Haftalık ilerleme grafikleri

### 👨‍👩‍👧 Veli Paneli

- Öğrenci performansını detaylı izleme
- Ders bazında başarı oranları
- Günlük aktivite geçmişi
- Toplam çözülen soru sayısı
- Şifre korumalı erişim (Şifre: `168859`)

### 💾 Veri Yönetimi

- **Firebase Firestore**: Gerçek zamanlı veri senkronizasyonu
- **LocalStorage**: Çevrimdışı veri depolama ve yedekleme
- Otomatik veri kaydetme
- Çoklu cihaz desteği

### 🎨 Kullanıcı Deneyimi

- Modern ve renkli arayüz
- Confetti animasyonları (Başarı kutlamaları)
- Responsive tasarım
- Kolay navigasyon
- İlerleme çubukları
- Görsel geri bildirimler

## 🛠 Teknolojiler

### Frontend

- **Next.js 16.1.4** - React framework
- **React 19.2.3** - UI kütüphanesi
- **TypeScript 5** - Tip güvenliği
- **Tailwind CSS 3.4.19** - Styling

### Backend & Database

- **Firebase 12.8.0** - Backend as a Service
  - Firestore - NoSQL veritabanı
  - Real-time synchronization

### UI/UX Kütüphaneleri

- **Lucide React 0.562.0** - İkonlar
- **Canvas Confetti 1.9.4** - Animasyonlar
- **React Confetti 6.4.0** - Kutlama efektleri

### Development Tools

- **ESLint 9** - Code linting
- **Autoprefixer 10.4.23** - CSS uyumluluğu
- **PostCSS 8.5.6** - CSS işleme
- **Babel React Compiler 1.0.0** - Performans optimizasyonu

## 🚀 Kurulum

### Gereksinimler

- Node.js 20 veya üzeri
- npm, yarn, pnpm veya bun paket yöneticisi
- Firebase hesabı (Ücretsiz plan yeterli)

### Adım 1: Projeyi Klonlayın

```bash
git clone <repository-url>
cd edu-platform
```

### Adım 2: Bağımlılıkları Yükleyin

```bash
npm install
# veya
yarn install
# veya
pnpm install
```

### Adım 3: Firebase Yapılandırması

1. [Firebase Console](https://console.firebase.google.com/) üzerinden yeni bir proje oluşturun
2. Firestore Database'i etkinleştirin
3. Web uygulaması ekleyin ve yapılandırma bilgilerini alın
4. `.env.example` dosyasını `.env.local` olarak kopyalayın:

```bash
cp .env.example .env.local
```

5. `.env.local` dosyasını Firebase yapılandırma bilgilerinizle doldurun:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Adım 4: Geliştirme Sunucusunu Başlatın

```bash
npm run dev
# veya
yarn dev
# veya
pnpm dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## 📖 Kullanım

### Öğrenci Girişi

1. Ana sayfada "Öğrenci Girişi" butonuna tıklayın
2. Ders seçin (Matematik, Fen, Türkçe, İngilizce)
3. Quiz'i çözün
4. Puanlarınızı ve rozetlerinizi kazanın

### Veli Girişi

1. Ana sayfada "Veli Girişi" butonuna tıklayın
2. Şifreyi girin (Şifre: `168859`)
3. Öğrenci istatistiklerini görüntüleyin

### Quiz Sistemi

- Her quiz dersin tüm sorularını kapsar.
- Doğru cevap: **+20 puan**
- **Pas Geçme Döngüsü**: Pas geçilen sorular kaybolmaz! Quiz sonunda otomatik olarak tekrar önünüze gelir.
- **Başarı Takibi**: Pas geçilen bir soru çözüldüğünde, istatistiklerdeki "Pas geçilen" sayısı otomatik olarak düşer.
- Quiz sonunda detaylı sonuç ekranı ve confetti kutlaması.

## 📁 Proje Yapısı

```
edu-platform/
├── src/
│   ├── lib/
│   │   └── firebase.ts          # Firebase yapılandırması
│   ├── pages/
│   │   ├── index.tsx            # Ana uygulama bileşeni
│   │   ├── _app.tsx             # Next.js app wrapper
│   │   ├── _document.tsx        # HTML document yapısı
│   │   └── api/                 # API routes (opsiyonel)
│   └── styles/
│       ├── globals.css          # Global stiller
│       └── Home.module.css      # Component-specific stiller
├── public/                      # Statik dosyalar
├── .env.local                   # Environment variables (git'e eklenmez)
├── .env.example                 # Environment variables örneği
├── next.config.ts               # Next.js yapılandırması
├── tailwind.config.js           # Tailwind CSS yapılandırması
├── tsconfig.json                # TypeScript yapılandırması
└── package.json                 # Proje bağımlılıkları
```

## 🔥 Firebase Yapılandırması

### Firestore Koleksiyonları

#### `students` Koleksiyonu

```typescript
{
  "emir_taha": {
    name: string,
    points: number,
    level: number,
    badges: string[],
    completedActivities: string[],
    skippedQuestions: string[],
    passedQuestionsBySubject: {
      matematik: number,
      fen: number,
      turkce: number,
      ingilizce: number
    },
    dailyStats: {
      [date: string]: {
        questionsAnswered: number,
        correctAnswers: number,
        pointsEarned: number
      }
    },
    subjectStats: {
      [subject: string]: {
        correct: number,
        total: number,
        timeSpent: number
      }
    }
  }
}
```

### Güvenlik Kuralları

Firestore Security Rules'u aşağıdaki gibi ayarlayın:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /students/{studentId} {
      allow read, write: if true; // Geliştirme için
      // Production için authentication ekleyin
    }
  }
}
```

## 👨‍👩‍👧 Öğrenci ve Veli Panelleri

### Öğrenci Paneli Özellikleri

- 📊 Anlık puan ve seviye gösterimi
- 🏅 Kazanılan rozetler
- 📈 İlerleme çubukları
- 🎯 Ders seçimi
- 📝 Quiz çözme
- 🎉 Başarı kutlamaları

### Veli Paneli Özellikleri

- 📊 Genel performans özeti
- 📈 Ders bazında başarı grafikleri
- 📅 Günlük aktivite geçmişi
- 🎯 Toplam çözülen soru sayısı
- ⏱️ Harcanan süre istatistikleri
- 🔒 Şifre korumalı erişim

## 🎮 Gamification Sistemi

### Puan Sistemi

- Doğru cevap: **+10 puan**
- Quiz tamamlama bonusu: **+20 puan**
- Hız bonusu (2 dk altı): **+30 puan**

### Seviye Sistemi

- Seviye 1: 0-49 puan
- Seviye 2: 50-99 puan
- Seviye 3: 100-199 puan
- Seviye 4: 200-399 puan
- Seviye 5+: Her 200 puanda bir seviye

### Rozet Sistemi

| Rozet           | Koşul               | Açıklama          |
| --------------- | ------------------- | ----------------- |
| 🌟 İlk Adım     | İlk doğru cevap     | Yolculuğa başlama |
| 🔥 Ateş Topu    | 5 üst üste doğru    | Seri başarı       |
| 🏆 Şampiyon     | 100 puan            | İlk yüz puan      |
| 📚 Bilge        | Her dersten 1+ soru | Çok yönlü öğrenme |
| ⚡ Hız Canavarı | Quiz < 2 dk         | Hızlı düşünme     |

## 🏗️ Build ve Deploy

### Production Build

```bash
npm run build
npm run start
```

### Netlify Deploy

Proje Netlify için yapılandırılmıştır. `netlify.toml` dosyası mevcuttur.

```bash
# Netlify CLI ile deploy
netlify deploy --prod
```

### Vercel Deploy

```bash
# Vercel CLI ile deploy
vercel --prod
```

## 🧪 Test

```bash
# Linting
npm run lint

# Type checking
npx tsc --noEmit
```

## 🔧 Özelleştirme

### Veli Şifresini Değiştirme

`src/pages/index.tsx` dosyasında:

```typescript
const PARENT_PASSWORD = "168859"; // Buradan değiştirin
```

### Yeni Ders Ekleme

`src/pages/index.tsx` dosyasında `allQuestions` objesine yeni ders ekleyin:

```typescript
const allQuestions = {
  matematik: [...],
  fen: [...],
  turkce: [...],
  ingilizce: [...],
  yeniDers: [ // Yeni ders
    {
      q: "Soru metni",
      a: ["Seçenek 1", "Seçenek 2", "Seçenek 3", "Seçenek 4"],
      c: 0 // Doğru cevap indeksi
    }
  ]
};
```

### Renk Temasını Değiştirme

`tailwind.config.js` dosyasında renk paletini özelleştirin.

## 📝 Lisans

Bu proje kişisel kullanım için geliştirilmiştir.

## 👨‍💻 Geliştirici

Emir Taha için özel olarak geliştirilmiş eğitim platformu.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'inizi push edin (`git push origin feature/AmazingFeature`)
5. Pull Request oluşturun

## 📞 İletişim

Sorularınız için issue açabilirsiniz.

## 🎯 Gelecek Özellikler

- [ ] Çoklu öğrenci desteği
- [ ] Öğretmen paneli
- [ ] Ödev sistemi
- [ ] Video ders entegrasyonu
- [ ] Arkadaşlarla yarışma modu
- [ ] Mobil uygulama (React Native)
- [ ] Sesli soru okuma
- [ ] AI destekli kişiselleştirilmiş öğrenme
- [ ] Sertifika sistemi
- [ ] Liderlik tablosu

## 🙏 Teşekkürler

Bu projeyi kullandığınız için teşekkür ederiz! Eğlenceli öğrenmeler! 🎓✨
