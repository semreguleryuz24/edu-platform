import {
    ChevronRight,
    Clock,
    Coffee,
    Star,
    Target,
    TrendingUp,
    Zap,
} from "lucide-react";
import { AIRecommendations } from "./types";

interface Props {
  data: AIRecommendations["focusTopics"];
}

export default function FocusTopics({ data }: Props) {
  const priorityStyles = {
    high: {
      bg: "bg-rose-50",
      border: "border-rose-100",
      text: "text-rose-700",
      accent: "bg-rose-500",
      label: "Kritik Öncelik",
    },
    medium: {
      bg: "bg-amber-50",
      border: "border-amber-100",
      text: "text-amber-700",
      accent: "bg-amber-500",
      label: "Orta Öncelik",
    },
    low: {
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      text: "text-emerald-700",
      accent: "bg-emerald-500",
      label: "Gelişim Odaklı",
    },
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-indigo-100 rounded-2xl p-3">
          <Target className="w-8 h-8 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-gray-900 leading-tight">
            Odaklanılacak Konular
          </h2>
          <p className="text-gray-500 font-medium">
            Başarını artırmak için seçilmiş özel başlıklar
          </p>
        </div>
      </div>

      <div className="grid gap-8">
        {data.map((topic, i) => {
          const style = priorityStyles[topic.priority];
          return (
            <div
              key={i}
              className={`relative overflow-hidden group bg-white border-2 rounded-[32px] p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-100 ${style.border}`}
            >
              {/* Priority Ribbon */}
              <div
                className={`absolute top-0 right-12 px-6 py-2 rounded-b-2xl font-bold text-xs uppercase tracking-widest text-white ${style.accent}`}
              >
                {style.label}
              </div>

              <div className="flex flex-col lg:flex-row gap-8 lg:items-center">
                <div className="flex-1 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-3xl font-extrabold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {topic.subject}
                    </h3>
                    <p className="text-lg text-gray-600 font-medium leading-relaxed">
                      {topic.reason}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {topic.specificTopics.map((sub, j) => (
                      <span
                        key={j}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-2xl text-gray-700 font-bold text-sm border border-gray-100"
                      >
                        <ChevronRight className="w-4 h-4 text-indigo-500" />
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="lg:w-80 space-y-6">
                  {/* Progress Visualization */}
                  <div className="bg-gray-50 rounded-3xl p-6 space-y-6 border border-gray-100">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                          Mevcut
                        </span>
                        <div className="text-3xl font-black text-gray-900">
                          {topic.currentScore}%
                        </div>
                      </div>
                      <TrendingUp className="w-8 h-8 text-indigo-500 opacity-20" />
                      <div className="text-right space-y-1">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                          Hedef
                        </span>
                        <div className={`text-3xl font-black ${style.text}`}>
                          {topic.targetScore}%
                        </div>
                      </div>
                    </div>

                    {/* Custom Progress Bar */}
                    <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-indigo-200 rounded-full"
                        style={{
                          width: `${(topic.currentScore / topic.targetScore) * 100}%`,
                        }}
                      />
                      <div
                        className={`absolute inset-y-0 left-0 ${style.accent} rounded-full transition-all duration-1000 shadow-lg`}
                        style={{ width: `${topic.currentScore}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-indigo-500" />
                        <span className="text-gray-500 font-bold text-sm">
                          Tahmini Süre
                        </span>
                      </div>
                      <span className="font-black text-gray-900">
                        {topic.estimatedStudyTime}
                      </span>
                    </div>
                  </div>

                  {/* Added Quick Wins & Study Method */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
                        <Zap className="w-4 h-4" />
                        Hızlı Kazanımlar
                      </div>
                      <ul className="space-y-1">
                        {topic.quickWins.map((win, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-emerald-800 font-medium flex items-center gap-1"
                          >
                            <Star className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                            {win}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                        <Coffee className="w-4 h-4" />
                        Çalışma Yöntemi
                      </div>
                      <p className="text-sm text-indigo-800 font-medium">
                        {topic.studyMethod}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
