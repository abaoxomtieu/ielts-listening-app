import React, { useState } from 'react';
import * as Select from '@radix-ui/react-select';
import { MatchingData, MatchingContent } from './types';

interface PeopleOpinionsProps {
  data: MatchingData;
  onAnswerChange?: (questionId: number, answer: string) => void;
  disabled?: boolean;
}

export const PeopleOpinions: React.FC<PeopleOpinionsProps> = ({
  data,
  onAnswerChange,
  disabled = false
}) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const { content } = data;

  const handleSelectChange = (questionId: number, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    onAnswerChange?.(questionId, value);
  };

  const getQuestionRange = () => {
    if (content.questions.length === 0) return '';
    const first = content.questions[0].id;
    const last = content.questions[content.questions.length - 1].id;
    return `Questions ${first}-${last}`;
  };

  return (
    <div className="w-full bg-white border border-gray-300 shadow-sm p-8">
      {/* Instructions Header */}
      <div className="mb-8 pb-4 border-b-2 border-gray-400">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {content.questionText}
        </h2>
        <p className="text-sm text-gray-700 font-medium">
          {content.instructions}
        </p>
      </div>

      {/* Main Content - Side by Side Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Questions */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4">
            People
          </h3>
          {content.questions.map((question, index) => (
            <div
              key={question.id}
              className="flex items-start space-x-4 p-3 bg-gray-50 rounded border border-gray-200 hover:border-blue-300 transition-colors"
            >
              {/* Question Number */}
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue-600 text-white font-bold rounded-md">
                {index + 1}
              </div>

              {/* Question Text and Dropdown */}
              <div className="flex-1 flex items-center justify-between">
                <span className="text-base font-medium text-gray-800">
                  {question.text}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column - Options and Answer Selection */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4">
            Opinions
          </h3>
          {content.questions.map((question, index) => {
            const currentAnswer = answers[question.id] || '';

            return (
              <div
                key={question.id}
                className="flex items-center space-x-3 p-3 bg-white rounded border border-gray-200"
              >
                <span className="text-sm font-semibold text-gray-600 w-8">
                  {index + 1}.
                </span>

                {/* Custom Select Dropdown */}
                <Select.Root
                  value={currentAnswer}
                  onValueChange={(value) => handleSelectChange(question.id, value)}
                  disabled={disabled}
                >
                  <Select.Trigger
                    className={`
                      flex-1 flex items-center justify-between
                      px-4 py-2 text-base
                      bg-white border-2
                      ${currentAnswer ? 'border-blue-500' : 'border-gray-300'}
                      rounded-md
                      hover:border-blue-400
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-colors
                      min-h-[44px]
                    `}
                    aria-label={`Select opinion for question ${question.id}`}
                  >
                    <Select.Value placeholder="Select answer" />
                    <Select.Icon className="ml-2">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.5 4.5L6 8L9.5 4.5"
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
                        overflow-hidden bg-white border-2 border-gray-300 rounded-md shadow-lg
                        max-h-60
                      `}
                      position="popper"
                      sideOffset={5}
                    >
                      <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-gray-50 text-gray-700 cursor-pointer hover:bg-gray-100">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M6 9L3 6H9L6 9Z" fill="currentColor" />
                        </svg>
                      </Select.ScrollUpButton>

                      <Select.Viewport className="p-1">
                        {content.options.map((option) => (
                          <Select.Item
                            key={option.id}
                            value={option.id}
                            className={`
                              relative flex items-center px-4 py-3 text-base rounded-md cursor-pointer
                              hover:bg-gray-100
                              focus:bg-blue-50 focus:outline-none
                              data-[state=checked]:bg-blue-100 data-[state=checked]:text-blue-700
                              transition-colors
                            `}
                          >
                            <Select.ItemText>
                              <span className="font-semibold mr-2">{option.id}.</span>
                              {option.text}
                            </Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.Viewport>

                      <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-gray-50 text-gray-700 cursor-pointer hover:bg-gray-100">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M6 3L9 6H3L6 3Z" fill="currentColor" />
                        </svg>
                      </Select.ScrollDownButton>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>

                {/* Selected Answer Display */}
                {currentAnswer && (
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-green-100 text-green-700 font-bold rounded-md border-2 border-green-500">
                    {currentAnswer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Options Reference Box */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg border-2 border-gray-300">
        <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4">
          Options Reference
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {content.options.map((option) => (
            <div
              key={option.id}
              className="flex items-start space-x-2 p-2 bg-white rounded border border-gray-200"
            >
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-600 text-white text-sm font-bold rounded-full">
                {option.id}
              </span>
              <span className="text-sm text-gray-700 leading-snug">
                {option.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Completion Status */}
      <div className="mt-6 pt-4 border-t border-gray-300">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Progress: {Object.keys(answers).filter(key => answers[Number(key)]).length} / {content.questions.length} answered
          </span>
          {Object.keys(answers).filter(key => answers[Number(key)]).length === content.questions.length && (
            <span className="text-green-600 font-medium flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              All questions answered
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeopleOpinions;
