import React, { useState, useEffect } from 'react';
import { FormSection, FormField } from '../../CompletionForm';
import { FormCompletionContent, FormFieldData } from '@/lib/dtos/completion';
import FormCompletion from '@/components/completion/FormCompletion';

interface Props {
    initialContent?: any;
    onContentChange: (content: any, answerKey: any) => void;
    questionNumber: number;
}

export default function FormCompletionBuilder({ initialContent, onContentChange, questionNumber }: Props) {
    const [questionText, setQuestionText] = useState(initialContent?.questionText || 'Complete the form below. Write');
    const [instructions, setInstructions] = useState(initialContent?.instructions || 'NO MORE THAN TWO WORDS AND/OR A NUMBER');
    const [formTitle, setFormTitle] = useState(initialContent?.formData?.formTitle || 'REGISTRATION FORM');
    const [fields, setFields] = useState<FormFieldData[]>(initialContent?.formData?.fields || []);
    const [audioTimeRange, setAudioTimeRange] = useState(initialContent?.audioTimeRange || { start: '00:00', end: '00:00' });

    useEffect(() => {
        const answerKey: Record<string, string> = {};
        const formattedFields = fields.map((f, idx) => {
            const qNum = questionNumber + idx;
            answerKey[String(qNum)] = f.answer;
            return { ...f, id: qNum };
        });

        const content: FormCompletionContent = {
            questionText,
            instructions: instructions,
            formData: {
                formTitle: formTitle,
                fields: formattedFields
            },
            wordLimit: instructions,
            audioTimeRange,
            media: { image: null, audio: '/audio/section4.mp3' },
            uiHints: {
                displayType: 'form',
                showFieldNumbers: true
            }
        };

        onContentChange(content, answerKey);
    }, [questionText, instructions, formTitle, fields, audioTimeRange, questionNumber]);

    const addField = () => {
        setFields([...fields, {
            id: 0,
            label: 'New Field:',
            placeholder: '_____________________',
            inputType: 'text',
            required: true,
            answer: '',
            audioTimeRange: { start: '00:00', end: '00:00' }
        }]);
    };

    const updateField = (idx: number, updates: Partial<FormFieldData>) => {
        const newFields = [...fields];
        newFields[idx] = { ...newFields[idx], ...updates };
        setFields(newFields);
    };

    const removeField = (idx: number) => {
        setFields(fields.filter((_, i) => i !== idx));
    };

    return (
        <div className="space-y-6">
            <FormSection title="Form Completion Settings (Common)" collapsible defaultCollapsed={true}>
                <FormField label="Question Text" value={questionText} onChange={setQuestionText} />
                <FormField label="Instructions" value={instructions} onChange={setInstructions} />
            </FormSection>

            <FormSection title="Form Metadata">
                <FormField label="Form Title" value={formTitle} onChange={setFormTitle} />
            </FormSection>

            <FormSection title="Form Fields">
                {fields.map((field, idx) => (
                    <div key={idx} className="p-4 border rounded bg-gray-50 text-black mb-4 relative">
                        <button onClick={() => removeField(idx)} className="absolute top-2 right-2 text-red-500 text-sm">Remove</button>
                        <div className="font-bold mb-2">Field {questionNumber + idx}</div>
                        <div className="grid grid-cols-2 gap-3">
                            <FormField label="Label" value={field.label} onChange={(v) => updateField(idx, { label: v })} />
                            <FormField label="Answer" value={field.answer} onChange={(v) => updateField(idx, { answer: v })} />
                            <FormField
                                label="Input Type"
                                type="select"
                                value={field.inputType}
                                onChange={(v) => updateField(idx, { inputType: v as any })}
                                options={[
                                    { value: 'text', label: 'Text' }, { value: 'number', label: 'Number' },
                                    { value: 'email', label: 'Email' }, { value: 'tel', label: 'Tel' },
                                    { value: 'date', label: 'Date' }, { value: 'select', label: 'Select' }
                                ]}
                            />
                            <FormField label="Placeholder" value={field.placeholder || ''} onChange={(v) => updateField(idx, { placeholder: v })} />
                        </div>
                        {field.inputType === 'select' && (
                            <div className="mt-2">
                                <label className="text-sm">Options (comma separated)</label>
                                <input
                                    className="w-full border p-2 rounded"
                                    value={field.options?.join(', ') || ''}
                                    onChange={(e) => updateField(idx, { options: e.target.value.split(',').map(s => s.trim()) })}
                                />
                            </div>
                        )}
                    </div>
                ))}
                <button onClick={addField} className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-500">+ Add Field</button>
            </FormSection>
        </div>
    );
}
