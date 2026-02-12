
import React, { useState } from 'react';
import { AgeGroup } from '../types';
import { Users, GraduationCap, Briefcase, ChevronRight } from 'lucide-react';

interface Props {
  onComplete: (name: string, ageGroup: AgeGroup) => void;
}

const EntryStep: React.FC<Props> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(null);

  const isReady = name.trim().length > 0 && ageGroup !== null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-black tracking-tight text-slate-900">당신의 진로를 <span className="text-indigo-600">색칠</span>해볼까요?</h2>
        <p className="text-slate-500 font-medium">이름과 해당하는 연령대를 선택하면 맞춤형 분석이 시작됩니다.</p>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-[45px] shadow-[0_20px_50px_rgba(79,70,229,0.1)] border border-indigo-50/50 space-y-8 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
        
        <div className="space-y-4">
          <label className="block text-sm font-black text-slate-700 uppercase tracking-widest ml-1">Nickname / Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-6 py-5 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-0 outline-none transition-all text-lg font-bold placeholder:text-slate-300 shadow-sm"
            placeholder="어떻게 불러드릴까요?"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-black text-slate-700 uppercase tracking-widest ml-1">Target Category</label>
          <div className="grid grid-cols-1 gap-4">
            <button 
              type="button"
              onClick={() => setAgeGroup(AgeGroup.DREAM_TREE)}
              className={`group flex items-center gap-5 p-5 rounded-[28px] border-2 transition-all duration-300 ${ageGroup === AgeGroup.DREAM_TREE ? 'border-indigo-500 bg-indigo-50/50 shadow-md translate-x-1' : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'}`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${ageGroup === AgeGroup.DREAM_TREE ? 'bg-indigo-600 text-white' : 'bg-green-100 text-green-600'}`}>
                <Users size={28} />
              </div>
              <div className="text-left flex-1">
                <div className={`font-black text-lg ${ageGroup === AgeGroup.DREAM_TREE ? 'text-indigo-900' : 'text-slate-800'}`}>꿈나무 (초·중등)</div>
                <div className="text-sm text-slate-400 font-medium">나의 숨겨진 잠재력을 발견해요.</div>
              </div>
              {ageGroup === AgeGroup.DREAM_TREE && <ChevronRight className="text-indigo-500" />}
            </button>

            <button 
              type="button"
              onClick={() => setAgeGroup(AgeGroup.CAREER_PATH)}
              className={`group flex items-center gap-5 p-5 rounded-[28px] border-2 transition-all duration-300 ${ageGroup === AgeGroup.CAREER_PATH ? 'border-indigo-500 bg-indigo-50/50 shadow-md translate-x-1' : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'}`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${ageGroup === AgeGroup.CAREER_PATH ? 'bg-indigo-600 text-white' : 'bg-blue-100 text-blue-600'}`}>
                <GraduationCap size={28} />
              </div>
              <div className="text-left flex-1">
                <div className={`font-black text-lg ${ageGroup === AgeGroup.CAREER_PATH ? 'text-indigo-900' : 'text-slate-800'}`}>커리어 패스 (고등·대학)</div>
                <div className="text-sm text-slate-400 font-medium">나에게 맞는 학과와 직무를 매칭해요.</div>
              </div>
              {ageGroup === AgeGroup.CAREER_PATH && <ChevronRight className="text-indigo-500" />}
            </button>

            <button 
              type="button"
              onClick={() => setAgeGroup(AgeGroup.MIND_RESET)}
              className={`group flex items-center gap-5 p-5 rounded-[28px] border-2 transition-all duration-300 ${ageGroup === AgeGroup.MIND_RESET ? 'border-indigo-500 bg-indigo-50/50 shadow-md translate-x-1' : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'}`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${ageGroup === AgeGroup.MIND_RESET ? 'bg-indigo-600 text-white' : 'bg-orange-100 text-orange-600'}`}>
                <Briefcase size={28} />
              </div>
              <div className="text-left flex-1">
                <div className={`font-black text-lg ${ageGroup === AgeGroup.MIND_RESET ? 'text-indigo-900' : 'text-slate-800'}`}>마인드 리셋 (성인)</div>
                <div className="text-sm text-slate-400 font-medium">경력 재설계와 현재 상태를 체크해요.</div>
              </div>
              {ageGroup === AgeGroup.MIND_RESET && <ChevronRight className="text-indigo-500" />}
            </button>
          </div>
        </div>

        <button 
          type="button"
          disabled={!isReady}
          onClick={() => isReady && onComplete(name.trim(), ageGroup!)}
          className={`w-full py-5 rounded-2xl font-black text-xl shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${
            isReady 
            ? 'bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700' 
            : 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
          }`}
        >
          진단 시작하기 <ChevronRight size={20} />
        </button>
      </div>
      
      <p className="text-center text-slate-400 text-xs font-bold">진단에는 약 3~5분이 소요됩니다.</p>
    </div>
  );
};

export default EntryStep;
