
export enum AgeGroup {
  DREAM_TREE = 'DREAM_TREE', // 초중등
  CAREER_PATH = 'CAREER_PATH', // 고대생
  MIND_RESET = 'MIND_RESET' // 성인
}

export type BaseColor = 'RED' | 'BLUE' | 'YELLOW' | 'GREEN' | 'PURPLE';

export interface UserProfile {
  name: string;
  ageGroup: AgeGroup;
  selectedColor: BaseColor | null;
}

export interface Question {
  id: string;
  category: 'psych' | 'career';
  text: string;
  theory: string;
  options?: string[];
  imagePairs?: { label: string; url: string }[];
}

export interface DiagnosisState {
  answers: Record<string, number | string | string[]>;
}

export interface CareerRecommendation {
  title: string;
  reason: string;
}

export interface ResultData {
  persona: string;
  keyword: string; // 추가된 속성
  summary: string;
  chartData: { subject: string; value: number; fullMark: number }[];
  careerFactorInterpretation: string;
  energyBalance: { 
    theoryScore: number; 
    psychEnergy: number;
    interpretation: string;
    status: string;
  };
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  actionPlan: {
    careers: CareerRecommendation[];
    colorTherapy: string;
    colorTherapyReason: string;
    scentTherapy: string;
    immediateAction: string;
  };
}
