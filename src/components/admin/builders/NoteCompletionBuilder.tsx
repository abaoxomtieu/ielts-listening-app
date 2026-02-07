import React, { useState, useEffect } from 'react';
import { FormSection, FormField } from '../CompletionForm';
import { NoteCompletionContent, NoteSection } from '@/lib/dtos/completion';
import NoteCompletion from '@/components/completion/NoteCompletion';
import VisualBlankEditor from '../VisualBlankEditor';

interface Props {
    initialContent?: any;
    onContentChange: (content: any, answerKey: any) => void;
    questionNumber: number;
}

export default function NoteCompletionBuilder({ initialContent, onContentChange, questionNumber }: Props) {
    const [questionText, setQuestionText] = useState(initialContent?.questionText || 'Complete the notes below. Write');
    const [instructions, setInstructions] = useState(initialContent?.instructions || 'ONE WORD ONLY');
    const [title, setTitle] = useState(initialContent?.notes?.title || 'LECTURE NOTES');
    const [sections, setSections] = useState<NoteSection[]>(initialContent?.notes?.sections || []);

    useEffect(() => {
        const answerKey: Record<string, string> = {};
        let qCounter = questionNumber;

        const formattedSections = sections.map(section => ({
            ...section,
            bulletPoints: section.bulletPoints.map(bp => {
                if (bp.text.includes('[______]')) {
                    const id = qCounter++;
                    answerKey[String(id)] = bp.answer || '';
                    return { ...bp, id };
                }
                return bp;
            })
        }));

        const content: NoteCompletionContent = {
            questionText,
            instructions,
            notes: { title, sections: formattedSections },
            wordLimit: 'ONE WORD ONLY',
            audioTimeRange: { start: '00:00', end: '00:00' },
            media: { image: null, audio: '/audio/section4.mp3' },
            uiHints: { displayType: 'notes', showSectionHeadings: true, showBulletPoints: true, inlineInputs: true }
        };

        onContentChange(content, answerKey);
    }, [questionText, instructions, title, sections, questionNumber]);

    const addSection = () => {
        setSections([...sections, { heading: 'New Section', bulletPoints: [] }]);
    };

    const updateSectionHeading = (idx: number, heading: string) => {
        const newSections = [...sections];
        newSections[idx].heading = heading;
        setSections(newSections);
    };

    const addBulletPoint = (sectionIdx: number) => {
        const newSections = [...sections];
        newSections[sectionIdx].bulletPoints.push({ text: 'New point with [______]', answer: '' });
        setSections(newSections);
    };

    const updateBulletPoint = (sectionIdx: number, bpIdx: number, updates: any) => {
        const newSections = [...sections];
        newSections[sectionIdx].bulletPoints[bpIdx] = { ...newSections[sectionIdx].bulletPoints[bpIdx], ...updates };
        setSections(newSections);
    };
    const removeBulletPoint = (sectionIdx: number, bpIdx: number) => {
        const newSections = [...sections];
        newSections[sectionIdx].bulletPoints = newSections[sectionIdx].bulletPoints.filter((_, i) => i !== bpIdx);
        setSections(newSections);
    };

    const removeSection = (idx: number) => {
        setSections(sections.filter((_, i) => i !== idx));
    }


    return (
        <div className="space-y-6">
            <FormSection title="Note Completion Settings (Common)" collapsible defaultCollapsed={true}>
                <FormField label="Question Text" value={questionText} onChange={setQuestionText} />
                <FormField label="Instructions" value={instructions} onChange={setInstructions} />
            </FormSection>

            <FormSection title="Note Metadata">
                <FormField label="Note Title" value={title} onChange={setTitle} />
            </FormSection>

            <div className="space-y-4">
                {sections.map((section, sIdx) => (
                    <div key={sIdx} className="bg-white p-4 rounded border shadow-sm text-black relative">
                        <button onClick={() => removeSection(sIdx)} className="absolute top-2 right-2 text-red-500 text-sm">Remove Section</button>
                        <FormField label={`Section ${sIdx + 1} Heading`} value={section.heading} onChange={(v) => updateSectionHeading(sIdx, v)} className="mb-4 font-bold" />

                        <div className="pl-4 border-l-2 border-blue-100 space-y-3">
                            {section.bulletPoints.map((bp, bpIdx) => (
                                <div key={bpIdx} className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-gray-50 p-2 rounded relative group">
                                    <button onClick={() => removeBulletPoint(sIdx, bpIdx)} className="absolute top-1 right-1 text-red-500 text-xs opacity-0 group-hover:opacity-100">X</button>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Text (use [______] for blank)</label>
                                        <VisualBlankEditor
                                            value={bp.text}
                                            onChange={(val) => updateBulletPoint(sIdx, bpIdx, { text: val })}
                                            placeholder="Bullet point text..."
                                        />
                                    </div>
                                    <FormField
                                        label="Answer"
                                        value={bp.answer || ''}
                                        onChange={(v) => updateBulletPoint(sIdx, bpIdx, { answer: v })}
                                    />
                                </div>
                            ))}
                            <button onClick={() => addBulletPoint(sIdx)} className="text-sm text-blue-600 hover:underline">+ Add Point</button>
                        </div>
                    </div>
                ))}
                <button onClick={addSection} className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-500">+ Add Section</button>
            </div>
        </div>
    );
}
