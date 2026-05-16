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
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ framesBase64 }),
  });

  if (!response.ok) {
    let errText = await response.text();
    try {
      const errJson = JSON.parse(errText);
      errText = errJson.error?.message || errJson.error || errText;
    } catch (e) {}
    throw new Error(`Analysis failed: ${errText}`);
  }

  return response.json();
};
