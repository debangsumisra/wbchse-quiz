// app/api/generate/route.js
import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req) {
  try {
    const { subject } = await req.json();

    const prompt = `Generate 10 multiple-choice questions (MCQs) for West Bengal Class 12 (WBCHSE) Semester 3 for the subject: ${subject}. 
    Ensure questions adhere strictly to the WBCHSE syllabus and use UTF-8 Bengali/Sanskrit characters where applicable.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              correctAnswer: { type: Type.INTEGER, description: "Index 0 to 3" },
            },
            required: ["id", "question", "options", "correctAnswer"],
          },
        },
      },
    });

    const questions = JSON.parse(response.text);
    return NextResponse.json({ questions });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}