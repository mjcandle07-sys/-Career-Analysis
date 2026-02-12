
import { GoogleGenAI, Type } from "@google/genai";
import { AgeGroup, BaseColor } from "../types";
import { QUESTIONS } from "../constants";

export const generateCareerReport = async (
  name: string,
  ageGroup: AgeGroup,
  baseColor: BaseColor,
  diagnosisData: Record<string, any>
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const questions = QUESTIONS[ageGroup] || [];
  const formattedAnswers = questions.map(q => {
    const answer = diagnosisData[q.id];
    return `질문: ${q.text}\n답변: ${answer}`;
  }).join('\n');

  const prompt = `
    당신은 세계적인 색채 심리학자이자 진로 설계 전문가입니다. 아래 사용자의 데이터를 정밀 분석하여 리포트를 작성하세요.
    
    [사용자 정보]
    이름: ${name}
    연령대: ${ageGroup}
    핵심 에너지 색상: ${baseColor}

    [진단 답변 내용]
    ${formattedAnswers}

    [분석 및 출력 지침]
    1. persona: 색채 특성과 진로 성향을 융합한 세련된 별칭.
    2. summary: 사용자의 현재 상태와 잠재력을 3-4문장으로 심층 요약. 중요한 키워드는 **볼드** 처리.
    3. chartData: [언어지능, 논리수학지능, 공간지능, 신체운동지능, 음악지능, 대인관계지능, 자기이해지능, 자연친화지능] 중 상위 5개. 절대 '간지능' 같은 오타를 내지 마세요.
    4. careerFactorInterpretation: 위 chartData의 5개 지표가 서로 어떤 시너지를 내고 있는지, 사용자의 지능 구조가 진로 선택에 어떤 의미를 갖는지 2-3문장으로 심층 해석하세요.
    5. energyBalance: 
       - theoryScore: 진로 질문 답변에 기반한 '역량 적합도' (0-100)
       - psychEnergy: 색채 질문 답변에 기반한 '심리적 활성도(추진력)' (0-100)
       - status: 두 점수의 관계를 나타내는 상태 (예: '최적의 균형', '잠재력 대기', '번아웃 위험')
       - interpretation: 역량 적합도(능력치)와 심리 추진력(동기)이 현재 어떻게 상호작용하고 있는지 상세히 해설하세요. (예: 역량은 높으나 동기가 낮은 경우의 의미 등)
    6. swot: 강점/약점/기회/위협 도출.
    7. actionPlan: 
       - careers: 추천 직업 3가지(title, reason).
       - colorTherapy: 처방할 색상 이름.
       - colorTherapyReason: 왜 이 색상이 현재 사용자에게 심리적/진로적으로 필요한지 이유 설명.
       - scentTherapy: 이 색채 에너지와 어울리는 아로마/향기 처방 (예: '상쾌한 유칼립투스 향', '안정감을 주는 샌달우드 향' 등).
       - immediateAction: 즉시 실행 과제.

    반드시 지정된 JSON 형식으로만 응답하세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            persona: { type: Type.STRING },
            keyword: { type: Type.STRING },
            summary: { type: Type.STRING },
            chartData: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  subject: { type: Type.STRING },
                  value: { type: Type.NUMBER },
                  fullMark: { type: Type.NUMBER }
                },
                required: ["subject", "value", "fullMark"]
              }
            },
            careerFactorInterpretation: { type: Type.STRING },
            energyBalance: {
              type: Type.OBJECT,
              properties: {
                theoryScore: { type: Type.NUMBER },
                psychEnergy: { type: Type.NUMBER },
                status: { type: Type.STRING },
                interpretation: { type: Type.STRING }
              },
              required: ["theoryScore", "psychEnergy", "status", "interpretation"]
            },
            swot: {
              type: Type.OBJECT,
              properties: {
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                threats: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["strengths", "weaknesses", "opportunities", "threats"]
            },
            actionPlan: {
              type: Type.OBJECT,
              properties: {
                careers: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      reason: { type: Type.STRING }
                    },
                    required: ["title", "reason"]
                  }
                },
                colorTherapy: { type: Type.STRING },
                colorTherapyReason: { type: Type.STRING },
                scentTherapy: { type: Type.STRING },
                immediateAction: { type: Type.STRING }
              },
              required: ["careers", "colorTherapy", "colorTherapyReason", "scentTherapy", "immediateAction"]
            }
          },
          required: ["persona", "keyword", "summary", "chartData", "careerFactorInterpretation", "energyBalance", "swot", "actionPlan"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("AI 응답이 비어있습니다.");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API 오류:", error);
    return null;
  }
};
