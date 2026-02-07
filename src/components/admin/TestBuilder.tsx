import React, { useState } from 'react';
import { FormSection, FormField } from './CompletionForm';
import { TestInfo, TestSection } from '@/types';
import TestSectionManager from './TestSectionManager';
import QuestionRenderer from '../QuestionRenderer';

interface Props {
    onSave: (data: any) => Promise<void>;
}

export default function TestBuilder({ onSave }: Props) {
    const [activeTab, setActiveTab] = useState<'editor' | 'json'>('editor');
    const [loading, setLoading] = useState(false);
    const [testInfo, setTestInfo] = useState<TestInfo>({
        title: 'New IELTS Practice Test',
        instructions: 'Answer all questions. You will hear each recording once only.',
        totalDuration: '30 minutes',
        audioFiles: {
            section1: '',
            section2: '',
            section3: '',
            section4: ''
        }
    });

    const [sections, setSections] = useState<TestSection[]>([]);
    const [activeSectionId, setActiveSectionId] = useState<number | null>(null);

    const addSection = () => {
        if (sections.length >= 4) return;
        const newSection: TestSection = {
            id: sections.length + 1,
            title: '',
            description: '',
            numberOfQuestions: 10,
            duration: '7-8 minutes',
            audioTime: { start: '00:00', end: '00:00' },
            questions: []
        };
        setSections([...sections, newSection]);
    };

    const updateSection = (idx: number, updatedSection: TestSection) => {
        const newSections = [...sections];
        newSections[idx] = updatedSection;
        setSections(newSections);
    };

    const removeSection = (idx: number) => {
        setSections(sections.filter((_, i) => i !== idx).map((s, i) => ({ ...s, id: i + 1 })));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await onSave({ info: testInfo, sections });
        } finally {
            setLoading(false);
        }
    };

    const renderPreview = () => (
        <div className="space-y-12 p-4">
            <div className="border-b-4 border-black pb-4">
                <h1 className="text-3xl font-black text-black uppercase tracking-tighter">{testInfo.title}</h1>
                <p className="text-gray-600 mt-2 font-medium">{testInfo.instructions}</p>
            </div>

            {sections.map((section) => (
                <div
                    key={section.id}
                    className={`space-y-8 rounded-lg transition-all ${activeSectionId === section.id ? 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50/50' : ''}`}
                >
                    <div className="bg-gray-900 text-white px-4 py-2 rounded flex justify-between items-center">
                        <span className="text-lg font-bold">SECTION {section.id}</span>
                        <span className="text-sm font-medium">{section.duration}</span>
                    </div>

                    <div className="px-2">
                        <h2 className="text-xl font-bold text-black mb-1">{section.title}</h2>
                        <p className="text-gray-600 italic text-sm mb-6">{section.description}</p>

                        <div className="space-y-10">
                            {section.questions.map((q, qIdx) => (
                                <QuestionRenderer key={qIdx} data={q} />
                            ))}
                        </div>
                    </div>

                    {section.id < sections.length && <hr className="border-gray-200 mt-12" />}
                </div>
            ))}

            {sections.length === 0 && (
                <div className="text-center py-20 text-gray-400 font-medium">
                    Add sections and questions to see the preview.
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-6 w-full">
            {/* HEADER: JSON tab + Save */}
            <div className="flex border-b border-gray-200 items-center gap-4">
                <button
                    onClick={() => setActiveTab(activeTab === 'json' ? 'editor' : 'json')}
                    className={`px-6 py-3 font-bold text-sm transition-all ${activeTab === 'json' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    JSON SOURCE
                </button>
                <div className="ml-auto flex items-center pr-4">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className={`px-4 py-1.5 rounded-lg text-white text-sm font-bold transition-all ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700 shadow-md active:scale-95'}`}
                    >
                        {loading ? 'Saving...' : 'SAVE TEST'}
                    </button>
                </div>
            </div>

            {activeTab === 'json' ? (
                <div className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-800 animate-in fade-in duration-300">
                    <div className="bg-gray-800 px-6 py-3 border-b border-gray-700 flex justify-between items-center">
                        <span className="text-gray-300 font-mono text-sm">test_source.json</span>
                    </div>
                    <div className="p-6 overflow-auto max-h-[70vh]">
                        <pre className="text-green-400 font-mono text-xs leading-relaxed">
                            {JSON.stringify({ info: testInfo, sections }, null, 2)}
                        </pre>
                    </div>
                </div>
            ) : (
                /* 6/4 split: left = add data (own scroll), right = test preview (own scroll, full height) */
                <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 w-full min-w-0 h-[calc(100vh-8rem)]">
                    <div className="lg:col-span-6 min-w-0 h-full overflow-y-auto overflow-x-hidden pr-2">
                        <div className="space-y-8 pb-8">
                        <FormSection title="Test Metadata">
                            <div className="space-y-4">
                                <FormField label="Test Title" value={testInfo.title} onChange={(v) => setTestInfo({ ...testInfo, title: v })} />
                                <FormField label="Instructions" type="textarea" value={testInfo.instructions} onChange={(v) => setTestInfo({ ...testInfo, instructions: v })} />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField label="Total Duration" value={testInfo.totalDuration} onChange={(v) => setTestInfo({ ...testInfo, totalDuration: v })} />
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
                                    <FormField label="Audio S1" value={testInfo.audioFiles.section1} onChange={(v) => setTestInfo({ ...testInfo, audioFiles: { ...testInfo.audioFiles, section1: v } })} placeholder="/audio/s1.mp3" />
                                    <FormField label="Audio S2" value={testInfo.audioFiles.section2} onChange={(v) => setTestInfo({ ...testInfo, audioFiles: { ...testInfo.audioFiles, section2: v } })} />
                                    <FormField label="Audio S3" value={testInfo.audioFiles.section3} onChange={(v) => setTestInfo({ ...testInfo, audioFiles: { ...testInfo.audioFiles, section3: v } })} />
                                    <FormField label="Audio S4" value={testInfo.audioFiles.section4} onChange={(v) => setTestInfo({ ...testInfo, audioFiles: { ...testInfo.audioFiles, section4: v } })} />
                                </div>
                            </div>
                        </FormSection>

                        <div className="space-y-8">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-black text-gray-900 uppercase">Test Sections</h2>
                                <button
                                    onClick={addSection}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95"
                                >
                                    + ADD SECTION
                                </button>
                            </div>

                            {sections.map((section, idx) => (
                                <TestSectionManager
                                    key={section.id}
                                    section={section}
                                    onRemove={() => removeSection(idx)}
                                    onChange={(updated) => updateSection(idx, updated)}
                                    onFocus={() => setActiveSectionId(section.id)}
                                />
                            ))}

                            {sections.length === 0 && (
                                <div className="text-center py-20 bg-white border-2 border-dashed border-gray-300 rounded-2xl text-gray-400">
                                    <svg className="w-12 h-12 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Click "ADD SECTION" to start building your test.
                                </div>
                            )}
                        </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 min-w-0 h-full overflow-y-auto overflow-x-hidden bg-gray-50 border-l border-gray-200">
                        {renderPreview()}
                    </div>
                </div>
            )}
        </div>
    );
}
