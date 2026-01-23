// Student Analytics Data
export interface StudentAnalytics {
  name: string;
  level: number;
  points: number;
  totalQuestions: number;
  correctAnswers: number;

  subjectStats: {
    [subject: string]: {
      correct: number;
      total: number;
      timeSpent: number; // saniye cinsinden
      lastStudied: string; // ISO date
      averageSpeed: number; // soru başına saniye
      streakDays: number;
    };
  };

  dailyActivity: {
    [date: string]: {
      questionsAnswered: number;
      correctAnswers: number;
      pointsEarned: number;
      timeOfDay: string; // 'morning' | 'afternoon' | 'evening'
      performance: number; // 0-100 başarı oranı
    };
  };

  weeklyPattern: {
    mostActiveDay: string;
    leastActiveDay: string;
    bestPerformanceTime: string; // 'morning' | 'afternoon' | 'evening'
  };
}

// AI Recommendations
export interface AIRecommendations {
  timestamp: string;
  modelName: string;
  modelVersion: string;

  focusTopics: {
    priority: "high" | "medium" | "low";
    subject: string;
    reason: string;
    currentScore: number;
    targetScore: number;
    estimatedStudyTime: string;
    specificTopics: string[];
    quickWins: string[];
    studyMethod: string;
  }[];

  optimalTiming: {
    bestStudyTimes: {
      day: string;
      timeSlot: string;
      reason: string;
      expectedPerformance: string;
      energyLevel: "yüksek" | "orta" | "düşük";
    }[];
    breakRecommendations: {
      duration: string;
      frequency: string;
      breakActivities: string[];
    };
    sessionLength: string;
    weeklyDistribution: string;
  };

  studyPlan: {
    week: string;
    startDate: string;
    endDate: string;
    days: {
      day: string;
      date: string;
      sessions: {
        time: string;
        subject: string;
        topics: string[];
        duration: number;
        goalQuestions: number;
        type: "learn" | "practice" | "review" | "test";
        materials: string[];
        successCriteria: string;
      }[];
      dailyGoal: string;
      motivationalQuote: string;
    }[];
    weeklyGoal: string;
    milestones: {
      title: string;
      targetDate: string;
      reward: string;
    }[];
  };

  insights: {
    strengths: string[];
    improvements: string[];
    learningStyle: string;
    motivationalMessage: string;
    nextAchievement: string;
    parentTips: string[];
  };

  gamification: {
    currentLevel: string;
    nextLevelRequirement: string;
    badges: string[];
    streakDays: string;
  };

  parentGuide: {
    psychologicalApproach: string[];
    learningMethods: {
      title: string;
      description: string;
    }[];
    supportChecklist: string[];
  };
}
