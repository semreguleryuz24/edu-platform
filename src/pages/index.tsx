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

  const allQuestions = {
    matematik: [
      {
        q: "6² + 2³ - 10 işleminin sonucu kaçtır?",
        a: ["32", "34", "38", "44"],
        c: 1,
      },
      {
        q: "72 ÷ (2³ + 1) × 2 işleminin sonucu kaçtır?",
        a: ["4", "8", "16", "18"],
        c: 2,
      },
      {
        q: "12, 18 ve 24 sayılarının en büyük ortak böleni (EBOB) kaçtır?",
        a: ["2", "4", "6", "12"],
        c: 2,
      },
      {
        q: "Rakamları farklı üç basamaklı en küçük asal sayı kaçtır?",
        a: ["101", "103", "107", "109"],
        c: 1,
      },
      {
        q: "Aşağıdakilerden hangisi 2, 3 ve 5 ile kalansız bölünebilir?",
        a: ["120", "155", "182", "215"],
        c: 0,
      },
      {
        q: "48 sayısının kaç tane doğal sayı çarpanı vardır?",
        a: ["8", "10", "12", "14"],
        c: 1,
      },
      {
        q: "A = { 10'dan küçük tek asal sayılar } kümesi hangisidir?",
        a: ["{1, 3, 5, 7}", "{3, 5, 7}", "{2, 3, 5, 7}", "{3, 5, 7, 9}"],
        c: 1,
      },
      {
        q: "Sayı doğrusunda -12 ile +2 arasında kaç tane tam sayı vardır?",
        a: ["12", "13", "14", "15"],
        c: 1,
      },
      {
        q: "|-15| - |+8| + |-3| işleminin sonucu kaçtır?",
        a: ["4", "10", "20", "26"],
        c: 1,
      },
      {
        q: "3/8 + 1/4 - 1/8 işleminin sonucu kaçtır?",
        a: ["3/8", "1/2", "5/8", "3/4"],
        c: 1,
      },
      {
        q: "İki ucu da sınırsız olan düz çizgiye ne denir?",
        a: ["Doğru", "Doğru Parçası", "Işın", "Açı"],
        c: 0,
      },
      {
        q: "Bir ucu kapalı, diğer ucu sınırsız uzayan çizgiye ne denir?",
        a: ["Doğru", "Doğru Parçası", "Işın", "Nokta"],
        c: 2,
      },
      {
        q: "Sembolle gösterimi [AB] olan geometrik kavram hangisidir?",
        a: ["AB Doğrusu", "AB Doğru Parçası", "AB Işını", "A noktası"],
        c: 1,
      },
      {
        q: "Aynı düzlemde hiçbir noktası kesişmeyen doğrulara ne denir?",
        a: [
          "Kesen Doğrular",
          "Dik Doğrular",
          "Paralel Doğrular",
          "Çakışık Doğrular",
        ],
        c: 2,
      },
      {
        q: "Toplamları 90 derece olan iki açıya ne denir?",
        a: ["Bütünler Açılar", "Tümler Açılar", "Ters Açılar", "Komşu Açılar"],
        c: 1,
      },
      {
        q: "Toplamları 180 derece olan iki açıya ne denir?",
        a: ["Bütünler Açılar", "Tümler Açılar", "Ters Açılar", "Yöndeş Açılar"],
        c: 0,
      },
      {
        q: "Ölçüsü 42 derece olan bir açının tümleri kaç derecedir?",
        a: ["38", "48", "58", "138"],
        c: 1,
      },
      {
        q: "Ölçüsü 75 derece olan bir açının bütünleri kaç derecedir?",
        a: ["15", "95", "105", "115"],
        c: 2,
      },
      {
        q: "Birbirini kesen iki doğrunun oluşturduğu karşılıklı açılara ne denir?",
        a: ["Komşu Açılar", "Yöndeş Açılar", "Ters Açılar", "İç Ters Açılar"],
        c: 2,
      },
      {
        q: "Ters açıların ölçüleri için hangisi doğrudur?",
        a: [
          "Toplamları 180'dir",
          "Toplamları 90'dur",
          "Birbirine eşittir",
          "Farkları 90'dır",
        ],
        c: 2,
      },
      {
        q: "Paralel iki doğruyu kesen bir doğrunun oluşturduğu, aynı yöne bakan açılara ne denir?",
        a: [
          "İç Ters Açılar",
          "Dış Ters Açılar",
          "Yöndeş Açılar",
          "Ters Açılar",
        ],
        c: 2,
      },
      {
        q: "Yöndeş açıların ölçüleri için hangisi söylenebilir?",
        a: [
          "Ölçüleri eşittir",
          "Bütünler açılardır",
          "Tümler açılardır",
          "Toplamları 360'tır",
        ],
        c: 0,
      },
      {
        q: "Paralel doğruların arasında kalan ve kesen doğrunun farklı tarafında olan açılara ne denir?",
        a: [
          "Dış Ters Açılar",
          "İç Ters Açılar",
          "Yöndeş Açılar",
          "Ters Açılar",
        ],
        c: 1,
      },
      {
        q: "Paralel doğruların dışında kalan ve kesen doğrunun farklı tarafında olan açılara ne denir?",
        a: [
          "İç Ters Açılar",
          "Dış Ters Açılar",
          "Yöndeş Açılar",
          "Bütünler Açılar",
        ],
        c: 1,
      },
      {
        q: "İki doğrunun birbirini 90 derecelik açıyla kesmesine ne denir?",
        a: ["Paralellik", "Diklik", "Çakışıklık", "Doğrusallık"],
        c: 1,
      },
      {
        q: "Komşu bütünler iki açıdan biri 60 derece ise diğeri kaç derecedir?",
        a: ["30", "60", "120", "150"],
        c: 2,
      },
      {
        q: "Bir açının bütünleri 110 derece ise bu açının tümleri kaç derecedir?",
        a: ["20", "30", "70", "80"],
        c: 0,
      },
      {
        q: "Sembolle gösterimi d // k olan ifade ne anlama gelir?",
        a: [
          "d ve k paraleldir",
          "d ve k diktir",
          "d ve k kesişir",
          "d ve k çakışıktır",
        ],
        c: 0,
      },
      {
        q: "d // k ise, iç ters açıların ölçüleri toplamı hakkında ne söylenebilir?",
        a: [
          "Her zaman 180'dir",
          "Biri diğerinden büyüktür",
          "Ölçüleri birbirine eşittir",
          "Toplamları 90'dır",
        ],
        c: 2,
      },
      {
        q: "Aşağıdakilerden hangisi bir açının sembolle gösterimi olabilir?",
        a: ["[AB", "AB", "s(ABC)", "|AB|"],
        c: 2,
      },
      { q: "5³ ifadesinin değeri kaçtır?", a: ["15", "25", "75", "125"], c: 3 },
      {
        q: "10⁴ sayısının sonunda kaç sıfır vardır?",
        a: ["3", "4", "5", "10"],
        c: 1,
      },
      {
        q: "25 × (12 + 8) işleminin sonucu kaçtır?",
        a: ["308", "400", "500", "600"],
        c: 2,
      },
      {
        q: "40 ÷ 5 × 2 + 6 işleminin sonucu kaçtır?",
        a: ["10", "16", "22", "30"],
        c: 2,
      },
      {
        q: "Rakamları farklı dört basamaklı en küçük sayı kaçtır?",
        a: ["1000", "1023", "1234", "1024"],
        c: 1,
      },
      {
        q: "36 ve 48 sayılarının ortak bölenlerinden en büyüğü kaçtır?",
        a: ["6", "8", "12", "18"],
        c: 2,
      },
      {
        q: "Aşağıdaki sayılardan hangisi 9 ile tam bölünür?",
        a: ["123", "456", "789", "891"],
        c: 3,
      },
      { q: "Hangi sayı asal değildir?", a: ["2", "13", "27", "31"], c: 2 },
      {
        q: "20 sayısının doğal sayı çarpanlarından kaç tanesi çifttir?",
        a: ["3", "4", "5", "6"],
        c: 1,
      },
      {
        q: "6 ve 8'in 50'den küçük en büyük ortak katı kaçtır?",
        a: ["24", "42", "48", "52"],
        c: 2,
      },
      {
        q: "A = { k, a, l, e, m } kümesinin eleman sayısı kaçtır?",
        a: ["4", "5", "6", "7"],
        c: 1,
      },
      {
        q: "B = { x | x < 5 ve x bir rakam } kümesi kaç elemanlıdır?",
        a: ["4", "5", "6", "7"],
        c: 1,
      },
      {
        q: "Boş kümenin sembolü hangisidir?",
        a: ["{0}", "∅", "{ }", "Her ikisi de (∅ veya { })"],
        c: 3,
      },
      {
        q: "-5'ten büyük en küçük tam sayı kaçtır?",
        a: ["-6", "-4", "0", "1"],
        c: 1,
      },
      {
        q: "Mutlak değeri 7 olan kaç tane tam sayı vardır?",
        a: ["0", "1", "2", "Sonsuz"],
        c: 2,
      },
      {
        q: "Sayı doğrusunda -8'in 3 birim solundaki sayı kaçtır?",
        a: ["-5", "-11", "+11", "0"],
        c: 1,
      },
      {
        q: "Aşağıdaki sıralamalardan hangisi doğrudur?",
        a: ["-10 > -2", "0 < -5", "|-8| > 5", "-3 > 0"],
        c: 2,
      },
      {
        q: "En büyük negatif tam sayı kaçtır?",
        a: ["-100", "-99", "-1", "0"],
        c: 2,
      },
      {
        q: "2/5 kesrinin 4 ile genişletilmiş hali hangisidir?",
        a: ["6/9", "8/20", "8/5", "2/20"],
        c: 1,
      },
      {
        q: "12/18 kesrinin en sade hali hangisidir?",
        a: ["2/3", "3/4", "1/2", "6/9"],
        c: 0,
      },
      {
        q: "3¾ bileşik kesre çevrilirse ne olur?",
        a: ["12/4", "13/4", "15/4", "11/4"],
        c: 2,
      },
      { q: "Hangisi 1/2'den büyüktür?", a: ["1/3", "2/5", "3/8", "4/7"], c: 3 },
      {
        q: "5 - 2/3 işleminin sonucu kaçtır?",
        a: ["3/3", "7/3", "13/3", "17/3"],
        c: 2,
      },
      {
        q: "Bir tümler açının ölçüsü diğerinin 2 katı ise küçük açı kaç derecedir?",
        a: ["30", "45", "60", "90"],
        c: 0,
      },
      {
        q: "Bütünler iki açıdan biri 130 derece ise diğeri kaçtır?",
        a: ["40", "50", "60", "70"],
        c: 1,
      },
      {
        q: "İki paralel doğrunun her birini kesen doğruya ne denir?",
        a: ["Dikme", "Kesen", "Açıortay", "Işın"],
        c: 1,
      },
      {
        q: "Ters açılar oluşturulurken en az kaç doğru gereklidir?",
        a: ["1", "2", "3", "4"],
        c: 1,
      },
      {
        q: "d // k ve d ⊥ m ise k ve m arasındaki ilişki nedir?",
        a: ["Paralel", "Dik", "Çakışı", "Ayrık"],
        c: 1,
      },
      {
        q: "90 derecelik açıya ne denir?",
        a: ["Dar", "Geniş", "Dik", "Tam"],
        c: 2,
      },
      {
        q: "Dar açının ölçüsü hangi aralıktadır?",
        a: ["0-90", "90-180", "180-360", "Sadece 90"],
        c: 0,
      },
      {
        q: "Geniş açının ölçüsü hangisi olamaz?",
        a: ["91", "120", "179", "185"],
        c: 3,
      },
      {
        q: "İki ışının başlangıç noktalarının birleşmesiyle oluşan geometrik şekil?",
        a: ["Açı", "Doğru", "Nokta", "Üçgen"],
        c: 0,
      },
      {
        q: "Aşağıdakilerden hangisi bir küme belirtmez?",
        a: [
          "Okuldaki yakışıklı çocuklar",
          "Haftanın günleri",
          "Uçan filler",
          "Sınıfın kızları",
        ],
        c: 0,
      },
      {
        q: "A = { 1, 2, {3, 4} } kümesi için hangisi elemanıdır?",
        a: ["3", "4", "{3, 4}", "{1}"],
        c: 2,
      },
      { q: "Kesişim sembolü hangisidir?", a: ["∪", "∩", "∈", "⊂"], c: 1 },
      { q: "Birleşim sembolü hangisidir?", a: ["∩", "∪", "∖", "⊆"], c: 1 },
      {
        q: "A = { 1, 2, 3 } ve B = { 3, 4, 5 } ise A ∩ B nedir?",
        a: ["{3}", "{1, 2, 3, 4, 5}", "{ }", "{1, 2}"],
        c: 0,
      },
      { q: "|-100| kaçtır?", a: ["-100", "0", "100", "1"], c: 2 },
      {
        q: "Sıfırın işareti nedir?",
        a: ["Pozitif", "Negatif", "İşaretsiz", "Nötr"],
        c: 2,
      },
      {
        q: "Deniz seviyesinin altı hangi tam sayılarla gösterilir?",
        a: ["Pozitif", "Negatif", "Asal", "Doğal"],
        c: 1,
      },
      { q: "En küçük asal sayı kaçtır?", a: ["0", "1", "2", "3"], c: 2 },
      {
        q: "Hem 2'ye hem 3'e bölünen bir sayı hangisine de bölünür?",
        a: ["4", "5", "6", "9"],
        c: 2,
      },
      {
        q: "45 sayısının asal çarpanları hangileridir?",
        a: ["3 ve 5", "2 ve 5", "3 ve 9", "5 ve 9"],
        c: 0,
      },
      {
        q: "Bir sayının 0. kuvveti (sıfır hariç) her zaman kaçtır?",
        a: ["0", "1", "Sayının kendisi", "Belirsiz"],
        c: 1,
      },
      { q: "8² - 2⁶ işleminin sonucu kaçtır?", a: ["0", "2", "4", "8"], c: 0 },
      {
        q: "İşlem önceliğinde ilk sıra hangisidir?",
        a: ["Çarpma", "Bölme", "Üslü İfade", "Parantez"],
        c: 2,
      },
      {
        q: "Çarpmanın toplama üzerine dağılma özelliği: a × (b + c) = ?",
        a: ["a×b + c", "a + b×c", "a×b + a×c", "a+b + a+c"],
        c: 2,
      },
      {
        q: "Sayı doğrusu üzerinde sağa gidildikçe sayılar ne olur?",
        a: ["Küçülür", "Büyür", "Değişmez", "Önce büyür sonra küçülür"],
        c: 1,
      },
      {
        q: "-15 mi büyük -20 mi?",
        a: ["-15", "-20", "Eşit", "Karşılaştırılamaz"],
        c: 0,
      },
      {
        q: "Aşağıdakilerden hangisi doğrudur?",
        a: ["-5 > 2", "0 < -1", "|-3| = 3", "-8 = 8"],
        c: 2,
      },
      {
        q: "Paydaları eşit kesirlerde payı büyük olan daha ...?",
        a: ["Küçüktür", "Büyüktür", "Eşittir", "Belirsizdir"],
        c: 1,
      },
      {
        q: "Payları eşit kesirlerde paydası küçük olan daha ...?",
        a: ["Küçüktür", "Büyüktür", "Eşittir", "Belirsizdir"],
        c: 1,
      },
      {
        q: "Ardışık iki doğal sayının ortak böleni her zaman kaçtır?",
        a: ["0", "1", "2", "Sayının küçük olanı"],
        c: 1,
      },
      {
        q: "Bir sayının 1'e bölümü nedir?",
        a: ["0", "1", "Sayının kendisi", "Belirsiz"],
        c: 2,
      },
      {
        q: "10³ + 10² işleminin sonucu kaçtır?",
        a: ["100", "110", "1000", "1100"],
        c: 3,
      },
      { q: "5⁴ mü büyüktür 4⁵ mi?", a: ["5⁴", "4⁵", "Eşit", "Belirsiz"], c: 1 },
      {
        q: "Hangisi 2 ile tam bölünemez?",
        a: ["122", "450", "787", "900"],
        c: 2,
      },
      {
        q: "Sonu 0 veya 5 olan sayılar hangisine tam bölünür?",
        a: ["2", "3", "5", "10"],
        c: 2,
      },
      {
        q: "İki basamaklı en küçük asal sayı kaçtır?",
        a: ["10", "11", "13", "17"],
        c: 1,
      },
      {
        q: "1, 2, 3, 4, 6, 12 sayıları hangi sayının çarpanlarıdır?",
        a: ["6", "12", "18", "24"],
        c: 1,
      },
      {
        q: "Ölçüsü 180 derece olan açılara ne denir?",
        a: ["Dik", "Doğru", "Tam", "Dar"],
        c: 1,
      },
      {
        q: "Ölçüsü 360 derece olan açılara ne denir?",
        a: ["Doğru", "Geniş", "Tam", "Dar"],
        c: 2,
      },
      {
        q: "Yarım dairelik bir açı ölçer (iletki) ile en fazla kaç derece ölçülür?",
        a: ["90", "180", "270", "360"],
        c: 1,
      },
      {
        q: "Noktanın boyutu nedir?",
        a: ["Yoktur", "1 boyutlu", "2 boyutlu", "3 boyutlu"],
        c: 0,
      },
      {
        q: "Aynı noktadan çıkan iki ışın neyi oluşturur?",
        a: ["Doğruyu", "Açıyı", "Üçgeni", "Daireyi"],
        c: 1,
      },
      {
        q: "7'nin 100'e kadar kaç tane katı vardır?",
        a: ["13", "14", "15", "16"],
        c: 1,
      },
      { q: "En küçük doğal sayı kaçtır?", a: ["0", "1", "-1", "Yoktur"], c: 0 },
      {
        q: "Sayı doğrusunda -10 ile +10 arasında kaç tane doğal sayı vardır?",
        a: ["9", "10", "11", "20"],
        c: 1,
      },
      {
        q: "Bir kesrin pay ve paydasını aynı sayıya bölmeye ne denir?",
        a: ["Genişletme", "Sadeleştirme", "Bölme", "Çarpma"],
        c: 1,
      },
      {
        q: "1 tam 1/2 kesri kaça eşittir?",
        a: ["0.5", "1.2", "1.5", "2.1"],
        c: 2,
      },
      {
        q: "Bir sayının 5 katının 3 eksiği 12 ise bu sayı kaçtır?",
        a: ["3", "4", "5", "6"],
        c: 0,
      },
      {
        q: "x + 7 = 15 denklemini sağlayan x değeri kaçtır?",
        a: ["7", "8", "9", "10"],
        c: 1,
      },
      {
        q: "2x - 4 = 10 denklemini sağlayan x değeri kaçtır?",
        a: ["5", "6", "7", "8"],
        c: 2,
      },
      {
        q: "Bir üçgenin iç açıları toplamı kaç derecedir?",
        a: ["90", "180", "270", "360"],
        c: 1,
      },
      {
        q: "Bir karenin çevresi 20 cm ise alanı kaç cm²'dir?",
        a: ["16", "20", "25", "100"],
        c: 2,
      },
      {
        q: "Yarıçapı 5 cm olan bir dairenin çevresi kaç π cm'dir?",
        a: ["5π", "10π", "25π", "50π"],
        c: 1,
      },
      {
        q: "Bir dikdörtgenin uzun kenarı 8 cm, kısa kenarı 5 cm ise alanı kaç cm²'dir?",
        a: ["13", "26", "40", "80"],
        c: 2,
      },
      { q: "Bir küpün kaç yüzü vardır?", a: ["4", "6", "8", "12"], c: 1 },
      {
        q: "Bir üçgenin kenar uzunlukları 3, 4, 5 cm ise bu nasıl bir üçgendir?",
        a: ["Eşkenar", "İkizkenar", "Dik", "Geniş Açılı"],
        c: 2,
      },
      {
        q: "Bir sayının %20'si 10 ise bu sayı kaçtır?",
        a: ["20", "40", "50", "100"],
        c: 2,
      },
      { q: "250 sayısının %10'u kaçtır?", a: ["2.5", "10", "25", "50"], c: 2 },
      {
        q: "Bir ürün %20 indirimle 80 TL'ye satılıyorsa indirimsiz fiyatı kaç TL'dir?",
        a: ["90", "100", "120", "160"],
        c: 1,
      },
      {
        q: "Bir sınıfta 15 kız, 10 erkek öğrenci varsa kız öğrencilerin tüm sınıfa oranı kaçtır?",
        a: ["1/2", "2/3", "3/5", "3/4"],
        c: 2,
      },
      {
        q: "Bir torbada 3 kırmızı, 2 mavi top vardır. Rastgele çekilen bir topun kırmızı olma olasılığı kaçtır?",
        a: ["1/5", "2/5", "3/5", "1/2"],
        c: 2,
      },
      {
        q: "Bir zar atıldığında üst yüze gelen sayının çift sayı olma olasılığı kaçtır?",
        a: ["1/6", "1/3", "1/2", "2/3"],
        c: 2,
      },
      {
        q: "Bir madeni para iki kez atıldığında ikisinin de tura gelme olasılığı kaçtır?",
        a: ["1/2", "1/3", "1/4", "1/8"],
        c: 2,
      },
      {
        q: "Ortalaması 7 olan 3 sayının toplamı kaçtır?",
        a: ["10", "14", "21", "28"],
        c: 2,
      },
      {
        q: "5, 8, 12, 15 sayılarının aritmetik ortalaması kaçtır?",
        a: ["9", "10", "11", "12"],
        c: 0,
      },
      {
        q: "Bir veri grubundaki en büyük değer ile en küçük değer arasındaki farka ne denir?",
        a: ["Ortalama", "Medyan", "Mod", "Açıklık"],
        c: 3,
      },
      {
        q: "Bir veri grubunda en çok tekrar eden değere ne denir?",
        a: ["Ortalama", "Medyan", "Mod", "Açıklık"],
        c: 2,
      },
      {
        q: "Bir veri grubunda küçükten büyüğe sıralandığında ortada kalan değere ne denir?",
        a: ["Ortalama", "Medyan", "Mod", "Açıklık"],
        c: 1,
      },
    ],
    fen: [
      {
        q: "Güneş'e en uzak gezegen aşağıdakilerden hangisidir?",
        a: ["Uranüs", "Neptün", "Satürn", "Jüpiter"],
        c: 1,
      },
      {
        q: "Hangi iki gezegen arasında Asteroit Kuşağı bulunur?",
        a: [
          "Dünya - Mars",
          "Mars - Jüpiter",
          "Jüpiter - Satürn",
          "Venüs - Dünya",
        ],
        c: 1,
      },
      {
        q: "Yüzey sıcaklığı en fazla olan 'Sıcak Gezegen' hangisidir?",
        a: ["Merkür", "Venüs", "Mars", "Jüpiter"],
        c: 1,
      },
      {
        q: "Güneş tutulması ile ilgili hangisi yanlıştır?",
        a: [
          "Ay, Yeni Ay evresindedir",
          "Gündüz gerçekleşir",
          "Dünya'nın gölgesi Ay üzerine düşer",
          "Ay, Dünya ile Güneş arasındadır",
        ],
        c: 2,
      },
      {
        q: "Ay tutulması hangi evrede gerçekleşir?",
        a: ["Yeni Ay", "İlk Dördün", "Dolunay", "Son Dördün"],
        c: 2,
      },
      {
        q: "Oynamaz eklemler nerede bulunur?",
        a: ["Diz kapağı", "Kafatası", "Omurga", "Parmaklar"],
        c: 1,
      },
      {
        q: "Mide ve bağırsaklarda bulunan, istemsiz çalışan kas türü hangisidir?",
        a: ["Çizgili kas", "Düz kas", "Kalp kası", "İskelet kası"],
        c: 1,
      },
      {
        q: "Proteinlerin kimyasal sindirimi nerede başlar?",
        a: ["Ağız", "Mide", "İnce bağırsak", "Yutak"],
        c: 1,
      },
      {
        q: "Safra salgısı ve pankreas öz suyu nereye dökülür?",
        a: [
          "Mide",
          "Kalın bağırsak",
          "İnce bağırsak (Onikiparmak b.)",
          "Yemek borusu",
        ],
        c: 2,
      },
      {
        q: "Sindirilmiş besinlerin emilerek kana geçtiği yapı hangisidir?",
        a: ["Villus", "Alveol", "Nefron", "Miyofibril"],
        c: 0,
      },
      {
        q: "Küçük kan dolaşımının amacı nedir?",
        a: [
          "Besin taşımak",
          "Kanı temizlemek (Oksijenlendirmek)",
          "Vücuda kan dağıtmak",
          "Hormon iletmek",
        ],
        c: 1,
      },
      {
        q: "Kan hücrelerinden hangisi vücut savunmasında (bağışıklık) görevlidir?",
        a: ["Alyuvar", "Akyuvar", "Kan pulcuğu", "Plazma"],
        c: 1,
      },
      {
        q: "Kalbin sol karıncığından çıkan temiz kanı vücuda dağıtan en büyük atardamar?",
        a: ["Akciğer atardamarı", "Aort", "Şah damarı", "Böbrek atardamarı"],
        c: 1,
      },
      {
        q: "Sabit süratle 20 saniyede 400 metre yol alan bir aracın sürati kaç m/s'dir?",
        a: ["10", "20", "40", "80"],
        c: 1,
      },
      {
        q: "Kızıl Gezegen olarak bilinen hangisidir?",
        a: ["Jüpiter", "Mars", "Merkür", "Uranüs"],
        c: 1,
      },
      {
        q: "Halkası en belirgin olan gezegen hangisidir?",
        a: ["Jüpiter", "Neptün", "Satürn", "Uranüs"],
        c: 2,
      },
      {
        q: "Besinlerin ağızda dişler yardımıyla parçalanmasına ne denir?",
        a: ["Kimyasal sindirim", "Mekanik sindirim", "Emilim", "Solunum"],
        c: 1,
      },
      {
        q: "Mide öz suyu hangi besin grubunu sindirir?",
        a: ["Yağlar", "Vitamins", "Proteinler", "Karbonhidratlar"],
        c: 2,
      },
      {
        q: "Kanın kalpten çıkıp akciğere gidip temizlenip dönmesine ne denir?",
        a: ["Büyük dolaşım", "Küçük dolaşım", "Hızlı dolaşım", "Tam dolaşım"],
        c: 1,
      },
      {
        q: "Havadaki oksijenin kana geçtiği küçük keseciklere ne denir?",
        a: ["Bronş", "Bronşçuk", "Alveol", "Soluk borusu"],
        c: 2,
      },
      {
        q: "Böbreklerde kanın süzüldüğü en küçük birime ne denir?",
        a: ["Nefron", "Villus", "Alveol", "Nöron"],
        c: 0,
      },
      {
        q: "İdrarın dışarı atılmadan önce toplandığı yer neresidir?",
        a: ["Üreter", "Üretra", "İdrar kesesi", "Böbrek"],
        c: 2,
      },
      {
        q: "Kuvvet ne ile ölçülür?",
        a: ["Termometre", "Dinamometre", "Barometre", "Metre"],
        c: 1,
      },
      {
        q: "Kuvvetin birimi nedir?",
        a: ["Kilogram", "Newton", "Metre", "Saniye"],
        c: 1,
      },
      {
        q: "Jüpiter'in en büyük uydusu?",
        a: ["Ay", "Titan", "Ganymede", "Phobos"],
        c: 2,
      },
      {
        q: "Satürn'ün en ünlü uydusu?",
        a: ["Titan", "Ay", "Deimos", "Europa"],
        c: 0,
      },
      {
        q: "Dünya'nın ikizi olarak bilinen gezegen?",
        a: ["Mars", "Venüs", "Merkür", "Uranüs"],
        c: 1,
      },
      {
        q: "Güneş enerjisini ne ile yayar?",
        a: ["Elektrik", "Isı ve Işık", "Su", "Ses"],
        c: 1,
      },
      {
        q: "Ay'ın Güneş ile Dünya arasına girmesi?",
        a: ["Ay Tutulması", "Güneş Tutulması", "Yıldız Kayması", "Dolunay"],
        c: 1,
      },
      {
        q: "Dünya'nın Ay ile Güneş arasina girmesi?",
        a: ["Ay Tutulması", "Güneş Tutulması", "Yeni Ay", "Hilal"],
        c: 0,
      },
      {
        q: "Kısa kemiklerin boyu ve eni nasıldır?",
        a: ["Boyu uzundur", "Eni kalındır", "Birbirine yakındır", "Sonsuzdur"],
        c: 2,
      },
      {
        q: "Sinir sistemini koruyan kemik yapısı?",
        a: ["Kafatası", "Omurga", "Göğüs kafesi", "Hepsi"],
        c: 3,
      },
      {
        q: "Yemek borusu ile mide arasındaki kapakçık neyi engeller?",
        a: ["Besin geçişini", "Geri kaçışı", "Çiğnemeyi", "Konuşmayı"],
        c: 1,
      },
      {
        q: "Sindirilmeyen atıklar nereden atılır?",
        a: ["Böbrek", "Anüs", "Ağız", "Burun"],
        c: 1,
      },
      {
        q: "Büyük kan dolaşımı amacı nedir?",
        a: [
          "Kanı temizlemek",
          "Vücuda besin ve O2 taşımak",
          "Terlemek",
          "Düşünmek",
        ],
        c: 1,
      },
      {
        q: "Kan pulcuklarının görevi?",
        a: ["Oksijen taşımak", "Mikrop öldürmek", "Pıhtılaşma", "Renk vermek"],
        c: 2,
      },
      {
        q: "Hangi damarda kan basıncı en yüksektir?",
        a: ["Toplardamar", "Kılcal damar", "Atardamar", "Lenf"],
        c: 2,
      },
      {
        q: "Nefes alırken göğüs kafesi ne olur?",
        a: ["Daralır", "Genişler", "Sıkışır", "Aşağı iner"],
        c: 1,
      },
      {
        q: "Hava temizleme ve nemlendirme nerede olur?",
        a: ["Ağız", "Burun", "Yutak", "Gırtlak"],
        c: 1,
      },
      {
        q: "Böbrekler karın boşluğunun neresindedir?",
        a: ["Önünde", "Arka tarafında (Bel hizası)", "Altında", "Kalbimizde"],
        c: 1,
      },
      {
        q: "Üre nedir?",
        a: ["Vitamin", "Zehirli atık", "Besin", "Hücre"],
        c: 1,
      },
      {
        q: "Dinamometrelerin ölçüm sınırı neye bağlıdır?",
        a: ["Rengine", "Boyuna", "Yayın esnekliğine", "Fiyatına"],
        c: 2,
      },
      {
        q: "Kuvvetin yönü ne ile gösterilir?",
        a: ["Ok işareti", "Nokta", "Kare", "Daire"],
        c: 0,
      },
      {
        q: "Zıt yönlü kuvvetlerin bileşkesi nasıl bulunur?",
        a: ["Toplayarak", "Çarparak", "Çıkararak", "Bölerek"],
        c: 2,
      },
      {
        q: "Aynı yönlü kuvvetlerin bileşkesi nasıl bulunur?",
        a: ["Çıkararak", "Toplayarak", "Bölerek", "Kök alarak"],
        c: 1,
      },
      {
        q: "Sürati 50 km/h olan araç 2 saatte kaç km yol alır?",
        a: ["25", "50", "100", "200"],
        c: 2,
      },
      {
        q: "Sürati 10 m/s olan araç 100 metreyi kaç saniyede alır?",
        a: ["1", "10", "100", "1000"],
        c: 1,
      },
      {
        q: "Aşağıdakilerden hangisi sindirime yardımcı organdır?",
        a: ["Mide", "İnce Bağırsak", "Karaciğer", "Yemek Borusu"],
        c: 2,
      },
      {
        q: "İnce bağırsakta emilim ne ile artırılır?",
        a: ["Villuslar", "Dişler", "Asit", "Su"],
        c: 0,
      },
      {
        q: "Kalbin sol tarafında nasıl kan bulunur?",
        a: ["Kirli", "Temiz", "Siyah", "Koyu"],
        c: 1,
      },
      {
        q: "Akciğer toplardamarı temiz mi kirli mi kan taşır?",
        a: ["Kirli", "Temiz", "Az kirli", "Boş"],
        c: 1,
      },
      {
        q: "Yürürken hangi kaslarımız aktif çalışır?",
        a: ["Mide kası", "İskelet kasları", "Kalp kası", "B ve C"],
        c: 3,
      },
      {
        q: "Güneş Sistemi'nde yaşam için en kritik gezegen?",
        a: ["Mars", "Venüs", "Dünya", "Merkür"],
        c: 2,
      },
      {
        q: "Soluk borusunun yapısında ne bulunur?",
        a: ["Sadece kas", "Kıkırdak halkalar", "Kemik", "Diş"],
        c: 1,
      },
      {
        q: "Karasal gezegenlerin diğer adı nedir?",
        a: [
          "Dış gezegenler",
          "Gaz devleri",
          "İç gezegenler",
          "Halkalı gezegenler",
        ],
        c: 2,
      },
      {
        q: "Vücudumuzun çatısını oluşturan ve organları koruyan sistem?",
        a: [
          "Sindirim sistemi",
          "Dolaşım sistemi",
          "Destek ve hareket sistemi",
          "Boşaltım sistemi",
        ],
        c: 2,
      },
      {
        q: "Yarı oynar eklemler nerede bulunur?",
        a: ["Kafatası", "Kollar", "Omurga", "Bacaklar"],
        c: 2,
      },
      {
        q: "Mekanik (fiziksel) sindirim nerede başlar?",
        a: ["Mide", "Ağız", "Yutak", "İnce bağırsak"],
        c: 1,
      },
      {
        q: "Büyük kan dolaşımı kalbin hangi bölümünden başlar?",
        a: ["Sağ karıncık", "Sol karıncık", "Sağ kulakçık", "Sol kulakçık"],
        c: 1,
      },
      {
        q: "Hangi kan hücresi kana kırmızı rengini verir ve oksijen taşır?",
        a: ["Alyuvar", "Akyuvar", "Kan pulcuğu", "Lenfosit"],
        c: 0,
      },
      {
        q: "Dengelermiş kuvvetlerin etkisindeki bir cisim için hangisi doğrudur?",
        a: [
          "Hızlanır",
          "Yavaşlar",
          "Duruyorsa durmaya devam eder",
          "Yön değiştirir",
        ],
        c: 2,
      },
      {
        q: "Sürat birimi aşağıdakilerden hangisi olabilir?",
        a: ["m/s²", "Newton", "km/sa", "Joule"],
        c: 2,
      },
      {
        q: "Besinlerin en küçük parçalara kadar parçalanıp kana geçecek hale gelmesine ne denir?",
        a: ["Solunum", "Sindirim", "Boşaltım", "Dolaşım"],
        c: 1,
      },
      {
        q: "Kalın bağırsakta aşağıdakilerden hangisinin emilimi gerçekleşmez?",
        a: ["Su", "Vitamin", "Mineraller", "Proteinler"],
        c: 3,
      },
      {
        q: "Kan gruplarını belirleyen proteinler nerede bulunur?",
        a: ["Plazmada", "Alyuvarların zarında", "Akyuvarlarda", "Kalpte"],
        c: 1,
      },
      { q: "Bileşke kuvvetin sembolü nedir?", a: ["F", "m", "R", "v"], c: 2 },
      {
        q: "Süratleri aynı olan iki araçtan yolu daha kısa sürede bitiren için ne söylenir?",
        a: [
          "Daha yavaştır",
          "Yolu daha kısadır",
          "Yolu daha uzundur",
          "Daha hızlıdır",
        ],
        c: 1,
      },
      {
        q: "Güneş Sistemi'de yaşam olduğu bilinen tek gezegen?",
        a: ["Mars", "Dünya", "Venüs", "Satürn"],
        c: 1,
      },
      {
        q: "Kafatası kemikleri hangi gruptadır?",
        a: ["Uzun", "Kısa", "Yassı", "Düzensiz"],
        c: 2,
      },
      {
        q: "İsteğimizle çalışan kaslara ne ad verilir?",
        a: ["Düz Kas", "Kalp Kası", "Çizgili Kas", "İç Kas"],
        c: 2,
      },
      {
        q: "Sindirim sisteminde emilimin en yoğun olduğu yer?",
        a: ["Mide", "Ağız", "İnce Bağırsak", "Kalın Bağırsak"],
        c: 2,
      },
      {
        q: "Safra sıvısını hangi organ üretir?",
        a: ["Mide", "Karaciğer", "Pankreas", "Böbrek"],
        c: 1,
      },
      {
        q: "Küçük kan dolaşımı nerede biter?",
        a: ["Sağ Kulakçık", "Sol Kulakçık", "Sağ Karıncık", "Sol Karıncık"],
        c: 1,
      },
      {
        q: "Kanın içindeki sıvı kısma ne denir?",
        a: ["Plazma", "Serum", "Hemoglobin", "Alyuvar"],
        c: 0,
      },
      {
        q: "Vücudun en büyük atardamarı?",
        a: ["Akciğer Atarı", "Aort", "Böbrek Atarı", "Toplardamar"],
        c: 1,
      },
      {
        q: "Soluk alırken akciğer hacmi ne olur?",
        a: ["Azalır", "Artar", "Değişmez", "Kapanır"],
        c: 1,
      },
      {
        q: "Böbreklerin görevi nedir?",
        a: ["Kanı pompalamak", "Kanı süzmek", "Sindirim yapmak", "Görmek"],
        c: 1,
      },
      {
        q: "Dinamometrenin içinde ne vardır?",
        a: ["Pil", "Su", "Yay", "Mıknatıs"],
        c: 2,
      },
      {
        q: "Dengelenmiş kuvvetlerde bileşke kuvvet kaçtır?",
        a: ["0", "1", "10", "Sonsuz"],
        c: 0,
      },
      {
        q: "Güneş Sistemi'nde en çok uydusu olan gezegen?",
        a: ["Dünya", "Mars", "Jüpiter", "Satürn"],
        c: 2,
      },
      {
        q: "Metallerden yapılmış sağlam dinamometreler ölçer.",
        a: ["Küçük", "Büyük", "Hassas", "Yavaş"],
        c: 1,
      },
      {
        q: "Eklem sıvısı ne işe yarar?",
        a: [
          "Kemikleri parlatır",
          "Aşınmayı önler",
          "Kemik kırar",
          "Kan üretir",
        ],
        c: 1,
      },
      {
        q: "Yağların fiziksel sindirimi ne ile olur?",
        a: ["Tükürük", "Safra", "Mide asidi", "Su"],
        c: 1,
      },
      {
        q: "Villuslar nerede bulunur?",
        a: ["Mide", "İnce Bağırsak", "Ağız", "Yutak"],
        c: 1,
      },
      {
        q: "Alyuvarlar ne taşır?",
        a: ["Mikrop", "Oksijen", "Hormon", "Besin"],
        c: 1,
      },
      {
        q: "Kan grubu sıfır (0) olan biri kimden kan alabilir?",
        a: ["A", "B", "AB", "Sadece 0"],
        c: 3,
      },
      {
        q: "Diyafram kası nefes verirken nasıl bir şekil alır?",
        a: ["Düzleşir", "Kubbeleşir", "Kısalır", "Döner"],
        c: 1,
      },
      {
        q: "Akciğerlerde gaz değişiminin olduğu yer?",
        a: ["Bronşcuk", "Alveol", "Burun", "Yutak"],
        c: 1,
      },
      {
        q: "Kuvvetin büyüklüğünü ölçen alet?",
        a: ["Terazi", "Dinamometre", "Termometre", "Saat"],
        c: 1,
      },
      {
        q: "Sürat = Yol / ?",
        a: ["Zaman", "Kütle", "Kuvvet", "Ağırlık"],
        c: 0,
      },
      {
        q: "Hangi kan hücresi pıhtılaşmayı sağlar?",
        a: ["Alyuvar", "Akyuvar", "Kan pulcuğu", "Plazma"],
        c: 2,
      },
      { q: "Kalp kaç odacıktan oluşur?", a: ["2", "3", "4", "5"], c: 2 },
      {
        q: "Kılcal damarların görevi nedir?",
        a: [
          "Kan pompalamak",
          "Madde alışverişi",
          "Kirli kan toplamak",
          "Oksijen üretmek",
        ],
        c: 1,
      },
      {
        q: "Soluk borusunun başlangıcına ne denir?",
        a: ["Yutak", "Gırtlak", "Burun", "Ağız"],
        c: 1,
      },
      {
        q: "Büyük kan dolaşımı nereden başlar?",
        a: ["Sağ Karıncık", "Sol Karıncık", "Sağ Kulakçık", "Sol Kulakçık"],
        c: 1,
      },
      {
        q: "Küçük kan dolaşımı nereden başlar?",
        a: ["Sağ Karıncık", "Sol Karıncık", "Sağ Kulakçık", "Sol Kulakçık"],
        c: 0,
      },
      {
        q: "Kanın kalbe geri dönmesini sağlayan damar?",
        a: ["Atardamar", "Toplardamar", "Kılcal damar", "Aort"],
        c: 1,
      },
      {
        q: "Vücut ısısını düzenleyen sistem hangisidir?",
        a: ["Dolaşım", "Sindirim", "Boşaltım", "Hepsi"],
        c: 0,
      },
      {
        q: "Güneş Sistemi'nde en sıcak gezegen hangisidir?",
        a: ["Merkür", "Venüs", "Dünya", "Mars"],
        c: 1,
      },
      {
        q: "Asteroit kuşağı hangi gezegenler arasındadır?",
        a: ["Dünya-Mars", "Mars-Jüpiter", "Jüpiter-Satürn", "Venüs-Dünya"],
        c: 1,
      },
    ],
    turkce: [
      {
        q: "Aşağıdaki cümlelerin hangisinde 'ince' sözcüğü mecaz anlamda kullanılmıştır?",
        a: [
          "İnce elbiseler giymişti",
          "İnce bir ip koptu",
          "Çok ince bir insansın",
          "İnce bir dilim ekmek yedi",
        ],
        c: 2,
      },
      {
        q: "Aşağıdakilerin hangisinde terim anlamlı bir sözcük vardır?",
        a: [
          "Oyuncular sahneye çıktı",
          "Dışarıda çok soğuk var",
          "Bugün çok neşeliyim",
          "Pencereyi kapatır mısın?",
        ],
        c: 0,
      },
      {
        q: "'Kar yağdığı için yollar kapandı.' cümlesindeki anlam ilişkisi nedir?",
        a: ["Amaç-Sonuç", "Neden-Sonuç", "Koşul-Sonuç", "Karşılaştırma"],
        c: 1,
      },
      {
        q: "Aşağıdaki sözcüklerden hangisi sadece çekim eki almıştır?",
        a: ["Kitaplık", "Gözlükçü", "Sulu", "Kalemler"],
        c: 3,
      },
      {
        q: "'Gözlükçü' sözcüğünün kökü ve türü nedir?",
        a: ["Gözlük - İsim", "Göz - İsim", "Gözle - Fiil", "Göz - Fiil"],
        c: 1,
      },
      {
        q: "Aşağıdakilerden hangisi soyut bir isimdir?",
        a: ["Hava", "Su", "Rüya", "Işık"],
        c: 2,
      },
      {
        q: "Aşağıdakilerin hangisinde özel isim vardır?",
        a: ["Kedi", "Şehir", "Ankara", "Okul"],
        c: 2,
      },
      {
        q: "'Burnu havada' deyiminin anlamı nedir?",
        a: [
          "Çok nefes almak",
          "Kibirli olmak",
          "Hava tahmini yapmak",
          "Grip olmak",
        ],
        c: 1,
      },
      {
        q: "Aşağıdaki cümlelerden hangisi nesneldir?",
        a: [
          "En güzel renk mavidir",
          "Türkiye'nin başkenti Ankara'dır",
          "Bu film çok sıkıcı",
          "Çay kahveden daha güzel",
        ],
        c: 1,
      },
      {
        q: "Yapım eki almış sözcüğe ne denir?",
        a: ["Basit", "Türemiş", "Birleşik", "Kök"],
        c: 1,
      },
      {
        q: "Hangisi birleşik bir sözcüktür?",
        a: ["Kalemlik", "Hanımeli", "Silgi", "Gözlük"],
        c: 1,
      },
      {
        q: "Aşağıdakilerden hangisi bir 'belirtme sıfatı' değildir?",
        a: ["Bu çocuk", "İki elma", "Güzel çiçek", "Bazı insanlar"],
        c: 2,
      },
      {
        q: "Hangi kelimenin yazımı yanlıştır?",
        a: ["Herkez", "Spor", "Tren", "Kirbit"],
        c: 0,
      },
      {
        q: "'Ova' kelimesine hangi ek gelirse türemiş kelime olur?",
        a: ["-lar", "-da", "-mız", "-lı"],
        c: 3,
      },
      {
        q: "'Evimiz çok uzakta.' cümlesindeki 'evimiz' sözcüğündeki ek nedir?",
        a: ["Çoğul eki", "İyelik eki", "Hal eki", "İlgi eki"],
        c: 1,
      },
      {
        q: "'Sarı saçlı' ifadesindeki sıfat hangisidir?",
        a: ["Sarı", "Saç", "Saçlı", "Sarı saçlı"],
        c: 0,
      },
      {
        q: "Aşağıdakilerden hangisi bir 'topluluk ismi'dir?",
        a: ["Çiçekler", "Ağaçlar", "Orman", "Kuşlar"],
        c: 2,
      },
      {
        q: "'Oku' fiili hangi kipi almıştır?",
        a: ["Şimdiki zaman", "Geniş zaman", "Emir kipi", "Gelecek zaman"],
        c: 2,
      },
      {
        q: "Zıt anlamlı kelimeler hangisidir?",
        a: ["Okul-Mektep", "Yaşlı-İhtiyar", "Açık-Kapalı", "Doktor-Hekim"],
        c: 2,
      },
      {
        q: "Hangisi bir 'niteleme sıfatı'dır?",
        a: ["Bu", "Şu", "Kırmızı", "Bazı"],
        c: 2,
      },
      {
        q: "Aşağıdaki cümlelerden hangisi 'koşul-sonuç' cümlesidir?",
        a: [
          "Ödevini yaparsan dışarı çıkabilirsin",
          "Güneş açtı diye ısındık",
          "Kitap okumak için kütüphaneye gitti",
          "Çok yorulduğu için uyudu",
        ],
        c: 0,
      },
      {
        q: "Hangisi bir 'bağlaç'tır?",
        a: ["Gibi", "Kadar", "İçin", "Çünkü"],
        c: 3,
      },
      {
        q: "'Çalışkan çocuk' tamlamasında tamlayan hangisidir?",
        a: ["Çalışkan", "Çocuk", "Çalış", "Kan"],
        c: 0,
      },
      {
        q: "'Dağ gibi borcu var.' cümlesindeki söz sanatı nedir?",
        a: ["Kişileştirme", "Benzetme", "Konuşturma", "Zıtlık"],
        c: 1,
      },
      {
        q: "Hangisi bir 'atasözü'dür?",
        a: [
          "Gözden düşmek",
          "Ayağını yorganına göre uzat",
          "Kulak misafiri olmak",
          "Etekleri zil çalmak",
        ],
        c: 1,
      },
      {
        q: "'Etekleri zil çalmak' deyiminin anlamı nedir?",
        a: ["Çok üzülmek", "Çok sevinmek", "Çok sinirlenmek", "Çok acıkmak"],
        c: 1,
      },
      {
        q: "Aşağıdakilerden hangisi bir 'fiil'dir?",
        a: ["Kalem", "Masa", "Yürü-", "Güzel"],
        c: 2,
      },
      {
        q: "Hangisi bir 'isim'dir?",
        a: ["Koş-", "Bak-", "Çiçek", "Sev-"],
        c: 2,
      },
      {
        q: "Hangisi bir 'kişi zamiri'dir?",
        a: ["O", "Şu", "Bu", "Hangi"],
        c: 0,
      },
      {
        q: "Hangisi bir 'belgisiz zamir'dir?",
        a: ["Hepsi", "Ben", "Kim", "Öteki"],
        c: 0,
      },
      {
        q: "'Okul' sözcüğünün kökü nedir?",
        a: ["Ok", "Oku-", "Okul", "O"],
        c: 1,
      },
      {
        q: "'Sevgi' sözcüğündeki ek nedir?",
        a: ["Çekim eki", "Yapım eki", "İyelik eki", "Hal eki"],
        c: 1,
      },
      {
        q: "Hangisi 'yönelme hal eki'dir?",
        a: ["-de", "-e", "-i", "-den"],
        c: 1,
      },
      {
        q: "Hangisi 'ayrılma hal eki'dir?",
        a: ["-i", "-e", "-de", "-den"],
        c: 3,
      },
      {
        q: "Aşağıdakilerden hangisi birleşik fiildir?",
        a: ["Sevebilir", "Yürüdü", "Bakıyor", "Gelecek"],
        c: 0,
      },
      {
        q: "Hangisi bir 'deyim'dir?",
        a: [
          "Balık baştan kokar",
          "Göze girmek",
          "Damlaya damlaya göl olur",
          "Sakla samanı gelir zamanı",
        ],
        c: 1,
      },
      {
        q: "Hangisi 'eş' anlamlıdır?",
        a: ["Cevap-Yanıt", "Soru-Sorun", "Ak-Kara", "Dolu-Boş"],
        c: 0,
      },
      {
        q: "Aşağıdaki cümlelerden hangisi 'amaç-sonuç' cümlesidir?",
        a: [
          "Sınavı kazanmak için çok çalışıyor",
          "Yağmur yağınca ıslandık",
          "Dışarı çıkarsan üşürsün",
          "Geç kaldığı için özür diledi",
        ],
        c: 0,
      },
      {
        q: "Hangisi bir 'tanımlama' cümlesidir?",
        a: [
          "Kitap, en iyi dosttur",
          "Bugün hava çok güzel",
          "Yarın okul yok",
          "Sinemaya gidelim mi?",
        ],
        c: 0,
      },
      {
        q: "Hangisi bir 'olasılık' cümlesidir?",
        a: [
          "Yarın kar yağabilir",
          "Ders çalışmalısın",
          "Hemen gel!",
          "Neden gitmedin?",
        ],
        c: 0,
      },
      {
        q: "Hangisi bir 'abartma' cümlesidir?",
        a: [
          "Dünya kadar ödevim var",
          "Biraz ders çalıştım",
          "Sınava girdim",
          "Okula gittim",
        ],
        c: 0,
      },
      {
        q: "Hangisi bir 'hayal ürünü' ifadedir?",
        a: [
          "Ay dede bize gülümsedi",
          "Kar yağıyor",
          "Kuşlar uçuyor",
          "Çiçekler açtı",
        ],
        c: 0,
      },
      {
        q: "Aşağıdakilerin hangisinde yazım yanlışı vardır?",
        a: ["T.B.M.M.", "Herkez", "Birtakım", "Hiçbir"],
        c: 1,
      },
      {
        q: "Hangisi 'ki'nin yazımıyla ilgili bir yanlıştır?",
        a: [
          "Baktımki gelmiyor",
          "Sendeki kalem",
          "Duydum ki",
          "Okuldaki çocuklar",
        ],
        c: 0,
      },
      {
        q: "Hangisi soru eki 'mi'nin yazımıyla ilgili bir yanlıştır?",
        a: ["Gelecekmi?", "Geldin mi?", "Okur musun?", "Güzel mi?"],
        c: 0,
      },
      {
        q: "Hangisi 'nokta'nın görevlerinden biri değildir?",
        a: [
          "Cümle sonuna konur",
          "Sıra bildiren sayılardan sonra konur",
          "Soru sormak için konur",
          "Kısaltmalarda konur",
        ],
        c: 2,
      },
      {
        q: "Ünlem işareti (!) nerede kullanılır?",
        a: [
          "Korku, sevinç, şaşkınlık anında",
          "Soru sorarken",
          "Cümle sonunda",
          "Eş görevli kelimeleri ayırırken",
        ],
        c: 0,
      },
      {
        q: "Kesme işareti ( ' ) nerede kullanılır?",
        a: [
          "Özel isimlere gelen ekleri ayırmada",
          "Cümle sonunda",
          "Soru sorarken",
          "Sıfatları ayırmada",
        ],
        c: 0,
      },
      {
        q: "Hangisi 'paragraf'ın ana düşüncesini belirtir?",
        a: [
          "Yazarın okuyucuya vermek istediği mesaj",
          "Paragrafın konusu",
          "Paragrafın başlığı",
          "Paragrafın uzunluğu",
        ],
        c: 0,
      },
      {
        q: "'Göz' kökünden türetilmiş 'gözlemci' sözcüğü kaç tane yapım eki almıştır?",
        a: ["1", "2", "3", "4"],
        c: 1,
      },
      {
        q: "Aşağıdaki cümlelerin hangisinde amaç-sonuç ilişkisi vardır?",
        a: [
          "Seni görmek için geldim",
          "Çok yoruldum",
          "Dün akşam bize uğradı",
          "Hava çok soğuk",
        ],
        c: 0,
      },
      {
        q: "'Kalem' sözcüğü hangisinde belirtme hali eki almıştır?",
        a: [
          "Kalemi masada bırakmış",
          "Kalemde mürekkep az",
          "Kalemden ses geliyor",
          "Kaleme bakıyordu",
        ],
        c: 0,
      },
      {
        q: "Hangisi bir topluluk ismidir?",
        a: ["Masalar", "Ordu", "Şehirler", "Öğrenciler"],
        c: 1,
      },
      {
        q: "Atasözlerinden hangisi 'tasarruf' ile ilgilidir?",
        a: [
          "Ak akçe kara gün içindir",
          "Damlaya damlaya göl olur",
          "Her ikisi de",
          "Hiçbiri",
        ],
        c: 2,
      },
      {
        q: "'Korku' kelimesinin kökü nedir?",
        a: ["Kor", "Kork", "Korku", "Korkunç"],
        c: 1,
      },
      {
        q: "Aşağıdaki tamlamalardan hangisi bir sıfat tamlamasıdır?",
        a: ["Okul kapısı", "Kırmızı çanta", "Annenin çantası", "Sınıf camı"],
        c: 1,
      },
      {
        q: "Hangisinde ünlem işareti doğru kullanılmıştır?",
        a: [
          "Eyvah, süt taştı!",
          "Nereye gidiyorsun!",
          "Bugün hava güzel!",
          "Kitap okudum!",
        ],
        c: 0,
      },
      {
        q: "Hangi kelime büyük ünlü uyumuna uymaz?",
        a: ["Kitap", "Kalem", "Tiyatro", "Hepsi"],
        c: 3,
      },
      {
        q: "Sözlükte en sonda hangisi bulunur?",
        a: ["Zarf", "Zaman", "Zahit", "Zebra"],
        c: 3,
      },
      {
        q: "'Yaz-' fiili hangisinde farklı bir anlamda kullanılmıştır?",
        a: [
          "Deftere yazı yazdı",
          "Bu yaz tatile gideceğiz",
          "Mektup yazdı",
          "Şiir yazıyor",
        ],
        c: 1,
      },
      {
        q: "'Küçük' kelimesinin zıt anlamlısı nedir?",
        a: ["Ufak", "Minik", "Büyük", "İri"],
        c: 2,
      },
      {
        q: "'Mecbur' kelimesinin eş anlamlısı nedir?",
        a: ["Zorunlu", "İstekli", "Özgür", "Gönüllü"],
        c: 0,
      },
      {
        q: "Deyimlerden hangisi 'çok sevinmek' anlamındadır?",
        a: [
          "Etekleri zil çalmak",
          "Gözden düşmek",
          "Kulak asmamak",
          "Burnu havada olmak",
        ],
        c: 0,
      },
      {
        q: "'Okul' sözcüğündeki 'okul' kelimesi basit mi türemiş mi?",
        a: ["Basit", "Türemiş", "Birleşik", "Yabancı"],
        c: 1,
      },
      {
        q: "'Kitapçı' kelimesindeki yapım eki hangisidir?",
        a: ["-çı", "-ap", "-kitap", "-ki"],
        c: 0,
      },
      {
        q: "'Sev-' köküne hangi ek gelirse isim olur?",
        a: ["-gi", "-di", "-iyor", "-ecek"],
        c: 0,
      },
      {
        q: "'Yolculuk' kelimesi kaç hecelidir?",
        a: ["2", "3", "4", "1"],
        c: 1,
      },
      { q: "Alfabemizde kaç harf vardır?", a: ["28", "29", "30", "27"], c: 1 },
      {
        q: "Kaç tane ünlü (sesli) harf vardır?",
        a: ["7", "8", "9", "10"],
        c: 1,
      },
      {
        q: "Kalın ünlüler hangileridir?",
        a: ["a,ı,o,u", "e,i,ö,ü", "a,e,i,o", "u,ü,o,ö"],
        c: 0,
      },
      {
        q: "İnce ünlüler hangileridir?",
        a: ["a,ı,o,u", "e,i,ö,ü", "a,b,c,d", "k,l,m,n"],
        c: 1,
      },
      {
        q: "Hangi kelime hecelerine yanlış ayrılmıştır?",
        a: ["A-ra-ba", "Ki-tap-lık", "O-ku-l-ar", "Ka-lem-lik"],
        c: 2,
      },
      {
        q: "Özel isimler her zaman ... harfle başlar.",
        a: ["Küçük", "Büyük", "Eğik", "Kalın"],
        c: 1,
      },
      {
        q: "Cümlenin ilk harfi her zaman ... harfle başlar.",
        a: ["Büyük", "Küçük", "Renkli", "Süslü"],
        c: 0,
      },
      {
        q: "Hangi cümlede yazım yanlışı yoktur?",
        a: [
          "Ayşeyi gördüm",
          "İzmir'e gittim",
          "her sabah koşarım",
          "Tren'e bindik",
        ],
        c: 1,
      },
      {
        q: "Kesme işareti hangi ekleri ayırır?",
        a: [
          "Özel isme gelen",
          "Cins isme gelen",
          "Fiile gelen",
          "Sıfata gelen",
        ],
        c: 0,
      },
      {
        q: "Satır sonuna sığmayan sözcükler ne ile bölünür?",
        a: ["Nokta", "Virgül", "Kısa çizgi", "Ünlem"],
        c: 2,
      },
      {
        q: "Bitmiş cümlelerin sonuna ne konur?",
        a: ["?", "!", ".", ","],
        c: 2,
      },
      {
        q: "Soru cümlelerinin sonuna ne konur?",
        a: ["!", "?", ".", ":"],
        c: 1,
      },
      {
        q: "Şaşırma anında hangi işaret kullanılır?",
        a: ["!", "?", ".", ";"],
        c: 0,
      },
      {
        q: "Sözlük sıralamasında 'Elma' mı önce gelir 'Erik' mi?",
        a: ["Elma", "Erik", "Aynı", "Bilinmez"],
        c: 0,
      },
      {
        q: "'Başak' mı önce gelir 'Baston' mu?",
        a: ["Başak", "Baston", "Baston önce", "Eşit"],
        c: 0,
      },
      {
        q: "Kök nedir?",
        a: [
          "Anlamlı en küçük parça",
          "Kelimenin sonu",
          "Sadece fiil",
          "Sadece isim",
        ],
        c: 0,
      },
      {
        q: "'Gözlük' kelimesinin kökü nedir?",
        a: ["Gözlük", "Göz", "Gözle", "Gör-"],
        c: 1,
      },
      {
        q: "'Durak' kelimesinin kökü nedir?",
        a: ["Dur-", "Durak", "Dura", "Duru"],
        c: 0,
      },
      {
        q: "Yapım eki kelimenin ... değiştirir.",
        a: ["Rengini", "Anlamını", "Okunuşunu", "Harf sayısını"],
        c: 1,
      },
      {
        q: "Çekim eki kelimenin ... değiştirmez.",
        a: ["Anlamını", "Şeklini", "Yerini", "Sırasını"],
        c: 0,
      },
      {
        q: "'-ler, -lar' eki nedir?",
        a: ["Çoğul eki", "Soru eki", "Yapım eki", "İyelik eki"],
        c: 0,
      },
      {
        q: "'Defterim' kelimesindeki '-im' eki nedir?",
        a: ["Çoğul", "İyelik", "Soru", "Hal"],
        c: 1,
      },
      {
        q: "Hangisi belirtisiz isim tamlamasıdır?",
        a: ["Kapı kolu", "Kapının kolu", "Mavi kapı", "Demir kapı"],
        c: 0,
      },
      {
        q: "Hangisi belirtili isim tamlamasıdır?",
        a: ["Okul çantası", "Okulun çantası", "Yeni çanta", "Bez çanta"],
        c: 1,
      },
      {
        q: "Zamirler neyin yerini tutar?",
        a: ["Fiilin", "İsmin", "Sıfatın", "Zarfın"],
        c: 1,
      },
      {
        q: "'Bu' kelimesi hangisinde zamirdir?",
        a: ["Bu kitabı al", "Bu benimdir", "Bu ev büyük", "Bu yol uzun"],
        c: 1,
      },
      {
        q: "'Kırmızı' kelimesi hangisinde sıfattır?",
        a: [
          "Kırmızı kalem",
          "Kırmızıyı sev",
          "En güzeli kırmızı",
          "Kırmızıdır o",
        ],
        c: 0,
      },
      {
        q: "Somut isim hangisidir?",
        a: ["Sevgi", "Masa", "Korku", "Mutluluk"],
        c: 1,
      },
      { q: "Soyut isim hangisidir?", a: ["Taş", "Su", "Saygı", "Hava"], c: 2 },
      {
        q: "Terim anlam hangisidir?",
        a: ["Perde (Tiyatro)", "Perde (Pencere)", "Mecaz perde", "İnce perde"],
        c: 0,
      },
      {
        q: "Zıt anlamlısı 'Alt' olan kelime?",
        a: ["Yan", "Üst", "Arka", "Ön"],
        c: 1,
      },
      {
        q: "Eş anlamlısı 'Güz' olan kelime?",
        a: ["Bahar", "Yaz", "Sonbahar", "Kış"],
        c: 2,
      },
      {
        q: "İsim tamlamasında ilk kelimeye ne denir?",
        a: ["Tamlayan", "Tamlanan", "Ek", "Kök"],
        c: 0,
      },
    ],
    ingilizce: [
      {
        q: "What time is it? (08:30)",
        a: [
          "It is eight o'clock",
          "It is half past eight",
          "It is quarter past eight",
          "It is eight to half",
        ],
        c: 1,
      },
      {
        q: "Which one is a 'yummy' breakfast food?",
        a: ["Cloud", "Honey", "Pencil", "Rain"],
        c: 1,
      },
      {
        q: "I _____ breakfast every morning.",
        a: ["do", "has", "have", "am"],
        c: 2,
      },
      {
        q: "A city is _____ than a village.",
        a: ["noisy", "noisier", "more noisy", "noisiest"],
        c: 1,
      },
      {
        q: "Where can you buy bread?",
        a: [
          "At the bakery",
          "At the library",
          "At the hospital",
          "At the school",
        ],
        c: 0,
      },
      {
        q: "What does a 'teacher' do?",
        a: ["He cooks", "He teaches", "He flies planes", "He helps animals"],
        c: 1,
      },
      {
        q: "How is the weather? (☀️)",
        a: ["It is rainy", "It is snowy", "It is sunny", "It is stormy"],
        c: 2,
      },
      {
        q: "I feel _____ on rainy days. (😔)",
        a: ["happy", "energetic", "sad", "surprised"],
        c: 2,
      },
      {
        q: "Where do you go to have fun and ride on a 'roller coaster'?",
        a: ["Hospital", "Fair", "Bakery", "Bank"],
        c: 1,
      },
      {
        q: "Which one is 'slower' than a car?",
        a: ["A plane", "A bicycle", "A rocket", "A train"],
        c: 1,
      },
      {
        q: "She _____ her homework in the evenings.",
        a: ["do", "doing", "does", "done"],
        c: 2,
      },
      {
        q: "Which animal is 'taller' than a horse?",
        a: ["A cat", "A giraffe", "A dog", "A mouse"],
        c: 1,
      },
      {
        q: "My mother is a nurse. She works at a _____.",
        a: ["Post office", "Hospital", "Police station", "Farm"],
        c: 1,
      },
      {
        q: "_____ you like olives? - Yes, I do.",
        a: ["Does", "Are", "Is", "Do"],
        c: 3,
      },
      {
        q: "What is 'kuyu' in English?",
        a: ["Well", "River", "Lake", "Sea"],
        c: 0,
      },

      {
        q: "What time is it? (03:15)",
        a: [
          "It is quarter past three",
          "It is half past three",
          "It is quarter to three",
          "It is three o'clock",
        ],
        c: 0,
      },
      {
        q: "What time is it? (09:45)",
        a: [
          "It is quarter past nine",
          "It is quarter to ten",
          "It is half past ten",
          "It is ten o'clock",
        ],
        c: 1,
      },
      {
        q: "He _____ up at 7 o'clock.",
        a: ["get", "gets", "getting", "got"],
        c: 1,
      },
      {
        q: "I _____ TV after school.",
        a: ["watch", "watches", "watching", "watched"],
        c: 0,
      },
      {
        q: "She _____ to school by bus.",
        a: ["go", "goes", "going", "gone"],
        c: 1,
      },
      {
        q: "We _____ football on Sundays.",
        a: ["plays", "play", "playing", "played"],
        c: 1,
      },
      {
        q: "He is _____ late.",
        a: ["always", "sometimes", "never", "usually"],
        c: 2,
      },
      {
        q: "I _____ go to bed at 10 p.m. every day.",
        a: ["always", "never", "sometimes", "hardly"],
        c: 0,
      },
      {
        q: "My brother _____ his teeth twice a day.",
        a: ["brush", "brushes", "brushing", "brushed"],
        c: 1,
      },
      {
        q: "Which one is a hobby?",
        a: [
          "Reading books",
          "Running late",
          "Driving a bus",
          "Sleeping in class",
        ],
        c: 0,
      },
      {
        q: "I like _____ to music.",
        a: ["listen", "listens", "listening", "listened"],
        c: 2,
      },
      {
        q: "In the morning, I _____ my face.",
        a: ["wash", "washes", "washing", "washed"],
        c: 0,
      },
      {
        q: "Where do you live?",
        a: ["In a city", "In a sandwich", "In a pencil", "In a rain"],
        c: 0,
      },
      {
        q: "Which one is a daily activity?",
        a: ["Do homework", "Ride a camel", "Climb a mountain", "Fly a rocket"],
        c: 0,
      },
      {
        q: "What is the opposite of 'early'?",
        a: ["Late", "Fast", "Quiet", "Tall"],
        c: 0,
      },

      {
        q: "Milk is a _____.",
        a: ["drink", "place", "job", "animal"],
        c: 0,
      },
      {
        q: "Which one is countable?",
        a: ["Bread", "Cheese", "An egg", "Butter"],
        c: 2,
      },
      {
        q: "Which one is uncountable?",
        a: ["Apple", "Sandwich", "Bread", "Tomato"],
        c: 2,
      },
      {
        q: "How many _____ are there? - Two.",
        a: ["milk", "apples", "bread", "cheese"],
        c: 1,
      },
      {
        q: "How much _____ do you need? - A little.",
        a: ["eggs", "apples", "cheese", "sandwiches"],
        c: 2,
      },
      {
        q: "There is _____ butter on the table.",
        a: ["some", "any", "a", "an"],
        c: 0,
      },
      {
        q: "There aren't _____ tomatoes in the fridge.",
        a: ["some", "any", "much", "a"],
        c: 1,
      },
      {
        q: "I would like _____ orange juice.",
        a: ["some", "any", "many", "a"],
        c: 0,
      },
      {
        q: "Do you like _____?",
        a: ["potato", "potatoes", "a potatoes", "potatos"],
        c: 1,
      },
      {
        q: "Which one is a breakfast utensil?",
        a: ["Spoon", "Cloud", "Street", "Garden"],
        c: 0,
      },
      {
        q: "What is 'peynir' in English?",
        a: ["Cheese", "Chicken", "Cherry", "Chips"],
        c: 0,
      },
      {
        q: "What is 'zeytin' in English?",
        a: ["Onion", "Olives", "Orange", "Oil"],
        c: 1,
      },
      {
        q: "Let's make a sandwich. First, _____ the bread.",
        a: ["slice", "sleep", "swim", "sit"],
        c: 0,
      },
      {
        q: "I don't like carrots. I _____ eat them.",
        a: ["don't", "doesn't", "isn't", "aren't"],
        c: 0,
      },
      {
        q: "My favorite breakfast is _____.",
        a: ["scrambled eggs", "a hospital", "a library", "a bicycle"],
        c: 0,
      },
      {
        q: "We need _____ eggs for the cake.",
        a: ["some", "any", "much", "a"],
        c: 0,
      },
      {
        q: "Is there _____ milk?",
        a: ["some", "any", "many", "a"],
        c: 1,
      },
      {
        q: "Do you prefer tea _____ coffee?",
        a: ["and", "but", "or", "because"],
        c: 2,
      },
      {
        q: "Yummy means _____.",
        a: ["delicious", "dangerous", "difficult", "dirty"],
        c: 0,
      },
      {
        q: "There _____ some milk in the fridge.",
        a: ["is", "are", "am", "be"],
        c: 0,
      },

      {
        q: "Where can you buy medicine?",
        a: ["Pharmacy", "Bakery", "Museum", "Playground"],
        c: 0,
      },
      {
        q: "Where can you borrow a book?",
        a: ["Library", "Hospital", "Bank", "Restaurant"],
        c: 0,
      },
      {
        q: "Turn _____ at the traffic lights.",
        a: ["left", "sleep", "hungry", "yummy"],
        c: 0,
      },
      {
        q: "Go _____ and then turn right.",
        a: ["straight", "sweet", "slow", "small"],
        c: 0,
      },
      {
        q: "The bank is _____ the post office.",
        a: ["next to", "under", "inside", "behind of"],
        c: 0,
      },
      {
        q: "The park is _____ the cinema.",
        a: ["in front of", "yesterday", "delicious", "sleepy"],
        c: 0,
      },
      {
        q: "The café is _____ the street.",
        a: ["on", "at", "in", "from"],
        c: 0,
      },
      {
        q: "There _____ two schools in my town.",
        a: ["is", "are", "am", "be"],
        c: 1,
      },
      {
        q: "_____ there a hospital near here?",
        a: ["Is", "Are", "Do", "Does"],
        c: 0,
      },
      {
        q: "How can I get to the museum?",
        a: [
          "Go straight and turn left",
          "Eat breakfast and sleep",
          "It is rainy and sad",
          "Brush your teeth at 7",
        ],
        c: 0,
      },
      {
        q: "Which one is a place in downtown?",
        a: ["Bakery", "Season", "Emotion", "Breakfast"],
        c: 0,
      },
      {
        q: "I want to buy a ticket. I go to the _____.",
        a: ["bus station", "kitchen", "bedroom", "classroom"],
        c: 0,
      },
      {
        q: "Excuse me, _____ is the bus stop?",
        a: ["where", "what", "when", "who"],
        c: 0,
      },
      {
        q: "The supermarket is _____ the corner.",
        a: ["on", "in", "at", "to"],
        c: 0,
      },
      {
        q: "Opposite means _____.",
        a: ["across from", "next to", "behind", "between"],
        c: 0,
      },
      {
        q: "Between means _____.",
        a: [
          "in the middle of two places",
          "on the left",
          "in the morning",
          "in the fridge",
        ],
        c: 0,
      },
      {
        q: "The police officer works at the _____.",
        a: ["police station", "post office", "bakery", "museum"],
        c: 0,
      },
      {
        q: "You can watch a movie at the _____.",
        a: ["cinema", "pharmacy", "farm", "classroom"],
        c: 0,
      },
      {
        q: "I need to send a letter. I go to the _____.",
        a: ["post office", "zoo", "pool", "forest"],
        c: 0,
      },
      {
        q: "Let's meet _____ the park gate.",
        a: ["at", "on", "in", "from"],
        c: 0,
      },

      {
        q: "How is the weather? (🌧️)",
        a: ["It is rainy", "It is sunny", "It is windy", "It is hot"],
        c: 0,
      },
      {
        q: "In winter, it is usually _____.",
        a: ["cold", "hot", "yummy", "noisy"],
        c: 0,
      },
      {
        q: "Which season comes after winter?",
        a: ["Spring", "Summer", "Autumn", "Monday"],
        c: 0,
      },
      {
        q: "I feel _____ when I get a good grade.",
        a: ["happy", "sad", "angry", "bored"],
        c: 0,
      },
      {
        q: "Why are you tired? - Because I _____ to bed late.",
        a: ["go", "goes", "going", "gone"],
        c: 0,
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
      if (currentQ < questions.length - 1) {
        setCurrentQ(currentQ + 1);
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

    // Pas geçilen soruları arttır
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

    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(currentQ + 1);
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
