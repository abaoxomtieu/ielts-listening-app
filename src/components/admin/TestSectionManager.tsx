import React, { useState } from 'react';
import { FormSection, FormField } from './CompletionForm';
import { IELTSListeningQuestion, TestSection } from '@/types';
import SentenceCompletionBuilder from './builders/SentenceCompletionBuilder';
import FormCompletionBuilder from './builders/FormCompletionBuilder';
import NoteCompletionBuilder from './builders/NoteCompletionBuilder';
import TableCompletionBuilder from './builders/TableCompletionBuilder';
import SummaryCompletionBuilder from './builders/SummaryCompletionBuilder';
import FlowchartCompletionBuilder from './builders/FlowchartCompletionBuilder';
import MatchingBuilder from './builders/MatchingBuilder';

interface Props {
    section: TestSection;
    onChange: (updatedSection: TestSection) => void;
    onRemove: () => void;
    onFocus?: () => void;
}

export default function TestSectionManager({ section, onChange, onRemove, onFocus }: Props) {
    const updateSection = (updates: Partial<TestSection>) => {
        onChange({ ...section, ...updates });
    };

    const addQuestion = (variant: string) => {
        const isMatching = ['people_opinions', 'events_info', 'locations_features'].includes(variant);
        const newQuestion: any = {
            meta: {
                questionType: isMatching ? 'matching' : 'completion',
                variant: variant,
                section: section.id,
                questionNumber: section.questions.length > 0
                    ? (section.questions[section.questions.length - 1] as any).meta.questionNumber + 5 // Dummy offset
                    : 1
            },
            content: {},
            answerKey: {},
            scoring: { points: 1 }
        };
        updateSection({ questions: [...section.questions, newQuestion] });
    };

    const updateQuestion = (idx: number, content: any, answerKey: any) => {
        const newQuestions = [...section.questions];
        newQuestions[idx] = {
            ...newQuestions[idx],
            content,
            answerKey
        };
        updateSection({ questions: newQuestions });
    };

    const removeQuestion = (idx: number) => {
        const newQuestions = section.questions.filter((_, i) => i !== idx);
        updateSection({ questions: newQuestions });
    };

    const renderQuestionBuilder = (q: IELTSListeningQuestion, idx: number) => {
        const variant = (q as any).meta.variant;
        const qNum = (q as any).meta.questionNumber;

        const props = {
            initialContent: q.content,
            onContentChange: (content: any, answerKey: any) => updateQuestion(idx, content, answerKey),
            questionNumber: qNum
        };

        switch (variant) {
            case 'sentence_completion': return <SentenceCompletionBuilder {...props} />;
            case 'form_completion': return <FormCompletionBuilder {...props} />;
            case 'note_completion': return <NoteCompletionBuilder {...props} />;
            case 'table_completion': return <TableCompletionBuilder {...props} />;
            case 'summary_completion': return <SummaryCompletionBuilder {...props} />;
            case 'flowchart_completion': return <FlowchartCompletionBuilder {...props} />;
            case 'people_opinions':
            case 'events_info':
            case 'locations_features':
                return <MatchingBuilder {...props} />;
            default: return <div>Unknown question type: {variant}</div>;
        }
    };

    return (
        <div
            onClick={() => onFocus?.()}
            onFocusCapture={() => onFocus?.()}
            className="border-2 border-blue-200 rounded-xl p-6 bg-blue-50/30 space-y-6"
        >
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-blue-900">Section {section.id}</h3>
                <button
                    onClick={onRemove}
                    className="text-red-600 hover:text-red-800 font-medium text-sm"
                >
                    Remove Section
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    label="Section Title"
                    value={section.title}
                    onChange={(v) => updateSection({ title: v })}
                    placeholder="e.g. Conversation between two people..."
                />
                <FormField
                    label="Description"
                    value={section.description}
                    onChange={(v) => updateSection({ description: v })}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    label="Audio Start (mm:ss)"
                    value={section.audioTime.start}
                    onChange={(v) => updateSection({ audioTime: { ...section.audioTime, start: v } })}
                />
                <FormField
                    label="Audio End (mm:ss)"
                    value={section.audioTime.end}
                    onChange={(v) => updateSection({ audioTime: { ...section.audioTime, end: v } })}
                />
            </div>

            <div className="space-y-8 mt-8">
                <div className="space-y-8">
                    <div className="flex items-center justify-between border-b pb-2">
                        <h4 className="font-bold text-gray-700">Questions in Section {section.id}</h4>
                        <div className="flex gap-2">
                            <select
                                className="text-sm border rounded px-2 py-1 bg-white text-black"
                                onChange={(e) => {
                                    if (e.target.value) addQuestion(e.target.value);
                                    e.target.value = '';
                                }}
                            >
                                <option value="">+ Add Question Type</option>
                                <option value="sentence_completion">Sentence Completion</option>
                                <option value="form_completion">Form Completion</option>
                                <option value="note_completion">Note Completion</option>
                                <option value="table_completion">Table Completion</option>
                                <option value="summary_completion">Summary Completion</option>
                                <option value="flowchart_completion">Flowchart Completion</option>
                                <option disabled className="bg-gray-200 font-bold">--- Matching ---</option>
                                <option value="people_opinions">Matching: People/Opinions</option>
                                <option value="events_info">Matching: Events/Info</option>
                                <option value="locations_features">Matching: Locations/Features</option>
                            </select>
                        </div>
                    </div>

                    {section.questions.map((q, idx) => (
                        <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gray-100 px-4 py-2 border-b flex justify-between items-center">
                                <span className="font-semibold text-gray-700">
                                    Question Block {idx + 1}: {(q as any).meta.variant.replace('_', ' ')}
                                </span>
                                <div className="flex gap-4 items-center">
                                    <div className="flex items-center gap-2">
                                        <label className="text-xs font-bold text-gray-500">Start Q#</label>
                                        <input
                                            type="number"
                                            value={(q as any).meta.questionNumber}
                                            onChange={(e) => {
                                                const newQuestions = [...section.questions];
                                                (newQuestions[idx] as any).meta.questionNumber = Number(e.target.value);
                                                updateSection({ questions: newQuestions });
                                            }}
                                            className="w-16 px-1 py-0.5 border rounded text-xs text-black"
                                        />
                                    </div>
                                    <button
                                        onClick={() => removeQuestion(idx)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                {renderQuestionBuilder(q, idx)}
                            </div>
                        </div>
                    ))}

                    {section.questions.length === 0 && (
                        <div className="text-center py-12 bg-gray-50 border-2 border-dashed rounded-lg text-gray-400">
                            No questions added to this section yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
