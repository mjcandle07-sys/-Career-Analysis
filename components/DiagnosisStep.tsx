
import React, { useState } from 'react';
import { AgeGroup, Question } from '../types';
import { QUESTIONS, COLORS } from '../constants';
import { ArrowRight, ArrowLeft, Heart } from 'lucide-react';

interface Props {
  ageGroup: AgeGroup;
  onComplete: (answers: Record<string, any>) => void;
}

const STAGE_TITLES = [
  "Stage 1: 무의식의 탐색",
  "Stage 2: 가능성의 발견",
  "Stage 3: 현실의 조율",
  "Stage 4: 미래의 설계"
];

const STAGE_COLORS = ['#ef4444', '#3b82f6', '#eab308', '#22c55e'];

const DiagnosisStep: React.FC<Props> = ({ ageGroup, onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  
  // Safety check: ensure we always have questions
  const questions = QUESTIONS[ageGroup] || QUESTIONS[AgeGroup.DREAM_TREE];
  const currentQ = questions[currentIdx] || questions[0];

  const currentStage = Math.floor(currentIdx / 5);
  const stageProgress = ((currentIdx % 5) + 1) / 5 * 100;

  const handleAnswer = (val: any) => {
    const updated = { ...answers, [currentQ.id]: val };
    setAnswers(updated);
    
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      onComplete(updated);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
      {/* Stage Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase">
          {STAGE_TITLES[currentStage]}
        </h2>
        <div className="flex items-center justify-center gap-3">
          <div className="h-2 w-48 bg-slate-200 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full transition-all duration-700 ease-out" 
              style={{ width: `${stageProgress}%`, backgroundColor: STAGE_COLORS[currentStage] }}
            />
          </div>
          <span className="text-xs font-black text-slate-400 font-mono tracking-tighter">{currentIdx + 1} / {questions.length}</span>
        </div>
      </div>

      <div className="bg-white p-8 md:p-14 rounded-[50px] shadow-2xl shadow-indigo-100/50 border border-slate-50 min-h-[480px] flex flex-col items-center justify-center text-center relative overflow-hidden group">
        {/* Background Accent */}
        <div 
          className="absolute -top-32 -right-32 w-64 h-64 rounded-full blur-[120px] opacity-10 transition-colors duration-1000 group-hover:opacity-20"
          style={{ backgroundColor: STAGE_COLORS[currentStage] }}
        ></div>

        <div className="space-y-12 w-full relative z-10">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-slate-100 blur-2xl rounded-full scale-150 opacity-50"></div>
              <Heart 
                fill={STAGE_COLORS[currentStage]} 
                stroke="none" 
                size={40} 
                className="animate-pulse relative z-10 drop-shadow-lg"
              />
            </div>
            <h3 className="text-2xl md:text-4xl font-black text-slate-900 leading-[1.3] break-keep max-w-xl">
              {currentQ.text}
            </h3>
          </div>

          {/* Answer Options */}
          <div className="w-full max-w-md mx-auto">
            {currentQ.category === 'psych' ? (
              <div className="grid grid-cols-5 gap-4">
                {['빨강', '노랑', '파랑', '초록', '보라'].map((colorName) => {
                  const colorKey = Object.keys(COLORS).find(k => COLORS[k as any].label === colorName) as any;
                  const c = COLORS[colorKey];
                  return (
                    <button
                      key={colorName}
                      type="button"
                      onClick={() => handleAnswer(colorName)}
                      className="group flex flex-col items-center gap-3 transition-all hover:-translate-y-2 active:scale-90"
                    >
                      <div className={`w-full aspect-[2/3] rounded-2xl ${c.bg} border-4 ${c.border} shadow-xl flex items-center justify-center relative overflow-hidden transition-all group-hover:shadow-2xl`}>
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
                        <span className="text-[9px] text-white/50 font-black rotate-90 uppercase tracking-widest whitespace-nowrap">Color Energy</span>
                      </div>
                      <span className="text-xs font-black text-slate-600">{colorName}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {currentQ.options?.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleAnswer(opt)}
                    className="w-full py-5 px-8 rounded-3xl border-2 border-slate-50 bg-slate-50/50 hover:border-indigo-500 hover:bg-indigo-50/50 text-left font-black transition-all flex justify-between items-center group shadow-sm hover:shadow-md"
                  >
                    <span className="text-lg group-hover:text-indigo-900 transition-colors">{opt}</span>
                    <ArrowRight size={22} className="text-slate-300 group-hover:text-indigo-600 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center px-6">
        {currentIdx > 0 ? (
          <button 
            type="button"
            onClick={() => setCurrentIdx(currentIdx - 1)}
            className="flex items-center gap-2 text-slate-400 text-sm font-black hover:text-indigo-600 transition-all group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> BACK
          </button>
        ) : <div />}
        <div className="text-[11px] font-black text-slate-300 uppercase tracking-[0.4em] bg-slate-100 px-4 py-1.5 rounded-full">
          {currentQ.theory} Analysis
        </div>
      </div>
    </div>
  );
};

export default DiagnosisStep;
