'use client';

import React from 'react';
import { IELTSListeningQuestion } from '../types';
import { isCompletionQuestion, isMatchingQuestion, isSentenceCompletionQuestion } from '../types';
import FormCompletion from './completion/FormCompletion';
import NoteCompletion from './completion/NoteCompletion';
import TableCompletion from './completion/TableCompletion';
import SummaryCompletion from './completion/SummaryCompletion';
import FlowchartCompletion from './completion/FlowchartCompletion';
import SentenceCompletion from './completion/SentenceCompletion';
import { PeopleOpinions } from './matching/PeopleOpinions';
import { EventsInfo } from './matching/EventsInfo';
import { LocationsFeatures } from './matching/LocationsFeatures';

interface QuestionRendererProps {
  data: IELTSListeningQuestion;
  showAnswers?: boolean;
}

export default function QuestionRenderer({ data, showAnswers = false }: QuestionRendererProps) {
  const { meta, content, answerKey: dataAnswerKey } = data;
  const answerKey = dataAnswerKey as Record<string, string | string[]>;

  // Render Completion Questions
  if (isCompletionQuestion(data)) {
    // Form Completion
    if (meta.variant === 'form_completion' && 'formData' in content) {
      return (
        <div>
          <FormCompletion
            questionText={content.questionText}
            instructions={content.instructions}
            formData={content.formData}
            wordLimit={content.wordLimit || ''}
            questionNumber={meta.questionNumber}
            showFieldNumbers={content.uiHints?.showFieldNumbers}
          />
          {showAnswers && <AnswerKeySection answerKey={answerKey} explanation={content.explanation} />}
        </div>
      );
    }

    // Note Completion
    if (meta.variant === 'note_completion' && 'notes' in content) {
      return (
        <div>
          <NoteCompletion
            questionText={content.questionText}
            instructions={content.instructions}
            notes={content.notes}
            wordLimit={content.wordLimit || ''}
            questionNumber={meta.questionNumber}
            showSectionHeadings={content.uiHints?.showSectionHeadings}
            showBulletPoints={content.uiHints?.showBulletPoints}
          />
          {showAnswers && <AnswerKeySection answerKey={answerKey} explanation={content.explanation} />}
        </div>
      );
    }

    // Table Completion
    if (meta.variant === 'table_completion' && 'table' in content) {
      return (
        <div>
          <TableCompletion
            questionText={content.questionText}
            instructions={content.instructions}
            table={content.table}
            wordLimit={content.wordLimit || ''}
            questionNumber={meta.questionNumber}
            showRowNumbers={content.uiHints?.showRowNumbers}
            showColumnHeaders={content.uiHints?.showColumnHeaders}
          />
          {showAnswers && <AnswerKeySection answerKey={answerKey} explanation={content.explanation} />}
        </div>
      );
    }

    // Summary Completion
    if (meta.variant === 'summary_completion' && 'summary' in content) {
      return (
        <div>
          <SummaryCompletion
            questionText={content.questionText}
            instructions={content.instructions}
            summary={content.summary}
            wordLimit={content.validation?.wordLimit || ''}
            questionNumber={meta.questionNumber}
            options={content.options}
            showOptions={content.uiHints?.showOptions}
            dropdownForBlanks={content.uiHints?.dropdownForBlanks}
          />
          {showAnswers && <AnswerKeySection answerKey={answerKey} explanation={content.explanation} />}
        </div>
      );
    }

    // Flowchart Completion
    if (meta.variant === 'flowchart_completion' && 'flowchart' in content) {
      return (
        <div>
          <FlowchartCompletion
            questionText={content.questionText}
            instructions={content.instructions}
            flowchart={content.flowchart}
            wordLimit={content.validation?.wordLimit || ''}
            questionNumber={meta.questionNumber}
            showArrows={content.uiHints?.showArrows}
            verticalLayout={content.uiHints?.verticalLayout}
          />
          {showAnswers && <AnswerKeySection answerKey={answerKey} explanation={content.explanation} />}
        </div>
      );
    }

    // Other completion variants can be added here
    return (
      <div className="p-6 bg-white border-2 border-gray-300 rounded-lg">
        <h2 className="text-xl font-bold mb-4">{content.questionText}</h2>
        {'instructions' in content && <p className="text-sm text-gray-600 mb-4">{content.instructions}</p>}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            Completion variant "{meta.variant}" component coming soon
          </p>
        </div>
        {showAnswers && <AnswerKeySection answerKey={answerKey} explanation={'explanation' in content ? content.explanation : undefined} />}
      </div>
    );
  }

  // Render Sentence Completion Questions
  if (isSentenceCompletionQuestion(data)) {
    const sentenceCompletionContent = content as any;
    return (
      <div>
        <SentenceCompletion
          questionText={sentenceCompletionContent.questionText}
          instructions={sentenceCompletionContent.instructions}
          sentences={sentenceCompletionContent.sentences}
          wordLimit={sentenceCompletionContent.wordLimit || ''}
          questionNumber={meta.questionNumber}
          showSentenceNumbers={sentenceCompletionContent.uiHints?.showSentenceNumbers}
        />
        {showAnswers && <AnswerKeySection answerKey={answerKey} explanation={sentenceCompletionContent.explanation} />}
      </div>
    );
  }

  // Render Matching Questions
  if (isMatchingQuestion(data)) {
    // Events Info
    if (meta.variant === 'events_info') {
      return (
        <div>
          <EventsInfo
            data={data as any}
            disabled={false}
          />
          {showAnswers && <AnswerKeySection answerKey={answerKey} explanation={content.answer?.explanation} />}
        </div>
      );
    }

    // Locations Features
    if (meta.variant === 'locations_features') {
      return (
        <div>
          <LocationsFeatures
            data={data as any}
            disabled={false}
          />
          {showAnswers && <AnswerKeySection answerKey={answerKey} explanation={content.answer?.explanation} />}
        </div>
      );
    }

    // People Opinions (default)
    return (
      <div>
        <PeopleOpinions
          data={data as any}
          disabled={false}
        />
        {showAnswers && <AnswerKeySection answerKey={answerKey} explanation={content.answer?.explanation} />}
      </div>
    );
  }

  // Render other question types (placeholder for now)
  return (
    <div className="p-6 bg-white border-2 border-gray-300 rounded-lg">
      <div className="mb-4 pb-4 border-b-2 border-gray-400">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">
            Section {meta.section}
          </span>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {meta.questionType?.replace('_', ' ')}
          </span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">{content.questionText}</h2>
        {'instructions' in content && content.instructions && (
          <p className="text-sm font-semibold text-gray-700">{content.instructions}</p>
        )}
      </div>

      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-sm text-yellow-800">
          Question type "{meta.questionType}" component coming soon
        </p>
      </div>

      {showAnswers && <AnswerKeySection answerKey={answerKey} explanation={content.answer?.explanation} />}
    </div>
  );
}

// Answer Key Section Component
interface AnswerKeySectionProps {
  answerKey: Record<string, string | string[]>;
  explanation?: string;
}

function AnswerKeySection({ answerKey, explanation }: AnswerKeySectionProps) {
  return (
    <div className="mt-6 p-6 bg-green-50 border-2 border-green-300 rounded-lg">
      <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Answer Key
      </h3>

      <div className="space-y-2">
        {Object.entries(answerKey)
          .sort(([a], [b]) => parseInt(a) - parseInt(b))
          .map(([questionNum, answer]) => (
            <div key={questionNum} className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-green-600 text-white text-sm font-bold rounded mr-3">
                {questionNum}
              </span>
              <div className="flex-1 pt-1">
                <span className="text-sm font-medium text-green-900">
                  {Array.isArray(answer) ? answer.join(', ') : answer}
                </span>
              </div>
            </div>
          ))}
      </div>

      {explanation && (
        <div className="mt-4 pt-4 border-t border-green-200">
          <h4 className="text-sm font-semibold text-green-900 mb-2">Explanation:</h4>
          <p className="text-sm text-green-800">{explanation}</p>
        </div>
      )}
    </div>
  );
}
