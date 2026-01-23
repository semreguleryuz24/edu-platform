import {
    CloudSun,
    Coffee,
    Moon,
    Star,
    Sun,
    TrendingUp,
    Zap,
} from "lucide-react";
import { AIRecommendations } from "./types";

interface Props {
  data: AIRecommendations["optimalTiming"];
}

export default function OptimalTiming({ data }: Props) {
  const getTimeIcon = (slot: string) => {
    switch (slot.toLowerCase()) {
      case "sabah":
        return <Sun className="w-8 h-8 text-amber-500" />;
      case "öğleden sonra":
        return <CloudSun className="w-8 h-8 text-orange-500" />;
      case "akşam":
        return <Moon className="w-8 h-8 text-indigo-500" />;
      default:
        return <Star className="w-8 h-8 text-purple-500" />;
    }
  };

  const getSlotColor = (slot: string) => {
    switch (slot.toLowerCase()) {
      case "sabah":
        return "from-amber-50 to-orange-50 border-amber-100";
      case "öğleden sonra":
        return "from-orange-50 to-rose-50 border-orange-100";
      case "akşam":
        return "from-indigo-50 to-purple-50 border-indigo-100";
      default:
        return "from-purple-50 to-pink-50 border-purple-100";
    }
  };

  return (
    <div className="p-6 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-amber-100 rounded-3xl p-4 shadow-inner">
            <Zap className="w-10 h-10 text-amber-600 fill-amber-600" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-900 leading-tight">
              Zamanlama Rehberi
            </h2>
            <p className="text-gray-500 font-medium">
              Biyolojik saatine en uygun çalışma programı
            </p>
          </div>
        </div>

        {/* Quick Stats Banner */}
        <div className="flex gap-4 p-2 bg-gray-50 rounded-3xl border border-gray-100">
          <div className="px-6 py-3 bg-white rounded-2xl shadow-sm border border-gray-100/50">
            <span className="block text-xs font-bold text-gray-400 uppercase">
              İdeal Oturum
            </span>
            <span className="text-xl font-black text-indigo-600">
              {data.sessionLength}
            </span>
          </div>
          <div className="px-6 py-3 bg-white rounded-2xl shadow-sm border border-gray-100/50">
            <span className="block text-xs font-bold text-gray-400 uppercase">
              Haftalık Dağılım
            </span>
            <span className="text-xl font-black text-emerald-600">
              {data.weeklyDistribution}
            </span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.bestStudyTimes.map((time, i) => (
          <div
            key={i}
            className={`group relative flex flex-col p-8 rounded-[40px] border-2 bg-gradient-to-br transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${getSlotColor(time.timeSlot)} shadow-sm`}
          >
            <div className="mb-6 flex justify-between items-start">
              <div className="bg-white/80 backdrop-blur rounded-2xl p-3 shadow-sm group-hover:rotate-6 transition-transform">
                {getTimeIcon(time.timeSlot)}
              </div>
              <div className="bg-white/80 backdrop-blur px-4 py-1 rounded-full font-bold text-xs uppercase tracking-widest text-gray-500 border border-gray-100">
                {time.day}
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <h3 className="text-2xl font-black text-gray-800 capitalize">
                {time.timeSlot}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <Star
                  className={`w-4 h-4 ${time.energyLevel === "yüksek" ? "text-amber-500 fill-amber-500" : "text-gray-300"}`}
                />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                  Enerji: {time.energyLevel}
                </span>
              </div>
              <p className="text-gray-600 font-medium leading-relaxed italic">
                "{time.reason}"
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <span className="text-sm font-bold text-gray-400 uppercase">
                  Beklenen Verim
                </span>
              </div>
              <span className="text-2xl font-black text-emerald-600">
                {time.expectedPerformance}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Break Protocol */}
      <div className="relative overflow-hidden bg-white border-2 border-indigo-50 rounded-[40px] p-10 shadow-sm group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700">
          <Coffee className="w-64 h-64" />
        </div>
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="bg-indigo-50 rounded-full p-10 ring-8 ring-indigo-50/50">
            <Coffee className="w-16 h-16 text-indigo-600" />
          </div>
          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-3xl font-black text-gray-900 mb-4">
              Mola Protokolü
            </h3>
            <div className="text-xl text-gray-600 font-medium max-w-xl space-y-4">
              <p>
                Zihnini taze tutmak için her{" "}
                <strong className="text-indigo-600">
                  {data.breakRecommendations.frequency}
                </strong>{" "}
                çalışmadan sonra{" "}
                <strong className="text-indigo-600">
                  {data.breakRecommendations.duration}
                </strong>{" "}
                kaliteli bir mola vermelisin.
              </p>

              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {data.breakRecommendations.breakActivities.map(
                  (activity, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-bold rounded-full border border-indigo-100"
                    >
                      {activity}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 text-center">
              <span className="block text-xl">🧘</span>
              <span className="text-xs font-bold text-indigo-700">
                Nefes Al
              </span>
            </div>
            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50 text-center">
              <span className="block text-xl">💧</span>
              <span className="text-xs font-bold text-emerald-700">Su İç</span>
            </div>
            <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100/50 text-center">
              <span className="block text-xl">🍎</span>
              <span className="text-xs font-bold text-amber-700">Meyve Ye</span>
            </div>
            <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100/50 text-center">
              <span className="block text-xl">🤸</span>
              <span className="text-xs font-bold text-rose-700">
                Hareket Et
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
