import { StudentAnalytics } from "../components/AIRecommendation/types";

/**
 * Platform verilerini AI analizine uygun hale getiren yardımcı servis
 */

export function prepareStudentDataForAI(studentData: any): StudentAnalytics {
  const subjectStats: StudentAnalytics["subjectStats"] = {};

  // Ana ders istatistiklerini işle
  const rawSubjectStats = studentData.subjectStats || {};
  Object.keys(rawSubjectStats).forEach((subject) => {
    const stats = rawSubjectStats[subject];
    subjectStats[subject] = {
      correct: stats.correct || 0,
      total: stats.total || 0,
      timeSpent: stats.timeSpent || 0,
      lastStudied: stats.lastStudied || new Date().toISOString(),
      averageSpeed: stats.total > 0 ? stats.timeSpent / stats.total : 0,
      streakDays: calculateStreak(studentData.dailyStats, subject),
    };
  });

  // Günlük aktiviteyi işle
  const dailyActivity: StudentAnalytics["dailyActivity"] = {};
  const rawDailyStats = studentData.dailyStats || {};

  Object.keys(rawDailyStats).forEach((date) => {
    const stats = rawDailyStats[date];
    // Tarih formatını kontrol et veya uyarla
    const d = new Date(date);
    const hour = d.getHours();

    let timeOfDay = "afternoon";
    if (hour < 12) timeOfDay = "morning";
    else if (hour > 18) timeOfDay = "evening";

    dailyActivity[date] = {
      questionsAnswered: stats.total || stats.questionsAnswered || 0,
      correctAnswers: stats.correct || stats.correctAnswers || 0,
      pointsEarned: stats.points || stats.pointsEarned || 0,
      timeOfDay,
      performance:
        (stats.total || stats.questionsAnswered) > 0
          ? Math.round(
              ((stats.correct || stats.correctAnswers) /
                (stats.total || stats.questionsAnswered)) *
                100,
            )
          : 0,
    };
  });

  // Haftalık pattern analizi
  const weeklyPattern = analyzeWeeklyPattern(dailyActivity);

  return {
    name: studentData.name || "Öğrenci",
    level: studentData.level || 1,
    points: studentData.points || 0,
    totalQuestions: Object.values(subjectStats).reduce(
      (sum, s) => sum + s.total,
      0,
    ),
    correctAnswers: Object.values(subjectStats).reduce(
      (sum, s) => sum + s.correct,
      0,
    ),
    subjectStats,
    dailyActivity,
    weeklyPattern,
  };
}

function calculateStreak(dailyStats: any, subject?: string): number {
  if (!dailyStats) return 0;

  const dates = Object.keys(dailyStats).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );
  if (dates.length === 0) return 0;

  let streak = 0;
  const today = new Date().toISOString().split("T")[0];

  // Basit bir streak hesaplama: Ardışık aktif gün sayısı
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    const stats = dailyStats[date];

    if ((stats.total || stats.questionsAnswered) > 0) {
      streak++;
    } else if (date !== today) {
      // Bugün henüz çözmemiş olabilir, ama dünü atladıysa streak bozulur
      break;
    }
  }

  return streak;
}

function analyzeWeeklyPattern(dailyActivity: any) {
  const dayPerformance: {
    [key: string]: { count: number; totalPerf: number };
  } = {};
  const timePerformance: {
    [key: string]: { count: number; totalPerf: number };
  } = {};

  Object.values(dailyActivity).forEach((stats: any, index) => {
    const dateStr = Object.keys(dailyActivity)[index];
    const date = new Date(dateStr);
    const dayName = date.toLocaleDateString("tr-TR", { weekday: "long" });
    const timeSlot = stats.timeOfDay;

    // Gün bazlı
    if (!dayPerformance[dayName])
      dayPerformance[dayName] = { count: 0, totalPerf: 0 };
    dayPerformance[dayName].count++;
    dayPerformance[dayName].totalPerf += stats.performance;

    // Zaman dilimi bazlı
    if (!timePerformance[timeSlot])
      timePerformance[timeSlot] = { count: 0, totalPerf: 0 };
    timePerformance[timeSlot].count++;
    timePerformance[timeSlot].totalPerf += stats.performance;
  });

  const days = Object.entries(dayPerformance);
  const times = Object.entries(timePerformance);

  return {
    mostActiveDay:
      days.sort((a, b) => b[1].count - a[1].count)[0]?.[0] || "Pazartesi",
    leastActiveDay:
      days.sort((a, b) => a[1].count - b[1].count)[0]?.[0] || "Pazar",
    bestPerformanceTime:
      times.sort(
        (a, b) => b[1].totalPerf / b[1].count - a[1].totalPerf / a[1].count,
      )[0]?.[0] || "afternoon",
  };
}
