// app/page.js
'use client';
import { useState, useEffect } from 'react';

const SUBJECTS = ["Bengali", "English", "Philosophy", "Computer Science", "Education", "Sanskrit"];

export default function ExamApp() {
  const [subject, setSubject] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(2400); // 40 minutes = 2400 seconds
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Timer logic
  useEffect(() => {
    if (questions.length === 0 || submitted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [questions, submitted, timeLeft]);

  const startExam = async (selectedSub) => {
    setSubject(selectedSub);
    setLoading(true);
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject: selectedSub }),
    });
    const data = await res.json();
    setQuestions(data.questions || []);
    setLoading(false);
  };

  const handleSelectOption = (qId, optionIdx) => {
    setAnswers({ ...answers, [qId]: optionIdx });
  };

  const handleSubmit = async () => {
    let currentScore = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) currentScore++;
    });
    setScore(currentScore);
    setSubmitted(true);

    // Send email notification to you
    await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject,
        score: currentScore,
        total: questions.length,
        timeTakenMinutes: Math.round((2400 - timeLeft) / 60),
      }),
    });
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!subject) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">WBCHSE Class 12 Sem 3 Practice Platform</h1>
        <p className="mb-8 text-slate-400">Select a subject to generate a 40-minute mock test:</p>
        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
          {SUBJECTS.map((sub) => (
            <button
              key={sub}
              onClick={() => startExam(sub)}
              className="p-4 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold transition"
            >
              {sub}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500 mb-4"></div>
        <p className="text-lg">Generating syllabus-accurate questions using AI...</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-4 max-w-3xl mx-auto">
        {/* Score Card */}
        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 text-center mb-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          <h2 className="text-3xl font-extrabold mb-1 tracking-tight">Test Results</h2>
          <p className="text-slate-400 mb-6 font-medium">{subject} — Semester 3</p>
          
          <div className="inline-flex flex-col items-center justify-center bg-slate-900/60 w-36 h-36 rounded-full border-4 border-indigo-500/30 mb-6 shadow-inner relative">
            <span className="text-4xl font-extrabold text-indigo-400">{score}</span>
            <div className="w-12 h-px bg-slate-700 my-1"></div>
            <span className="text-slate-400 text-sm font-semibold">{questions.length}</span>
          </div>

          <div className="text-lg font-semibold text-slate-200 mb-2">
            Score: <span className="text-indigo-400">{((score / (questions.length || 1)) * 100).toFixed(0)}%</span>
          </div>
          <p className="text-xs text-slate-400 mb-6 bg-slate-900/40 py-2 px-4 rounded-full inline-block">
            Score alert sent automatically via email.
          </p>

          <div>
            <button
              onClick={() => { setSubject(""); setQuestions([]); setSubmitted(false); setAnswers({}); setTimeLeft(2400); }}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-600/25"
            >
              Take Another Test
            </button>
          </div>
        </div>

        {/* Detailed Review */}
        <h3 className="text-xl font-bold mb-6 text-slate-200 border-l-4 border-indigo-500 pl-3">Review Answers</h3>
        <div className="space-y-6">
          {questions.map((q, qIdx) => {
            const userAnswerIdx = answers[q.id];
            const isCorrect = userAnswerIdx === q.correctAnswer;
            return (
              <div key={q.id} className={`bg-slate-800 p-6 rounded-2xl border transition duration-200 ${isCorrect ? 'border-emerald-500/30' : userAnswerIdx !== undefined ? 'border-red-500/30' : 'border-slate-700'}`}>
                <div className="flex items-start justify-between mb-4 gap-4">
                  <p className="font-semibold text-lg text-slate-100">{qIdx + 1}. {q.question}</p>
                  {userAnswerIdx === undefined ? (
                    <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold rounded-lg whitespace-nowrap">Skipped</span>
                  ) : isCorrect ? (
                    <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-lg whitespace-nowrap">Correct</span>
                  ) : (
                    <span className="px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold rounded-lg whitespace-nowrap">Incorrect</span>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  {q.options.map((opt, optIdx) => {
                    let btnClass = 'bg-slate-700/30 border-slate-600 text-slate-300';
                    if (optIdx === q.correctAnswer) {
                      btnClass = 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300 font-medium';
                    } else if (optIdx === userAnswerIdx) {
                      btnClass = 'bg-red-500/10 border-red-500/50 text-red-300';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`w-full text-left p-3.5 rounded-xl border flex justify-between items-center ${btnClass}`}
                      >
                        <span>{opt}</span>
                        {optIdx === q.correctAnswer && (
                          <span className="text-emerald-400 text-sm font-semibold">✓ Correct Answer</span>
                        )}
                        {optIdx === userAnswerIdx && optIdx !== q.correctAnswer && (
                          <span className="text-red-400 text-sm font-semibold">✗ Your Answer</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {q.explanation && (
                  <div className="mt-4 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Syllabus Grounding & Explanation</p>
                    <p className="text-sm text-slate-300 leading-relaxed">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 mb-12 text-center">
          <button
            onClick={() => { setSubject(""); setQuestions([]); setSubmitted(false); setAnswers({}); setTimeLeft(2400); }}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition"
          >
            Back to Subjects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 max-w-3xl mx-auto">
      {/* Header bar */}
      <div className="sticky top-0 bg-slate-800/90 backdrop-blur p-4 rounded-xl flex justify-between items-center mb-6 border border-slate-700 z-10">
        <div>
          <h2 className="font-bold text-lg">{subject} Mock Test</h2>
          <span className="text-xs text-slate-400">{questions.length} Questions</span>
        </div>
        <div className={`text-xl font-mono font-bold px-4 py-2 rounded-lg ${timeLeft < 300 ? 'bg-red-900 text-red-200' : 'bg-slate-700 text-indigo-300'}`}>
          ⏱️ {formatTime(timeLeft)}
        </div>
      </div>

      {/* Question List */}
      <div className="space-y-6">
        {questions.map((q, qIdx) => (
          <div key={q.id} className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <p className="font-semibold text-lg mb-4">{qIdx + 1}. {q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, optIdx) => (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(q.id, optIdx)}
                  className={`w-full text-left p-3 rounded-lg border transition ${
                    answers[q.id] === optIdx
                      ? 'bg-indigo-600 border-indigo-400 text-white'
                      : 'bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full mt-8 py-4 bg-emerald-600 hover:bg-emerald-500 font-bold rounded-xl text-lg transition"
      >
        Submit Exam
      </button>
    </div>
  );
}