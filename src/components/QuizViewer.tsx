"use client";

import React, { useState, useEffect } from "react";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface Props {
  unit: any;
  onComplete: (payload: { timeSpent: number; quizScore: number }) => void;
}

export function QuizViewer({ unit, onComplete }: Props) {
  const [timeSpent, setTimeSpent] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTimeSpent(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Normalise content: backend may return { questions: [...] } or an array directly
  const raw = unit.content;
  const questions: Question[] = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.questions)
      ? raw.questions
      : [
          {
            question: "What is the primary function of an activation function in a neural network?",
            options: ["Add linearity", "Add non-linearity", "Initialize weights", "Calculate loss"],
            correctAnswer: "Add non-linearity"
          },
          {
            question: "Which algorithm is used to update weights in standard training?",
            options: ["Breadth First Search", "A* Algorithm", "Gradient Descent", "K-Means"],
            correctAnswer: "Gradient Descent"
          }
        ];

  const handleSelect = (qIdx: number, option: string) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: option }));
  };

  // Returns score as 0–1 (as the backend expects)
  const calculateScore = (): number => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) correct += 1;
    });
    return questions.length > 0 ? correct / questions.length : 0;
  };

  const scorePercent = Math.round(calculateScore() * 100);

  const handleSubmit = () => setSubmitted(true);

  const handleContinue = () => {
    onComplete({ timeSpent, quizScore: calculateScore() }); // 0–1 range
  };

  return (
    <div className="glass-card rounded-2xl p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center border-b border-white/10 pb-4">
        <div>
          <h2 className="text-3xl font-bold">{unit.title || "Knowledge Check"}</h2>
          <p className="text-slate-400 mt-1">
            {questions.length} question{questions.length !== 1 ? "s" : ""} — answer all to submit.
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center border border-accent/20 shadow-[0_0_15px_rgba(255,215,0,0.2)] flex-shrink-0">
          <span className="material-symbols-outlined text-accent text-2xl">quiz</span>
        </div>
      </div>

      {/* Questions — use array index as key (AI doesn't guarantee q.id) */}
      <div className="space-y-8">
        {questions.map((q, idx) => (
          <div key={idx} className="p-6 bg-white/5 rounded-xl border border-white/5">
            <h3 className="text-base font-semibold mb-4 text-slate-100">
              {idx + 1}. {q.question}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {q.options.map((opt) => {
                const isSelected = selectedAnswers[idx] === opt;
                const isCorrect = submitted && opt === q.correctAnswer;
                const isWrongSelected = submitted && isSelected && opt !== q.correctAnswer;

                let btnClass = "text-left p-4 rounded-xl border text-sm font-medium transition-all ";
                if (submitted) {
                  if (isCorrect) btnClass += "bg-green-500/20 border-green-500/50 text-green-300 shadow-[0_0_10px_rgba(34,197,94,0.2)]";
                  else if (isWrongSelected) btnClass += "bg-red-500/20 border-red-500/50 text-red-300";
                  else btnClass += "bg-white/5 border-white/10 text-slate-500 opacity-50";
                } else {
                  if (isSelected) btnClass += "bg-accent/20 border-accent/50 text-accent shadow-[0_0_10px_rgba(255,215,0,0.15)]";
                  else btnClass += "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20";
                }

                return (
                  <button
                    key={opt}
                    disabled={submitted}
                    onClick={() => handleSelect(idx, opt)}
                    className={btnClass}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-10 flex justify-end pt-6 border-t border-white/10">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(selectedAnswers).length < questions.length}
            className="px-6 py-3 bg-accent text-background-dark font-bold rounded-xl hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_12px_rgba(255,215,0,0.2)]"
          >
            Submit Answers
          </button>
        ) : (
          <div className="flex items-center gap-6 w-full justify-between">
            <div className="text-xl font-bold bg-white/5 px-4 py-2 rounded-lg border border-white/10 flex items-center gap-2">
              Score:
              <span className={scorePercent >= 60 ? "text-green-400" : "text-red-400"}>
                {scorePercent}%
              </span>
              {scorePercent >= 60
                ? <span className="material-symbols-outlined text-green-400 text-lg">verified</span>
                : <span className="material-symbols-outlined text-red-400 text-lg">close</span>
              }
            </div>
            <button
              onClick={handleContinue}
              className="px-6 py-3 bg-primary text-background-dark font-bold rounded-xl hover:bg-primary/90 transition-all shadow-[0_4px_12px_rgba(255,179,0,0.2)] flex items-center gap-2"
            >
              Continue Path <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
