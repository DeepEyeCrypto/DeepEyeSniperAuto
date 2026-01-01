
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export class GeminiService {
  /**
   * Generates a response from the Gemini model.
   * Instantiates GoogleGenAI per call to ensure it uses the latest process.env.API_KEY.
   */
  async getResponse(prompt: string, context: string = ''): Promise<string> {
    try {
      // Use process.env.API_KEY directly and instantiate per call as per guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          systemInstruction: `You are DEEPEYE V5 ULTRA Core Intelligence. 
          Current Environment: High-performance Desktop Scaffold. 
          Backend: Rust (Tauri 2.0). 
          Memory Allocator: Mimalloc. 
          Respond with precision, technical depth, and a slightly futuristic tone. 
          Use Markdown for formatting. ${context}`,
          thinkingConfig: { thinkingBudget: 2000 }
        }
      });
      return response.text || 'Core Intelligence Error: No response received.';
    } catch (error) {
      console.error('Gemini API Error:', error);
      return `Critical communication failure: ${error instanceof Error ? error.message : 'Unknown exception'}`;
    }
  }

  /**
   * Streams a response from the Gemini model.
   * Instantiates GoogleGenAI per call to ensure it uses the latest process.env.API_KEY.
   */
  async streamResponse(prompt: string, onChunk: (chunk: string) => void) {
    try {
      // Use process.env.API_KEY directly and instantiate per call as per guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const result = await ai.models.generateContentStream({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          systemInstruction: 'You are DEEPEYE V5 ULTRA Core Intelligence.'
        }
      });

      for await (const chunk of result) {
        if (chunk.text) {
          onChunk(chunk.text);
        }
      }
    } catch (error) {
      console.error('Streaming error:', error);
    }
  }
}

export const geminiService = new GeminiService();
