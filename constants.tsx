
import React from 'react';
import { AgeGroup, BaseColor, Question } from './types';

export const COLORS: Record<BaseColor, { hex: string; bg: string; border: string; label: string; desc: string }> = {
  RED: { 
    hex: '#ef4444', 
    bg: 'bg-red-500', 
    border: 'border-red-600', 
    label: '빨강', 
    desc: '에너지, 주도성, 현실 지향' 
  },
  BLUE: { 
    hex: '#3b82f6', 
    bg: 'bg-blue-500', 
    border: 'border-blue-600', 
    label: '파랑', 
    desc: '분석, 냉철, 이성적 사고' 
  },
  YELLOW: { 
    hex: '#eab308', 
    bg: 'bg-yellow-400', 
    border: 'border-yellow-500', 
    label: '노랑', 
    desc: '희망, 아이디어, 관계 지향' 
  },
  GREEN: { 
    hex: '#22c55e', 
    bg: 'bg-green-500', 
    border: 'border-green-600', 
    label: '초록', 
    desc: '평화, 조화, 자연 친화' 
  },
  PURPLE: { 
    hex: '#a855f7', 
    bg: 'bg-purple-500', 
    border: 'border-purple-600', 
    label: '보라', 
    desc: '예술, 창의성, 신비로운 영감' 
  },
};

const commonOptions = ['전혀 아니다', '아니다', '보통', '그렇다', '매우 그렇다'];
const colorOptions = ['빨강', '노랑', '파랑', '초록', '보라'];

export const QUESTIONS: Record<AgeGroup, Question[]> = {
  [AgeGroup.DREAM_TREE]: [
    // Stage 1
    { id: 'dt_s1_p', category: 'psych', text: '학교 가는 길, 내 마음은 무슨 색깔일까요?', theory: '정서지능', options: colorOptions },
    { id: 'dt_s1_c1', category: 'career', text: '나는 책을 읽거나 글 쓰는 것이 재미있다.', theory: '언어지능', options: commonOptions },
    { id: 'dt_s1_c2', category: 'career', text: '나는 숫자의 규칙을 찾아내는 것이 즐겁다.', theory: '논리수학지능', options: commonOptions },
    { id: 'dt_s1_c3', category: 'career', text: '나는 지도를 보거나 길을 찾는 데 자신 있다.', theory: '공간지능', options: commonOptions },
    { id: 'dt_s1_c4', category: 'career', text: '나는 몸을 움직여 운동하는 활동을 좋아한다.', theory: '신체운동지능', options: commonOptions },
    // Stage 2
    { id: 'dt_s2_p', category: 'psych', text: '친구와 놀 때 내 기분은 어떤 색에 가까울까요?', theory: '대인관계지능', options: colorOptions },
    { id: 'dt_s2_c1', category: 'career', text: '나는 악기 연주나 노래 부르는 것을 좋아한다.', theory: '음악지능', options: commonOptions },
    { id: 'dt_s2_c2', category: 'career', text: '나는 다른 사람의 기분을 잘 이해한다.', theory: '대인관계지능', options: commonOptions },
    { id: 'dt_s2_c3', category: 'career', text: '나는 내 생각이나 감정을 잘 알고 있다.', theory: '자기이해지능', options: commonOptions },
    { id: 'dt_s2_c4', category: 'career', text: '나는 동물이나 식물 관찰하는 것을 즐긴다.', theory: '자연친화지능', options: commonOptions },
    // Stage 3
    { id: 'dt_s3_p', category: 'psych', text: '어려운 문제를 풀 때 내 마음의 색깔은?', theory: '문제해결지능', options: colorOptions },
    { id: 'dt_s3_c1', category: 'career', text: '나는 이야기 지어내는 것을 좋아한다.', theory: '언어지능', options: commonOptions },
    { id: 'dt_s3_c2', category: 'career', text: '나는 암산이나 수학 퀴즈가 재미있다.', theory: '논리수학지능', options: commonOptions },
    { id: 'dt_s3_c3', category: 'career', text: '나는 사물을 입체적으로 생각하는 편이다.', theory: '공간지능', options: commonOptions },
    { id: 'dt_s3_c4', category: 'career', text: '나는 만들기나 조립을 아주 잘한다.', theory: '신체운동지능', options: commonOptions },
    // Stage 4
    { id: 'dt_s4_p', category: 'psych', text: '10년 뒤 나의 미래를 상상하면 떠오르는 색은?', theory: '희망지수', options: colorOptions },
    { id: 'dt_s4_c1', category: 'career', text: '나는 주변의 소리나 리듬을 잘 포착한다.', theory: '음악지능', options: commonOptions },
    { id: 'dt_s4_c2', category: 'career', text: '나는 친구들에게 조언을 잘 해준다.', theory: '대인관계지능', options: commonOptions },
    { id: 'dt_s4_c3', category: 'career', text: '나는 나만의 목표를 세우고 실천하는 편이다.', theory: '자기이해지능', options: commonOptions },
    { id: 'dt_s4_c4', category: 'career', text: '나는 환경 보호나 자연에 관심이 많다.', theory: '자연친화지능', options: commonOptions },
  ],
  [AgeGroup.CAREER_PATH]: [
    // Stage 1
    { id: 'cp_s1_p', category: 'psych', text: '지금 나에게 가장 필요한 에너지는 어떤 색인가요?', theory: '학습동기', options: colorOptions },
    { id: 'cp_s1_c1', category: 'career', text: '기계나 도구를 사용하여 물건을 고치는 것이 좋다.', theory: 'Holland-R', options: commonOptions },
    { id: 'cp_s1_c2', category: 'career', text: '새로운 사실을 탐구하고 원인을 분석하는 것이 즐겁다.', theory: 'Holland-I', options: commonOptions },
    { id: 'cp_s1_c3', category: 'career', text: '창의적인 아이디어를 내거나 예술 활동을 선호한다.', theory: 'Holland-A', options: commonOptions },
    { id: 'cp_s1_c4', category: 'career', text: '사람들을 가르치거나 도와주는 일에 보람을 느낀다.', theory: 'Holland-S', options: commonOptions },
    // Stage 2
    { id: 'cp_s2_p', category: 'psych', text: '전공 과제를 할 때 내 태도를 색으로 표현한다면?', theory: '자기효능감', options: colorOptions },
    { id: 'cp_s2_c1', category: 'career', text: '조직을 이끌거나 남을 설득하는 일이 자신 있다.', theory: 'Holland-E', options: commonOptions },
    { id: 'cp_s2_c2', category: 'career', text: '정해진 규칙이나 절차를 따르는 체계적인 일이 좋다.', theory: 'Holland-C', options: commonOptions },
    { id: 'cp_s2_c3', category: 'career', text: '직접 몸을 써서 결과물을 만들어내는 것이 좋다.', theory: 'Holland-R', options: commonOptions },
    { id: 'cp_s2_c4', category: 'career', text: '학문적인 연구나 실험을 꾸준히 할 수 있다.', theory: 'Holland-I', options: commonOptions },
    // Stage 3
    { id: 'cp_s3_p', category: 'psych', text: '시험 기간, 나의 스트레스 지수를 색으로 표현하면?', theory: '회복탄력성', options: colorOptions },
    { id: 'cp_s3_c1', category: 'career', text: '나만의 독창적인 결과물을 만드는 것이 중요하다.', theory: 'Holland-A', options: commonOptions },
    { id: 'cp_s3_c2', category: 'career', text: '팀 프로젝트에서 갈등을 중재하는 역할을 선호한다.', theory: 'Holland-S', options: commonOptions },
    { id: 'cp_s3_c3', category: 'career', text: '비즈니스적인 성과를 내는 것에 열정이 있다.', theory: 'Holland-E', options: commonOptions },
    { id: 'cp_s3_c4', category: 'career', text: '데이터를 꼼꼼하게 정리하고 기록하는 것이 편하다.', theory: 'Holland-C', options: commonOptions },
    // Stage 4
    { id: 'cp_s4_p', category: 'psych', text: '첫 출근 날 매고 싶은 넥타이/스카프 색깔은?', theory: '직업가치관', options: colorOptions },
    { id: 'cp_s4_c1', category: 'career', text: '야외 활동이나 실습 중심의 학습을 좋아한다.', theory: 'Holland-R', options: commonOptions },
    { id: 'cp_s4_c2', category: 'career', text: '복잡한 이론적 문제를 논리적으로 푸는 것을 즐긴다.', theory: 'Holland-I', options: commonOptions },
    { id: 'cp_s4_c3', category: 'career', text: '자유롭고 형식에 얽매이지 않는 환경에서 잘 일한다.', theory: 'Holland-A', options: commonOptions },
    { id: 'cp_s4_c4', category: 'career', text: '사회적인 봉사나 공헌 활동에 참여하고 싶다.', theory: 'Holland-S', options: commonOptions },
  ],
  [AgeGroup.MIND_RESET]: [
    // Stage 1
    { id: 'mr_s1_p', category: 'psych', text: '현재 내 직장 생활을 한 가지 색으로 표현한다면?', theory: '직무만족도', options: colorOptions },
    { id: 'mr_s1_c1', category: 'career', text: '나의 성취감을 느끼는 것이 무엇보다 중요하다.', theory: '가치관-성취', options: commonOptions },
    { id: 'mr_s1_c2', category: 'career', text: '안정적인 수입과 고용이 가장 우선이다.', theory: '가치관-안정성', options: commonOptions },
    { id: 'mr_s1_c3', category: 'career', text: '업무 시간의 자율성이 보장되는 환경이 좋다.', theory: '가치관-자율성', options: commonOptions },
    { id: 'mr_s1_c4', category: 'career', text: '충분한 경제적 보상이 가장 큰 동기부여가 된다.', theory: '가치관-보상', options: commonOptions },
    // Stage 2
    { id: 'mr_s2_p', category: 'psych', text: '번아웃을 느낄 때 내 마음의 심연은 어떤 색인가요?', theory: '번아웃지수', options: colorOptions },
    { id: 'mr_s2_c1', category: 'career', text: '타인에게 도움을 주는 일을 할 때 보람을 느낀다.', theory: '가치관-봉사', options: commonOptions },
    { id: 'mr_s2_c2', category: 'career', text: '직장 내에서 인정받고 영향력을 발휘하고 싶다.', theory: '가치관-인정', options: commonOptions },
    { id: 'mr_s2_c3', category: 'career', text: '새로운 기술을 배우고 자기계발을 하는 편이다.', theory: '역량-자기개발', options: commonOptions },
    { id: 'mr_s2_c4', category: 'career', text: '전문성을 살려 나만의 커리어를 구축하고 싶다.', theory: '역량-전문성', options: commonOptions },
    // Stage 3
    { id: 'mr_s3_p', category: 'psych', text: '성공적인 이직 후 첫 번째 연봉 협상 날, 나의 아우라 색깔은?', theory: '자존감', options: colorOptions },
    { id: 'mr_s3_c1', category: 'career', text: '나는 일과 삶의 균형(워라밸)을 포기할 수 없다.', theory: '가치관-워라밸', options: commonOptions },
    { id: 'mr_s3_c2', category: 'career', text: '조직 문화가 유연하고 소통이 잘 되는 곳이 좋다.', theory: '가치관-소통', options: commonOptions },
    { id: 'mr_s3_c3', category: 'career', text: '변화가 많고 도전적인 업무 환경을 선호한다.', theory: '역량-변화관리', options: commonOptions },
    { id: 'mr_s3_c4', category: 'career', text: '복지 혜택이나 근무 인프라가 중요하다.', theory: '가치관-환경', options: commonOptions },
    // Stage 4
    { id: 'mr_s4_p', category: 'psych', text: '은퇴 후 제2의 인생을 상상하면 떠오르는 색은?', theory: '생애설계', options: colorOptions },
    { id: 'mr_s4_c1', category: 'career', text: '사회적 명성이나 지위가 직업 선택의 기준이다.', theory: '가치관-명예', options: commonOptions },
    { id: 'mr_s4_c2', category: 'career', text: '재택 근무나 유연 근무제 등을 적극 활용하고 싶다.', theory: '가치관-자율성', options: commonOptions },
    { id: 'mr_s4_c3', category: 'career', text: '창업이나 독립적인 프리랜서 활동에 관심이 있다.', theory: '역량-창업가정신', options: commonOptions },
    { id: 'mr_s4_c4', category: 'career', text: '취미 생활을 직업으로 연결하고 싶은 마음이 크다.', theory: '역량-적성결합', options: commonOptions },
  ]
};
