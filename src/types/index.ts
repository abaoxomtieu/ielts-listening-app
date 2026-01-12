// ============================================
// IELTS Listening Question Type Definitions
// ============================================

// ============================================
// BASE TYPES
// ============================================

/**
 * Metadata for a question or test
 */
export interface Meta {
  questionType?: QuestionType;
  variant?: string;
  section: number;
  questionNumber: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  version?: string;
  createdAt?: string;
  testId?: string;
  testName?: string;
  totalQuestions?: number;
  totalTime?: string;
  transferTime?: string;
}

/**
 * Question type categories
 */
export type QuestionType =
  | 'completion'
  | 'matching'
  | 'multiple_choice'
  | 'plan_map_diagram'
  | 'short_answer'
  | 'sentence_completion';

/**
 * Answer key mapping question IDs to answers
 */
export type AnswerKey = Record<string, string | string[]>;

/**
 * Scoring information for a question
 */
export interface Scoring {
  points: number;
  partialCredit?: boolean;
  penaltyForWrong?: number;
}

/**
 * Media resources (audio and images)
 */
export interface Media {
  image: string | null;
  audio: string;
}

/**
 * UI hints for rendering questions
 */
export interface UiHints {
  displayType: string;
  showFieldNumbers?: boolean;
  inlineValidation?: boolean;
  showSectionHeadings?: boolean;
  showBulletPoints?: boolean;
  inlineInputs?: boolean;
  showRowNumbers?: boolean;
  showColumnHeaders?: boolean;
  editableCells?: boolean;
  showOptions?: boolean;
  dropdownForBlanks?: boolean;
  shuffleOptions?: boolean;
  showLetterLabels?: boolean;
  layout?: string;
  showNumberedLabels?: boolean;
  alphabeticalOptions?: string[];
  dragAndDrop?: boolean;
  showArrows?: boolean;
  verticalLayout?: boolean;
  editableNodes?: boolean;
  showQuestionNumbers?: boolean;
  inputType?: string;
  caseSensitive?: boolean;
  showSentenceNumbers?: boolean;
  zoomEnabled?: boolean;
  showProcessFlow?: boolean;
  maxSelectable?: number;
  minSelectable?: number;
}

/**
 * Validation rules for questions
 */
export interface Validation {
  minFields?: number;
  maxFields?: number;
  minQuestions?: number;
  maxQuestions?: number;
  minOptions?: number;
  maxOptions?: number;
  wordLimit?: string | null;
  eachOptionUsedOnce?: boolean;
  required?: boolean;
  minCorrectRequired?: number;
}

/**
 * Audio time range for questions or parts
 */
export interface AudioTimeRange {
  start: string;
  end: string;
}

// ============================================
// COMPLETION TYPES
// ============================================

/**
 * Form field definition
 */
export interface FormField {
  id: number;
  label: string;
  placeholder?: string;
  inputType: 'text' | 'email' | 'tel' | 'number' | 'select' | 'date';
  required: boolean;
  answer: string;
  audioTimeRange: AudioTimeRange;
  options?: string[];
}

/**
 * Form data structure
 */
export interface FormData {
  formTitle: string;
  formType?: string;
  fields: FormField[];
}

/**
 * Form completion question content
 */
export interface FormCompletionContent {
  questionText: string;
  instructions: string;
  formData: FormData;
  wordLimit: string;
  answer: Record<string, string>;
  explanation: string;
  audioTimeRange: AudioTimeRange;
  media: Media;
  uiHints: UiHints;
  validation: Validation;
}

/**
 * Full form completion question
 */
export interface FormCompletion {
  meta: Meta;
  content: FormCompletionContent;
  answerKey: AnswerKey;
  scoring: Scoring;
}

/**
 * Note bullet point
 */
export interface NoteBulletPoint {
  id: number;
  text: string;
  answer: string;
}

/**
 * Note section
 */
export interface NoteSection {
  heading: string;
  bulletPoints: NoteBulletPoint[];
}

/**
 * Notes data structure
 */
export interface Notes {
  title: string;
  speaker?: string;
  date?: string;
  sections: NoteSection[];
}

/**
 * Note completion question content
 */
export interface NoteCompletionContent {
  questionText: string;
  instructions: string;
  notes: Notes;
  wordLimit: string;
  answer: Record<string, string>;
  explanation: string;
  audioTimeRange: AudioTimeRange;
  media: Media;
  uiHints: UiHints;
  validation: Validation;
}

/**
 * Full note completion question
 */
export interface NoteCompletion {
  meta: Meta;
  content: NoteCompletionContent;
  answerKey: AnswerKey;
  scoring: Scoring;
}

/**
 * Table cell
 */
export interface TableCell {
  value: string;
  isEditable: boolean;
  answer?: string;
  audioTimeRange?: AudioTimeRange;
}

/**
 * Table row
 */
export interface TableRow {
  id: number;
  cells: TableCell[];
}

/**
 * Table data structure
 */
export interface Table {
  title: string;
  headers: string[];
  rows: TableRow[];
}

/**
 * Table completion question content
 */
export interface TableCompletionContent {
  questionText: string;
  instructions: string;
  table: Table;
  wordLimit: string;
  answer: Record<string, string>;
  explanation: string;
  audioTimeRange: AudioTimeRange;
  media: Media;
  uiHints: UiHints;
  validation: Validation;
}

/**
 * Full table completion question
 */
export interface TableCompletion {
  meta: Meta;
  content: TableCompletionContent;
  answerKey: AnswerKey;
  scoring: Scoring;
}

/**
 * Summary blank
 */
export interface SummaryBlank {
  id: number;
  position: number;
  answer: string;
  audioTimeRange: AudioTimeRange;
}

/**
 * Summary data structure
 */
export interface Summary {
  text: string;
  blanks: SummaryBlank[];
}

/**
 * Summary option
 */
export interface SummaryOption {
  id: string;
  text: string;
}

/**
 * Summary completion question content
 */
export interface SummaryCompletionContent {
  questionText: string;
  instructions: string;
  summary: Summary;
  options: SummaryOption[];
  answer: Record<string, string>;
  answerLabels: Record<string, string>;
  explanation: string;
  audioTimeRange: AudioTimeRange;
  media: Media;
  uiHints: UiHints;
  validation: Validation;
}

/**
 * Full summary completion question
 */
export interface SummaryCompletion {
  meta: Meta;
  content: SummaryCompletionContent;
  answerKey: AnswerKey;
  scoring: Scoring;
}

/**
 * Flowchart node position
 */
export interface NodePosition {
  x: number;
  y: number;
}

/**
 * Flowchart node
 */
export interface FlowchartNode {
  id: number;
  text: string;
  answer: string;
  position: NodePosition;
  audioTimeRange: AudioTimeRange;
}

/**
 * Flowchart start/end node
 */
export interface FlowchartTerminalNode {
  id: string;
  text: string;
  position: NodePosition;
}

/**
 * Flowchart connection
 */
export interface FlowchartConnection {
  from: string | number;
  to: string | number;
}

/**
 * Flowchart data structure
 */
export interface Flowchart {
  title: string;
  startNode: FlowchartTerminalNode;
  nodes: FlowchartNode[];
  endNode: FlowchartTerminalNode;
  connections: FlowchartConnection[];
}

/**
 * Flowchart completion question content
 */
export interface FlowchartCompletionContent {
  questionText: string;
  instructions: string;
  flowchart: Flowchart;
  wordLimit: string;
  answer: Record<string, string>;
  explanation: string;
  audioTimeRange: AudioTimeRange;
  media: Media;
  uiHints: UiHints;
  validation: Validation;
}

/**
 * Full flowchart completion question
 */
export interface FlowchartCompletion {
  meta: Meta;
  content: FlowchartCompletionContent;
  answerKey: AnswerKey;
  scoring: Scoring;
}

// ============================================
// MATCHING TYPES
// ============================================

/**
 * Matching question item
 */
export interface MatchingQuestion {
  id: number;
  text: string;
}

/**
 * Matching option
 */
export interface MatchingOption {
  id: string;
  text: string;
}

/**
 * Matching answer
 */
export interface MatchingAnswer {
  matches: MatchingMatch[];
  explanation: string;
}

/**
 * Individual matching pair
 */
export interface MatchingMatch {
  questionId: number;
  optionId: string;
}

/**
 * Base matching question content
 */
export interface MatchingContent {
  questionText: string;
  questions: MatchingQuestion[];
  options: MatchingOption[];
  answer: MatchingAnswer;
  instructions: string;
  wordLimit: null;
  audioTimeRange: AudioTimeRange;
  media: Media;
  uiHints: UiHints;
  validation: Validation;
}

/**
 * Full matching question (people opinions)
 */
export interface PeopleOpinions {
  meta: Meta;
  content: MatchingContent;
  answerKey: AnswerKey;
  scoring: Scoring;
}

/**
 * Full matching question (events/info)
 */
export interface EventsInfo {
  meta: Meta;
  content: MatchingContent;
  answerKey: AnswerKey;
  scoring: Scoring;
}

/**
 * Full matching question (locations/features)
 */
export interface LocationsFeatures {
  meta: Meta;
  content: MatchingContent;
  answerKey: AnswerKey;
  scoring: Scoring;
}

// ============================================
// MULTIPLE CHOICE TYPES
// ============================================

/**
 * Multiple choice option
 */
export interface MultipleChoiceOption {
  id: string;
  text: string;
}

/**
 * Single answer choice content
 */
export interface SingleAnswerContent {
  questionText: string;
  options: MultipleChoiceOption[];
  answer: {
    correctOption: string;
    explanation: string;
  };
  wordLimit: null;
  audioTimeRange: AudioTimeRange;
  media: Media;
  uiHints: UiHints;
  validation: Validation;
}

/**
 * Full single answer multiple choice question
 */
export interface SingleAnswerMultipleChoice {
  meta: Meta;
  content: SingleAnswerContent;
  answerKey: string;
  scoring: Scoring;
}

/**
 * Multiple answers choice content
 */
export interface MultipleAnswersContent {
  questionText: string;
  options: MultipleChoiceOption[];
  answer: {
    correctOptions: string[];
    explanation: string;
  };
  instructions?: string;
  wordLimit: null;
  audioTimeRange: AudioTimeRange;
  media: Media;
  uiHints: UiHints;
  validation: Validation;
}

/**
 * Full multiple answers multiple choice question
 */
export interface MultipleAnswersMultipleChoice {
  meta: Meta;
  content: MultipleAnswersContent;
  answerKey: string[];
  scoring: Scoring;
}

// ============================================
// PLAN/MAP/DIAGRAM TYPES
// ============================================

/**
 * Image hotspot
 */
export interface ImageHotspot {
  id: number;
  x: number;
  y: number;
  label: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  marker?: string;
  connector?: string;
}

/**
 * Image data
 */
export interface QuestionImage {
  url: string;
  altText: string;
  width?: number;
  height?: number;
  hotspots?: ImageHotspot[];
}

/**
 * Plan/map/diagram question item
 */
export interface PlanQuestion {
  id: number;
  text: string;
}

/**
 * Directions vocabulary for map labelling
 */
export interface DirectionsVocabulary {
  startingPoint: string;
  keyPhrases: string[];
}

/**
 * Process flow step for diagram
 */
export interface ProcessFlowStep {
  step: number;
  description: string;
}

/**
 * Base plan/map/diagram content
 */
export interface PlanMapDiagramContent {
  questionText: string;
  image: QuestionImage;
  questions: PlanQuestion[];
  answer: Record<string, string>;
  answerLabels: Record<string, string>;
  explanation: string;
  instructions: string;
  wordLimit: null;
  audioTimeRange: AudioTimeRange;
  media: Media;
  uiHints: UiHints;
  validation: Validation;
  directionsVocabulary?: DirectionsVocabulary;
  processFlow?: ProcessFlowStep[];
}

/**
 * Full plan labelling question
 */
export interface PlanLabelling {
  meta: Meta;
  content: PlanMapDiagramContent;
  answerKey: AnswerKey;
  scoring: Scoring;
}

/**
 * Full map labelling question
 */
export interface MapLabelling {
  meta: Meta;
  content: PlanMapDiagramContent;
  answerKey: AnswerKey;
  scoring: Scoring;
}

/**
 * Full diagram labelling question
 */
export interface DiagramLabelling {
  meta: Meta;
  content: PlanMapDiagramContent;
  answerKey: AnswerKey;
  scoring: Scoring;
}

// ============================================
// SHORT ANSWER TYPES
// ============================================

/**
 * Short answer question item
 */
export interface ShortAnswerQuestion {
  id: number;
  text: string;
  answer: string;
  alternativeAnswers: string[];
  answerType: 'text' | 'number';
  audioTimeRange: AudioTimeRange;
}

/**
 * Short answer content
 */
export interface ShortAnswerContent {
  questionText: string;
  instructions: string;
  questions: ShortAnswerQuestion[];
  wordLimit: string;
  answer: Record<string, string>;
  explanation: string;
  audioTimeRange: AudioTimeRange;
  media: Media;
  uiHints: UiHints;
  validation: Validation;
}

/**
 * Full short answer question
 */
export interface ShortAnswer {
  meta: Meta;
  content: ShortAnswerContent;
  answerKey: AnswerKey;
  scoring: Scoring;
}

// ============================================
// SENTENCE COMPLETION TYPES
// ============================================

/**
 * Sentence completion item
 */
export interface SentenceCompletionItem {
  id: number;
  text: string;
  blankPosition: 'start' | 'middle' | 'end';
  answer: string;
  fullSentence: string;
  audioTimeRange: AudioTimeRange;
}

/**
 * Sentence completion content
 */
export interface SentenceCompletionContent {
  questionText: string;
  instructions: string;
  sentences: SentenceCompletionItem[];
  wordLimit: string;
  answer: Record<string, string>;
  explanation: string;
  audioTimeRange: AudioTimeRange;
  media: Media;
  uiHints: UiHints;
  validation: Validation;
}

/**
 * Full sentence completion question
 */
export interface SentenceCompletion {
  meta: Meta;
  content: SentenceCompletionContent;
  answerKey: AnswerKey;
  scoring: Scoring;
}

// ============================================
// UNION TYPE FOR ALL QUESTION TYPES
// ============================================

/**
 * Union type for all IELTS listening question types
 */
export type IELTSListeningQuestion =
  | FormCompletion
  | NoteCompletion
  | TableCompletion
  | SummaryCompletion
  | FlowchartCompletion
  | PeopleOpinions
  | EventsInfo
  | LocationsFeatures
  | SingleAnswerMultipleChoice
  | MultipleAnswersMultipleChoice
  | PlanLabelling
  | MapLabelling
  | DiagramLabelling
  | ShortAnswer
  | SentenceCompletion;

// ============================================
// TEST LEVEL TYPES
// ============================================

/**
 * Test information
 */
export interface TestInfo {
  title: string;
  instructions: string;
  totalDuration: string;
  audioFiles: {
    section1: string;
    section2: string;
    section3: string;
    section4: string;
  };
}

/**
 * Section audio time
 */
export interface SectionAudioTime {
  start: string;
  end: string;
}

/**
 * Test section
 */
export interface TestSection {
  id: number;
  title: string;
  description: string;
  numberOfQuestions: number;
  duration: string;
  audioTime: SectionAudioTime;
  questions: IELTSListeningQuestion[];
}

/**
 * Band score conversion
 */
export interface BandConversion {
  [key: string]: string;
}

/**
 * Test scoring
 */
export interface TestScoring {
  totalQuestions: number;
  pointsPerQuestion: number;
  maximumScore: number;
  bandConversion: BandConversion;
}

/**
 * Transcript information
 */
export interface Transcript {
  url: string;
  available: boolean;
}

/**
 * Complete IELTS listening test
 */
export interface IELTSListeningTest {
  meta: Meta;
  testInfo: TestInfo;
  sections: TestSection[];
  answerKey: {
    section1: Record<string, string | string[]>;
    section2: Record<string, string | string[]>;
    section3: Record<string, string | string[]>;
    section4: Record<string, string | string[]>;
  };
  scoring: TestScoring;
  transcript: Transcript;
  audioFiles: {
    section1: string;
    section2: string;
    section3: string;
    section4: string;
  };
}

// ============================================
// HELPER TYPES
// ============================================

/**
 * Type guard to check if a question is a completion type
 */
export function isCompletionQuestion(
  question: IELTSListeningQuestion
): question is FormCompletion | NoteCompletion | TableCompletion | SummaryCompletion | FlowchartCompletion {
  return question.meta.questionType === 'completion';
}

/**
 * Type guard to check if a question is a matching type
 */
export function isMatchingQuestion(
  question: IELTSListeningQuestion
): question is PeopleOpinions | EventsInfo | LocationsFeatures {
  return question.meta.questionType === 'matching';
}

/**
 * Type guard to check if a question is a multiple choice type
 */
export function isMultipleChoiceQuestion(
  question: IELTSListeningQuestion
): question is SingleAnswerMultipleChoice | MultipleAnswersMultipleChoice {
  return question.meta.questionType === 'multiple_choice';
}

/**
 * Type guard to check if a question is a plan/map/diagram type
 */
export function isPlanMapDiagramQuestion(
  question: IELTSListeningQuestion
): question is PlanLabelling | MapLabelling | DiagramLabelling {
  return question.meta.questionType === 'plan_map_diagram';
}

/**
 * Type guard to check if a question is a short answer type
 */
export function isShortAnswerQuestion(
  question: IELTSListeningQuestion
): question is ShortAnswer {
  return question.meta.questionType === 'short_answer';
}

/**
 * Type guard to check if a question is a sentence completion type
 */
export function isSentenceCompletionQuestion(
  question: IELTSListeningQuestion
): question is SentenceCompletion {
  return question.meta.questionType === 'sentence_completion';
}
