'use client';

import React, { useState, useEffect } from 'react';
import MultipleChoiceBuilder from '@/components/admin/builders/multiple-choice/MultipleChoiceBuilder';
import QuestionRenderer from '@/components/QuestionRenderer';
import { FormField } from '@/components/admin/CompletionForm';

type McVariant = 'single_answer' | 'multiple_answers';

const defaultContent = (variant: McVariant) => ({
  questionText: 'Choose the correct answer.',
  instructions: variant === 'multiple_answers' ? 'Choose TWO letters.' : 'Choose ONE letter.',
  options: [
    { id: 'A', text: 'Option A' },
    { id: 'B', text: 'Option B' },
    { id: 'C', text: 'Option C' },
  ],
  answer: variant === 'multiple_answers'
    ? { correctOptions: [] as string[], explanation: '' }
    : { correctOption: '', explanation: '' },
  wordLimit: null,
  audioTimeRange: { start: '00:00', end: '00:00' },
  media: { image: null, audio: '' },
  uiHints: {
    displayType: (variant === 'multiple_answers' ? 'checkbox' : 'radio') as 'checkbox' | 'radio',
    showLetterLabels: true,
    ...(variant === 'multiple_answers' ? { maxSelectable: 2, minSelectable: 1 } : {}),
  },
  validation: { wordLimit: null },
});

export default function MultipleChoiceAdminPage() {
  const [variant, setVariant] = useState<McVariant>('single_answer');
  const [section, setSection] = useState(1);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [content, setContent] = useState(() => defaultContent('single_answer'));
  const [answerKey, setAnswerKey] = useState<Record<string, string | string[]>>({});
  const [rightTab, setRightTab] = useState<'preview' | 'json'>('preview');
  const [jsonInput, setJsonInput] = useState('');

  useEffect(() => {
    setContent(defaultContent(variant));
    setAnswerKey({});
  }, [variant]);

  const mcData = {
    meta: {
      questionType: 'multiple_choice' as const,
      variant,
      section,
      questionNumber,
    },
    content,
    answerKey: variant === 'multiple_answers'
      ? (answerKey[String(questionNumber)] as string[] | undefined) ?? []
      : (answerKey[String(questionNumber)] as string | undefined) ?? '',
    scoring: { points: 1 },
  };

  const handleContentChange = (newContent: any, newAnswerKey: Record<string, string | string[]>) => {
    setContent(newContent);
    setAnswerKey(newAnswerKey);
  };

  const handleMetaChange = (field: string, value: string | number) => {
    if (field === 'variant') setVariant(value as McVariant);
    else if (field === 'section') setSection(Number(value) || 1);
    else if (field === 'questionNumber') setQuestionNumber(Number(value) || 1);
  };

  const loadJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setVariant(parsed.meta?.variant || 'single_answer');
      setSection(parsed.meta?.section ?? 1);
      setQuestionNumber(parsed.meta?.questionNumber ?? 1);
      setContent(parsed.content || defaultContent(parsed.meta?.variant || 'single_answer'));
      const qNum = String(parsed.meta?.questionNumber ?? 1);
      setAnswerKey({ [qNum]: parsed.answerKey ?? (parsed.meta?.variant === 'multiple_answers' ? [] : '') });
    } catch {
      alert('Invalid JSON');
    }
  };

  const downloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(mcData, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', `multiple_choice_q${questionNumber}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="w-full">
        <header className="flex justify-between items-center mb-8 border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 uppercase">Multiple Choice Builder</h1>
            <p className="text-gray-500">Create single-answer or multiple-answers multiple choice questions</p>
          </div>
          <button
            onClick={downloadJson}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg font-bold shadow-lg shadow-purple-200 hover:scale-105 active:scale-95 transition-all"
          >
            Export JSON
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          <div className="lg:col-span-6 space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Variant & Meta</h2>
              <div className="space-y-4">
                <FormField
                  label="Variant"
                  type="select"
                  value={variant}
                  onChange={(v) => handleMetaChange('variant', v)}
                  options={[
                    { value: 'single_answer', label: 'Single Answer' },
                    { value: 'multiple_answers', label: 'Multiple Answers' },
                  ]}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Section"
                    type="number"
                    value={String(section)}
                    onChange={(v) => handleMetaChange('section', v)}
                  />
                  <FormField
                    label="Question #"
                    type="number"
                    value={String(questionNumber)}
                    onChange={(v) => handleMetaChange('questionNumber', v)}
                  />
                </div>
              </div>
            </div>

            <MultipleChoiceBuilder
              key={variant}
              initialContent={content}
              onContentChange={handleContentChange}
              questionNumber={questionNumber}
              variant={variant}
            />

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Import</h2>
              <textarea
                className="w-full h-40 p-3 border rounded text-xs font-mono text-black mb-4 bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Paste multiple choice JSON here..."
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
              />
              <button
                onClick={loadJson}
                className="w-full py-2 bg-gray-800 text-white rounded font-bold hover:bg-black transition-colors"
              >
                Load from JSON
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setRightTab('preview')}
                className={`px-4 py-2 font-bold text-sm ${rightTab === 'preview' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Preview
              </button>
              <button
                onClick={() => setRightTab('json')}
                className={`px-4 py-2 font-bold text-sm ${rightTab === 'json' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                JSON
              </button>
            </div>

            {rightTab === 'preview' && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 overflow-auto max-h-[calc(100vh-12rem)]">
                <QuestionRenderer data={mcData as any} />
              </div>
            )}

            {rightTab === 'json' && (
              <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
                <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
                  <span className="text-gray-300 font-mono text-sm">multiple_choice_data.json</span>
                </div>
                <div className="p-4 overflow-auto max-h-[calc(100vh-12rem)]">
                  <pre className="text-green-400 font-mono text-xs leading-relaxed whitespace-pre">
                    {JSON.stringify(mcData, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
