'use client';

import React, { useState, useEffect } from 'react';
import { FormField, FormSection } from '../CompletionForm';
import { MatchingContent, MatchingQuestionData, MatchingOptionData, MatchingMatch } from '@/lib/dtos/matching';

interface Props {
    initialContent?: any;
    onContentChange: (content: any, answerKey: Record<string, string>) => void;
    questionNumber: number;
}

export default function MatchingBuilder({ initialContent, onContentChange, questionNumber }: Props) {
    const [questionText, setQuestionText] = useState(initialContent?.questionText || 'Questions 1-5: Match the following items.');
    const [instructions, setInstructions] = useState(initialContent?.instructions || 'Choose your answers from the box.');
    const [questions, setQuestions] = useState<MatchingQuestionData[]>(initialContent?.questions || [
        { id: 1, text: 'Question 1' }
    ]);
    const [options, setOptions] = useState<MatchingOptionData[]>(initialContent?.options || [
        { id: 'A', text: 'Option A' },
        { id: 'B', text: 'Option B' }
    ]);
    const [matches, setMatches] = useState<MatchingMatch[]>(initialContent?.answer?.matches || []);
    const [explanation, setExplanation] = useState(initialContent?.answer?.explanation || '');

    useEffect(() => {
        const answerKey: Record<string, string> = {};
        matches.forEach(m => {
            answerKey[m.questionId.toString()] = m.optionId;
        });

        const content: MatchingContent = {
            questionText,
            instructions,
            questions,
            options,
            answer: {
                matches,
                explanation
            },
            audioTimeRange: { start: '00:00', end: '00:00' },
            media: { image: null, audio: '' },
            uiHints: { displayType: 'matching' },
            validation: { wordLimit: null },
        };

        onContentChange(content, answerKey);
    }, [questionText, instructions, questions, options, matches, explanation, questionNumber]);

    const addQuestion = () => {
        const newId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;
        setQuestions([...questions, { id: newId, text: `New Question ${newId}` }]);
    };

    const removeQuestion = (id: number) => {
        setQuestions(questions.filter(q => q.id !== id));
        setMatches(matches.filter(m => m.questionId !== id));
    };

    const updateQuestion = (id: number, text: string) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, text } : q));
    };

    const addOption = () => {
        const nextLetter = String.fromCharCode(65 + options.length); // A, B, C...
        setOptions([...options, { id: nextLetter, text: `New Option ${nextLetter}` }]);
    };

    const removeOption = (id: string) => {
        setOptions(options.filter(o => o.id !== id));
        setMatches(matches.filter(m => m.optionId !== id));
    };

    const updateOption = (id: string, text: string) => {
        setOptions(options.map(o => o.id === id ? { ...o, text } : o));
    };

    const setMatch = (questionId: number, optionId: string) => {
        const filtered = matches.filter(m => m.questionId !== questionId);
        if (optionId) {
            setMatches([...filtered, { questionId, optionId }]);
        } else {
            setMatches(filtered);
        }
    };

    return (
        <div className="space-y-6">
            <FormSection title="Matching Settings (Common)" collapsible defaultCollapsed={true}>
                <FormField label="Question Text" value={questionText} onChange={setQuestionText} />
                <FormField label="Instructions" value={instructions} onChange={setInstructions} />
            </FormSection>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormSection title="Questions & Matches">
                    <div className="space-y-4">
                        {questions.map((q) => {
                            const currentMatch = matches.find(m => m.questionId === q.id)?.optionId || '';
                            return (
                                <div key={q.id} className="p-4 border rounded bg-gray-50 text-black mb-4 relative">
                                    <button onClick={() => removeQuestion(q.id)} className="absolute top-2 right-2 text-red-500 text-sm">Remove</button>
                                    <div className="font-bold mb-2">Item {q.id}</div>
                                    <FormField label="Question / Item text" value={q.text} onChange={(v) => updateQuestion(q.id, v)} placeholder="Question/Item text..." />
                                    <div className="flex items-center gap-3 mt-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Correct Match:</label>
                                        <select
                                            className="flex-1 border p-2 rounded text-black text-sm"
                                            value={currentMatch}
                                            onChange={(e) => setMatch(q.id, e.target.value)}
                                        >
                                            <option value="">-- Select --</option>
                                            {options.map(opt => (
                                                <option key={opt.id} value={opt.id}>{opt.id}: {opt.text}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            );
                        })}
                        <button onClick={addQuestion} className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                            + Add Question
                        </button>
                    </div>
                </FormSection>

                <FormSection title="Options (The Box)">
                    <div className="space-y-4">
                        {options.map((opt) => (
                            <div key={opt.id} className="flex gap-2 items-start p-3 border rounded bg-gray-50 border-gray-200">
                                <div className="font-bold text-blue-600 mt-2">{opt.id}</div>
                                <div className="flex-1">
                                    <input
                                        className="w-full border p-2 rounded text-black"
                                        value={opt.text}
                                        onChange={(e) => updateOption(opt.id, e.target.value)}
                                        placeholder="Option text..."
                                    />
                                </div>
                                <button onClick={() => removeOption(opt.id)} className="p-2 text-red-500 hover:bg-red-50 rounded mt-1">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        ))}
                        <button onClick={addOption} className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                            + Add Option
                        </button>
                    </div>
                </FormSection>
            </div>

            <FormSection title="Explanation">
                <textarea
                    className="w-full border p-3 rounded text-black min-h-[100px]"
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder="Provide an explanation for the correct matches..."
                />
            </FormSection>
        </div>
    );
}
