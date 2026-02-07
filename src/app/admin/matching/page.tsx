'use client';

import React, { useState } from 'react';
import { MatchingData, MatchingContent } from '@/lib/dtos/matching';
import MatchingBuilder from '@/components/admin/builders/MatchingBuilder';
import QuestionRenderer from '@/components/QuestionRenderer';
import { FormField } from '@/components/admin/CompletionForm';

export default function MatchingAdminPage() {
    const [matchingData, setMatchingData] = useState<MatchingData>({
        meta: {
            questionType: 'matching',
            variant: 'people_opinions',
            section: 1,
            questionNumber: 1
        },
        content: {
            questionText: 'Questions 1-5: Match the following items.',
            instructions: 'Choose your answers from the box.',
            questions: [
                { id: 1, text: 'Question 1' }
            ],
            options: [
                { id: 'A', text: 'Option A' },
                { id: 'B', text: 'Option B' }
            ],
            answer: {
                matches: [],
                explanation: ''
            },
            audioTimeRange: { start: '00:00', end: '00:00' },
            media: { image: null, audio: '' },
            uiHints: { displayType: 'matching' },
            validation: { wordLimit: null },
        },
        answerKey: {},
        scoring: { points: 1 }
    });

    const [rightTab, setRightTab] = useState<'preview' | 'json'>('preview');
    const [jsonInput, setJsonInput] = useState('');

    const handleContentChange = (content: MatchingContent, answerKey: Record<string, string>) => {
        setMatchingData(prev => ({
            ...prev,
            content,
            answerKey
        }));
    };

    const handleMetaChange = (field: string, value: any) => {
        setMatchingData(prev => ({
            ...prev,
            meta: {
                ...prev.meta,
                [field]: value
            }
        }));
    };

    const loadJson = () => {
        try {
            const parsed = JSON.parse(jsonInput);
            setMatchingData(parsed);
        } catch (e) {
            alert('Invalid JSON');
        }
    };

    const downloadJson = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(matchingData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `matching_q${matchingData.meta.questionNumber}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="w-full">
                <header className="flex justify-between items-center mb-8 border-b pb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 uppercase">Matching Builder</h1>
                        <p className="text-gray-500">Create and edit IELTS Matching exercises</p>
                    </div>
                    <button
                        onClick={downloadJson}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold shadow-lg shadow-green-200 hover:scale-105 active:scale-95 transition-all"
                    >
                        Export JSON
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                    <div className="lg:col-span-6 space-y-8">
                        <MatchingBuilder
                            initialContent={matchingData.content}
                            onContentChange={handleContentChange}
                            questionNumber={matchingData.meta.questionNumber}
                        />

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Exercise Meta</h2>
                            <div className="space-y-4">
                                <FormField
                                    label="Variant Type"
                                    type="select"
                                    value={matchingData.meta.variant}
                                    onChange={(v) => handleMetaChange('variant', v)}
                                    options={[
                                        { value: 'people_opinions', label: 'People Opinions' },
                                        { value: 'events_info', label: 'Events / Info' },
                                        { value: 'locations_features', label: 'Locations / Features' }
                                    ]}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        label="Section"
                                        type="number"
                                        value={String(matchingData.meta.section)}
                                        onChange={(v) => handleMetaChange('section', parseInt(v) || 1)}
                                    />
                                    <FormField
                                        label="Start Quest #"
                                        type="number"
                                        value={String(matchingData.meta.questionNumber)}
                                        onChange={(v) => handleMetaChange('questionNumber', parseInt(v) || 1)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Import Tool</h2>
                            <textarea
                                className="w-full h-40 p-3 border rounded text-xs font-mono text-black mb-4 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Paste matching JSON here..."
                                value={jsonInput}
                                onChange={(e) => setJsonInput(e.target.value)}
                            />
                            <button
                                onClick={loadJson}
                                className="w-full py-2 bg-gray-800 text-white rounded font-bold hover:bg-black transition-colors"
                            >
                                Load from JSON
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <div className="flex border-b border-gray-200">
                            <button
                                onClick={() => setRightTab('preview')}
                                className={`px-4 py-2 font-bold text-sm ${rightTab === 'preview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Preview
                            </button>
                            <button
                                onClick={() => setRightTab('json')}
                                className={`px-4 py-2 font-bold text-sm ${rightTab === 'json' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                JSON
                            </button>
                        </div>

                        {rightTab === 'preview' && (
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 overflow-auto max-h-[calc(100vh-12rem)]">
                                <QuestionRenderer data={matchingData as any} />
                            </div>
                        )}

                        {rightTab === 'json' && (
                            <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
                                <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
                                    <span className="text-gray-300 font-mono text-sm">matching_data.json</span>
                                </div>
                                <div className="p-4 overflow-auto max-h-[calc(100vh-12rem)]">
                                    <pre className="text-green-400 font-mono text-xs leading-relaxed whitespace-pre">
                                        {JSON.stringify(matchingData, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
