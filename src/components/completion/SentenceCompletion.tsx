'use client';

import React, { useState } from 'react';

interface SentenceCompletionItem {
  id: number;
  text: string;
  answer: string;
  audioTimeRange?: {
    start: string;
    end: string;
  };
}

interface SentenceCompletionProps {
  questionText: string;
  instructions: string;
  sentences: SentenceCompletionItem[];
  wordLimit: string;
  questionNumber?: number;
  showSentenceNumbers?: boolean;
}

export default function SentenceCompletion({
  questionText,
  instructions,
  sentences = [],
  wordLimit,
  questionNumber,
  showSentenceNumbers = true,
}: SentenceCompletionProps) {
  const safeSentences = Array.isArray(sentences) ? sentences : [];
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleInputChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const renderTextWithInput = (text: string, questionId: number) => {
    const parts = (text || '').split('[______]');

    return (
      <span className="inline-flex items-center gap-1 flex-wrap">
        {parts[0] && <span className="text-black">{parts[0]}</span>}
        <input
          type="text"
          id={`question-${questionId}`}
          className={`
            inline-block w-32 border-b-2 border-gray-500 bg-transparent
            px-2 py-0.5
            focus:border-black focus:outline-none
            text-black text-center
            transition-colors duration-200
          `}
          value={answers[questionId] || ''}
          onChange={(e) => handleInputChange(questionId, e.target.value)}
          placeholder="_____"
        />
        {parts[1] && <span className="text-black">{parts[1]}</span>}
      </span>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white border-2 border-gray-300 rounded-lg shadow-sm">
      {/* Header Section */}
      <div className="mb-6 pb-4 border-b-2 border-gray-400">
        {questionNumber && safeSentences.length > 0 && (
          <div className="text-sm font-semibold text-black mb-2">
            Questions {questionNumber}-{questionNumber + safeSentences.length - 1}
          </div>
        )}
        <h2 className="text-xl font-bold text-black mb-2">{questionText}</h2>
        <p className="text-sm font-semibold text-black">{instructions}</p>
      </div>

      {/* Word Limit Notice */}
      <div className="mb-6 p-3 bg-gray-100 border-l-4 border-black rounded">
        <p className="text-sm font-semibold text-black">{wordLimit}</p>
      </div>

      {/* Sentences Container */}
      <div className="bg-white border-2 border-gray-400 rounded-lg p-6">
        <div className="space-y-4">
          {safeSentences.length === 0 ? (
            <p className="text-gray-500 italic text-sm">No sentences added yet. Add sentences in the editor.</p>
          ) : (
            safeSentences.map((sentence) => (
              <div key={sentence.id} className="flex items-start gap-3">
                {/* Question Number */}
                {showSentenceNumbers && (
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-200 border-2 border-gray-400 rounded-full text-sm font-bold text-black">
                    {sentence.id}
                  </div>
                )}

                {/* Sentence Text with Input */}
                <div className="flex-1">
                  <p className="text-base text-black leading-relaxed">
                    {renderTextWithInput(sentence.text, sentence.id)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer Instructions */}
      <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded">
        <div className="flex items-center gap-2 text-sm text-black">
          <svg
            className="w-5 h-5 text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-semibold">Instructions:</span>
        </div>
        <ul className="mt-2 ml-7 text-sm text-gray-600 space-y-1">
          <li>Complete the sentences using information from the audio</li>
          <li>Write your answers in the spaces provided</li>
          <li>Follow the word limit specified above</li>
        </ul>
      </div>
    </div>
  );
}