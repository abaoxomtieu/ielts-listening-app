import React, { useState, useEffect } from 'react';
import { FormSection, FormField } from '../CompletionForm';
import { FlowchartCompletionContent, FlowchartNodeData } from '@/lib/dtos/completion';
import FlowchartCompletion from '@/components/completion/FlowchartCompletion';
import VisualBlankEditor from '../VisualBlankEditor';

interface Props {
    initialContent?: any;
    onContentChange: (content: any, answerKey: any) => void;
    questionNumber: number;
}

export default function FlowchartCompletionBuilder({ initialContent, onContentChange, questionNumber }: Props) {
    const [questionText, setQuestionText] = useState(initialContent?.questionText || 'Complete the flowchart.');
    const [instructions, setInstructions] = useState(initialContent?.instructions || 'NO MORE THAN THREE WORDS');
    const [flowchartTitle, setFlowchartTitle] = useState(initialContent?.flowchart?.title || '');
    const [nodes, setNodes] = useState<FlowchartNodeData[]>(initialContent?.flowchart?.nodes || []);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    useEffect(() => {
        const answerKey: Record<string, string> = {};
        let questionCounter = 0;

        const formattedNodes = nodes.map((n) => {
            if (n.text && n.text.includes('[______]')) {
                const id = questionNumber + questionCounter;
                questionCounter++;
                answerKey[String(id)] = n.answer || '';
                return { ...n, id };
            }
            return { ...n, id: `content-${Date.now()}-${Math.random()}` }; // Temp ID for content nodes
        });

        const content: FlowchartCompletionContent = {
            questionText,
            instructions: instructions,
            flowchart: {
                title: flowchartTitle,
                nodes: formattedNodes,
                connections: [] // Simplifying connections for builder
            },
            wordLimit: instructions,
            audioTimeRange: { start: '00:00', end: '00:00' },
            media: { image: null, audio: '/audio/section4.mp3' },
            uiHints: { displayType: 'flowchart' }
        };

        onContentChange(content, answerKey);
    }, [questionText, instructions, flowchartTitle, nodes, questionNumber]);

    const addBlankNode = () => {
        setNodes([...nodes, { id: Date.now(), text: 'New blank [______]', answer: '', position: { x: 50, y: 50 } }]);
    };

    const addInfoNode = () => {
        setNodes([...nodes, { id: Date.now(), text: 'New info step', position: { x: 50, y: 50 } }]);
    };

    const updateNode = (idx: number, updates: any) => {
        const newNodes = [...nodes];
        newNodes[idx] = { ...newNodes[idx], ...updates };
        setNodes(newNodes);
    }
    const removeNode = (idx: number) => {
        setNodes(nodes.filter((_, i) => i !== idx));
    }

    const moveNode = (idx: number, direction: 'up' | 'down') => {
        const newNodes = [...nodes];
        const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (targetIdx < 0 || targetIdx >= nodes.length) return;

        [newNodes[idx], newNodes[targetIdx]] = [newNodes[targetIdx], newNodes[idx]];
        setNodes(newNodes);
    }

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        // HTML5 drag image can be custom if needed
    };

    const handleDragEnter = (index: number) => {
        if (draggedIndex === null || draggedIndex === index) return;

        const newNodes = [...nodes];
        const draggedItem = newNodes[draggedIndex];
        newNodes.splice(draggedIndex, 1);
        newNodes.splice(index, 0, draggedItem);

        setDraggedIndex(index);
        setNodes(newNodes);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };


    return (
        <div className="space-y-6">
            <FormSection title="Flowchart Settings (Common)" collapsible={false}>
                <FormField label="Question Text" value={questionText} onChange={setQuestionText} />
                <FormField label="Instructions" value={instructions} onChange={setInstructions} />
            </FormSection>

            <FormSection title="Flowchart Metadata">
                <FormField label="Flowchart Title" value={flowchartTitle} onChange={setFlowchartTitle} />
            </FormSection>
            <FormSection title="Nodes">
                <div className="space-y-4">
                    {nodes.map((node, idx) => {
                        const isQuestion = node.text && node.text.includes('[______]');
                        return (
                            <div
                                key={idx}
                                className={`flex gap-4 items-start group transition-all ${draggedIndex === idx ? 'opacity-40 scale-95' : ''}`}
                                onDragOver={(e) => e.preventDefault()}
                                onDragEnter={() => handleDragEnter(idx)}
                            >
                                {/* Drag Handle Decorator */}
                                <div
                                    className="mt-8 text-gray-400 cursor-grab active:cursor-grabbing group-hover:text-gray-600 transition-colors bg-gray-100 p-1 rounded hover:bg-gray-200"
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, idx)}
                                    onDragEnd={handleDragEnd}
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M10 10c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4-8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
                                    </svg>
                                </div>

                                <div className="flex-1 p-4 border rounded bg-gray-50 text-black relative">
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <button
                                            onClick={() => moveNode(idx, 'up')}
                                            disabled={idx === 0}
                                            className="text-gray-400 hover:text-blue-600 disabled:opacity-30 p-1"
                                            title="Move Up"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                                        </button>
                                        <button
                                            onClick={() => moveNode(idx, 'down')}
                                            disabled={idx === nodes.length - 1}
                                            className="text-gray-400 hover:text-blue-600 disabled:opacity-30 p-1"
                                            title="Move Down"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </button>
                                        <button onClick={() => removeNode(idx)} className="text-red-400 hover:text-red-600 p-1" title="Remove">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                    <div className="mb-2 pr-20">
                                        <label className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-2 ${isQuestion ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'}`}>
                                            {isQuestion ? 'Question Node' : 'Info Node'}
                                        </label>
                                        <VisualBlankEditor
                                            value={node.text}
                                            onChange={(val) => updateNode(idx, { text: val })}
                                            placeholder="e.g. History of [______]"
                                        />
                                    </div>
                                    {isQuestion && (
                                        <FormField label="Answer" value={node.answer || ''} onChange={(v) => updateNode(idx, { answer: v })} />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                    <button
                        onClick={addBlankNode}
                        className="flex flex-col items-center justify-center py-4 border-2 border-dashed border-blue-200 rounded-lg text-blue-500 hover:bg-blue-50 hover:border-blue-300 transition-all group"
                    >
                        <span className="text-xl group-hover:scale-110 transition-transform">+</span>
                        <span className="text-xs font-bold uppercase tracking-wider">Add Blank Node</span>
                    </button>
                    <button
                        onClick={addInfoNode}
                        className="flex flex-col items-center justify-center py-4 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all group"
                    >
                        <span className="text-xl group-hover:scale-110 transition-transform">+</span>
                        <span className="text-xs font-bold uppercase tracking-wider">Add Info Node</span>
                    </button>
                </div>
            </FormSection>
        </div>
    );
}
