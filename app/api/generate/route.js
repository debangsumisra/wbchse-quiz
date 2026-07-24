// app/api/generate/route.js
import { GoogleGenAI } from "@google/genai";
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
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              id: { type: "INTEGER" },
              question: { type: "STRING" },
              options: { 
                type: "ARRAY", 
                items: { type: "STRING" } 
              },
              correctAnswer: { type: "INTEGER", description: "Index 0 to 3" },
            },
            required: ["id", "question", "options", "correctAnswer"],
          },
        },
      },
    });

    // Safely clean potential markdown wrappers before parsing
    let rawText = response.text ? response.text.trim() : "[]";
    if (rawText.startsWith("```")) {
      rawText = rawText.replace(/^```(json)?/i, "").replace(/```$/, "").trim();
    }

    const questions = JSON.parse(rawText);
    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Gemini Route Error:", error);
    return NextResponse.json({ error: error.message, questions: [] }, { status: 500 });
  }
}