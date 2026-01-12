'use client';

import React, { useState, useEffect } from 'react';
import QuestionRenderer from '../components/QuestionRenderer';
import { IELTSListeningQuestion } from '../types';

interface MenuItem {
  id: string;
  title: string;
  description: string;
  category: string;
  section: number;
  filePath: string;
  questionType: string;
}

export default function Home() {
  const [selectedQuestion, setSelectedQuestion] = useState<IELTSListeningQuestion | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    // Load menu items from the question type examples
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      const items: MenuItem[] = [
        // Completion Examples
        {
          id: 'form-completion',
          title: 'Form Completion',
          description: 'Complete a conference registration form',
          category: 'Completion',
          section: 1,
          filePath: '/data/questionType/completion/form-completion.example.json',
          questionType: 'completion',
        },
        {
          id: 'note-completion',
          title: 'Note Completion',
          description: 'Complete lecture notes about study skills',
          category: 'Completion',
          section: 4,
          filePath: '/data/questionType/completion/note-completion.example.json',
          questionType: 'completion',
        },
        {
          id: 'table-completion',
          title: 'Table Completion',
          description: 'Complete a table with course information',
          category: 'Completion',
          section: 3,
          filePath: '/data/questionType/completion/table-completion.example.json',
          questionType: 'completion',
        },
        {
          id: 'summary-completion',
          title: 'Summary Completion',
          description: 'Complete a summary of a lecture',
          category: 'Completion',
          section: 4,
          filePath: '/data/questionType/completion/summary-completion.example.json',
          questionType: 'completion',
        },
        {
          id: 'flowchart-completion',
          title: 'Flowchart Completion',
          description: 'Complete a process flowchart',
          category: 'Completion',
          section: 4,
          filePath: '/data/questionType/completion/flowchart-completion.example.json',
          questionType: 'completion',
        },
        // Matching Examples
        {
          id: 'people-opinions',
          title: 'People Opinions',
          description: 'Match students to their opinions',
          category: 'Matching',
          section: 3,
          filePath: '/data/questionType/matching/people-opinions.example.json',
          questionType: 'matching',
        },
        {
          id: 'locations-features',
          title: 'Locations & Features',
          description: 'Match locations to their features',
          category: 'Matching',
          section: 2,
          filePath: '/data/questionType/matching/locations-features.example.json',
          questionType: 'matching',
        },
        {
          id: 'events-info',
          title: 'Events & Information',
          description: 'Match events to dates and details',
          category: 'Matching',
          section: 2,
          filePath: '/data/questionType/matching/events-info.example.json',
          questionType: 'matching',
        },
        // Multiple Choice Examples
        {
          id: 'single-answer',
          title: 'Single Answer',
          description: 'Choose one correct option',
          category: 'Multiple Choice',
          section: 3,
          filePath: '/data/questionType/multiple-choice/single-answer.example.json',
          questionType: 'multiple-choice',
        },
        {
          id: 'multiple-answers',
          title: 'Multiple Answers',
          description: 'Choose two correct options',
          category: 'Multiple Choice',
          section: 3,
          filePath: '/data/questionType/multiple-choice/multiple-answers.example.json',
          questionType: 'multiple-choice',
        },
        // Plan/Map/Diagram Examples
        {
          id: 'plan-labelling',
          title: 'Plan Labelling',
          description: 'Label parts of a building plan',
          category: 'Plan/Map/Diagram',
          section: 2,
          filePath: '/data/questionType/plan-map-diagram/plan-labelling.example.json',
          questionType: 'plan-map-diagram',
        },
        {
          id: 'map-labelling',
          title: 'Map Labelling',
          description: 'Label locations on a map',
          category: 'Plan/Map/Diagram',
          section: 2,
          filePath: '/data/questionType/plan-map-diagram/map-labelling.example.json',
          questionType: 'plan-map-diagram',
        },
        {
          id: 'diagram-labelling',
          title: 'Diagram Labelling',
          description: 'Label parts of a diagram',
          category: 'Plan/Map/Diagram',
          section: 4,
          filePath: '/data/questionType/plan-map-diagram/diagram-labelling.example.json',
          questionType: 'plan-map-diagram',
        },
        // Sentence Completion
        {
          id: 'sentence-completion',
          title: 'Sentence Completion',
          description: 'Complete sentences with missing words',
          category: 'Sentence Completion',
          section: 3,
          filePath: '/data/questionType/sentence-completion/sentence-completion.example.json',
          questionType: 'sentence-completion',
        },
        // Short Answer
        {
          id: 'short-answer',
          title: 'Short Answer',
          description: 'Write short answers to questions',
          category: 'Short Answer',
          section: 4,
          filePath: '/data/questionType/short-answer/short-answer.example.json',
          questionType: 'short-answer',
        },
      ];

      setMenuItems(items);

      // Load the first question by default
      if (items.length > 0) {
        await loadQuestion(items[0].filePath);
      }
    } catch (error) {
      console.error('Error loading menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadQuestion = async (filePath: string) => {
    try {
      setShowAnswers(false);
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`Failed to load question: ${response.statusText}`);
      }
      const data: IELTSListeningQuestion = await response.json();
      setSelectedQuestion(data);
    } catch (error) {
      console.error('Error loading question:', error);
    }
  };

  const categories = ['all', ...Array.from(new Set(menuItems.map((item) => item.category)))];

  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter((item) => item.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Completion': 'bg-gray-200 text-black',
      'Matching': 'bg-gray-200 text-black',
      'Multiple Choice': 'bg-gray-200 text-black',
      'Plan/Map/Diagram': 'bg-gray-200 text-black',
      'Sentence Completion': 'bg-gray-200 text-black',
      'Short Answer': 'bg-gray-200 text-black',
    };
    return colors[category] || 'bg-gray-200 text-black';
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside
        className={`
          ${sidebarOpen ? 'w-80' : 'w-0'}
          transition-all duration-300 ease-in-out
          bg-white border-r border-gray-200
          overflow-hidden flex flex-col
        `}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 bg-white">
          <h1 className="text-xl font-bold text-black mb-1">IELTS Listening</h1>
          <p className="text-sm text-gray-600">Question Type Examples</p>
        </div>

        {/* Category Filter */}
        <div className="p-4 border-b border-gray-200">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
            Filter by Category
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-3 py-1 text-xs font-medium rounded-full transition-colors
                  ${selectedCategory === category
                    ? 'bg-black text-white'
                    : 'bg-gray-200 text-black hover:bg-gray-300'
                  }
                `}
              >
                {category === 'all' ? 'All Types' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => loadQuestion(item.filePath)}
                  className={`
                    w-full text-left p-4 rounded-lg border-2 transition-all
                    hover:shadow-md
                    ${selectedQuestion?.meta.variant === item.id
                      ? 'border-black bg-gray-100'
                      : 'border-gray-200 bg-white hover:border-gray-400'
                    }
                  `}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-bold text-gray-900">{item.title}</span>
                    <span className={`
                      px-2 py-1 text-xs font-medium rounded-full
                      ${getCategoryColor(item.category)}
                    `}>
                      {item.section}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>
                </button>
              ))}
            </div>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Select a question type to view the example
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Toggle sidebar"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {sidebarOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  )}
                </svg>
              </button>

              {selectedQuestion && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {selectedQuestion.content.questionText}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Section {selectedQuestion.meta.section} • {selectedQuestion.meta.variant?.replace('_', ' ')}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Admin Link */}
              <a
                href="/admin"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg font-medium text-sm transition-colors"
              >
                🔧 Admin
              </a>

              {/* Show/Hide Answers Toggle */}
              <button
                onClick={() => setShowAnswers(!showAnswers)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
                  ${showAnswers
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'bg-gray-200 text-black hover:bg-gray-300'
                  }
                `}
              >
                {showAnswers ? (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Hide Answers
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    Show Answers
                  </>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Question Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedQuestion ? (
            <div className="max-w-5xl mx-auto">
              <QuestionRenderer data={selectedQuestion} showAnswers={showAnswers} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="mb-4">
                  <svg
                    className="w-16 h-16 mx-auto text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Select a Question Type
                </h3>
                <p className="text-sm text-gray-600">
                  Choose a question type from the sidebar to view the example
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
