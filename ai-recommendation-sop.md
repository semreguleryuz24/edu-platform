# 🤖 AI Öneri Sistemi - Standard Operating Procedure (SOP)

## 📋 Proje Özeti

Eğitim platformuna entegre edilecek AI destekli kişiselleştirilmiş öneri sistemi. Claude API kullanarak öğrenci verilerini analiz edip akıllı öneriler sunar.

---

## 🎯 Sistem Gereksinimleri

### Ana Özellikler

1. **Konu Odaklama Analizi**
   - Zayıf konuları tespit etme
   - Güçlü konuları belirleme
   - Öncelik sıralaması oluşturma

2. **Optimal Quiz Zamanı Önerisi**
   - Geçmiş performans analizi
   - En verimli çalışma saatlerini bulma
   - Dikkat süresi optimizasyonu

3. **Kişiselleştirilmiş Çalışma Planı**
   - Haftalık plan oluşturma
   - Günlük hedefler
   - Düzenli tekrar programı

---

## 🏗️ Teknik Mimari

### 1. Dosya Yapısı

```
src/
├── components/
│   └── AIRecommendation/
│       ├── AIRecommendationPanel.tsx      # Ana component
│       ├── RecommendationOverview.tsx     # Genel bakış
│       ├── FocusTopics.tsx                # Konu analizi
│       ├── OptimalTiming.tsx              # Zaman önerileri
│       ├── StudyPlan.tsx                  # Çalışma planı
│       └── types.ts                       # TypeScript tipleri
├── lib/
│   ├── aiService.ts                       # Claude API servisi
│   └── dataAnalyzer.ts                    # Veri analiz fonksiyonları
└── utils/
    └── recommendations.ts                 # Yardımcı fonksiyonlar
```

### 2. Veri Modeli

```typescript
// Student Analytics Data
interface StudentAnalytics {
  name: string;
  level: number;
  points: number;
  totalQuestions: number;
  correctAnswers: number;
  
  subjectStats: {
    [subject: string]: {
      correct: number;
      total: number;
      timeSpent: number;          // saniye cinsinden
      lastStudied: string;         // ISO date
      averageSpeed: number;        // soru başına saniye
      streakDays: number;
    }
  };
  
  dailyActivity: {
    [date: string]: {
      questionsAnswered: number;
      correctAnswers: number;
      pointsEarned: number;
      timeOfDay: string;          // 'morning' | 'afternoon' | 'evening'
      performance: number;        // 0-100 başarı oranı
    }
  };
  
  weeklyPattern: {
    mostActiveDay: string;
    leastActiveDay: string;
    bestPerformanceTime: string;  // 'morning' | 'afternoon' | 'evening'
  };
}

// AI Recommendations
interface AIRecommendations {
  timestamp: string;
  
  focusTopics: {
    priority: 'high' | 'medium' | 'low';
    subject: string;
    reason: string;
    currentScore: number;
    targetScore: number;
    estimatedStudyTime: number;  // dakika
    specificTopics: string[];
  }[];
  
  optimalTiming: {
    bestStudyTimes: {
      day: string;
      timeSlot: string;
      reason: string;
      expectedPerformance: number;
    }[];
    breakRecommendations: {
      duration: number;           // dakika
      frequency: string;
    };
    sessionLength: number;        // dakika
  };
  
  studyPlan: {
    week: number;
    days: {
      day: string;
      date: string;
      sessions: {
        time: string;
        subject: string;
        topics: string[];
        duration: number;
        goalQuestions: number;
        type: 'learn' | 'practice' | 'review';
      }[];
      dailyGoal: string;
    }[];
    weeklyGoal: string;
    milestones: string[];
  };
  
  insights: {
    strengths: string[];
    improvements: string[];
    motivationalMessage: string;
    nextAchievement: string;
  };
}
```

---

## 💻 Implementasyon Adımları

### ADIM 1: Claude API Servisi Oluşturma

**Dosya:** `src/lib/aiService.ts`

```typescript
/**
 * Claude API ile iletişim için servis
 * 
 * Önemli: API key'i .env.local dosyasına ekleyin:
 * NEXT_PUBLIC_ANTHROPIC_API_KEY=your_api_key_here
 */

interface AnalyzeStudentParams {
  studentData: StudentAnalytics;
  requestType: 'full' | 'topics' | 'timing' | 'plan';
}

export async function analyzeStudentPerformance(
  params: AnalyzeStudentParams
): Promise<AIRecommendations> {
  
  // 1. Student data'yı analiz için hazırla
  const analysisPrompt = generateAnalysisPrompt(params);
  
  // 2. Claude API'ye istek gönder
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: analysisPrompt
        }
      ]
    })
  });
  
  // 3. Response'u parse et
  const data = await response.json();
  const aiResponse = data.content[0].text;
  
  // 4. JSON olarak parse et ve döndür
  const recommendations = parseAIResponse(aiResponse);
  
  return recommendations;
}

function generateAnalysisPrompt(params: AnalyzeStudentParams): string {
  const { studentData, requestType } = params;
  
  // Öğrenci verilerini özetle
  const summary = {
    genel: {
      isim: studentData.name,
      seviye: studentData.level,
      toplamSoru: studentData.totalQuestions,
      dogruCevap: studentData.correctAnswers,
      basariOrani: Math.round((studentData.correctAnswers / studentData.totalQuestions) * 100)
    },
    dersler: studentData.subjectStats,
    gunlukAktivite: studentData.dailyActivity,
    haftalikDesen: studentData.weeklyPattern
  };
  
  const basePrompt = `
Sen bir eğitim uzmanı AI asistanısın. Türkiye'deki ilkokul öğrencileri için kişiselleştirilmiş öğrenme önerileri sunuyorsun.

ÖĞRENCİ VERİLERİ:
${JSON.stringify(summary, null, 2)}

GÖREV: Bu öğrenci için ${requestType === 'full' ? 'detaylı analiz ve tüm öneriler' : requestType} hazırla.

ÖNEMLI KURALLAR:
1. Türkçe yanıt ver
2. Pozitif ve motive edici ol
3. Yaşa uygun dil kullan (7-12 yaş)
4. Somut ve uygulanabilir öneriler sun
5. SADECE JSON formatında yanıt ver, başka açıklama ekleme

JSON YAPISI:
{
  "focusTopics": [
    {
      "priority": "high/medium/low",
      "subject": "ders adı",
      "reason": "neden bu derse odaklanmalı",
      "currentScore": mevcut başarı oranı,
      "targetScore": hedef başarı oranı,
      "estimatedStudyTime": tahmini çalışma süresi (dakika),
      "specificTopics": ["konu1", "konu2"]
    }
  ],
  "optimalTiming": {
    "bestStudyTimes": [
      {
        "day": "gün adı",
        "timeSlot": "sabah/öğleden sonra/akşam",
        "reason": "neden bu saat",
        "expectedPerformance": beklenen başarı %
      }
    ],
    "breakRecommendations": {
      "duration": mola süresi (dakika),
      "frequency": "kaç dakikada bir"
    },
    "sessionLength": ideal çalışma süresi (dakika)
  },
  "studyPlan": {
    "week": hafta numarası,
    "days": [
      {
        "day": "Pazartesi",
        "date": "2026-01-27",
        "sessions": [
          {
            "time": "16:00",
            "subject": "Matematik",
            "topics": ["toplama", "çıkarma"],
            "duration": 30,
            "goalQuestions": 10,
            "type": "practice"
          }
        ],
        "dailyGoal": "günlük hedef"
      }
    ],
    "weeklyGoal": "haftalık hedef",
    "milestones": ["kilometre taşı 1", "kilometre taşı 2"]
  },
  "insights": {
    "strengths": ["güçlü yön 1", "güçlü yön 2"],
    "improvements": ["gelişim alanı 1", "gelişim alanı 2"],
    "motivationalMessage": "motive edici mesaj",
    "nextAchievement": "bir sonraki başarı hedefi"
  }
}
`;

  return basePrompt;
}

function parseAIResponse(response: string): AIRecommendations {
  // JSON'ı bul ve parse et
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('AI response JSON formatında değil');
  }
  
  try {
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    throw new Error('JSON parse hatası: ' + error.message);
  }
}
```

---

### ADIM 2: Veri Analiz Fonksiyonları

**Dosya:** `src/lib/dataAnalyzer.ts`

```typescript
/**
 * Firebase'den gelen öğrenci verisini analiz eder
 * ve AI için hazır hale getirir
 */

export function prepareStudentDataForAI(firebaseData: any): StudentAnalytics {
  // Firebase'den gelen veriyi dönüştür
  
  const subjectStats = {};
  for (const [subject, stats] of Object.entries(firebaseData.subjectStats || {})) {
    const s = stats as any;
    subjectStats[subject] = {
      correct: s.correct || 0,
      total: s.total || 0,
      timeSpent: s.timeSpent || 0,
      lastStudied: s.lastStudied || new Date().toISOString(),
      averageSpeed: s.total > 0 ? s.timeSpent / s.total : 0,
      streakDays: calculateStreak(firebaseData.dailyStats, subject)
    };
  }
  
  // Günlük aktivite analizi
  const dailyActivity = {};
  for (const [date, stats] of Object.entries(firebaseData.dailyStats || {})) {
    const s = stats as any;
    const hour = new Date(date).getHours();
    const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
    
    dailyActivity[date] = {
      questionsAnswered: s.questionsAnswered || 0,
      correctAnswers: s.correctAnswers || 0,
      pointsEarned: s.pointsEarned || 0,
      timeOfDay,
      performance: s.questionsAnswered > 0 
        ? Math.round((s.correctAnswers / s.questionsAnswered) * 100)
        : 0
    };
  }
  
  // Haftalık pattern analizi
  const weeklyPattern = analyzeWeeklyPattern(dailyActivity);
  
  return {
    name: firebaseData.name,
    level: firebaseData.level,
    points: firebaseData.points,
    totalQuestions: Object.values(subjectStats).reduce((sum: number, s: any) => sum + s.total, 0),
    correctAnswers: Object.values(subjectStats).reduce((sum: number, s: any) => sum + s.correct, 0),
    subjectStats,
    dailyActivity,
    weeklyPattern
  };
}

function calculateStreak(dailyStats: any, subject?: string): number {
  // Son 7 günü kontrol et
  let streak = 0;
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    if (dailyStats[dateStr] && dailyStats[dateStr].questionsAnswered > 0) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

function analyzeWeeklyPattern(dailyActivity: any) {
  const dayPerformance: { [key: string]: { count: number; avgPerformance: number } } = {};
  const timePerformance: { [key: string]: { count: number; avgPerformance: number } } = {};
  
  for (const [date, stats] of Object.entries(dailyActivity)) {
    const s = stats as any;
    const dayOfWeek = new Date(date).toLocaleDateString('tr-TR', { weekday: 'long' });
    const timeOfDay = s.timeOfDay;
    
    // Gün bazlı analiz
    if (!dayPerformance[dayOfWeek]) {
      dayPerformance[dayOfWeek] = { count: 0, avgPerformance: 0 };
    }
    dayPerformance[dayOfWeek].count++;
    dayPerformance[dayOfWeek].avgPerformance += s.performance;
    
    // Saat bazlı analiz
    if (!timePerformance[timeOfDay]) {
      timePerformance[timeOfDay] = { count: 0, avgPerformance: 0 };
    }
    timePerformance[timeOfDay].count++;
    timePerformance[timeOfDay].avgPerformance += s.performance;
  }
  
  // Ortalamaları hesapla
  for (const day in dayPerformance) {
    dayPerformance[day].avgPerformance /= dayPerformance[day].count;
  }
  for (const time in timePerformance) {
    timePerformance[time].avgPerformance /= timePerformance[time].count;
  }
  
  // En iyi ve en kötü günleri bul
  const sortedDays = Object.entries(dayPerformance)
    .sort((a, b) => b[1].count - a[1].count);
  
  const sortedTimes = Object.entries(timePerformance)
    .sort((a, b) => b[1].avgPerformance - a[1].avgPerformance);
  
  return {
    mostActiveDay: sortedDays[0]?.[0] || 'Bilinmiyor',
    leastActiveDay: sortedDays[sortedDays.length - 1]?.[0] || 'Bilinmiyor',
    bestPerformanceTime: sortedTimes[0]?.[0] || 'afternoon'
  };
}
```

---

### ADIM 3: Ana Component - AI Öneri Paneli

**Dosya:** `src/components/AIRecommendation/AIRecommendationPanel.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import { Brain, Loader2 } from 'lucide-react';
import { analyzeStudentPerformance } from '@/lib/aiService';
import { prepareStudentDataForAI } from '@/lib/dataAnalyzer';
import RecommendationOverview from './RecommendationOverview';
import FocusTopics from './FocusTopics';
import OptimalTiming from './OptimalTiming';
import StudyPlan from './StudyPlan';

interface AIRecommendationPanelProps {
  studentData: any; // Firebase'den gelen öğrenci verisi
}

export default function AIRecommendationPanel({ studentData }: AIRecommendationPanelProps) {
  const [recommendations, setRecommendations] = useState<AIRecommendations | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'topics' | 'timing' | 'plan'>('overview');
  
  // İlk yüklemede analiz yap
  useEffect(() => {
    if (studentData && !recommendations) {
      generateRecommendations('full');
    }
  }, [studentData]);
  
  const generateRecommendations = async (type: 'full' | 'topics' | 'timing' | 'plan') => {
    setLoading(true);
    setError(null);
    
    try {
      // Firebase verisini AI için hazırla
      const analyticsData = prepareStudentDataForAI(studentData);
      
      // AI analizi yap
      const aiRecommendations = await analyzeStudentPerformance({
        studentData: analyticsData,
        requestType: type
      });
      
      setRecommendations(aiRecommendations);
      
      // Sonuçları Firebase'e kaydet (opsiyonel)
      // await saveRecommendationsToFirebase(aiRecommendations);
      
    } catch (err) {
      setError('AI analizi yapılırken hata oluştu. Lütfen tekrar deneyin.');
      console.error('AI Analysis Error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const tabs = [
    { id: 'overview', label: 'Genel Bakış', icon: Brain },
    { id: 'topics', label: 'Odaklanılacak Konular', icon: Target },
    { id: 'timing', label: 'Optimal Zamanlar', icon: Clock },
    { id: 'plan', label: 'Çalışma Planı', icon: Calendar }
  ];
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-10 h-10" />
            <div>
              <h1 className="text-2xl font-bold">AI Öğrenme Asistanı</h1>
              <p className="text-purple-100">Kişiselleştirilmiş öneriler ve analiz</p>
            </div>
          </div>
          
          <button
            onClick={() => generateRecommendations('full')}
            disabled={loading}
            className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analiz Ediliyor...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Yeniden Analiz Et
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
            </button>
          );
        })}
      </div>
      
      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg p-12 text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600 text-lg">AI analiziniz hazırlanıyor...</p>
          <p className="text-gray-500 text-sm mt-2">Bu birkaç saniye sürebilir</p>
        </div>
      )}
      
      {/* Content */}
      {!loading && recommendations && (
        <div className="bg-white rounded-lg shadow-lg">
          {activeTab === 'overview' && <RecommendationOverview data={recommendations} />}
          {activeTab === 'topics' && <FocusTopics data={recommendations.focusTopics} />}
          {activeTab === 'timing' && <OptimalTiming data={recommendations.optimalTiming} />}
          {activeTab === 'plan' && <StudyPlan data={recommendations.studyPlan} />}
        </div>
      )}
    </div>
  );
}
```

---

### ADIM 4: Alt Componentler

**Dosya:** `src/components/AIRecommendation/RecommendationOverview.tsx`

```typescript
import React from 'react';
import { TrendingUp, Award, Zap, Target } from 'lucide-react';

export default function RecommendationOverview({ data }: { data: AIRecommendations }) {
  return (
    <div className="p-6 space-y-6">
      {/* Motivasyon Mesajı */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg p-6 text-white">
        <div className="flex items-start gap-4">
          <Sparkles className="w-8 h-8 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-bold mb-2">Motivasyon</h3>
            <p className="text-lg">{data.insights.motivationalMessage}</p>
          </div>
        </div>
      </div>
      
      {/* Grid: Güçlü Yönler & Gelişim Alanları */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Güçlü Yönler */}
        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-bold text-green-800">Güçlü Yönlerin</h3>
          </div>
          <ul className="space-y-2">
            {data.insights.strengths.map((strength, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-green-700">{strength}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Gelişim Alanları */}
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-bold text-blue-800">Gelişim Alanların</h3>
          </div>
          <ul className="space-y-2">
            {data.insights.improvements.map((improvement, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">→</span>
                <span className="text-blue-700">{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Sonraki Başarı */}
      <div className="bg-purple-50 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <Target className="w-6 h-6 text-purple-600" />
          <div>
            <h3 className="font-bold text-purple-800">Bir Sonraki Hedefin</h3>
            <p className="text-purple-700 text-lg mt-1">{data.insights.nextAchievement}</p>
          </div>
        </div>
      </div>
      
      {/* Öncelikli Konular Özeti */}
      <div>
        <h3 className="text-xl font-bold mb-4">Öncelikli Odaklanılacak Konular</h3>
        <div className="space-y-3">
          {data.focusTopics.slice(0, 3).map((topic, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  topic.priority === 'high' ? 'bg-red-500' :
                  topic.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                <div>
                  <p className="font-semibold">{topic.subject}</p>
                  <p className="text-sm text-gray-600">{topic.reason}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Mevcut</p>
                <p className="font-bold">{topic.currentScore}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

**Dosya:** `src/components/AIRecommendation/FocusTopics.tsx`

```typescript
import React from 'react';
import { Target, Clock, TrendingUp } from 'lucide-react';

export default function FocusTopics({ data }: { data: AIRecommendations['focusTopics'] }) {
  const priorityColors = {
    high: 'bg-red-100 border-red-300 text-red-700',
    medium: 'bg-yellow-100 border-yellow-300 text-yellow-700',
    low: 'bg-green-100 border-green-300 text-green-700'
  };
  
  const priorityLabels = {
    high: 'Yüksek Öncelik',
    medium: 'Orta Öncelik',
    low: 'Düşük Öncelik'
  };
  
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-6">Odaklanılacak Konular</h2>
      
      {data.map((topic, i) => (
        <div key={i} className="border-2 rounded-lg p-6 hover:shadow-lg transition-shadow">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold">{topic.subject}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold border-2 ${priorityColors[topic.priority]}`}>
                  {priorityLabels[topic.priority]}
                </span>
              </div>
              <p className="text-gray-600">{topic.reason}</p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-sm text-blue-600 mb-1">Mevcut Başarı</p>
              <p className="text-2xl font-bold text-blue-700">{topic.currentScore}%</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-sm text-green-600 mb-1">Hedef</p>
              <p className="text-2xl font-bold text-green-700">{topic.targetScore}%</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <p className="text-sm text-purple-600 mb-1">Tahmini Süre</p>
              <p className="text-2xl font-bold text-purple-700">{topic.estimatedStudyTime}dk</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">İlerleme</span>
              <span className="font-semibold">{topic.currentScore}% / {topic.targetScore}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(topic.currentScore / topic.targetScore) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Specific Topics */}
          <div>
            <p className="font-semibold mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Çalışılacak Alt Konular:
            </p>
            <div className="flex flex-wrap gap-2">
              {topic.specificTopics.map((t, j) => (
                <span key={j} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

**Dosya:** `src/components/AIRecommendation/OptimalTiming.tsx`

```typescript
import React from 'react';
import { Clock, Coffee, Zap } from 'lucide-react';

export default function OptimalTiming({ data }: { data: AIRecommendations['optimalTiming'] }) {
  const dayColors = ['bg-red-100', 'bg-orange-100', 'bg-yellow-100', 'bg-green-100', 'bg-blue-100', 'bg-indigo-100', 'bg-purple-100'];
  
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-6">Optimal Çalışma Zamanları</h2>
      
      {/* En İyi Çalışma Zamanları */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-6 h-6 text-yellow-500" />
          En Verimli Zamanların
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {data.bestStudyTimes.map((time, i) => (
            <div key={i} className={`${dayColors[i % dayColors.length]} rounded-lg p-5 border-2 border-gray-200`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-lg">{time.day}</p>
                  <p className="text-sm text-gray-600 capitalize">{time.timeSlot}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">{time.expectedPerformance}%</p>
                  <p className="text-xs text-gray-500">Beklenen Başarı</p>
                </div>
              </div>
              <p className="text-sm text-gray-700">{time.reason}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* İdeal Seans Süresi */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-6 text-white">
        <div className="flex items-center gap-4">
          <Clock className="w-12 h-12" />
          <div>
            <p className="text-sm opacity-90">İdeal Çalışma Süresi</p>
            <p className="text-4xl font-bold">{data.sessionLength} dakika</p>
            <p className="text-sm mt-2 opacity-90">Bu süre senin dikkat sürenize en uygun süre!</p>
          </div>
        </div>
      </div>
      
      {/* Mola Önerileri */}
      <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
        <div className="flex items-start gap-4">
          <Coffee className="w-8 h-8 text-green-600 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-bold text-green-800 mb-2">Mola Önerileri</h3>
            <div className="space-y-2">
              <p className="text-green-700">
                <span className="font-semibold">Mola Süresi:</span> {data.breakRecommendations.duration} dakika
              </p>
              <p className="text-green-700">
                <span className="font-semibold">Ne Sıklıkla:</span> {data.breakRecommendations.frequency}
              </p>
              <p className="text-sm text-green-600 mt-3 bg-white p-3 rounded">
                💡 İpucu: Molalarda ekrandan uzaklaş, biraz hareket et veya su iç!
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Haftalık Görünüm */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Haftalık Çalışma Haritası</h3>
        <div className="grid grid-cols-7 gap-2">
          {data.bestStudyTimes.map((time, i) => (
            <div key={i} className="text-center">
              <div className={`${dayColors[i % dayColors.length]} rounded-lg p-3 mb-2`}>
                <p className="text-xs font-semibold mb-1">{time.day.slice(0, 3)}</p>
                <p className="text-2xl font-bold text-green-600">{time.expectedPerformance}%</p>
              </div>
              <p className="text-xs text-gray-500 capitalize">{time.timeSlot}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

**Dosya:** `src/components/AIRecommendation/StudyPlan.tsx`

```typescript
import React from 'react';
import { Calendar, BookOpen, Target, Award } from 'lucide-react';

export default function StudyPlan({ data }: { data: AIRecommendations['studyPlan'] }) {
  const typeColors = {
    learn: 'bg-blue-100 text-blue-700 border-blue-300',
    practice: 'bg-green-100 text-green-700 border-green-300',
    review: 'bg-purple-100 text-purple-700 border-purple-300'
  };
  
  const typeLabels = {
    learn: '📖 Öğren',
    practice: '✏️ Pratik',
    review: '🔄 Tekrar'
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Kişisel Çalışma Planın</h2>
        <div className="bg-purple-100 px-4 py-2 rounded-lg">
          <p className="text-sm text-purple-600">Hafta {data.week}</p>
        </div>
      </div>
      
      {/* Haftalık Hedef */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg p-6 text-white">
        <div className="flex items-center gap-3">
          <Award className="w-8 h-8" />
          <div>
            <p className="text-sm opacity-90">Bu Haftanın Hedefi</p>
            <p className="text-xl font-bold">{data.weeklyGoal}</p>
          </div>
        </div>
      </div>
      
      {/* Günlük Plan */}
      <div className="space-y-4">
        {data.days.map((day, i) => (
          <div key={i} className="border-2 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            {/* Gün Header */}
            <div className="bg-gray-100 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-bold text-lg">{day.day}</p>
                  <p className="text-sm text-gray-600">{day.date}</p>
                </div>
              </div>
              <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {day.sessions.length} Seans
              </div>
            </div>
            
            {/* Seanslar */}
            <div className="p-4 space-y-3">
              {day.sessions.map((session, j) => (
                <div key={j} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-center min-w-16">
                    <p className="text-lg font-bold text-purple-600">{session.time}</p>
                    <p className="text-xs text-gray-500">{session.duration}dk</p>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-gray-600" />
                      <p className="font-semibold">{session.subject}</p>
                      <span className={`px-2 py-1 rounded text-xs font-semibold border ${typeColors[session.type]}`}>
                        {typeLabels[session.type]}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-2">
                      {session.topics.map((topic, k) => (
                        <span key={k} className="text-sm bg-white px-2 py-1 rounded border">
                          {topic}
                        </span>
                      ))}
                    </div>
                    
                    <p className="text-sm text-gray-600">
                      🎯 Hedef: {session.goalQuestions} soru çöz
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Günlük Hedef */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 mt-3">
                <p className="text-sm text-blue-600 font-semibold">📌 Günlük Hedef:</p>
                <p className="text-blue-700">{day.dailyGoal}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Kilometre Taşları */}
      <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
        <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
          <Target className="w-6 h-6" />
          Haftalık Kilometre Taşları
        </h3>
        <div className="space-y-2">
          {data.milestones.map((milestone, i) => (
            <div key={i} className="flex items-center gap-3 p-2">
              <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold">
                {i + 1}
              </div>
              <p className="text-green-700">{milestone}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

### ADIM 5: Firebase Entegrasyonu

**Dosya:** `src/pages/index.tsx` içine eklenecek

```typescript
// ... mevcut importlar

// AI Recommendation import
import AIRecommendationPanel from '@/components/AIRecommendation/AIRecommendationPanel';

// ... mevcut kod

// Ana component içinde yeni state
const [showAIRecommendations, setShowAIRecommendations] = useState(false);

// Öğrenci panelinde AI butonu ekle
{view === 'student' && !selectedSubject && (
  <div className="space-y-4">
    {/* ... mevcut butonlar ... */}
    
    {/* AI Recommendations Button */}
    <button
      onClick={() => setShowAIRecommendations(true)}
      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl hover:shadow-xl transition-all flex items-center justify-between group"
    >
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
          <Brain className="w-8 h-8 text-purple-600" />
        </div>
        <div className="text-left">
          <h3 className="text-xl font-bold">AI Öğrenme Asistanı</h3>
          <p className="text-purple-100">Kişisel öneriler ve analiz</p>
        </div>
      </div>
      <Sparkles className="w-8 h-8" />
    </button>
  </div>
)}

// AI Recommendations Modal/Panel
{showAIRecommendations && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
    <div className="bg-white rounded-2xl max-w-6xl w-full max-h-screen overflow-y-auto">
      <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">AI Öğrenme Asistanı</h2>
        <button
          onClick={() => setShowAIRecommendations(false)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      <AIRecommendationPanel studentData={studentData} />
    </div>
  </div>
)}
```

---

### ADIM 6: Environment Variables

**Dosya:** `.env.local`

```.env
# Mevcut Firebase config
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Yeni: Anthropic API Key
# NOT: Bu key'i şuradan alabilirsiniz: https://console.anthropic.com/
# ÖNEMLE: Bu key'i asla git'e push etmeyin!
NEXT_PUBLIC_ANTHROPIC_API_KEY=sk-ant-...
```

---

## 🧪 Test Senaryoları

### Test 1: Temel Analiz
```bash
1. Öğrenci paneline gir
2. "AI Öğrenme Asistanı" butonuna tıkla
3. Analiz tamamlanmasını bekle
4. "Genel Bakış" sekmesinde önerileri kontrol et
```

**Beklenen Sonuç:**
- Motivasyon mesajı görünmeli
- Güçlü yönler ve gelişim alanları listelenmiş olmalı
- Sonraki hedef gösterilmeli

### Test 2: Konu Odaklama
```bash
1. "Odaklanılacak Konular" sekmesine geç
2. Konuların öncelik sırasına göre listelendiğini kontrol et
3. Her konu için ilerleme çubuğunu kontrol et
```

**Beklenen Sonuç:**
- Yüksek öncelikli konular üstte olmalı
- İlerleme çubukları doğru hesaplanmış olmalı
- Alt konular listelenmiş olmalı

### Test 3: Optimal Zamanlama
```bash
1. "Optimal Zamanlar" sekmesine geç
2. En iyi çalışma zamanlarını kontrol et
3. Mola önerilerini incele
```

**Beklenen Sonuç:**
- Günlük performans verisine göre öneriler olmalı
- İdeal seans süresi gösterilmeli
- Mola süresi ve sıklığı belirtilmiş olmalı

### Test 4: Çalışma Planı
```bash
1. "Çalışma Planı" sekmesine geç
2. Haftalık planı incele
3. Her günün detaylarını kontrol et
```

**Beklenen Sonuç:**
- 7 günlük plan olmalı
- Her gün için seanslar tanımlanmış olmalı
- Haftalık hedef ve kilometre taşları gösterilmeli

---

## 🔒 Güvenlik Kontrolleri

### API Key Güvenliği
```typescript
// ❌ YANLIŞ - Client-side'da API key kullanmayın
const apiKey = 'sk-ant-api123456';

// ✅ DOĞRU - Environment variable kullanın
const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;

// ✅ DAHA İYİ - API Route üzerinden
// pages/api/analyze.ts oluşturun ve oradan çağırın
```

### Rate Limiting
```typescript
// API çağrılarını sınırlandır
let lastCallTime = 0;
const MINIMUM_INTERVAL = 60000; // 1 dakika

async function analyzeWithRateLimit() {
  const now = Date.now();
  if (now - lastCallTime < MINIMUM_INTERVAL) {
    throw new Error('Çok sık analiz yapılamaz. Lütfen bekleyin.');
  }
  lastCallTime = now;
  
  return await analyzeStudentPerformance(...);
}
```

---

## 📊 Performans Optimizasyonu

### 1. Caching Stratejisi
```typescript
// Sonuçları localStorage'da sakla
const CACHE_DURATION = 3600000; // 1 saat

function cacheRecommendations(recommendations: AIRecommendations) {
  localStorage.setItem('ai_recommendations', JSON.stringify({
    data: recommendations,
    timestamp: Date.now()
  }));
}

function getCachedRecommendations(): AIRecommendations | null {
  const cached = localStorage.getItem('ai_recommendations');
  if (!cached) return null;
  
  const { data, timestamp } = JSON.parse(cached);
  if (Date.now() - timestamp > CACHE_DURATION) {
    return null; // Cache expired
  }
  
  return data;
}
```

### 2. Loading States
```typescript
// Kullanıcıya ilerleme göster
const [analysisStage, setAnalysisStage] = useState<string>('');

async function analyzeWithProgress() {
  setAnalysisStage('Verileriniz hazırlanıyor...');
  const data = await prepareStudentDataForAI(studentData);
  
  setAnalysisStage('AI analizi yapılıyor...');
  const recommendations = await analyzeStudentPerformance({...});
  
  setAnalysisStage('Öneriler oluşturuluyor...');
  // ...
}
```

---

## 🐛 Hata Yönetimi

### Yaygın Hatalar ve Çözümleri

**1. API Key Hatası**
```
Error: Invalid API Key
Çözüm: .env.local dosyasında NEXT_PUBLIC_ANTHROPIC_API_KEY kontrol edin
```

**2. JSON Parse Hatası**
```
Error: JSON parse hatası
Çözüm: AI'ın döndürdüğü yanıtı kontrol edin, regex pattern güncelleyin
```

**3. Rate Limit Hatası**
```
Error: Rate limit exceeded
Çözüm: Caching implementasyonu ekleyin veya API plan'ınızı yükseltin
```

**4. Firebase Connection Hatası**
```
Error: Firebase connection failed
Çözüm: Firebase config'i kontrol edin, internet bağlantısını doğrulayın
```

---

## 📈 Başarı Metrikleri

AI sisteminin başarısını ölçmek için:

1. **Kullanım Oranı**
   - Kaç öğrenci AI önerilerini kullanıyor
   - Günlük/haftalık kullanım sayısı

2. **Öneri Kalitesi**
   - Önerilen konularda başarı artışı
   - Önerilen zamanlarda performans değişimi

3. **Engagement**
   - Önerilere uyum oranı
   - Planlanmış seansları tamamlama

4. **Akademik İlerleme**
   - AI kullanımı öncesi/sonrası başarı karşılaştırması
   - Zayıf konularda ilerleme hızı

---

## 🚀 Deployment Checklist

- [ ] Environment variables production'da ayarlandı
- [ ] API keys güvenli şekilde saklanıyor
- [ ] Rate limiting aktif
- [ ] Error handling tüm API çağrılarında mevcut
- [ ] Loading states kullanıcı dostu
- [ ] Caching mekanizması çalışıyor
- [ ] Mobile responsive tasarım test edildi
- [ ] Firebase güvenlik kuralları güncellendi
- [ ] Analytics entegrasyonu yapıldı
- [ ] Performance monitoring aktif

---

## 📚 Ek Kaynaklar

- [Anthropic API Documentation](https://docs.anthropic.com/)
- [Claude Prompt Engineering](https://docs.anthropic.com/claude/docs/prompt-engineering)
- [Firebase Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

## 🤝 Destek

Sorunlarla karşılaşırsanız:
1. Console logları kontrol edin
2. Network tab'de API çağrılarını inceleyin
3. Firebase console'da data structure'ı doğrulayın
4. Error messages'ları dikkatle okuyun

---

**Son Güncelleme:** 22 Ocak 2026
**Versiyon:** 1.0.0
**Hazırlayan:** AI Eğitim Platformu Geliştirme Ekibi
          