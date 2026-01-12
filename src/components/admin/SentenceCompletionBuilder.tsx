'use client';

import React, { useState } from 'react';
import { FormSection, FormField, AudioTimeRange } from './FormBuilder';

interface SentenceItem {
  id: number;
  text: string;
  blankPosition: 'start' | 'middle' | 'end';
  answer: string;
  fullSentence: string;
  audioTimeRange: { start: string; end: string };
}

interface SentenceCompletionBuilderData {
  meta: any;
  content: {
    questionText: string;
    instructions: string;
    sentences: SentenceItem[];
    wordLimit: string;
    answer: Record<string, string>;
    explanation: string;
    audioTimeRange: { start: string; end: string };
    media: any;
    uiHints: any;
    validation: any;
  };
  answerKey: Record<string, string>;
  scoring: any;
}

export default function SentenceCompletionBuilder() {
  const [questionText, setQuestionText] = useState<string>('Complete the sentences below. Write');
  const [instructions, setInstructions] = useState<string>('NO MORE THAN TWO WORDS');
  const [wordLimit, setWordLimit] = useState<string>('NO MORE THAN TWO WORDS');
  const [sentences, setSentences] = useState<SentenceItem[]>([]);
  const [explanation, setExplanation] = useState<string>('');
  const [audioTimeRange, setAudioTimeRange] = useState({ start: '00:00', end: '00:00' });
  const [difficulty, setDifficulty] = useState<string>('medium');
  const [section, setSection] = useState<number>(4);
  const [showSentenceNumbers, setShowSentenceNumbers] = useState<boolean>(true);

  const addSentence = () => {
    const newSentence: SentenceItem = {
      id: Date.now(),
      text: '',
      blankPosition: 'end',
      answer: '',
      fullSentence: '',
      audioTimeRange: { start: '00:00', end: '00:00' },
    };
    setSentences([...sentences, newSentence]);
  };

  const updateSentence = (id: number, updates: Partial<SentenceItem>) => {
    setSentences(sentences.map(s => {
      const updated = s.id === id ? { ...s, ...updates } : s;
      if (updates.text !== undefined || updates.blankPosition !== undefined || updates.answer !== undefined) {
        updated.fullSentence = buildFullSentence(updated);
      }
      return updated;
    }));
  };

  const buildFullSentence = (s: SentenceItem): string => {
    const blank = '[______]';
    switch (s.blankPosition) {
      case 'start':
        return `${s.answer || blank} ${s.text}`;
      case 'middle':
        return s.text.replace('[______]', s.answer || blank);
      case 'end':
      default:
        return `${s.text} ${s.answer || blank}`;
    }
  };

  const removeSentence = (id: number) => {
    setSentences(sentences.filter(s => s.id !== id));
  };

  const generateJSON = (): string => {
    const answerKey: Record<string, string> = {};
    sentences.forEach((s, idx) => {
      answerKey[String(idx + 31)] = s.answer;
    });

    const data: SentenceCompletionBuilderData = {
      meta: {
        questionType: 'sentence_completion',
        variant: 'standard',
        section,
        questionNumber: 31,
        difficulty,
        version: '1.0',
        createdAt: new Date().toISOString(),
      },
      content: {
        questionText,
        instructions,
        sentences: sentences.map((s, idx) => ({
          ...s,
          id: idx + 31,
        })),
        wordLimit,
        answer: answerKey,
        explanation,
        audioTimeRange,
        media: {
          image: null,
          audio: '/audio/section4.mp3',
        },
        uiHints: {
          displayType: 'sentences',
          showSentenceNumbers,
          inlineInputs: true,
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
    <div className="space-y-6 p-6">
      <FormSection title="Question">
        <FormField
          label="Question Text"
          value={questionText}
          onChange={setQuestionText}
          placeholder="Complete the sentences below. Write"
        />
        <FormField
          label="Instructions"
          value={instructions}
          onChange={setInstructions}
          placeholder="NO MORE THAN TWO WORDS"
        />
        <FormField
          label="Word Limit"
          value={wordLimit}
          onChange={setWordLimit}
          placeholder="NO MORE THAN TWO WORDS"
        />
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
              checked={showSentenceNumbers}
              onChange={(e) => setShowSentenceNumbers(e.target.checked)}
            />
            <span>Show Numbers</span>
          </label>
        </div>
        <AudioTimeRange value={audioTimeRange} onChange={setAudioTimeRange} />
      </FormSection>

      <FormSection title="Sentences">
        <button
          onClick={addSentence}
          className="mb-4 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
        >
          + Add Sentence
        </button>
        <div className="space-y-4">
          {sentences.map((sentence, index) => (
            <div key={sentence.id} className="p-4 border rounded">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Sentence {index + 31}</span>
                <button
                  onClick={() => removeSentence(sentence.id)}
                  className="px-2 py-1 text-sm border border-red-500 text-red-500 rounded hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">Sentence Text</label>
                  <input
                    type="text"
                    value={sentence.text}
                    onChange={(e) => updateSentence(sentence.id, { text: e.target.value })}
                    placeholder="The main reason is..."
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <FormField
                  label="Answer"
                  value={sentence.answer}
                  onChange={(val) => updateSentence(sentence.id, { answer: val })}
                  placeholder="pesticides"
                />
              </div>
              <div className="mt-3">
                <label className="block text-sm mb-1">Blank Position</label>
                <select
                  value={sentence.blankPosition}
                  onChange={(e) => updateSentence(sentence.id, { blankPosition: e.target.value as 'start' | 'middle' | 'end' })}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="start">At Start</option>
                  <option value="middle">In Middle</option>
                  <option value="end">At End</option>
                </select>
              </div>
              <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                <strong>Preview:</strong> {sentence.fullSentence || 'Start typing to see preview...'}
              </div>
            </div>
          ))}
        </div>
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
