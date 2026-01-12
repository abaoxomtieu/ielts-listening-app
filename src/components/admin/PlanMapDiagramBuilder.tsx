'use client';

import React, { useState } from 'react';
import { FormSection, FormField, AudioTimeRange } from './FormBuilder';

interface Hotspot {
  id: number;
  x: number;
  y: number;
  label: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  marker?: string;
  connector?: string;
}

interface LabelItem {
  id: string;
  text: string;
}

interface PlanMapDiagramBuilderData {
  meta: any;
  content: {
    questionText: string;
    image: {
      url: string;
      altText: string;
      width: number;
      height: number;
      hotspots: Hotspot[];
    };
    questions: { id: number; text: string }[];
    answer: Record<string, string>;
    answerLabels: Record<string, string>;
    explanation: string;
    instructions: string;
    wordLimit: string | null;
    audioTimeRange: { start: string; end: string };
    media: any;
    uiHints: any;
    validation: any;
    directionsVocabulary?: {
      startingPoint: string;
      keyPhrases: string[];
    };
    processFlow?: { step: number; description: string }[];
  };
  answerKey: Record<string, string>;
  scoring: any;
}

export default function PlanMapDiagramBuilder() {
  const [variant, setVariant] = useState<'plan_labelling' | 'map_labelling' | 'diagram_labelling'>('plan_labelling');
  const [questionText, setQuestionText] = useState<string>('');
  const [instructions, setInstructions] = useState<string>('Choose the correct letters A-E from the box.');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [altText, setAltText] = useState<string>('');
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [labels, setLabels] = useState<LabelItem[]>([
    { id: 'A', text: '' },
    { id: 'B', text: '' },
    { id: 'C', text: '' },
    { id: 'D', text: '' },
    { id: 'E', text: '' },
  ]);
  const [answerMapping, setAnswerMapping] = useState<Record<number, string>>({});
  const [explanation, setExplanation] = useState<string>('');
  const [audioTimeRange, setAudioTimeRange] = useState({ start: '00:00', end: '00:00' });
  const [difficulty, setDifficulty] = useState<string>('medium');
  const [section, setSection] = useState<number>(2);
  const [startingPoint, setStartingPoint] = useState<string>('');
  const [keyPhrases, setKeyPhrases] = useState<string[]>([]);
  const [processFlow, setProcessFlow] = useState<{ step: number; description: string }[]>([]);

  const addHotspot = () => {
    const newId = hotspots.length > 0 ? Math.max(...hotspots.map(h => h.id)) + 1 : 11;
    const newHotspot: Hotspot = {
      id: newId,
      x: 100,
      y: 100,
      label: String(newId),
      position: 'right',
      marker: variant === 'map_labelling' ? 'pin' : undefined,
      connector: variant === 'diagram_labelling' ? 'arrow' : undefined,
    };
    setHotspots([...hotspots, newHotspot]);
  };

  const updateHotspot = (id: number, updates: Partial<Hotspot>) => {
    setHotspots(hotspots.map(h => h.id === id ? { ...h, ...updates } : h));
  };

  const removeHotspot = (id: number) => {
    setHotspots(hotspots.filter(h => h.id !== id));
    const newMapping = { ...answerMapping };
    delete newMapping[id];
    setAnswerMapping(newMapping);
  };

  const updateLabel = (id: string, text: string) => {
    setLabels(labels.map(l => l.id === id ? { ...l, text } : l));
  };

  const setAnswerForHotspot = (hotspotId: number, labelId: string) => {
    setAnswerMapping({ ...answerMapping, [hotspotId]: labelId });
  };

  const addKeyPhrase = () => {
    setKeyPhrases([...keyPhrases, '']);
  };

  const updateKeyPhrase = (index: number, value: string) => {
    const newPhrases = [...keyPhrases];
    newPhrases[index] = value;
    setKeyPhrases(newPhrases);
  };

  const removeKeyPhrase = (index: number) => {
    setKeyPhrases(keyPhrases.filter((_, i) => i !== index));
  };

  const addProcessStep = () => {
    setProcessFlow([...processFlow, { step: processFlow.length + 1, description: '' }]);
  };

  const updateProcessStep = (index: number, description: string) => {
    const newSteps = [...processFlow];
    newSteps[index] = { ...newSteps[index], description };
    setProcessFlow(newSteps);
  };

  const removeProcessStep = (index: number) => {
    setProcessFlow(processFlow.filter((_, i) => i !== index));
  };

  const generateJSON = (): string => {
    const answerKey: Record<string, string> = {};
    const answerLabels: Record<string, string> = {};

    hotspots.forEach(h => {
      const labelId = answerMapping[h.id];
      if (labelId) {
        answerKey[String(h.id)] = labelId;
        answerLabels[String(h.id)] = labelId;
      }
    });

    const data: PlanMapDiagramBuilderData = {
      meta: {
        questionType: 'plan_map_diagram',
        variant,
        section,
        questionNumber: hotspots.length > 0 ? hotspots[0].id : 11,
        difficulty,
        version: '1.0',
        createdAt: new Date().toISOString(),
      },
      content: {
        questionText,
        image: {
          url: imageUrl || '/images/placeholder.png',
          altText,
          width,
          height,
          hotspots: hotspots.map((h, idx) => ({ ...h, label: String(h.id) })),
        },
        questions: hotspots.map(h => ({ id: h.id, text: `Location ${h.id}` })),
        answer: answerKey,
        answerLabels,
        explanation,
        instructions,
        wordLimit: null,
        audioTimeRange,
        media: {
          image: imageUrl || '/images/placeholder.png',
          audio: '/audio/section2.mp3',
        },
        uiHints: {
          displayType: variant === 'plan_labelling' ? 'imageWithLabels' :
                     variant === 'map_labelling' ? 'mapWithMarkers' : 'diagramWithLabels',
          showNumberedLabels: true,
          alphabeticalOptions: labels.map(l => l.id),
          dragAndDrop: true,
          zoomEnabled: variant === 'map_labelling',
          showProcessFlow: variant === 'diagram_labelling',
        },
        validation: {
          minQuestions: 3,
          maxQuestions: 6,
          required: true,
        },
        ...(variant === 'map_labelling' && startingPoint && {
          directionsVocabulary: {
            startingPoint,
            keyPhrases: keyPhrases.filter(p => p.trim()),
          },
        }),
        ...(variant === 'diagram_labelling' && processFlow.length > 0 && {
          processFlow: processFlow.filter(p => p.description.trim()),
        }),
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
          placeholder="Label the rooms in the floor plan below."
        />
        <FormField
          label="Instructions"
          value={instructions}
          onChange={setInstructions}
          placeholder="Choose the correct letters A-E from the box."
        />
      </FormSection>

      <FormSection title="Type">
        <div className="grid grid-cols-3 gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="variant"
              checked={variant === 'plan_labelling'}
              onChange={() => setVariant('plan_labelling')}
            />
            <span>Plan Labelling</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="variant"
              checked={variant === 'map_labelling'}
              onChange={() => setVariant('map_labelling')}
            />
            <span>Map Labelling</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="variant"
              checked={variant === 'diagram_labelling'}
              onChange={() => setVariant('diagram_labelling')}
            />
            <span>Diagram Labelling</span>
          </label>
        </div>
      </FormSection>

      <FormSection title="Image">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Image URL"
            value={imageUrl}
            onChange={setImageUrl}
            placeholder="/images/section2-library-plan.png"
          />
          <FormField
            label="Alt Text"
            value={altText}
            onChange={setAltText}
            placeholder="Floor plan with unlabeled rooms"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <FormField
            label="Width"
            type="number"
            value={width}
            onChange={(v) => setWidth(Number(v))}
          />
          <FormField
            label="Height"
            type="number"
            value={height}
            onChange={(v) => setHeight(Number(v))}
          />
        </div>
      </FormSection>

      <FormSection title="Hotspots">
        <button
          onClick={addHotspot}
          className="mb-4 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
        >
          + Add Hotspot
        </button>
        <div className="space-y-4">
          {hotspots.map((hotspot, index) => (
            <div key={hotspot.id} className="p-4 border rounded">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Hotspot {hotspot.id}</span>
                <button
                  onClick={() => removeHotspot(hotspot.id)}
                  className="px-2 py-1 text-sm border border-red-500 text-red-500 rounded hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <FormField
                  label="X Position"
                  type="number"
                  value={hotspot.x}
                  onChange={(v) => updateHotspot(hotspot.id, { x: Number(v) })}
                />
                <FormField
                  label="Y Position"
                  type="number"
                  value={hotspot.y}
                  onChange={(v) => updateHotspot(hotspot.id, { y: Number(v) })}
                />
                <div>
                  <label className="block text-sm mb-1">Position</label>
                  <select
                    value={hotspot.position}
                    onChange={(e) => updateHotspot(hotspot.id, { position: e.target.value as 'top' | 'bottom' | 'left' | 'right' })}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Answer Label</label>
                  <select
                    value={answerMapping[hotspot.id] || ''}
                    onChange={(e) => setAnswerForHotspot(hotspot.id, e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="">-- Select --</option>
                    {labels.map(l => (
                      <option key={l.id} value={l.id}>{l.id}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </FormSection>

      <FormSection title="Labels (Options)">
        <div className="space-y-3">
          {labels.map(label => (
            <div key={label.id} className="flex items-center gap-3">
              <span className="w-8 font-bold">{label.id}</span>
              <input
                type="text"
                value={label.text}
                onChange={(e) => updateLabel(label.id, e.target.value)}
                placeholder={`Label ${label.id}`}
                className="flex-1 px-3 py-2 border rounded"
              />
            </div>
          ))}
        </div>
      </FormSection>

      {variant === 'map_labelling' && (
        <FormSection title="Directions Vocabulary">
          <FormField
            label="Starting Point"
            value={startingPoint}
            onChange={setStartingPoint}
            placeholder="You are at the Tourist Information Centre..."
          />
          <div className="mt-4">
            <label className="block text-sm mb-2">Key Phrases</label>
            {keyPhrases.map((phrase, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={phrase}
                  onChange={(e) => updateKeyPhrase(index, e.target.value)}
                  placeholder="e.g., opposite, turn left"
                  className="flex-1 px-3 py-2 border rounded"
                />
                <button
                  onClick={() => removeKeyPhrase(index)}
                  className="px-2 py-1 text-sm border border-red-500 text-red-500 rounded hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={addKeyPhrase}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
            >
              + Add Phrase
            </button>
          </div>
        </FormSection>
      )}

      {variant === 'diagram_labelling' && (
        <FormSection title="Process Flow">
          <button
            onClick={addProcessStep}
            className="mb-4 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            + Add Process Step
          </button>
          <div className="space-y-3">
            {processFlow.map((step, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="w-8 font-medium">{step.step}.</span>
                <input
                  type="text"
                  value={step.description}
                  onChange={(e) => updateProcessStep(index, e.target.value)}
                  placeholder="Describe this step..."
                  className="flex-1 px-3 py-2 border rounded"
                />
                <button
                  onClick={() => removeProcessStep(index)}
                  className="px-2 py-1 text-sm border border-red-500 text-red-500 rounded hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </FormSection>
      )}

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
        </div>
        <AudioTimeRange value={audioTimeRange} onChange={setAudioTimeRange} />
      </FormSection>

      <FormSection title="Explanation">
        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Explain the correct labels..."
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
