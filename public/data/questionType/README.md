# Question type data (`public/data/questionType`)

Source: **ABAOXOMTIEU**

Thư mục chứa dữ liệu mẫu (JSON) cho từng loại câu hỏi IELTS Listening. App dùng các file **`.example.json`** cho trang chủ (demo); admin tạo/sửa nội dung qua UI và có thể lưu ra file (API save).

## Cấu trúc thư mục

```
questionType/
├── completion/
│   ├── form-completion.example.json
│   ├── note-completion.example.json
│   ├── table-completion.example.json
│   ├── summary-completion.example.json
│   └── flowchart-completion.example.json
├── matching/
│   ├── people-opinions.example.json
│   ├── locations-features.example.json
│   └── events-info.example.json
├── multiple-choice/
│   ├── single-answer.example.json
│   └── multiple-answers.example.json
├── plan-map-diagram/
│   ├── plan-labelling.example.json
│   ├── map-labelling.example.json
│   └── diagram-labelling.example.json
├── sentence-completion/
│   └── sentence-completion.example.json
├── short-answer/
│   └── short-answer.example.json
└── README.md
```

## Cách app dùng

- **Trang chủ** (`src/app/page.tsx`): Danh sách menu hardcode đường dẫn tới từng file `.example.json`; khi user chọn item, app `fetch(filePath)` rồi đưa vào `QuestionRenderer`. Chỉ file có đuôi **`.example.json`** mới được dùng cho demo.
- **Render câu hỏi** (`src/components/QuestionRenderer.tsx`): Dựa vào `meta.questionType` và `meta.variant` để chọn component tương ứng (FormCompletion, NoteCompletion, PlanLabelling, …). Kiểu dữ liệu: `IELTSListeningQuestion` trong `src/types/index.ts`.
- **Admin**: Tạo/sửa câu hỏi qua Test Builder (`/admin/test-builder`). Mỗi loại có builder riêng (FormCompletionBuilder, NoteCompletionBuilder, PlanMapDiagramBuilder, …). Lưu câu hỏi đơn (completion) qua API save → `public/data/questionType/completion/<filename>.json`; lưu cả bài test qua save-test → `public/data/tests/<filename>.json`.

## Cấu trúc chung mỗi câu hỏi

Mỗi file JSON là một object có dạng:

```ts
{
  meta: {
    questionType: string;   // 'completion' | 'matching' | 'multiple_choice' | 'plan_map_diagram' | 'short_answer' | 'sentence_completion'
    variant: string;        // xem bảng variants bên dưới
    section: number;        // 1–4
    questionNumber: number;
    difficulty?: 'easy' | 'medium' | 'hard';
    version?: string;
    createdAt?: string;
  },
  content: { ... };         // phụ thuộc questionType + variant
  answerKey: Record<string, string | string[]>;  // id câu/ô → đáp án (string hoặc string[] cho multiple_answers)
  scoring: { points: number; partialCredit?: boolean; penaltyForWrong?: number };
}
```

## Question types và variants

Định nghĩa đầy đủ trong `src/types/index.ts`; routing trong `QuestionRenderer` và `TestSectionManager` theo bảng sau.

| `meta.questionType` | `meta.variant` | Mô tả ngắn |
|---------------------|----------------|------------|
| `completion` | `form_completion` | Form với các field (label, inputType, answer), `content.formData.fields`. |
| `completion` | `note_completion` | Ghi chú theo section, bullet có blank `[______]`, `content.notes.sections`. |
| `completion` | `table_completion` | Bảng với ô trống, `content.table.headers` + `content.table.rows` (cells có `value`, `isEditable`, `answer`). |
| `completion` | `summary_completion` | Đoạn tóm tắt có blank (ví dụ `[31]`), tùy chọn `content.options`, `content.summary.text` + `blanks`. |
| `completion` | `flowchart_completion` | Sơ đồ bước, `content.flowchart.nodes` (text có `[______]`, `answer`, `position`), `connections`. |
| `matching` | `people_opinions` \| `events_info` \| `locations_features` | Danh sách câu hỏi + hộp lựa chọn; `content.questions`, `content.options`, `content.answer.matches` (questionId → optionId). |
| `multiple_choice` | `single_answer` | Một đáp án đúng; `content.options`, `content.answer.correctOption`; `answerKey` dạng `{ [questionNumber]: optionId }`. |
| `multiple_choice` | `multiple_answers` | Nhiều đáp án đúng; `content.answer.correctOptions`; `answerKey` dạng `{ [questionNumber]: string[] }`. |
| `plan_map_diagram` | `plan_labelling` \| `map_labelling` \| `diagram_labelling` | Ảnh + hotspots; `content.image` (url, altText, width, height, hotspots với x, y, label, position); `content.questions`; `content.answerLabels`; `uiHints.answerInput`: `'onMap'` hoặc `'belowList'`. |
| `sentence_completion` | `sentence_completion` | Các câu có blank; `content.sentences` (id, text, answer). |
| `short_answer` | `short_answer` | Câu hỏi ngắn; `content.questions` (id, text, answer, alternativeAnswers, answerType, audioTimeRange). |

## Một số field content thường gặp

- **Chung**: `questionText`, `instructions`, `audioTimeRange`, `media` (image, audio), `uiHints`, `wordLimit` hoặc `validation.wordLimit`.
- **Completion**: Blank trong text thường ký hiệu `[______]`; id ô/câu dùng cho `answerKey`.
- **Plan/Map/Diagram**: `image.width` và `image.height` dùng để tính % vị trí hotspot; hotspot có `id`, `x`, `y`, `label`, `position`; map có thể thêm `marker: 'pin'`, diagram có thể `connector: 'arrow'`.
- **Matching**: `answerKey[questionId] = optionId` (ví dụ `"26": "E"`).

## Types và admin

- **Types/type guards**: Toàn bộ interface và type guard (`isCompletionQuestion`, `isPlanMapDiagramQuestion`, …) nằm trong **`src/types/index.ts`**.
- **Admin builders**: Component builder theo từng variant nằm trong `src/components/admin/builders/` (completion, matching, multiple-choice, plan-map-diagram, short-answer). Test Builder dùng `TestSectionManager` để map variant → builder tương ứng.
- **Lưu dữ liệu**: Câu hỏi completion đơn: `POST /api/admin/save` (body: `filename`, `data`) → lưu vào `public/data/questionType/completion/<filename>.json`. Bài test (nhiều section, nhiều câu): `POST /api/admin/save-test` → `public/data/tests/<filename>.json`.

Khi thêm/sửa cấu trúc JSON nên đồng bộ với types trong `src/types/index.ts` và với output mà admin builders tạo ra.
