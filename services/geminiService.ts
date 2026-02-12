
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
    당신은 세계적인 색채 심리학자이자 진로 설계 전문가입니다. 아래 사용자의 데이터를 분석하여 전문적인 리포트를 작성하세요.
    
    [사용자 정보]
    이름: ${name}
    연령대: ${ageGroup}
    핵심 에너지 색상: ${baseColor}

    [진단 데이터]
    ${formattedAnswers}

    [작성 가이드라인]
    1. persona: 사용자의 강점을 한 단어로 정의한 세련된 별칭 (예: 전략적 아이디어 뱅크)
    2. keyword: 성향을 나타내는 3가지 핵심 키워드
    3. summary: 현재 상태와 잠재력을 3-4문장으로 심층 요약. 중요한 단어는 **볼드** 처리.
    4. energyBalance: 역량 적합도(theoryScore, 0-100), 심리 에너지(psychEnergy, 0-100), 상태 요약(status), 상세 해석(interpretation).
    5. swot: 강점, 약점, 기회, 위협을 각각 2개씩 도출.
    6. actionPlan: 
       - careers: 추천 경로 3가지(title, reason). CAREER_PATH인 경우 반드시 '학과명 - 직무명' 형식을 사용.
       - colorTherapy: 심리 안정을 돕는 보완 색상.
       - scentTherapy: 추천 향기.
       - immediateAction: 지금 즉시 실천할 수 있는 한 문장 행동 지침.

    반드시 전문적이고 신뢰감 있는 톤으로 작성하며, 지정된 JSON 형식으로만 응답하세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
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
