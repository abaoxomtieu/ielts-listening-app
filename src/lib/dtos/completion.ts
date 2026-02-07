export interface AudioTimeRange {
    start: string;
    end: string;
}

// Common Interfaces
export interface Meta {
    questionType: string;
    variant: 'sentence_completion' | 'form_completion' | 'note_completion' | 'table_completion' | 'summary_completion' | 'flowchart_completion';
    section: number;
    questionNumber: number;
}

export interface AnswerKey {
    [key: string]: string;
}

export interface Scoring {
    points: number;
    partialCredit?: boolean;
    penaltyForWrong?: number;
}

export interface Media {
    image: string | null;
    audio: string;
}

// Variant Specific Data Interfaces

// 1. Sentence Completion
export interface SentenceItem {
    id: number;
    text: string;
    answer: string;
    audioTimeRange?: AudioTimeRange;
}

export interface SentenceCompletionContent {
    questionText: string;
    instructions: string;
    sentences: SentenceItem[];
    wordLimit: string;
    audioTimeRange: AudioTimeRange;
    media: Media;
    uiHints: {
        displayType: string;
        showSentenceNumbers: boolean;
        inlineInputs: boolean;
    };
}

// 2. Form Completion
export interface FormFieldData {
    id: number;
    label: string;
    placeholder?: string;
    inputType: 'text' | 'email' | 'tel' | 'number' | 'select' | 'date';
    options?: string[]; // for select
    required: boolean;
    answer: string;
    audioTimeRange?: AudioTimeRange;
}

export interface FormCompletionContent {
    questionText: string;
    instructions: string;
    formData: {
        formTitle: string;
        fields: FormFieldData[];
    };
    wordLimit: string;
    audioTimeRange: AudioTimeRange;
    media: Media;
    uiHints: {
        displayType: string;
        showFieldNumbers: boolean;
    };
}

// 3. Note Completion
export interface NoteBulletPoint {
    id?: number; // only if it has a blank
    text: string; // contains [______] if it has a blank
    answer?: string;
}

export interface NoteSection {
    heading: string;
    bulletPoints: NoteBulletPoint[];
}

export interface NoteCompletionContent {
    questionText: string;
    instructions: string;
    notes: {
        title: string;
        sections: NoteSection[];
    };
    wordLimit: string;
    audioTimeRange: AudioTimeRange;
    media: Media;
    uiHints: any;
}

// 4. Table Completion
export interface TableCell {
    value: string;
    isEditable: boolean;
    answer?: string; // if editable
    audioTimeRange?: AudioTimeRange;
}

export interface TableRow {
    id: number;
    cells: TableCell[];
}

export interface TableCompletionContent {
    questionText: string;
    instructions: string;
    table: {
        headers: string[];
        rows: TableRow[];
    };
    wordLimit: string;
    audioTimeRange: AudioTimeRange;
    media: Media;
    uiHints: any;
}

// 5. Summary Completion
export interface SummaryBlank {
    id: number;
    position: number; // char index
    answer: string;
    audioTimeRange?: AudioTimeRange;
}

export interface SummaryOption {
    id: string; // A, B, C...
    text: string;
}

export interface SummaryCompletionContent {
    questionText: string;
    instructions: string;
    summary: {
        text: string;
        blanks: SummaryBlank[];
    };
    options?: SummaryOption[];
    wordLimit: string;
    audioTimeRange: AudioTimeRange;
    media: Media;
    uiHints: any;
}

// 6. Flowchart Completion
export interface FlowchartPosition {
    x: number;
    y: number;
}

export interface FlowchartNodeData {
    id: number | string;
    text: string; // contains [______] if blank
    answer?: string;
    position: FlowchartPosition;
    audioTimeRange?: AudioTimeRange;
}

export interface FlowchartConnection {
    from: number | string;
    to: number | string;
}

export interface FlowchartCompletionContent {
    questionText: string;
    instructions: string;
    flowchart: {
        title?: string;
        nodes: FlowchartNodeData[];
        connections: FlowchartConnection[];
    };
    wordLimit: string;
    audioTimeRange: AudioTimeRange;
    media: Media;
    uiHints: any;
}


// Union for main usage
export type CompletionContent =
    | SentenceCompletionContent
    | FormCompletionContent
    | NoteCompletionContent
    | TableCompletionContent
    | SummaryCompletionContent
    | FlowchartCompletionContent;

export interface CompletionData {
    meta: Meta;
    content: any; // Using any here to simplify builder handling, typically cast to specific Content type
    answerKey: AnswerKey;
    scoring: Scoring;
}
