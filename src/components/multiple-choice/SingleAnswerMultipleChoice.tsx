'use client';

import React, { useState } from 'react';

interface Option {
  id: string;
  text: string;
}

interface SingleAnswerMultipleChoiceProps {
  questionNumber?: number;
  questionText: string;
  options: Option[];
  answer: {
    correctOption: string;
    explanation: string;
  };
  instructions?: string;
  uiHints?: {
    displayType: 'radio';
    showLetterLabels: boolean;
  };
  onAnswerChange?: (answer: string) => void;
  disabled?: boolean;
}

export default function SingleAnswerMultipleChoice({
  questionNumber,
  questionText,
  options,
  answer,
  instructions,
  uiHints,
  onAnswerChange,
  disabled = false,
}: SingleAnswerMultipleChoiceProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');

  const handleSelection = (optionId: string) => {
    if (disabled) return;
    setSelectedAnswer(optionId);
    if (onAnswerChange) {
      onAnswerChange(optionId);
    }
  };

  const getLetterLabel = (index: number): string => {
    return String.fromCharCode(65 + index);
  };

  const showLetterLabels = uiHints?.showLetterLabels ?? true;

  return (
    <div className="w-full bg-white border border-gray-300 shadow-sm p-8">
      <div className="mb-6 pb-4 border-b-2 border-gray-400">
        <div className="flex items-center gap-3 mb-2">
          {questionNumber && (
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-black text-white font-bold rounded-md">
              {questionNumber}
            </div>
          )}
          <h2 className="text-xl font-semibold text-black flex-1">
            {questionText}
          </h2>
        </div>
        {instructions && (
          <p className="text-sm text-black font-medium ml-13">
            {instructions}
          </p>
        )}
      </div>

      <div className="space-y-3">
        {options.map((option, index) => {
          const letterLabel = getLetterLabel(index);
          const isSelected = selectedAnswer === option.id;

          return (
            <label
              key={option.id}
              className={`
                block relative cursor-pointer
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <div className={`
                w-full flex items-start p-4 border-2 rounded-lg transition-all
                ${isSelected ? 'border-black bg-gray-100' : 'border-gray-300 hover:border-gray-500 bg-white'}
                focus-within:ring-2 focus-within:ring-black focus-within:border-black
              `}>
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-shrink-0">
                    <input
                      type="radio"
                      name="answer"
                      value={option.id}
                      checked={isSelected}
                      disabled={disabled}
                      onChange={() => handleSelection(option.id)}
                      className="w-5 h-5 text-black focus:ring-2 focus:ring-black focus:ring-offset-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                  </div>

                  {showLetterLabels && (
                    <span className={`flex-shrink-0 w-8 h-8 flex items-center justify-center font-bold rounded-md text-sm
                      ${isSelected ? 'bg-black text-white' : 'bg-gray-200 text-black'}`}>
                      {letterLabel}
                    </span>
                  )}

                  <span className="text-base text-black flex-1">
                    {option.text}
                  </span>
                </div>
              </div>
            </label>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-300">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {selectedAnswer ? 'Answer selected' : 'No answer selected'}
          </span>
          {selectedAnswer && (
            <span className="text-black font-medium flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Answer recorded
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
