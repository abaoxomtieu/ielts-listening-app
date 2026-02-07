'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FormSection, FormField } from '../../CompletionForm';
import ImageWithHotspotsEditor from './ImageWithHotspotsEditor';
import type { QuestionImage, ImageHotspot, PlanQuestion, PlanMapDiagramContent } from '@/types';

type Variant = 'plan_labelling' | 'map_labelling' | 'diagram_labelling';

interface Props {
  variant: Variant;
  initialContent?: any;
  onContentChange: (content: any, answerKey: any) => void;
  questionNumber: number;
}

const defaultImage = (): QuestionImage => ({
  url: '',
  altText: '',
  width: undefined,
  height: undefined,
  hotspots: []
});

function getNextId(hotspots: ImageHotspot[], start: number): number {
  const ids = new Set(hotspots.map((h) => h.id));
  for (let i = start; i < start + 100; i++) if (!ids.has(i)) return i;
  return start + hotspots.length;
}

export default function PlanMapDiagramBuilder({ variant, initialContent, onContentChange, questionNumber }: Props) {
  const [questionText, setQuestionText] = useState(initialContent?.questionText || '');
  const [instructions, setInstructions] = useState(initialContent?.instructions || 'Choose the correct letter from the box.');
  const [image, setImage] = useState<QuestionImage>(() => ({
    ...defaultImage(),
    ...initialContent?.image,
    hotspots: initialContent?.image?.hotspots ?? []
  }));
  const [questions, setQuestions] = useState<PlanQuestion[]>(initialContent?.questions || []);
  const [alphabeticalOptions, setAlphabeticalOptions] = useState<string[]>(
    initialContent?.uiHints?.alphabeticalOptions || ['A', 'B', 'C', 'D', 'E']
  );
  const [answerInput, setAnswerInput] = useState<'onMap' | 'belowList'>(
    initialContent?.uiHints?.answerInput ?? (variant === 'map_labelling' ? 'belowList' : 'onMap')
  );
  const [answerLabels, setAnswerLabels] = useState<Record<string, string>>(initialContent?.answerLabels || {});
  const [explanation, setExplanation] = useState(initialContent?.explanation || '');
  const [directionsVocabulary, setDirectionsVocabulary] = useState(initialContent?.directionsVocabulary || {
    startingPoint: '',
    keyPhrases: [] as string[]
  });
  const [processFlow, setProcessFlow] = useState<{ step: number; description: string }[]>(
    initialContent?.processFlow || []
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadImageDimensions = (url: string): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = url;
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploadError('');
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/admin/upload-image', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      const url = data.url as string;
      const { width, height } = await loadImageDimensions(url);
      setImage((prev) => ({
        ...prev,
        url,
        altText: prev.altText || file.name,
        width,
        height,
        hotspots: prev.hotspots?.length ? prev.hotspots : []
      }));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleHotspotsChange = (hotspots: ImageHotspot[]) => {
    setImage((prev) => ({ ...prev, hotspots }));
    const existingIds = new Set(questions.map((q) => q.id));
    const newIds = hotspots.filter((h) => !existingIds.has(h.id));
    if (newIds.length) {
      setQuestions((prev) => [
        ...prev,
        ...newIds.map((h) => ({ id: h.id, text: `Label ${h.id}` }))
      ]);
    }
  };

  const addLabel = () => {
    const list = image.hotspots ?? [];
    const nextId = getNextId(list, questionNumber);
    const w = image.width ?? 400;
    const h = image.height ?? 300;
    const newHotspot: ImageHotspot = {
      id: nextId,
      x: Math.round(w / 2),
      y: Math.round(h / 2),
      label: String(nextId),
      position: 'top'
    };
    if (variant === 'map_labelling') newHotspot.marker = 'pin';
    if (variant === 'diagram_labelling') newHotspot.connector = 'arrow';
    handleHotspotsChange([...list, newHotspot]);
  };

  const removeHotspot = (id: number) => {
    const list = (image.hotspots ?? []).filter((h) => h.id !== id);
    setImage((prev) => ({ ...prev, hotspots: list }));
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    setAnswerLabels((prev) => {
      const next = { ...prev };
      delete next[String(id)];
      return next;
    });
  };

  const updateQuestion = (idx: number, text: string) => {
    const next = [...questions];
    next[idx] = { ...next[idx], text };
    setQuestions(next);
  };

  const removeQuestion = (idx: number) => {
    const q = questions[idx];
    if (q) removeHotspot(q.id);
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const [newOptionInput, setNewOptionInput] = useState('');

  const addOption = (value: string) => {
    const v = value.trim();
    if (!v || alphabeticalOptions.includes(v)) return;
    setAlphabeticalOptions((prev) => [...prev, v]);
    setNewOptionInput('');
  };

  const removeOption = (index: number) => {
    setAlphabeticalOptions((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const content: PlanMapDiagramContent = {
      questionText,
      instructions,
      image,
      questions,
      answerLabels,
      explanation,
      wordLimit: null,
      audioTimeRange: initialContent?.audioTimeRange || { start: '00:00', end: '00:00' },
      media: { image: image.url || null, audio: '/audio/section2.mp3' },
      uiHints: {
        displayType: 'imageWithLabels',
        showNumberedLabels: true,
        alphabeticalOptions,
        dragAndDrop: true,
        answerInput
      },
      validation: { minQuestions: 1, maxQuestions: 10, required: true }
    };
    if (variant === 'map_labelling' && (directionsVocabulary.startingPoint || directionsVocabulary.keyPhrases.length)) {
      content.directionsVocabulary = directionsVocabulary;
    }
    if (variant === 'diagram_labelling' && processFlow.length) {
      content.processFlow = processFlow;
    }
    const answerKey: Record<string, string> = {};
    questions.forEach((q) => {
      const label = answerLabels[String(q.id)];
      if (label) answerKey[String(q.id)] = label;
    });
    onContentChange(content, answerKey);
  }, [
    questionText, instructions, image, questions, answerLabels, explanation,
    alphabeticalOptions, answerInput, directionsVocabulary, processFlow, variant, questionNumber, initialContent?.audioTimeRange
  ]);

  const hasImage = Boolean(image.url && image.width && image.height);

  return (
    <div className="space-y-6">
      <FormSection title="Plan / Map / Diagram">
        <FormField label="Question text" value={questionText} onChange={setQuestionText} placeholder="e.g. Label the plan below." />
        <FormField label="Instructions" value={instructions} onChange={setInstructions} placeholder="e.g. Choose the correct letter." />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image (required)</label>
          {!hasImage && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {uploading ? 'Uploading…' : 'Upload image'}
              </button>
              {uploadError && <p className="mt-2 text-sm text-red-600">{uploadError}</p>}
            </div>
          )}
          {hasImage && (
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{image.url}</span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Replace
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              <FormField
                label="Alt text"
                value={image.altText}
                onChange={(v) => setImage((p) => ({ ...p, altText: v }))}
              />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-700">Labels on image</span>
                  <button
                    type="button"
                    onClick={addLabel}
                    className="text-sm px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    + Add label
                  </button>
                </div>
                <ImageWithHotspotsEditor image={image} onHotspotsChange={handleHotspotsChange} />
              </div>
              </div>

              <div className="md:w-72 shrink-0 space-y-4 flex flex-col">
                {(image.hotspots?.length ?? 0) > 0 && (
                  <div className="border rounded p-3 bg-gray-50">
                    <p className="text-xs font-medium text-gray-600 mb-2">Hotspots</p>
                    <p className="text-xs text-gray-500 mb-2">Kéo trên hình để đổi vị trí, double-click để sửa label.</p>
                    <ul className="space-y-1 text-sm">
                      {(image.hotspots ?? []).map((h) => (
                        <li key={h.id} className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono w-6">{h.id}</span>
                          <span className="text-gray-700 font-medium">"{h.label}"</span>
                          <span className="text-gray-500">x: {h.x}, y: {h.y}</span>
                          <button
                            type="button"
                            onClick={() => removeHotspot(h.id)}
                            className="text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Options (list)</label>
                  <div className="flex flex-wrap items-center gap-2 p-2 border rounded bg-gray-50 min-h-[42px]">
                    {alphabeticalOptions.map((opt, idx) => (
                      <span
                        key={`${opt}-${idx}`}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-100 text-blue-800 text-sm font-medium"
                      >
                        {opt}
                        <button
                          type="button"
                          onClick={() => removeOption(idx)}
                          className="hover:bg-blue-200 rounded p-0.5"
                          aria-label={`Xóa ${opt}`}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={newOptionInput}
                      onChange={(e) => setNewOptionInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addOption(newOptionInput);
                        }
                      }}
                      placeholder="Thêm (Enter)"
                      className="flex-1 min-w-[80px] border-0 bg-transparent px-1 py-0.5 text-sm outline-none focus:ring-0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Answer input</label>
                  <select
                    value={answerInput}
                    onChange={(e) => setAnswerInput(e.target.value as 'onMap' | 'belowList')}
                    className="w-full border rounded px-3 py-2 text-sm text-black bg-white"
                  >
                    <option value="onMap">On map – chọn đáp án theo vị trí</option>
                    <option value="belowList">Below list – chọn node theo câu</option>
                  </select>
                </div>
                {answerInput === 'onMap' && (
                  <div className="border rounded p-3 bg-gray-50">
                    <p className="text-sm font-medium text-gray-700 mb-2">Đáp án đúng theo vị trí (trên hình)</p>
                    {(image.hotspots ?? []).length === 0 ? (
                      <p className="text-xs text-gray-500">Thêm label trên hình trước.</p>
                    ) : (
                      <ul className="space-y-2">
                        {(image.hotspots ?? []).map((h) => (
                          <li key={h.id} className="flex items-center gap-2">
                            <span className="font-mono text-sm w-6">{h.id}</span>
                            <span className="text-gray-600 text-sm">"{h.label}"</span>
                            <span className="text-gray-400">→</span>
                            <select
                              value={answerLabels[String(h.id)] ?? ''}
                              onChange={(e) => setAnswerLabels((prev) => ({ ...prev, [String(h.id)]: e.target.value }))}
                              className="border rounded px-2 py-1 text-sm bg-white text-black min-w-[48px]"
                            >
                              <option value="">—</option>
                              {alphabeticalOptions.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Questions (match hotspot ids)</label>
          {questions.map((q, idx) => (
            <div key={q.id} className="flex gap-2 items-center mb-2 flex-wrap">
              <span className="w-8 font-mono text-sm shrink-0">{q.id}</span>
              <input
                type="text"
                value={q.text}
                onChange={(e) => updateQuestion(idx, e.target.value)}
                className="flex-1 min-w-[120px] border rounded px-2 py-1 text-sm"
                placeholder="Question text"
              />
              {answerInput === 'belowList' && (
                <select
                  value={answerLabels[String(q.id)] ?? ''}
                  onChange={(e) => setAnswerLabels((prev) => ({ ...prev, [String(q.id)]: e.target.value }))}
                  className="border rounded px-2 py-1 text-sm bg-white text-black shrink-0"
                  title="Chọn node trên hình tương ứng"
                >
                  <option value="">— Chọn node —</option>
                  {alphabeticalOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              )}
              <button type="button" onClick={() => removeQuestion(idx)} className="text-red-600 text-sm hover:underline shrink-0">
                Remove
              </button>
            </div>
          ))}
        </div>

        <FormField label="Explanation" value={explanation} onChange={setExplanation} />

        {variant === 'map_labelling' && (
          <div className="border rounded p-3 space-y-2">
            <p className="text-sm font-medium text-gray-700">Directions vocabulary (optional)</p>
            <FormField label="Starting point" value={directionsVocabulary.startingPoint} onChange={(v) => setDirectionsVocabulary((p: typeof directionsVocabulary) => ({ ...p, startingPoint: v }))} />
            <FormField label="Key phrases (comma)" value={directionsVocabulary.keyPhrases.join(', ')} onChange={(v) => setDirectionsVocabulary((p: typeof directionsVocabulary) => ({ ...p, keyPhrases: v.split(',').map((x) => x.trim()).filter(Boolean) }))} />
          </div>
        )}

        {variant === 'diagram_labelling' && (
          <div className="border rounded p-3 space-y-2">
            <p className="text-sm font-medium text-gray-700">Process flow (optional)</p>
            {processFlow.map((step, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <span className="w-8">{step.step}</span>
                <input type="text" value={step.description} onChange={(e) => setProcessFlow((p) => p.map((s, i) => i === idx ? { ...s, description: e.target.value } : s))} className="flex-1 border rounded px-2 py-1 text-sm" />
              </div>
            ))}
            <button type="button" onClick={() => setProcessFlow((p) => [...p, { step: p.length + 1, description: '' }])} className="text-sm text-blue-600 hover:underline">+ Add step</button>
          </div>
        )}
      </FormSection>
    </div>
  );
}
