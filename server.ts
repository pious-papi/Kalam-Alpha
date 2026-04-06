import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Chat (Backend LLM Proxy)
  // This allows the user to easily swap LLMs (OpenAI, Anthropic, etc.)
  // without exposing keys to the frontend.
  app.post("/api/chat", async (req, res) => {
    const { messages, systemInstruction, modelChoice } = req.body;

    try {
      // Defaulting to Gemini, but structured to be swappable
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "API Key not configured on server" });
      }

      const ai = new GoogleGenAI({ apiKey });
      
      // You can add logic here to switch between models based on 'modelChoice'
      // e.g., if (modelChoice === 'openai') { ... }
      
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: messages.map((m: any) => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Backend Chat Error:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
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
