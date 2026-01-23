import {
    BookOpen,
    Calculator,
    Calendar,
    CheckCircle2,
    Flag,
    Languages,
    Microscope,
    Star,
} from "lucide-react";
import { AIRecommendations } from "./types";

interface Props {
  data: AIRecommendations["studyPlan"];
}

export default function StudyPlan({ data }: Props) {
  const getSubjectIcon = (subject: string) => {
    const s = subject.toLowerCase();
    if (s.includes("mat")) return <Calculator className="w-5 h-5" />;
    if (s.includes("fen")) return <Microscope className="w-5 h-5" />;
    if (s.includes("türk") || s.includes("ing"))
      return <Languages className="w-5 h-5" />;
    return <BookOpen className="w-5 h-5" />;
  };

  const getSubjectColor = (subject: string) => {
    const s = subject.toLowerCase();
    if (s.includes("mat")) return "bg-blue-100 text-blue-700 border-blue-200";
    if (s.includes("fen"))
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (s.includes("türk")) return "bg-rose-100 text-rose-700 border-rose-200";
    if (s.includes("ing"))
      return "bg-indigo-100 text-indigo-700 border-indigo-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="p-6 space-y-10 animate-in fade-in duration-1000">
      {/* Header with Weekly Goal */}
      <div className="bg-indigo-600 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Calendar className="w-48 h-48 -rotate-12" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="bg-white/20 backdrop-blur-xl rounded-full p-6 ring-8 ring-white/10">
            <Calendar className="w-12 h-12 text-white" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-4xl font-black mb-2">Haftalık Yol Haritası</h2>
            <p className="text-indigo-100 text-sm font-bold uppercase tracking-widest mb-2">
              {data.startDate} - {data.endDate}
            </p>
            <p className="text-indigo-100 text-xl font-medium max-w-xl">
              "{data.weeklyGoal}"
            </p>
          </div>
          <div className="bg-black/20 backdrop-blur rounded-3xl p-6 border border-white/10 text-center">
            <div className="text-sm font-bold uppercase tracking-widest text-indigo-200 mb-1">
              Hafta
            </div>
            <div className="text-4xl font-black">{data.week}</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-7 gap-6">
        {data.days.map((day, i) => (
          <div key={i} className="flex flex-col group min-h-[400px]">
            <div className="mb-4 text-center">
              <h3 className="text-xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors">
                {day.day}
              </h3>
              <p className="text-xs font-bold text-gray-400">
                {new Date(day.date).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "short",
                })}
              </p>
            </div>

            <div className="flex-1 bg-white border-2 border-gray-100 rounded-[32px] p-4 space-y-4 hover:border-indigo-100 hover:shadow-xl transition-all duration-300">
              {day.sessions.map((session, j) => (
                <div
                  key={j}
                  className={`group/session relative p-4 rounded-2xl border transition-all duration-300 ${getSubjectColor(session.subject)}`}
                >
                  <div className="flex items-center justify-between mb-3 text-xs font-bold tracking-tighter opacity-80">
                    <span>{session.time}</span>
                    <span>{session.duration} dk</span>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    {getSubjectIcon(session.subject)}
                    <h4 className="font-black text-base truncate">
                      {session.subject}
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {session.topics.slice(0, 2).map((t, k) => (
                      <span
                        key={k}
                        className="px-2 py-0.5 bg-white/40 rounded-lg text-[10px] font-bold"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Materials & Success Criteria - Tooltip-like on hover */}
                  <div className="hidden group-hover/session:block absolute left-full ml-2 top-0 z-20 w-48 bg-gray-900 text-white p-4 rounded-2xl shadow-2xl text-[10px] space-y-2">
                    {session.materials.length > 0 && (
                      <div>
                        <div className="font-black text-indigo-400 uppercase mb-1">
                          Kaynaklar
                        </div>
                        <ul className="list-disc pl-3">
                          {session.materials.map((m, idx) => (
                            <li key={idx}>{m}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div>
                      <div className="font-black text-emerald-400 uppercase mb-1">
                        Başarı Kriteri
                      </div>
                      <p>{session.successCriteria}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-current/10 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase">
                      {session.type}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold">
                        {session.goalQuestions}
                      </span>
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              ))}

              <div className="mt-auto pt-4 border-t border-dashed border-gray-200">
                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1 text-center">
                  Günün Hedefi
                </p>
                <p className="text-xs font-extrabold text-center text-gray-800 line-clamp-2 leading-tight mb-2">
                  {day.dailyGoal}
                </p>
                <p className="text-[10px] font-medium text-center text-gray-400 italic">
                  "{day.motivationalQuote}"
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Milestones */}
      <div className="bg-gray-50 rounded-[40px] p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-8 px-4">
          <Flag className="w-6 h-6 text-indigo-600" />
          <h3 className="text-2xl font-black text-gray-900">
            Kritik Hedefler & Kazanımlar
          </h3>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.milestones.map((milestone, i) => (
            <div
              key={i}
              className="group relative bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col gap-4 hover:shadow-xl hover:border-indigo-200 transition-all"
            >
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <span className="font-black text-sm">{i + 1}</span>
              </div>
              <div className="space-y-2">
                <p className="font-black text-gray-900 text-sm leading-tight">
                  {milestone.title}
                </p>
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                  <Calendar className="w-3 h-3" />
                  {milestone.targetDate}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-rose-500 bg-rose-50 px-2 py-1 rounded-lg">
                  <Star className="w-3 h-3 fill-rose-500" />
                  Ödül: {milestone.reward}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
