import {
  AlertCircle,
  Brain,
  Calendar,
  ChevronRight,
  Clock,
  RefreshCw,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { analyzeStudentPerformance } from "../../lib/aiService";
import { prepareStudentDataForAI } from "../../lib/dataAnalyzer";
import FocusTopics from "./FocusTopics";
import OptimalTiming from "./OptimalTiming";
import ParentGuide from "./ParentGuide";
import RecommendationOverview from "./RecommendationOverview";
import StudyPlan from "./StudyPlan";
import { AIRecommendations } from "./types";

interface AIRecommendationPanelProps {
  studentData: any;
  userType: "student" | "parent" | null;
}

export default function AIRecommendationPanel({
  studentData,
  userType,
}: AIRecommendationPanelProps) {
  const [recommendations, setRecommendations] =
    useState<AIRecommendations | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "topics" | "timing" | "plan" | "parent"
  >("overview");

  useEffect(() => {
    // Önce LocalStorage'daki cache'i kontrol et
    const checkCache = () => {
      const cachedData = localStorage.getItem("ai_recommendations_cache");
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData) as AIRecommendations;
          const cacheDate = new Date(parsed.timestamp).toDateString();
          const todayDate = new Date().toDateString();

          // Eğer bugün yapılmış bir analiz varsa ve gerekli alanlar mevcutsa onu kullan
          if (
            cacheDate === todayDate &&
            parsed.gamification &&
            parsed.insights
          ) {
            console.log(
              "Bugün için önbellekte veri bulundu, API çağrısı yapılmıyor.",
            );
            setRecommendations(parsed);
            return true;
          }
        } catch (e) {
          console.error("Cache parse hatası:", e);
        }
      }
      return false;
    };

    const hasCache = checkCache();

    // Eğer cache yoksa ve her şey hazırsa otomatik başlat
    if (!hasCache && studentData && !recommendations && !loading) {
      handleGenerateRecommendations("full");
    }
  }, [studentData]);

  const handleGenerateRecommendations = async (
    type: "full" | "topics" | "timing" | "plan" = "full",
  ) => {
    setLoading(true);
    setError(null);

    try {
      const analyticsData = prepareStudentDataForAI(studentData);
      const res = await analyzeStudentPerformance({
        studentData: analyticsData,
        requestType: type,
      });

      // Sonucu hem state'e hem cache'e kaydet
      setRecommendations(res);
      localStorage.setItem("ai_recommendations_cache", JSON.stringify(res));
    } catch (err: any) {
      console.error("AI Analysis Error:", err);
      setError(err.message || "AI analizi yapılırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      id: "overview",
      label: "Genel Bakış",
      icon: Brain,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      id: "topics",
      label: "Derslerim",
      icon: Target,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
    {
      id: "timing",
      label: "Zamanlama",
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      id: "plan",
      label: "Haftalık Plan",
      icon: Calendar,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    ...(userType === "parent"
      ? [
          {
            id: "parent",
            label: "Veli Rehberi",
            icon: Users,
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
        ]
      : []),
  ];

  if (!studentData) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Premium Header */}
      <div className="relative overflow-hidden bg-white rounded-[40px] p-8 border-2 border-indigo-50 shadow-sm">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Brain className="w-64 h-64 -rotate-12" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur opacity-30 animate-pulse" />
              <div className="relative bg-indigo-600 rounded-3xl p-5 shadow-2xl shadow-indigo-200">
                <Brain className="w-12 h-12 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                AI Öğrenme Asistanı
              </h1>
              <p className="text-gray-500 font-bold text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                {recommendations?.modelName || "Gemini"} ile gelişmiş analiz
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => handleGenerateRecommendations("full")}
              disabled={loading}
              className="group relative px-8 py-4 bg-gray-900 hover:bg-black text-white rounded-3xl font-black text-lg transition-all duration-300 transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-xl shadow-gray-200"
            >
              <div className="flex items-center gap-3">
                {loading ? (
                  <RefreshCw className="w-6 h-6 animate-spin" />
                ) : (
                  <Sparkles className="w-6 h-6 text-amber-400 group-hover:scale-125 transition-transform" />
                )}
                <span>
                  {loading ? "Analiz Ediliyor..." : "Yeniden Analiz Et"}
                </span>
              </div>
              {!loading && (
                <div className="absolute top-0 left-0 w-full h-full bg-white/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-4 z-40 bg-white/80 backdrop-blur-3xl p-2 rounded-[32px] border-2 border-indigo-50/50 shadow-xl shadow-indigo-100/50 flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-[150px] flex items-center justify-center gap-3 px-6 py-4 rounded-[24px] font-black text-sm uppercase tracking-wider transition-all duration-300 ${
                isActive
                  ? "bg-gray-900 text-white shadow-lg shadow-gray-300 ring-4 ring-gray-100"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon
                className={`w-6 h-6 ${isActive ? "text-white" : tab.color}`}
              />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="relative min-h-[600px]">
        {loading ? (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-[48px] animate-in fade-in zoom-in duration-500">
            <div className="relative mb-8">
              <div className="absolute -inset-8 bg-indigo-100 rounded-full blur-3xl animate-pulse opacity-50" />
              <div className="relative w-32 h-32">
                <Brain className="w-full h-full text-indigo-600 animate-bounce" />
                <div className="absolute top-0 right-0">
                  <Sparkles className="w-8 h-8 text-amber-500 animate-spin-slow" />
                </div>
              </div>
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-2">
              Zihin Haritan Çıkarılıyor
            </h3>
            <p className="text-gray-500 font-bold text-lg">
              Performans verilerin analiz ediliyor...
            </p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border-2 border-rose-100 rounded-[40px] p-12 text-center space-y-6">
            <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto ring-8 ring-rose-50">
              <AlertCircle className="w-12 h-12 text-rose-600" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-rose-900">
                Analiz Yapılamadı
              </h3>
              <p className="text-rose-700 font-medium text-lg mt-2">{error}</p>
            </div>
            <button
              onClick={() => handleGenerateRecommendations("full")}
              className="px-8 py-4 bg-rose-600 text-white rounded-3xl font-black hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200"
            >
              Tekrar Dene
            </button>
          </div>
        ) : recommendations ? (
          <div className="bg-white rounded-[48px] border-2 border-indigo-50 shadow-2xl shadow-indigo-50/50 overflow-hidden">
            <div className="transition-all duration-500">
              {activeTab === "overview" && (
                <RecommendationOverview
                  data={recommendations}
                  userType={userType}
                  onNavigateToPlan={() => setActiveTab("plan")}
                  onNavigateToParent={() => setActiveTab("parent")}
                />
              )}
              {activeTab === "topics" && (
                <FocusTopics data={recommendations.focusTopics} />
              )}
              {activeTab === "timing" && (
                <OptimalTiming data={recommendations.optimalTiming} />
              )}
              {activeTab === "plan" && (
                <StudyPlan data={recommendations.studyPlan} />
              )}
              {activeTab === "parent" && (
                <ParentGuide data={recommendations.parentGuide} />
              )}
            </div>

            <div className="p-8 bg-gray-50 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <Clock className="w-4 h-4" />
                Son Güncelleme:{" "}
                {new Date(recommendations.timestamp).toLocaleString("tr-TR")}
              </div>
              <div className="flex items-center gap-4">
                <p className="text-xs font-bold text-gray-400 uppercase">
                  Analiz Motoru: {recommendations.modelVersion}
                </p>
                <div className="w-1 h-1 bg-gray-300 rounded-full" />
                <p className="text-xs font-bold text-gray-400 uppercase">
                  Veri Güvenliği Sağlandı
                </p>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-indigo-50 rounded-[48px] p-24 text-center space-y-8 border-4 border-dashed border-indigo-100">
            <div className="space-y-4">
              <h3 className="text-4xl font-black text-indigo-900">
                Yolculuğa Başlamaya Hazır Mısın?
              </h3>
              <p className="text-xl text-indigo-700 font-medium max-w-2xl mx-auto">
                Henüz bir analiz raporun bulunmuyor. Hemen butona basarak AI
                asistanının senin için harika bir plan oluşturmasını sağla!
              </p>
            </div>
            <button
              onClick={() => handleGenerateRecommendations("full")}
              className="px-12 py-6 bg-indigo-600 text-white rounded-full font-black text-xl hover:bg-indigo-700 transition-all transform hover:scale-110 shadow-2xl shadow-indigo-200"
            >
              Analizi Başlat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
