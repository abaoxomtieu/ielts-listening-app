'use client';

import React, { useState } from 'react';

interface Position {
  x: number;
  y: number;
}

interface Node {
  id: number | string;
  text: string;
  answer?: string;
  position?: Position;
  audioTimeRange?: {
    start: string;
    end: string;
  };
}

interface Connection {
  from: number | string;
  to: number | string;
}

interface Flowchart {
  title?: string;
  nodes: Node[];
  connections: Connection[];
}

interface FlowchartCompletionProps {
  questionText: string;
  instructions: string;
  flowchart: Flowchart;
  wordLimit: string;
  questionNumber?: number;
  showArrows?: boolean;
  verticalLayout?: boolean;
}

export default function FlowchartCompletion({
  questionText,
  instructions,
  flowchart,
  wordLimit,
  questionNumber,
  showArrows = true,
  verticalLayout = true,
}: FlowchartCompletionProps) {
  const [answers, setAnswers] = useState<Record<string | number, string>>({});

  const handleInputChange = (nodeId: number | string, value: string) => {
    setAnswers((prev) => ({ ...prev, [nodeId]: value }));
  };

  const renderTextWithInput = (text: string, nodeId?: number | string) => {
    if (!text || !text.includes('[______]')) {
      return <span className="text-gray-900 font-semibold">{text || ''}</span>;
    }

    if (!nodeId) return <span className="text-gray-900">{text}</span>;

    const parts = (text || '').split('[______]');

    return (
      <div className="flex items-center justify-center gap-2">
        <span className="text-gray-900">{parts[0]}</span>
        <input
          type="text"
          id={`node-${nodeId}`}
          className={`
            w-32 border-b-2 border-gray-500 bg-transparent
            px-2 py-1 text-center
            focus:border-blue-600 focus:outline-none
            text-gray-900
            transition-colors duration-200
          `}
          value={answers[nodeId as any] || ''}
          onChange={(e) => handleInputChange(nodeId, e.target.value)}
          placeholder="_____"
        />
        {parts[1] && <span className="text-gray-900">{parts[1]}</span>}
      </div>
    );
  };

  const renderArrow = () => {
    if (!showArrows) return null;

    return (
      <div className="flex items-center justify-center py-2">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="text-gray-600"
        >
          <path
            d="M12 4L12 20M12 20L5 13M12 20L19 13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  };

  const renderNode = (node: Node, forceNonQuestion: boolean = false) => {
    if (!node) return null;
    const isQuestion = !forceNonQuestion && node.text && node.text.includes('[______]');

    return (
      <div
        className={`
          relative p-4 rounded-lg border-2 shadow-sm
          ${isQuestion
            ? 'bg-white border-blue-400 hover:border-blue-600'
            : 'bg-gray-100 border-gray-400'
          }
          transition-all duration-200
        `}
      >
        {isQuestion && typeof node.id === 'number' && (
          <div className="absolute -top-3 -left-3 w-8 h-8 flex items-center justify-center bg-blue-600 text-white text-sm font-bold rounded-full shadow-md z-10">
            {node.id}
          </div>
        )}

        <div className="text-center">
          {renderTextWithInput(node.text, isQuestion ? node.id : undefined)}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white border-2 border-gray-300 rounded-lg shadow-sm">
      <div className="mb-6 pb-4 border-b-2 border-gray-400">
        {questionNumber && (
          <div className="text-sm font-semibold text-gray-700 mb-2">
            Questions {questionNumber}-{questionNumber + flowchart.nodes.length - 1}
          </div>
        )}
        <h2 className="text-xl font-bold text-gray-900 mb-2">{questionText}</h2>
        <p className="text-sm font-semibold text-gray-700">{instructions}</p>
      </div>

      <div className="mb-6 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
        <p className="text-sm font-semibold text-blue-800">{wordLimit}</p>
      </div>

      {flowchart.title && (
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
            {flowchart.title}
          </h3>
        </div>
      )}

      <div className="bg-white border-2 border-gray-400 rounded-lg p-8 overflow-x-auto">
        <div className="min-w-[300px]">
          <div className="flex flex-col items-center space-y-4">
            {flowchart.nodes.map((node, index) => (
              <React.Fragment key={node.id}>
                {renderNode(node)}
                {index < flowchart.nodes.length - 1 && renderArrow()}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded">
          <div className="w-10 h-10 flex items-center justify-center bg-gray-100 border-2 border-gray-400 rounded">
            <span className="text-xs text-gray-600">Start</span>
          </div>
          <span className="text-sm text-gray-700">Starting point</span>
        </div>

        <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white text-xs font-bold rounded-full">
            #
          </div>
          <span className="text-sm text-gray-700">Answer required</span>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded">
          <div className="w-10 h-10 flex items-center justify-center bg-gray-100 border-2 border-gray-400 rounded">
            <span className="text-xs text-gray-600">End</span>
          </div>
          <span className="text-sm text-gray-700">Ending point</span>
        </div>
      </div>

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
          <li>• Complete the flow chart using information from the audio</li>
          <li>• Follow the arrows to understand the sequence</li>
          <li>• Write your answers in the spaces provided</li>
          <li>• Follow the word limit specified above</li>
        </ul>
      </div>
    </div>
  );
}

