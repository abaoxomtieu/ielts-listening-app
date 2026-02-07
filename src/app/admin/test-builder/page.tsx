'use client';

import React, { useState, useEffect } from 'react';
import TestBuilder, { TestBuilderDraft } from '@/components/admin/TestBuilder';
import { loadDraft, clearDraft } from '@/lib/draft-storage';

export default function TestBuilderPage() {
    const [saveStatus, setSaveStatus] = useState<{ success?: boolean; message?: string } | null>(null);
    const [initialDraft, setInitialDraft] = useState<TestBuilderDraft | null | undefined>(undefined);

    useEffect(() => {
        const draft = loadDraft();
        setInitialDraft(draft ? { info: draft.info as TestBuilderDraft['info'], sections: draft.sections as TestBuilderDraft['sections'] } : null);
    }, []);

    const handleSave = async (data: any) => {
        setSaveStatus(null);
        try {
            const filename = data.info.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

            const res = await fetch('/api/admin/save-test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filename, data }),
            });

            if (!res.ok) throw new Error('Failed to save');

            const result = await res.json();
            clearDraft();
            setSaveStatus({ success: true, message: `Test saved successfully to ${result.path}` });
        } catch (error) {
            setSaveStatus({ success: false, message: 'Error saving test file' });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 w-full">
            <div className="w-full">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">IELTS Test Builder</h1>
                        <p className="text-gray-500 font-medium">Create complete multipart listening tests</p>
                    </div>
                </div>

                {saveStatus && (
                    <div className={`mb-6 p-4 rounded-xl border-2 font-bold animate-in slide-in-from-top-4 duration-300 ${saveStatus.success ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
                        }`}>
                        <div className="flex items-center gap-3">
                            {saveStatus.success ? (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            )}
                            {saveStatus.message}
                        </div>
                    </div>
                )}

                {initialDraft === undefined ? (
                    <div className="text-gray-500 text-sm py-8">Loading...</div>
                ) : (
                    <>
                        {initialDraft != null && (initialDraft.sections?.length > 0 || initialDraft.info?.title) && (
                            <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-sm">
                                Draft restored from this device. Auto-saved every 30s; expires in 24 hours.
                            </div>
                        )}
                        <TestBuilder onSave={handleSave} initialDraft={initialDraft ?? undefined} />
                    </>
                )}
            </div>
        </div>
    );
}
