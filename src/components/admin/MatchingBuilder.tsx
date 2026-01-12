'use client';

import React, { useState } from 'react';
import { FormSection, FormField, AudioTimeRange } from './FormBuilder';

interface MatchingQuestion {
  id: number;
  text: string;
}

interface MatchingOption {
  id: string;
  text: string;
}

interface MatchingPair {
  questionId: number;
  optionId: string;
}

interface MatchingBuilderData {
  meta: any;
  content: {
    questionText: string;
    questions: MatchingQuestion[];
    options: MatchingOption[];
    answer: {
      matches: MatchingPair[];
      explanation: string;
    };
    instructions: string;
    wordLimit: string | null;
    audioTimeRange: { start: string; end: string };
    media: any;
    uiHints: any;
    validation: any;
  };
  answerKey: Record<string, string>;
  scoring: any;
}

export default function MatchingBuilder() {
  const [questionText, setQuestionText] = useState<string>('');
  const [instructions, setInstructions] = useState<string>('');
  const [questions, setQuestions] = useState<MatchingQuestion[]>([]);
  const [options, setOptions] = useState<MatchingOption[]>([]);
  const [matches, setMatches] = useState<MatchingPair[]>([]);
  const [explanation, setExplanation] = useState<string>('');
  const [audioTimeRange, setAudioTimeRange] = useState({ start: '00:00', end: '00:00' });
  const [difficulty, setDifficulty] = useState<string>('medium');
  const [section, setSection] = useState<number>(3);
  const [variant, setVariant] = useState<string>('people_opinions');

  const addQuestion = () => {
    const newQuestion: MatchingQuestion = {
      id: Date.now(),
      text: '',
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: number, text: string) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, text } : q));
  };

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id));
    setMatches(matches.filter(m => m.questionId !== id));
  };

  const addOption = () => {
    const optionId = String.fromCharCode(65 + options.length);
    const newOption: MatchingOption = {
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
    setMatches(matches.filter(m => m.optionId !== id));
  };

  const updateMatch = (questionId: number, optionId: string) => {
    const existingMatchIndex = matches.findIndex(m => m.questionId === questionId);
    if (existingMatchIndex >= 0) {
      const newMatches = [...matches];
      newMatches[existingMatchIndex] = { questionId, optionId };
      setMatches(newMatches);
    } else {
      setMatches([...matches, { questionId, optionId }]);
    }
  };

  const removeMatch = (questionId: number) => {
    setMatches(matches.filter(m => m.questionId !== questionId));
  };

  const getOptionForQuestion = (questionId: number): string => {
    const match = matches.find(m => m.questionId === questionId);
    return match?.optionId || '';
  };

  const generateJSON = (): string => {
    const answerKey: Record<string, string> = {};
    matches.forEach(match => {
      answerKey[String(match.questionId)] = match.optionId;
    });

    const data: MatchingBuilderData = {
      meta: {
        questionType: 'matching',
        variant,
        section,
        questionNumber: questions.length > 0 ? questions[0].id : 1,
        difficulty,
        version: '1.0',
        createdAt: new Date().toISOString(),
      },
      content: {
        questionText,
        questions: questions.map((q, idx) => ({ ...q, id: idx + 1 })),
        options,
        answer: {
          matches,
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
          displayType: 'dropdown',
          shuffleOptions: true,
          showLetterLabels: true,
          layout: 'sideBySide',
        },
        validation: {
          minQuestions: 3,
          maxQuestions: 6,
          minOptions: 5,
          maxOptions: 7,
          eachOptionUsedOnce: true,
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
          placeholder="What is each student's opinion about the proposed changes?"
        />
        <FormField
          label="Instructions"
          value={instructions}
          onChange={setInstructions}
          placeholder="Choose the correct letter A-F next to Questions 26-30"
        />
        <FormField
          label="Matching Type"
          type="select"
          value={variant}
          onChange={setVariant}
          options={[
            { value: 'people_opinions', label: 'People Opinions' },
            { value: 'events_info', label: 'Events Information' },
            { value: 'locations_features', label: 'Locations Features' },
            { value: 'custom', label: 'Custom' },
          ]}
        />
        <AudioTimeRange value={audioTimeRange} onChange={setAudioTimeRange} />
        <div className="grid grid-cols-3 gap-4">
          <FormField
            label="Section"
            type="number"
            value={section}
            onChange={(v) => setSection(Number(v))}
            placeholder="3"
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

      <FormSection title="Questions (Left Side)">
        <div className="mb-3">
          <button
            onClick={addQuestion}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
          >
            + Add Question
          </button>
        </div>
        <div className="space-y-3">
          {questions.map((question, index) => (
            <div key={question.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white font-bold rounded-md">
                  {index + 1}
                </span>
                <FormField
                  label="Question Text"
                  value={question.text}
                  onChange={(val) => updateQuestion(question.id, val)}
                  placeholder="Anna"
                />
                <div className="w-32">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Match to</label>
                  <select
                    value={getOptionForQuestion(question.id)}
                    onChange={(e) => updateMatch(question.id, e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">-- Select --</option>
                    {options.map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.id}</option>
                    ))}
                  </select>
                </div>
                {questions.length > 1 && (
                  <button
                    onClick={() => removeQuestion(question.id)}
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

      <FormSection title="Options (Right Side)">
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
                <span className="w-8 h-8 flex items-center justify-center bg-green-600 text-white font-bold rounded-md">
                  {option.id}
                </span>
                <FormField
                  label="Option Text"
                  value={option.text}
                  onChange={(val) => updateOption(option.id, val)}
                  placeholder="Thinks the changes will be too expensive"
                />
                {options.length > 2 && (
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

      <FormSection title="Explanation">
        <FormField
          label="Explanation"
          value={explanation}
          onChange={setExplanation}
          placeholder="Explain the correct matches..."
        />
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
