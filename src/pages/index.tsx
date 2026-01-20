import { Award, BarChart3, BookOpen, Calculator, Microscope, Star, Target, TrendingUp, Trophy, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

const EduPlatform = () => {
  const [view, setView] = useState('loading');
  const [userType, setUserType] = useState<'student' | 'parent' | null>(null);
  const [studentData, setStudentData] = useState({
    name: 'Emir Taha',
    points: 0,
    level: 1,
    badges: [],
    completedActivities: [],
    dailyStats: {},
    subjectStats: {
      matematik: { correct: 0, total: 0 },
      fen: { correct: 0, total: 0 },
      turkce: { correct: 0, total: 0 },
      ingilizce: { correct: 0, total: 0 }
    }
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = localStorage.getItem('emir_taha_progress');
        if (stored) {
          const data = JSON.parse(stored);
          setStudentData(data);
          setView('welcome');
        } else {
          // İlk kullanım - hoşgeldin ekranı
          setView('welcome');
        }
      } catch (error) {
        console.log('İlk kullanım - veri bulunamadı');
        setView('welcome');
      }
    };
    loadData();
  }, []);

  const saveData = async (data: typeof studentData) => {
    setStudentData(data);
    try {
      localStorage.setItem('emir_taha_progress', JSON.stringify(data));
      console.log('Veri kaydedildi!');
    } catch (error) {
      console.error('Veri kaydetme hatası:', error);
    }
  };

  const [currentSubject, setCurrentSubject] = useState<string | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizComplete, setQuizComplete] = useState(false);
  const [parentPass, setParentPass] = useState('');

  // Sadece ilk 10 soruyu gösteriyorum, siz istediğiniz kadar ekleyebilirsiniz
  const allQuestions = {
    matematik: [
      { q: '(-5) + (+8) = ?', a: ['-3', '+3', '-13', '+13'], c: 1 },
      { q: '(-12) - (-7) = ?', a: ['-5', '+5', '-19', '+19'], c: 0 },
      { q: '3/4 ÷ 2/3 = ?', a: ['1/2', '9/8', '6/12', '2/3'], c: 1 },
      { q: 'x + 15 = 32 ise x kaçtır?', a: ['15', '17', '32', '47'], c: 1 },
      { q: 'EBOB(18, 24) = ?', a: ['3', '6', '12', '18'], c: 1 },
      { q: '(-8) × (+3) = ?', a: ['-24', '+24', '-11', '+11'], c: 0 },
      { q: '5/6 - 2/3 = ?', a: ['1/6', '1/3', '3/6', '1/2'], c: 0 },
      { q: '2,5 + 1,75 = ?', a: ['4,00', '4,25', '4,50', '4,75'], c: 1 },
      { q: '3x - 7 = 14 ise x kaçtır?', a: ['5', '6', '7', '8'], c: 2 },
      { q: 'EKOK(12, 18) = ?', a: ['24', '36', '48', '72'], c: 1 },
      { q: '(+7) × (-6) = ?', a: ['-42', '+42', '-1', '+1'], c: 0 },
      { q: '4/5 × 3/2 = ?', a: ['12/10', '6/5', '7/7', '12/7'], c: 0 },
      { q: 'Bir sayının 2/3\'ü 18 ise sayı kaçtır?', a: ['12', '24', '27', '36'], c: 2 },
      { q: '(-15) + (-8) = ?', a: ['-7', '+7', '-23', '+23'], c: 2 },
      { q: '3,6 × 2,5 = ?', a: ['7,5', '8,0', '9,0', '10,5'], c: 2 },
      { q: '2x + 5 = 19 ise x kaçtır?', a: ['5', '6', '7', '8'], c: 2 },
      { q: '48 sayısının asal çarpanları toplamı kaçtır?', a: ['5', '7', '9', '11'], c: 0 },
      { q: '(-20) ÷ (+5) = ?', a: ['-4', '+4', '-15', '+15'], c: 0 },
      { q: '7/8 + 1/4 = ?', a: ['8/12', '9/8', '1', '2/3'], c: 1 },
      { q: '15 ile 25\'in ortalaması kaçtır?', a: ['18', '19', '20', '21'], c: 2 },
      { q: 'Bir dikdörtgenin alanı 72 cm², eni 8 cm ise boyu kaç cm?', a: ['7', '8', '9', '10'], c: 2 },
      { q: '(+9) - (+15) = ?', a: ['-6', '+6', '-24', '+24'], c: 0 },
      { q: '2/5 × 10/3 = ?', a: ['4/3', '20/15', '12/8', '6/5'], c: 0 },
      { q: '4x - 8 = 20 ise x kaçtır?', a: ['5', '6', '7', '8'], c: 2 },
      { q: 'EBOB(30, 45) = ?', a: ['5', '10', '15', '30'], c: 2 },
      { q: '(-7) × (-8) = ?', a: ['-56', '+56', '-15', '+15'], c: 1 },
      { q: '5,4 - 2,75 = ?', a: ['2,35', '2,65', '3,65', '2,75'], c: 1 },
      { q: 'Bir sayının 5 eksiğinin 3 katı 21 ise sayı kaçtır?', a: ['10', '11', '12', '13'], c: 2 },
      { q: '72 sayısının pozitif bölen sayısı kaçtır?', a: ['10', '12', '14', '16'], c: 1 },
      { q: '(+18) ÷ (-3) = ?', a: ['-6', '+6', '-21', '+21'], c: 0 },
      { q: '3/8 + 5/8 = ?', a: ['1', '8/16', '8/8', '2/3'], c: 0 },
      { q: '20, 30, 40 sayılarının ortalaması kaçtır?', a: ['25', '28', '30', '35'], c: 2 },
      { q: 'Bir karenin çevresi 48 cm ise alanı kaç cm²?', a: ['12', '144', '24', '96'], c: 1 },
      { q: '(-14) - (+9) = ?', a: ['-23', '+23', '-5', '+5'], c: 0 },
      { q: '7/10 - 3/10 = ?', a: ['4/10', '10/10', '4/20', '1/2'], c: 0 },
      { q: '5x + 12 = 37 ise x kaçtır?', a: ['3', '4', '5', '6'], c: 2 },
      { q: 'EKOK(8, 12) = ?', a: ['12', '24', '36', '48'], c: 1 },
      { q: '(-9) × (+4) = ?', a: ['-36', '+36', '-5', '+5'], c: 0 },
      { q: '6,25 + 3,75 = ?', a: ['9,00', '9,50', '10,00', '10,50'], c: 2 },
      { q: 'Bir dikdörtgenin çevresi 40 cm, eni 8 cm ise boyu kaç cm?', a: ['10', '12', '14', '16'], c: 1 },
      { q: '(-42) ÷ (+6) = ?', a: ['-7', '+7', '-36', '+36'], c: 0 },
      { q: '5/6 × 3/5 = ?', a: ['1/2', '15/30', '8/11', '3/6'], c: 0 },
      { q: '3x - 15 = 0 ise x kaçtır?', a: ['3', '4', '5', '6'], c: 2 },
      { q: '36 ile 48\'in EBOB\'u kaçtır?', a: ['6', '8', '12', '18'], c: 2 },
      { q: '(+11) + (-17) = ?', a: ['-6', '+6', '-28', '+28'], c: 0 },
      { q: '4,8 × 1,5 = ?', a: ['6,2', '7,2', '8,2', '9,2'], c: 1 },
      { q: 'Bir sayının 4 katının 7 eksiği 29 ise sayı kaçtır?', a: ['7', '8', '9', '10'], c: 2 },
      { q: '60 sayısının asal çarpanları çarpımı kaçtır?', a: ['30', '60', '120', '240'], c: 1 },
      { q: '(-25) - (-18) = ?', a: ['-7', '+7', '-43', '+43'], c: 0 },
      { q: '2/3 + 5/6 = ?', a: ['7/9', '3/2', '1', '4/3'], c: 1 },
      { q: '8, 12, 16 sayılarının ortalaması kaçtır?', a: ['10', '11', '12', '13'], c: 2 },
      { q: 'Bir karenin alanı 81 cm² ise bir kenarı kaç cm?', a: ['7', '8', '9', '10'], c: 2 },
      { q: '(+16) × (-3) = ?', a: ['-48', '+48', '-13', '+13'], c: 0 },
      { q: '7/12 - 1/4 = ?', a: ['1/3', '6/12', '5/12', '1/2'], c: 0 },
      { q: '6x - 18 = 24 ise x kaçtır?', a: ['5', '6', '7', '8'], c: 2 },
      { q: 'EBOB(24, 36, 48) = ?', a: ['6', '8', '12', '24'], c: 2 },
      { q: '(-72) ÷ (-9) = ?', a: ['-8', '+8', '-63', '+63'], c: 1 },
      { q: '3,25 - 1,75 = ?', a: ['1,25', '1,50', '1,75', '2,00'], c: 1 },
      { q: 'Bir dikdörtgenin alanı 96 cm², boyu 12 cm ise eni kaç cm?', a: ['6', '7', '8', '9'], c: 2 },
      { q: '(+13) - (+20) = ?', a: ['-7', '+7', '-33', '+33'], c: 0 },
      { q: '4/9 × 3/8 = ?', a: ['1/6', '12/72', '7/17', '2/3'], c: 0 },
      { q: '2x + 14 = 30 ise x kaçtır?', a: ['6', '7', '8', '9'], c: 2 },
      { q: 'EKOK(15, 20) = ?', a: ['30', '40', '60', '100'], c: 2 },
      { q: '(-6) × (-7) = ?', a: ['-42', '+42', '-13', '+13'], c: 1 },
      { q: '8,4 + 2,6 = ?', a: ['10,0', '11,0', '12,0', '13,0'], c: 1 },
      { q: 'Bir sayının 2 katının 9 fazlası 35 ise sayı kaçtır?', a: ['11', '12', '13', '14'], c: 2 },
      { q: '90 sayısının asal çarpanları toplamı kaçtır?', a: ['7', '10', '12', '15'], c: 1 },
      { q: '(-30) + (+18) = ?', a: ['-12', '+12', '-48', '+48'], c: 0 },
      { q: '5/8 + 3/4 = ?', a: ['11/8', '8/12', '1', '2/3'], c: 0 },
      { q: '15, 25, 35 sayılarının ortalaması kaçtır?', a: ['20', '25', '30', '35'], c: 1 },
      { q: 'Bir dikdörtgenin çevresi 56 cm, boyu 16 cm ise eni kaç cm?', a: ['10', '12', '14', '16'], c: 1 },
      { q: '(+45) ÷ (-5) = ?', a: ['-9', '+9', '-40', '+40'], c: 0 },
      { q: '2/5 + 3/10 = ?', a: ['7/10', '5/15', '1/2', '5/10'], c: 0 },
      { q: '7x - 21 = 28 ise x kaçtır?', a: ['5', '6', '7', '8'], c: 2 }
    ],
    fen: [
      { q: 'Hücrenin en dıştaki yapısına ne denir?', a: ['Zar', 'Çekirdek', 'Sitoplazma', 'Organel'], c: 0 },
      { q: 'İskelet sisteminin görevi nedir?', a: ['Sindirim', 'Destek', 'Dolaşım', 'Boşaltım'], c: 1 },
      { q: 'Kuvvetin birimi nedir?', a: ['Joule', 'Newton', 'Watt', 'Pascal'], c: 1 },
      { q: 'Işık hangi hızla yayılır?', a: ['300 m/s', '3000 m/s', '300.000 km/s', '3.000 km/s'], c: 2 },
      { q: 'Kalp hangi sisteme aittir?', a: ['Sindirim', 'Solunum', 'Dolaşım', 'Boşaltım'], c: 2 },
      { q: 'Hücrenin kontrol merkezine ne denir?', a: ['Sitoplazma', 'Çekirdek', 'Zar', 'Mitokondri'], c: 1 },
      { q: 'Eklemlerin görevi nedir?', a: ['Hareket', 'Destek', 'Koruma', 'Üretim'], c: 0 },
      { q: 'Sürtünme kuvveti hareketi nasıl etkiler?', a: ['Hızlandırır', 'Yavaşlatır', 'Etkilemez', 'Yön verir'], c: 1 },
      { q: 'Ses hangi ortamda yayılamaz?', a: ['Hava', 'Su', 'Demir', 'Boşluk'], c: 3 },
      { q: 'Akciğerler hangi sisteme aittir?', a: ['Dolaşım', 'Solunum', 'Sindirim', 'Boşaltım'], c: 1 },
      { q: 'Bitki hücresinde olup hayvan hücresinde olmayan yapı?', a: ['Çekirdek', 'Hücre duvarı', 'Sitoplazma', 'Zar'], c: 1 },
      { q: 'Kasların görevi nedir?', a: ['Koruma', 'Hareket', 'Sindirim', 'Dolaşım'], c: 1 },
      { q: 'Ağırlık = Kütle × ?', a: ['Hız', 'Yoğunluk', 'Yerçekimi ivmesi', 'Hacim'], c: 2 },
      { q: 'Işığın yansıması hangi yüzeyde en iyi olur?', a: ['Mat', 'Pürüzlü', 'Parlak', 'Saydam'], c: 2 },
      { q: 'Mide hangi sisteme aittir?', a: ['Solunum', 'Sindirim', 'Dolaşım', 'Boşaltım'], c: 1 },
      { q: 'Prokaryot hücrelerde hangi yapı yoktur?', a: ['Zar', 'Sitoplazma', 'Çekirdek zarı', 'DNA'], c: 2 },
      { q: 'Kıkırdak hangi sistemde bulunur?', a: ['Sindirim', 'Dolaşım', 'İskelet', 'Solunum'], c: 2 },
      { q: 'Net kuvvet 0 olursa cisim nasıl hareket eder?', a: ['Hızlanır', 'Yavaşlar', 'Sabit hızla', 'Durur'], c: 2 },
      { q: 'Elektrik akımı hangi birimle ölçülür?', a: ['Volt', 'Amper', 'Ohm', 'Watt'], c: 1 },
      { q: 'Böbrekler hangi sisteme aittir?', a: ['Sindirim', 'Dolaşım', 'Boşaltım', 'Solunum'], c: 2 },
      { q: 'Hücre zarının görevi nedir?', a: ['Enerji üretimi', 'Kontrol', 'Madde geçişi', 'Üretim'], c: 2 },
      { q: 'İnsan vücudunda kaç tür kas vardır?', a: ['1', '2', '3', '4'], c: 2 },
      { q: 'Hangi kuvvet düşmeye neden olur?', a: ['Sürtünme', 'Manyetik', 'Yerçekimi', 'Normal'], c: 2 },
      { q: 'Mercek ne yapar?', a: ['Işığı soğurur', 'Işığı yansıtır', 'Işığı kırar', 'Işığı dağıtır'], c: 2 },
      { q: 'Kalp dakikada kaç atar (ortalama)?', a: ['50', '70', '100', '120'], c: 1 },
      { q: 'Kloroplast hangi hücrede bulunur?', a: ['Hayvan', 'Bitki', 'Bakteri', 'Mantar'], c: 1 },
      { q: 'Tendon neyi kemiğe bağlar?', a: ['Sinir', 'Damar', 'Kas', 'Organ'], c: 2 },
      { q: 'F = m × a formülü neyi verir?', a: ['Enerji', 'Güç', 'Kuvvet', 'İş'], c: 2 },
      { q: 'Elektrik direnci hangi birimle ölçülür?', a: ['Volt', 'Amper', 'Ohm', 'Watt'], c: 2 },
      { q: 'Bağırsağın görevi nedir?', a: ['Besin emilimi', 'Oksijen alımı', 'Kan temizliği', 'Üretim'], c: 0 },
      { q: 'Mitokondri neyi üretir?', a: ['Protein', 'Enerji', 'DNA', 'Enzim'], c: 1 },
      { q: 'Omurganın kaç kemiği vardır?', a: ['23', '33', '43', '53'], c: 1 },
      { q: 'Hız = Yol ÷ ?', a: ['Kuvvet', 'Kütle', 'Zaman', 'İvme'], c: 2 },
      { q: 'Saydam madde örneği hangisidir?', a: ['Tahta', 'Cam', 'Kağıt', 'Demir'], c: 1 },
      { q: 'Karaciğerin görevi nedir?', a: ['Sindirim', 'Safra üretimi', 'Solunum', 'Kan pompası'], c: 1 },
      { q: 'Ribozom neyi üretir?', a: ['Enerji', 'DNA', 'Protein', 'Lipid'], c: 2 },
      { q: 'Kafatası hangi organı korur?', a: ['Kalp', 'Akciğer', 'Beyin', 'Mide'], c: 2 },
      { q: 'Sürtünme kuvveti neye bağlıdır?', a: ['Renk', 'Yüzey', 'Sıcaklık', 'Işık'], c: 1 },
      { q: 'Voltaj hangi birimle ölçülür?', a: ['Amper', 'Volt', 'Ohm', 'Watt'], c: 1 },
      { q: 'Kan hangi organda temizlenir?', a: ['Kalp', 'Akciğer', 'Böbrek', 'Karaciğer'], c: 2 },
      { q: 'Hücre duvarı neden yapılmıştır?', a: ['Protein', 'Lipid', 'Selüloz', 'DNA'], c: 2 },
      { q: 'Göğüs kafesi neyi korur?', a: ['Beyin', 'Kalp ve akciğer', 'Mide', 'Böbrek'], c: 1 },
      { q: 'İvme = Hız değişimi ÷ ?', a: ['Yol', 'Kütle', 'Zaman', 'Kuvvet'], c: 2 },
      { q: 'Işık prizmasından geçince ne olur?', a: ['Yok olur', 'Renklere ayrılır', 'Hızlanır', 'Yavaşlar'], c: 1 },
      { q: 'Yemek borusu hangi sisteme aittir?', a: ['Solunum', 'Sindirim', 'Dolaşım', 'Boşaltım'], c: 1 },
      { q: 'Hayvan hücresinde enerji üreten organel?', a: ['Çekirdek', 'Ribozom', 'Mitokondri', 'Lizozom'], c: 2 },
      { q: 'Eklem türlerinden biri hangisidir?', a: ['Kemik', 'Menteşe', 'Kas', 'Sinir'], c: 1 },
      { q: 'Cismin hızı artarken ivmesi nasıldır?', a: ['Negatif', 'Pozitif', 'Sıfır', 'Değişken'], c: 1 },
      { q: 'Mat yüzey ışığı nasıl yansıtır?', a: ['Düzgün', 'Dağınık', 'Yansıtmaz', 'Emilir'], c: 1 },
      { q: 'Atardamar kanı nereden taşır?', a: ['Kalpten', 'Kalbe', 'Akciğere', 'Beyinden'], c: 0 },
      { q: 'Kloroplastın görevi nedir?', a: ['Enerji', 'Fotosentez', 'Protein', 'Solunum'], c: 1 },
      { q: 'Omurga hangi sisteme aittir?', a: ['Kas', 'İskelet', 'Sinir', 'Dolaşım'], c: 1 },
      { q: 'Sabit hızla hareket eden cismin ivmesi?', a: ['Pozitif', 'Negatif', 'Sıfır', 'Değişken'], c: 2 },
      { q: 'Ampul elektrik enerjisini neye çevirir?', a: ['Isı', 'Işık', 'Ses', 'Işık ve ısı'], c: 3 },
      { q: 'Toplardamar kanı nereye taşır?', a: ['Kalpten', 'Kalbe', 'Akciğerden', 'Beyine'], c: 1 },
      { q: 'Bitki hücresinde fotosentez nerede olur?', a: ['Çekirdek', 'Mitokondri', 'Kloroplast', 'Ribozom'], c: 2 },
      { q: 'Kemik iliği ne üretir?', a: ['Enzim', 'Hormon', 'Kan hücresi', 'Sinir'], c: 2 },
      { q: 'Kütle = Ağırlık ÷ ?', a: ['Hız', 'İvme', 'g', 'Hacim'], c: 2 },
      { q: 'Ses dalgası hangi türdür?', a: ['Elektromanyetik', 'Mekanik', 'Işık', 'Radyo'], c: 1 },
      { q: 'Küçük kan dolaşımı nereyle başlar?', a: ['Sol karıncık', 'Sağ karıncık', 'Sol kulakçık', 'Sağ kulakçık'], c: 1 },
      { q: 'Prokaryot hücre örneği hangisidir?', a: ['Bitki', 'Hayvan', 'Bakteri', 'Mantar'], c: 2 },
      { q: 'Kıkırdağın özelliği nedir?', a: ['Sert', 'Esnek', 'Sıvı', 'Gaz'], c: 1 },
      { q: 'Yerçekimi ivmesi yaklaşık kaçtır?', a: ['5 m/s²', '10 m/s²', '15 m/s²', '20 m/s²'], c: 1 },
      { q: 'Işığın soğurulması ne demektir?', a: ['Yansıması', 'Kırılması', 'Geçmemesi', 'Renk değiştirmesi'], c: 2 },
      { q: 'Kan plazmasının oranı yaklaşık yüzde kaçtır?', a: ['25', '35', '45', '55'], c: 3 },
      { q: 'Ökaryot hücre örneği hangisidir?', a: ['Bakteri', 'Virüs', 'Bitki', 'Mavi-yeşil alg'], c: 2 },
      { q: 'Kemik dokusu hangi maddeyi içerir?', a: ['Sodyum', 'Potasyum', 'Kalsiyum', 'Magnezyum'], c: 2 },
      { q: 'Duran cisme etki eden net kuvvet kaçtır?', a: ['-1', '0', '1', 'Değişken'], c: 1 },
      { q: 'Elektrik devresinde anahtar ne yapar?', a: ['Ölçer', 'Açar-kapar', 'Isıtır', 'Aydınlatır'], c: 1 },
      { q: 'Büyük kan dolaşımı nereden başlar?', a: ['Sağ karıncık', 'Sol karıncık', 'Sağ kulakçık', 'Sol kulakçık'], c: 1 },
      { q: 'İnsan vücudunda kaç kemik vardır?', a: ['186', '196', '206', '216'], c: 2 },
      { q: 'Bitkiler hangi gazı alır?', a: ['Oksijen', 'Azot', 'Karbondioksit', 'Hidrojen'], c: 2 },
      { q: 'Suyun kaynama noktası kaç derecedir?', a: ['50°C', '75°C', '100°C', '150°C'], c: 2 }
    ],
    turkce: [
      { q: 'Gelecek zaman eki hangisidir?', a: ['-dı', '-mış', '-acak', '-yor'], c: 2 },
      { q: '"Çalışıyorum" hangi zamandadır?', a: ['Geçmiş', 'Şimdiki', 'Gelecek', 'Geniş'], c: 1 },
      { q: 'Emir kipi hangi kişide kullanılır?', a: ['1. tekil', '2. tekil', '3. tekil', 'Hepsi'], c: 1 },
      { q: 'Anlatım biçimlerinden biri hangisidir?', a: ['İsim', 'Öyküleme', 'Fiil', 'Sıfat'], c: 1 },
      { q: '"Geldi" hangi zamandadır?', a: ['Şimdiki', 'Gelecek', 'Görülen geçmiş', 'Geniş'], c: 2 },
      { q: 'Dilek kipi hangisidir?', a: ['Emir', 'Gereklilik', 'Her ikisi', 'Hiçbiri'], c: 2 },
      { q: '"Okurdu" hangi zamandadır?', a: ['Şimdiki', 'Hikaye', 'Gelecek', 'Geniş'], c: 1 },
      { q: 'Betimlemede ne anlatılır?', a: ['Olay', 'Tasvir', 'Duygu', 'Düşünce'], c: 1 },
      { q: 'Geniş zaman eki hangisidir?', a: ['-dı', '-r', '-yor', '-acak'], c: 1 },
      { q: '"Gitmiş" hangi zamandadır?', a: ['Şimdiki', 'Duyulan geçmiş', 'Gelecek', 'Geniş'], c: 1 },
      { q: 'İstek kipi hangisidir?', a: ['-malı', '-e/-a', '-se', 'b ve c'], c: 3 },
      { q: 'Açıklama nerede kullanılır?', a: ['Şiir', 'Bilimsel metin', 'Hikaye', 'Mektup'], c: 1 },
      { q: '"Koşacak" hangi zamandadır?', a: ['Geçmiş', 'Şimdiki', 'Gelecek', 'Geniş'], c: 2 },
      { q: 'Şart kipi eki hangisidir?', a: ['-malı', '-se', '-e', '-dı'], c: 1 },
      { q: '"Yazıyordu" hangi zamandadır?', a: ['Şimdiki zamanın hikayesi', 'Gelecek', 'Geniş', 'Geçmiş'], c: 0 },
      { q: 'Tartışmada ne yapılır?', a: ['Tasvir', 'Fikir savunma', 'Olay anlatma', 'Betimleme'], c: 1 },
      { q: 'Gereklilik kipi eki hangisidir?', a: ['-se', '-e', '-malı', '-r'], c: 2 },
      { q: '"Okur" hangi zamandadır?', a: ['Geçmiş', 'Şimdiki', 'Gelecek', 'Geniş'], c: 3 },
      { q: 'Fiil çekiminde değişmeyen kısma ne denir?', a: ['Ek', 'Kök', 'Çekim', 'Hece'], c: 1 },
      { q: 'Öyküleme ne anlatır?', a: ['Görüntü', 'Olay', 'Düşünce', 'Duygu'], c: 1 },
      { q: '"Gelecekti" hangi zamandadır?', a: ['Gelecek', 'Gelecek zamanın hikayesi', 'Geçmiş', 'Geniş'], c: 1 },
      { q: 'Birleşik zamanlarda kaç ek vardır?', a: ['1', '2', '3', '4'], c: 1 },
      { q: '"Okudum" kaç eklidir?', a: ['1', '2', '3', '4'], c: 1 },
      { q: 'Düşünceyi açıklama hangi metinde olur?', a: ['Hikaye', 'Deneme', 'Şiir', 'Tiyatro'], c: 1 },
      { q: 'Şimdiki zaman eki hangisidir?', a: ['-dı', '-r', '-yor', '-acak'], c: 2 },
      { q: 'Emir kipinde özne hangisidir?', a: ['Ben', 'Sen', 'O', 'Biz'], c: 1 },
      { q: '"Gelmeli" hangi kiptedir?', a: ['Emir', 'Dilek-Gereklilik', 'Haber', 'Şart'], c: 1 },
      { q: 'Anlatım bozukluğu ne demektir?', a: ['Güzel anlatım', 'Hatalı anlatım', 'Düz anlatım', 'Uzun anlatım'], c: 1 },
      { q: '"Giderse" hangi kiptedir?', a: ['Emir', 'Gereklilik', 'Şart', 'İstek'], c: 2 },
      { q: 'Görülen geçmiş zaman eki hangisidir?', a: ['-dı', '-mış', '-yor', '-r'], c: 0 },
      { q: 'Fiillerde kişi eki nerededir?', a: ['Başta', 'Ortada', 'Sonda', 'Her yerde'], c: 2 },
      { q: 'Betimleme hangi duyuya hitap eder?', a: ['Sadece görme', 'Beş duyu', 'Sadece işitme', 'Sadece dokunma'], c: 1 },
      { q: 'Duyulan geçmiş zaman eki hangisidir?', a: ['-dı', '-mış', '-yor', '-r'], c: 1 },
      { q: '"Gelse" hangi kiptedir?', a: ['Emir', 'Gereklilik', 'İstek-Şart', 'Haber'], c: 2 },
      { q: 'Hikaye birleşik zamanında hangi ekler vardır?', a: ['Zaman + kişi', 'Zaman + -dı', 'Kip + zaman', 'Kök + ek'], c: 1 },
      { q: 'Açıklamada hangi cümleler kullanılır?', a: ['Mecazi', 'Bilimsel', 'Şiirsel', 'Abartılı'], c: 1 },
      { q: 'Geniş zamanın olumsuz eki hangisidir?', a: ['-maz/-mez', '-mıyor', '-madı', '-mayacak'], c: 0 },
      { q: '"Gitsin" hangi kiptedir?', a: ['Emir', 'Gereklilik', 'İstek', 'Şart'], c: 2 },
      { q: 'Fiil kökü nasıl bulunur?', a: ['Ekleri çıkararak', 'Ekleri ekleyerek', 'Çevirerek', 'Çoğaltarak'], c: 0 },
      { q: 'Tartışma metninde ne olmalıdır?', a: ['Sadece övgü', 'Kanıt ve delil', 'Sadece eleştiri', 'Sadece tasvir'], c: 1 },
      { q: '"Okuyacaktı" kaç eklidir?', a: ['1', '2', '3', '4'], c: 1 },
      { q: 'Fiilde zaman eki nerededir?', a: ['Kökten önce', 'Kökten sonra', 'Kişi ekinden sonra', 'Her yerde'], c: 1 },
      { q: '"Yaz" hangi kiptedir?', a: ['Dilek', 'Emir', 'Şart', 'Haber'], c: 1 },
      { q: 'Öyküleme hangi metinde kullanılır?', a: ['Deneme', 'Makale', 'Hikaye', 'Bildiri'], c: 2 },
      { q: 'Gelecek zamanın olumsuz eki hangisidir?', a: ['-maz', '-mıyor', '-madı', '-mayacak'], c: 3 },
      { q: 'Kip eki ile zaman eki arasında ne vardır?', a: ['Hiçbir şey', 'Olumsuzluk eki', 'Kişi eki', 'Çoğul eki'], c: 1 },
      { q: '"Çalışmalı" hangi kiptedir?', a: ['Emir', 'Gereklilik', 'İstek', 'Şart'], c: 1 },
      { q: 'Betimleme hangi dilde olmalıdır?', a: ['Sade', 'Bilimsel', 'Süslü', 'Karışık'], c: 2 },
      { q: 'Şimdiki zamanın olumsuz eki hangisidir?', a: ['-maz', '-mıyor', '-madı', '-mayacak'], c: 1 },
      { q: '"Gidelim" hangi kiptedir?', a: ['Emir', 'Gereklilik', 'İstek', 'Şart'], c: 2 },
      { q: 'Fiilde çoğul eki nerededir?', a: ['Kökten önce', 'Kökten sonra', 'Kişi ekinden önce', 'En sonda'], c: 2 },
      { q: 'Açıklama hangi amaçla yapılır?', a: ['Eğlendirmek', 'Bilgilendirmek', 'Hüzün vermek', 'Korkutmak'], c: 1 },
      { q: 'Görülen geçmiş zamanın olumsuz eki?', a: ['-madı/-medi', '-maz', '-mıyor', '-mayacak'], c: 0 },
      { q: 'Birleşik zamanda ikinci ek ne belirtir?', a: ['Zaman', 'Kişi', 'Başka zaman', 'Çoğul'], c: 2 },
      { q: '"Okusun" hangi kiptedir?', a: ['Emir', 'Gereklilik', 'İstek', 'Şart'], c: 2 },
      { q: 'Düşünceyi açıklama ne içerir?', a: ['Sadece olaylar', 'Fikir ve görüş', 'Sadece tasvir', 'Sadece diyalog'], c: 1 },
      { q: 'Geniş zaman hangi anlamı verir?', a: ['Şimdi', 'Her zaman', 'Geçmiş', 'Gelecek'], c: 1 },
      { q: 'Fiil kökü hangi türdendir?', a: ['İsim', 'Sıfat', 'Fiil', 'Zarf'], c: 2 },
      { q: '"Gitmeli" kaç eklidir?', a: ['1', '2', '3', '4'], c: 1 },
      { q: 'Tartışmada hangi dil kullanılır?', a: ['Şiirsel', 'İkna edici', 'Süslü', 'Karışık'], c: 1 },
      { q: 'Duyulan geçmiş zamanın olumsuz eki?', a: ['-madı', '-maz', '-mamış/-memiş', '-mayacak'], c: 2 },
      { q: '"Gel" fiilinin kökü nedir?', a: ['Ge', 'Gel', 'Gelmek', 'Geldi'], c: 1 },
      { q: 'Emir kipinde olumsuzluk eki hangisidir?', a: ['-ma/-me', '-maz', '-madı', '-mıyor'], c: 0 },
      { q: 'Öyküleme hangi türde vardır?', a: ['Roman', 'Deneme', 'Makale', 'Söylev'], c: 0 },
      { q: '"Yazıyor" kaç eklidir?', a: ['1', '2', '3', '4'], c: 1 },
      { q: 'Şimdiki zaman ne anlatır?', a: ['Geçmiş', 'Şu an', 'Gelecek', 'Her zaman'], c: 1 },
      { q: 'Fiillerde soru eki nerededir?', a: ['Başta', 'Ortada', 'Kişi ekinden önce', 'En sonda'], c: 3 },
      { q: 'Betimleme hangi sanat dalında çoktur?', a: ['Müzik', 'Edebiyat', 'Spor', 'Matematik'], c: 1 },
      { q: 'Gelecek zaman ne anlatır?', a: ['Geçmiş', 'Şimdi', 'İleri zaman', 'Her zaman'], c: 2 },
      { q: '"Koşmalı" hangi anlam verir?', a: ['Emir', 'Gereklilik', 'İstek', 'Şart'], c: 1 },
      { q: 'Hikaye hangi zamana ait ektir?', a: ['Gelecek', 'Geçmiş', 'Birleşik zaman', 'Geniş'], c: 2 },
      { q: 'Açıklamada cümleler nasıl olmalı?', a: ['Kısa', 'Net ve anlaşılır', 'Karışık', 'Süslü'], c: 1 },
      { q: '"Gider" hangi zamandadır?', a: ['Geçmiş', 'Şimdiki', 'Gelecek', 'Geniş'], c: 3 },
      { q: 'Fiillerde kip hangi anlamı verir?', a: ['Zaman', 'Konuşanın tavrı', 'Kişi', 'Sayı'], c: 1 }
    ],
    ingilizce: [
      { q: 'What is your name? cümlesinin cevabı hangisidir?', a: ['I am 12', 'My name is Ali', 'I am fine', 'Yes, I do'], c: 1 },
      { q: '"Good morning" ne demektir?', a: ['İyi geceler', 'Günaydın', 'İyi akşamlar', 'İyi günler'], c: 1 },
      { q: 'How old are you? sorusunun cevabı hangisidir?', a: ['I am Ali', 'I am 12 years old', 'I am fine', 'Yes, I am'], c: 1 },
      { q: '"Goodbye" ne demektir?', a: ['Merhaba', 'Hoşçakal', 'Teşekkürler', 'Lütfen'], c: 1 },
      { q: '"Thank you" ifadesinin cevabı hangisidir?', a: ['Hello', 'You are welcome', 'Goodbye', 'Yes'], c: 1 },
      { q: 'I _____ a student. Boşluğa ne gelmelidir?', a: ['is', 'am', 'are', 'be'], c: 1 },
      { q: '"Kalem" İngilizce ne demektir?', a: ['Book', 'Pen', 'Pencil', 'Eraser'], c: 1 },
      { q: 'She _____ my sister. Boşluğa ne gelmelidir?', a: ['is', 'am', 'are', 'be'], c: 0 },
      { q: '"Öğretmen" İngilizce ne demektir?', a: ['Student', 'Teacher', 'Doctor', 'Nurse'], c: 1 },
      { q: 'They _____ happy. Boşluğa ne gelmelidir?', a: ['is', 'am', 'are', 'be'], c: 2 },
      { q: 'What color is the sky? Cevabı hangisidir?', a: ['Red', 'Blue', 'Green', 'Yellow'], c: 1 },
      { q: '"Apple" ne demektir?', a: ['Armut', 'Elma', 'Portakal', 'Muz'], c: 1 },
      { q: 'How many days are there in a week?', a: ['5', '6', '7', '8'], c: 2 },
      { q: '"Cat" ne demektir?', a: ['Köpek', 'Kedi', 'Kuş', 'Balık'], c: 1 },
      { q: 'This _____ my book. Boşluğa ne gelmelidir?', a: ['is', 'am', 'are', 'be'], c: 0 },
      { q: '"Kırmızı" İngilizce ne demektir?', a: ['Blue', 'Red', 'Green', 'Yellow'], c: 1 },
      { q: 'I have _____ apple. Boşluğa ne gelmelidir?', a: ['a', 'an', 'the', '-'], c: 1 },
      { q: '"Mother" ne demektir?', a: ['Baba', 'Anne', 'Kardeş', 'Teyze'], c: 1 },
      { q: 'She _____ a doctor. Boşluğa ne gelmelidir?', a: ['is', 'am', 'are', 'be'], c: 0 },
      { q: '"Chair" ne demektir?', a: ['Masa', 'Sandalye', 'Kapı', 'Pencere'], c: 1 },
      { q: 'Where _____ you from? Boşluğa ne gelmelidir?', a: ['is', 'am', 'are', 'be'], c: 2 },
      { q: '"School" ne demektir?', a: ['Ev', 'Okul', 'Hastane', 'Park'], c: 1 },
      { q: 'He _____ my friend. Boşluğa ne gelmelidir?', a: ['is', 'am', 'are', 'be'], c: 0 },
      { q: '"Big" ne demektir?', a: ['Küçük', 'Büyük', 'Uzun', 'Kısa'], c: 1 },
      { q: '"Monday" ne demektir?', a: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe'], c: 0 },
      { q: 'I _____ go to school. Boşluğa ne gelmelidir?', a: ['do', 'does', 'did', 'doing'], c: 0 },
      { q: '"Water" ne demektir?', a: ['Süt', 'Su', 'Çay', 'Kahve'], c: 1 },
      { q: 'She _____ reading a book. Boşluğa ne gelmelidir?', a: ['is', 'am', 'are', 'be'], c: 0 },
      { q: '"Father" ne demektir?', a: ['Anne', 'Baba', 'Kardeş', 'Amca'], c: 1 },
      { q: 'They _____ playing football. Boşluğa ne gelmelidir?', a: ['is', 'am', 'are', 'be'], c: 2 },
      { q: '"Dog" ne demektir?', a: ['Kedi', 'Köpek', 'Kuş', 'Balık'], c: 1 },
      { q: 'We _____ friends. Boşluğa ne gelmelidir?', a: ['is', 'am', 'are', 'be'], c: 2 },
      { q: '"Small" ne demektir?', a: ['Büyük', 'Küçük', 'Uzun', 'Kısa'], c: 1 },
      { q: '"Tuesday" ne demektir?', a: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe'], c: 1 },
      { q: 'He _____ like ice cream. Boşluğa ne gelmelidir?', a: ['do', 'does', 'did', 'doing'], c: 1 },
      { q: '"Bread" ne demektir?', a: ['Peynir', 'Ekmek', 'Süt', 'Yumurta'], c: 1 },
      { q: 'I _____ playing basketball. Boşluğa ne gelmelidir?', a: ['is', 'am', 'are', 'be'], c: 1 },
      { q: '"Sister" ne demektir?', a: ['Erkek kardeş', 'Kız kardeş', 'Anne', 'Baba'], c: 1 },
      { q: 'You _____ very kind. Boşluğa ne gelmelidir?', a: ['is', 'am', 'are', 'be'], c: 2 },
      { q: '"Bird" ne demektir?', a: ['Kedi', 'Köpek', 'Kuş', 'Balık'], c: 2 },
      { q: 'It _____ a nice day. Boşluğa ne gelmelidir?', a: ['is', 'am', 'are', 'be'], c: 0 },
      { q: '"Long" ne demektir?', a: ['Kısa', 'Uzun', 'Büyük', 'Küçük'], c: 1 },
      { q: '"Wednesday" ne demektir?', a: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe'], c: 2 },
      { q: 'They _____ watch TV every day. Boşluğa ne gelmelidir?', a: ['do', 'does', 'did', 'doing'], c: 0 },
      { q: '"Cheese" ne demektir?', a: ['Ekmek', 'Peynir', 'Süt', 'Yumurta'], c: 1 },
      { q: 'We _____ studying English. Boşluğa ne gelmelidir?', a: ['is', 'am', 'are', 'be'], c: 2 },
      { q: '"Brother" ne demektir?', a: ['Kız kardeş', 'Erkek kardeş', 'Anne', 'Baba'], c: 1 },
      { q: 'The book _____ on the table. Boşluğa ne gelmelidir?', a: ['is', 'am', 'are', 'be'], c: 0 },
      { q: '"Fish" ne demektir?', a: ['Kedi', 'Köpek', 'Kuş', 'Balık'], c: 3 },
      { q: 'My bag _____ new. Boşluğa ne gelmelidir?', a: ['is', 'am', 'are', 'be'], c: 0 },
      { q: '"Short" ne demektir?', a: ['Uzun', 'Kısa', 'Büyük', 'Küçük'], c: 1 },
      { q: '"Thursday" ne demektir?', a: ['Salı', 'Çarşamba', 'Perşembe', 'Cuma'], c: 2 },
      { q: 'She _____ eat vegetables. Boşluğa ne gelmelidir?', a: ['do', 'does', 'did', 'doing'], c: 1 },
      { q: '"Milk" ne demektir?', a: ['Su', 'Süt', 'Çay', 'Kahve'], c: 1 },
      { q: 'You _____ learning Turkish. Boşluğa ne gelmelidir?', a: ['is', 'am', 'are', 'be'], c: 2 },
      { q: '"Grandmother" ne demektir?', a: ['Dede', 'Babaanne/Anneanne', 'Teyze', 'Amca'], c: 1 },
      { q: 'These books _____ interesting. Boşluğa ne gelmelidir?', a: ['is', 'am', 'are', 'be'], c: 2 },
      { q: '"Horse" ne demektir?', a: ['İnek', 'At', 'Koyun', 'Keçi'], c: 1 },
      { q: 'Her dress _____ beautiful. Boşluğa ne gelmelidir?', a: ['is', 'am', 'are', 'be'], c: 0 },
      { q: '"Hot" ne demektir?', a: ['Soğuk', 'Sıcak', 'Ilık', 'Donmuş'], c: 1 },
      { q: '"Friday" ne demektir?', a: ['Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'], c: 2 },
      { q: 'We _____ play football on Sundays. Boşluğa ne gelmelidir?', a: ['do', 'does', 'did', 'doing'], c: 0 },
      { q: '"Egg" ne demektir?', a: ['Ekmek', 'Peynir', 'Yumurta', 'Süt'], c: 2 },
      { q: 'He _____ doing his homework. Boşluğa ne gelmelidir?', a: ['is', 'am', 'are', 'be'], c: 0 },
      { q: '"Grandfather" ne demektir?', a: ['Babaanne', 'Dede', 'Amca', 'Dayı'], c: 1 },
      { q: 'Those flowers _____ pretty. Boşluğa ne gelmelidir?', a: ['is', 'am', 'are', 'be'], c: 2 },
      { q: '"Cow" ne demektir?', a: ['At', 'İnek', 'Koyun', 'Keçi'], c: 1 },
      { q: 'His car _____ old. Boşluğa ne gelmelidir?', a: ['is', 'am', 'are', 'be'], c: 0 },
      { q: '"Cold" ne demektir?', a: ['Sıcak', 'Soğuk', 'Ilık', 'Serin'], c: 1 },
      { q: '"Saturday" ne demektir?', a: ['Perşembe', 'Cuma', 'Cumartesi', 'Pazar'], c: 2 },
      { q: 'It _____ rain every day. Boşluğa ne gelmelidir?', a: ['do', 'does', 'did', 'doing'], c: 1 },
      { q: '"Butter" ne demektir?', a: ['Peynir', 'Tereyağı', 'Süt', 'Yoğurt'], c: 1 },
      { q: 'They _____ singing a song. Boşluğa ne gelmelidir?', a: ['is', 'am', 'are', 'be'], c: 2 }
    ]
  };

  const handleParentLogin = (pass: string) => {
    if (pass === '168859') {
      setUserType('parent');
      setView('parent-dashboard');
    } else {
      alert('Hatalı şifre!');
    }
  };

  const startQuiz = (subjectId: string) => {
    setCurrentSubject(subjectId);
    setCurrentQ(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setQuizComplete(false);
    setView('quiz');
  };

  const handleAnswer = (answerIndex: number) => {
    if (answered || !currentSubject) return;

    const questions = allQuestions[currentSubject as keyof typeof allQuestions];
    const currentQuestion = questions[currentQ];

    setSelectedAnswer(answerIndex);
    setAnswered(true);

    const isCorrect = answerIndex === currentQuestion.c;
    const points = isCorrect ? 20 : 0;

    if (isCorrect) setScore(score + 1);

    const newStats = { ...studentData.subjectStats };
    newStats[currentSubject as keyof typeof newStats].total += 1;
    if (isCorrect) newStats[currentSubject as keyof typeof newStats].correct += 1;

    const updatedData = {
      ...studentData,
      points: studentData.points + points,
      subjectStats: newStats
    };

    saveData(updatedData);

    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(currentQ + 1);
        setAnswered(false);
        setSelectedAnswer(null);
      } else {
        setQuizComplete(true);
      }
    }, 1500);
  };

  if (view === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-300 flex items-center justify-center">
        <div className="text-white text-2xl">Yükleniyor...</div>
      </div>
    );
  }

  if (view === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-300 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Hoşgeldin Emir Taha! 👋</h1>
            <p className="text-gray-600">Ara tatilin en eğlenceli hali!</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => { setUserType('student'); setView('dashboard'); }}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-bold text-xl hover:shadow-lg transform hover:scale-105 transition"
            >
              Başla! 🚀
            </button>

            <button
              onClick={() => setView('parent-login')}
              className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition"
            >
              Veli Girişi 👨‍👩‍👦
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'parent-login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-300 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-4">
              <Award className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Veli Girişi</h1>
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
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition"
            >
              Giriş Yap
            </button>
            <button
              onClick={() => setView('welcome')}
              className="w-full bg-gray-200 text-gray-700 py-2 rounded-xl font-bold hover:bg-gray-300 transition"
            >
              Geri
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'login') {
    return null; // Artık kullanılmıyor
  }

  if (view === 'dashboard') {
    const subjects = [
      { id: 'matematik', name: 'Matematik', color: 'from-blue-500 to-cyan-500', emoji: '🔢' },
      { id: 'fen', name: 'Fen Bilgisi', color: 'from-green-500 to-emerald-500', emoji: '🔬' },
      { id: 'turkce', name: 'Türkçe', color: 'from-purple-500 to-pink-500', emoji: '📚' },
      { id: 'ingilizce', name: 'İngilizce', color: 'from-red-500 to-orange-500', emoji: '🇬🇧' }
    ];

    const badges = [
      { id: 'first', name: 'İlk Adım', icon: '🎯', earned: Object.values(studentData.subjectStats).reduce((sum, s) => sum + s.total, 0) > 0 },
      { id: 'math10', name: 'Matematik Dehası', icon: '🧮', earned: studentData.subjectStats.matematik.correct >= 10 },
      { id: 'science', name: 'Fen Kaşifi', icon: '🔭', earned: studentData.subjectStats.fen.correct >= 10 },
      { id: 'word', name: 'Kelime Ustası', icon: '📖', earned: studentData.subjectStats.turkce.correct >= 10 },
      { id: 'english', name: 'English Master', icon: '🇬🇧', earned: studentData.subjectStats.ingilizce.correct >= 10 },
      { id: 'champion', name: 'Şampiyon', icon: '👑', earned: studentData.points >= 500 }
    ];

    const getLevelInfo = () => {
      if (studentData.points < 100) return { level: 'Bronz', color: 'text-orange-600' };
      if (studentData.points < 300) return { level: 'Gümüş', color: 'text-gray-500' };
      if (studentData.points < 600) return { level: 'Altın', color: 'text-yellow-500' };
      if (studentData.points < 1000) return { level: 'Platin', color: 'text-cyan-500' };
      return { level: 'Elmas', color: 'text-purple-600' };
    };

    const levelInfo = getLevelInfo();

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto p-6">
          <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Merhaba {studentData.name}</h1>
                <p className="text-gray-600">Bugün ne öğrenmek istersin?</p>
              </div>
              <button
                onClick={() => { setView('welcome'); setUserType(null); }}
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
              >
                Çıkış
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
                <p className={`text-3xl font-bold ${levelInfo.color}`}>{levelInfo.level}</p>
              </div>

              <div className="bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-6 h-6" />
                  <span className="font-bold">Rozetler</span>
                </div>
                <p className="text-3xl font-bold">{badges.filter(b => b.earned).length}/6</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {subjects.map(subject => (
              <button
                key={subject.id}
                onClick={() => startQuiz(subject.id)}
                className={`bg-gradient-to-r ${subject.color} rounded-3xl p-8 text-white hover:shadow-2xl transform hover:scale-105 transition`}
              >
                <div className="text-6xl mb-4">{subject.emoji}</div>
                <h3 className="text-2xl font-bold mb-2">{subject.name}</h3>
                <div className="bg-white bg-opacity-20 rounded-xl p-2">
                  <p className="text-sm">
                    Doğru: {studentData.subjectStats[subject.id as keyof typeof studentData.subjectStats].correct} / Toplam: {studentData.subjectStats[subject.id as keyof typeof studentData.subjectStats].total}
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
              {badges.map(badge => (
                <div
                  key={badge.id}
                  className={`p-4 rounded-2xl text-center transition ${badge.earned
                      ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-yellow-400'
                      : 'bg-gray-100 opacity-50'
                    }`}
                >
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <p className="font-bold text-sm text-gray-700">{badge.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'quiz' && currentSubject) {
    const questions = allQuestions[currentSubject as keyof typeof allQuestions];
    const currentQuestion = questions[currentQ];

    if (quizComplete) {
      const percentage = Math.round((score / questions.length) * 100);
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-4">
              {percentage >= 80 ? '🎉' : percentage >= 60 ? '👏' : '💪'}
            </div>
            <h2 className="text-3xl font-bold mb-4">Tebrikler</h2>
            <p className="text-xl mb-6">
              {questions.length} sorudan <span className="text-green-600 font-bold">{score}</span> doğru
            </p>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-4 mb-6">
              <p className="text-lg font-bold">+{score * 20} Puan Kazandın</p>
            </div>
            <button
              onClick={() => setView('dashboard')}
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
                onClick={() => setView('dashboard')}
                className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
              >
                Geri
              </button>
              <div className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-500" />
                <span className="font-bold">Soru {currentQ + 1}/{questions.length}</span>
              </div>
            </div>

            <div className="mb-8">
              <div className="bg-gray-200 rounded-full h-3 mb-6">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                />
              </div>

              <h3 className="text-2xl font-bold mb-8 text-gray-800">{currentQuestion.q}</h3>

              <div className="space-y-3">
                {currentQuestion.a.map((answer: string, index: number) => {
                  let bgColor = 'bg-gray-100 hover:bg-gray-200';
                  if (answered) {
                    if (index === currentQuestion.c) {
                      bgColor = 'bg-green-500 text-white';
                    } else if (index === selectedAnswer) {
                      bgColor = 'bg-red-500 text-white';
                    }
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={answered}
                      className={`w-full p-4 rounded-xl font-bold text-left transition ${bgColor} ${!answered ? 'transform hover:scale-105 cursor-pointer' : 'cursor-not-allowed'
                        }`}
                    >
                      {answer}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'parent-dashboard') {
    const getSuccessRate = (subject: string) => {
      const stats = studentData.subjectStats[subject as keyof typeof studentData.subjectStats];
      if (stats.total === 0) return 0;
      return Math.round((stats.correct / stats.total) * 100);
    };

    const resetData = async () => {
      if (confirm('Tüm ilerleme kaydedilecek ve sıfırlanacak. Emin misiniz?')) {
        const freshData = {
          name: studentData.name,
          points: 0,
          level: 1,
          badges: [],
          completedActivities: [],
          dailyStats: {},
          subjectStats: {
            matematik: { correct: 0, total: 0 },
            fen: { correct: 0, total: 0 },
            turkce: { correct: 0, total: 0 },
            ingilizce: { correct: 0, total: 0 }
          }
        };
        await saveData(freshData);
        alert('Veriler sıfırlandı!');
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Veli Paneli</h1>
                <p className="text-gray-600">{studentData.name} - İlerleme Raporu</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={resetData}
                  className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition"
                >
                  Verileri Sıfırla
                </button>
                <button
                  onClick={() => { setView('welcome'); setUserType(null); }}
                  className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
                >
                  Çıkış
                </button>
              </div>
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
                {Object.values(studentData.subjectStats).reduce((sum, s) => sum + s.total, 0)}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
              <Award className="w-8 h-8 mb-2" />
              <p className="text-sm opacity-90">Genel Başarı</p>
              <p className="text-3xl font-bold">
                {Math.round(Object.keys(studentData.subjectStats).reduce((sum, key) => sum + getSuccessRate(key), 0) / 4)}%
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {['matematik', 'fen', 'turkce', 'ingilizce'].map((subject, idx) => {
              const colors = ['blue', 'green', 'purple', 'red'];
              const icons = [Calculator, Microscope, BookOpen, Award];
              const Icon = icons[idx];
              const color = colors[idx];
              const names = ['Matematik', 'Fen Bilgisi', 'Türkçe', 'İngilizce'];

              return (
                <div key={subject} className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 text-${color}-500`}>
                    <Icon className={`w-6 h-6 text-${color}-500`} />
                    {names[idx]}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Başarı</span>
                      <span className={`font-bold text-${color}-600`}>{getSuccessRate(subject)}%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div className={`bg-${color}-500 h-2 rounded-full`} style={{ width: `${getSuccessRate(subject)}%` }} />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Doğru: {studentData.subjectStats[subject as keyof typeof studentData.subjectStats].correct}</span>
                      <span className="text-gray-600">Toplam: {studentData.subjectStats[subject as keyof typeof studentData.subjectStats].total}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
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

  return null;
};

export default EduPlatform;