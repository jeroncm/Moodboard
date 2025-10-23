
import React, { useState } from 'react';

interface ClarificationFormProps {
  questions: string[];
  onSubmit: (answers: Record<string, string>) => void;
}

export const ClarificationForm: React.FC<ClarificationFormProps> = ({ questions, onSubmit }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswerChange = (question: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [question]: answer }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(answers);
  };

  return (
    <div className="text-center text-[#f1ede9] max-w-2xl w-full p-8 rounded-lg bg-black/10 backdrop-blur-sm animate-fade-in">
      <h2 className="text-3xl font-serif-display font-bold mb-2">Let's refine your idea...</h2>
      <p className="text-[#d1c9c0] mb-8">Your topic is full of potential! To create the perfect mood board, please answer a few questions:</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {questions.map((q, index) => (
          <div key={index} className="text-left">
            <label className="block text-[#d1c9c0] mb-2 font-semibold" htmlFor={`question-${index}`}>{q}</label>
            <input
              id={`question-${index}`}
              type="text"
              onChange={(e) => handleAnswerChange(q, e.target.value)}
              className="w-full p-3 bg-[#f1ede9]/80 text-[#544c44] placeholder:text-[#8a8178] rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-[#d1c9c0] focus:border-transparent transition-all shadow-inner"
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="px-6 py-3 mt-4 bg-[#70665c] text-white rounded-md hover:bg-[#544c44] transition-colors font-semibold w-full"
        >
          Create My Mood Board
        </button>
      </form>
    </div>
  );
};
