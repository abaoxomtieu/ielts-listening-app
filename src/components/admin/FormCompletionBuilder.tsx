'use client';

import React, { useState } from 'react';
import { FormSection, FormField, AudioTimeRange } from './FormBuilder';

// ============================
// Types
// ============================

interface FieldItem {
  id: number;
  label: string;
  inputType: string;
  placeholder: string;
  required: boolean;
  answer: string;
  audioTimeRange: { start: string; end: string };
}

interface FormCompletionBuilderData {
  meta: {
    questionType: string;
    variant: string;
    section: number;
    questionNumber: number;
    difficulty: string;
    version: string;
    createdAt: string;
  };
  content: {
    questionText: string;
    instructions: string;
    formData: {
      formTitle: string;
      formType?: string;
      fields: FieldItem[];
    };
    wordLimit: string;
    answer: Record<string, string>;
    explanation: string;
    audioTimeRange: { start: string; end: string };
    media: any;
    uiHints: any;
    validation: any;
  };
  answerKey: Record<string, string>;
  scoring: {
    points: number;
  };
}

// ============================
// Component
// ============================

export default function FormCompletionBuilder() {
  const [questionText, setQuestionText] = useState<string>('');
  const [instructions, setInstructions] = useState<string>('');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formType, setFormType] = useState<string>('');
  const [wordLimit, setWordLimit] = useState<string>('NO MORE THAN TWO WORDS AND/OR A NUMBER');
  const [fields, setFields] = useState<FieldItem[]>([]);
  const [audioTimeRange, setAudioTimeRange] = useState({ start: '00:00', end: '00:00' });
  const [difficulty, setDifficulty] = useState<string>('easy');
  const [section, setSection] = useState<number>(1);

  const addField = () => {
    const newField: FieldItem = {
      id: Date.now(),
      label: '',
      inputType: 'text',
      placeholder: '_____________________',
      required: true,
      answer: '',
      audioTimeRange: { start: '00:00', end: '00:00' },
    };
    setFields([...fields, newField]);
  };

  const updateField = (id: number, updates: Partial<FieldItem>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const removeField = (id: number) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const generateJSON = () => {
    const data: FormCompletionBuilderData = {
      meta: {
        questionType: 'completion',
        variant: 'form_completion',
        section: section,
        questionNumber: 1,
        difficulty: difficulty,
        version: '1.0',
        createdAt: new Date().toISOString(),
      },
      content: {
        questionText,
        instructions,
        formData: {
          formTitle,
          formType,
          fields: fields.map((f, i) => ({
            ...f,
            id: i + 1,
          })),
        },
        wordLimit,
        answer: {},
        explanation: '',
        audioTimeRange,
        media: {
          image: null,
          audio: '/audio/section1.mp3',
        },
        uiHints: {
          displayType: 'form',
          showFieldNumbers: true,
          inlineValidation: false,
          showSectionHeadings: false,
        },
        validation: {
          minFields: 1,
          maxFields: 10,
        },
      },
      answerKey: {},
      scoring: {
        points: 1,
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
          placeholder="Complete the form below. Write"
        />
        <FormField
          label="Instructions"
          value={instructions}
          onChange={setInstructions}
          placeholder="NO MORE THAN TWO WORDS AND/OR A NUMBER"
        />
        <FormField
          label="Form Title"
          value={formTitle}
          onChange={setFormTitle}
          placeholder="CONFERENCE REGISTRATION"
        />
        <FormField
          label="Form Type (Optional)"
          value={formType}
          onChange={setFormType}
          type="text"
          placeholder="e.g., registration, feedback"
        />
        <FormField
          label="Word Limit"
          value={wordLimit}
          onChange={setWordLimit}
          placeholder="NO MORE THAN TWO WORDS"
        />
        <AudioTimeRange value={audioTimeRange} onChange={setAudioTimeRange} />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Section"
            type="number"
            value={section}
            onChange={(v) => setSection(Number(v))}
            placeholder="1"
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

      <FormSection title="Form Fields">
        <div className="mb-4">
          <button
            onClick={addField}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
          >
            + Add Field
          </button>
        </div>
        
        <div className="space-y-3">
          {fields.map((field) => (
            <div key={field.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Field Label"
                  value={field.label}
                  onChange={(val) => updateField(field.id, { label: val })}
                  placeholder="Full Name:"
                />
                <FormField
                  label="Input Type"
                  type="select"
                  value={field.inputType}
                  onChange={(val) => updateField(field.id, { inputType: val })}
                  options={[
                    { value: 'text', label: 'Text' },
                    { value: 'email', label: 'Email' },
                    { value: 'tel', label: 'Telephone' },
                    { value: 'number', label: 'Number' },
                    { value: 'date', label: 'Date' },
                    { value: 'select', label: 'Select Dropdown' },
                  ]}
                />
                <FormField
                  label="Placeholder"
                  value={field.placeholder}
                  onChange={(val) => updateField(field.id, { placeholder: val })}
                  placeholder="_____________________"
                />
                <FormField
                  label="Required"
                  type="select"
                  value={field.required ? 'true' : 'false'}
                  onChange={(val) => updateField(field.id, { required: val === 'true' })}
                  options={[
                    { value: 'true', label: 'Yes' },
                    { value: 'false', label: 'No' },
                  ]}
                />
                <FormField
                  label="Answer (Correct Answer)"
                  value={field.answer}
                  onChange={(val) => updateField(field.id, { answer: val })}
                  placeholder="Sarah Johnson"
                />
                <AudioTimeRange
                  value={field.audioTimeRange}
                  onChange={(val) => updateField(field.id, { audioTimeRange: val })}
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => removeField(field.id)}
                  className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors"
                >
                  Remove Field
                </button>
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
