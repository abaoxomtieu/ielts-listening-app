'use client';

import React, { useState } from 'react';
import { FormSection, FormField, AudioTimeRange } from './FormBuilder';

interface MCQOption {
  id: string;
  text: string;
}

interface MultipleAnswersMCQBuilderData {
  meta: any;
  content: {
    questionText: string;
    options: MCQOption[];
    answer: {
      correctOptions: string[];
      explanation: string;
    };
    instructions: string;
    wordLimit: string | null;
    audioTimeRange: { start: string; end: string };
    media: any;
    uiHints: any;
    validation: any;
  };
  answerKey: string[];
  scoring: any;
}

export default function MultipleAnswersMCQBuilder() {
  const [questionText, setQuestionText] = useState<string>('');
  const [instructions, setInstructions] = useState<string>('');
  const [options, setOptions] = useState<MCQOption[]>([
    { id: 'A', text: '' },
    { id: 'B', text: '' },
    { id: 'C', text: '' },
    { id: 'D', text: '' },
  ]);
  const [correctOptions, setCorrectOptions] = useState<string[]>([]);
  const [minSelectable, setMinSelectable] = useState<number>(2);
  const [maxSelectable, setMaxSelectable] = useState<number>(2);
  const [explanation, setExplanation] = useState<string>('');
  const [audioTimeRange, setAudioTimeRange] = useState({ start: '00:00', end: '00:00' });
  const [difficulty, setDifficulty] = useState<string>('hard');
  const [section, setSection] = useState<number>(3);
  const [shuffleOptions, setShuffleOptions] = useState<boolean>(false);

  const updateOption = (id: string, text: string) => {
    setOptions(options.map(o => o.id === id ? { ...o, text } : o));
  };

  const addOption = () => {
    if (options.length >= 7) return;
    const newId = String.fromCharCode(65 + options.length);
    setOptions([...options, { id: newId, text: '' }]);
  };

  const removeOption = (id: string) => {
    if (options.length <= 4) return;
    const newOptions = options.filter(o => o.id !== id);
    setOptions(newOptions.map((o, idx) => ({ ...o, id: String.fromCharCode(65 + idx) })));
    setCorrectOptions(correctOptions.filter(c => c !== id));
  };

  const toggleCorrectOption = (id: string) => {
    if (correctOptions.includes(id)) {
      setCorrectOptions(correctOptions.filter(c => c !== id));
    } else {
      setCorrectOptions([...correctOptions, id]);
    }
  };

  const generateJSON = (): string => {
    const data: MultipleAnswersMCQBuilderData = {
      meta: {
        questionType: 'multiple_choice',
        variant: 'multiple_answers',
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
          correctOptions,
          explanation,
        },
        instructions,
        wordLimit: null,
        audioTimeRange,
        media: {
          image: null,
          audio: '/audio/section3.mp3',
        },
        uiHints: {
          displayType: 'checkbox',
          shuffleOptions,
          showLetterLabels: true,
          maxSelectable,
          minSelectable,
        },
        validation: {
          minOptions: 5,
          maxOptions: 7,
          required: true,
          minCorrectRequired: minSelectable,
        },
      },
      answerKey: correctOptions,
      scoring: {
        points: 1,
        partialCredit: false,
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
          placeholder="Which TWO of the following methods...?"
        />
        <FormField
          label="Instructions"
          value={instructions}
          onChange={setInstructions}
          placeholder="Choose TWO letters A-G"
        />
      </FormSection>

      <FormSection title="Options">
        <div className="space-y-3">
          {options.map((option, index) => (
            <div key={option.id} className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={correctOptions.includes(option.id)}
                  onChange={() => toggleCorrectOption(option.id)}
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
              {options.length > 4 && (
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
        {options.length < 7 && (
          <button
            onClick={addOption}
            className="mt-3 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            + Add Option
          </button>
        )}
      </FormSection>

      <FormSection title="Settings">
        <div className="grid grid-cols-3 gap-4">
          <FormField
            label="Section"
            type="number"
            value={section}
            onChange={(v) => setSection(Number(v))}
          />
          <FormField
            label="Min Selectable"
            type="number"
            value={minSelectable}
            onChange={(v) => setMinSelectable(Number(v))}
          />
          <FormField
            label="Max Selectable"
            type="number"
            value={maxSelectable}
            onChange={(v) => setMaxSelectable(Number(v))}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
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
          <label className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              checked={shuffleOptions}
              onChange={(e) => setShuffleOptions(e.target.checked)}
            />
            <span>Shuffle Options</span>
          </label>
        </div>
        <AudioTimeRange value={audioTimeRange} onChange={setAudioTimeRange} />
      </FormSection>

      <FormSection title="Explanation">
        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Explain the correct answers..."
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
