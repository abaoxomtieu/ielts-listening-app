'use client';

import React, { useState } from 'react';
import { FormSection, FormField, AudioTimeRange } from './FormBuilder';

interface TableCell {
  id: number;
  content: string;
  answer: string;
  audioTimeRange: { start: string; end: string };
}

interface TableRow {
  id: number;
  cells: TableCell[];
}

interface TableColumn {
  id: number;
  header: string;
}

interface TableCompletionBuilderData {
  meta: any;
  content: {
    questionText: string;
    instructions: string;
    tableData: {
      title: string;
      columns: { id: number; header: string }[];
      rows: { id: number; cells: TableCell[] }[];
    };
    wordLimit: string;
    answer: Record<string, string>;
    explanation: string;
    audioTimeRange: any;
    media: any;
    uiHints: any;
    validation: any;
  };
  answerKey: Record<string, string>;
  scoring: any;
}

export default function TableCompletionBuilder() {
  const [questionText, setQuestionText] = useState<string>('');
  const [instructions, setInstructions] = useState<string>('');
  const [wordLimit, setWordLimit] = useState<string>('ONE WORD ONLY');
  const [tableTitle, setTableTitle] = useState<string>('');
  const [columns, setColumns] = useState<TableColumn[]>([
    { id: 1, header: '' },
    { id: 2, header: '' },
  ]);
  const [rows, setRows] = useState<TableRow[]>([]);

  const addColumn = () => {
    setColumns([...columns, { id: Date.now(), header: '' }]);
  };

  const removeColumn = (index: number) => {
    if (columns.length <= 1) return;
    setColumns(columns.filter((_, i) => i !== index));
    setRows(rows.map(row => ({
      ...row,
      cells: row.cells.filter((_, i) => i !== index),
    })));
  };

  const updateColumn = (index: number, header: string) => {
    setColumns(columns.map((c, i) => i === index ? { ...c, header } : c));
  };

  const addRow = () => {
    const newRow: TableRow = {
      id: Date.now(),
      cells: columns.map(col => ({
        id: Date.now() + Math.random(),
        content: '',
        answer: '',
        audioTimeRange: { start: '00:00', end: '00:00' },
      })),
    };
    setRows([...rows, newRow]);
  };

  const removeRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const updateCell = (rowIndex: number, cellIndex: number, updates: Partial<TableCell>) => {
    setRows(rows.map((row, ri) => {
      if (ri !== rowIndex) return row;
      return {
        ...row,
        cells: row.cells.map((cell, ci) => ci === cellIndex ? { ...cell, ...updates } : cell),
      };
    }));
  };

  const generateJSON = (): string => {
    const data: TableCompletionBuilderData = {
      meta: {
        questionType: 'completion',
        variant: 'table_completion',
        section: 4,
        questionNumber: 31,
        difficulty: 'medium',
        version: '1.0',
        createdAt: new Date().toISOString(),
      },
      content: {
        questionText,
        instructions,
        tableData: {
          title: tableTitle,
          columns: columns.map((c, i) => ({ ...c, id: i + 1 })),
          rows: rows.map((row, ri) => ({
            ...row,
            cells: row.cells.map((cell, ci) => ({
              ...cell,
              id: ci + 1,
            })),
          })),
        },
        wordLimit,
        answer: {},
        explanation: '',
        audioTimeRange: { start: '02:00', end: '05:00' },
        media: {
          image: null,
          audio: '/audio/section4.mp3',
        },
        uiHints: {
          displayType: 'table',
          showHeaders: true,
          cellPadding: 'normal',
        },
        validation: {
          minFields: 1,
          maxFields: 20,
        },
      },
      answerKey: {},
      scoring: {
        points: 1,
      },
    };

    return JSON.stringify(data, null, 2);
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-xl shadow-lg">
      <FormSection title="Question Information">
        <FormField
          label="Question Text"
          value={questionText}
          onChange={setQuestionText}
          placeholder="Complete the table below. Write"
        />
        <FormField
          label="Instructions"
          value={instructions}
          onChange={setInstructions}
          placeholder="ONE WORD ONLY"
        />
      </FormSection>

      <FormSection title="Table Information">
        <FormField
          label="Table Title"
          value={tableTitle}
          onChange={setTableTitle}
          placeholder="COMPARISON OF TRANSPORT METHODS"
        />
        <FormField
          label="Word Limit"
          value={wordLimit}
          onChange={setWordLimit}
          placeholder="ONE WORD ONLY"
        />
      </FormSection>

      <FormSection title="Table Columns">
        <div className="mb-3 flex gap-2">
          <button
            onClick={addColumn}
            className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg font-semibold transition-colors"
          >
            + Add Column
          </button>
        </div>
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
          {columns.map((column, colIndex) => (
            <div key={column.id} className="p-3 bg-gray-100 rounded-lg border border-gray-300">
              <FormField
                label={`Column ${colIndex + 1} Header`}
                value={column.header}
                onChange={(val) => updateColumn(colIndex, val)}
                placeholder="Header"
              />
              {columns.length > 1 && (
                <button
                  onClick={() => removeColumn(colIndex)}
                  className="w-full mt-2 px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                >
                  Remove Column
                </button>
              )}
            </div>
          ))}
        </div>
      </FormSection>

      <FormSection title="Table Rows">
        <div className="mb-3">
          <button
            onClick={addRow}
            className="w-full px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg font-semibold transition-colors"
          >
            + Add Row
          </button>
        </div>
        {rows.map((row, rowIndex) => (
          <div key={row.id} className="p-4 bg-gray-100 rounded-lg border border-gray-300 mb-4">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="font-medium text-black">Row {rowIndex + 1}</h4>
              <button
                onClick={() => removeRow(rowIndex)}
                className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
              >
                Remove Row
              </button>
            </div>
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
              {row.cells.map((cell, cellIndex) => (
                <div key={cell.id} className="p-3 bg-white rounded-lg border border-gray-300">
                  <FormField
                    label={`${columns[cellIndex].header || `Column ${cellIndex + 1}`}`}
                    value={cell.content}
                    onChange={(val) => updateCell(rowIndex, cellIndex, { content: val })}
                    placeholder="Cell content or [______] for answer"
                  />
                  <FormField
                    label="Answer"
                    value={cell.answer}
                    onChange={(val) => updateCell(rowIndex, cellIndex, { answer: val })}
                    placeholder="Answer here"
                  />
                  <AudioTimeRange
                    value={cell.audioTimeRange}
                    onChange={(val) => updateCell(rowIndex, cellIndex, { audioTimeRange: val })}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </FormSection>

      <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-gray-300">
        <h3 className="text-lg font-bold text-black mb-2">Generated JSON Preview</h3>
        <pre className="text-xs bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto max-h-64">
          {generateJSON()}
        </pre>
      </div>
    </div>
  );
}
