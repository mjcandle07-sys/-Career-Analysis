
import React, { useState, useEffect } from 'react';
import { UserProfile, ResultData, AgeGroup } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { RefreshCw, Zap, AlertTriangle, Loader2, Bookmark, Wind, GraduationCap, MapPin, FileDown, Sparkles } from 'lucide-react';
import { COLORS } from '../constants';

interface Props {
  loading: boolean;
  error?: boolean;
  user: UserProfile;
  result: ResultData | null;
  onRestart: () => void;
  onRetry: () => void;
}

const LOADING_STAGES = [
  "진단 데이터를 분석 중입니다...",
  "무의식 컬러 코드를 해석 중입니다...",
  "최적의 진로군을 매칭 중입니다...",
  "Gemini AI가 리포트를 생성 중입니다..."
];

const ResultStep: React.FC<Props> = ({ loading, error, user, result, onRestart, onRetry }) => {
  const [progress, setProgress] = useState(0);
  const [stageIdx, setStageIdx] = useState(0);
  const [isPreparingPDF, setIsPreparingPDF] = useState(false);

  useEffect(() => {
    let interval: number;
    if (loading && !result && !error) {
      interval = window.setInterval(() => {
        setProgress(prev => (prev < 98 ? prev + 0.5 : prev));
      }, 150);
    } else if (result) {
      setProgress(100);
    }
    return () => clearInterval(interval);
  }, [loading, result, error]);

  useEffect(() => {
    if (loading && !result) {
      const nextStage = Math.min(Math.floor((progress / 100) * LOADING_STAGES.length), LOADING_STAGES.length - 1);
      setStageIdx(nextStage);
    }
  }, [progress, loading, result]);

  const handlePrint = () => {
    setIsPreparingPDF(true);
    const originalTitle = document.title;
    document.title = `진로리포트_${user.name}`;
    
    setTimeout(() => {
      window.print();
      setIsPreparingPDF(false);
      document.title = originalTitle;
    }, 500);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-10 py-24 text-center">
        <div className="w-28 h-28 rounded-[35px] bg-indigo-600 shadow-2xl flex items-center justify-center text-white text-3xl font-black italic animate-bounce">CAN</div>
        <div className="space-y-4 w-full max-w-sm">
          <div className="flex justify-between text-sm font-black text-slate-400">
            <span>{LOADING_STAGES[stageIdx]}</span>
            <span>{Math.floor(progress)}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="text-center py-20 space-y-8 bg-white rounded-[40px] border border-slate-100 p-12 shadow-xl">
        <AlertTriangle size={64} className="mx-auto text-rose-500" />
        <h2 className="text-3xl font-black text-slate-900">분석 중 오류가 발생했습니다</h2>
        <p className="text-slate-500 font-medium">네트워크 연결을 확인하거나 잠시 후 다시 시도해 주세요.</p>
        <div className="flex flex-col gap-4 max-w-xs mx-auto">
          <button onClick={onRetry} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-all">다시 분석하기</button>
          <button onClick={onRestart} className="w-full py-5 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">처음으로 돌아가기</button>
        </div>
      </div>
    );
  }

  const selectedColorData = COLORS[user.selectedColor || 'BLUE'];
  const formatText = (text: string) => {
    if (!text) return '';
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => part.startsWith('**') && part.endsWith('**') ? <strong key={i} className="text-slate-900 font-extrabold">{part.slice(2, -2)}</strong> : part);
  };

  const actionSectionTitle = user.ageGroup === AgeGroup.CAREER_PATH ? "전공 및 커리어 로드맵" : user.ageGroup === AgeGroup.DREAM_TREE ? "미래 탐험 경로" : "커리어 재설계 전략";

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20 print:space-y-0 print:pb-0">
      {/* 1st Page: Core Analysis */}
      <div className="report-container bg-white rounded-[45px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 p-10 md:p-14 print:p-10 print:rounded-none print:shadow-none print:border-none">
        <div className="flex justify-between items-start border-b border-slate-100 pb-8 mb-8 print:pb-4 print:mb-4">
          <div className="space-y-2">
            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black text-white tracking-widest ${selectedColorData?.bg}`}>CORE PROFILE</span>
            <h2 className="text-4xl font-black text-slate-900 leading-tight print:text-3xl">
              {user.name}님은 <span className="text-indigo-600">{result.persona}</span>
            </h2>
            <p className="text-slate-400 text-lg font-bold tracking-tight print:text-sm">{result.keyword}</p>
          </div>
          <div className="text-right flex flex-col items-end print:hidden">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black mb-2 shadow-lg shadow-indigo-100">C</div>
            <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Analysis Certified</p>
          </div>
        </div>

        <div className="bg-slate-50/50 p-8 rounded-3xl mb-10 print:p-6 print:mb-6 print:rounded-2xl">
          <p className="text-lg text-slate-700 leading-relaxed break-keep print:text-[14px]">{formatText(result.summary)}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-10 print:gap-4 print:mb-6">
          <div className="h-64 print:h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={result.chartData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{fontSize: 11, fontWeight: 900, fill: '#64748b'}} />
                <Radar dataKey="value" stroke={selectedColorData?.hex || '#6366f1'} fill={selectedColorData?.hex || '#6366f1'} fillOpacity={0.4} isAnimationActive={false} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4 print:space-y-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-500" /> Deep Interpretation
            </h3>
            <p className="text-[15px] font-bold text-slate-600 leading-relaxed print:text-[13px] print:leading-snug">{result.careerFactorInterpretation}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-4">
          <div className="p-6 bg-slate-50 rounded-3xl space-y-3 print:p-4 print:space-y-2">
             <div className="flex justify-between items-center mb-1">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Energy Balance</h4>
                <span className="text-[9px] font-black bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full uppercase">{result.energyBalance?.status}</span>
             </div>
             <div className="flex justify-between text-sm font-black text-slate-700"><span className="text-slate-400">역량 적합도</span><span>{result.energyBalance?.theoryScore}%</span></div>
             <div className="h-2 bg-white rounded-full overflow-hidden shadow-inner"><div className="h-full bg-indigo-600 shadow-sm" style={{width: `${result.energyBalance?.theoryScore}%`}} /></div>
             <p className="text-xs text-slate-600 font-medium leading-relaxed pt-1 print:text-[11px]">{result.energyBalance?.interpretation}</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-3xl print:p-4">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 print:mb-2">Strategic SWOT</h4>
             <div className="grid grid-cols-2 gap-2 text-xs font-bold print:gap-1.5">
                <div className="bg-white p-3 rounded-2xl text-indigo-700 border border-indigo-50 flex flex-col shadow-sm print:p-2">
                  <span className="text-[8px] opacity-40 mb-0.5 uppercase">Strength</span><span className="truncate">{result.swot?.strengths?.[0]}</span>
                </div>
                <div className="bg-white p-3 rounded-2xl text-slate-600 border border-slate-100 flex flex-col shadow-sm print:p-2">
                  <span className="text-[8px] opacity-40 mb-0.5 uppercase">Weakness</span><span className="truncate">{result.swot?.weaknesses?.[0]}</span>
                </div>
                <div className="bg-white p-3 rounded-2xl text-emerald-700 border border-emerald-50 flex flex-col shadow-sm print:p-2">
                  <span className="text-[8px] opacity-40 mb-0.5 uppercase">Opportunity</span><span className="truncate">{result.swot?.opportunities?.[0]}</span>
                </div>
                <div className="bg-white p-3 rounded-2xl text-rose-700 border border-rose-50 flex flex-col shadow-sm print:p-2">
                  <span className="text-[8px] opacity-40 mb-0.5 uppercase">Threat</span><span className="truncate">{result.swot?.threats?.[0]}</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* 2nd Page: Strategy & Actions */}
      <div className="report-container bg-slate-950 text-white rounded-[45px] p-10 md:p-14 print:p-10 print:bg-white print:text-slate-900 print:rounded-none page-break">
        <div className="flex items-center gap-4 mb-10 print:mb-6">
           <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-900/20 print:w-10 print:h-10">
             {user.ageGroup === AgeGroup.CAREER_PATH ? <GraduationCap size={28} className="print:w-5 print:h-5" /> : <MapPin size={28} className="print:w-5 print:h-5" />}
           </div>
           <div>
             <h3 className="text-3xl font-black print:text-2xl print:text-indigo-600">{actionSectionTitle}</h3>
             <p className="text-sm text-slate-400 mt-1 print:text-xs print:text-slate-500">당신의 성장을 돕는 핵심 제안입니다.</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 print:mb-6 print:gap-3">
          {result.actionPlan?.careers?.map((career, i) => (
            <div key={i} className="p-7 bg-white/5 rounded-[32px] border border-white/10 hover:bg-white/10 transition-colors group print:bg-slate-50 print:border-slate-100 print:p-5 print:rounded-2xl">
              <span className="text-[10px] font-black text-indigo-400 mb-2 block uppercase tracking-widest">Option {i+1}</span>
              <h5 className="text-xl font-black mb-3 leading-tight print:text-slate-900 print:text-lg print:mb-2">{career.title}</h5>
              <p className="text-sm text-slate-400 print:text-slate-600 leading-relaxed break-keep group-hover:text-slate-300 transition-colors print:text-[11px]">{career.reason}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/10 pt-10 print:pt-6 print:border-slate-100 print:gap-4">
          <div className="space-y-4 print:space-y-2">
             <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] flex items-center gap-2"><Bookmark size={14} /> Energy Tuning</h4>
             <div className="p-6 bg-white/5 rounded-3xl print:bg-emerald-50 print:p-4 print:rounded-2xl">
               <p className="text-xl font-black text-emerald-400 mb-2 print:text-emerald-700 print:text-lg print:mb-1">{result.actionPlan?.colorTherapy}</p>
               <p className="text-sm text-slate-400 leading-relaxed print:text-slate-600 print:text-[11px]">{result.actionPlan?.colorTherapyReason}</p>
             </div>
          </div>
          <div className="space-y-4 print:space-y-2">
             <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] flex items-center gap-2"><Wind size={14} /> Scent Therapy</h4>
             <div className="p-6 bg-white/5 rounded-3xl print:bg-blue-50 print:p-4 print:rounded-2xl">
               <p className="text-xl font-black text-blue-400 mb-2 print:text-blue-700 print:text-lg print:mb-1">{result.actionPlan?.scentTherapy}</p>
               <p className="text-sm text-slate-400 leading-relaxed print:text-slate-600 print:text-[11px]">추천 드린 이 향기는 심리적 안정과 자신감 회복에 도움을 줍니다.</p>
             </div>
          </div>
        </div>

        <div className="mt-10 p-8 bg-indigo-600 rounded-[35px] text-center shadow-2xl shadow-indigo-950/20 print:bg-indigo-50 print:border print:border-indigo-100 print:p-6 print:rounded-2xl print:shadow-none print:mt-6">
           <h4 className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em] mb-2 print:text-indigo-400">Immediate Action Task</h4>
           <p className="text-2xl font-black text-white italic print:text-indigo-900 print:text-xl">"{result.actionPlan?.immediateAction}"</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-5 action-buttons pt-8 print:hidden px-4 md:px-0">
        <button 
          onClick={handlePrint} 
          disabled={isPreparingPDF}
          className="flex-[2] bg-indigo-600 text-white font-black py-6 rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:translate-y-0 text-lg disabled:opacity-50"
        >
          {isPreparingPDF ? <Loader2 className="animate-spin" size={24} /> : <FileDown size={24} />}
          리포트 PDF로 저장하기 (A4 최적화)
        </button>
        <button 
          onClick={onRestart}
          className="flex-1 bg-white text-slate-600 font-bold border border-slate-200 py-6 rounded-2xl hover:bg-slate-50 hover:-translate-y-1 transition-all active:translate-y-0 flex items-center justify-center gap-2 text-lg shadow-sm"
        >
          <RefreshCw size={20} /> 다시 진단하기
        </button>
      </div>

      <div className="text-center pt-4 pb-12">
        <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.6em]">
          ColorHeart Can AI Synthesis Engine v3.9 Professional
        </p>
      </div>
    </div>
  );
};

export default ResultStep;
