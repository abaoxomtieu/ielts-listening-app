import { UiHints, Validation } from '@/types';
import { AudioTimeRange, Media, Meta, Scoring } from './completion';

export interface MatchingQuestionData {
    id: number;
    text: string;
}

export interface MatchingOptionData {
    id: string; // A, B, C...
    text: string;
}

export interface MatchingMatch {
    questionId: number;
    optionId: string;
}

export interface MatchingAnswer {
    matches: MatchingMatch[];
    explanation: string;
}

export interface MatchingContent {
    questionText: string;
    instructions: string;
    questions: MatchingQuestionData[];
    options: MatchingOptionData[];
    answer: MatchingAnswer;
    audioTimeRange: AudioTimeRange;
    media: Media;
    uiHints: any;
    validation: Validation;
}

export interface MatchingData {
    meta: Meta;
    content: MatchingContent;
    answerKey: Record<string, string>;
    scoring: Scoring;
}
