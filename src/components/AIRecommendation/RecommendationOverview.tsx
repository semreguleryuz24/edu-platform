import {
  Award,
  Brain,
  ChevronRight,
  HeartPulse,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import { AIRecommendations } from "./types";

interface Props {
  data: AIRecommendations;
  userType: "student" | "parent" | null;
  onNavigateToPlan: () => void;
  onNavigateToParent: () => void;
}

export default function RecommendationOverview({
  data,
  userType,
  onNavigateToPlan,
  onNavigateToParent,
}: Props) {
  const { insights, focusTopics, gamification } = data;

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Motivational Header & Gamification */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-[40px] p-8 text-white shadow-xl shadow-purple-200">
          <div className="absolute top-0 right-0 -m-4 opacity-20 pointer-events-none">
            <Sparkles className="w-48 h-48 rotate-12" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3">
                <Brain className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight">
                  Kişisel Analiz Özeti
                </h3>
                <span className="text-xs font-bold uppercase tracking-widest text-white/70">
                  Öğrenme Stili: {insights.learningStyle}
                </span>
              </div>
            </div>
            <p className="text-2xl font-medium leading-relaxed max-w-2xl italic">
              "{insights.motivationalMessage}"
            </p>
          </div>
        </div>

        {/* Gamification Card */}
        <div className="bg-white rounded-[40px] p-8 border-2 border-indigo-50 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-amber-100 p-3 rounded-2xl">
              <Trophy className="w-8 h-8 text-amber-600" />
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Mevcut Seviye
              </span>
              <div className="text-2xl font-black text-gray-900">
                {gamification.currentLevel}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-gray-500">
                {gamification.nextLevelRequirement}
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                style={{ width: "65%" }}
              />
            </div>
          </div>

          <div className="flex gap-2">
            {gamification.badges.map((badge, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-black rounded-full border border-amber-100"
              >
                {badge}
              </span>
            ))}
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-full border border-indigo-100 flex items-center gap-1">
              <Star className="w-3 h-3 fill-indigo-600" />
              {gamification.streakDays}
            </span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="group bg-white rounded-[40px] p-8 border-2 border-emerald-50 shadow-sm hover:shadow-xl hover:shadow-emerald-100 transition-all duration-300">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-emerald-100 rounded-3xl p-4 group-hover:scale-110 transition-transform">
              <Award className="w-8 h-8 text-emerald-600" />
            </div>
            <h4 className="text-2xl font-black text-gray-900">
              Güçlü Yönlerin
            </h4>
          </div>
          <ul className="space-y-4">
            {insights.strengths.map((strength, i) => (
              <li
                key={i}
                className="flex items-start gap-4 p-4 rounded-[24px] bg-emerald-50/50 text-emerald-900 border border-emerald-100/50"
              >
                <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold ring-4 ring-emerald-100">
                  ✓
                </div>
                <span className="font-bold">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div className="group bg-white rounded-[40px] p-8 border-2 border-rose-50 shadow-sm hover:shadow-xl hover:shadow-rose-100 transition-all duration-300">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-rose-100 rounded-3xl p-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-8 h-8 text-rose-600" />
            </div>
            <h4 className="text-2xl font-black text-gray-900">
              Gelişim Alanların
            </h4>
          </div>
          <ul className="space-y-4">
            {insights.improvements.map((improvement, i) => (
              <li
                key={i}
                className="flex items-start gap-4 p-4 rounded-[24px] bg-rose-50/50 text-rose-900 border border-rose-100/50"
              >
                <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold ring-4 ring-rose-100">
                  →
                </div>
                <span className="font-bold">{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        className={`grid ${userType === "parent" ? "lg:grid-cols-2" : "grid-cols-1"} gap-6`}
      >
        {/* Parent Tips - Only visible to parents */}
        {userType === "parent" && (
          <div className="bg-indigo-50 border-2 border-indigo-100 rounded-[40px] p-8 relative overflow-hidden group">
            <div className="absolute bottom-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
              <Users className="w-48 h-48" />
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-indigo-600 rounded-2xl p-3 shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-black text-indigo-900">
                Veliler İçin İpuçları
              </h4>
            </div>
            <ul className="space-y-4 relative z-10">
              {insights.parentTips.map((tip, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-indigo-800 font-medium bg-white/50 backdrop-blur-sm p-4 rounded-2xl"
                >
                  <HeartPulse className="w-5 h-5 text-rose-500 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
            <button
              onClick={onNavigateToParent}
              className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 group/btn"
            >
              Detaylı Veli Rehberini Aç
              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* Next Target Card */}
        <div className="bg-white rounded-[40px] p-8 border-2 border-indigo-50 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50 -mr-24 -mt-24 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center gap-6 mb-8">
              <div className="bg-indigo-600 rounded-3xl p-6 shadow-xl shadow-indigo-200">
                <Target className="w-10 h-10 text-white" />
              </div>
              <div>
                <h4 className="text-indigo-600 font-black uppercase tracking-wider text-xs mb-1">
                  Sıradaki Hedef
                </h4>
                <p className="text-2xl font-black text-gray-900 leading-tight">
                  {insights.nextAchievement}
                </p>
              </div>
            </div>
            <button
              onClick={onNavigateToPlan}
              className="w-full py-4 bg-gray-900 hover:bg-black text-white font-black rounded-2xl transition-all hover:shadow-2xl hover:shadow-black/20 group-hover:translate-y-[-4px]"
            >
              Yol Haritasına Git
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
