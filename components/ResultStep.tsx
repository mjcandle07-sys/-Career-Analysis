
import React, { useState, useEffect } from 'react';
import { UserProfile, ResultData, AgeGroup } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Download, RefreshCw, Zap, Target, Shield, AlertTriangle, Lightbulb, CheckCircle2, ChevronRight, AlertCircle, Loader2, Sparkles, Printer, FileText, Bookmark, ClipboardCheck, Info, Wind, Waves, FileDown } from 'lucide-react';
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
  "진단 데이터를 안전하게 수집 중입니다...",
  "사용자의 무의식 컬러 코드를 해석 중입니다...",
  "데이터를 기반으로 최적의 진로군을 매칭 중입니다...",
  "Gemini AI가 심층 SWOT 분석을 수행 중입니다...",
  "개인 맞춤형 액션 플랜을 설계하고 있습니다...",
  "문장을 정교하게 다듬고 리포트를 생성 중입니다...",
  "거의 다 되었습니다! 마지막 데이터 검증 중..."
];

const ResultStep: React.FC<Props> = ({ loading, error, user, result, onRestart, onRetry }) => {
  const [progress, setProgress] = useState(0);
  const [stageIdx, setStageIdx] = useState(0);
  const [isLongWait, setIsLongWait] = useState(false);
  const [isPreparingPDF, setIsPreparingPDF] = useState(false);

  useEffect(() => {
    let interval: number;
    let timeout: number;

    if (loading && !result && !error) {
      setProgress(0);
      setStageIdx(0);
      setIsLongWait(false);

      timeout = window.setTimeout(() => {
        setIsLongWait(true);
      }, 15000);
      
      interval = window.setInterval(() => {
        setProgress(prev => {
          if (prev < 85) {
            return prev + Math.random() * 2;
          } else if (prev < 98) {
            return prev + 0.1; 
          }
          return prev;
        });
      }, 200);
    } else if (result) {
      setProgress(100);
    }
    
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [loading, result, error]);

  useEffect(() => {
    if (loading && !result) {
      const nextStage = Math.min(
        Math.floor((progress / 100) * LOADING_STAGES.length),
        LOADING_STAGES.length - 1
      );
      setStageIdx(nextStage);
    }
  }, [progress, loading, result]);

  const handleSaveAsPDF = () => {
    if (isPreparingPDF) return;

    // 인앱 브라우저 체크
    const ua = navigator.userAgent.toLowerCase();
    const isInApp = /kakao|instagram|line|fb|naver/i.test(ua);
    const isMobile = /iphone|ipad|ipod|android/i.test(ua);

    if (isInApp) {
      alert("⚠️ 현재 인앱 브라우저(카톡/인스타 등)를 사용 중입니다.\n이 환경에서는 PDF 저장이 차단될 수 있습니다.\n화면 상단 또는 하단의 [점 세개] 버튼을 눌러 '외부 브라우저(Chrome/Safari)로 열기'를 선택한 후 다시 시도해 주세요.");
    } else if (isMobile) {
      alert("💡 PDF 저장 안내\n1. 인쇄 창이 뜨면 미리보기 화면을 두 손가락으로 벌리거나 '공유' 버튼을 누르세요.\n2. 'PDF로 저장' 또는 '파일에 저장'을 선택해 주세요.");
    }

    setIsPreparingPDF(true);
    const originalTitle = document.title;
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const fileName = `ColorHeart_진로분석_${user.name}_${dateStr}`;
    
    // 파일명 인식을 위해 문서 제목 변경
    document.title = fileName;
    
    // 레이아웃 렌더링 완료 및 폰트 로드를 위해 충분한 지연 시간 확보
    setTimeout(() => {
      try {
        window.print();
      } catch (e) {
        console.error("Print error:", e);
        alert("죄송합니다. 현재 브라우저에서 인쇄 기능을 실행할 수 없습니다.\n다른 브라우저(크롬 등)를 이용해 주세요.");
      } finally {
        setIsPreparingPDF(false);
        // 인쇄 후 제목 원복 (약간의 여유를 둠)
        setTimeout(() => {
          document.title = originalTitle;
        }, 2000);
      }
    }, 1000); // 1초 지연으로 차트 애니메이션 및 폰트 안정화
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-16 text-center py-20 px-6">
        <div className="relative">
          <div className="relative w-40 h-40 mx-auto z-10">
            <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-3xl animate-pulse"></div>
            <div className="relative w-full h-full rounded-[40px] bg-indigo-600 shadow-[0_20px_50px_rgba(79,70,229,0.3)] flex items-center justify-center text-white text-5xl font-black italic transform rotate-6 animate-bounce">
              CAN
            </div>
          </div>
          <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 -rotate-90 opacity-10">
            <circle cx="144" cy="144" r="130" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-indigo-600" />
          </svg>
        </div>

        <div className="space-y-8 w-full max-w-md mx-auto">
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">AI 심층 분석 중</h2>
              <span className="text-2xl font-black text-indigo-600 font-mono">{Math.floor(progress)}%</span>
            </div>
            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-1 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-full transition-all duration-300 ease-out shadow-lg" 
                style={{ width: `${progress}%` }}
              >
                <div className="w-full h-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" style={{ backgroundSize: '200% 100%' }}></div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-white py-4 px-8 rounded-full border border-slate-100 shadow-sm flex items-center justify-center gap-3">
              <Loader2 className="animate-spin text-indigo-500" size={18} />
              <p className="text-slate-500 font-black text-xs uppercase tracking-widest">
                {LOADING_STAGES[stageIdx]}
              </p>
            </div>
            
            {isLongWait && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 flex items-center justify-center gap-2 text-indigo-600 bg-indigo-50 py-3 px-6 rounded-2xl border border-indigo-100">
                <Sparkles size={16} className="animate-pulse" />
                <span className="text-xs font-bold">대규모 연산이 진행 중입니다. 잠시만 더 기다려 주세요!</span>
              </div>
            )}
          </div>
        </div>

        <style>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}</style>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="flex flex-col items-center justify-center space-y-8 text-center py-20 bg-white rounded-[50px] shadow-xl border border-slate-100 p-10">
        <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
          <AlertCircle size={40} />
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-black text-slate-900">리포트 분석 오류</h2>
          <p className="text-slate-500 font-medium max-w-sm">서버 응답 시간이 초과되었거나 네트워크에 문제가 발생했습니다. 다시 시도해 주세요.</p>
        </div>
        <div className="flex flex-col w-full gap-3">
          <button 
            onClick={onRetry}
            className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all"
          >
            <RefreshCw size={20} /> 다시 분석 요청하기
          </button>
          <button 
            onClick={onRestart}
            className="w-full bg-slate-100 text-slate-600 font-black py-4 rounded-2xl hover:bg-slate-200 transition-all"
          >
            초기 화면으로 이동
          </button>
        </div>
      </div>
    );
  }

  const selectedColorData = COLORS[user.selectedColor || 'BLUE'];

  const formatText = (text: string) => {
    if (!text) return '';
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-slate-900 font-extrabold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 print:m-0 print:p-0 pb-20">
      
      {/* PDF Preparation Overlay */}
      {isPreparingPDF && (
        <div className="fixed inset-0 z-[9999] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center space-y-6 print:hidden">
          <div className="relative">
            <Loader2 className="animate-spin text-indigo-600" size={60} />
            <Sparkles className="absolute -top-4 -right-4 text-orange-400 animate-pulse" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black text-slate-900">리포트를 최적화하고 있습니다</h3>
            <p className="text-slate-500 font-bold">잠시 후 인쇄/저장 창이 자동으로 열립니다.</p>
          </div>
        </div>
      )}

      {/* Print Only Header */}
      <div className="hidden print:flex justify-between items-center px-12 py-8 border-b-2 border-slate-100 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black">C</div>
          <span className="text-xl font-black text-slate-800">ColorHeart Can Career Report</span>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authentication Number / 인증번호</p>
          <p className="text-xs font-mono text-slate-600">CH-{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="report-container relative overflow-hidden bg-white rounded-[60px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-slate-100 print:shadow-none print:border-none print:rounded-none">
        <div className={`absolute top-0 right-0 w-[600px] h-[600px] ${selectedColorData.bg} opacity-[0.03] blur-[150px] -translate-y-1/2 translate-x-1/2 print:hidden`}></div>
        
        <div className="p-10 md:p-16 space-y-12 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="space-y-6 flex-1">
              <div className="flex items-center gap-3">
                 <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white ${selectedColorData.bg} shadow-lg shadow-indigo-200`}>
                   Core Profile / 핵심 프로필
                 </span>
                 <span className="text-slate-300 font-bold text-xs">/ {user.ageGroup === 'DREAM_TREE' ? '꿈나무' : user.ageGroup === 'CAREER_PATH' ? '커리어패스' : '마인드리셋'}</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight">
                {user.name}님은 <br /> 
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${selectedColorData.bg.replace('bg-', 'from-').replace('-500', '-600')} to-slate-800`}>
                  {result.persona}
                </span> 입니다.
              </h2>
              <div className="flex flex-wrap gap-3">
                {result.keyword.split(' ').map((kw, i) => (
                  <span key={i} className="text-lg font-bold text-slate-400">{kw}</span>
                ))}
              </div>
            </div>
            <div className="relative w-32 h-52 shrink-0 group print:hidden">
               <div className={`w-full h-full rounded-[35px] border-4 ${selectedColorData.border} ${selectedColorData.bg} shadow-[0_30px_60px_-15px_rgba(0,0,0,0.25)] flex items-center justify-center p-4 relative overflow-hidden transition-transform group-hover:rotate-6`}>
                 <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
                 <div className="text-[14px] text-white font-black uppercase rotate-90 leading-none tracking-[0.3em] whitespace-nowrap drop-shadow-lg">
                   {result.persona.split(' ')[0]}
                 </div>
               </div>
            </div>
          </div>
          <div className="bg-slate-50/80 p-10 rounded-[45px] border border-slate-100 relative">
            <p className="text-slate-700 text-xl leading-relaxed font-medium break-keep">
              {formatText(result.summary)}
            </p>
          </div>
        </div>

        {/* Individual Row Layout for Charts & Energy Balance */}
        <div className="flex flex-col gap-24 p-10 md:p-16 pt-0 border-t border-slate-50 mt-12">
          
          {/* Career Factors Section (Full Width Row) */}
          <div className="space-y-8 page-break-avoid">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
              <Zap size={16} className="text-indigo-500" /> Career Factors / 진로 요인 프로필
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
              <div className="lg:col-span-2 h-[400px] w-full bg-slate-50/40 rounded-[40px] p-8 border border-slate-50 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={result.chartData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={{fontSize: 10, fontWeight: 900, fill: '#64748b'}} 
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} hide />
                    <Radar 
                      name="Score" 
                      dataKey="value" 
                      stroke={selectedColorData.hex} 
                      fill={selectedColorData.hex} 
                      fillOpacity={0.4} 
                      isAnimationActive={false}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="lg:col-span-3 h-full">
                <div className="p-10 bg-slate-50 rounded-[40px] border border-slate-100 h-full flex flex-col justify-center">
                  <div className="mb-4">
                    <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">Deep Interpretation</span>
                  </div>
                  <p className="text-base md:text-lg font-bold text-slate-700 leading-relaxed break-keep">
                    {result.careerFactorInterpretation}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Energy Balance Section (Full Width Row) */}
          <div className="space-y-8 page-break-avoid">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                <Lightbulb size={16} className="text-orange-500" /> Energy Balance / 에너지 균형 분석
              </h3>
              {result.energyBalance.status && (
                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white ${selectedColorData.bg} animate-pulse shadow-sm`}>
                  Current Status: {result.energyBalance.status}
                </span>
              )}
            </div>
            
            <div className="bg-slate-50/30 rounded-[50px] border border-slate-50 p-10 md:p-14">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-10">
                <div className="space-y-5">
                  <div className="flex justify-between text-xs font-black text-slate-500 uppercase tracking-widest">
                    <span>Potential Alignment (역량 적합도)</span>
                    <span className="text-slate-900 font-mono text-base">{result.energyBalance.theoryScore}%</span>
                  </div>
                  <div className="h-6 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner p-1">
                    <div className="h-full bg-indigo-600 rounded-full transition-all duration-1000" style={{ width: `${result.energyBalance.theoryScore}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-400 font-bold italic">*사용자의 학습 능력, 전공 적합성 및 직무 역량의 완성도를 나타냅니다.</p>
                </div>
                <div className="space-y-5">
                  <div className="flex justify-between text-xs font-black text-slate-500 uppercase tracking-widest">
                    <span>Internal Drive (심리 추진력)</span>
                    <span className="text-slate-900 font-mono text-base">{result.energyBalance.psychEnergy}%</span>
                  </div>
                  <div className="h-6 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner p-1">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${result.energyBalance.psychEnergy}%`, backgroundColor: selectedColorData.hex }} />
                  </div>
                  <p className="text-[11px] text-slate-400 font-bold italic">*무의식 컬러 에너지를 통해 도출된 현재의 심리적 동기와 실행력을 의미합니다.</p>
                </div>
              </div>

              {/* Enhanced Interpretation Box for Energy Balance */}
              <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 items-center">
                <div className="w-20 h-20 rounded-[28px] bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                  <div className="relative">
                    <Zap size={32} className="text-indigo-600" />
                    <Sparkles size={16} className="text-orange-400 absolute -top-2 -right-2 animate-pulse" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Info size={14} /> Comprehensive Balance Interpretation
                  </h5>
                  <p className="text-lg font-bold text-slate-700 leading-relaxed break-keep">
                    {result.energyBalance.interpretation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SWOT Analysis - With Interactive Cards */}
        <div className="p-10 md:p-16 pt-0 mt-8 page-break-avoid">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2 mb-10">
            <Target size={16} className="text-purple-500" /> Strategic SWOT Analysis / 전략적 SWOT 분석
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Strengths */}
            <div className="relative group p-8 rounded-[40px] bg-indigo-50/40 border border-indigo-100/50 space-y-6 transition-all duration-500 ease-out hover:scale-105 hover:z-20 hover:shadow-2xl hover:bg-white cursor-default">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg"><Target size={24} /></div>
                <span className="text-[10px] font-black text-indigo-300 tracking-tighter uppercase">Strengths</span>
              </div>
              <div className="space-y-4">
                <h4 className="font-black text-indigo-900 text-sm uppercase tracking-widest">강점 (Strengths)</h4>
                <ul className="space-y-3">
                  {result.swot.strengths.map((s, i) => (<li key={i} className="text-[13px] font-bold text-indigo-800/80 leading-snug flex items-start gap-2"><span className="mt-1.5 w-1 h-1 rounded-full bg-indigo-400 shrink-0" /> {s}</li>))}
                </ul>
              </div>
            </div>

            {/* Weaknesses */}
            <div className="relative group p-8 rounded-[40px] bg-slate-100/50 border border-slate-200/50 space-y-6 transition-all duration-500 ease-out hover:scale-105 hover:z-20 hover:shadow-2xl hover:bg-white cursor-default">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-slate-600 flex items-center justify-center text-white shadow-lg"><Shield size={24} /></div>
                <span className="text-[10px] font-black text-slate-300 tracking-tighter uppercase">Weaknesses</span>
              </div>
              <div className="space-y-4">
                <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest">약점 (Weaknesses)</h4>
                <ul className="space-y-3">
                  {result.swot.weaknesses.map((w, i) => (<li key={i} className="text-[13px] font-bold text-slate-800/80 leading-snug flex items-start gap-2"><span className="mt-1.5 w-1 h-1 rounded-full bg-slate-400 shrink-0" /> {w}</li>))}
                </ul>
              </div>
            </div>

            {/* Opportunities */}
            <div className="relative group p-8 rounded-[40px] bg-emerald-50/40 border border-emerald-100/50 space-y-6 transition-all duration-500 ease-out hover:scale-105 hover:z-20 hover:shadow-2xl hover:bg-white cursor-default">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg"><Zap size={24} /></div>
                <span className="text-[10px] font-black text-emerald-300 tracking-tighter uppercase">Opportunities</span>
              </div>
              <div className="space-y-4">
                <h4 className="font-black text-emerald-900 text-sm uppercase tracking-widest">기회 (Opportunities)</h4>
                <ul className="space-y-3">
                  {result.swot.opportunities.map((o, i) => (<li key={i} className="text-[13px] font-bold text-emerald-800/80 leading-snug flex items-start gap-2"><span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-400 shrink-0" /> {o}</li>))}
                </ul>
              </div>
            </div>

            {/* Threats */}
            <div className="relative group p-8 rounded-[40px] bg-rose-50/40 border border-rose-100/50 space-y-6 transition-all duration-500 ease-out hover:scale-105 hover:z-20 hover:shadow-2xl hover:bg-white cursor-default">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-lg"><AlertTriangle size={24} /></div>
                <span className="text-[10px] font-black text-rose-300 tracking-tighter uppercase">Threats</span>
              </div>
              <div className="space-y-4">
                <h4 className="font-black text-rose-900 text-sm uppercase tracking-widest">위협 (Threats)</h4>
                <ul className="space-y-3">
                  {result.swot.threats.map((t, i) => (<li key={i} className="text-[13px] font-bold text-rose-800/80 leading-snug flex items-start gap-2"><span className="mt-1.5 w-1 h-1 rounded-full bg-rose-400 shrink-0" /> {t}</li>))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Plan Section */}
      <div className="report-container bg-slate-950 text-white rounded-[60px] p-12 md:p-20 space-y-16 shadow-2xl overflow-hidden relative border border-white/5 print:rounded-none print:bg-white print:text-slate-900 print:border-none print:shadow-none print:mt-12 page-break-avoid">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600 opacity-[0.07] blur-[120px] -translate-y-1/2 translate-x-1/2 print:hidden" />
        <div className="relative z-10 space-y-16">
          <div className="space-y-5">
             <div className="flex items-center gap-3">
                <h3 className="text-4xl font-black tracking-tight print:text-indigo-600">Strategic Action Plan</h3>
                <span className="text-xl font-black text-indigo-400/60 mt-1">/ 전략적 액션 플랜</span>
             </div>
            <p className="text-slate-400 text-lg font-medium italic print:text-slate-600">당신의 강점을 극대화하기 위한 **실행 로드맵**입니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {result.actionPlan.careers.map((career, i) => (
              <div key={i} className="group p-8 bg-white/5 rounded-[40px] border border-white/10 print:bg-slate-50 print:border-slate-200 page-break-avoid transition-all hover:bg-white/10">
                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-black text-xl print:bg-indigo-600 print:text-white shadow-sm">
                    {i + 1}
                  </div>
                  <div className="space-y-4">
                    <h5 className="text-xl font-black text-white print:text-slate-900 break-keep">{career.title}</h5>
                    <p className="text-[13px] leading-relaxed text-slate-400 font-medium break-keep print:text-slate-600">{career.reason}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-8 pt-8 border-t border-white/10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6 page-break-avoid">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400 print:text-emerald-600">
                    <Bookmark size={20} />
                  </div>
                  <h4 className="text-emerald-400 font-black uppercase text-sm tracking-[0.2em] print:text-emerald-600">
                    Energy Tuning / 색채 처방
                  </h4>
                </div>
                <div className="p-8 rounded-[45px] bg-white/5 border border-white/5 print:bg-emerald-50 print:border-emerald-100 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black">
                      {result.actionPlan.colorTherapy.slice(0, 1)}
                    </div>
                    <div>
                      <span className="block text-emerald-400 text-2xl font-black print:text-emerald-700">{result.actionPlan.colorTherapy}</span>
                      <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Prescribed Color</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Why this color?</span>
                    <p className="text-slate-200 text-sm font-medium leading-relaxed print:text-slate-700 break-keep">
                      {result.actionPlan.colorTherapyReason}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 page-break-avoid">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 print:text-blue-600">
                    <Wind size={20} />
                  </div>
                  <h4 className="text-blue-400 font-black uppercase text-sm tracking-[0.2em] print:text-blue-600">
                    Scent Therapy / 향기 처방
                  </h4>
                </div>
                <div className="p-8 rounded-[45px] bg-white/5 border border-white/5 print:bg-blue-50 print:border-blue-100 space-y-6">
                   <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-blue-500/30 flex items-center justify-center text-blue-400">
                      <Waves size={24} />
                    </div>
                    <div>
                      <span className="block text-blue-400 text-2xl font-black print:text-blue-700">{result.actionPlan.scentTherapy}</span>
                      <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Recommended Aroma</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Scent Effect</span>
                    <p className="text-slate-200 text-sm font-medium leading-relaxed print:text-slate-700 break-keep">
                      이 향기는 {result.actionPlan.colorTherapy} 에너지와 공명하여 사용자의 {result.energyBalance.psychEnergy < 50 ? '심리적 에너지를 회복' : '집중력을 극대화'} 시키는 효과가 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 page-break-avoid">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg text-orange-400 print:text-orange-600">
                  <ClipboardCheck size={20} />
                </div>
                <h4 className="text-orange-400 font-black uppercase text-sm tracking-[0.2em] print:text-orange-600">
                  Immediate Action / 실행 과제
                </h4>
              </div>
              <div className="p-12 bg-gradient-to-br from-orange-500/10 to-orange-600/5 rounded-[50px] border border-orange-500/20 print:bg-orange-50 print:border-orange-200">
                <p className="text-white font-black text-3xl italic leading-tight text-center print:text-slate-900 break-keep">
                  "{result.actionPlan.immediateAction}"
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 pt-10 print:hidden action-buttons">
            <button 
              onClick={handleSaveAsPDF} 
              disabled={isPreparingPDF}
              className={`flex-[2] text-white font-black py-6 px-10 rounded-[30px] flex items-center justify-center gap-4 transition-all shadow-[0_20px_40px_rgba(79,70,229,0.3)] hover:-translate-y-1 active:translate-y-0 ${
                isPreparingPDF ? 'bg-indigo-400 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isPreparingPDF ? (
                <>
                  <Loader2 className="animate-spin" size={24} /> 리포트 최적화 중...
                </>
              ) : (
                <>
                  <FileDown size={24} /> 종합 리포트 PDF 저장하기
                </>
              )}
            </button>
            <button 
              onClick={onRestart} 
              disabled={isPreparingPDF}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white font-black py-6 px-10 rounded-[30px] border border-white/10 flex items-center justify-center gap-4 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50"
            >
              <RefreshCw size={24} /> 다시 진단하기
            </button>
          </div>
        </div>
      </div>
      
      <div className="hidden print:block pt-12 text-center pb-8">
        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-slate-200 bg-slate-50">
          <CheckCircle2 size={14} className="text-indigo-600" />
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">AI Certified Career Synthesis Report (공식 진단 리포트)</span>
        </div>
        <p className="mt-4 text-[9px] text-slate-300 uppercase tracking-[0.5em]">Issued by ColorHeart Can Synthesis Engine v3.9 Professional</p>
      </div>

      <div className="text-center opacity-30 py-10 print:hidden">
         <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.6em]">
           Advanced Career Synthesis Engine v3.9 Professional | All Data Analyzed
         </p>
      </div>
    </div>
  );
};

export default ResultStep;
