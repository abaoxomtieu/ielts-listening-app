# Matching Question Components for IELTS Listening App

This directory contains React components for rendering different types of matching questions in the IELTS Listening test.

## Components

### 1. PeopleOpinions
Renders people opinion matching questions where students match people's names to their opinions.

**Usage:**
```tsx
import { PeopleOpinions } from '@/components/matching';
import peopleOpinionsData from './people-opinions.example.json';

<PeopleOpinions
  data={peopleOpinionsData}
  onAnswerChange={(questionId, answer) => console.log(questionId, answer)}
  disabled={false}
/>
```

### 2. EventsInfo
Renders event information matching questions where students match events to information about them.

**Usage:**
```tsx
import { EventsInfo } from '@/components/matching';
import eventsInfoData from './events-info.example.json';

<EventsInfo
  data={eventsInfoData}
  onAnswerChange={(questionId, answer) => console.log(questionId, answer)}
  disabled={false}
/>
```

### 3. LocationsFeatures
Renders location-feature matching questions where students match places to their features.

**Usage:**
```tsx
import { LocationsFeatures } from '@/components/matching';
import locationsFeaturesData from './locations-features.example.json';

<LocationsFeatures
  data={locationsFeaturesData}
  onAnswerChange={(questionId, answer) => console.log(questionId, answer)}
  disabled={false}
/>
```

## Props

All components accept the following props:

- `data` (MatchingData): The question data object containing:
  - `meta`: Metadata about the question (type, variant, section, etc.)
  - `content`: The actual content including questions, options, and instructions
  - `answerKey`: Object mapping question IDs to correct answers

- `onAnswerChange` (optional): Callback function called when user selects an answer
  - Parameters: `(questionId: number, answer: string) => void`

- `disabled` (optional, default: false): Whether to disable all inputs

## Features

- **IELTS Test Format**: Components are styled to look like real IELTS test papers
- **Side-by-Side Layout**: Questions appear on the left, matching options on the right
- **Radix UI Select**: Uses accessible, customizable dropdown components
- **Letter Labels**: Options display with letter labels (A, B, C, etc.)
- **Progress Tracking**: Shows completion status and progress
- **Responsive Design**: Works on both desktop and mobile devices
- **Visual Feedback**: Color-coded states for answered and unanswered questions

## Data Structure

The components expect data in the following format:

```typescript
interface MatchingData {
  meta: {
    questionType: string;
    variant: string;
    section: number;
    questionNumber: number;
    difficulty: string;
  };
  content: {
    questionText: string;
    questions: Array<{
      id: number;
      text: string;
    }>;
    options: Array<{
      id: string;
      text: string;
    }>;
    instructions: string;
  };
  answerKey: Record<string, string>;
}
```

## Styling

Components use Tailwind CSS for styling. Key design elements:

- Clean, professional IELTS test paper appearance
- Blue color scheme for interactive elements
- Green indicators for completed answers
- Gray borders and backgrounds matching test paper format
- Responsive grid layout (stacks on mobile, side-by-side on desktop)

## Dependencies

- React 18+
- @radix-ui/react-select
- Tailwind CSS

## Example Data Files

Example JSON files are located in:
```
/Users/baohoton/Desktop/Code/Job/WISE/data_listening/questionType/matching/
```

- `people-opinions.example.json`
- `events-info.example.json`
- `locations-features.example.json`
