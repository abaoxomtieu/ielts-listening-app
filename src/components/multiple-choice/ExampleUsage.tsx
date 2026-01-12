'use client';

import React from 'react';
import { SingleAnswerMultipleChoice, MultipleAnswersMultipleChoice } from '@/components/multiple-choice';

const singleAnswerExample = {
  questionNumber: 21,
  questionText: 'What is the main reason the students decided to use a questionnaire for their project?',
  options: [
    { id: 'A', text: 'It would allow them to reach a large number of people' },
    { id: 'B', text: 'It would be easier to analyse the data collected' },
    { id: 'C', text: 'It would require less time than other methods' },
    { id: 'D', text: 'It was recommended by their tutor' },
  ],
  answer: {
    correctOption: 'B',
    explanation: 'The students mentioned that they chose a questionnaire because it would be easier to analyse the numerical data they collected.',
  },
  uiHints: {
    displayType: 'radio' as const,
    showLetterLabels: true,
  },
};

const multipleAnswersExample = {
  questionNumber: 24,
  questionText: 'Which TWO of the following methods do the students plan to use to distribute their questionnaire?',
  options: [
    { id: 'A', text: 'Handing out copies in the university library' },
    { id: 'B', text: 'Sending it via email to students' },
    { id: 'C', text: 'Posting it on social media platforms' },
    { id: 'D', text: 'Distributing it in lecture halls' },
    { id: 'E', text: 'Asking friends to share it with their contacts' },
    { id: 'F', text: 'Putting posters with QR codes around campus' },
    { id: 'G', text: 'Including it in the university newsletter' },
  ],
  answer: {
    correctOptions: ['B', 'D'],
    explanation: 'The students mentioned they would send it via email to students and also distribute it in lecture halls to reach more people.',
  },
  instructions: 'Choose TWO letters A-G',
  uiHints: {
    displayType: 'checkbox' as const,
    showLetterLabels: true,
    maxSelectable: 2,
    minSelectable: 2,
  },
};

export default function ExampleUsage() {
  const handleSingleAnswerChange = (answer: string) => {
    console.log('Single answer selected:', answer);
  };

  const handleMultipleAnswersChange = (answers: string[]) => {
    console.log('Multiple answers selected:', answers);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            IELTS Listening - Multiple Choice Examples
          </h1>
          <p className="text-lg text-gray-700">
            Interactive demo of single answer and multiple answers multiple choice components
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-600">
            Single Answer Multiple Choice
          </h2>
          <SingleAnswerMultipleChoice
            {...singleAnswerExample}
            onAnswerChange={handleSingleAnswerChange}
          />
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-600">
            Multiple Answers Multiple Choice
          </h2>
          <MultipleAnswersMultipleChoice
            {...multipleAnswersExample}
            onAnswerChange={handleMultipleAnswersChange}
          />
        </section>

        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Usage Instructions
          </h3>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h4 className="font-semibold mb-2">Single Answer Multiple Choice</h4>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Click on any option to select it</li>
                <li>Only one option can be selected at a time</li>
                <li>Selection is indicated by blue border and background</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Multiple Answers Multiple Choice</h4>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Click on options to select multiple answers</li>
                <li>Maximum 2 selections can be made (as specified)</li>
                <li>Minimum 2 selections required for valid submission</li>
                <li>Selection count displayed at the bottom</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
