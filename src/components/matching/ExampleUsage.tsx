/**
 * Example usage of Matching Question Components
 *
 * This file demonstrates how to use the PeopleOpinions, EventsInfo, and LocationsFeatures components
 * with the example JSON data files.
 */

import React, { useState } from 'react';
import { PeopleOpinions, EventsInfo, LocationsFeatures } from './index';

// Example: Import your data
// import peopleOpinionsData from '/path/to/people-opinions.example.json';
// import eventsInfoData from '/path/to/events-info.example.json';
// import locationsFeaturesData from '/path/to/locations-features.example.json';

// Example data structure (matches the JSON format)
const examplePeopleOpinionsData = {
  meta: {
    questionType: "matching",
    variant: "people_opinions",
    section: 3,
    questionNumber: 26,
    difficulty: "medium",
    version: "1.0",
    createdAt: "2025-01-11T00:00:00Z"
  },
  content: {
    questionText: "What is each student's opinion about the proposed changes to the library?",
    questions: [
      { id: 26, text: "Anna" },
      { id: 27, text: "Ben" },
      { id: 28, text: "Carla" },
      { id: 29, text: "David" },
      { id: 30, text: "Emma" }
    ],
    options: [
      { id: "A", text: "Thinks the changes will be too expensive" },
      { id: "B", text: "Believes the changes will improve accessibility" },
      { id: "C", text: "Is concerned about the loss of quiet study spaces" },
      { id: "D", text: "Feels the changes should be implemented gradually" },
      { id: "E", text: "Supports the changes but wants more information" },
      { id: "F", text: "Thinks the computer facilities are adequate as they are" }
    ],
    instructions: "Choose the correct letter A-F next to Questions 26-30"
  },
  answerKey: {
    "26": "E",
    "27": "A",
    "28": "C",
    "29": "B",
    "30": "F"
  }
};

export const MatchingExample: React.FC = () => {
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAnswerChange = (questionId: number, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    // Here you would typically send answers to your backend
    console.log('Submitted answers:', userAnswers);
  };

  const calculateScore = () => {
    let correct = 0;
    Object.entries(userAnswers).forEach(([questionId, answer]) => {
      const correctAnswer = examplePeopleOpinionsData.answerKey[questionId as keyof typeof examplePeopleOpinionsData.answerKey];
      if (correctAnswer === answer) {
        correct++;
      }
    });
    return correct;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          IELTS Listening Practice - Matching Questions
        </h1>

        {/* People Opinions Component */}
        <div className="mb-8">
          <PeopleOpinions
            data={examplePeopleOpinionsData}
            onAnswerChange={handleAnswerChange}
            disabled={isSubmitted}
          />
        </div>

        {/* Submit Button */}
        {!isSubmitted && (
          <div className="flex justify-center mb-8">
            <button
              onClick={handleSubmit}
              disabled={Object.keys(userAnswers).length < examplePeopleOpinionsData.content.questions.length}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Submit Answers
            </button>
          </div>
        )}

        {/* Results Display */}
        {isSubmitted && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your Results
            </h2>
            <div className="text-lg text-gray-700">
              <p className="mb-2">
                You scored <span className="font-bold text-blue-600">{calculateScore()}</span> out of{' '}
                <span className="font-bold">{examplePeopleOpinionsData.content.questions.length}</span>
              </p>
              <p className="text-gray-600">
                Percentage: {Math.round((calculateScore() / examplePeopleOpinionsData.content.questions.length) * 100)}%
              </p>
            </div>

            {/* Detailed Results */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Answer Breakdown:</h3>
              <div className="space-y-2">
                {examplePeopleOpinionsData.content.questions.map((question) => {
                  const userAnswer = userAnswers[question.id];
                  const correctAnswer = examplePeopleOpinionsData.answerKey[question.id.toString() as keyof typeof examplePeopleOpinionsData.answerKey];
                  const isCorrect = userAnswer === correctAnswer;

                  return (
                    <div
                      key={question.id}
                      className={`flex items-center justify-between p-3 rounded border ${
                        isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="font-semibold text-gray-700">{question.id}.</span>
                        <span className="text-gray-800">{question.text}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">
                          Your answer: <span className={`font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                            {userAnswer || 'Not answered'}
                          </span>
                        </span>
                        {!isCorrect && (
                          <span className="text-sm text-gray-600">
                            Correct: <span className="font-bold text-green-600">{correctAnswer}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reset Button */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => {
                  setUserAnswers({});
                  setIsSubmitted(false);
                }}
                className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchingExample;
