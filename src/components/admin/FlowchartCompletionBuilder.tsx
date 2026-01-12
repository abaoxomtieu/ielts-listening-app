'use client';

import React, { useState } from 'react';
import { FormSection, FormField, AudioTimeRange } from './FormBuilder';

interface FlowchartNode {
  id: number;
  text: string;
  answer: string;
  position: { x: number; y: number };
  audioTimeRange: { start: string; end: string };
}

interface FlowchartCompletionBuilderData {
  meta: any;
  content: {
    questionText: string;
    instructions: string;
    flowchart: {
      title: string;
      startNode: {
        id: string;
        text: string;
        position: { x: number; y: number };
      };
      nodes: FlowchartNode[];
      endNode: {
        id: string;
        text: string;
        position: { x: number; y: number };
      };
      connections: { from: string | number; to: string | number }[];
    };
    wordLimit: string;
    answer: Record<string, string>;
    explanation: string;
    audioTimeRange: { start: string; end: string };
    media: any;
    uiHints: any;
    validation: any;
  };
  answerKey: Record<string, string>;
  scoring: any;
}

export default function FlowchartCompletionBuilder() {
  const [questionText, setQuestionText] = useState<string>('Complete the flow chart below. Write');
  const [instructions, setInstructions] = useState<string>('NO MORE THAN THREE WORDS');
  const [flowchartTitle, setFlowchartTitle] = useState<string>('');
  const [wordLimit, setWordLimit] = useState<string>('NO MORE THAN THREE WORDS');
  const [startNodeText, setStartNodeText] = useState<string>('Start');
  const [endNodeText, setEndNodeText] = useState<string>('End');
  const [nodes, setNodes] = useState<FlowchartNode[]>([]);
  const [audioTimeRange, setAudioTimeRange] = useState({ start: '00:00', end: '00:00' });
  const [difficulty, setDifficulty] = useState<string>('hard');
  const [section, setSection] = useState<number>(4);

  const addNode = () => {
    const newNode: FlowchartNode = {
      id: Date.now(),
      text: '',
      answer: '',
      position: { x: 50, y: 150 + nodes.length * 100 },
      audioTimeRange: { start: '00:00', end: '00:00' },
    };
    setNodes([...nodes, newNode]);
  };

  const updateNode = (id: number, updates: Partial<FlowchartNode>) => {
    setNodes(nodes.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const removeNode = (id: number) => {
    setNodes(nodes.filter(n => n.id !== id));
  };

  const generateJSON = (): string => {
    const answerKey: Record<string, string> = {};
    nodes.forEach((node, idx) => {
      answerKey[String(idx + 31)] = node.answer;
    });

    const connections = [];
    connections.push({ from: 'start', to: nodes.length > 0 ? 31 : 'end' });
    for (let i = 0; i < nodes.length; i++) {
      const currentId = i + 31;
      const nextId = i < nodes.length - 1 ? i + 32 : 'end';
      connections.push({ from: currentId, to: nextId });
    }

    const data: FlowchartCompletionBuilderData = {
      meta: {
        questionType: 'completion',
        variant: 'flowchart_completion',
        section: section,
        questionNumber: 31,
        difficulty: difficulty,
        version: '1.0',
        createdAt: new Date().toISOString(),
      },
      content: {
        questionText,
        instructions,
        flowchart: {
          title: flowchartTitle,
          startNode: {
            id: 'start',
            text: startNodeText,
            position: { x: 50, y: 50 },
          },
          nodes: nodes.map((n, idx) => ({
            ...n,
            id: idx + 31,
            position: { x: 50, y: 150 + idx * 100 },
          })),
          endNode: {
            id: 'end',
            text: endNodeText,
            position: { x: 50, y: 150 + nodes.length * 100 },
          },
          connections,
        },
        wordLimit,
        answer: answerKey,
        explanation: '',
        audioTimeRange,
        media: {
          image: null,
          audio: '/audio/section4.mp3',
        },
        uiHints: {
          displayType: 'flowchart',
          showArrows: true,
          verticalLayout: true,
          editableNodes: true,
        },
        validation: {
          minQuestions: 3,
          maxQuestions: 8,
          wordLimit,
        },
      },
      answerKey,
      scoring: {
        points: 1,
        partialCredit: false,
        penaltyForWrong: 0,
      },
    };

    return JSON.stringify(data, null, 2);
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-xl shadow-lg">
      <FormSection title="Question Information">
        <FormField
          label="Question Text"
          value={questionText}
          onChange={setQuestionText}
          placeholder="Complete the flow chart below. Write"
        />
        <FormField
          label="Instructions"
          value={instructions}
          onChange={setInstructions}
          placeholder="NO MORE THAN THREE WORDS"
        />
        <FormField
          label="Flowchart Title"
          value={flowchartTitle}
          onChange={setFlowchartTitle}
          placeholder="RESEARCH PROJECT PROCESS"
        />
        <FormField
          label="Word Limit"
          value={wordLimit}
          onChange={setWordLimit}
          placeholder="NO MORE THAN THREE WORDS"
        />
        <AudioTimeRange value={audioTimeRange} onChange={setAudioTimeRange} />
        <div className="grid grid-cols-3 gap-4">
          <FormField
            label="Section"
            type="number"
            value={section}
            onChange={(v) => setSection(Number(v))}
            placeholder="4"
          />
          <FormField
            label="Difficulty"
            type="select"
            value={difficulty}
            onChange={setDifficulty}
            options={[
              { value: 'easy', label: 'Easy' },
              { value: 'medium', label: 'Medium' },
              { value: 'hard', label: 'Hard' },
            ]}
          />
        </div>
      </FormSection>

      <FormSection title="Flowchart Nodes">
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-3">Start Node</h4>
          <FormField
            label="Start Text"
            value={startNodeText}
            onChange={setStartNodeText}
            placeholder="Start"
          />
        </div>

        <div className="mb-3">
          <button
            onClick={addNode}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
          >
            + Add Node
          </button>
        </div>

        <div className="space-y-4">
          {nodes.map((node, index) => (
            <div key={node.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-700">Node {index + 31}</span>
                <button
                  onClick={() => removeNode(node.id)}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors"
                >
                  Remove Node
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Node Text (use [______] for blank)
                  </label>
                  <input
                    type="text"
                    value={node.text}
                    onChange={(e) => updateNode(node.id, { text: e.target.value })}
                    placeholder="Conduct [______]"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-colors"
                  />
                </div>
                <FormField
                  label="Answer"
                  value={node.answer}
                  onChange={(val) => updateNode(node.id, { answer: val })}
                  placeholder="literature review"
                />
              </div>
              <div className="mt-3">
                <AudioTimeRange
                  value={node.audioTimeRange}
                  onChange={(val) => updateNode(node.id, { audioTimeRange: val })}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-medium text-green-900 mb-3">End Node</h4>
          <FormField
            label="End Text"
            value={endNodeText}
            onChange={setEndNodeText}
            placeholder="End"
          />
        </div>
      </FormSection>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Generated JSON Preview</h3>
        <pre className="text-xs bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto max-h-64">
          {generateJSON()}
        </pre>
      </div>
    </div>
  );
}
