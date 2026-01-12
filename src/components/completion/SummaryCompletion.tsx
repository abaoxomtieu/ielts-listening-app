'use client';

import React, { useState } from 'react';
import * as Select from '@radix-ui/react-select';

interface Blank {
  id: number;
  position: number;
  answer: string;
  audioTimeRange?: {
    start: string;
    end: string;
  };
}

interface Summary {
  text: string;
  blanks: Blank[];
}

interface Option {
  id: string;
  text: string;
}

interface SummaryCompletionProps {
  questionText: string;
  instructions: string;
  summary: Summary;
  wordLimit: string;
  questionNumber?: number;
  options?: Option[];
  showOptions?: boolean;
  dropdownForBlanks?: boolean;
}

export default function SummaryCompletion({
  questionText,
  instructions,
  summary,
  wordLimit,
  questionNumber,
  options = [],
  showOptions = false,
  dropdownForBlanks = false,
}: SummaryCompletionProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});

  const handleInputChange = (blankId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [blankId]: value }));
  };

  const handleSelectChange = (blankId: number, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [blankId]: value }));
  };

  const renderTextWithBlanks = () => {
    const parts: Array<{ type: 'text' | 'blank'; content: string; blankId?: number }> = [];
    let lastIndex = 0;

    // Sort blanks by position
    const sortedBlanks = [...summary.blanks].sort((a, b) => a.position - b.position);

    sortedBlanks.forEach((blank, index) => {
      // Add text before this blank
      if (blank.position > lastIndex) {
        parts.push({
          type: 'text',
          content: summary.text.substring(lastIndex, blank.position),
        });
      }

      // Add the blank
      parts.push({
        type: 'blank',
        content: '',
        blankId: blank.id,
      });

      lastIndex = blank.position;
    });

    // Add remaining text
    if (lastIndex < summary.text.length) {
      parts.push({
        type: 'text',
        content: summary.text.substring(lastIndex),
      });
    }

    return parts.map((part, index) => {
      if (part.type === 'text') {
        return (
          <span key={`text-${index}`} className="text-gray-900">
            {part.content}
          </span>
        );
      }

      const blank = summary.blanks.find((b) => b.id === part.blankId);
      if (!blank) return null;

      if (dropdownForBlanks && options.length > 0) {
        return (
          <span key={`blank-${part.blankId}`} className="inline-flex items-center mx-1">
            <span className="text-blue-600 font-bold mr-1">({blank.id})</span>
            <Select.Root
              value={selectedOptions[blank.id] || ''}
              onValueChange={(value) => handleSelectChange(blank.id, value)}
            >
              <Select.Trigger
                className={`
                  inline-flex items-center justify-between
                  border-b-2 border-gray-500 bg-white
                  px-3 py-1 min-w-[120px]
                  focus:border-blue-600 focus:outline-none
                  text-gray-900 text-sm
                  transition-colors duration-200
                `}
              >
                <Select.Value placeholder="Choose..." />
                <Select.Icon className="ml-2">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 4.5L6 7.5L9 4.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content
                  className={`
                    overflow-hidden rounded-md bg-white shadow-lg
                    border border-gray-200
                    z-50 max-h-60
                  `}
                >
                  <Select.Viewport className="p-1">
                    {options.map((option) => (
                      <Select.Item
                        key={option.id}
                        value={option.text}
                        className={`
                          relative flex cursor-pointer select-none items-center
                          rounded-sm px-4 py-2 text-sm text-gray-900
                          focus:bg-blue-50 focus:text-blue-600
                          outline-none
                        `}
                      >
                        <Select.ItemText>
                          <span className="font-semibold mr-2">{option.id}</span>
                          {option.text}
                        </Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </span>
        );
      }

      return (
        <span key={`blank-${part.blankId}`} className="inline-flex items-center mx-1">
          <span className="text-blue-600 font-bold mr-1">({blank.id})</span>
          <input
            type="text"
            id={`blank-${blank.id}`}
            className={`
              inline-block w-32 border-b-2 border-gray-500 bg-transparent
              px-2 py-0.5
              focus:border-blue-600 focus:outline-none
              text-gray-900 text-center
              transition-colors duration-200
            `}
            value={answers[blank.id] || ''}
            onChange={(e) => handleInputChange(blank.id, e.target.value)}
            placeholder="_____"
          />
        </span>
      );
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white border-2 border-gray-300 rounded-lg shadow-sm">
      {/* Header Section */}
      <div className="mb-6 pb-4 border-b-2 border-gray-400">
        {questionNumber && (
          <div className="text-sm font-semibold text-gray-700 mb-2">
            Questions {questionNumber}-{questionNumber + summary.blanks.length - 1}
          </div>
        )}
        <h2 className="text-xl font-bold text-gray-900 mb-2">{questionText}</h2>
        <p className="text-sm font-semibold text-gray-700">{instructions}</p>
      </div>

      {/* Word Limit Notice */}
      <div className="mb-6 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
        <p className="text-sm font-semibold text-blue-800">{wordLimit}</p>
      </div>

      {/* Summary Text Container */}
      <div className="bg-white border-2 border-gray-400 rounded-lg p-6 mb-6">
        <div className="prose max-w-none">
          <p className="text-lg leading-relaxed text-justify">
            {renderTextWithBlanks()}
          </p>
        </div>
      </div>

      {/* Options Box (if showing options without dropdown) */}
      {showOptions && options.length > 0 && !dropdownForBlanks && (
        <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Choose from the following options:
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {options.map((option) => (
              <div
                key={option.id}
                className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded hover:border-blue-400 transition-colors duration-200"
              >
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-600 text-white text-sm font-bold rounded">
                  {option.id}
                </span>
                <span className="text-sm text-gray-900">{option.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions Box */}
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <svg
            className="w-5 h-5 text-blue-600"
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
          <li>• Complete the summary using information from the audio</li>
          {dropdownForBlanks && options.length > 0 ? (
            <li>• Select the correct option from the dropdown for each blank</li>
          ) : showOptions && options.length > 0 ? (
            <li>• Choose the correct option from the box above for each blank</li>
          ) : (
            <li>• Write your answers in the spaces provided</li>
          )}
          <li>• Follow the word limit specified above</li>
        </ul>
      </div>
    </div>
  );
}
