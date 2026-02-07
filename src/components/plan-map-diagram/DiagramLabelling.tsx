'use client';

import React, { useState } from 'react';
import * as Select from '@radix-ui/react-select';
import { DiagramLabelling as DiagramLabellingType } from '../../types';

interface DiagramLabellingProps {
  data: DiagramLabellingType;
  disabled?: boolean;
}

export default function DiagramLabelling({ data, disabled = false }: DiagramLabellingProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});
  const { content } = data;
  const { image, questions, processFlow, uiHints } = content;

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
        return 'left-full ml-2';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white border-2 border-gray-300 rounded-lg shadow-sm">
      <div className="mb-6 pb-4 border-b-2 border-gray-400">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{content.questionText}</h2>
        <p className="text-sm font-semibold text-gray-700">{content.instructions}</p>
      </div>

      {processFlow && uiHints?.showProcessFlow && (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded">
          <h4 className="font-bold text-gray-900 mb-3">Process Flow</h4>
          <div className="space-y-2">
            {processFlow.map((step) => (
              <div key={step.step} className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 border-2 border-blue-300 rounded-full text-sm font-bold text-blue-700">
                  {step.step}
                </span>
                <span className="text-sm text-gray-700">{step.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="relative inline-block max-w-full">
          <img
            src={image.url}
            alt={image.altText}
            className="block max-w-full h-auto border border-gray-300 rounded"
          />

          {image.hotspots?.map((hotspot) => {
            const imgW = image.width || 1;
            const imgH = image.height || 1;
            const leftPct = (hotspot.x / imgW) * 100;
            const topPct = (hotspot.y / imgH) * 100;
            return (
            <div
              key={hotspot.id}
              className="absolute flex items-center -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${leftPct}%`, top: `${topPct}%` }}
            >
              <div className={getHotspotLabelStyle(hotspot.position)}>
                <div className="flex items-center gap-2">
                  {hotspot.connector === 'arrow' && (
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  )}

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
              </div>
            </div>
            );
          })}
        </div>
      </div>

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
