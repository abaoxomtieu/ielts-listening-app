'use client';

import React, { useState } from 'react';

interface QuestionItem {
  id: number;
  text: string;
  answer: string;
  alternativeAnswers?: string[];
  answerType: 'text' | 'number';
  audioTimeRange?: {
    start: string;
    end: string;
  };
}

interface UIHints {
  displayType: 'questions';
  showQuestionNumbers: boolean;
  inputType: 'text';
  caseSensitive: boolean;
}

interface Props {
  questionText: string;
  instructions: string;
  questions: QuestionItem[];
  wordLimit: string;
  uiHints?: UIHints;
}

export default function ShortAnswer({
  questionText,
  instructions,
  questions,
  wordLimit,
  uiHints,
}: Props) {
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleInputChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const getInputType = (answerType: 'text' | 'number') => {
    return answerType === 'number' ? 'number' : 'text';
  };

  const showQuestionNumbers = uiHints?.showQuestionNumbers ?? true;

  return (
    <div className="w-full bg-white border border-gray-300 p-8">
      <div className="mb-6 pb-4 border-b-2 border-gray-400">
        <h2>{questionText}</h2>
        <p className="text-sm font-semibold text-gray-700">{instructions}</p>
      </div>

      <div className="mb-6 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
        <p className="text-sm font-semibold text-blue-800">{wordLimit}</p>
      </div>

      <div className="space-y-4">
        {questions.map((question) => (
          <div key={question.id} className="flex items-start gap-3">
            {showQuestionNumbers && (
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 border-2 border-gray-300 rounded-full text-sm font-bold text-gray-700">
                {question.id}
              </div>
            )}
            <div className="flex-1">
              <p className="text-base text-gray-900 mb-2">{question.text}</p>
              <input
                type={getInputType(question.answerType)}
                id={`question-${question.id}`}
                className="w-full border-b-2 border-gray-500 bg-transparent px-2 py-1"
                value={answers[question.id] || ''}
                onChange={(e) => handleInputChange(question.id, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
