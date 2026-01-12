'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import FormCompletionBuilder from '@/components/admin/FormCompletionBuilder';
import NoteCompletionBuilder from '@/components/admin/NoteCompletionBuilder';
import TableCompletionBuilder from '@/components/admin/TableCompletionBuilder';
import SummaryCompletionBuilder from '@/components/admin/SummaryCompletionBuilder';
import FlowchartCompletionBuilder from '@/components/admin/FlowchartCompletionBuilder';
import MatchingBuilder from '@/components/admin/MatchingBuilder';
import SingleAnswerMCQBuilder from '@/components/admin/SingleAnswerMCQBuilder';
import MultipleAnswersMCQBuilder from '@/components/admin/MultipleAnswersMCQBuilder';
import SentenceCompletionBuilder from '@/components/admin/SentenceCompletionBuilder';
import ShortAnswerBuilder from '@/components/admin/ShortAnswerBuilder';
import PlanMapDiagramBuilder from '@/components/admin/PlanMapDiagramBuilder';

const builderMap: Record<string, React.ComponentType> = {
  'form_completion': FormCompletionBuilder,
  'note_completion': NoteCompletionBuilder,
  'table_completion': TableCompletionBuilder,
  'summary_completion': SummaryCompletionBuilder,
  'flowchart_completion': FlowchartCompletionBuilder,
  'matching': MatchingBuilder,
  'single_answer': SingleAnswerMCQBuilder,
  'multiple_answers': MultipleAnswersMCQBuilder,
  'sentence_completion': SentenceCompletionBuilder,
  'short_answer': ShortAnswerBuilder,
  'plan_map_diagram': PlanMapDiagramBuilder,
};

const questionTypeOptions = [
  { value: '', label: '-- Select Type --', disabled: false, group: '' },
  { value: 'form_completion', label: 'Form Completion', disabled: false, group: 'completion' },
  { value: 'note_completion', label: 'Note Completion', disabled: false, group: 'completion' },
  { value: 'table_completion', label: 'Table Completion', disabled: false, group: 'completion' },
  { value: 'summary_completion', label: 'Summary Completion', disabled: false, group: 'completion' },
  { value: 'flowchart_completion', label: 'Flowchart Completion', disabled: false, group: 'completion' },
  { value: 'sentence_completion', label: 'Sentence Completion', disabled: false, group: 'completion' },
  { value: 'short_answer', label: 'Short Answer', disabled: false, group: 'completion' },
  { value: 'single_answer', label: 'Single Answer MCQ', disabled: false, group: 'multiple_choice' },
  { value: 'multiple_answers', label: 'Multiple Answers MCQ', disabled: false, group: 'multiple_choice' },
  { value: 'matching', label: 'Matching', disabled: false, group: 'other' },
  { value: 'plan_map_diagram', label: 'Plan/Map/Diagram', disabled: false, group: 'other' },
];

export default function AdminPage() {
  const [selectedType, setSelectedType] = useState<string>('');

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
  };

  const renderOptions = () => {
    const options: React.ReactNode[] = [];
    let lastGroup: string | null = null;

    for (const option of questionTypeOptions) {
      if (option.group && option.group !== lastGroup) {
        lastGroup = option.group;
        const groupLabel = option.group === 'completion' ? '━━━ Completion ━━━' : 
                          option.group === 'multiple_choice' ? '━━━ Multiple Choice ━━━' : '━━━ Other ━━━';
        options.push(
          <option key={`group-${option.group}`} disabled className="font-bold">
            {groupLabel}
          </option>
        );
      }

      if (option.value && !option.disabled) {
        options.push(
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        );
      }
    }

    return options;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">IELTS Admin</h1>
              <p className="text-gray-600 mt-1">Question Builder</p>
            </div>
            <Link href="/" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg">
              Demo
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded shadow overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50">
                <h2 className="font-bold">Question Type</h2>
              </div>
              <div className="p-4">
                <label htmlFor="question-type-select" className="block text-sm font-medium mb-2">
                  Select Question Type
                </label>
                <select
                  id="question-type-select"
                  value={selectedType}
                  onChange={handleTypeChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black"
                >
                  {renderOptions()}
                </select>
              </div>
              <div className="p-4 bg-gray-50 border-t">
                <p className="text-sm">Select a question type to start building.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedType && builderMap[selectedType] ? (
              <div className="bg-white rounded shadow">
                <div className="px-6 py-4 border-b bg-gray-50">
                  <h2 className="font-bold capitalize">{selectedType.replace(/_/g, ' ')}</h2>
                </div>
                <div className="p-6">
                  {React.createElement(builderMap[selectedType])}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded shadow p-12 text-center">
                <h2 className="text-xl font-bold mb-4">Select a Question Type</h2>
                <p className="text-gray-600 mb-6">Choose from the left panel to begin.</p>
                <div className="text-sm text-gray-500">
                  <p className="mb-2">Available types:</p>
                  <ul className="space-y-1 ml-4 inline-block text-left">
                    <li>Form Completion</li>
                    <li>Note Completion</li>
                    <li>Table Completion</li>
                    <li>Summary Completion</li>
                    <li>Flowchart Completion</li>
                    <li>Sentence Completion</li>
                    <li>Short Answer</li>
                    <li>Single Answer MCQ</li>
                    <li>Multiple Answers MCQ</li>
                    <li>Matching</li>
                    <li>Plan/Map/Diagram</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
