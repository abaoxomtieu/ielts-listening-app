export interface MatchingQuestion {
  id: number;
  text: string;
}

export interface MatchingOption {
  id: string;
  text: string;
}

export interface MatchingContent {
  questionText: string;
  questions: MatchingQuestion[];
  options: MatchingOption[];
  instructions: string;
  answer?: {
    matches: Array<{
      questionId: number;
      optionId: string;
    }>;
    explanation: string;
  };
}

export interface MatchingData {
  meta: {
    questionType: string;
    variant: string;
    section: number;
    questionNumber: number;
    difficulty: string;
  };
  content: MatchingContent;
  answerKey: Record<string, string>;
}
