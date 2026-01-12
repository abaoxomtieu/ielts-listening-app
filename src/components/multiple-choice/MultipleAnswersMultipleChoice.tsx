'use client';

import React, { useState } from 'react';

interface Option {
  id: string;
  text: string;
}

interface MultipleAnswersMultipleChoiceProps {
  questionNumber?: number;
  questionText: string;
  options: Option[];
  answer: {
    correctOptions: string[];
    explanation: string;
  };
  instructions?: string;
  uiHints?: {
    displayType: 'checkbox';
    maxSelectable?: number;
    minSelectable?: number;
    showLetterLabels: boolean;
  };
  onAnswerChange?: (answers: string[]) => void;
  disabled?: boolean;
}

export default function MultipleAnswersMultipleChoice({
  questionNumber,
  questionText,
  options,
  instructions,
  uiHints,
  onAnswerChange,
  disabled = false,
}: MultipleAnswersMultipleChoiceProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

  const maxSelectable = uiHints?.maxSelectable ?? 3;
  const minSelectable = uiHints?.minSelectable ?? 1;
  const isMaxReached = selectedAnswers.length >= maxSelectable;
  const showLetterLabels = uiHints?.showLetterLabels ?? true;

  const handleCheckboxChange = (optionId: string, checked: boolean) => {
    if (disabled) return;

    let newAnswers: string[];
    if (isMaxReached) {
      newAnswers = selectedAnswers.filter(id => id !== optionId);
    } else if (checked) {
      if (!selectedAnswers.includes(optionId)) {
        newAnswers = [...selectedAnswers, optionId];
      } else {
        newAnswers = selectedAnswers;
      }
    } else {
      newAnswers = selectedAnswers.filter(id => id !== optionId);
    }

    setSelectedAnswers(newAnswers);
    onAnswerChange?.(newAnswers);
  };

  const getLetterLabel = (index: number): string => {
    return String.fromCharCode(65 + index);
  };

  const isValidSelection = selectedAnswers.length >= minSelectable && selectedAnswers.length <= maxSelectable;

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
        <div className="ml-13 space-y-1">
          <p className="text-sm text-black font-medium">
            {instructions || `Choose ${maxSelectable} letters`}
          </p>
          <p className="text-xs text-gray-600">
            Select between {minSelectable} and {maxSelectable} options
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {options.map((option, index) => {
          const letterLabel = getLetterLabel(index);
          const isSelected = selectedAnswers.includes(option.id);
          const isDisabled = disabled || (isMaxReached && !isSelected);

          return (
            <label
              key={option.id}
              className={`
                block relative cursor-pointer
              `}
            >
              <div className={`
                w-full flex items-start p-4 border-2 rounded-lg transition-all
                ${isSelected ? 'border-black bg-gray-100' : 'border-gray-300 hover:border-gray-500 bg-white'}
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                focus-within:ring-2 focus-within:ring-black focus-within:border-black
              `}>
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={isDisabled}
                      onChange={(e) => handleCheckboxChange(option.id, e.target.checked)}
                      className="w-5 h-5 rounded border-2 border-gray-400 text-black focus:ring-2 focus:ring-black focus:ring-offset-0 cursor-pointer disabled:cursor-not-allowed"
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

                  {isSelected && (
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </label>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-300">
        <div className="flex items-center justify-between text-sm">
          <div className="space-y-1">
            <span className="text-gray-600">
              Selected: {selectedAnswers.length} / {maxSelectable} options
            </span>
            {isMaxReached && !disabled && (
              <p className="text-xs text-gray-600 font-medium">
                Maximum selections reached
              </p>
            )}
            {selectedAnswers.length > 0 && selectedAnswers.length < minSelectable && (
              <p className="text-xs text-gray-600 font-medium">
                Minimum {minSelectable} selection(s) required
              </p>
            )}
          </div>
          {isValidSelection && selectedAnswers.length > 0 && (
            <span className="text-black font-medium flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Valid selection
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
