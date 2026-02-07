import React, { useState, useEffect } from 'react';
import { FormSection, FormField } from '../CompletionForm';
import { SentenceItem, SentenceCompletionContent } from '@/lib/dtos/completion';
import SentenceCompletion from '@/components/completion/SentenceCompletion';
import VisualBlankEditor from '../VisualBlankEditor';

interface Props {
    initialContent?: any;
    onContentChange: (content: any, answerKey: any) => void;
    questionNumber: number;
}

export default function SentenceCompletionBuilder({ initialContent, onContentChange, questionNumber }: Props) {
    const [questionText, setQuestionText] = useState(initialContent?.questionText || 'Complete the sentences below. Write');
    const [instructions, setInstructions] = useState(initialContent?.instructions || 'NO MORE THAN TWO WORDS');
    const [wordLimit, setWordLimit] = useState(initialContent?.wordLimit || 'NO MORE THAN TWO WORDS');
    const [sentences, setSentences] = useState<SentenceItem[]>(initialContent?.sentences || []);
    const [audioTimeRange, setAudioTimeRange] = useState(initialContent?.audioTimeRange || { start: '00:00', end: '00:00' });
    const [showSentenceNumbers, setShowSentenceNumbers] = useState(initialContent?.uiHints?.showSentenceNumbers ?? true);

    const updateSentence = (idx: number, updates: Partial<SentenceItem>) => {
        const newSentences = [...sentences];
        const current = { ...newSentences[idx], ...updates };

        newSentences[idx] = current;
        setSentences(newSentences);
    };

    // Adjusted Effect to clean up text for DTO based on position
    useEffect(() => {
        const answerKey: Record<string, string> = {};
        const formattedSentences = sentences.map((s, idx) => {
            const qNum = questionNumber + idx;
            answerKey[String(qNum)] = s.answer;

            return {
                ...s,
                id: qNum,
                text: s.text,
                audioTimeRange: s.audioTimeRange || { start: '00:00', end: '00:00' }
            };
        });

        const content: SentenceCompletionContent = {
            questionText,
            instructions: 'ONE WORD ONLY',
            sentences: formattedSentences,
            wordLimit: 'ONE WORD ONLY',
            audioTimeRange: { start: '00:00', end: '00:00' },
            media: { image: null, audio: '/audio/section4.mp3' },
            uiHints: {
                displayType: 'sentence',
                showSentenceNumbers: true,
                inlineInputs: true
            }
        };

        onContentChange(content, answerKey);
    }, [questionText, instructions, wordLimit, sentences, audioTimeRange, showSentenceNumbers, questionNumber]);

    const addSentence = () => {
        setSentences([...sentences, {
            id: Date.now(),
            text: 'Sample sentence with [______]',
            answer: '',
            audioTimeRange: { start: '00:00', end: '00:00' }
        }]);
    };

    const removeSentence = (idx: number) => {
        setSentences(sentences.filter((_, i) => i !== idx));
    };


    return (
        <div className="space-y-6">
            <FormSection title="Sentence Completion Settings (Common)" collapsible defaultCollapsed={true}>
                <FormField label="Question Text" value={questionText} onChange={setQuestionText} />
                <FormField label="Instructions" value={instructions} onChange={setInstructions} />
                <FormField label="Word Limit" value={wordLimit} onChange={setWordLimit} />

                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Audio Start" value={audioTimeRange.start} onChange={(v) => setAudioTimeRange({ ...audioTimeRange, start: v })} placeholder="mm:ss" />
                    <FormField label="Audio End" value={audioTimeRange.end} onChange={(v) => setAudioTimeRange({ ...audioTimeRange, end: v })} placeholder="mm:ss" />
                </div>

                <div className="flex items-center gap-2 mt-2">
                    <input type="checkbox" checked={showSentenceNumbers} onChange={(e) => setShowSentenceNumbers(e.target.checked)} />
                    <span>Show Sentence Numbers</span>
                </div>
            </FormSection>

            <FormSection title="Sentences">
                {sentences.map((s, idx) => (
                    <div key={idx} className="p-4 border rounded relative bg-gray-50 text-black mb-4">
                        <button onClick={() => removeSentence(idx)} className="absolute top-2 right-2 text-red-500 text-sm">Remove</button>
                        <div className="font-medium mb-2">Item {questionNumber + idx}</div>

                        <div className="mb-2">
                            <label className="block text-sm font-bold mb-1">Sentence (use "Add Blank" visually)</label>
                            <VisualBlankEditor
                                value={s.text}
                                onChange={(val) => updateSentence(idx, { text: val })}
                                placeholder="e.g. The is big"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <FormField label="Answer" value={s.answer} onChange={(v) => updateSentence(idx, { answer: v })} />
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <FormField label="Start Time" value={s.audioTimeRange?.start || ''} onChange={(v) => updateSentence(idx, { audioTimeRange: { ...s.audioTimeRange!, start: v } })} placeholder="mm:ss" />
                            <FormField label="End Time" value={s.audioTimeRange?.end || ''} onChange={(v) => updateSentence(idx, { audioTimeRange: { ...s.audioTimeRange!, end: v } })} placeholder="mm:ss" />
                        </div>
                    </div>
                ))}
                <button onClick={addSentence} className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-500">+ Add Sentence</button>
            </FormSection>
        </div>
    );
}
