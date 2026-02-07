'use client';

import React, { useState, useEffect } from 'react';
import { FormSection, FormField } from '../../CompletionForm';

interface Option {
    id: string;
    text: string;
}

interface Props {
    initialContent?: any;
    onContentChange: (content: any, answerKey: Record<string, string | string[]>) => void;
    questionNumber: number;
    variant: 'single_answer' | 'multiple_answers';
}

export default function MultipleChoiceBuilder({ initialContent, onContentChange, questionNumber, variant }: Props) {
    const isMultiple = variant === 'multiple_answers';

    const [questionText, setQuestionText] = useState(initialContent?.questionText || 'Choose the correct answer.');
    const [instructions, setInstructions] = useState(initialContent?.instructions || '');
    const [options, setOptions] = useState<Option[]>(initialContent?.options?.length
        ? initialContent.options
        : [
            { id: 'A', text: 'Option A' },
            { id: 'B', text: 'Option B' },
            { id: 'C', text: 'Option C' },
        ]);
    const [correctOption, setCorrectOption] = useState(initialContent?.answer?.correctOption || '');
    const [correctOptions, setCorrectOptions] = useState<string[]>(initialContent?.answer?.correctOptions || []);
    const [explanation, setExplanation] = useState(initialContent?.answer?.explanation || '');
    const [showLetterLabels, setShowLetterLabels] = useState(initialContent?.uiHints?.showLetterLabels ?? true);
    const [maxSelectable, setMaxSelectable] = useState(initialContent?.uiHints?.maxSelectable ?? 2);
    const [minSelectable, setMinSelectable] = useState(initialContent?.uiHints?.minSelectable ?? 1);

    useEffect(() => {
        const answer = isMultiple
            ? { correctOptions, explanation }
            : { correctOption, explanation };

        const content = {
            questionText,
            instructions: instructions || undefined,
            options,
            answer,
            wordLimit: null,
            audioTimeRange: { start: '00:00', end: '00:00' },
            media: { image: null, audio: '' },
            uiHints: {
                displayType: isMultiple ? 'checkbox' as const : 'radio' as const,
                showLetterLabels,
                ...(isMultiple ? { maxSelectable, minSelectable } : {}),
            },
            validation: { wordLimit: null },
        };

        const answerKey: Record<string, string | string[]> = {};
        answerKey[String(questionNumber)] = isMultiple ? correctOptions : correctOption;

        onContentChange(content, answerKey);
    }, [questionText, instructions, options, correctOption, correctOptions, explanation, showLetterLabels, maxSelectable, minSelectable, isMultiple, questionNumber]);

    const addOption = () => {
        const nextLetter = String.fromCharCode(65 + options.length);
        setOptions([...options, { id: nextLetter, text: `Option ${nextLetter}` }]);
    };

    const removeOption = (id: string) => {
        setOptions(options.filter(o => o.id !== id));
        if (isMultiple) {
            setCorrectOptions(correctOptions.filter(opt => opt !== id));
        } else if (correctOption === id) {
            setCorrectOption('');
        }
    };

    const updateOption = (id: string, text: string) => {
        setOptions(options.map(o => o.id === id ? { ...o, text } : o));
    };

    const toggleCorrectOption = (id: string) => {
        if (isMultiple) {
            setCorrectOptions(prev =>
                prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
            );
        } else {
            setCorrectOption(id);
        }
    };

    return (
        <div className="space-y-6">
            <FormSection title="Multiple Choice Settings (Common)" collapsible defaultCollapsed={true}>
                <FormField label="Question Text" value={questionText} onChange={setQuestionText} />
                <FormField label="Instructions" value={instructions} onChange={setInstructions} placeholder="e.g. Choose ONE letter" />
                <div className="flex items-center gap-2 mt-2">
                    <input
                        type="checkbox"
                        id="showLetters"
                        checked={showLetterLabels}
                        onChange={(e) => setShowLetterLabels(e.target.checked)}
                    />
                    <label htmlFor="showLetters" className="text-sm text-gray-700">Show letter labels (A, B, C...)</label>
                </div>
                {isMultiple && (
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <FormField label="Min selectable" type="number" value={String(minSelectable)} onChange={(v) => setMinSelectable(Number(v) || 1)} />
                        <FormField label="Max selectable" type="number" value={String(maxSelectable)} onChange={(v) => setMaxSelectable(Number(v) || 2)} />
                    </div>
                )}
            </FormSection>

            <FormSection title="Options">
                <div className="space-y-4">
                    {options.map((opt) => (
                        <div key={opt.id} className="flex gap-2 items-center p-3 border rounded bg-gray-50 border-gray-200">
                            <span className="font-bold text-blue-600 w-6">{opt.id}</span>
                            <input
                                className="flex-1 border p-2 rounded text-black"
                                value={opt.text}
                                onChange={(e) => updateOption(opt.id, e.target.value)}
                                placeholder="Option text..."
                            />
                            <label className="flex items-center gap-1 shrink-0">
                                <input
                                    type={isMultiple ? 'checkbox' : 'radio'}
                                    name={isMultiple ? undefined : 'correct'}
                                    checked={isMultiple ? correctOptions.includes(opt.id) : correctOption === opt.id}
                                    onChange={() => toggleCorrectOption(opt.id)}
                                />
                                <span className="text-xs font-bold text-gray-600">Correct</span>
                            </label>
                            <button onClick={() => removeOption(opt.id)} className="p-2 text-red-500 hover:bg-red-50 rounded">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                    ))}
                    <button onClick={addOption} className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                        + Add Option
                    </button>
                </div>
            </FormSection>

            <FormSection title="Explanation">
                <textarea
                    className="w-full border p-3 rounded text-black min-h-[80px]"
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder="Explanation for the correct answer(s)..."
                />
            </FormSection>
        </div>
    );
}
