import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "AIzaSyCKzcMZcifQj5CA37zlzoCTCz2ksqxH42M" });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));

  // API routes FIRST
  app.post("/api/analyze", async (req, res) => {
    try {
      const { framesBase64 } = req.body;
      const model = "gemini-2.5-flash"; // fall back to 2.5 flash as 3 might not work or preview
      
      const parts: any[] = framesBase64.map((frame: string) => ({
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
      res.json(JSON.parse(text.trim()));
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
