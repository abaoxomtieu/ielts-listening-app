'use client';

import React from 'react';
import { IELTSListeningQuestion, UiHints } from '../types';
import FormCompletion from './completion/FormCompletion';
import NoteCompletion from './completion/NoteCompletion';
import TableCompletion from './completion/TableCompletion';
import SummaryCompletion from './completion/SummaryCompletion';
import FlowchartCompletion from './completion/FlowchartCompletion';
import SentenceCompletion from './completion/SentenceCompletion';
import { PeopleOpinions } from './matching/PeopleOpinions';
import { EventsInfo } from './matching/EventsInfo';
import { LocationsFeatures } from './matching/LocationsFeatures';
import { isCompletionQuestion, isMatchingQuestion, isSentenceCompletionQuestion, 
         isMultipleChoiceQuestion, isShortAnswerQuestion, isPlanMapDiagramQuestion } from '../types';
import SingleAnswerMultipleChoice from './multiple-choice/SingleAnswerMultipleChoice';
import MultipleAnswersMultipleChoice from './multiple-choice/MultipleAnswersMultipleChoice';
import ShortAnswer from './short-answer/ShortAnswer';
import PlanLabelling from './plan-map-diagram/PlanLabelling';
import MapLabelling from './plan-map-diagram/MapLabelling';
import DiagramLabelling from './plan-map-diagram/DiagramLabelling';

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
        <div className="p-4 bg-gray-100 border border-gray-300 rounded">
          <p className="text-sm text-black">
            Completion variant "{meta.variant}" component coming soon
          </p>
        </div>
        {showAnswers && <AnswerKeySection answerKey={answerKey} explanation={'explanation' in content ? content.explanation : undefined} />}
      </div>
    );
  }

  // Render Sentence Completion Questions
  if (isSentenceCompletionQuestion(data)) {
    const sentenceCompletionContent = data.content;

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

  // Render Multiple Choice Questions
  if (isMultipleChoiceQuestion(data)) {
    const rawContent = (data.content || {}) as any;
    const multipleChoiceContent = {
      questionText: rawContent?.questionText ?? 'Choose the correct answer.',
      instructions: rawContent?.instructions ?? '',
      options: Array.isArray(rawContent?.options) ? rawContent.options : [],
      answer: rawContent?.answer ?? (meta.variant === 'multiple_answers' ? { correctOptions: [], explanation: '' } : { correctOption: '', explanation: '' }),
      uiHints: rawContent?.uiHints ?? { displayType: meta.variant === 'multiple_answers' ? 'checkbox' : 'radio', showLetterLabels: true },
    };

    // Single Answer
    if (meta.variant === 'single_answer') {
      const singleContent = multipleChoiceContent as { questionText: string; options: Array<{ id: string; text: string }>; answer: { correctOption: string; explanation: string }; instructions?: string; uiHints: UiHints };
      return (
        <div>
          <SingleAnswerMultipleChoice
            questionText={singleContent.questionText}
            options={singleContent.options}
            questionNumber={meta.questionNumber}
            instructions={singleContent.instructions}
            answer={singleContent.answer}
            uiHints={singleContent.uiHints as { displayType: 'radio'; showLetterLabels: boolean }}
          />
          {showAnswers && <AnswerKeySection answerKey={answerKey} explanation={singleContent.answer.explanation} />}
        </div>
      );
    }

    // Multiple Answers
    if (meta.variant === 'multiple_answers') {
      const multiContent = multipleChoiceContent as { questionText: string; options: Array<{ id: string; text: string }>; answer: { correctOptions: string[]; explanation: string }; instructions?: string; uiHints: UiHints };
      return (
        <div>
          <MultipleAnswersMultipleChoice
            questionText={multiContent.questionText}
            options={multiContent.options}
            questionNumber={meta.questionNumber}
            instructions={multiContent.instructions}
            answer={multiContent.answer}
            uiHints={multiContent.uiHints as { displayType: 'checkbox'; maxSelectable?: number; minSelectable?: number; showLetterLabels: boolean }}
          />
          {showAnswers && <AnswerKeySection answerKey={answerKey} explanation={multiContent.answer.explanation} />}
        </div>
      );
    }

    // Fallback for unknown variant
    return (
      <div className="p-6 bg-white border-2 border-gray-300 rounded-lg">
        <h2 className="text-xl font-bold mb-4">{multipleChoiceContent.questionText}</h2>
        <div className="p-4 bg-gray-100 border border-gray-300 rounded">
          <p className="text-sm text-black">
            Multiple choice variant &quot;{meta.variant}&quot; component coming soon
          </p>
        </div>
        {showAnswers && <AnswerKeySection answerKey={answerKey} explanation={multipleChoiceContent.answer?.explanation} />}
      </div>
    );
  }

  // Render Short Answer Questions
  if (isShortAnswerQuestion(data)) {
    const rawContent = (content || {}) as any;
    const safeQuestions = Array.isArray(rawContent?.questions) ? rawContent.questions : [];
    const shortAnswerContent = {
      questionText: rawContent?.questionText ?? 'Answer the questions below.',
      instructions: rawContent?.instructions ?? 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      questions: safeQuestions,
      wordLimit: rawContent?.wordLimit ?? 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      uiHints: rawContent?.uiHints ?? { displayType: 'questions', showQuestionNumbers: true, inputType: 'text', caseSensitive: false },
    };
    return (
      <div>
        <ShortAnswer
          questionText={shortAnswerContent.questionText}
          instructions={shortAnswerContent.instructions}
          questions={shortAnswerContent.questions}
          wordLimit={shortAnswerContent.wordLimit}
          uiHints={shortAnswerContent.uiHints}
        />
        {showAnswers && <AnswerKeySection answerKey={answerKey} explanation={rawContent?.explanation} />}
      </div>
    );
  }

  // Render Plan/Map/Diagram Questions
  if (isPlanMapDiagramQuestion(data)) {
    const planMapContent = content as any;
    
    // Plan Labelling
    if (meta.variant === 'plan_labelling') {
      return (
        <div>
          <PlanLabelling
            data={data as any}
          />
          {showAnswers && <AnswerKeySection answerKey={answerKey} explanation={planMapContent.explanation} />}
        </div>
      );
    }

    // Map Labelling
    if (meta.variant === 'map_labelling') {
      return (
        <div>
          <MapLabelling
            data={data as any}
          />
          {showAnswers && <AnswerKeySection answerKey={answerKey} explanation={planMapContent.explanation} />}
        </div>
      );
    }

    // Diagram Labelling
    if (meta.variant === 'diagram_labelling') {
      return (
        <div>
          <DiagramLabelling
            data={data as any}
          />
          {showAnswers && <AnswerKeySection answerKey={answerKey} explanation={planMapContent.explanation} />}
        </div>
      );
    }

    // Fallback for unknown variant
    return (
      <div className="p-6 bg-white border-2 border-gray-300 rounded-lg">
        <h2 className="text-xl font-bold mb-4">{content.questionText}</h2>
        <div className="p-4 bg-gray-100 border border-gray-300 rounded">
          <p className="text-sm text-black">
            Plan/Map/Diagram variant "{meta.variant}" component coming soon
          </p>
        </div>
        {showAnswers && <AnswerKeySection answerKey={answerKey} explanation={planMapContent.explanation} />}
      </div>
    );
  }

  // Render Matching Questions (same UI as home: PeopleOpinions, EventsInfo, LocationsFeatures)
  if (isMatchingQuestion(data)) {
    const rawContent = (content || {}) as any;
    const safeContent = {
      ...rawContent,
      questionText: rawContent?.questionText ?? 'Match the following.',
      instructions: rawContent?.instructions ?? 'Choose your answers from the box.',
      questions: Array.isArray(rawContent?.questions) ? rawContent.questions : [],
      options: Array.isArray(rawContent?.options) ? rawContent.options : [],
    };
    const matchingData = {
      meta,
      content: safeContent,
      answerKey: answerKey || {},
    };

    if (meta.variant === 'events_info') {
      return (
        <div>
          <EventsInfo data={matchingData as any} disabled={false} />
          {showAnswers && <AnswerKeySection answerKey={answerKey} explanation={safeContent.answer?.explanation} />}
        </div>
      );
    }

    if (meta.variant === 'locations_features') {
      return (
        <div>
          <LocationsFeatures data={matchingData as any} disabled={false} />
          {showAnswers && <AnswerKeySection answerKey={answerKey} explanation={safeContent.answer?.explanation} />}
        </div>
      );
    }

    return (
      <div>
        <PeopleOpinions data={matchingData as any} disabled={false} />
        {showAnswers && <AnswerKeySection answerKey={answerKey} explanation={safeContent.answer?.explanation} />}
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

      <div className="p-4 bg-gray-100 border border-gray-300 rounded">
        <p className="text-sm text-black">
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
    <div className="mt-6 p-6 bg-gray-100 border-2 border-black rounded-lg">
      <h3 className="text-lg font-bold text-black mb-4 flex items-center">
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
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-black text-white text-sm font-bold rounded mr-3">
                {questionNum}
              </span>
              <div className="flex-1 pt-1">
                <span className="text-sm font-medium text-black">
                  {Array.isArray(answer) ? answer.join(', ') : answer}
                </span>
              </div>
            </div>
          ))}
      </div>

      {explanation && (
        <div className="mt-4 pt-4 border-t border-gray-300">
          <h4 className="text-sm font-semibold text-black mb-2">Explanation:</h4>
          <p className="text-sm text-black">{explanation}</p>
        </div>
      )}
    </div>
  );
}
