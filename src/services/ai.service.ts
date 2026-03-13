// src/services/ai.service.ts

import { GoogleGenAI } from '@google/genai';

// Initialize the SDK using your NEXT_PUBLIC key
const ai = new GoogleGenAI({ 
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY as string 
});

export const generateAIContent = async (prompt: string, systemInstruction?: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                { role: 'user', parts: [{ text: prompt }] }
            ],
            config: {
                // Set the persona and strict rules here
                systemInstruction: systemInstruction || "You are an expert e-commerce copywriter. Provide clean, highly converting product copy.",
                temperature: 0.7, // 0.7 is a good sweet spot for creative but structured copywriting
            }
        });

        let aiText = response.text || "";

        // Strip out markdown code block wrappers if Gemini accidentally wraps HTML or plain text in them
        aiText = aiText.replace(/^```[a-z]*\n/i, "").replace(/\n```$/i, "").trim();

        return aiText;
    } catch (error) {
        console.error("Gemini AI Error:", error);
        throw new Error("Failed to generate content. Ensure your API key is valid and you have an internet connection.");
    }
};