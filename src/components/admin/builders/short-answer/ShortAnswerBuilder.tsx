'use client';

import React, { useState, useEffect } from 'react';
import { FormSection, FormField } from '../../CompletionForm';

interface QuestionItem {
    id: number;
    text: string;
    answer: string;
    alternativeAnswers: string[];
    answerType: 'text' | 'number';
    audioTimeRange: { start: string; end: string };
}

interface Props {
    initialContent?: any;
    onContentChange: (content: any, answerKey: Record<string, string>) => void;
    questionNumber: number;
}

export default function ShortAnswerBuilder({ initialContent, onContentChange, questionNumber }: Props) {
    const [questionText, setQuestionText] = useState(initialContent?.questionText || 'Answer the questions below. Write');
    const [instructions, setInstructions] = useState(initialContent?.instructions || 'NO MORE THAN TWO WORDS AND/OR A NUMBER');
    const [wordLimit, setWordLimit] = useState(initialContent?.wordLimit || 'NO MORE THAN TWO WORDS AND/OR A NUMBER');
    const [questions, setQuestions] = useState<QuestionItem[]>(initialContent?.questions?.length
        ? initialContent.questions.map((q: any) => ({
            id: q.id,
            text: q.text || '',
            answer: q.answer || '',
            alternativeAnswers: Array.isArray(q.alternativeAnswers) ? q.alternativeAnswers : [],
            answerType: q.answerType === 'number' ? 'number' : 'text',
            audioTimeRange: q.audioTimeRange || { start: '00:00', end: '00:00' },
        }))
        : [{ id: questionNumber, text: 'Question 1', answer: '', alternativeAnswers: [], answerType: 'text', audioTimeRange: { start: '00:00', end: '00:00' } }]
    );
    const [showQuestionNumbers, setShowQuestionNumbers] = useState(initialContent?.uiHints?.showQuestionNumbers ?? true);
    const [explanation, setExplanation] = useState(initialContent?.explanation || '');

    useEffect(() => {
        const answerKey: Record<string, string> = {};
        const formattedQuestions = questions.map((q, idx) => {
            const qNum = questionNumber + idx;
            answerKey[String(qNum)] = q.answer;
            return {
                ...q,
                id: qNum,
                audioTimeRange: q.audioTimeRange || { start: '00:00', end: '00:00' },
            };
        });

        const content = {
            questionText,
            instructions,
            questions: formattedQuestions,
            wordLimit,
            answer: answerKey,
            explanation,
            audioTimeRange: { start: '00:00', end: '00:00' },
            media: { image: null, audio: '' },
            uiHints: {
                displayType: 'questions' as const,
                showQuestionNumbers,
                inputType: 'text' as const,
                caseSensitive: false,
            },
            validation: { wordLimit },
        };

        onContentChange(content, answerKey);
    }, [questionText, instructions, wordLimit, questions, showQuestionNumbers, explanation, questionNumber]);

    const addQuestion = () => {
        const nextId = questions.length > 0 ? questions[questions.length - 1].id + 1 : questionNumber + questions.length;
        setQuestions([...questions, {
            id: nextId,
            text: `Question ${questions.length + 1}`,
            answer: '',
            alternativeAnswers: [],
            answerType: 'text',
            audioTimeRange: { start: '00:00', end: '00:00' },
        }]);
    };

    const removeQuestion = (idx: number) => {
        setQuestions(questions.filter((_, i) => i !== idx));
    };

    const updateQuestion = (idx: number, updates: Partial<QuestionItem>) => {
        const newQuestions = [...questions];
        newQuestions[idx] = { ...newQuestions[idx], ...updates };
        setQuestions(newQuestions);
    };

    return (
        <div className="space-y-6">
            <FormSection title="Short Answer Settings (Common)" collapsible defaultCollapsed={true}>
                <FormField label="Question Text" value={questionText} onChange={setQuestionText} />
                <FormField label="Instructions" value={instructions} onChange={setInstructions} />
                <FormField label="Word Limit" value={wordLimit} onChange={setWordLimit} />
                <div className="flex items-center gap-2 mt-2">
                    <input
                        type="checkbox"
                        id="showQNums"
                        checked={showQuestionNumbers}
                        onChange={(e) => setShowQuestionNumbers(e.target.checked)}
                    />
                    <label htmlFor="showQNums" className="text-sm text-gray-700">Show question numbers</label>
                </div>
            </FormSection>

            <FormSection title="Questions">
                <div className="space-y-4">
                    {questions.map((q, idx) => (
                        <div key={q.id} className="p-4 border rounded bg-gray-50 text-black relative">
                            <button onClick={() => removeQuestion(idx)} className="absolute top-2 right-2 text-red-500 text-sm">Remove</button>
                            <div className="font-bold mb-2">Item {questionNumber + idx}</div>
                            <FormField label="Question text" value={q.text} onChange={(v) => updateQuestion(idx, { text: v })} placeholder="e.g. When was the first electric car produced?" />
                            <div className="grid grid-cols-2 gap-3 mt-2">
                                <FormField label="Answer" value={q.answer} onChange={(v) => updateQuestion(idx, { answer: v })} />
                                <FormField
                                    label="Answer type"
                                    type="select"
                                    value={q.answerType}
                                    onChange={(v) => updateQuestion(idx, { answerType: v as 'text' | 'number' })}
                                    options={[{ value: 'text', label: 'Text' }, { value: 'number', label: 'Number' }]}
                                />
                            </div>
                            <FormField label="Alternative answers (comma separated)" value={(q.alternativeAnswers || []).join(', ')} onChange={(v) => updateQuestion(idx, { alternativeAnswers: v ? v.split(',').map(s => s.trim()) : [] })} placeholder="e.g. 1830s, early 1830s" className="mt-2" />
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <FormField label="Audio Start" value={q.audioTimeRange?.start || ''} onChange={(v) => updateQuestion(idx, { audioTimeRange: { ...q.audioTimeRange, start: v } })} placeholder="mm:ss" />
                                <FormField label="Audio End" value={q.audioTimeRange?.end || ''} onChange={(v) => updateQuestion(idx, { audioTimeRange: { ...q.audioTimeRange, end: v } })} placeholder="mm:ss" />
                            </div>
                        </div>
                    ))}
                    <button onClick={addQuestion} className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                        + Add Question
                    </button>
                </div>
            </FormSection>

            <FormSection title="Explanation">
                <textarea
                    className="w-full border p-3 rounded text-black min-h-[80px]"
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder="Explanation for the answers..."
                />
            </FormSection>
        </div>
    );
}
