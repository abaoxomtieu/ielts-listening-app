'use client';

import React, { useState } from 'react';
import { FormSection, FormField, AudioTimeRange } from './FormBuilder';

// ============================
// Types
// ============================

interface NoteItem {
  id: number;
  text: string;
  answer: string;
  audioTimeRange: { start: string; end: string };
}

interface NoteSection {
  heading: string;
  bulletPoints: NoteItem[];
}

interface NoteCompletionBuilderData {
  meta: any;
  content: {
    questionText: string;
    instructions: string;
    notes: {
      title: string;
      speaker?: string;
      date?: string;
      sections: NoteSection[];
    };
    wordLimit: string;
    answer: Record<string, string>;
    explanation: string;
    audioTimeRange: any;
    media: any;
    uiHints: any;
    validation: any;
  };
  answerKey: Record<string, string>;
  scoring: any;
}

// ============================
// Component
// ============================

export default function NoteCompletionBuilder() {
  const [questionText, setQuestionText] = useState<string>('');
  const [instructions, setInstructions] = useState<string>('');
  const [wordLimit, setWordLimit] = useState<string>('ONE WORD ONLY');
  const [notesTitle, setNotesTitle] = useState<string>('');
  const [speaker, setSpeaker] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [sections, setSections] = useState<NoteSection[]>([]);

  const addSection = () => {
    const newSection: NoteSection = {
      heading: '',
      bulletPoints: [],
    };
    setSections([...sections, newSection]);
  };

  const updateSection = (index: number, updates: Partial<NoteSection>) => {
    setSections(sections.map((s, i) => i === index ? { ...s, ...updates } : s));
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const addBulletPoint = (sectionIndex: number) => {
    const newBullet: NoteItem = {
      id: Date.now(),
      text: '',
      answer: '',
      audioTimeRange: { start: '00:00', end: '00:00' },
    };
    const newSections = [...sections];
    newSections[sectionIndex] = {
      ...newSections[sectionIndex],
      bulletPoints: [...newSections[sectionIndex].bulletPoints, newBullet],
    };
    setSections(newSections);
  };

  const updateBulletPoint = (sectionIndex: number, bulletIndex: number, updates: Partial<NoteItem>) => {
    setSections(sections.map((s, i) => {
      if (i !== sectionIndex) return s;
      return {
        ...s,
        bulletPoints: s.bulletPoints.map((b, bi) => 
          bi === bulletIndex ? { ...b, ...updates } : b
        ),
      };
    }));
  };

  const removeBulletPoint = (sectionIndex: number, bulletIndex: number) => {
    setSections(sections.map((s, i) => {
      if (i !== sectionIndex) return s;
      return {
        ...s,
        bulletPoints: s.bulletPoints.filter((_, bi) => bi !== bulletIndex),
      };
    }));
  };

  const generateJSON = () => {
    const data: NoteCompletionBuilderData = {
      meta: {
        questionType: 'completion',
        variant: 'note_completion',
        section: 4,
        questionNumber: 31,
        difficulty: 'medium',
        version: '1.0',
        createdAt: new Date().toISOString(),
      },
      content: {
        questionText,
        instructions,
        notes: {
          title: notesTitle,
          speaker,
          date,
          sections: sections.map((s, i) => ({
            ...s,
            bulletPoints: s.bulletPoints.map((b, bi) => ({
              ...b,
              id: bi + 1,
            })),
          })),
        },
        wordLimit,
        answer: {},
        explanation: '',
        audioTimeRange: { start: '02:00', end: '05:00' },
        media: {
          image: null,
          audio: '/audio/section4.mp3',
        },
        uiHints: {
          displayType: 'notes',
          showSectionHeadings: true,
          showBulletPoints: true,
        },
        validation: {
          minFields: 1,
          maxFields: 20,
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
          placeholder="Complete the notes below. Write"
        />
        <FormField
          label="Instructions"
          value={instructions}
          onChange={setInstructions}
          placeholder="ONE WORD ONLY"
        />
      </FormSection>

      <FormSection title="Notes Information">
        <FormField
          label="Notes Title"
          value={notesTitle}
          onChange={setNotesTitle}
          placeholder="LECTURE NOTES: SUSTAINABLE AGRICULTURE"
        />
        <FormField
          label="Speaker (Optional)"
          value={speaker}
          onChange={setSpeaker}
          placeholder="Dr. Maria Rodriguez"
        />
        <FormField
          label="Date (Optional)"
          value={date}
          onChange={setDate}
          placeholder="12 October 2024"
        />
        <FormField
          label="Word Limit"
          value={wordLimit}
          onChange={setWordLimit}
          placeholder="ONE WORD ONLY"
        />
      </FormSection>

      <FormSection title="Note Sections">
        <div className="mb-3">
          <button
            onClick={addSection}
            className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
          >
            + Add Note Section
          </button>
        </div>
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="mb-4 flex items-center justify-between">
              <FormField
                label="Section Heading"
                value={section.heading}
                onChange={(val) => updateSection(sectionIndex, { heading: val })}
                placeholder="Introduction"
              />
              <button
                onClick={() => removeSection(sectionIndex)}
                className="ml-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors"
              >
                Remove Section
              </button>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Bullet Points</label>
              <div className="space-y-2">
                {section.bulletPoints.map((bullet, bulletIndex) => (
                  <div key={bullet.id} className="p-3 bg-white rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <FormField
                        label="Text"
                        value={bullet.text}
                        onChange={(val) => updateBulletPoint(sectionIndex, bulletIndex, { text: val })}
                        placeholder="Traditional farming causes significant environmental [______]"
                      />
                      <FormField
                        label="Answer"
                        value={bullet.answer}
                        onChange={(val) => updateBulletPoint(sectionIndex, bulletIndex, { answer: val })}
                        placeholder="damage"
                      />
                      <AudioTimeRange
                        value={bullet.audioTimeRange}
                        onChange={(val) => updateBulletPoint(sectionIndex, bulletIndex, { audioTimeRange: val })}
                      />
                    </div>
                    <button
                      onClick={() => removeBulletPoint(sectionIndex, bulletIndex)}
                      className="mt-2 w-full px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors"
                    >
                      Remove Bullet Point
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                const newBullet = {
                  id: Date.now(),
                  text: '',
                  answer: '',
                  audioTimeRange: { start: '00:00', end: '00:00' },
                };
                addBulletPoint(sectionIndex);
              }}
              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
            >
              + Add Bullet Point
            </button>
          </div>
        ))}
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
