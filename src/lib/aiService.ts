import {
  AIRecommendations,
  StudentAnalytics,
} from "../components/AIRecommendation/types";

/**
 * Gemini API ile iletişim için servis
 *
 * Önemli: API key'i .env.local dosyasına ekleyin:
 * NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
 */

interface AnalyzeStudentParams {
  studentData: StudentAnalytics;
  requestType: "full" | "topics" | "timing" | "plan";
}

async function callGeminiAPI(apiKey: string, prompt: string, model: string) {
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    return {
      ok: false,
      error: errorData.error?.message || response.statusText,
      status: response.status,
    };
  }

  const data = await response.json();
  if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
    return { ok: false, error: "Geçersiz yanıt formatı" };
  }

  return {
    ok: true,
    text: data.candidates[0].content.parts[0].text,
    model: model,
  };
}

export async function analyzeStudentPerformance(
  params: AnalyzeStudentParams,
): Promise<AIRecommendations> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Gemini API key bulunamadı.");
  }

  const prompt = generateAnalysisPrompt(params);

  // Fallback dizisi: 2026 güncel modelleri
  const models = [
    "gemini-3-pro-preview",
    "gemini-3-flash-preview",
    "gemini-2.5-pro",
    "gemini-2.5-flash",
    "gemini-2.0-flash",
  ];

  let result: any = { ok: false, error: "Hiçbir model yanıt vermedi" };

  for (const model of models) {
    console.log(`${model} deneniyor...`);
    result = await callGeminiAPI(apiKey, prompt, model);

    if (result.ok) {
      console.log(`${model} başarıyla sonuç döndürdü.`);
      break;
    }

    // Failover için geçerli hata türleri: Kota aşımı veya Modelin bulunamaması
    const isRetryableError =
      result.error?.toLowerCase().includes("quota") ||
      result.error?.toLowerCase().includes("not found") ||
      result.error?.toLowerCase().includes("not supported") ||
      result.status === 429;

    if (!isRetryableError) {
      // Eğer hata modelden bağımsız başka bir teknik sorunsa döngüyü kırabiliriz
      // Ancak stabilite için bir sonraki modeli denemeye devam ediyoruz
      console.error(`${model} hatası:`, result.error);
    } else {
      console.warn(`${model} devre dışı, sıradaki modele geçiliyor...`);
    }
  }

  if (!result.ok) {
    throw new Error(`Gemini API Hatası: ${result.error}`);
  }

  // Başarılı modeli belirle
  const successfulModel = result.model as string;
  const modelDisplayMap: Record<string, string> = {
    "gemini-3-flash-preview": "Gemini 3 Flash",
    "gemini-3-pro-preview": "Gemini 3 Pro",
    "gemini-2.0-flash": "Gemini 2.0 Flash",
    "gemini-2.5-flash": "Gemini 2.5 Flash",
    "gemini-2.5-pro": "Gemini 2.5 Pro",
  };

  const aiResponse = result.text as string;

  // 4. JSON olarak parse et ve döndür
  try {
    const rawText = aiResponse.trim();
    // JSON'ı parse etmeye çalış
    const recommendations = JSON.parse(rawText);

    return {
      ...recommendations,
      timestamp: new Date().toISOString(),
      modelName: modelDisplayMap[successfulModel] || successfulModel,
      modelVersion: successfulModel,
    };
  } catch (error) {
    console.warn(
      "Standart JSON parse başarısız oldu, gelişmiş temizleme deneniyor...",
    );
    try {
      const recommendations = parseAIResponse(aiResponse);
      return {
        ...recommendations,
        timestamp: new Date().toISOString(),
        modelName: modelDisplayMap[successfulModel] || successfulModel,
        modelVersion: successfulModel,
      };
    } catch (parseError: any) {
      console.error("AI Yanıtı Parse Edilemedi. Yanıt:", aiResponse);
      // Eğer API hatası değil de teknik bir parse hatası ise daha temiz bir mesaj verelim
      throw new Error(
        "AI yanıtı işlenirken bir sorun oluştu. Lütfen tekrar deneyin veya internet bağlantınızı kontrol edin.",
      );
    }
  }
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
      basariOrani:
        studentData.totalQuestions > 0
          ? Math.round(
              (studentData.correctAnswers / studentData.totalQuestions) * 100,
            )
          : 0,
    },
    dersler: studentData.subjectStats,
    gunlukAktivite: studentData.dailyActivity,
    haftalikDesen: studentData.weeklyPattern,
  };

  const basePrompt = `
Sen deneyimli bir eğitim psikoloğu ve öğrenme analisti AI asistanısın. Türkiye'deki 6. sınıf öğrenciler için KİŞİSELLEŞTİRİLMİŞ, BİLİMSEL TEMELLI öğrenme önerileri sunuyorsun.

ÖĞRENCİ VERİLERİ:
${JSON.stringify(summary, null, 2)}

ANALİZ KRİTERLERİ:
- Öğrencinin ${studentData.level}. sınıf seviyesi
- Yaş grubu: 11-14 yaş (bilişsel gelişim özellikleri dikkate alınmalı)
- Başarı trendlerine ve tutarlılığa özel dikkat et

GÖREV: ${requestType === "full" ? "Kapsamlı analiz ve haftalık detaylı öğrenme planı" : requestType} hazırla.

ÖNEMLİ İLKELER:
1. 🎯 POZITIF PSİKOLOJİ: Güçlü yönlerden başla.
2. 💪 MOTIVE EDICI DİL: "Henüz geliştiriyorsun" yaklaşımı.
3. 📊 VERİYE DAYALI: Somut verilere dayan.
4. 🎮 OYUNLAŞTIRMA: Hedefleri başarılabilir küçük adımlara böl.
5. 🧠 BİLİMSEL: Pomodoro ve Spaced Repetition kullan.
6. 📝 KISA VE ÖZ: Açıklamaları 1-2 cümlede tut, JSON'un çok uzun olmamasına dikkat et.

JSON ÇIKTI FORMATI:
{
  "focusTopics": [
    {
      "priority": "high",
      "subject": "Ders Adı",
      "reason": "Kısa veri temelli neden",
      "currentScore": 0,
      "targetScore": 0,
      "estimatedStudyTime": "Haftalık ... dk",
      "specificTopics": ["Konu 1"],
      "quickWins": ["Kolay Konu"],
      "studyMethod": "Yöntem"
    }
  ],
  "optimalTiming": {
    "bestStudyTimes": [
      {
        "day": "Gün",
        "timeSlot": "sabah | öğleden sonra | akşam",
        "reason": "Neden",
        "expectedPerformance": "%...",
        "energyLevel": "yüksek"
      }
    ],
    "breakRecommendations": { "duration": "...", "frequency": "...", "breakActivities": ["..."] },
    "sessionLength": "... dk",
    "weeklyDistribution": "..."
  },
  "studyPlan": {
    "week": "...",
    "startDate": "YYYY-MM-DD",
    "endDate": "YYYY-MM-DD",
    "days": [
      {
        "day": "Pazartesi",
        "date": "YYYY-MM-DD",
        "sessions": [
          {
            "time": "...",
            "subject": "...",
            "topics": ["..."],
            "duration": 30,
            "goalQuestions": 10,
            "type": "learn",
            "materials": ["..."],
            "successCriteria": "..."
          }
        ],
        "dailyGoal": "...",
        "motivationalQuote": "..."
      }
    ],
    "weeklyGoal": "...",
    "milestones": [{ "title": "...", "targetDate": "YYYY-MM-DD", "reward": "..." }]
  },
  "insights": {
    "strengths": ["..."],
    "improvements": ["..."],
    "learningStyle": "...",
    "motivationalMessage": "...",
    "nextAchievement": "...",
    "parentTips": ["..."]
  },
  "gamification": {
    "currentLevel": "...",
    "nextLevelRequirement": "...",
    "badges": ["..."],
    "streakDays": "..."
  },
  "parentGuide": {
    "psychologicalApproach": ["..."],
    "learningMethods": [
      { "title": "...", "description": "..." }
    ],
    "supportChecklist": ["..."]
  }
}

✓ SADECE GEÇERLİ JSON. EKSTRA METİN YOK.
✓ TÜM ALANLARI DOLDUR.
`;

  return basePrompt;
}

function parseAIResponse(response: string): AIRecommendations {
  // 1. Markdown temizle
  let clean = response.replace(/```json\s?|\s?```/g, "").trim();

  // 2. JSON sınırlarını bul
  const start = clean.indexOf("{");
  let end = clean.lastIndexOf("}");

  if (start === -1) throw new Error("JSON bulunamadı");

  // Eğer JSON kesilmişse bulabildiğimiz sonuna kadar alalım
  if (end < start) end = clean.length;
  clean = clean.substring(start, end + 1);

  // 3. String içindeki yeni satırları temizle
  clean = clean.replace(/"([^"]*)"/g, (match) => {
    return match.replace(/\n/g, " ");
  });

  // 4. Trailing commas temizle
  clean = clean.replace(/,\s*([\]}])/g, "$1");

  // 5. Kesilmiş JSON'u kapatma denemesi
  const openBraces = (clean.match(/\{/g) || []).length;
  const closeBraces = (clean.match(/\}/g) || []).length;
  const openBrackets = (clean.match(/\[/g) || []).length;
  const closeBrackets = (clean.match(/\]/g) || []).length;

  if (openBraces > closeBraces) clean += "}".repeat(openBraces - closeBraces);
  if (openBrackets > closeBrackets)
    clean += "]".repeat(openBrackets - closeBrackets);

  try {
    return JSON.parse(clean);
  } catch (e: any) {
    // Son çare: Kontrol karakterlerini temizle
    const finalClean = clean.replace(/[\x00-\x1F\x7F-\x9F]/g, "");
    try {
      return JSON.parse(finalClean);
    } catch (finalError: any) {
      throw new Error(`Parse Hatası: ${finalError.message}`);
    }
  }
}
