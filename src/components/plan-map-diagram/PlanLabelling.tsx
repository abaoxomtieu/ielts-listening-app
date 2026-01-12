'use client';

import React, { useState } from 'react';
import * as Select from '@radix-ui/react-select';
import { PlanLabelling as PlanLabellingType } from '../../types';

interface PlanLabellingProps {
  data: PlanLabellingType;
  disabled?: boolean;
}

export default function PlanLabelling({ data, disabled = false }: PlanLabellingProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});
  const { content } = data;
  const { image, questions, uiHints } = content;

  const handleSelectChange = (hotspotId: number, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [hotspotId]: value }));
  };

  const getHotspotLabelStyle = (position: string) => {
    switch (position) {
      case 'top':
        return 'bottom-full mb-2';
      case 'bottom':
        return 'top-full mt-2';
      case 'left':
        return 'right-full mr-2';
      case 'right':
        return 'left-full ml-2';
      default:
        return 'top-full mt-2';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white border-2 border-gray-300 rounded-lg shadow-sm">
      {/* Header Section */}
      <div className="mb-6 pb-4 border-b-2 border-gray-400">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{content.questionText}</h2>
        <p className="text-sm font-semibold text-gray-700">{content.instructions}</p>
      </div>

      {/* Image with Hotspots */}
      <div className="mb-8">
        <div className="relative inline-block">
          <img
            src={image.url}
            alt={image.altText}
            style={{ width: image.width || '100%', height: image.height || 'auto' }}
            className="border border-gray-300 rounded"
          />

          {/* Hotspots */}
          {image.hotspots?.map((hotspot) => (
            <div
              key={hotspot.id}
              className="absolute flex flex-col items-center"
              style={{ left: hotspot.x, top: hotspot.y }}
            >
              {/* Label Positioning */}
              <div className={getHotspotLabelStyle(hotspot.position)}>
                <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mb-1">
                  {hotspot.label}
                </div>

                {/* Dropdown */}
                {uiHints?.alphabeticalOptions && (
                  <div className="bg-white border-2 border-gray-300 rounded shadow-sm">
                    <Select.Root
                      value={selectedOptions[hotspot.id] || ''}
                      onValueChange={(value) => handleSelectChange(hotspot.id, value)}
                      disabled={disabled}
                    >
                      <Select.Trigger
                        className="flex items-center justify-between px-3 py-2 text-sm bg-white border-2 border-gray-400 rounded focus:border-blue-600 focus:outline-none hover:border-blue-500 transition-colors min-w-[60px]"
                        aria-label={`Select answer for ${hotspot.label}`}
                      >
                        <Select.Value placeholder="?" />
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
                          className="overflow-hidden bg-white border-2 border-gray-300 rounded shadow-lg max-h-48 z-50"
                          position="popper"
                          sideOffset={5}
                        >
                          <Select.Viewport className="p-1">
                            {uiHints.alphabeticalOptions.map((option) => (
                              <Select.Item
                                key={option}
                                value={option}
                                className="relative flex items-center px-4 py-2 text-sm rounded cursor-pointer hover:bg-gray-100 focus:bg-blue-50 focus:outline-none transition-colors"
                              >
                                <Select.ItemText>{option}</Select.ItemText>
                              </Select.Item>
                            ))}
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>
                  </div>
                )}
              </div>

              {/* Connector */}
              {hotspot.connector && (
                <div className="absolute text-xs text-gray-500 font-medium">
                  {hotspot.connector}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4">
          Questions
        </h3>
        {questions.map((question) => (
          <div
            key={question.id}
            className="flex items-start space-x-4 p-4 bg-gray-50 rounded border border-gray-200"
          >
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-600 text-white font-bold rounded-md">
              {question.id}
            </div>
            <p className="text-base text-gray-800">{question.text}</p>
          </div>
        ))}
      </div>

      {/* Options Reference */}
      {uiHints?.alphabeticalOptions && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border-2 border-gray-300">
          <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-3">
            Options
          </h4>
          <div className="flex flex-wrap gap-2">
            {uiHints.alphabeticalOptions.map((option) => (
              <div
                key={option}
                className="flex items-center justify-center w-10 h-10 bg-white border-2 border-gray-300 rounded-md text-sm font-bold text-gray-700"
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
