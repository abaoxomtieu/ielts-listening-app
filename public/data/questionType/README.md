# IELTS Listening Question Type JSON Schemas

This directory contains NoSQL JSON schemas for all IELTS Listening question types and their variants. These schemas are designed to be UI-ready for both test display and admin CRUD operations.

## Directory Structure

```
questionType/
├── multiple-choice/
│   ├── single-answer.example.json
│   └── multiple-answers.example.json
├── matching/
│   ├── people-opinions.example.json
│   ├── locations-features.example.json
│   └── events-info.example.json
├── plan-map-diagram/
│   ├── plan-labelling.example.json
│   ├── map-labelling.example.json
│   └── diagram-labelling.example.json
├── completion/
│   ├── form-completion.example.json
│   ├── note-completion.example.json
│   ├── table-completion.example.json
│   ├── flowchart-completion.example.json
│   └── summary-completion.example.json
├── sentence-completion/
│   └── sentence-completion.example.json
├── short-answer/
│   └── short-answer.example.json
├── full-test-example.json
├── README.md
└── schema-validation.json
```

## Question Types Overview

### 1. Multiple Choice (Trắc nghiệm)
**Variants:**
- `single_answer`: Choose 1 correct option from 3-4 choices
- `multiple_answers`: Choose 2-3 correct options from 5-7 choices

**Common Sections:** Section 2, 3, 4

**Key Fields:**
- `options`: Array of choice objects with id and text
- `answer.correctOption` (single) or `answer.correctOptions` (multiple)
- `instructions`: e.g., "Choose TWO letters A-F"

**UI Rendering:**
- Single answer: Radio buttons
- Multiple answers: Checkboxes with limit

---

### 2. Matching (Nối thông tin)
**Variants:**
- `people_opinions`: Match speakers to their views
- `locations_features`: Match places to characteristics
- `events_info`: Match events to dates/details

**Common Sections:** Section 2, 3

**Key Fields:**
- `questions`: Array of items to match
- `options`: Array of possible matches
- `answer.matches`: Array of questionId -> optionId mappings

**UI Rendering:**
- Dropdown menus or drag-and-drop
- Side-by-side layout recommended

---

### 3. Plan/Map/Diagram Labelling (Gán nhãn)
**Variants:**
- `plan_labelling`: Label parts of floor plan/building
- `map_labelling`: Label locations on map
- `diagram_labelling`: Label parts of process/structure

**Common Sections:** Section 2, 4

**Key Fields:**
- `image`: URL with hotspot coordinates (x, y)
- `image.hotspots`: Array of clickable areas
- `directionsVocabulary` (for maps): Key phrases for navigation

**UI Rendering:**
- Image with numbered/clickable hotspots
- Drag-and-drop labels support
- Zoom capability for maps

---

### 4. Completion (Hoàn thành)
**Variants:**
- `form_completion`: Fill in personal information form
- `note_completion`: Complete notes/bullet points
- `table_completion`: Fill in table cells
- `flowchart_completion`: Complete process flow
- `summary_completion`: Fill in summary paragraph

**Common Sections:** All sections (varies by variant)

**Key Fields:**
- `wordLimit`: e.g., "NO MORE THAN TWO WORDS"
- `formData`/`notes`/`table`/`flowchart`/`summary`: Type-specific structure
- `questions`: Individual blank fields with IDs

**UI Rendering:**
- Form: Input fields with labels
- Notes: Bullet points with inline inputs
- Table: Grid with editable cells
- Flowchart: Connected nodes with editable text
- Summary: Text paragraph with blanks

---

### 5. Sentence Completion (Hoàn thành câu)
**Variant:** `standard`

**Common Sections:** Section 3, 4

**Key Fields:**
- `sentences`: Array with blank position (start/middle/end)
- `wordLimit`: e.g., "NO MORE THAN TWO WORDS"

**UI Rendering:**
- Sentences with inline input fields
- Show complete sentence for reference

---

### 6. Short-Answer Questions (Câu hỏi trả lời ngắn)
**Variant:** `standard`

**Common Sections:** Section 3, 4

**Key Fields:**
- `questions`: Array with question text
- `answerType`: "text" or "number"
- `alternativeAnswers`: Array of accepted variations
- `wordLimit`: e.g., "NO MORE THAN TWO WORDS AND/OR A NUMBER"

**UI Rendering:**
- Question text with text input
- Case-insensitive validation recommended

---

## Full Test Structure

The `full-test-example.json` demonstrates a complete IELTS Listening test with:

- 4 sections (10 questions each = 40 total)
- Nested structure: Test -> Sections -> Questions
- Mixed question types across sections
- Complete metadata for test display
- Answer keys per section
- Band score conversion table

## Common Fields Across All Question Types

### Meta Fields
```json
{
  "meta": {
    "questionType": "enum",
    "variant": "string",
    "section": 1-4,
    "questionNumber": 1-10,
    "difficulty": "easy|medium|hard",
    "version": "string",
    "createdAt": "ISO8601 timestamp"
  }
}
```

### Content Fields
```json
{
  "content": {
    "questionText": "string",
    "instructions": "string",
    "wordLimit": "string|null",
    "audioTimeRange": {
      "start": "MM:SS",
      "end": "MM:SS"
    },
    "media": {
      "image": "url|null",
      "audio": "url"
    },
    "uiHints": {
      "displayType": "string",
      "shuffleOptions": "boolean",
      "dragAndDrop": "boolean"
    },
    "validation": {
      "minQuestions": "number",
      "maxQuestions": "number",
      "required": "boolean"
    }
  }
}
```

### Answer & Scoring Fields
```json
{
  "answerKey": "mixed",
  "answer": {
    "correctOption" | "correctOptions" | "matches": "mixed",
    "explanation": "string"
  },
  "scoring": {
    "points": "number",
    "partialCredit": "boolean",
    "penaltyForWrong": "number"
  }
}
```

## UI Rendering Guidelines

### Display Types
- `radio`: Single select (multiple choice)
- `checkbox`: Multi select (multiple choice)
- `dropdown`: Matching
- `imageWithLabels`: Plan/diagram
- `mapWithMarkers`: Map labelling
- `form`: Form completion
- `notes`: Note completion
- `table`: Table completion
- `flowchart`: Flowchart
- `summary`: Summary with blanks
- `sentences`: Sentence completion
- `questions`: Short-answer

### Interactive Features
- **Drag-and-drop**: Supported for matching and labelling
- **Zoom**: Recommended for maps
- **Inline validation**: Show errors in real-time
- **Word limit indicators**: Display remaining characters/words
- **Audio timeline**: Show current audio position

## Validation Rules

See `schema-validation.json` for comprehensive validation rules.

Key validation points:
- Word limits must be respected
- Required fields must be present
- Answer keys must match question structure
- Audio time ranges must be valid
- Image coordinates must be within bounds
- Options must be unique where applicable

## Admin CRUD Considerations

### Creating New Questions
1. Select question type and variant
2. Fill in required fields (question text, answer key, etc.)
3. Set audio time range if applicable
4. Upload or link images for plan/map/diagram types
5. Configure UI hints for optimal display
6. Validate before saving

### Editing Existing Questions
1. Maintain question IDs for consistency
2. Update all related fields (audio timing, etc.)
3. Preserve answer key integrity
4. Increment version on major changes

### Deleting Questions
1. Check for dependencies (tests using this question)
2. Archive rather than hard delete
3. Update test structures if necessary

## Usage Examples

### Frontend Integration
```javascript
import questionData from './questionType/multiple-choice/single-answer.example.json';

function renderQuestion(data) {
  const { meta, content } = data;

  return (
    <div className={`question-${meta.questionType}`}>
      <QuestionHeader
        number={content.questionNumber}
        text={content.questionText}
        instructions={content.instructions}
      />

      {content.options?.map(option => (
        <Option key={option.id} {...option} />
      ))}

      {content.media?.audio && (
        <AudioPlayer src={content.media.audio} />
      )}
    </div>
  );
}
```

### Backend Validation
```javascript
import Ajv from 'ajv';
import schema from './schema-validation.json';

const validateQuestion = (data) => {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  if (!validate(data)) {
    throw new Error(validate.errors);
  }

  return true;
};
```

## Audio and Media Management

### Audio Files
- Format: MP3 preferred
- Naming convention: `section{N}.mp3`
- Location: `/audio/` directory
- Duration: ~5 minutes per section

### Image Files
- Format: PNG preferred for quality
- Naming convention: `{section}-{type}-{id}.png`
- Location: `/images/` directory
- Resolution: Minimum 800x600 for clarity

### Transcript Files
- Format: PDF preferred
- Naming convention: `{testId}.pdf`
- Location: `/transcripts/` directory

## Best Practices

1. **Consistent ID numbering**: Maintain sequential question numbers within sections
2. **Clear instructions**: Always include word limits or selection requirements
3. **Audio timing**: Provide accurate time ranges for each question
4. **Alternative answers**: Include common variations where applicable
5. **UI hints**: Use hints to guide optimal rendering
6. **Version control**: Track changes with version numbers
7. **Validation**: Always validate before saving to database
8. **Accessibility**: Include alt text for images, consider screen readers

## Migration Notes

When migrating from existing systems:
1. Map question types to new schema
2. Preserve original question IDs
3. Convert word limit formats to standard
4. Update audio file paths
5. Validate all data before import
6. Test rendering in new UI

## Support

For questions or issues with these schemas, please refer to:
- IELTS official documentation
- Each example file includes inline comments
- `schema-validation.json` for detailed rules

## License

These schemas are designed for IELTS Listening practice test systems.
