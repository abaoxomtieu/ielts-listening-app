'use client';

import React, { useState } from 'react';
import { FormSection, FormField, AudioTimeRange } from './FormBuilder';

interface MCQOption {
  id: string;
  text: string;
}

interface SingleAnswerMCQBuilderData {
  meta: any;
  content: {
    questionText: string;
    options: MCQOption[];
    answer: {
      correctOption: string;
      explanation: string;
    };
    wordLimit: string | null;
    audioTimeRange: { start: string; end: string };
    media: any;
    uiHints: any;
    validation: any;
  };
  answerKey: string;
  scoring: any;
}

export default function SingleAnswerMCQBuilder() {
  const [questionText, setQuestionText] = useState<string>('');
  const [options, setOptions] = useState<MCQOption[]>([
    { id: 'A', text: '' },
    { id: 'B', text: '' },
    { id: 'C', text: '' },
    { id: 'D', text: '' },
  ]);
  const [correctOption, setCorrectOption] = useState<string>('A');
  const [explanation, setExplanation] = useState<string>('');
  const [audioTimeRange, setAudioTimeRange] = useState({ start: '00:00', end: '00:00' });
  const [difficulty, setDifficulty] = useState<string>('medium');
  const [section, setSection] = useState<number>(3);
  const [shuffleOptions, setShuffleOptions] = useState<boolean>(false);

  const updateOption = (id: string, text: string) => {
    setOptions(options.map(o => o.id === id ? { ...o, text } : o));
  };

  const addOption = () => {
    if (options.length >= 5) return;
    const newId = String.fromCharCode(65 + options.length);
    setOptions([...options, { id: newId, text: '' }]);
  };

  const removeOption = (id: string) => {
    if (options.length <= 3) return;
    const newOptions = options.filter(o => o.id !== id);
    setOptions(newOptions.map((o, idx) => ({ ...o, id: String.fromCharCode(65 + idx) })));
    if (correctOption === id) setCorrectOption('A');
  };

  const generateJSON = (): string => {
    const data: SingleAnswerMCQBuilderData = {
      meta: {
        questionType: 'multiple_choice',
        variant: 'single_answer',
        section,
        questionNumber: 1,
        difficulty,
        version: '1.0',
        createdAt: new Date().toISOString(),
      },
      content: {
        questionText,
        options,
        answer: {
          correctOption,
          explanation,
        },
        wordLimit: null,
        audioTimeRange,
        media: {
          image: null,
          audio: '/audio/section3.mp3',
        },
        uiHints: {
          displayType: 'radio',
          shuffleOptions,
          showLetterLabels: true,
        },
        validation: {
          minOptions: 3,
          maxOptions: 4,
          required: true,
        },
      },
      answerKey: correctOption,
      scoring: {
        points: 1,
        penaltyForWrong: 0,
      },
    };

    return JSON.stringify(data, null, 2);
  };

  return (
    <div className="space-y-6 p-6">
      <FormSection title="Question">
        <FormField
          label="Question Text"
          value={questionText}
          onChange={setQuestionText}
          placeholder="What is the main reason...?"
        />
      </FormSection>

      <FormSection title="Options">
        <div className="space-y-3">
          {options.map((option, index) => (
            <div key={option.id} className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="correctOption"
                  checked={correctOption === option.id}
                  onChange={() => setCorrectOption(option.id)}
                  className="w-4 h-4"
                />
                <span className="font-medium">{option.id}</span>
              </label>
              <input
                type="text"
                value={option.text}
                onChange={(e) => updateOption(option.id, e.target.value)}
                placeholder={`Option ${option.id}`}
                className="flex-1 px-3 py-2 border rounded"
              />
              {options.length > 3 && (
                <button
                  onClick={() => removeOption(option.id)}
                  className="px-2 py-1 text-sm border border-red-500 text-red-500 rounded hover:bg-red-50"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        {options.length < 5 && (
          <button
            onClick={addOption}
            className="mt-3 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            + Add Option
          </button>
        )}
      </FormSection>

      <FormSection title="Settings">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Section"
            type="number"
            value={section}
            onChange={(v) => setSection(Number(v))}
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
        <label className="flex items-center gap-2 mt-3">
          <input
            type="checkbox"
            checked={shuffleOptions}
            onChange={(e) => setShuffleOptions(e.target.checked)}
          />
          <span>Shuffle Options</span>
        </label>
        <AudioTimeRange value={audioTimeRange} onChange={setAudioTimeRange} />
      </FormSection>

      <FormSection title="Explanation">
        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Explain the correct answer..."
          className="w-full px-3 py-2 border rounded"
          rows={3}
        />
      </FormSection>

      <div className="p-4 border rounded">
        <h3 className="font-medium mb-2">JSON Preview</h3>
        <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto">
          {generateJSON()}
        </pre>
      </div>
    </div>
  );
}
