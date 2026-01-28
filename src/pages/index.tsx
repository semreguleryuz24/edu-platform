import confetti from "canvas-confetti";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import {
  Award,
  BarChart3,
  BookOpen,
  Brain,
  Calculator,
  Microscope,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import AIRecommendationPanel from "../components/AIRecommendation/AIRecommendationPanel";
import ErrorBoundary from "../components/ErrorBoundary";
import { db } from "../lib/firebase";

const EduPlatform = () => {
  const [view, setView] = useState("loading");
  const [userType, setUserType] = useState<"student" | "parent" | null>(null);
  const [studentData, setStudentData] = useState({
    name: "Emir Taha",
    points: 0,
    level: 1,
    badges: [] as string[],
    completedActivities: [] as string[],
    skippedQuestions: [] as string[],
    passedQuestionsBySubject: {
      matematik: 0,
      fen: 0,
      turkce: 0,
      ingilizce: 0,
    } as { [key: string]: number },
    dailyStats: {},
    subjectStats: {
      matematik: { correct: 0, total: 0, timeSpent: 0 },
      fen: { correct: 0, total: 0, timeSpent: 0 },
      turkce: { correct: 0, total: 0, timeSpent: 0 },
      ingilizce: { correct: 0, total: 0, timeSpent: 0 },
    },
  });

  useEffect(() => {
    // Önce localStorage'dan kontrol et
    const stored = localStorage.getItem("emir_taha_progress");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setStudentData(data);
      } catch (e) {
        console.error("LocalStorage parse hatası:", e);
      }
    }

    // Firebase'den veriyi dinle (Gerçek zamanlı)
    const docRef = doc(db, "students", "emir_taha");

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const firebaseData = docSnap.data() as typeof studentData;
        setStudentData(firebaseData);
        // Aynı zamanda localStorage'a da kaydet
        localStorage.setItem(
          "emir_taha_progress",
          JSON.stringify(firebaseData),
        );
        // Sadece ilk yüklemede hoşgeldin ekranına yönlendir
        setView((prev) => (prev === "loading" ? "welcome" : prev));
      } else {
        // Firebase'de veri yoksa yeni veri oluştur
        const defaultData = {
          name: "Emir Taha",
          points: 0,
          level: 1,
          badges: [],
          completedActivities: [],
          skippedQuestions: [],
          passedQuestionsBySubject: {
            matematik: 0,
            fen: 0,
            turkce: 0,
            ingilizce: 0,
          },
          dailyStats: {},
          subjectStats: {
            matematik: { correct: 0, total: 0, timeSpent: 0 },
            fen: { correct: 0, total: 0, timeSpent: 0 },
            turkce: { correct: 0, total: 0, timeSpent: 0 },
            ingilizce: { correct: 0, total: 0, timeSpent: 0 },
          },
        };
        setStudentData(defaultData);
        localStorage.setItem("emir_taha_progress", JSON.stringify(defaultData));
        setDoc(docRef, defaultData);
        setView((prev) => (prev === "loading" ? "welcome" : prev));
      }
    });

    return () => unsubscribe();
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 180,
      origin: { y: -0.1 },
      gravity: 3,
    });
  };

  const saveData = async (data: typeof studentData) => {
    setStudentData(data);
    try {
      // 1. LocalStorage'a HEMEN kaydet (öncelikli)
      localStorage.setItem("emir_taha_progress", JSON.stringify(data));

      // 2. Firebase'e arka planda kaydet (hata olursa localStorage'da kalır)
      setDoc(doc(db, "students", "emir_taha"), data).catch((error) => {
        console.error("Firebase kaydetme hatası:", error);
        console.log("LocalStorage'da güvenli şekilde kaydedildi!");
      });
    } catch (error) {
      console.error("LocalStorage kaydetme hatası:", error);
    }
  };

  const [currentSubject, setCurrentSubject] = useState<string | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizComplete, setQuizComplete] = useState(false);
  const [passedQuestions, setPassedQuestions] = useState<number[]>([]);
  const [parentPass, setParentPass] = useState("");
  const [quizStartTime, setQuizStartTime] = useState<number | null>(null);
  const [isRevisitMode, setIsRevisitMode] = useState(false);

  const allQuestions = {
    matematik: [
      // ====== DOĞAL SAYILAR VE TAM SAYILAR ======
      {
        q: "(-8) + (+12) işleminin sonucu kaçtır?",
        a: ["-20", "-4", "+4", "+20"],
        c: 2,
      },
      {
        q: "(-15) - (-7) işleminin sonucu kaçtır?",
        a: ["-22", "-8", "+8", "+22"],
        c: 1,
      },
      {
        q: "(+9) × (-4) işleminin sonucu kaçtır?",
        a: ["-36", "-13", "+13", "+36"],
        c: 0,
      },
      {
        q: "(-72) ÷ (+8) işleminin sonucu kaçtır?",
        a: ["-9", "-8", "+8", "+9"],
        c: 0,
      },
      {
        q: "(-5) × (-6) işleminin sonucu kaçtır?",
        a: ["-30", "-11", "+11", "+30"],
        c: 3,
      },
      {
        q: "Sayı doğrusunda -7'nin 5 birim sağındaki sayı kaçtır?",
        a: ["-12", "-2", "+2", "+12"],
        c: 1,
      },
      {
        q: "(-3) + (-8) + (+15) işleminin sonucu kaçtır?",
        a: ["-26", "-4", "+4", "+26"],
        c: 2,
      },
      {
        q: "|-12| + |-8| - |+5| işleminin sonucu kaçtır?",
        a: ["1", "5", "15", "25"],
        c: 2,
      },
      {
        q: "(-4)² işleminin sonucu kaçtır?",
        a: ["-16", "-8", "+8", "+16"],
        c: 3,
      },
      {
        q: "-3³ işleminin sonucu kaçtır?",
        a: ["-27", "-9", "+9", "+27"],
        c: 0,
      },

      // ====== KESIRLERLE İŞLEMLER ======
      {
        q: "3/4 + 1/4 işleminin sonucu kaçtır?",
        a: ["1/2", "2/4", "4/4", "4/8"],
        c: 2,
      },
      {
        q: "5/6 - 1/3 işleminin sonucu kaçtır?",
        a: ["1/2", "1/3", "2/3", "4/3"],
        c: 0,
      },
      {
        q: "2/3 × 3/4 işleminin sonucu kaçtır?",
        a: ["1/2", "5/7", "6/12", "2/1"],
        c: 0,
      },
      {
        q: "4/5 ÷ 2/3 işleminin sonucu kaçtır?",
        a: ["6/5", "8/15", "2/5", "8/5"],
        c: 0,
      },
      {
        q: "2 1/2 + 1 3/4 işleminin sonucu kaçtır?",
        a: ["3 1/4", "4 1/4", "3 3/4", "4 3/4"],
        c: 1,
      },
      {
        q: "15/20 kesrinin en sade hali nedir?",
        a: ["3/4", "5/10", "1/2", "15/20"],
        c: 0,
      },
      {
        q: "0.25 ondalık sayısının kesir şekli nedir?",
        a: ["1/2", "1/4", "2/5", "1/5"],
        c: 1,
      },
      {
        q: "3/8 kesri ondalık gösterimde kaçtır?",
        a: ["0.3", "0.375", "0.38", "0.8"],
        c: 1,
      },
      {
        q: "Hangisi 2/3'ten büyüktür?",
        a: ["1/2", "3/5", "5/6", "4/7"],
        c: 2,
      },
      {
        q: "1/2 + 1/3 + 1/6 işleminin sonucu kaçtır?",
        a: ["1/2", "2/3", "5/6", "1"],
        c: 3,
      },

      // ====== GEOMETRİ: AÇILAR VE ÇOKGENLER ======
      {
        q: "Bir açının tümleyeni 35 derece ise bu açı kaç derecedir?",
        a: ["45", "55", "65", "145"],
        c: 1,
      },
      {
        q: "Bir açının bütünleyeni 125 derece ise bu açı kaç derecedir?",
        a: ["35", "45", "55", "65"],
        c: 2,
      },
      {
        q: "İki ters açının ölçüleri toplamı kaç derecedir?",
        a: ["90", "180", "270", "Eşittir, toplamları değişir"],
        c: 1,
      },
      {
        q: "Bir üçgenin iç açıları 50°, 60° ve x° ise x kaçtır?",
        a: ["60", "70", "80", "90"],
        c: 1,
      },
      {
        q: "İkizkenar üçgenin taban açıları 40'ar derece ise tepe açısı kaç derecedir?",
        a: ["80", "90", "100", "110"],
        c: 2,
      },
      {
        q: "Eşkenar üçgenin her bir açısı kaç derecedir?",
        a: ["45", "60", "90", "120"],
        c: 1,
      },
      {
        q: "Bir dörtgenin iç açıları toplamı kaç derecedir?",
        a: ["180", "270", "360", "540"],
        c: 2,
      },
      {
        q: "Beşgenin iç açıları toplamı kaç derecedir?",
        a: ["360", "450", "540", "720"],
        c: 2,
      },
      {
        q: "Altıgenin iç açıları toplamı kaç derecedir?",
        a: ["540", "720", "900", "1080"],
        c: 1,
      },
      {
        q: "Bir karenin bir iç açısı kaç derecedir?",
        a: ["60", "90", "120", "180"],
        c: 1,
      },

      // ====== ALAN VE ÇEVRİ HESAPLAMALARI ======
      {
        q: "Kenar uzunluğu 7 cm olan bir karenin alanı kaç cm²'dir?",
        a: ["28", "35", "49", "56"],
        c: 2,
      },
      {
        q: "Uzun kenarı 12 cm, kısa kenarı 7 cm olan dikdörtgenin çevresi kaç cm'dir?",
        a: ["19", "38", "84", "168"],
        c: 1,
      },
      {
        q: "Taban uzunluğu 10 cm, yüksekliği 6 cm olan üçgenin alanı kaç cm²'dir?",
        a: ["16", "30", "60", "100"],
        c: 1,
      },
      {
        q: "Yarıçapı 7 cm olan dairenin çevresi kaç π cm'dir?",
        a: ["7π", "14π", "28π", "49π"],
        c: 1,
      },
      {
        q: "Yarıçapı 10 cm olan dairenin alanı kaç π cm²'dir?",
        a: ["10π", "20π", "50π", "100π"],
        c: 3,
      },
      {
        q: "Paralelkenarın bir kenarı 8 cm, yüksekliği 5 cm ise alanı kaç cm²'dir?",
        a: ["13", "26", "40", "80"],
        c: 2,
      },
      {
        q: "Tabanları 6 cm ve 10 cm, yüksekliği 4 cm olan yamuğun alanı kaç cm²'dir?",
        a: ["24", "32", "40", "64"],
        c: 1,
      },
      {
        q: "Çevresi 24 cm olan eşkenar üçgenin bir kenarı kaç cm'dir?",
        a: ["6", "8", "12", "18"],
        c: 1,
      },
      {
        q: "Alanı 64 cm² olan karenin bir kenarı kaç cm'dir?",
        a: ["4", "8", "16", "32"],
        c: 1,
      },
      {
        q: "Çevresi 30 cm olan bir karenin alanı kaç cm²'dir?",
        a: ["30", "36", "49", "56.25"],
        c: 3,
      },

      // ====== CEBİRSEL İFADELER ======
      {
        q: "3x + 5 = 20 denkleminde x kaçtır?",
        a: ["3", "5", "7", "15"],
        c: 1,
      },
      {
        q: "5x - 8 = 17 denkleminde x kaçtır?",
        a: ["3", "5", "9", "25"],
        c: 1,
      },
      {
        q: "2(x + 3) = 14 denkleminde x kaçtır?",
        a: ["2", "4", "5", "7"],
        c: 1,
      },
      {
        q: "x/4 = 5 denkleminde x kaçtır?",
        a: ["1.25", "9", "20", "25"],
        c: 2,
      },
      {
        q: "4x + 3x işleminin sonucu nedir?",
        a: ["7x", "7x²", "12x", "x⁷"],
        c: 0,
      },
      {
        q: "5a - 2a işleminin sonucu nedir?",
        a: ["3", "3a", "7a", "3a²"],
        c: 1,
      },
      {
        q: "3 × 4x işleminin sonucu nedir?",
        a: ["7x", "12x", "12", "3x⁴"],
        c: 1,
      },
      {
        q: "8y ÷ 2 işleminin sonucu nedir?",
        a: ["4", "4y", "6y", "16y"],
        c: 1,
      },
      {
        q: "x = 5 için 3x + 7 ifadesinin değeri kaçtır?",
        a: ["15", "22", "35", "42"],
        c: 1,
      },
      {
        q: "a = 4 için 2a² - 5 ifadesinin değeri kaçtır?",
        a: ["11", "27", "32", "37"],
        c: 1,
      },

      // ====== ORAN VE ORANTILAR ======
      {
        q: "12:18 oranının en sade hali nedir?",
        a: ["2:3", "3:2", "4:6", "6:9"],
        c: 0,
      },
      {
        q: "3:5 = x:15 orantısında x kaçtır?",
        a: ["5", "9", "25", "45"],
        c: 1,
      },
      {
        q: "Bir sınıfta 15 kız, 10 erkek vardır. Kızların erkeklere oranı nedir?",
        a: ["2:3", "3:2", "5:10", "10:15"],
        c: 1,
      },
      {
        q: "4:7 = 12:x orantısında x kaçtır?",
        a: ["3", "16", "21", "28"],
        c: 2,
      },
      {
        q: "Bir tarif 6 kişilik, 300 gram un gerekiyor. 9 kişilik kaç gram un gerekir?",
        a: ["350", "400", "450", "500"],
        c: 2,
      },
      {
        q: "2:5 oranı ondalık kesir olarak nasıl yazılır?",
        a: ["0.25", "0.4", "0.5", "2.5"],
        c: 1,
      },
      {
        q: "18:24 oranının basit şekli nedir?",
        a: ["3:4", "4:3", "6:8", "9:12"],
        c: 0,
      },
      {
        q: "Bir haritada 2 cm gerçekte 50 km ise ölçek nedir?",
        a: ["1:25", "1:2500", "1:25000", "1:2500000"],
        c: 3,
      },
      {
        q: "x:8 = 9:12 orantısında x kaçtır?",
        a: ["3", "6", "10", "24"],
        c: 1,
      },
      {
        q: "Doğru orantılı iki büyüklükte biri 3 kat artarsa diğeri kaç kat artar?",
        a: ["1/3", "2", "3", "6"],
        c: 2,
      },

      // ====== YÜZDELER ======
      {
        q: "200 sayısının %15'i kaçtır?",
        a: ["15", "20", "30", "40"],
        c: 2,
      },
      {
        q: "80 sayısının %25'i kaçtır?",
        a: ["20", "25", "32", "40"],
        c: 0,
      },
      {
        q: "Bir ürün %30 indirimle 140 TL oldu. İndirimsiz fiyatı kaç TL'dir?",
        a: ["182", "200", "210", "230"],
        c: 1,
      },
      {
        q: "360 sayısının %40'ı kaçtır?",
        a: ["120", "144", "180", "216"],
        c: 1,
      },
      {
        q: "50 sayının %60'ı kaçtır?",
        a: ["20", "30", "35", "40"],
        c: 1,
      },
      {
        q: "Bir okuldaki 400 öğrencinin %45'i kız ise kaç kız öğrenci vardır?",
        a: ["160", "180", "200", "220"],
        c: 1,
      },
      {
        q: "%20 = ? (Ondalık gösterim)",
        a: ["0.02", "0.2", "0.20", "2.0"],
        c: 1,
      },
      {
        q: "0.75 ondalık sayısı yüzde kaçtır?",
        a: ["%7.5", "%75", "%750", "%0.75"],
        c: 1,
      },
      {
        q: "Bir ürün 500 TL iken %20 zam geldi. Yeni fiyat kaç TL'dir?",
        a: ["520", "600", "700", "1000"],
        c: 1,
      },
      {
        q: "300 TL'nin %10'u ile %15'inin toplamı kaçtır?",
        a: ["45", "60", "75", "90"],
        c: 2,
      },

      // ====== VERİ ANALİZİ ======
      {
        q: "2, 4, 6, 8, 10 sayılarının ortalaması kaçtır?",
        a: ["5", "6", "7", "8"],
        c: 1,
      },
      {
        q: "5, 5, 7, 8, 10 veri grubunun modu kaçtır?",
        a: ["5", "7", "8", "10"],
        c: 0,
      },
      {
        q: "3, 5, 7, 9, 11 sayılarının medyanı kaçtır?",
        a: ["5", "7", "9", "11"],
        c: 1,
      },
      {
        q: "10, 20, 15, 25, 30 sayılarının açıklığı kaçtır?",
        a: ["5", "10", "15", "20"],
        c: 3,
      },
      {
        q: "4, 6, 8, 10, 12 sayılarının ortalaması kaçtır?",
        a: ["6", "8", "9", "10"],
        c: 1,
      },
      {
        q: "Bir veri grubunda 3, 3, 5, 5, 5, 7, 9 sayıları var. Mod kaçtır?",
        a: ["3", "5", "7", "9"],
        c: 1,
      },
      {
        q: "2, 4, 6, 8 sayılarının medyanı kaçtır?",
        a: ["4", "5", "6", "7"],
        c: 1,
      },
      {
        q: "Bir sınıfın notları: 60, 70, 80, 90. Ortalama kaçtır?",
        a: ["70", "75", "80", "85"],
        c: 1,
      },
      {
        q: "5, 10, 15, 20, 25, 30 veri grubunun açıklığı kaçtır?",
        a: ["5", "15", "20", "25"],
        c: 3,
      },
      {
        q: "1, 2, 3, 4, 5, 6, 7 sayılarının medyanı kaçtır?",
        a: ["3", "4", "5", "6"],
        c: 1,
      },

      // ====== SAYILAR VE İŞLEMLER ======
      {
        q: "2³ × 2⁴ işleminin sonucu 2'nin kaçıncı kuvvetidir?",
        a: ["2⁵", "2⁶", "2⁷", "2¹²"],
        c: 2,
      },
      {
        q: "5⁶ ÷ 5³ işleminin sonucu nedir?",
        a: ["5²", "5³", "5⁴", "5⁹"],
        c: 1,
      },
      {
        q: "(3²)³ işleminin sonucu 3'ün kaçıncı kuvvetidir?",
        a: ["3⁵", "3⁶", "3⁸", "3⁹"],
        c: 1,
      },
      {
        q: "4⁰ + 7⁰ + 10⁰ işleminin sonucu kaçtır?",
        a: ["0", "1", "3", "21"],
        c: 2,
      },
      {
        q: "(-2)⁴ işleminin sonucu kaçtır?",
        a: ["-16", "-8", "+8", "+16"],
        c: 3,
      },
      {
        q: "100 ÷ 4 × 2 - 10 işleminin sonucu kaçtır?",
        a: ["30", "40", "50", "60"],
        c: 1,
      },
      {
        q: "(15 + 25) × 2 - 20 işleminin sonucu kaçtır?",
        a: ["40", "60", "80", "100"],
        c: 1,
      },
      {
        q: "3⁴ ÷ 3² işleminin sonucu kaçtır?",
        a: ["3", "9", "27", "81"],
        c: 1,
      },
      {
        q: "2⁵ - 2³ işleminin sonucu kaçtır?",
        a: ["4", "8", "16", "24"],
        c: 3,
      },
      {
        q: "10² - 5² işleminin sonucu kaçtır?",
        a: ["25", "50", "75", "95"],
        c: 2,
      },
      // ====== KOORDİNAT SİSTEMİ VE GENEL TEKRAR ======
      {
        q: "(3, -4) noktası koordinat sisteminde kaçıncı bölgededir?",
        a: ["1. Bölge", "2. Bölge", "3. Bölge", "4. Bölge"],
        c: 3,
      },
      {
        q: "Orijin noktasının koordinatları nedir?",
        a: ["(1, 1)", "(0, 0)", "(0, 1)", "(1, 0)"],
        c: 1,
      },
      {
        q: "x ekseni üzerindeki bir noktanın hangi koordinatı kesinlikle 0'dır?",
        a: ["x", "y", "Z", "Hiçbiri"],
        c: 1,
      },
      {
        q: "(-2, -5) noktası hangi bölgededir?",
        a: ["1. Bölge", "2. Bölge", "3. Bölge", "4. Bölge"],
        c: 2,
      },
      {
        q: "Bir ürünün fiyatı 80 TL'den 100 TL'ye çıkarsa yüzde kaç zam yapılmıştır?",
        a: ["%20", "%25", "%30", "%40"],
        c: 1,
      },
      {
        q: "Hangi sayı hem 2'ye hem 3'e tam bölünür?",
        a: ["8", "10", "12", "14"],
        c: 2,
      },
      {
        q: "15 ve 20 sayılarının en küçük ortak katı (EKOK) kaçtır?",
        a: ["30", "45", "60", "80"],
        c: 2,
      },
      {
        q: "12 ve 18 sayılarının en büyük ortak böleni (EBOB) kaçtır?",
        a: ["3", "4", "6", "9"],
        c: 2,
      },
      {
        q: "Bir üçgenin yüksekliklerinin kesim noktasına ne denir?",
        a: ["Ağırlık merkezi", "Diklik merkezi", "Orijin", "Tepe"],
        c: 1,
      },
      {
        q: "İki basamaklı en büyük asal sayı kaçtır?",
        a: ["91", "93", "97", "99"],
        c: 2,
      },
    ],

    fen: [
      // ====== GÜNEŞ SİSTEMİ VE TUTULMALAR ======
      {
        q: "Güneş'e en yakın gezegen hangisidir?",
        a: ["Venüs", "Dünya", "Merkür", "Mars"],
        c: 2,
      },
      {
        q: "Ay'ın kendi etrafında dönmesi ne kadar sürer?",
        a: ["1 gün", "27 gün", "29 gün", "365 gün"],
        c: 1,
      },
      {
        q: "Dünya'nın Güneş etrafında dönmesi ne kadar sürer?",
        a: ["1 gün", "27 gün", "365 gün", "687 gün"],
        c: 2,
      },
      {
        q: "Ay tutulması hangi ay evresinde gerçekleşir?",
        a: ["Yeni Ay", "Hilal", "İlk Dördün", "Dolunay"],
        c: 3,
      },
      {
        q: "Güneş tutulması sırasında hangi gölge Dünya'ya düşer?",
        a: [
          "Dünya'nın gölgesi",
          "Ay'ın gölgesi",
          "Güneş'in gölgesi",
          "Mars'ın gölgesi",
        ],
        c: 1,
      },
      {
        q: "Ay'ın Dünya'ya en yakın olduğu noktaya ne denir?",
        a: ["Apogee", "Perigee", "Equinox", "Solstice"],
        c: 1,
      },
      {
        q: "Güneş sistemindeki en büyük gezegen hangisidir?",
        a: ["Satürn", "Jüpiter", "Uranüs", "Neptün"],
        c: 1,
      },
      {
        q: "Mars'ın kaç tane uydusu vardır?",
        a: ["1", "2", "3", "4"],
        c: 1,
      },
      {
        q: "Ay'ın bir evreden diğer evreye geçmesi yaklaşık kaç gün sürer?",
        a: ["3 gün", "7 gün", "15 gün", "30 gün"],
        c: 1,
      },
      {
        q: "Gece-gündüz oluşumunun nedeni nedir?",
        a: [
          "Dünya'nın Güneş etrafında dönmesi",
          "Dünya'nın kendi etrafında dönmesi",
          "Ay'ın Dünya etrafında dönmesi",
          "Güneş'in dönmesi",
        ],
        c: 1,
      },

      // ====== DESTEK VE HAREKET SİSTEMİ ======
      {
        q: "İnsan vücudunda kaç tane kemik vardır?",
        a: ["106", "206", "306", "406"],
        c: 1,
      },
      {
        q: "Hangi eklem hareketsizdir?",
        a: ["Dirsek eklemi", "Kafatası eklemi", "Diz eklemi", "Omuz eklemi"],
        c: 1,
      },
      {
        q: "Vücudumuzun en uzun kemiği hangisidir?",
        a: ["Kaval kemiği", "Uyluk kemiği", "Kol kemiği", "Omurga"],
        c: 1,
      },
      {
        q: "Hangi kas türü istemsiz çalışır?",
        a: ["İskelet kası", "Çizgili kas", "Düz kas", "Kol kası"],
        c: 2,
      },
      {
        q: "Kemiklerin birbirine bağlandığı yere ne denir?",
        a: ["Kas", "Eklem", "Tendon", "Kıkırdak"],
        c: 1,
      },
      {
        q: "Kasları kemiklere bağlayan yapı hangisidir?",
        a: ["Tendon", "Ligament", "Kıkırdak", "Deri"],
        c: 0,
      },
      {
        q: "Göğüs kafesinin görevi nedir?",
        a: [
          "Solunumu sağlamak",
          "İç organları korumak",
          "Hareket sağlamak",
          "Kan üretmek",
        ],
        c: 1,
      },
      {
        q: "Kemik iliğinin görevi nedir?",
        a: ["Koruma", "Hareket", "Kan hücresi üretimi", "Sindirim"],
        c: 2,
      },
      {
        q: "Omurga kaç kemikten oluşur?",
        a: ["23", "33", "43", "53"],
        c: 1,
      },
      {
        q: "Hangi kemik türü vücudu ayakta tutar?",
        a: [
          "Kısa kemikler",
          "Yassı kemikler",
          "Uzun kemikler",
          "Düzensiz kemikler",
        ],
        c: 2,
      },

      // ====== SİNDİRİM SİSTEMİ ======
      {
        q: "Sindirim hangi organda başlar?",
        a: ["Ağız", "Mide", "İnce bağırsak", "Kalın bağırsak"],
        c: 0,
      },
      {
        q: "Tükürükte bulunan enzim hangisidir?",
        a: ["Pepsin", "Amilaz", "Lipaz", "Tripsin"],
        c: 1,
      },
      {
        q: "Mide asidinin pH değeri yaklaşık kaçtır?",
        a: ["2", "7", "10", "14"],
        c: 0,
      },
      {
        q: "Besinlerin emilimi hangi organda gerçekleşir?",
        a: ["Mide", "İnce bağırsak", "Kalın bağırsak", "Yemek borusu"],
        c: 1,
      },
      {
        q: "Safra hangi organ tarafından üretilir?",
        a: ["Pankreas", "Mide", "Karaciğer", "Böbrek"],
        c: 2,
      },
      {
        q: "İnce bağırsağın uzunluğu yaklaşık kaç metredir?",
        a: ["1-2 m", "3-4 m", "6-7 m", "10-12 m"],
        c: 2,
      },
      {
        q: "Hangi besin grubu ağızda sindirilmeye başlar?",
        a: ["Proteinler", "Yağlar", "Karbonhidratlar", "Vitaminler"],
        c: 2,
      },
      {
        q: "Kalın bağırsakta ne emilir?",
        a: ["Protein", "Yağ", "Su", "Vitamin A"],
        c: 2,
      },
      {
        q: "Pankreas hangi sistem içindedir?",
        a: [
          "Sindirim sistemi",
          "Dolaşım sistemi",
          "Solunum sistemi",
          "Boşaltım sistemi",
        ],
        c: 0,
      },
      {
        q: "Villusların görevi nedir?",
        a: [
          "Emilim yüzeyini artırmak",
          "Asit salgılamak",
          "Besin parçalamak",
          "Su üretmek",
        ],
        c: 0,
      },

      // ====== DOLAŞIM SİSTEMİ ======
      {
        q: "Kalp dakikada kaç kez atar?",
        a: ["20-30", "40-50", "60-80", "100-120"],
        c: 2,
      },
      {
        q: "Alyuvarlarda hangi protein oksijen taşır?",
        a: ["Hemoglobin", "Fibrinojen", "Albümin", "Globulin"],
        c: 0,
      },
      {
        q: "Kan grubu AB olan biri kimden kan alabilir?",
        a: ["Sadece AB", "AB ve O", "Herkesten", "Sadece A ve B"],
        c: 2,
      },
      {
        q: "Evrensel kan vericisi hangi kan grubudur?",
        a: ["A", "B", "AB", "O"],
        c: 3,
      },
      {
        q: "Kalbin kaç odası vardır?",
        a: ["2", "3", "4", "5"],
        c: 2,
      },
      {
        q: "Küçük dolaşımda kan nereye gider?",
        a: ["Beyne", "Karaciğere", "Akciğerlere", "Böbreklere"],
        c: 2,
      },
      {
        q: "Atardamarların görevi nedir?",
        a: [
          "Kanı kalbe getirmek",
          "Kanı kalpten götürmek",
          "Gaz değişimi",
          "Pıhtılaşma",
        ],
        c: 1,
      },
      {
        q: "Akyuvarların ömrü yaklaşık kaç gündür?",
        a: ["7-10", "30-60", "120", "200-300"],
        c: 1,
      },
      {
        q: "Kan pıhtılaşmasında hangi hücre görevlidir?",
        a: ["Alyuvar", "Akyuvar", "Trombosit", "Plazma"],
        c: 2,
      },
      {
        q: "Nabız hangi damardan ölçülür?",
        a: ["Atardamar", "Toplardamar", "Kılcal damar", "Lenf damarı"],
        c: 0,
      },

      // ====== SOLUNUM SİSTEMİ ======
      {
        q: "Soluk borusu kaç dala ayrılır?",
        a: ["2", "3", "4", "5"],
        c: 0,
      },
      {
        q: "Akciğerlerde kaç tane alveol vardır?",
        a: ["Binlerce", "Yüz binlerce", "Milyonlarca", "Milyarlarca"],
        c: 2,
      },
      {
        q: "Gaz değişimi nerede olur?",
        a: ["Bronş", "Alveol", "Soluk borusu", "Burun"],
        c: 1,
      },
      {
        q: "Hangi kas solunumda görevlidir?",
        a: ["Kalp kası", "Diyafram", "İskelet kası", "Düz kas"],
        c: 1,
      },
      {
        q: "Nefes alırken diyafram nasıl hareket eder?",
        a: ["Yukarı çıkar", "Aşağı iner", "Hareket etmez", "Sağa kayar"],
        c: 1,
      },
      {
        q: "İnsanlar dakikada ortalama kaç kez nefes alır?",
        a: ["5-10", "12-20", "30-40", "50-60"],
        c: 1,
      },
      {
        q: "Akciğerlerin hacmi nefes alırken ne olur?",
        a: ["Azalır", "Artar", "Değişmez", "Önce artar sonra azalır"],
        c: 1,
      },
      {
        q: "Karbondioksit hangi organda atılır?",
        a: ["Böbrek", "Karaciğer", "Akciğer", "Deri"],
        c: 2,
      },
      {
        q: "Ses telleri nerede bulunur?",
        a: ["Burun", "Gırtlak", "Yutak", "Bronş"],
        c: 1,
      },
      {
        q: "Sağ akciğer kaç lobdan oluşur?",
        a: ["2", "3", "4", "5"],
        c: 1,
      },

      // ====== BOŞALTIM SİSTEMİ ======
      {
        q: "İnsanda kaç tane böbrek vardır?",
        a: ["1", "2", "3", "4"],
        c: 1,
      },
      {
        q: "Böbreklerin görevi nedir?",
        a: ["Kan üretmek", "Kanı süzmek", "Sindirim", "Solunum"],
        c: 1,
      },
      {
        q: "İdrar kesesi ne kadar idrar tutar?",
        a: ["50-100 ml", "300-500 ml", "1000-1500 ml", "2000 ml"],
        c: 1,
      },
      {
        q: "Üre nedir?",
        a: ["Besin", "Zehirli atık", "Hormon", "Enzim"],
        c: 1,
      },
      {
        q: "Böbreklerde filtrelenen kan miktarı günlük ne kadardır?",
        a: ["50 litre", "100 litre", "180 litre", "300 litre"],
        c: 2,
      },
      {
        q: "İdrarın %95'i nedir?",
        a: ["Üre", "Su", "Tuz", "Protein"],
        c: 1,
      },
      {
        q: "Üreter nedir?",
        a: [
          "İdrarın toplandığı yer",
          "Böbrekten idrar kesesine giden kanal",
          "İdrarın dışarı atıldığı kanal",
          "Kan damarı",
        ],
        c: 1,
      },
      {
        q: "Derinin boşaltım görevi nedir?",
        a: ["İdrar atmak", "Ter atmak", "Nefes almak", "Sindirim yapmak"],
        c: 1,
      },
      {
        q: "Nefron nedir?",
        a: [
          "Böbreğin fonksiyonel birimi",
          "Kan hücresi",
          "Sinir hücresi",
          "Kas hücresi",
        ],
        c: 0,
      },
      {
        q: "Böbreklerin kötü çalışması hangi sistemi etkiler?",
        a: ["Sadece boşaltım", "Dolaşım ve boşaltım", "Sindirim", "Solunum"],
        c: 1,
      },

      // ====== KUVVET VE HAREKET ======
      {
        q: "Newton kuvvetin birimidir. Sembolü nedir?",
        a: ["N", "n", "Nw", "Nt"],
        c: 0,
      },
      {
        q: "Sürtünme kuvveti hangi yönde etkir?",
        a: [
          "Hareket yönünde",
          "Harekete ters yönde",
          "Yukarı doğru",
          "Aşağı doğru",
        ],
        c: 1,
      },
      {
        q: "Bir cismin hızı 20 m/s'den 40 m/s'ye çıktı. Ne oldu?",
        a: ["Yavaşladı", "Hızlandı", "Sabit kaldı", "Durdu"],
        c: 1,
      },
      {
        q: "Sabit hızla hareket eden cismin ivmesi kaçtır?",
        a: ["0", "1", "10", "Değişir"],
        c: 0,
      },
      {
        q: "Ağırlık hangi kuvvetin sonucudur?",
        a: ["Sürtünme", "Çekim", "İtme", "Manyetik"],
        c: 1,
      },
      {
        q: "120 km yolu 2 saatte alan aracın hızı km/sa cinsinden kaçtır?",
        a: ["30", "60", "80", "240"],
        c: 1,
      },
      {
        q: "Aynı yönlü 30 N ve 20 N kuvvetlerin bileşkesi kaç N'dur?",
        a: ["10", "25", "50", "600"],
        c: 2,
      },
      {
        q: "Zıt yönlü 50 N ve 30 N kuvvetlerin bileşkesi kaç N'dur?",
        a: ["20", "40", "80", "1500"],
        c: 0,
      },
      {
        q: "Bir cisim serbest düşüyor. İvmesi yaklaşık kaç m/s²'dir?",
        a: ["5", "10", "20", "100"],
        c: 1,
      },
      {
        q: "Hız = Yol / ?",
        a: ["Kütle", "Zaman", "Kuvvet", "İvme"],
        c: 1,
      },

      // ====== MADDE VE ISI ======
      {
        q: "Maddenin en küçük yapı taşı nedir?",
        a: ["Molekül", "Atom", "Element", "Bileşik"],
        c: 1,
      },
      {
        q: "Suyun kaynama noktası kaç derecedir?",
        a: ["0°C", "50°C", "100°C", "200°C"],
        c: 2,
      },
      {
        q: "Suyun donma noktası kaç derecedir?",
        a: ["-10°C", "0°C", "10°C", "100°C"],
        c: 1,
      },
      {
        q: "Isı hangi yönde akar?",
        a: ["Soğuktan sıcağa", "Sıcaktan soğuğa", "Her iki yöne", "Akmaz"],
        c: 1,
      },
      {
        q: "Termometre neyi ölçer?",
        a: ["Kütleyi", "Hacmi", "Sıcaklığı", "Basıncı"],
        c: 2,
      },
      {
        q: "Hangi hal değişiminde ısı alınır?",
        a: ["Donma", "Yoğunlaşma", "Erime", "Kırağılaşma"],
        c: 2,
      },
      {
        q: "Su buharlaşırken ne olur?",
        a: ["Isı verir", "Isı alır", "Isı değişmez", "Soğur"],
        c: 1,
      },
      {
        q: "Isının SI birimi nedir?",
        a: ["Kalori", "Joule", "Newton", "Watt"],
        c: 1,
      },
      {
        q: "Hangi madde ısıyı en iyi iletir?",
        a: ["Plastik", "Ahşap", "Metal", "Cam"],
        c: 2,
      },
      {
        q: "Yoğunluk = Kütle / ?",
        a: ["Hacim", "Zaman", "Kuvvet", "Isı"],
        c: 0,
      },

      // ====== ELEKTRİK VE MANYETİZMA ======
      {
        q: "Elektrik akımının birimi nedir?",
        a: ["Volt", "Amper", "Ohm", "Watt"],
        c: 1,
      },
      {
        q: "Hangi madde elektriği iletir?",
        a: ["Plastik", "Bakır", "Kauçuk", "Ahşap"],
        c: 1,
      },
      {
        q: "Pil hangi enerjiyi elektrik enerjisine çevirir?",
        a: ["Işık", "Kimyasal", "Hareket", "Isı"],
        c: 1,
      },
      {
        q: "Manyetiklerin zıt kutupları ne yapar?",
        a: ["İter", "Çeker", "Nötr kalır", "Patlar"],
        c: 1,
      },
      {
        q: "Manyetiklerin aynı kutupları ne yapar?",
        a: ["Çeker", "İter", "Nötr kalır", "Birleşir"],
        c: 1,
      },
      {
        q: "Seri bağlı devrede bir ampul yanmazsa ne olur?",
        a: [
          "Diğerleri yanar",
          "Hiçbiri yanmaz",
          "Bazıları yanar",
          "Parlak yanar",
        ],
        c: 1,
      },
      {
        q: "Paralel bağlı devrede bir ampul yanmazsa ne olur?",
        a: [
          "Hiçbiri yanmaz",
          "Diğerleri yanar",
          "Hepsi söner",
          "Kısa devre olur",
        ],
        c: 1,
      },
      {
        q: "Elektrik direncinin birimi nedir?",
        a: ["Volt", "Amper", "Ohm", "Watt"],
        c: 2,
      },
      {
        q: "Topraklama ne için yapılır?",
        a: ["Parlak ışık için", "Güvenlik için", "Hız için", "Renk için"],
        c: 1,
      },
      {
        q: "Hangi enerji türü yenilenebilir değildir?",
        a: ["Güneş", "Rüzgar", "Kömür", "Su"],
        c: 2,
      },
      // ====== EKOSİSTEM VE MADDE ÖZELLİKLERİ ======
      {
        q: "Bir bölgedeki canlı ve cansız varlıkların tamamına ne denir?",
        a: ["Popülasyon", "Ekosistem", "Topluluk", "Habitat"],
        c: 1,
      },
      {
        q: "Bitkilerin kendi besinlerini üretmesine ne denir?",
        a: ["Solunum", "Sindirim", "Fotosentez", "Boşaltım"],
        c: 2,
      },
      {
        q: "Hangi gaz fotosentez için gereklidir?",
        a: ["Oksijen", "Azot", "Karbondioksit", "Helyum"],
        c: 2,
      },
      {
        q: "Havadaki nemi ölçen alet hangisidir?",
        a: ["Barometre", "Higrometre", "Anemometre", "Termometre"],
        c: 1,
      },
      {
        q: "Sıvıların yüzeyindeki buharlaşma ne zaman olur?",
        a: [
          "Sadece kaynarken",
          "Her sıcaklıkta",
          "Sadece güneş varken",
          "Sadece gece",
        ],
        c: 1,
      },
      {
        q: "Mıknatıs hangi maddeyi çekmez?",
        a: ["Demir", "Nikel", "Kobalt", "Alüminyum"],
        c: 3,
      },
      {
        q: "Gözle görülemeyecek kadar küçük canlıları görmek için ne kullanılır?",
        a: ["Teleskop", "Mikroskop", "Dürbün", "Periskop"],
        c: 1,
      },
      {
        q: "Hangi organımız kanı tüm vücuda pompalar?",
        a: ["Akciğer", "Mide", "Kalp", "Beyin"],
        c: 2,
      },
      {
        q: "Dünya'nın en dış katmanına ne denir?",
        a: ["Çekirdek", "Manto", "Yer kabuğu", "Atmosfer"],
        c: 2,
      },
      {
        q: "Yıldızların yaydığı enerji hangi yolla üretilir?",
        a: ["Yanma", "Çekirdek tepkimesi", "Sürtünme", "Elektrik"],
        c: 1,
      },
    ],

    turkce: [
      // ====== SÖZCÜKLERİN ANLAMI ======
      {
        q: "'Çıra gibi yanmak' deyiminin anlamı nedir?",
        a: ["Üşümek", "Çok parlak olmak", "Çok kızmak", "Ağlamak"],
        c: 2,
      },
      {
        q: "'El emeği göz nuru' deyiminin anlamı nedir?",
        a: ["Çok pahalı", "Özenle yapılmış", "Kırık", "Yeni"],
        c: 1,
      },
      {
        q: "'Ayağını yorganına göre uzat' atasözünün anlamı nedir?",
        a: [
          "Çok uyumak",
          "Gücüne göre yaşamak",
          "Egzersiz yapmak",
          "Temiz olmak",
        ],
        c: 1,
      },
      {
        q: "'Ateş' sözcüğü aşağıdakilerden hangisinde mecaz anlamdadır?",
        a: ["Ateş yandı", "Ateşli konuştu", "Ateşi söndü", "Ateş yaktı"],
        c: 1,
      },
      {
        q: "'Kök' sözcüğü aşağıdakilerden hangisinde terim anlamlıdır?",
        a: ["Ağacın kökü", "Kelimenin kökü", "Saçın kökü", "Diş kökü"],
        c: 1,
      },
      {
        q: "Eş anlamlısı 'mutlu' olan sözcük hangisidir?",
        a: ["Neşeli", "Üzgün", "Sinirli", "Yorgun"],
        c: 0,
      },
      {
        q: "Zıt anlamlısı 'soğuk' olan sözcük hangisidir?",
        a: ["Serin", "Ilık", "Sıcak", "Buğulu"],
        c: 2,
      },
      {
        q: "'Başını kuma gömmek' deyiminin anlamı nedir?",
        a: ["Oyun oynamak", "Gerçeklerden kaçmak", "Dinlenmek", "Düşünmek"],
        c: 1,
      },
      {
        q: "'Burnundan kıl aldırmamak' deyiminin anlamı nedir?",
        a: ["Kibar olmak", "Kimseyi dinlememek", "Hasta olmak", "Güzel olmak"],
        c: 1,
      },
      {
        q: "'Ağzı kulaklarında olmak' ne demektir?",
        a: ["Hasta olmak", "Çok mutlu olmak", "Susmak", "Yemek yemek"],
        c: 1,
      },

      // ====== CÜMLENİN ÖĞELERİ ======
      {
        q: "'Ali okula gitti.' cümlesinde yüklem hangisidir?",
        a: ["Ali", "Okula", "Gitti", "Ali okula"],
        c: 2,
      },
      {
        q: "'Kitap okudum.' cümlesinde nesne hangisidir?",
        a: ["Kitap", "Okudum", "Kitap okudum", "Nesne yok"],
        c: 0,
      },
      {
        q: "'Annem bana hediye aldı.' cümlesinde dolaylı tümleç hangisidir?",
        a: ["Annem", "Bana", "Hediye", "Aldı"],
        c: 1,
      },
      {
        q: "'Bugün hava çok güzel.' cümlesinde yüklem hangisidir?",
        a: ["Bugün", "Hava", "Çok", "Güzel"],
        c: 3,
      },
      {
        q: "'Bahçede çiçek açtı.' cümlesinde yer tamlayıcısı hangisidir?",
        a: ["Bahçede", "Çiçek", "Açtı", "Bahçede çiçek"],
        c: 0,
      },
      {
        q: "'Öğretmen öğrencilere ders anlattı.' cümlesinde nesne hangisidir?",
        a: ["Öğretmen", "Öğrencilere", "Ders", "Anlattı"],
        c: 2,
      },
      {
        q: "'Sabah erkenden kalktım.' cümlesinde zaman tamlayıcısı hangisidir?",
        a: ["Sabah erkenden", "Sabah", "Erkenden", "Kalktım"],
        c: 0,
      },
      {
        q: "'Kardeşim hızlı koşuyor.' cümlesinde nasıl tamlayıcısı hangisidir?",
        a: ["Kardeşim", "Hızlı", "Koşuyor", "Hızlı koşuyor"],
        c: 1,
      },
      {
        q: "'Ali ile Veli geldi.' cümlesinde özne hangisidir?",
        a: ["Ali", "Veli", "Ali ile Veli", "Geldi"],
        c: 2,
      },
      {
        q: "'Yavaş yavaş yoruldum.' cümlesinde kaç tane öğe vardır?",
        a: ["1", "2", "3", "4"],
        c: 1,
      },

      // ====== FİİLLER ======
      {
        q: "'Gel-' fiili hangi kiple çekimlenir: 'Gelecek'",
        a: ["Şimdiki zaman", "Gelecek zaman", "Geçmiş zaman", "Geniş zaman"],
        c: 1,
      },
      {
        q: "'Okuyor' fiilindeki ek hangisidir?",
        a: ["-yor", "-di", "-ecek", "-ir"],
        c: 0,
      },
      {
        q: "'Yazmıştı' fiili hangi zamandadır?",
        a: [
          "Şimdiki zaman",
          "Gelecek zaman",
          "Öğrenilen geçmiş zaman",
          "Görülen geçmiş zaman",
        ],
        c: 3,
      },
      {
        q: "'Gidecekmiş' fiilinde kaç tane ek vardır?",
        a: ["1", "2", "3", "4"],
        c: 1,
      },
      {
        q: "'Koş!' cümlesi hangi kiptedir?",
        a: ["Emir kipi", "İstek kipi", "Şart kipi", "Gereklilik kipi"],
        c: 0,
      },
      {
        q: "'Keşke gelseydi.' cümlesinde kaç fiil vardır?",
        a: ["1", "2", "3", "Fiil yok"],
        c: 0,
      },
      {
        q: "'Yazmalıyım' fiilinde hangi ek vardır?",
        a: ["Gereklilik", "İstek", "Şart", "Emir"],
        c: 0,
      },
      {
        q: "'Okursam' fiili hangi kiptedir?",
        a: ["Emir", "İstek", "Şart", "Gereklilik"],
        c: 2,
      },
      {
        q: "'Gidelim' fiili hangi kiptedir?",
        a: ["Emir", "İstek", "Şart", "Gereklilik"],
        c: 1,
      },
      {
        q: "Fiillerin çekiminde değişmeyen kısma ne denir?",
        a: ["Ek", "Kök", "Hece", "Zaman"],
        c: 1,
      },

      // ====== İSİMLER VE EKLER ======
      {
        q: "'Kitaplarımız' sözcüğünde kaç tane ek vardır?",
        a: ["1", "2", "3", "4"],
        c: 2,
      },
      {
        q: "'Okulumuzdan' sözcüğünde kaç tane çekim eki vardır?",
        a: ["1", "2", "3", "4"],
        c: 2,
      },
      {
        q: "'-lik, -lık' eki ne tür bir ektir?",
        a: ["Çekim eki", "Yapım eki", "İyelik eki", "Hal eki"],
        c: 1,
      },
      {
        q: "'Karanlık' sözcüğünün kökü nedir?",
        a: ["Kara", "Karanlık", "Karan", "Kara-"],
        c: 0,
      },
      {
        q: "'-sız, -siz' eki ne tür bir ektir?",
        a: ["Çekim eki", "Yapım eki", "Çoğul eki", "Hal eki"],
        c: 1,
      },
      {
        q: "'Masada' sözcüğündeki '-da' eki nedir?",
        a: ["Çoğul eki", "İyelik eki", "Bulunma hali eki", "Belirtme hali eki"],
        c: 2,
      },
      {
        q: "'Kapıyı' sözcüğündeki '-yı' eki nedir?",
        a: ["Çoğul eki", "Belirtme hali eki", "İyelik eki", "Yönelme hali eki"],
        c: 1,
      },
      {
        q: "'Eve' sözcüğündeki '-e' eki nedir?",
        a: ["Bulunma hali", "Yönelme hali", "Çıkma hali", "İlgi hali"],
        c: 1,
      },
      {
        q: "'Evden' sözcüğündeki '-den' eki nedir?",
        a: ["Bulunma hali", "Yönelme hali", "Çıkma hali", "Belirtme hali"],
        c: 2,
      },
      {
        q: "'Annenin' sözcüğündeki '-in' eki nedir?",
        a: ["İyelik eki", "İlgi hali eki", "Çoğul eki", "Hal eki"],
        c: 1,
      },

      // ====== TAMLAMALAR ======
      {
        q: "'Demir kapı' tamlaması hangi türdendir?",
        a: [
          "Belirtili isim tamlaması",
          "Belirtisiz isim tamlaması",
          "Sıfat tamlaması",
          "İsim tamlaması değil",
        ],
        c: 1,
      },
      {
        q: "'Okul müdürü' tamlaması hangi türdendir?",
        a: [
          "Belirtili isim tamlaması",
          "Belirtisiz isim tamlaması",
          "Sıfat tamlaması",
          "Takısız tamlama",
        ],
        c: 1,
      },
      {
        q: "'Annemin çantası' tamlaması hangi türdendir?",
        a: [
          "Belirtili isim tamlaması",
          "Belirtisiz isim tamlaması",
          "Sıfat tamlaması",
          "Takısız tamlama",
        ],
        c: 0,
      },
      {
        q: "'Güzel çocuk' tamlaması hangi türdendir?",
        a: [
          "Belirtili isim tamlaması",
          "Belirtisiz isim tamlaması",
          "Sıfat tamlaması",
          "İsim tamlaması",
        ],
        c: 2,
      },
      {
        q: "'Bahçe kapısı' tamlamasında tamlayan hangisidir?",
        a: ["Bahçe", "Kapı", "Bahçe kapısı", "Kapısı"],
        c: 0,
      },
      {
        q: "'Elmanın suyu' tamlamasında tamlanan hangisidir?",
        a: ["Elma", "Su", "Suyu", "Elmanın"],
        c: 2,
      },
      {
        q: "'Yeni araba' tamlamasında sıfat hangisidir?",
        a: ["Yeni", "Araba", "Yeni araba", "İkisi de"],
        c: 0,
      },
      {
        q: "Belirtisiz isim tamlamasında tamlayan nasıl olur?",
        a: ["İyelik eki alır", "Hal eki alır", "Ek almaz", "Çoğul eki alır"],
        c: 2,
      },
      {
        q: "Belirtili isim tamlamasında tamlayan hangi eki alır?",
        a: ["İyelik eki", "İlgi hali eki", "Çoğul eki", "Hal eki"],
        c: 1,
      },
      {
        q: "'Türkiye Cumhuriyeti' tamlaması hangi türdendir?",
        a: ["Belirtili", "Belirtisiz", "Sıfat", "Takısız"],
        c: 3,
      },

      // ====== NOKTALAMA İŞARETLERİ ======
      {
        q: "Virgül hangi durumlarda kullanılır?",
        a: [
          "Cümle sonunda",
          "Soru sormak için",
          "Eş görevli kelimeleri ayırmak için",
          "Ünlem anında",
        ],
        c: 2,
      },
      {
        q: "İki nokta üst üste (:) ne zaman kullanılır?",
        a: [
          "Cümle sonunda",
          "Açıklama yapmadan önce",
          "Soru sormak için",
          "Şaşırmak için",
        ],
        c: 1,
      },
      {
        q: "Noktalı virgül (;) ne zaman kullanılır?",
        a: [
          "Cümle sonunda",
          "Uzun cümlelerin öğelerini ayırmada",
          "Soru cümlelerinde",
          "Ünlem cümlelerinde",
        ],
        c: 1,
      },
      {
        q: 'Tırnak işareti ("") ne zaman kullanılır?',
        a: [
          "Cümle sonunda",
          "Doğrudan aktarmalarda",
          "Soru sormak için",
          "Virgül yerine",
        ],
        c: 1,
      },
      {
        q: "Üç nokta (...) ne zaman kullanılır?",
        a: [
          "Devam eden düşünceyi göstermek için",
          "Soru sormak için",
          "Ünlem için",
          "Virgül yerine",
        ],
        c: 0,
      },
      {
        q: "Tire (-) ne zaman kullanılır?",
        a: [
          "Cümle sonunda",
          "Konuşmaları ayırmada",
          "Soru sormak için",
          "Ünlem için",
        ],
        c: 1,
      },
      {
        q: "'Yarın, öbür gün, her zaman buradayım.' cümlesinde kaç virgül vardır?",
        a: ["1", "2", "3", "4"],
        c: 1,
      },
      {
        q: "Kesme işareti hangi kelimelerde kullanılır?",
        a: ["Tüm kelimelerde", "Özel isimlerde", "Fiillerde", "Sıfatlarda"],
        c: 1,
      },
      {
        q: "'Kitap, defter, kalem aldım.' cümlesinde kaç virgül vardır?",
        a: ["1", "2", "3", "Virgül yok"],
        c: 1,
      },
      {
        q: "Soru işareti (?) hangi cümlelerde kullanılır?",
        a: ["Haber cümlesi", "Emir cümlesi", "Soru cümlesi", "Ünlem cümlesi"],
        c: 2,
      },

      // ====== PARAGRAF VE METİN ======
      {
        q: "Paragrafın en önemli cümlesi hangisidir?",
        a: ["İlk cümle", "Son cümle", "Ana fikir cümlesi", "En uzun cümle"],
        c: 2,
      },
      {
        q: "Metnin konusunu nasıl buluruz?",
        a: [
          "İlk cümleye bakarak",
          "Son cümleye bakarak",
          "Metnin tamamını okuyarak",
          "Başlığa bakarak",
        ],
        c: 2,
      },
      {
        q: "Ana fikir nedir?",
        a: [
          "Metnin başlığı",
          "Yazarın vermek istediği mesaj",
          "Metnin ilk cümlesi",
          "Metnin uzunluğu",
        ],
        c: 1,
      },
      {
        q: "Yardımcı fikirler neyi destekler?",
        a: ["Başlığı", "Ana fikri", "Yazarı", "Okuyucuyu"],
        c: 1,
      },
      {
        q: "Paragrafta kaç tane ana fikir olur?",
        a: ["Birden fazla", "Sadece 1", "Hiç olmaz", "En az 3"],
        c: 1,
      },
      {
        q: "Metinde neden-sonuç ilişkisi nasıl gösterilir?",
        a: ["Virgülle", "Bağlaçlarla", "Nokta ile", "Ünlemle"],
        c: 1,
      },
      {
        q: "'Çünkü' bağlacı hangi ilişkiyi gösterir?",
        a: ["Amaç-sonuç", "Neden-sonuç", "Zaman", "Koşul"],
        c: 1,
      },
      {
        q: "'Bu nedenle' ifadesi hangi ilişkiyi gösterir?",
        a: ["Neden", "Sonuç", "Koşul", "Zaman"],
        c: 1,
      },
      {
        q: "Metindeki olayların sırasını gösteren kelimeler hangileridir?",
        a: [
          "Çünkü, bu yüzden",
          "Önce, sonra, ardından",
          "Ama, fakat, ancak",
          "Ve, ile, de",
        ],
        c: 1,
      },
      {
        q: "Bir metnin ana fikri nerede olabilir?",
        a: [
          "Sadece başta",
          "Sadece sonda",
          "Başta, ortada veya sonda",
          "Hiçbir yerde",
        ],
        c: 2,
      },

      // ====== YAZIM KURALLARI ======
      {
        q: "'Ki' bağlacı nasıl yazılır?",
        a: ["Bitişik", "Ayrı", "Kesme işaretiyle", "Tire ile"],
        c: 1,
      },
      {
        q: "'De' bağlacı nasıl yazılır?",
        a: ["Bitişik", "Ayrı", "Kesme işaretiyle", "Tire ile"],
        c: 1,
      },
      {
        q: "'mi' soru eki nasıl yazılır?",
        a: ["Bitişik", "Ayrı", "Kesme işaretiyle", "Tire ile"],
        c: 1,
      },
      {
        q: "'Ankara'ya' kelimesinde kesme işareti neden var?",
        a: ["Çünkü özel isim", "Çünkü soru eki", "Çünkü bağlaç", "Çünkü fiil"],
        c: 0,
      },
      {
        q: "Hangi kelime yanlış yazılmıştır?",
        a: ["Herkes", "Hiçbir", "Birçok", "Herkez"],
        c: 3,
      },
      {
        q: "Sayılar yazıyla yazılırken nasıl yazılır?",
        a: ["Bitişik", "Ayrı", "Tire ile", "Kesme ile"],
        c: 0,
      },
      {
        q: "'T.C.' kısaltması neyi ifade eder?",
        a: [
          "Türk Cumhuriyeti",
          "Türkiye Cumhuriyeti",
          "Türk Çocuğu",
          "Tarih Cumhuriyeti",
        ],
        c: 1,
      },
      {
        q: "Cümle hangi harfle başlar?",
        a: ["Küçük", "Büyük", "İtalik", "Kalın"],
        c: 1,
      },
      {
        q: "Özel isimler hangi harfle başlar?",
        a: ["Küçük", "Büyük", "Eğik", "Renkli"],
        c: 1,
      },
      {
        q: "'Sendeki' kelimesinde 'de' nasıl yazılır?",
        a: ["Ayrı", "Bitişik", "Kesme ile", "Tire ile"],
        c: 1,
      },

      // ====== SÖZ SANATLARI ======
      {
        q: "'Güneş gibi parlak' cümlesinde hangi söz sanatı vardır?",
        a: ["Benzetme", "Kişileştirme", "Abartma", "Konuşturma"],
        c: 0,
      },
      {
        q: "'Ağaçlar fısıldıyor' cümlesinde hangi söz sanatı vardır?",
        a: ["Benzetme", "Kişileştirme", "Abartma", "Konuşturma"],
        c: 1,
      },
      {
        q: "'Saçları ak kar' ifadesinde hangi söz sanatı vardır?",
        a: ["Benzetme", "Kişileştirme", "Abartma", "Karşıtlık"],
        c: 0,
      },
      {
        q: "'Dünya kadar ödevim var' cümlesinde hangi söz sanatı vardır?",
        a: ["Benzetme", "Kişileştirme", "Abartma", "Konuşturma"],
        c: 2,
      },
      {
        q: "Benzetme yapılırken kullanılan kelimeler hangileridir?",
        a: ["Ve, ile", "Gibi, kadar", "Ama, fakat", "Çünkü, bu yüzden"],
        c: 1,
      },
      {
        q: "'Çiçekler konuşuyor' cümlesinde hangi söz sanatı vardır?",
        a: ["Benzetme", "Kişileştirme", "Abartma", "Konuşturma"],
        c: 3,
      },
      {
        q: "'Güneş battı, ay doğdu' cümlesinde hangi ilişki vardır?",
        a: ["Benzetme", "Zıtlık", "Abartma", "Neden-sonuç"],
        c: 1,
      },
      {
        q: "Kişileştirme nedir?",
        a: [
          "İnsana özgü özelliklerin cansızlara verilmesi",
          "Karşılaştırma yapmak",
          "Abartma yapmak",
          "Soru sormak",
        ],
        c: 0,
      },
      {
        q: "'Kuş kadar yedim' ifadesinde hangi söz sanatı vardır?",
        a: ["Abartma", "Benzetme", "Kişileştirme", "Konuşturma"],
        c: 1,
      },
      {
        q: "'Bulutlar ağlıyor' cümlesinde hangi söz sanatı vardır?",
        a: ["Benzetme", "Kişileştirme", "Abartma", "Konuşturma"],
        c: 1,
      },
      // ====== EDEBÎ TÜRLER VE GENEL TEKRAR ======
      {
        q: "Olağanüstü olayların anlatıldığı, yer ve zamanın belli olmadığı tür hangisidir?",
        a: ["Hikaye", "Roman", "Masal", "Deneme"],
        c: 2,
      },
      {
        q: "Hayvanların konuşturulduğu ve sonunda ders verme amacı güden türe ne denir?",
        a: ["Masal", "Fabl", "Destan", "Anı"],
        c: 1,
      },
      {
        q: "Bir kişinin kendi hayatını anlattığı yazı türüne ne denir?",
        a: ["Biyografi", "Otobiyografi", "Günlük", "Gezi Yazısı"],
        c: 1,
      },
      {
        q: "Gezilen yerlerin anlatıldığı yazı türüne ne denir?",
        a: ["Gezi Yazısı", "Anı", "Mektup", "Haber"],
        c: 0,
      },
      {
        q: "Dizelerin sonlarındaki ses benzerliğine ne denir?",
        a: ["Kafiye (Uyak)", "Redif", "Ölçü", "Tema"],
        c: 0,
      },
      {
        q: "Şiir yazan kişiye ne denir?",
        a: ["Yazar", "Ressam", "Şair", "Besteci"],
        c: 2,
      },
      {
        q: "Bir duyguyu veya düşünceyi coşkulu bir dille anlatan tür hangisidir?",
        a: ["Makale", "Tiyatro", "Şiir", "Eleştiri"],
        c: 2,
      },
      {
        q: "Sahnede oynanmak üzere yazılan eserlere ne denir?",
        a: ["Roman", "Hikaye", "Tiyatro", "Röportaj"],
        c: 2,
      },
      {
        q: "Deyimler ve atasözleri dilimizin hangi zenginliğini gösterir?",
        a: [
          "Kısalığını",
          "Mecaz ve anlam derinliğini",
          "Zorluğunu",
          "Eskiliğini",
        ],
        c: 1,
      },
      {
        q: "Bir metnin ilk cümlesi genellikle ne cümlesidir?",
        a: ["Sonuç", "Giriş", "Gelişme", "Özet"],
        c: 1,
      },
    ],

    ingilizce: [
      // ====== PRESENT SIMPLE (Geniş Zaman) ======
      {
        q: "I _____ to school every day.",
        a: ["go", "goes", "going", "went"],
        c: 0,
      },
      {
        q: "She _____ her homework after dinner.",
        a: ["do", "does", "doing", "did"],
        c: 1,
      },
      {
        q: "They _____ football on Sundays.",
        a: ["play", "plays", "playing", "played"],
        c: 0,
      },
      {
        q: "My father _____ work at 8 o'clock.",
        a: ["start", "starts", "starting", "started"],
        c: 1,
      },
      {
        q: "_____ you like pizza?",
        a: ["Do", "Does", "Are", "Is"],
        c: 0,
      },
      {
        q: "_____ she speak English?",
        a: ["Do", "Does", "Is", "Are"],
        c: 1,
      },
      {
        q: "We _____ TV in the evenings.",
        a: ["watch", "watches", "watching", "watched"],
        c: 0,
      },
      {
        q: "He _____ milk every morning.",
        a: ["drink", "drinks", "drinking", "drank"],
        c: 1,
      },
      {
        q: "I _____ like vegetables.",
        a: ["doesn't", "don't", "isn't", "aren't"],
        c: 1,
      },
      {
        q: "She _____ live in Istanbul.",
        a: ["doesn't", "don't", "isn't", "aren't"],
        c: 0,
      },

      // ====== PRESENT CONTINUOUS (Şimdiki Zaman) ======
      {
        q: "I _____ my homework now.",
        a: ["do", "doing", "am doing", "does"],
        c: 2,
      },
      {
        q: "She _____ a book at the moment.",
        a: ["read", "reads", "reading", "is reading"],
        c: 3,
      },
      {
        q: "They _____ football now.",
        a: ["play", "plays", "are playing", "is playing"],
        c: 2,
      },
      {
        q: "_____ you listening to music?",
        a: ["Do", "Does", "Are", "Is"],
        c: 2,
      },
      {
        q: "My mother _____ dinner right now.",
        a: ["cook", "cooks", "cooking", "is cooking"],
        c: 3,
      },
      {
        q: "We _____ TV at the moment.",
        a: ["watch", "watches", "watching", "are watching"],
        c: 3,
      },
      {
        q: "He _____ to school now.",
        a: ["go", "goes", "going", "is going"],
        c: 3,
      },
      {
        q: "_____ she doing her homework?",
        a: ["Do", "Does", "Is", "Are"],
        c: 2,
      },
      {
        q: "I _____ playing games now.",
        a: ["am not", "isn't", "aren't", "don't"],
        c: 0,
      },
      {
        q: "They _____ sleeping. They are studying.",
        a: ["am not", "isn't", "aren't", "don't"],
        c: 2,
      },

      // ====== PAST SIMPLE (Geçmiş Zaman) ======
      {
        q: "I _____ to the cinema yesterday.",
        a: ["go", "goes", "went", "going"],
        c: 2,
      },
      {
        q: "She _____ a book last night.",
        a: ["read", "reads", "readed", "reading"],
        c: 0,
      },
      {
        q: "They _____ football last Sunday.",
        a: ["play", "plays", "played", "playing"],
        c: 2,
      },
      {
        q: "_____ you see the movie?",
        a: ["Do", "Does", "Did", "Are"],
        c: 2,
      },
      {
        q: "We _____ pizza for dinner last night.",
        a: ["eat", "eats", "ate", "eating"],
        c: 2,
      },
      {
        q: "He _____ his homework yesterday.",
        a: ["do", "does", "did", "doing"],
        c: 2,
      },
      {
        q: "My parents _____ to Ankara last year.",
        a: ["go", "goes", "went", "going"],
        c: 2,
      },
      {
        q: "I _____ like the movie.",
        a: ["doesn't", "don't", "didn't", "wasn't"],
        c: 2,
      },
      {
        q: "She _____ come to school yesterday.",
        a: ["doesn't", "don't", "didn't", "wasn't"],
        c: 2,
      },
      {
        q: "_____ they visit their grandparents last weekend?",
        a: ["Do", "Does", "Did", "Are"],
        c: 2,
      },

      // ====== COMPARATIVES (Karşılaştırma Sıfatları) ======
      {
        q: "An elephant is _____ than a mouse.",
        a: ["big", "bigger", "biggest", "more big"],
        c: 1,
      },
      {
        q: "My car is _____ than yours.",
        a: ["fast", "faster", "fastest", "more fast"],
        c: 1,
      },
      {
        q: "This book is _____ than that one.",
        a: [
          "interesting",
          "more interesting",
          "most interesting",
          "interestinger",
        ],
        c: 1,
      },
      {
        q: "Summer is _____ than winter.",
        a: ["hot", "hotter", "hottest", "more hot"],
        c: 1,
      },
      {
        q: "Gold is _____ than silver.",
        a: ["expensive", "more expensive", "most expensive", "expensiver"],
        c: 1,
      },
      {
        q: "This test is _____ than the last one.",
        a: ["easy", "easier", "easiest", "more easy"],
        c: 1,
      },
      {
        q: "Lions are _____ than cats.",
        a: ["dangerous", "more dangerous", "most dangerous", "dangerouser"],
        c: 1,
      },
      {
        q: "My house is _____ than his house.",
        a: ["large", "larger", "largest", "more large"],
        c: 1,
      },
      {
        q: "She is _____ than her sister.",
        a: ["tall", "taller", "tallest", "more tall"],
        c: 1,
      },
      {
        q: "This movie is _____ than that movie.",
        a: ["good", "better", "best", "gooder"],
        c: 1,
      },

      // ====== SUPERLATIVES (Üstünlük Sıfatları) ======
      {
        q: "Mount Everest is the _____ mountain in the world.",
        a: ["high", "higher", "highest", "more high"],
        c: 2,
      },
      {
        q: "This is the _____ book I have ever read.",
        a: [
          "interesting",
          "more interesting",
          "most interesting",
          "interestingest",
        ],
        c: 2,
      },
      {
        q: "She is the _____ student in the class.",
        a: ["smart", "smarter", "smartest", "more smart"],
        c: 2,
      },
      {
        q: "The cheetah is the _____ animal.",
        a: ["fast", "faster", "fastest", "more fast"],
        c: 2,
      },
      {
        q: "This is the _____ day of my life.",
        a: ["happy", "happier", "happiest", "more happy"],
        c: 2,
      },
      {
        q: "Gold is the _____ expensive metal.",
        a: ["more", "most", "much", "many"],
        c: 1,
      },
      {
        q: "January is the _____ month of the year.",
        a: ["cold", "colder", "coldest", "more cold"],
        c: 2,
      },
      {
        q: "He is the _____ player in the team.",
        a: ["good", "better", "best", "gooder"],
        c: 2,
      },
      {
        q: "This is the _____ pizza in town.",
        a: ["delicious", "more delicious", "most delicious", "deliciouser"],
        c: 2,
      },
      {
        q: "She is the _____ person I know.",
        a: ["kind", "kinder", "kindest", "more kind"],
        c: 2,
      },

      // ====== PREPOSITIONS (Edatlar) ======
      {
        q: "The cat is _____ the table.",
        a: ["on", "in", "at", "by"],
        c: 0,
      },
      {
        q: "We live _____ Istanbul.",
        a: ["on", "in", "at", "by"],
        c: 1,
      },
      {
        q: "The meeting is _____ 3 o'clock.",
        a: ["on", "in", "at", "by"],
        c: 2,
      },
      {
        q: "My birthday is _____ May.",
        a: ["on", "in", "at", "by"],
        c: 1,
      },
      {
        q: "The book is _____ the shelf.",
        a: ["on", "in", "at", "under"],
        c: 0,
      },
      {
        q: "She is _____ home.",
        a: ["on", "in", "at", "by"],
        c: 2,
      },
      {
        q: "The dog is hiding _____ the bed.",
        a: ["on", "in", "at", "under"],
        c: 3,
      },
      {
        q: "We go to school _____ bus.",
        a: ["on", "in", "at", "by"],
        c: 3,
      },
      {
        q: "There is a picture _____ the wall.",
        a: ["on", "in", "at", "under"],
        c: 0,
      },
      {
        q: "The bank is _____ the post office.",
        a: ["next to", "on", "in", "under"],
        c: 0,
      },

      // ====== MODAL VERBS (Yardımcı Fiiller) ======
      {
        q: "You _____ study for the exam.",
        a: ["can", "must", "may", "might"],
        c: 1,
      },
      {
        q: "_____ I use your pen?",
        a: ["Must", "Should", "Can", "Need"],
        c: 2,
      },
      {
        q: "She _____ speak three languages.",
        a: ["can", "must", "should", "might"],
        c: 0,
      },
      {
        q: "You _____ be quiet in the library.",
        a: ["can", "must", "may", "might"],
        c: 1,
      },
      {
        q: "_____ you help me with my homework?",
        a: ["Must", "Should", "Could", "Need"],
        c: 2,
      },
      {
        q: "We _____ go to the party tonight.",
        a: ["can", "must", "might", "need"],
        c: 2,
      },
      {
        q: "Students _____ wear uniforms at school.",
        a: ["can", "must", "may", "might"],
        c: 1,
      },
      {
        q: "You _____ eat more vegetables.",
        a: ["can", "must", "should", "might"],
        c: 2,
      },
      {
        q: "_____ I ask you a question?",
        a: ["Must", "Should", "May", "Need"],
        c: 2,
      },
      {
        q: "He _____ be at home now.",
        a: ["can", "must", "might", "need"],
        c: 2,
      },

      // ====== QUESTION WORDS (Soru Kelimeleri) ======
      {
        q: "_____ is your name?",
        a: ["What", "Where", "When", "Who"],
        c: 0,
      },
      {
        q: "_____ do you live?",
        a: ["What", "Where", "When", "Who"],
        c: 1,
      },
      {
        q: "_____ is your birthday?",
        a: ["What", "Where", "When", "Who"],
        c: 2,
      },
      {
        q: "_____ is your best friend?",
        a: ["What", "Where", "When", "Who"],
        c: 3,
      },
      {
        q: "_____ are you doing?",
        a: ["What", "Where", "When", "Who"],
        c: 0,
      },
      {
        q: "_____ old are you?",
        a: ["What", "How", "When", "Who"],
        c: 1,
      },
      {
        q: "_____ books do you have?",
        a: ["How much", "How many", "How old", "How long"],
        c: 1,
      },
      {
        q: "_____ does it cost?",
        a: ["How much", "How many", "How old", "How long"],
        c: 0,
      },
      {
        q: "_____ did you go yesterday?",
        a: ["What", "Where", "When", "Who"],
        c: 1,
      },
      {
        q: "_____ do you go to school? - By bus.",
        a: ["What", "How", "When", "Who"],
        c: 1,
      },

      // ====== THERE IS / THERE ARE ======
      {
        q: "_____ a book on the table.",
        a: ["There is", "There are", "There was", "There were"],
        c: 0,
      },
      {
        q: "_____ three cats in the garden.",
        a: ["There is", "There are", "There was", "There were"],
        c: 1,
      },
      {
        q: "_____ any milk in the fridge?",
        a: ["Is there", "Are there", "Was there", "Were there"],
        c: 0,
      },
      {
        q: "_____ many students in the classroom.",
        a: ["There is", "There are", "There was", "There were"],
        c: 1,
      },
      {
        q: "_____ a pencil in my bag.",
        a: ["There is", "There are", "There was", "There were"],
        c: 0,
      },
      {
        q: "_____ two apples on the plate.",
        a: ["There is", "There are", "There was", "There were"],
        c: 1,
      },
      {
        q: "_____ a problem with the computer.",
        a: ["There is", "There are", "There was", "There were"],
        c: 0,
      },
      {
        q: "_____ any questions?",
        a: ["Is there", "Are there", "Was there", "Were there"],
        c: 1,
      },
      {
        q: "_____ a park near my house.",
        a: ["There is", "There are", "There was", "There were"],
        c: 0,
      },
      {
        q: "_____ some water in the bottle.",
        a: ["There is", "There are", "There was", "There were"],
        c: 0,
      },

      // ====== COUNTABLE / UNCOUNTABLE ======
      {
        q: "How _____ apples do you want?",
        a: ["much", "many", "long", "old"],
        c: 1,
      },
      {
        q: "How _____ water do you need?",
        a: ["much", "many", "long", "old"],
        c: 0,
      },
      {
        q: "There isn't _____ milk.",
        a: ["some", "any", "many", "few"],
        c: 1,
      },
      {
        q: "There are _____ books on the shelf.",
        a: ["some", "any", "much", "a"],
        c: 0,
      },
      {
        q: "I need _____ sugar.",
        a: ["some", "any", "many", "few"],
        c: 0,
      },
      {
        q: "Do you have _____ brothers?",
        a: ["some", "any", "much", "a"],
        c: 1,
      },
      {
        q: "There are _____ people in the park.",
        a: ["a lot of", "much", "a", "an"],
        c: 0,
      },
      {
        q: "I don't have _____ time.",
        a: ["some", "any", "many", "few"],
        c: 1,
      },
      {
        q: "Would you like _____ tea?",
        a: ["some", "any", "many", "few"],
        c: 0,
      },
      {
        q: "There isn't _____ cheese in the fridge.",
        a: ["some", "any", "many", "few"],
        c: 1,
      },
    ],
  };

  const handleParentLogin = (pass: string) => {
    if (pass === "168859") {
      setUserType("parent");
      setParentPass("");

      // Parent dashboard'a girmeden önce Firebase'den son verileri çek
      const docRef = doc(db, "students", "emir_taha");
      onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const firebaseData = docSnap.data() as typeof studentData;
          setStudentData(firebaseData);
          // Aynı zamanda localStorage'a da kaydet
          localStorage.setItem(
            "emir_taha_progress",
            JSON.stringify(firebaseData),
          );
        }
      });

      setView("parent-dashboard");
    } else {
      alert("Hatalı şifre!");
    }
  };

  const startQuiz = (subjectId: string) => {
    // Tamamlanmamış ilk soruyu bul
    const questions = allQuestions[subjectId as keyof typeof allQuestions];
    const completedActivities: string[] = Array.isArray(
      studentData.completedActivities,
    )
      ? studentData.completedActivities
      : [];

    let startQuestionIndex = 0;
    for (let i = 0; i < questions.length; i++) {
      const activityId = `${subjectId}-question-${i}`;
      if (!completedActivities.includes(activityId)) {
        startQuestionIndex = i;
        break;
      }
    }

    setCurrentSubject(subjectId);
    setCurrentQ(startQuestionIndex);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setPassedQuestions([]);
    setIsRevisitMode(false);
    setQuizComplete(false);
    setQuizStartTime(Date.now());
    setView("quiz");
  };

  const handleAnswer = (answerIndex: number) => {
    if (answered || !currentSubject) return;

    const questions = allQuestions[currentSubject as keyof typeof allQuestions];
    const currentQuestion = questions[currentQ];

    setSelectedAnswer(answerIndex);
    setAnswered(true);

    const isCorrect = answerIndex === currentQuestion.c;
    const points = isCorrect ? 20 : 0;

    if (isCorrect) {
      setScore(score + 1);
      triggerConfetti();
    }

    // Zaman hesapla (saniye cinsinden)
    const timeSpent = quizStartTime
      ? Math.floor((Date.now() - quizStartTime) / 1000)
      : 0;

    // Günün tarihini al (YYYY-MM-DD format'ında)
    const today = new Date().toISOString().split("T")[0];
    const newDailyStats: { [date: string]: { [subject: string]: number } } = {
      ...studentData.dailyStats,
    };
    if (!newDailyStats[today]) {
      newDailyStats[today] = {};
    }
    if (!newDailyStats[today][currentSubject]) {
      newDailyStats[today][currentSubject] = 0;
    }
    newDailyStats[today][currentSubject] += timeSpent;

    const newStats = { ...studentData.subjectStats };
    newStats[currentSubject as keyof typeof newStats].total += 1;
    if (isCorrect)
      newStats[currentSubject as keyof typeof newStats].correct += 1;
    // Zaman ekle
    newStats[currentSubject as keyof typeof newStats].timeSpent =
      (newStats[currentSubject as keyof typeof newStats].timeSpent || 0) +
      timeSpent;

    // Tamamlanan aktiviteyi kaydıt
    const activityId = `${currentSubject}-question-${currentQ}`;
    const completedActivities: string[] = Array.isArray(
      studentData.completedActivities,
    )
      ? studentData.completedActivities
      : [];
    if (!completedActivities.includes(activityId)) {
      completedActivities.push(activityId);
    }

    // Eğer soru daha önce pas geçildiyse, skipped listesinden çıkar ve sayıyı azalt
    const skippedQuestions: string[] = Array.isArray(
      studentData.skippedQuestions,
    )
      ? studentData.skippedQuestions
      : [];
    const wasSkipped = skippedQuestions.includes(activityId);
    let updatedSkippedQuestions = skippedQuestions;

    const passedBySubject = studentData.passedQuestionsBySubject || {
      matematik: 0,
      fen: 0,
      turkce: 0,
      ingilizce: 0,
    };
    let updatedPassedBySubject = passedBySubject;

    if (wasSkipped) {
      updatedSkippedQuestions = skippedQuestions.filter(
        (q) => q !== activityId,
      );
      updatedPassedBySubject = {
        ...passedBySubject,
        [currentSubject]: Math.max(
          0,
          (passedBySubject[currentSubject as keyof typeof passedBySubject] ||
            0) - 1,
        ),
      };
    }

    const updatedData = {
      ...studentData,
      points: studentData.points + points,
      subjectStats: newStats,
      completedActivities: completedActivities,
      skippedQuestions: updatedSkippedQuestions,
      passedQuestionsBySubject: updatedPassedBySubject,
      dailyStats: newDailyStats,
    };

    saveData(updatedData);

    setTimeout(() => {
      if (!isRevisitMode && currentQ < questions.length - 1) {
        setCurrentQ(currentQ + 1);
        setAnswered(false);
        setSelectedAnswer(null);
        setQuizStartTime(Date.now());
      } else if (passedQuestions.length > 0) {
        setIsRevisitMode(true);
        const nextQ = passedQuestions[0];
        setPassedQuestions(passedQuestions.slice(1));
        setCurrentQ(nextQ);
        setAnswered(false);
        setSelectedAnswer(null);
        setQuizStartTime(Date.now());
      } else {
        setQuizComplete(true);
      }
    }, 1500);
  };

  const handlePassQuestion = () => {
    if (!currentSubject) return;

    const questions = allQuestions[currentSubject as keyof typeof allQuestions];

    // Pas geçilen soru numarasını ekle
    setPassedQuestions([...passedQuestions, currentQ]);

    // Soruyu tamamlanmış olarak işaretle
    const activityId = `${currentSubject}-question-${currentQ}`;
    const completedActivities: string[] = Array.isArray(
      studentData.completedActivities,
    )
      ? studentData.completedActivities
      : [];
    if (!completedActivities.includes(activityId)) {
      completedActivities.push(activityId);
    }

    // Pas geçilen soruları skippedQuestions listesine ekle
    const skippedQuestions: string[] = Array.isArray(
      studentData.skippedQuestions,
    )
      ? studentData.skippedQuestions
      : [];
    if (!skippedQuestions.includes(activityId)) {
      skippedQuestions.push(activityId);
    }

    // Pas geçilen soruları artır
    const passedBySubject = studentData.passedQuestionsBySubject || {
      matematik: 0,
      fen: 0,
      turkce: 0,
      ingilizce: 0,
    };
    const passedQuestionsBySubject = {
      ...passedBySubject,
      [currentSubject]:
        (passedBySubject[currentSubject as keyof typeof passedBySubject] || 0) +
        1,
    };

    const updatedData = {
      ...studentData,
      completedActivities: completedActivities,
      skippedQuestions: skippedQuestions,
      passedQuestionsBySubject: passedQuestionsBySubject,
    };

    saveData(updatedData);

    const updatedPassed = [...passedQuestions, currentQ];
    setPassedQuestions(updatedPassed);

    setTimeout(() => {
      if (!isRevisitMode && currentQ < questions.length - 1) {
        setCurrentQ(currentQ + 1);
        setAnswered(false);
        setSelectedAnswer(null);
        setQuizStartTime(Date.now());
      } else if (updatedPassed.length > 0) {
        setIsRevisitMode(true);
        const nextQ = updatedPassed[0];
        setPassedQuestions(updatedPassed.slice(1));
        setCurrentQ(nextQ);
        setAnswered(false);
        setSelectedAnswer(null);
        setQuizStartTime(Date.now());
      } else {
        setQuizComplete(true);
      }
    }, 500);
  };

  if (view === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-300 flex items-center justify-center">
        <div className="text-white text-2xl">Yükleniyor...</div>
      </div>
    );
  }

  if (view === "welcome") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#6366f1] via-[#a855f7] to-[#ec4899] flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-12 max-w-lg w-full transform transition-all duration-500 hover:scale-[1.01]">
          <div className="text-center mb-10">
            <div className="inline-block p-6 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-lg mb-6 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <BookOpen className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-800 mb-3 tracking-tight">
              Hoşgeldin Emir Taha!{" "}
              <span className="inline-block animate-bounce">👋</span>
            </h1>
            <p className="text-xl text-gray-600 font-medium">
              Ara tatilin en eğlenceli hali!
            </p>
          </div>

          <div className="flex flex-col space-y-5">
            <button
              onClick={() => {
                setUserType("student");
                setView("dashboard");
              }}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-5 rounded-2xl font-extrabold text-2xl hover:shadow-[0_10px_25px_rgba(99,102,241,0.4)] transform hover:-translate-y-1 transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 group border-b-4 border-indigo-800"
            >
              <span>Başla!</span>
              <span className="group-hover:translate-x-1 transition-transform">
                🚀
              </span>
            </button>

            <button
              onClick={() => setView("parent-login")}
              className="w-full bg-white text-gray-900 py-4 rounded-2xl font-extrabold text-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 shadow-sm"
            >
              Veli Girişi 👨‍👩‍👦
            </button>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
              <div className="h-1 w-1 rounded-full bg-purple-400"></div>
              Güleryüz Platform
              <div className="h-1 w-1 rounded-full bg-purple-400"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === "parent-login") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-300 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-4">
              <Award className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Veli Girişi
            </h1>
            <p className="text-gray-600">İlerlemeyi takip edin</p>
          </div>

          <div className="space-y-4">
            <input
              type="password"
              placeholder="Şifre"
              value={parentPass}
              onChange={(e) => setParentPass(e.target.value)}
              className="w-full p-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={() => handleParentLogin(parentPass)}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-extrabold text-lg shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all active:scale-95"
            >
              Giriş Yap
            </button>
            <button
              onClick={() => setView("welcome")}
              className="w-full bg-white text-gray-900 py-3 rounded-xl font-extrabold border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
            >
              Geri
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === "login") {
    return null; // Artık kullanılmıyor
  }

  if (view === "dashboard") {
    const subjects = [
      {
        id: "matematik",
        name: "Matematik",
        color: "from-blue-500 to-cyan-500",
        emoji: "🔢",
      },
      {
        id: "fen",
        name: "Fen Bilgisi",
        color: "from-green-500 to-emerald-500",
        emoji: "🔬",
      },
      {
        id: "turkce",
        name: "Türkçe",
        color: "from-purple-500 to-pink-500",
        emoji: "📚",
      },
      {
        id: "ingilizce",
        name: "İngilizce",
        color: "from-red-500 to-orange-500",
        emoji: "🇬🇧",
      },
    ];

    const badges = [
      {
        id: "first",
        name: "İlk Adım",
        icon: "🎯",
        earned:
          Object.values(studentData.subjectStats).reduce(
            (sum, s) => sum + s.total,
            0,
          ) > 0,
      },
      {
        id: "math10",
        name: "Matematik Dehası",
        icon: "🧮",
        earned: studentData.subjectStats.matematik.correct >= 10,
      },
      {
        id: "science",
        name: "Fen Kaşifi",
        icon: "🔭",
        earned: studentData.subjectStats.fen.correct >= 10,
      },
      {
        id: "word",
        name: "Kelime Ustası",
        icon: "📖",
        earned: studentData.subjectStats.turkce.correct >= 10,
      },
      {
        id: "english",
        name: "English Master",
        icon: "🇬🇧",
        earned: studentData.subjectStats.ingilizce.correct >= 10,
      },
      {
        id: "champion",
        name: "Şampiyon",
        icon: "👑",
        earned: studentData.points >= 500,
      },
    ];

    const getLevelInfo = () => {
      if (studentData.points < 100)
        return { level: "Bronz", color: "text-orange-600" };
      if (studentData.points < 300)
        return { level: "Gümüş", color: "text-gray-500" };
      if (studentData.points < 600)
        return { level: "Altın", color: "text-yellow-500" };
      if (studentData.points < 1000)
        return { level: "Platin", color: "text-cyan-500" };
      return { level: "Elmas", color: "text-purple-600" };
    };

    const levelInfo = getLevelInfo();

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto p-6">
          <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Merhaba {studentData.name}
                </h1>
                <p className="text-gray-600">Bugün ne öğrenmek istersin?</p>
              </div>
              <button
                onClick={() => {
                  setView("welcome");
                  setUserType(null);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
              >
                Çıkış
              </button>
            </div>

            <div className="mb-6">
              <button
                onClick={() => setView("ai-recommendations")}
                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-4 rounded-2xl text-white font-black text-xl flex items-center justify-center gap-3 hover:shadow-2xl hover:scale-[1.02] transition-all group"
              >
                <Brain className="w-8 h-8 animate-pulse text-indigo-200" />
                <span>AI Öğrenme Planımı Gör</span>
                <Sparkles className="w-6 h-6 text-amber-300 group-hover:rotate-12 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-6 h-6" />
                  <span className="font-bold">Toplam Puan</span>
                </div>
                <p className="text-3xl font-bold">{studentData.points}</p>
              </div>

              <div className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-6 h-6" />
                  <span className="font-bold">Seviye</span>
                </div>
                <p className={`text-3xl font-bold ${levelInfo.color}`}>
                  {levelInfo.level}
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-6 h-6" />
                  <span className="font-bold">Rozetler</span>
                </div>
                <p className="text-3xl font-bold">
                  {badges.filter((b) => b.earned).length}/6
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {subjects.map((subject) => (
              <button
                key={subject.id}
                onClick={() => startQuiz(subject.id)}
                className={`bg-gradient-to-r ${subject.color} rounded-3xl p-8 text-white hover:shadow-2xl transform hover:scale-105 transition`}
              >
                <div className="text-6xl mb-4">{subject.emoji}</div>
                <h3 className="text-2xl font-bold mb-2">{subject.name}</h3>
                <div className="bg-black/10 backdrop-blur-sm rounded-xl p-2 border border-white/20">
                  <p className="text-sm font-extrabold text-white">
                    Doğru:{" "}
                    {
                      studentData.subjectStats[
                        subject.id as keyof typeof studentData.subjectStats
                      ].correct
                    }{" "}
                    / Toplam:{" "}
                    {
                      studentData.subjectStats[
                        subject.id as keyof typeof studentData.subjectStats
                      ].total
                    }
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Award className="w-8 h-8 text-yellow-500" />
              Rozetlerim
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-4 rounded-2xl text-center transition ${
                    badge.earned
                      ? "bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-yellow-400"
                      : "bg-gray-100 opacity-50"
                  }`}
                >
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <p className="font-bold text-sm text-gray-700">
                    {badge.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === "quiz" && currentSubject) {
    const questions = allQuestions[currentSubject as keyof typeof allQuestions];
    const currentQuestion = questions[currentQ];

    if (quizComplete) {
      const percentage = Math.round((score / questions.length) * 100);
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-4">
              {percentage >= 80 ? "🎉" : percentage >= 60 ? "👏" : "💪"}
            </div>
            <h2 className="text-3xl font-bold mb-4">Tebrikler</h2>
            <p className="text-xl mb-2">
              {questions.length} sorudan{" "}
              <span className="text-green-600 font-bold">{score}</span> doğru
            </p>
            {passedQuestions.length > 0 && (
              <p className="text-lg mb-6 text-yellow-600 font-semibold">
                ⏭️ {passedQuestions.length} soru pas geçildi
              </p>
            )}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-4 mb-6">
              <p className="text-lg font-bold">+{score * 20} Puan Kazandın</p>
            </div>
            <button
              onClick={() => setView("dashboard")}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-bold hover:shadow-lg transition"
            >
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => setView("dashboard")}
                className="px-5 py-2.5 bg-white text-gray-900 rounded-2xl hover:bg-gray-50 transition-all font-extrabold flex items-center gap-2 shadow-md border-2 border-gray-200 hover:border-gray-300 active:scale-95"
              >
                <span className="text-xl">←</span> Geri
              </button>
              <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-2xl border border-yellow-200 shadow-sm">
                <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="font-bold text-yellow-700">
                  Soru {currentQ + 1}/{questions.length}
                </span>
              </div>
            </div>

            <div className="mb-8">
              <div className="bg-gray-200 rounded-full h-3 mb-6">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${((currentQ + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>

              <h3 className="text-2xl font-bold mb-8 text-gray-800">
                {currentQuestion.q}
              </h3>

              <div className="space-y-3">
                {currentQuestion.a.map((answer: string, index: number) => {
                  let bgColor =
                    "bg-white text-gray-900 border-2 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/50 shadow-sm";
                  if (answered) {
                    if (index === currentQuestion.c) {
                      bgColor =
                        "bg-green-600 text-white border-green-700 shadow-lg shadow-green-100";
                    } else if (index === selectedAnswer) {
                      bgColor =
                        "bg-red-600 text-white border-red-700 shadow-lg shadow-red-100";
                    }
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={answered}
                      className={`w-full p-5 rounded-2xl font-extrabold text-lg text-left transition-all duration-200 ${bgColor} ${
                        !answered
                          ? "transform hover:-translate-y-1"
                          : "opacity-100"
                      }`}
                    >
                      {answer}
                    </button>
                  );
                })}
              </div>

              {!answered && (
                <div className="mt-6">
                  <button
                    onClick={handlePassQuestion}
                    className="w-full p-4 rounded-2xl font-bold text-lg bg-yellow-100 text-yellow-700 border-2 border-yellow-300 hover:bg-yellow-200 transition-all duration-200 transform hover:-translate-y-1"
                  >
                    ⏭️ Pas Geç
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === "parent-dashboard") {
    const getSuccessRate = (subject: string) => {
      const stats =
        studentData.subjectStats[
          subject as keyof typeof studentData.subjectStats
        ];
      if (!stats || stats.total === 0) return 0;
      return Math.round((stats.correct / stats.total) * 100);
    };

    const resetData = async () => {
      if (confirm("Tüm ilerleme kaydedilecek ve sıfırlanacak. Emin misiniz?")) {
        const freshData = {
          name: studentData.name,
          points: 0,
          level: 1,
          badges: [],
          completedActivities: [],
          skippedQuestions: [],
          passedQuestionsBySubject: {
            matematik: 0,
            fen: 0,
            turkce: 0,
            ingilizce: 0,
          },
          dailyStats: {},
          subjectStats: {
            matematik: { correct: 0, total: 0, timeSpent: 0 },
            fen: { correct: 0, total: 0, timeSpent: 0 },
            turkce: { correct: 0, total: 0, timeSpent: 0 },
            ingilizce: { correct: 0, total: 0, timeSpent: 0 },
          },
        };
        await saveData(freshData);
        alert("Veriler sıfırlandı!");
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Veli Paneli
                </h1>
                <p className="text-gray-600">
                  {studentData.name} - İlerleme Raporu
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={resetData}
                  className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition"
                >
                  Verileri Sıfırla
                </button>
                <button
                  onClick={() => {
                    setView("welcome");
                    setUserType(null);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
                >
                  Çıkış
                </button>
              </div>
            </div>

            <div className="mb-8">
              <button
                onClick={() => setView("ai-recommendations")}
                className="w-full bg-white border-4 border-indigo-100 p-6 rounded-[32px] flex items-center justify-between group hover:border-indigo-500 transition-all hover:shadow-2xl"
              >
                <div className="flex items-center gap-6">
                  <div className="bg-indigo-600 rounded-3xl p-4 shadow-xl shadow-indigo-200 group-hover:scale-110 transition-transform">
                    <Brain className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-black text-gray-900 leading-tight">
                      AI Gelişim Analizi
                    </h3>
                    <p className="text-gray-500 font-bold">
                      Öğrenci verilerine dayalı kişiselleştirilmiş öneriler
                    </p>
                  </div>
                </div>
                <div className="bg-indigo-50 text-indigo-600 px-6 py-3 rounded-2xl font-black flex items-center gap-2 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <span>Raporu Aç</span>
                  <Sparkles className="w-5 h-5" />
                </div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
              <Target className="w-8 h-8 mb-2" />
              <p className="text-sm opacity-90">Toplam Puan</p>
              <p className="text-3xl font-bold">{studentData.points}</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
              <TrendingUp className="w-8 h-8 mb-2" />
              <p className="text-sm opacity-90">Tamamlanan Soru</p>
              <p className="text-3xl font-bold">
                {Object.values(studentData.subjectStats).reduce(
                  (sum, s) => sum + s.total,
                  0,
                )}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
              <Award className="w-8 h-8 mb-2" />
              <p className="text-sm opacity-90">Genel Başarı</p>
              <p className="text-3xl font-bold">
                {Math.round(
                  Object.keys(studentData.subjectStats).reduce(
                    (sum, key) => sum + getSuccessRate(key),
                    0,
                  ) / 4,
                )}
                %
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {["matematik", "fen", "turkce", "ingilizce"].map((subject, idx) => {
              const colorMap: {
                [key: string]: { text: string; bg: string; icon: string };
              } = {
                blue: {
                  text: "text-blue-600",
                  bg: "bg-blue-500",
                  icon: "text-blue-600",
                },
                green: {
                  text: "text-green-600",
                  bg: "bg-green-500",
                  icon: "text-green-600",
                },
                purple: {
                  text: "text-purple-600",
                  bg: "bg-purple-500",
                  icon: "text-purple-600",
                },
                red: {
                  text: "text-red-600",
                  bg: "bg-red-500",
                  icon: "text-red-600",
                },
              };
              const colorNames = ["blue", "green", "purple", "red"];
              const icons = [Calculator, Microscope, BookOpen, Award];
              const Icon = icons[idx];
              const color = colorMap[colorNames[idx]];
              const names = ["Matematik", "Fen Bilgisi", "Türkçe", "İngilizce"];
              const stats =
                studentData.subjectStats[
                  subject as keyof typeof studentData.subjectStats
                ];
              const minutes = Math.floor((stats.timeSpent || 0) / 60);
              const successRate = getSuccessRate(subject);

              return (
                <div
                  key={subject}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
                >
                  <h3
                    className={`font-bold text-lg mb-4 flex items-center gap-2 ${color.text}`}
                  >
                    <Icon className={`w-6 h-6 ${color.icon}`} />
                    {names[idx]}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-semibold">
                        Başarı Oranı
                      </span>
                      <span className={`font-bold text-lg ${color.text}`}>
                        {successRate}%
                      </span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`${color.bg} h-3 rounded-full transition-all`}
                        style={{ width: `${successRate}%` }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-green-50 rounded-lg p-2 border border-green-200">
                        <p className="text-green-700 font-semibold">
                          Doğru: {stats.correct}
                        </p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
                        <p className="text-blue-700 font-semibold">
                          Toplam: {stats.total}
                        </p>
                      </div>
                    </div>
                    {(studentData.passedQuestionsBySubject[
                      subject as keyof typeof studentData.passedQuestionsBySubject
                    ] || 0) > 0 && (
                      <div className="bg-yellow-50 rounded-lg p-2 border border-yellow-200">
                        <p className="text-yellow-700 font-semibold">
                          ⏭️ Pas Geçilen:{" "}
                          {
                            studentData.passedQuestionsBySubject[
                              subject as keyof typeof studentData.passedQuestionsBySubject
                            ]
                          }
                        </p>
                      </div>
                    )}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-3 border border-orange-200">
                      <p className="text-sm font-semibold text-orange-700 flex items-center gap-2">
                        <span>⏱️</span>
                        <span>Geçirilen Süre: {minutes} dakika</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="font-extrabold text-2xl mb-4 flex items-center gap-2 text-gray-900">
              <Zap className="w-6 h-6 text-yellow-500" />
              Günlük Çalışma Süresi
            </h3>
            <div className="space-y-3">
              {Object.keys(
                (studentData.dailyStats as {
                  [date: string]: { [subject: string]: number };
                }) || {},
              )
                .sort()
                .reverse()
                .slice(0, 7)
                .map((date) => {
                  const dailyData =
                    ((studentData.dailyStats as {
                      [date: string]: { [subject: string]: number };
                    }) || {})[date] || {};
                  const totalSeconds = Object.values(dailyData || {}).reduce(
                    (sum, sec) => sum + sec,
                    0,
                  );
                  const totalMinutes = Math.floor(totalSeconds / 60);
                  const subjects = Object.keys(dailyData || {});

                  // Tarihi daha okunaklı formata çevir
                  const dateObj = new Date(date + "T00:00:00");
                  const formattedDate = dateObj.toLocaleDateString("tr-TR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    weekday: "short",
                  });

                  return (
                    <div
                      key={date}
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-gray-800">
                            {formattedDate}
                          </p>
                          <p className="text-sm text-gray-600">
                            {subjects.length} derste çalışıldı
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">
                            {totalMinutes}
                          </p>
                          <p className="text-sm text-gray-600">dakika</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                        {["matematik", "fen", "turkce", "ingilizce"].map(
                          (subject) => {
                            const minutes = Math.floor(
                              ((dailyData as Record<string, number>)?.[
                                subject
                              ] || 0) / 60,
                            );
                            return (
                              <div
                                key={subject}
                                className="bg-white rounded-lg p-2 border border-gray-200"
                              >
                                <p className="text-gray-700 font-semibold capitalize">
                                  {subject === "matematik"
                                    ? "Matematik"
                                    : subject === "fen"
                                      ? "Fen"
                                      : subject === "turkce"
                                        ? "Türkçe"
                                        : "İngilizce"}
                                </p>
                                <p className="text-blue-600 font-bold">
                                  {minutes} min
                                </p>
                              </div>
                            );
                          },
                        )}
                      </div>
                    </div>
                  );
                })}
              {Object.keys(studentData.dailyStats || {}).length === 0 && (
                <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-200">
                  <p className="text-gray-500">Henüz hiç çalışma kaydı yok</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-extrabold text-2xl mb-4 flex items-center gap-2 text-gray-900">
              <BarChart3 className="w-6 h-6 text-indigo-500" />
              Öneriler
            </h3>
            <div className="space-y-2 text-gray-700">
              <p>• Günde 30-45 dakika çalışma idealdir</p>
              <p>• Her dersten düzenli soru çözmesini teşvik edin</p>
              <p>• Kazandığı rozetleri kutlayın</p>
              <p>• Başarısız olduğu konuları tekrar ettirin</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === "ai-recommendations") {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto mb-6 flex justify-between items-center">
          <button
            onClick={() =>
              setView(userType === "parent" ? "parent-dashboard" : "dashboard")
            }
            className="px-6 py-3 bg-white text-gray-900 rounded-2xl font-black shadow-md border-2 border-gray-100 hover:border-indigo-500 transition-all flex items-center gap-2"
          >
            <span className="text-xl">←</span>
            Paneline Dön
          </button>
        </div>
        <ErrorBoundary
          fallback={
            <div className="bg-white rounded-[40px] p-12 text-center border-2 border-rose-100 shadow-xl">
              <h2 className="text-3xl font-black text-gray-900 mb-4">
                Bir Şeyler Ters Gitti
              </h2>
              <p className="text-gray-500 font-bold text-lg mb-8">
                AI Panel yüklenirken bir hata oluştu. Lütfen sayfayı yenileyip
                tekrar deneyin.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-4 bg-indigo-600 text-white rounded-3xl font-black shadow-lg hover:bg-indigo-700 transition-all"
              >
                Sayfayı Yenile
              </button>
            </div>
          }
        >
          <AIRecommendationPanel
            studentData={studentData}
            userType={userType}
          />
        </ErrorBoundary>
      </div>
    );
  }

  return null;
};

export default EduPlatform;
