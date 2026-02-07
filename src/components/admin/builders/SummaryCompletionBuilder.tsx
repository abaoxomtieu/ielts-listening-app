import React, { useState, useEffect } from 'react';
import { FormSection, FormField } from '../CompletionForm';
import { SummaryCompletionContent } from '@/lib/dtos/completion';
import SummaryCompletion from '@/components/completion/SummaryCompletion';

interface Props {
    initialContent?: any;
    onContentChange: (content: any, answerKey: any) => void;
    questionNumber: number;
}

export default function SummaryCompletionBuilder({ initialContent, onContentChange, questionNumber }: Props) {
    const [questionText, setQuestionText] = useState(initialContent?.questionText || 'Complete the summary below.');
    const [summaryText, setSummaryText] = useState(initialContent?.summary?.text || 'History of [31]...');
    const [options, setOptions] = useState<string>(initialContent?.options?.map((o: any) => o.text).join(', ') || '');

    useEffect(() => {
        const answerKey: Record<string, string> = {};

        // Parse blanks from text like [31], [32]...
        const blankRegex = /\[(\d+)\]/g;
        const blanks = [];
        let match;

        while ((match = blankRegex.exec(summaryText)) !== null) {
            blanks.push({
                id: parseInt(match[1]),
                position: match.index, // Not strictly accurate for runtime replacement but okay logic
                answer: '' // Needs manual input?
            });
            answerKey[match[1]] = ''; // Initialize
        }

        const parsedOptions = options ? options.split(',').map((t, i) => ({ id: String.fromCharCode(65 + i), text: t.trim() })) : undefined;

        const content: SummaryCompletionContent = {
            questionText,
            instructions: 'ONE WORD ONLY',
            summary: {
                text: summaryText,
                blanks: blanks // Incomplete answers
            },
            options: parsedOptions,
            wordLimit: 'ONE WORD ONLY',
            audioTimeRange: { start: '00:00', end: '00:00' },
            media: { image: null, audio: '/audio/section4.mp3' },
            uiHints: { displayType: 'summary', showOptions: !!parsedOptions }
        };

        onContentChange(content, answerKey);
    }, [questionText, summaryText, options, questionNumber]);


    return (
        <div className="space-y-6">
            <FormSection title="Summary Settings (Common)" collapsible={false}>
                <FormField label="Question Text" value={questionText} onChange={setQuestionText} />
                <FormField label="Summary Text (Use [31], [32] for blanks)" type="textarea" value={summaryText} onChange={setSummaryText} className="font-mono text-sm" />
                <FormField label="Options (comma separated, optional)" value={options} onChange={setOptions} placeholder="Option A, Option B..." />
                <div className="text-sm text-gray-500">Note: Answer Key must be filled manually in main JSON for now due to regex complexity in builder.</div>
            </FormSection>
        </div>
    );
}
