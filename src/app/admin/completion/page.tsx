'use client';

import React, { useState, useEffect } from 'react';
import { FormSection, FormField } from '@/components/admin/CompletionForm';
import { CompletionData } from '@/lib/dtos/completion';
import SentenceCompletionBuilder from '@/components/admin/builders/SentenceCompletionBuilder';
import FormCompletionBuilder from '@/components/admin/builders/FormCompletionBuilder';
import NoteCompletionBuilder from '@/components/admin/builders/NoteCompletionBuilder';
import TableCompletionBuilder from '@/components/admin/builders/TableCompletionBuilder';
import SummaryCompletionBuilder from '@/components/admin/builders/SummaryCompletionBuilder';
import FlowchartCompletionBuilder from '@/components/admin/builders/FlowchartCompletionBuilder';

// Imports
import SentenceCompletion from '@/components/completion/SentenceCompletion';
import FormCompletion from '@/components/completion/FormCompletion';
import NoteCompletion from '@/components/completion/NoteCompletion';
import TableCompletion from '@/components/completion/TableCompletion';
import SummaryCompletion from '@/components/completion/SummaryCompletion';
import FlowchartCompletion from '@/components/completion/FlowchartCompletion';

export default function CompletionAdminPage() {
    const [loading, setLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState<{ success?: boolean; message?: string } | null>(null);
    const [filename, setFilename] = useState('completion_exercise');
    const [activeTab, setActiveTab] = useState<'preview' | 'json'>('preview');

    // Meta State
    const [variant, setVariant] = useState<string>('sentence_completion');
    const [section, setSection] = useState<number>(4);
    const [questionNumber, setQuestionNumber] = useState<number>(31);

    // Computed State for JSON
    const [content, setContent] = useState<any>({});
    const [answerKey, setAnswerKey] = useState<any>({});
    const [jsonPreview, setJsonPreview] = useState<string>('');

    // Effect to clear content when variant changes to prevent stale data preview errors
    useEffect(() => {
        setContent({});
        setAnswerKey({});
    }, [variant]);

    useEffect(() => {
        // Only update if we have content for the current variant
        const data: CompletionData = {
            meta: {
                questionType: 'completion',
                variant: variant as any,
                section,
                questionNumber,
            },
            content: content,
            answerKey,
            scoring: { points: 1 },
        };

        setJsonPreview(JSON.stringify(data, null, 2));
    }, [variant, section, questionNumber, content, answerKey]);

    const handleContentChange = (newContent: any, newAnswerKey: any) => {
        setContent(newContent);
        setAnswerKey(newAnswerKey);
    }

    const handleSave = async () => {
        setLoading(true);
        setSaveStatus(null);
        try {
            const data = JSON.parse(jsonPreview);
            const res = await fetch('/api/admin/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filename, data }),
            });

            if (!res.ok) throw new Error('Failed to save');

            const result = await res.json();
            setSaveStatus({ success: true, message: `Saved to ${result.path}` });
        } catch (error) {
            setSaveStatus({ success: false, message: 'Error saving file' });
        } finally {
            setLoading(false);
        }
    };

    const renderBuilder = () => {
        switch (variant) {
            case 'sentence_completion':
                return <SentenceCompletionBuilder onContentChange={handleContentChange} questionNumber={questionNumber} />;
            case 'form_completion':
                return <FormCompletionBuilder onContentChange={handleContentChange} questionNumber={questionNumber} />;
            case 'note_completion':
                return <NoteCompletionBuilder onContentChange={handleContentChange} questionNumber={questionNumber} />;
            case 'table_completion':
                return <TableCompletionBuilder onContentChange={handleContentChange} questionNumber={questionNumber} />;
            case 'summary_completion':
                return <SummaryCompletionBuilder onContentChange={handleContentChange} questionNumber={questionNumber} />;
            case 'flowchart_completion':
                return <FlowchartCompletionBuilder onContentChange={handleContentChange} questionNumber={questionNumber} />;
            default:
                return <div>Select a variant</div>
        }
    }

    const renderPreview = () => {
        if (!content || Object.keys(content).length === 0) return <div className="text-gray-500 p-4">Start editing to see preview</div>;

        switch (variant) {
            case 'sentence_completion':
                if (!content.sentences) return null;
                return <SentenceCompletion
                    questionText={content.questionText}
                    instructions={content.instructions}
                    sentences={content.sentences || []}
                    wordLimit={content.wordLimit}
                    questionNumber={questionNumber}
                    showSentenceNumbers={content.uiHints?.showSentenceNumbers}
                />;
            case 'form_completion':
                if (!content.formData) return null;
                return <FormCompletion
                    questionText={content.questionText}
                    instructions={content.instructions}
                    formData={content.formData || { formTitle: '', fields: [] }}
                    wordLimit={content.wordLimit}
                    questionNumber={questionNumber}
                />;
            case 'note_completion':
                if (!content.notes) return null;
                return <NoteCompletion
                    questionText={content.questionText}
                    instructions={content.instructions}
                    notes={content.notes || { sections: [] }}
                    wordLimit={content.wordLimit}
                    questionNumber={questionNumber}
                />;
            case 'table_completion':
                if (!content.table) return null;
                return <TableCompletion
                    questionText={content.questionText}
                    instructions={content.instructions}
                    table={content.table || { headers: [], rows: [] }}
                    wordLimit={content.wordLimit}
                    questionNumber={questionNumber}
                />;
            case 'summary_completion':
                if (!content.summary) return null;
                return <SummaryCompletion
                    questionText={content.questionText}
                    instructions={content.instructions}
                    summary={content.summary || { text: '', blanks: [] }}
                    options={content.options}
                    wordLimit={content.wordLimit}
                    questionNumber={questionNumber}
                />;
            case 'flowchart_completion':
                if (!content.flowchart || !content.flowchart.nodes) return null;
                return <FlowchartCompletion
                    questionText={content.questionText}
                    instructions={content.instructions}
                    flowchart={{
                        ...content.flowchart,
                        startNode: content.flowchart.startNode || { id: 'start', text: 'Start', position: { x: 50, y: 0 } },
                        endNode: content.flowchart.endNode || { id: 'end', text: 'End', position: { x: 50, y: 800 } },
                        connections: content.flowchart.connections || []
                    }}
                    wordLimit={content.wordLimit}
                    questionNumber={questionNumber}
                />;
            default:
                return <div>No preview available</div>;
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* LEFT COLUMN: EDITOR */}
                <div className="space-y-6">
                    <h1 className="text-2xl font-bold text-gray-900">Completion Type Editor</h1>

                    <FormSection title="Meta Information">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                label="Variant"
                                type="select"
                                value={variant}
                                onChange={setVariant}
                                options={[
                                    { value: 'sentence_completion', label: 'Sentence Completion' },
                                    { value: 'form_completion', label: 'Form Completion' },
                                    { value: 'note_completion', label: 'Note Completion' },
                                    { value: 'table_completion', label: 'Table Completion' },
                                    { value: 'summary_completion', label: 'Summary Completion' },
                                    { value: 'flowchart_completion', label: 'Flowchart Completion' },
                                ]}
                            />
                            <FormField label="Section" type="number" value={section} onChange={(v) => setSection(Number(v))} />
                            <FormField label="Start Q#" type="number" value={questionNumber} onChange={(v) => setQuestionNumber(Number(v))} />
                        </div>
                    </FormSection>

                    {renderBuilder()}

                </div>

                {/* RIGHT COLUMN: PREVIEW & JSON */}
                <div className="space-y-6">
                    <div className="sticky top-6">
                        <FormSection title="Actions">
                            <div className="flex flex-col gap-4">
                                <FormField
                                    label="Filename"
                                    value={filename}
                                    onChange={setFilename}
                                    placeholder="filename-without-extension"
                                />

                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                                        }`}
                                >
                                    {loading ? 'Saving...' : 'Save JSON'}
                                </button>

                                {saveStatus && (
                                    <div className={`p-3 rounded-lg text-sm ${saveStatus.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                        }`}>
                                        {saveStatus.message}
                                    </div>
                                )}
                            </div>
                        </FormSection>

                        {/* TABS */}
                        <div className="mt-6">
                            <div className="flex border-b border-gray-700 mb-4">
                                <button
                                    className={`px-4 py-2 font-medium text-sm ${activeTab === 'preview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    onClick={() => setActiveTab('preview')}
                                >
                                    UI Preview
                                </button>
                                <button
                                    className={`px-4 py-2 font-medium text-sm ${activeTab === 'json' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    onClick={() => setActiveTab('json')}
                                >
                                    JSON Source
                                </button>
                            </div>

                            {activeTab === 'preview' ? (
                                <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden min-h-[400px] p-4">
                                    {renderPreview()}
                                </div>
                            ) : (
                                <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-700">
                                    <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex justify-between items-center">
                                        <span className="text-gray-300 text-sm font-mono">JSON Output</span>
                                        <span className="text-gray-500 text-xs">{new Blob([jsonPreview]).size} bytes</span>
                                    </div>
                                    <div className="p-4 overflow-auto max-h-[600px]">
                                        <pre className="text-green-400 font-mono text-xs whitespace-pre-wrap">
                                            {jsonPreview}
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
