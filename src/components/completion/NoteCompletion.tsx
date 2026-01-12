'use client';

import React, { useState } from 'react';

interface BulletPoint {
  id: number;
  text: string;
  answer: string;
  audioTimeRange?: {
    start: string;
    end: string;
  };
}

interface Section {
  heading: string;
  bulletPoints: BulletPoint[];
}

interface Notes {
  title: string;
  speaker?: string;
  date?: string;
  sections: Section[];
}

interface NoteCompletionProps {
  questionText: string;
  instructions: string;
  notes: Notes;
  wordLimit: string;
  questionNumber?: number;
  showSectionHeadings?: boolean;
  showBulletPoints?: boolean;
}

export default function NoteCompletion({
  questionText,
  instructions,
  notes,
  wordLimit,
  questionNumber,
  showSectionHeadings = true,
  showBulletPoints = true,
}: NoteCompletionProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleInputChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const renderTextWithInput = (text: string, questionId: number) => {
    const parts = text.split('[______]');

    return (
      <div className="inline-flex items-center flex-wrap gap-1">
        <span className="text-gray-900">{parts[0]}</span>
        <input
          type="text"
          id={`question-${questionId}`}
          className={`
            inline-block w-32 border-b-2 border-gray-500 bg-transparent
            px-2 py-0.5 mx-1
            focus:border-blue-600 focus:outline-none
            text-gray-900 text-center
            transition-colors duration-200
          `}
          value={answers[questionId] || ''}
          onChange={(e) => handleInputChange(questionId, e.target.value)}
          placeholder="_____"
        />
        {parts[1] && <span className="text-gray-900">{parts[1]}</span>}
      </div>
    );
  };

  const getTotalQuestions = () => {
    return notes.sections.reduce((total, section) => {
      return total + section.bulletPoints.length;
    }, 0);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white border-2 border-gray-300 rounded-lg shadow-sm">
      {/* Header Section */}
      <div className="mb-6 pb-4 border-b-2 border-gray-400">
        {questionNumber && (
          <div className="text-sm font-semibold text-gray-700 mb-2">
            Questions {questionNumber}-{questionNumber + getTotalQuestions() - 1}
          </div>
        )}
        <h2 className="text-xl font-bold text-gray-900 mb-2">{questionText}</h2>
        <p className="text-sm font-semibold text-gray-700">{instructions}</p>
      </div>

      {/* Word Limit Notice */}
      <div className="mb-6 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
        <p className="text-sm font-semibold text-blue-800">{wordLimit}</p>
      </div>

      {/* Notes Container */}
      <div className="bg-white border-2 border-gray-400 rounded-lg p-6">
        {/* Notes Title */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
            {notes.title}
          </h3>
          {(notes.speaker || notes.date) && (
            <div className="mt-2 text-sm text-gray-600">
              {notes.speaker && <span className="font-semibold">Speaker: {notes.speaker}</span>}
              {notes.speaker && notes.date && <span className="mx-2">|</span>}
              {notes.date && <span>Date: {notes.date}</span>}
            </div>
          )}
        </div>

        {/* Notes Sections */}
        <div className="space-y-6">
          {notes.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="pl-4 border-l-4 border-gray-400">
              {/* Section Heading */}
              {showSectionHeadings && (
                <h4 className="text-lg font-bold text-gray-900 mb-3">
                  {section.heading}
                </h4>
              )}

              {/* Bullet Points */}
              <div className="space-y-3">
                {section.bulletPoints.map((bulletPoint) => (
                  <div key={bulletPoint.id} className="flex items-start gap-3">
                    {/* Question Number */}
                    <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center bg-gray-100 border border-gray-300 rounded text-xs font-bold text-gray-700">
                      {bulletPoint.id}
                    </div>

                    {/* Bullet Point Text with Input */}
                    <div className="flex-1">
                      {showBulletPoints ? (
                        <div className="flex items-start">
                          <span className="mr-2 text-gray-900 mt-1">•</span>
                          <div className="flex-1">
                            {renderTextWithInput(bulletPoint.text, bulletPoint.id)}
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1">
                          {renderTextWithInput(bulletPoint.text, bulletPoint.id)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Instructions */}
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
          <li>• Complete the notes using information from the audio</li>
          <li>• Write your answers in the spaces provided</li>
          <li>• Follow the word limit specified above</li>
        </ul>
      </div>
    </div>
  );
}
