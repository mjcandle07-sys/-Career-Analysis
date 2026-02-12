
import React, { useState } from 'react';
import { AgeGroup, UserProfile, DiagnosisState, ResultData, BaseColor } from './types';
import EntryStep from './components/EntryStep';
import DiagnosisStep from './components/DiagnosisStep';
import ResultStep from './components/ResultStep';
import { generateCareerReport } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [user, setUser] = useState<UserProfile>({ 
    name: '', 
    ageGroup: AgeGroup.DREAM_TREE, 
    selectedColor: null 
  });
  const [diagnosis, setDiagnosis] = useState<DiagnosisState>({ answers: {} });
  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleEntryComplete = (name: string, ageGroup: AgeGroup) => {
    setUser({ name, ageGroup, selectedColor: null });
    setStep(3); 
  };

  const handleDiagnosisComplete = async (answers: Record<string, any>) => {
    // 현재 상태 캡처
    const currentName = user.name;
    const currentAgeGroup = user.ageGroup;

    setDiagnosis({ answers });
    setLoading(true);
    setError(false);
    setStep(4);
    
    try {
      // 심리 질문 답변 기반 컬러 추출
      const psychAnswers = Object.keys(answers)
        .filter(key => key.includes('_p'))
        .map(key => answers[key]);
      
      const colorMap: Record<string, BaseColor> = {
        '빨강': 'RED', '파랑': 'BLUE', '노랑': 'YELLOW', '초록': 'GREEN', '보라': 'PURPLE'
      };
      
      const finalColorLabel = psychAnswers[psychAnswers.length - 1] || '파랑';
      const derivedColor = colorMap[finalColorLabel] || 'BLUE';

      setUser(prev => ({ ...prev, selectedColor: derivedColor }));
      
      // API 호출
      const report = await generateCareerReport(currentName, currentAgeGroup, derivedColor, answers);
      
      if (report) {
        setResult(report);
        setLoading(false);
      } else {
        throw new Error("Report generation failed");
      }
    } catch (e) {
      console.error("Critical Analysis Error:", e);
      setError(true);
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(1);
    setUser({ name: '', ageGroup: AgeGroup.DREAM_TREE, selectedColor: null });
    setDiagnosis({ answers: {} });
    setResult(null);
    setLoading(false);
    setError(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900">
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200 py-3 px-6 flex justify-between items-center print:hidden shadow-sm">
        <h1 className="text-lg font-black text-indigo-600 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs">C</span>
          ColorHeart Can
        </h1>
        {step > 1 && (
          <button 
            type="button"
            onClick={reset} 
            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors bg-slate-100 px-3 py-1.5 rounded-full"
          >
            Reset
          </button>
        )}
      </header>

      <main className={`pt-20 pb-12 px-4 mx-auto min-h-screen flex flex-col justify-center transition-all duration-500 ${step === 4 ? 'max-w-4xl' : 'max-w-xl'}`}>
        {step === 1 && <EntryStep onComplete={handleEntryComplete} />}
        {step === 3 && (
          <DiagnosisStep 
            ageGroup={user.ageGroup} 
            onComplete={handleDiagnosisComplete} 
          />
        )}
        {step === 4 && (
          <ResultStep 
            loading={loading} 
            error={error}
            user={user} 
            result={result} 
            onRestart={reset}
            onRetry={() => handleDiagnosisComplete(diagnosis.answers)}
          />
        )}
      </main>

      <footer className="py-6 text-center border-t border-slate-100 bg-white print:hidden">
        <div className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em]">
          Powered by ColorHeart AI Synthesis
        </div>
      </footer>
    </div>
  );
};

export default App;
