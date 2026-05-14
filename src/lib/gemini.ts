import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface VideoAnalysisResult {
  scores: {
    editing: number;
    audio: number;
    color: number;
    engagement: number;
    viralPotential: number;
    overall: number;
  };
  hookAnalysis: {
    attentionGrab: boolean;
    pacing: string;
    visualStart: string;
    feedback: string;
  };
  suggestions: string[];
  weaknesses: string[];
  strengths: string[];
}

export const analyzeVideoFrames = async (framesBase64: string[]): Promise<VideoAnalysisResult> => {
  const model = "gemini-3-flash-preview";
  
  const parts: any[] = framesBase64.map(frame => ({
    inlineData: {
      data: frame,
      mimeType: "image/jpeg"
    }
  }));

  parts.push({
    text: `You are an expert video editor, YouTuber, and viral content strategist. 
I have uploaded a few frames from a short-form video (Reel/TikTok). 
Analyze these frames for visual quality, color grading, shot composition, and initial hook strength.
Infer potential engagement and edit pacing based on the visuals.
Provide a professional rating and detailed improvement suggestions.`
  });

  const response = await ai.models.generateContent({
    model,
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          scores: {
            type: Type.OBJECT,
            properties: {
              editing: { type: Type.NUMBER, description: "Score out of 10 for editing/visuals" },
              audio: { type: Type.NUMBER, description: "Estimated score out of 10 for audio quality" },
              color: { type: Type.NUMBER, description: "Score out of 10 for color grading" },
              engagement: { type: Type.NUMBER, description: "Score out of 10 for predicted engagement" },
              viralPotential: { type: Type.NUMBER, description: "Score out of 10 for viral potential" },
              overall: { type: Type.NUMBER, description: "Overall score out of 10" },
            },
            required: ["editing", "audio", "color", "engagement", "viralPotential", "overall"]
          },
          hookAnalysis: {
            type: Type.OBJECT,
            properties: {
              attentionGrab: { type: Type.BOOLEAN, description: "Does the opening frame look attention grabbing?" },
              pacing: { type: Type.STRING, description: "Assessment of visual pacing/cuts" },
              visualStart: { type: Type.STRING, description: "Assessment of the opening visual" },
              feedback: { type: Type.STRING, description: "Constructive feedback on the hook" }
            },
            required: ["attentionGrab", "pacing", "visualStart", "feedback"]
          },
          suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of 5 specific, actionable ways to improve the video"
          },
          weaknesses: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of 2-3 main weaknesses or flaws"
          },
          strengths: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of 2-3 main strengths"
          }
        },
        required: ["scores", "hookAnalysis", "suggestions", "weaknesses", "strengths"]
      }
    }
  });

  const text = response.text || "{}";
  return JSON.parse(text.trim()) as VideoAnalysisResult;
};
