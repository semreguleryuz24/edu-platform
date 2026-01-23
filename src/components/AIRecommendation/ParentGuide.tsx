import {
    CheckCircle2,
    Heart,
    Info,
    Lightbulb,
    MessageCircle,
    ShieldCheck,
    Users,
    Zap,
} from "lucide-react";
import { AIRecommendations } from "./types";

interface Props {
  data: AIRecommendations["parentGuide"];
}

export default function ParentGuide({ data }: Props) {
  if (!data) return null;

  const { psychologicalApproach, learningMethods, supportChecklist } = data;

  return (
    <div className="p-8 lg:p-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[40px] p-10 text-white shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Users className="w-48 h-48 -rotate-12" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
              <Users className="w-8 h-8 text-white" />
            </div>
            <span className="text-sm font-black uppercase tracking-[0.2em] text-purple-100">
              Veli Rehberi & Strateji
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black mb-6 leading-tight">
            Çocuğunuzun Başarısında <br />
            <span className="text-purple-200">En Büyük Destekçisi Olun</span>
          </h2>
          <p className="text-lg font-medium text-purple-50">
            Eğitim psikologları tarafından hazırlanan bu rehber, 6. sınıf
            gelişim özelliklerini dikkate alarak çocuğunuza en doğru yaklaşımı
            sergilemenize yardımcı olur.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Psychological Approach */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-4">
            <Heart className="w-6 h-6 text-rose-500" />
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">
              Psikolojik Yaklaşım
            </h3>
          </div>
          <div className="grid gap-4">
            {psychologicalApproach.map((item, index) => (
              <div
                key={index}
                className="group p-6 bg-rose-50/50 hover:bg-rose-50 rounded-[32px] border-2 border-transparent hover:border-rose-100 transition-all duration-300"
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 font-black">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 font-bold leading-relaxed pt-1">
                    {item}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Checklist */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-4">
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">
              Veli Destek Listesi
            </h3>
          </div>
          <div className="bg-white rounded-[40px] border-2 border-emerald-50 p-8 shadow-xl shadow-emerald-50/50">
            <div className="space-y-4">
              {supportChecklist.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-2xl hover:bg-emerald-50/50 transition-colors group"
                >
                  <div className="mt-1">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-gray-700 font-bold text-lg">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-emerald-600 rounded-[32px] text-white">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
                <span className="font-black text-sm uppercase tracking-wider">
                  Altın Kural
                </span>
              </div>
              <p className="font-bold">
                Çocuğunuzun çabasını, aldığı notlardan daha fazla takdir edin.
                Gelişim odaklı zihniyet başarının anahtarıdır.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Methods */}
      <div className="space-y-8">
        <div className="flex items-center gap-3 px-4">
          <Lightbulb className="w-7 h-7 text-amber-500" />
          <h3 className="text-3xl font-black text-gray-900 tracking-tight">
            Önerilen Öğrenme Metotları
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {learningMethods.map((method, index) => (
            <div
              key={index}
              className="relative overflow-hidden bg-white p-8 rounded-[40px] border-2 border-gray-100 hover:border-indigo-100 shadow-lg hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />

              <div className="relative z-10 space-y-4">
                <div className="w-14 h-14 bg-indigo-600 text-white rounded-[20px] flex items-center justify-center shadow-lg shadow-indigo-200">
                  <Info className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-black text-gray-900">
                  {method.title}
                </h4>
                <p className="text-gray-600 font-medium leading-relaxed text-lg">
                  {method.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Communication Tips */}
      <div className="bg-indigo-50 rounded-[48px] p-10 flex flex-col lg:flex-row items-center gap-10">
        <div className="w-24 h-24 lg:w-32 lg:h-32 bg-white rounded-full flex items-center justify-center shadow-xl flex-shrink-0">
          <MessageCircle className="w-12 h-12 lg:w-16 lg:h-16 text-indigo-600" />
        </div>
        <div className="space-y-4 text-center lg:text-left">
          <h3 className="text-2xl font-black text-indigo-900">
            Sağlıklı İletişim İçin
          </h3>
          <p className="text-lg text-indigo-700 font-bold max-w-3xl">
            "Nasıl geçti?" yerine "Bugün seni en çok şaşırtan ne oldu?" veya
            "Hangi konuda kendini geliştirdiğini hissettin?" gibi ucu açık
            sorular sorarak merakını tetikleyin.
          </p>
        </div>
      </div>
    </div>
  );
}
