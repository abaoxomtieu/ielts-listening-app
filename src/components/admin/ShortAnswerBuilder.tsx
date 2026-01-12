'use client';

import React, { useState } from 'react';
import { FormSection, FormField, AudioTimeRange } from './FormBuilder';

interface ShortAnswerItem {
  id: number;
  text: string;
  answer: string;
  alternativeAnswers: string[];
  answerType: 'text' | 'number';
  audioTimeRange: { start: string; end: string };
}

interface ShortAnswerBuilderData {
  meta: any;
  content: {
    questionText: string;
    instructions: string;
    questions: ShortAnswerItem[];
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

export default function ShortAnswerBuilder() {
  const [questionText, setQuestionText] = useState<string>('Answer the questions below. Write');
  const [instructions, setInstructions] = useState<string>('NO MORE THAN TWO WORDS AND/OR A NUMBER');
  const [wordLimit, setWordLimit] = useState<string>('NO MORE THAN TWO WORDS AND/OR A NUMBER');
  const [questions, setQuestions] = useState<ShortAnswerItem[]>([]);
  const [explanation, setExplanation] = useState<string>('');
  const [audioTimeRange, setAudioTimeRange] = useState({ start: '00:00', end: '00:00' });
  const [difficulty, setDifficulty] = useState<string>('medium');
  const [section, setSection] = useState<number>(4);
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);

  const addQuestion = () => {
    const newQuestion: ShortAnswerItem = {
      id: Date.now(),
      text: '',
      answer: '',
      alternativeAnswers: [],
      answerType: 'text',
      audioTimeRange: { start: '00:00', end: '00:00' },
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: number, updates: Partial<ShortAnswerItem>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const addAlternative = (id: number) => {
    setQuestions(questions.map(q => {
      if (q.id === id) {
        return { ...q, alternativeAnswers: [...q.alternativeAnswers, ''] };
      }
      return q;
    }));
  };

  const updateAlternative = (id: number, index: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === id) {
        const newAlternatives = [...q.alternativeAnswers];
        newAlternatives[index] = value;
        return { ...q, alternativeAnswers: newAlternatives };
      }
      return q;
    }));
  };

  const removeAlternative = (id: number, index: number) => {
    setQuestions(questions.map(q => {
      if (q.id === id) {
        return { ...q, alternativeAnswers: q.alternativeAnswers.filter((_, i) => i !== index) };
      }
      return q;
    }));
  };

  const generateJSON = (): string => {
    const answerKey: Record<string, string> = {};
    questions.forEach((q, idx) => {
      answerKey[String(idx + 31)] = q.answer;
    });

    const data: ShortAnswerBuilderData = {
      meta: {
        questionType: 'short_answer',
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
        questions: questions.map((q, idx) => ({
          ...q,
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
          displayType: 'questions',
          showQuestionNumbers: true,
          inputType: 'text',
          caseSensitive,
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
          placeholder="Answer the questions below. Write"
        />
        <FormField
          label="Instructions"
          value={instructions}
          onChange={setInstructions}
          placeholder="NO MORE THAN TWO WORDS AND/OR A NUMBER"
        />
        <FormField
          label="Word Limit"
          value={wordLimit}
          onChange={setWordLimit}
          placeholder="NO MORE THAN TWO WORDS AND/OR A NUMBER"
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
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
            />
            <span>Case Sensitive</span>
          </label>
        </div>
        <AudioTimeRange value={audioTimeRange} onChange={setAudioTimeRange} />
      </FormSection>

      <FormSection title="Questions">
        <button
          onClick={addQuestion}
          className="mb-4 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
        >
          + Add Question
        </button>
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={question.id} className="p-4 border rounded">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Question {index + 31}</span>
                <button
                  onClick={() => removeQuestion(question.id)}
                  className="px-2 py-1 text-sm border border-red-500 text-red-500 rounded hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">Question Text</label>
                  <input
                    type="text"
                    value={question.text}
                    onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
                    placeholder="When was...?"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Correct Answer</label>
                  <input
                    type="text"
                    value={question.answer}
                    onChange={(e) => updateQuestion(question.id, { answer: e.target.value })}
                    placeholder="1832"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-sm mb-1">Answer Type</label>
                <select
                  value={question.answerType}
                  onChange={(e) => updateQuestion(question.id, { answerType: e.target.value as 'text' | 'number' })}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                </select>
              </div>
              <div className="mt-3">
                <label className="block text-sm mb-1">Alternative Answers</label>
                {question.alternativeAnswers.map((alt, altIndex) => (
                  <div key={altIndex} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={alt}
                      onChange={(e) => updateAlternative(question.id, altIndex, e.target.value)}
                      placeholder="Alternative answer"
                      className="flex-1 px-3 py-2 border rounded"
                    />
                    <button
                      onClick={() => removeAlternative(question.id, altIndex)}
                      className="px-2 py-1 text-sm border border-red-500 text-red-500 rounded hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addAlternative(question.id)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  + Add Alternative
                </button>
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
