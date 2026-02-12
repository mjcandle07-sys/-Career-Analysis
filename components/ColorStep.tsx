
import React from 'react';
import { BaseColor } from '../types';
import { COLORS } from '../constants';

interface Props {
  onSelect: (color: BaseColor) => void;
}

const ColorStep: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="space-y-12 animate-in fade-in zoom-in-95 duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">지금 끌리는 색을 선택하세요</h2>
        <p className="text-slate-500">CRR(Color Reflection Reading)을 통해 당신의 에너지를 읽어냅니다.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {(Object.keys(COLORS) as BaseColor[]).map((key) => {
          const colorData = COLORS[key];
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className="group flex flex-col items-center gap-4 transition-transform hover:-translate-y-2"
            >
              {/* Simulated 3D Can */}
              <div className="relative w-24 h-40">
                <div className={`absolute inset-0 rounded-full ${colorData.bg} shadow-2xl opacity-20 blur-xl group-hover:opacity-40 transition-opacity`}></div>
                <div className={`relative w-full h-full rounded-2xl overflow-hidden border-2 ${colorData.border} ${colorData.bg} shadow-inner flex flex-col`}>
                  <div className="h-6 w-full bg-black/10 flex items-center justify-center">
                    <div className="w-12 h-1 bg-white/20 rounded-full"></div>
                  </div>
                  <div className="flex-1 flex items-center justify-center p-2">
                    <div className="text-white text-xs font-black rotate-90 whitespace-nowrap opacity-40 uppercase tracking-widest">
                      Color Heart
                    </div>
                  </div>
                  <div className="h-10 w-full bg-black/5 p-2 flex justify-end items-end">
                    <span className="text-white/30 text-[10px] font-mono">250ml</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="font-bold text-slate-800">{colorData.label}</div>
                <div className="text-[10px] text-slate-400 mt-1 max-w-[80px]">{colorData.desc}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ColorStep;
