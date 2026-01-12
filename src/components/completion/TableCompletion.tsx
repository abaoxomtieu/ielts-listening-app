'use client';

import React, { useState } from 'react';

interface Cell {
  value: string;
  isEditable: boolean;
  answer?: string;
  audioTimeRange?: {
    start: string;
    end: string;
  };
}

interface Row {
  id: number;
  cells: Cell[];
}

interface Table {
  title?: string;
  headers: string[];
  rows: Row[];
}

interface TableCompletionProps {
  questionText: string;
  instructions: string;
  table: Table;
  wordLimit: string;
  questionNumber?: number;
  showRowNumbers?: boolean;
  showColumnHeaders?: boolean;
}

export default function TableCompletion({
  questionText,
  instructions,
  table,
  wordLimit,
  questionNumber,
  showRowNumbers = false,
  showColumnHeaders = true,
}: TableCompletionProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleInputChange = (rowId: number, cellIndex: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [`${rowId}-${cellIndex}`]: value }));
  };

  const isCellEditable = (rowId: number, cellIndex: number): boolean => {
    const row = table.rows.find((r) => r.id === rowId);
    return row?.cells[cellIndex]?.isEditable || false;
  };

  const getAnswerForCell = (rowId: number, cellIndex: number): string => {
    return answers[`${rowId}-${cellIndex}`] || '';
  };

  const getTotalQuestions = () => {
    return table.rows.reduce((total, row) => {
      return (
        total +
        row.cells.filter((cell) => cell.isEditable).length
      );
    }, 0);
  };

  const getQuestionNumberForRow = (rowIndex: number): number => {
    let questionCount = 0;
    for (let i = 0; i < rowIndex; i++) {
      questionCount += table.rows[i].cells.filter((cell) => cell.isEditable).length;
    }
    return (questionNumber || 1) + questionCount;
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-white border-2 border-gray-300 rounded-lg shadow-sm">
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

      {/* Table Title */}
      {table.title && (
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">{table.title}</h3>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto border-2 border-gray-400 rounded-lg">
        <table className="w-full border-collapse">
          {/* Table Header */}
          {showColumnHeaders && (
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-400">
                {showRowNumbers && (
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 border-r border-gray-300 w-16">
                    No.
                  </th>
                )}
                {table.headers.map((header, index) => (
                  <th
                    key={index}
                    className={`
                      px-4 py-3 text-left text-sm font-bold text-gray-700
                      ${index < table.headers.length - 1 ? 'border-r border-gray-300' : ''}
                    `}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
          )}

          {/* Table Body */}
          <tbody>
            {table.rows.map((row, rowIndex) => {
              const rowQuestionNum = getQuestionNumberForRow(rowIndex);
              const editableCellCount = row.cells.filter((cell) => cell.isEditable).length;

              return (
                <tr
                  key={row.id}
                  className={`
                    border-b border-gray-300
                    ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    hover:bg-blue-50 transition-colors duration-150
                  `}
                >
                  {/* Row Number */}
                  {showRowNumbers && (
                    <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-300 text-center">
                      {rowIndex + 1}
                    </td>
                  )}

                  {/* Cells */}
                  {row.cells.map((cell, cellIndex) => {
                    const isEditable = cell.isEditable;
                    const questionNum = isEditable ? rowQuestionNum + row.cells.slice(0, cellIndex).filter((c) => c.isEditable).length : null;

                    return (
                      <td
                        key={cellIndex}
                        className={`
                          px-4 py-3 text-sm text-gray-900
                          ${cellIndex < row.cells.length - 1 ? 'border-r border-gray-300' : ''}
                          ${isEditable ? 'relative' : ''}
                        `}
                      >
                        {isEditable ? (
                          <div className="relative group">
                            {/* Question Number Badge */}
                            <div className="absolute -top-2 -left-2 w-6 h-6 flex items-center justify-center bg-blue-600 text-white text-xs font-bold rounded-full z-10">
                              {questionNum}
                            </div>
                            <input
                              type="text"
                              className={`
                                w-full border-b-2 border-gray-500 bg-transparent
                                px-2 py-1
                                focus:border-blue-600 focus:outline-none focus:bg-white
                                text-gray-900
                                transition-colors duration-200
                                ${cell.value !== '[______]' ? 'ml-4' : ''}
                              `}
                              value={getAnswerForCell(row.id, cellIndex)}
                              onChange={(e) =>
                                handleInputChange(row.id, cellIndex, e.target.value)
                              }
                              placeholder={cell.value === '[______]' ? '_____' : ''}
                            />
                          </div>
                        ) : (
                          <span>{cell.value}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 flex items-center justify-center bg-blue-600 text-white text-xs font-bold rounded-full">
            #
          </div>
          <span>Editable cell</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-4 border-b-2 border-gray-500"></div>
          <span>Write answer here</span>
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
          <li>• Complete the table using information from the audio</li>
          <li>• Write your answers in the editable cells marked with question numbers</li>
          <li>• Follow the word limit specified above</li>
        </ul>
      </div>
    </div>
  );
}
