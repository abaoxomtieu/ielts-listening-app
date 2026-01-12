'use client';

import React, { useState } from 'react';
import { FormSection, FormField, AudioTimeRange } from './FormBuilder';

interface BlankItem {
  id: number;
  position: number;
  answer: string;
  audioTimeRange: { start: string; end: string };
}

interface OptionItem {
  id: string;
  text: string;
}

interface SummaryCompletionBuilderData {
  meta: any;
  content: {
    questionText: string;
    instructions: string;
    summary: {
      text: string;
      blanks: BlankItem[];
    };
    options: OptionItem[];
    answer: Record<string, string>;
    answerLabels: Record<string, string>;
    explanation: string;
    audioTimeRange: { start: string; end: string };
    media: any;
    uiHints: any;
    validation: any;
  };
  answerKey: Record<string, string>;
  scoring: any;
}

export default function SummaryCompletionBuilder() {
  const [questionText, setQuestionText] = useState<string>('Complete the summary below. Choose');
  const [instructions, setInstructions] = useState<string>('ONE WORD ONLY');
  const [summaryText, setSummaryText] = useState<string>('');
  const [wordLimit, setWordLimit] = useState<string>('ONE WORD ONLY');
  const [blanks, setBlanks] = useState<BlankItem[]>([]);
  const [options, setOptions] = useState<OptionItem[]>([]);
  const [audioTimeRange, setAudioTimeRange] = useState({ start: '00:00', end: '00:00' });
  const [difficulty, setDifficulty] = useState<string>('medium');
  const [section, setSection] = useState<number>(4);

  const addBlank = () => {
    const newBlank: BlankItem = {
      id: Date.now(),
      position: 0,
      answer: '',
      audioTimeRange: { start: '00:00', end: '00:00' },
    };
    setBlanks([...blanks, newBlank]);
  };

  const updateBlank = (id: number, updates: Partial<BlankItem>) => {
    setBlanks(blanks.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const removeBlank = (id: number) => {
    setBlanks(blanks.filter(b => b.id !== id));
  };

  const addOption = () => {
    const optionId = String.fromCharCode(65 + options.length);
    const newOption: OptionItem = {
      id: optionId,
      text: '',
    };
    setOptions([...options, newOption]);
  };

  const updateOption = (id: string, text: string) => {
    setOptions(options.map(o => o.id === id ? { ...o, text } : o));
  };

  const removeOption = (id: string) => {
    if (options.length <= 1) return;
    setOptions(options.filter(o => o.id !== id));
  };

  const generateJSON = (): string => {
    const answerKey: Record<string, string> = {};
    const answerLabels: Record<string, string> = {};

    blanks.forEach((blank, idx) => {
      const blankNum = idx + 31;
      answerKey[String(blankNum)] = blank.answer;
    });

    options.forEach(opt => {
      blanks.forEach((blank, idx) => {
        if (opt.text.toLowerCase() === blank.answer.toLowerCase()) {
          answerLabels[String(idx + 31)] = opt.id;
        }
      });
    });

    const data: SummaryCompletionBuilderData = {
      meta: {
        questionType: 'completion',
        variant: 'summary_completion',
        section: section,
        questionNumber: 31,
        difficulty: difficulty,
        version: '1.0',
        createdAt: new Date().toISOString(),
      },
      content: {
        questionText,
        instructions,
        summary: {
          text: summaryText,
          blanks: blanks.map((b, idx) => ({
            ...b,
            id: idx + 31,
            position: idx * 50,
          })),
        },
        options,
        answer: answerKey,
        answerLabels,
        explanation: '',
        audioTimeRange,
        media: {
          image: null,
          audio: '/audio/section4.mp3',
        },
        uiHints: {
          displayType: 'summary',
          showOptions: true,
          dropdownForBlanks: true,
          shuffleOptions: false,
        },
        validation: {
          minQuestions: 3,
          maxQuestions: 8,
          wordLimit,
        },
      },
      answerKey,
      scoring: {
        points: 1,
        partialCredit: false,
        penaltyForWrong: 0,
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
          placeholder="Complete the summary below. Choose"
        />
        <FormField
          label="Instructions"
          value={instructions}
          onChange={setInstructions}
          placeholder="ONE WORD ONLY"
        />
        <FormField
          label="Word Limit"
          value={wordLimit}
          onChange={setWordLimit}
          placeholder="ONE WORD ONLY"
        />
        <AudioTimeRange value={audioTimeRange} onChange={setAudioTimeRange} />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Section"
            type="number"
            value={section}
            onChange={(v) => setSection(Number(v))}
            placeholder="4"
          />
          <FormField
            label="Difficulty"
            type="select"
            value={difficulty}
            onChange={setDifficulty}
            options={[
              { value: 'easy', label: 'Easy' },
              { value: 'medium', label: 'Medium' },
              { value: 'hard', label: 'Hard' },
            ]}
          />
        </div>
      </FormSection>

      <FormSection title="Summary Text">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Summary Text with Blanks
          </label>
          <textarea
            value={summaryText}
            onChange={(e) => setSummaryText(e.target.value)}
            placeholder="The lecture discusses the history of [31]. The first cameras were invented in the [32] century..."
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-colors"
            rows={6}
          />
          <p className="text-xs text-gray-500 mt-1">
            Use [31], [32], etc. to indicate blank positions
          </p>
        </div>
      </FormSection>

      <FormSection title="Blanks">
        <div className="mb-3">
          <button
            onClick={addBlank}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
          >
            + Add Blank
          </button>
        </div>
        <div className="space-y-4">
          {blanks.map((blank, index) => (
            <div key={blank.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-700">Blank {index + 31}</span>
                <button
                  onClick={() => removeBlank(blank.id)}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Answer"
                  value={blank.answer}
                  onChange={(val) => updateBlank(blank.id, { answer: val })}
                  placeholder="photography"
                />
                <AudioTimeRange
                  value={blank.audioTimeRange}
                  onChange={(val) => updateBlank(blank.id, { audioTimeRange: val })}
                />
              </div>
            </div>
          ))}
        </div>
      </FormSection>

      <FormSection title="Options">
        <div className="mb-3">
          <button
            onClick={addOption}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
          >
            + Add Option
          </button>
        </div>
        <div className="space-y-3">
          {options.map((option, index) => (
            <div key={option.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 flex items-center justify-center bg-indigo-600 text-white font-bold rounded-md">
                  {option.id}
                </span>
                <FormField
                  label="Option Text"
                  value={option.text}
                  onChange={(val) => updateOption(option.id, val)}
                  placeholder="photography"
                />
                {options.length > 1 && (
                  <button
                    onClick={() => removeOption(option.id)}
                    className="mt-4 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </FormSection>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Generated JSON Preview</h3>
        <pre className="text-xs bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto max-h-64">
          {generateJSON()}
        </pre>
      </div>
    </div>
  );
}
