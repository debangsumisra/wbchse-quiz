// app/api/generate/route.js
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYLLABUS_MAP = {
  "Bengali": `
### BENGALI 'A' (BNGA) — Full Marks: 40
* গল্প (8 Marks): 'আদরিনী' - প্রভাত কুমার মুখোপাধ্যায়
* কবিতা (7 Marks):
  1. 'অন্ধকার লেখাগুচ্ছ' - শ্রীজাত
  2. 'দ্বিগ্বিজয়ের রূপকথা' - নবনীতা দেবসেন
* প্রবন্ধ (5 Marks): 'বাঙ্গালা ভাষা' - স্বামী বিবেকানন্দ
* ভারতীয় গল্প (5 Marks Total with Int. Poetry): 'পোটরাজ' - শঙ্কর রাও খারাট (অনুবাদ: সুনন্দন চক্রবর্তী)
* আন্তর্জাতিক কবিতা: 'তার সঙ্গে' - পাবলো নেরুদা (অনুবাদ: শক্তি চট্টোপাধ্যায়)
* ভাষা (10 Marks):
  1. ভাষাবিজ্ঞান ও তার শাখা-প্রশাখা
  2. ধ্বনিতত্ত্ব
  3. শব্দার্থতত্ত্ব
* বাংলা শিল্প সাহিত্য ও সংস্কৃতির ইতিহাস (5 Marks):
  1. বাংলাগানের ইতিহাস
  2. বাঙালির বিজ্ঞানচর্চার সংক্ষিপ্ত রূপরেখা
  3. বাঙালির ক্রীড়া সংস্কৃতির সংক্ষিপ্ত পরিচিতি
`,
  "English": `
### ENGLISH 'B' (ENGB) — Full Marks: 40
* Unit 1: Prose (10 Marks):
  1. 'The Night Train at Deoli' by Ruskin Bond (4 Marks)
  2. 'Strong Roots' (Extract from 'Wings of Fire') by A.P.J. Abdul Kalam (3 Marks)
  3. 'The Bet' by Anton Chekhov (3 Marks)
* Unit 2: Verse (10 Marks):
  1. 'Our Casuarina Tree' by Toru Dutt (5 Marks)
  2. 'Ulysses' by Alfred Lord Tennyson (5 Marks)
* Unit 3: Drama (5 Marks):
  1. 'Riders to the Sea' by J.M. Synge
* Unit 4: Textual Grammar (5 Marks):
  * Synthesis and Splitting of Sentences, Change of Narration, Correction of Errors (from Prose & Verse texts).
* Unit 5: Reading Comprehension - Unseen (10 Marks):
  * 5 Grammar/Vocabulary Items + 5 Text-based Inference Questions.
`,
  "Philosophy": `
### PHILOSOPHY (PHIL) — Full Marks: 40
* Unit 1: Introduction to Metaphysics (20 Marks):
  * Western Metaphysics:
    * Substance: Rationalists (Descartes, Spinoza, Leibnitz) vs Empiricists (Locke, Berkeley, Hume).
    * Causality: Regularity Theory & Entailment Theory.
    * Mind-Body Problem: Interactionism & Parallelism.
  * Indian Metaphysics: Vedanta (Basic concepts, Brahman & Maya according to Sankaracharya).
* Unit 2: Ethics & Social/Political Philosophy (20 Marks):
  * Practical Ethics: Suicide and Euthanasia.
  * Environmental Ethics: Nature and Scope.
  * Social and Political Philosophy: Society, Community, Association, Institutions, State, Law.
`,
  "Computer Science": `
### MODERN COMPUTER APPLICATION (COMA) — Full Marks: 35
* Unit 1: Python Programming (25 Marks):
  * Basics (Features, execution modes, tokens, variables, l-value/r-value, comments).
  * Data types (Number, Boolean, Sequence, None, Mapping, Mutable vs Immutable).
  * Operators (Arithmetic, relational, logical, assignment, augmented, identity, membership).
  * Expressions, type conversion, input/output.
  * Errors (Syntax, logical, run-time).
  * Flow of Control (indentation, if, if-else, if-elif-else).
  * Iterative Statements (for, range(), while, break, continue, nested loops).
  * Strings & String methods (len, capitalize, title, lower, upper, count, find, index, endswith, startswith, isalnum, isalpha, isdigit, islower, isupper, isspace, lstrip, rstrip, strip, replace, join, partition, split).
  * Lists & List operations (len, list, append, extend, insert, count, index, remove, pop, reverse, sort, sorted, min, max, sum, nested lists).
  * Modules (math, random, statistics).
  * Functions (built-in, module, user-defined, positional/default arguments, scope).
* Unit 2: E-Commerce (10 Marks):
  * Definitions, Types (C2C, B2B, B2C, G2G, etc.), Technical components, Internet/Intranet/Extranet, Banner, Shopping Bots.
  * Electronic Payment Systems (Credit cards, EFT, E-cash, paperless bills).
  * Internet Marketing (PROS/CONS, techniques, E-cycle, Personalization).
`,
  "Education": `
### EDUCATION (EDCN) — Full Marks: 40 Theory
* Group-A: Education in Modern India (20 Marks):
  * Unit I: Post-Independent Period (University Ed. Commission 1948-49, Secondary Ed. Commission 1952-53, Kothari Commission 1964-66, NEP 1986 & NEP 2020, Women/SC/ST/OBC/EWS Education).
  * Unit II: Contributions of Great Educators (Tagore, Vivekananda, Gandhi, Rousseau, Dewey).
* Group-B: Recent Trends & Issues in Modern Education (20 Marks):
  * Unit I: Inclusive Education (Differently Abled, Visually/Hearing Impaired, Autism, Learning Disability, Intellectual Disability, Barriers).
  * Unit II: Education for All (Delors Commission 4 Pillars, Universalization of Elementary Ed, Positive Psychology).
`,
  "Sanskrit": `
### SANSKRIT (SNSK) — Full Marks: 40
* Part I: Sanskrit Literature (15 Marks):
  * Prose: 'রাজবাহনচরিতম্' (দশকুমারচরিতম্)
  * Poetry: 'যোগঃ কর্মসু কৌশলম' (শ্রীমদ্ভগবদগীতা)
  * Drama: 'বীরঃ সর্বদমনঃ' (অভিজ্ঞান-শাকুন্তলম)
* Part II: Grammar & History of Literature (25 Marks):
  * Grammar:
    * Taddhita Suffixes (অণ, মতুপ, তরপ, ঈয়সুন, তমপ, ইষ্ঠন).
    * Nāmadhātu Suffixes (কাম্যচ্, কাচ্, ক্যঙ্).
    * Case-endings (কর্তৃ, কর্ম, করণ).
    * Compounds (অব্যয়ীভাব, তৎপুরুষ).
* History of Classical Literature: Purāṇas; Literary works of Bhāsa, Kālidāsa, Bhavabhūti; Works of Āryabhaṭa & Brahmagupta.
`
};

export async function POST(req) {
  try {
    const { subject } = await req.json();
    const syllabus = SYLLABUS_MAP[subject] || `WBCHSE Semester 3 ${subject} Syllabus`;

    const prompt = `You are an expert exam setter specializing in the NEW West Bengal Council of Higher Secondary Education (WBCHSE) Semester-III MCQ-based syllabus.
Your job is to strictly generate multiple-choice questions (MCQs) mapped precisely to the newly revised curriculum provided below. 

Do NOT generate questions from older/legacy syllabus units. Every question must be directly grounded in the topics, chapters, and grammar rules specified below.

Subject: ${subject}

Syllabus Details:
${syllabus}

Language & Script Requirements:
* For 'English': All questions, options, and explanations MUST be in English.
* For 'Sanskrit': All questions, options, and explanations MUST be in Sanskrit (Devanagari script).
* For ALL OTHER subjects ('Bengali', 'Philosophy', 'Education', 'Computer Science'): All questions, options, and explanations MUST be generated in the Bengali language (UTF-8). For 'Computer Science' (Modern Computer Application), keep Python code blocks, functions, and variable names in English, but write the surrounding question text, options, and explanations in Bengali.

Output Requirement:
Generate 40 high-quality, syllabus-compliant multiple-choice questions (MCQs).
Ensure that the options are clear.
Each question must include a short explanation citing the specific topic name/chapter from the new syllabus.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
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
              correctAnswer: { type: "INTEGER", description: "Index 0 to 3 corresponding to options" },
              explanation: { type: "STRING", description: "Short explanation citing the specific topic or chapter name from the new syllabus." }
            },
            required: ["id", "question", "options", "correctAnswer", "explanation"],
          },
        },
      },
    });

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