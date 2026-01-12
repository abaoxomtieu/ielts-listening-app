'use client';

import React, { useState } from 'react';
import * as Select from '@radix-ui/react-select';

interface FormField {
  id: number;
  label: string;
  placeholder?: string;
  inputType: string;
  required: boolean;
  answer: string;
  audioTimeRange?: {
    start: string;
    end: string;
  };
  options?: string[];
}

interface FormCompletionFormData {
  formTitle: string;
  formType?: string;
  fields: FormField[];
}

interface FormCompletionProps {
  questionText: string;
  instructions: string;
  formData: FormCompletionFormData;
  wordLimit: string;
  questionNumber?: number;
  showFieldNumbers?: boolean;
}

export default function FormCompletion({
  questionText,
  instructions,
  formData,
  wordLimit,
  questionNumber,
  showFieldNumbers = true,
}: FormCompletionProps) {
  const formCompletionData = formData;
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});

  const handleInputChange = (fieldId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSelectChange = (fieldId: number, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [fieldId]: value }));
  };

  const renderInput = (field: FormField) => {
    const commonProps = {
      id: `field-${field.id}`,
      className: `
        w-full border-b-2 border-gray-400 bg-transparent px-2 py-1
        focus:border-black focus:outline-none
        text-gray-900 placeholder-gray-400
        transition-colors duration-200
      `,
    };

    if (field.inputType === 'select' && field.options) {
      return (
        <div className="relative">
          <Select.Root
            value={selectedOptions[field.id] || ''}
            onValueChange={(value) => handleSelectChange(field.id, value)}
          >
            <Select.Trigger
              className={`
                flex h-10 w-full items-center justify-between
                border-b-2 border-gray-400 bg-transparent px-2 py-1
                focus:border-black focus:outline-none
                text-gray-900
                transition-colors duration-200
              `}
            >
              <Select.Value placeholder="Select an option" />
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
                  z-50
                `}
              >
                <Select.Viewport className="p-1">
                  {field.options.map((option) => (
                    <Select.Item
                      key={option}
                      value={option}
                      className={`
                        relative flex cursor-pointer select-none items-center
                        rounded-sm px-4 py-2 text-sm text-gray-900
                        focus:bg-gray-200 focus:text-black
                        outline-none
                      `}
                    >
                      <Select.ItemText>{option}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
      );
    }

    switch (field.inputType) {
      case 'email':
        return (
          <input
            type="email"
            {...commonProps}
            placeholder={field.placeholder || ''}
            value={answers[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
          />
        );
      case 'tel':
        return (
          <input
            type="tel"
            {...commonProps}
            placeholder={field.placeholder || ''}
            value={answers[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
          />
        );
      case 'number':
        return (
          <input
            type="number"
            {...commonProps}
            placeholder={field.placeholder || ''}
            value={answers[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
          />
        );
      case 'date':
        return (
          <input
            type="text"
            {...commonProps}
            placeholder={field.placeholder || ''}
            value={answers[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
          />
        );
      default:
        return (
          <input
            type="text"
            {...commonProps}
            placeholder={field.placeholder || ''}
            value={answers[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
          />
        );
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white border-2 border-gray-300 rounded-lg shadow-sm">
      {/* Header Section */}
      <div className="mb-6 pb-4 border-b-2 border-gray-400">
        {questionNumber && (
          <div className="text-sm font-semibold text-gray-700 mb-2">
            Questions {questionNumber}-{questionNumber + formCompletionData.fields.length - 1}
          </div>
        )}
        <h2 className="text-xl font-bold text-gray-900 mb-2">{questionText}</h2>
        <p className="text-sm font-semibold text-gray-700">{instructions}</p>
      </div>

      {/* Word Limit Notice */}
      <div className="mb-6 p-3 bg-gray-100 border-l-4 border-black rounded">
        <p className="text-sm font-semibold text-black">{wordLimit}</p>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Form Title */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
            {formCompletionData.formTitle}
          </h3>
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
          {formCompletionData.fields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-4">
              {/* Question Number */}
              {showFieldNumbers && (
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 border-2 border-gray-300 rounded-full text-sm font-bold text-gray-700">
                  {field.id}
                </div>
              )}

              {/* Label and Input */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor={`field-${field.id}`}
                    className="flex-shrink-0 text-sm font-semibold text-gray-900"
                  >
                    {field.label}
                  </label>
                  {field.required && (
                    <span className="text-red-500 text-xs">*</span>
                  )}
                </div>
                <div className="mt-1">
                  {renderInput(field)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Complete all required fields. Fields marked with * are required.
        </p>
      </div>
    </div>
  );
}
