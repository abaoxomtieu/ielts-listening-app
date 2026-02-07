'use client';

import React, { useState } from 'react';
import PlanMapDiagramBuilder from '@/components/admin/builders/plan-map-diagram/PlanMapDiagramBuilder';
import QuestionRenderer from '@/components/QuestionRenderer';
import { FormField } from '@/components/admin/CompletionForm';

type Variant = 'plan_labelling' | 'map_labelling' | 'diagram_labelling';

const defaultContent = (variant: Variant) => ({
  questionText: variant === 'plan_labelling' ? 'Label the plan below.' : variant === 'map_labelling' ? 'Label the map below.' : 'Label the diagram below.',
  instructions: 'Choose the correct letter from the box.',
  image: { url: '', altText: '', width: undefined as number | undefined, height: undefined as number | undefined, hotspots: [] as any[] },
  questions: [] as { id: number; text: string }[],
  answerLabels: {} as Record<string, string>,
  explanation: '',
  wordLimit: null as null,
  audioTimeRange: { start: '00:00', end: '00:00' },
  media: { image: null as string | null, audio: '/audio/section2.mp3' },
  uiHints: { displayType: 'imageWithLabels' as const, showNumberedLabels: true, alphabeticalOptions: ['A', 'B', 'C', 'D', 'E'], dragAndDrop: true },
  validation: { minQuestions: 1, maxQuestions: 10, required: true }
});

export default function PlanMapDiagramAdminPage() {
  const [variant, setVariant] = useState<Variant>('plan_labelling');
  const [questionData, setQuestionData] = useState(() => ({
    meta: {
      questionType: 'plan_map_diagram' as const,
      variant: 'plan_labelling' as Variant,
      section: 2,
      questionNumber: 11
    },
    content: defaultContent('plan_labelling'),
    answerKey: {} as Record<string, string>,
    scoring: { points: 1 }
  }));

  const [rightTab, setRightTab] = useState<'preview' | 'json'>('preview');
  const [jsonInput, setJsonInput] = useState('');

  const handleContentChange = (content: any, answerKey: Record<string, string>) => {
    setQuestionData(prev => ({
      ...prev,
      content,
      answerKey
    }));
  };

  const handleVariantChange = (v: string) => {
    const newVariant = v as Variant;
    setVariant(newVariant);
    setQuestionData(prev => ({
      ...prev,
      meta: { ...prev.meta, variant: newVariant },
      content: prev.content?.image?.url ? prev.content : { ...prev.content, ...defaultContent(newVariant) }
    }));
  };

  const handleMetaChange = (field: string, value: any) => {
    setQuestionData(prev => ({
      ...prev,
      meta: { ...prev.meta, [field]: value }
    }));
  };

  const loadJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setQuestionData(parsed);
      if (parsed.meta?.variant) setVariant(parsed.meta.variant);
    } catch {
      alert('Invalid JSON');
    }
  };

  const downloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(questionData, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', `plan-map-diagram_${variant}_q${questionData.meta.questionNumber}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="w-full">
        <header className="flex justify-between items-center mb-8 border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 uppercase">Plan / Map / Diagram Builder</h1>
            <p className="text-gray-500">Create plan labelling, map labelling, or diagram labelling (image + drag labels)</p>
          </div>
          <button
            onClick={downloadJson}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold shadow-lg shadow-green-200 hover:scale-105 active:scale-95 transition-all"
          >
            Export JSON
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          <div className="lg:col-span-6 space-y-8">
            <PlanMapDiagramBuilder
              variant={variant}
              initialContent={questionData.content}
              onContentChange={handleContentChange}
              questionNumber={questionData.meta.questionNumber}
            />

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Meta</h2>
              <div className="space-y-4">
                <FormField
                  label="Variant"
                  type="select"
                  value={variant}
                  onChange={handleVariantChange}
                  options={[
                    { value: 'plan_labelling', label: 'Plan Labelling' },
                    { value: 'map_labelling', label: 'Map Labelling' },
                    { value: 'diagram_labelling', label: 'Diagram Labelling' }
                  ]}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Section"
                    type="number"
                    value={String(questionData.meta.section)}
                    onChange={(v) => handleMetaChange('section', parseInt(v, 10) || 1)}
                  />
                  <FormField
                    label="Question #"
                    type="number"
                    value={String(questionData.meta.questionNumber)}
                    onChange={(v) => handleMetaChange('questionNumber', parseInt(v, 10) || 1)}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Import</h2>
              <textarea
                className="w-full h-40 p-3 border rounded text-xs font-mono text-black mb-4 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Paste plan/map/diagram JSON here..."
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

          <div className="lg:col-span-4 flex flex-col min-h-[calc(100vh-12rem)]">
            <div className="flex border-b border-gray-200 shrink-0">
              <button
                type="button"
                onClick={() => setRightTab('preview')}
                className={`px-4 py-2 font-bold text-sm ${rightTab === 'preview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Preview
              </button>
              <button
                type="button"
                onClick={() => setRightTab('json')}
                className={`px-4 py-2 font-bold text-sm ${rightTab === 'json' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                JSON
              </button>
            </div>

            <div className="flex-1 min-h-0 flex flex-col mt-4">
              {rightTab === 'preview' && (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 overflow-auto flex-1 min-h-0">
                  <QuestionRenderer data={questionData as any} showAnswers />
                </div>
              )}

              {rightTab === 'json' && (
                <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 flex-1 min-h-0 flex flex-col">
                  <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 shrink-0">
                    <span className="text-gray-300 font-mono text-sm">plan-map-diagram.json</span>
                  </div>
                  <div className="p-4 overflow-auto flex-1 min-h-0">
                    <pre className="text-green-400 font-mono text-xs leading-relaxed whitespace-pre">
                      {JSON.stringify(questionData, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
