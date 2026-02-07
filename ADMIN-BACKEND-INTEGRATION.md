# Admin backend integration (Java Spring Boot + MongoDB)

Tài liệu này mô tả cách tích hợp hệ thống admin IELTS với **backend Java Spring Boot**: logic nào nên chuyển sang backend để validate chuẩn và lưu MongoDB (mỗi bài test tương đương full test builder), và cách phân tách xử lý giữa client và backend để giảm tải logic ở client.

---

## 1. Hiện trạng (Next.js app)

- **Client**: Các builder (FormCompletionBuilder, NoteCompletionBuilder, …) tạo ra `content` + `answerKey` từ form; **không có validation** ngoài việc điền đủ field.
- **Lưu trữ**: API `POST /api/admin/save-test` nhận `{ filename, data }`, ghi thẳng `data` ra file JSON trong `public/data/tests/`. **Không validate schema**, không DB.
- **Payload full test**: `data` = `{ info, sections }` với `info` (title, instructions, totalDuration, audioFiles) và `sections[]` (id, title, description, numberOfQuestions, duration, audioTime, **questions**: `IELTSListeningQuestion[]`). Mỗi question đã có `meta`, `content`, `answerKey`, `scoring` do client build.

---

## 2. Logic nên chuyển sang backend (Spring Boot)

### 2.1 Validation (bắt buộc nên ở backend)

| Nhóm | Mô tả | Ví dụ |
|------|--------|--------|
| **Schema theo question type** | Đảm bảo `meta.questionType` + `meta.variant` hợp lệ; `content` đúng cấu trúc với từng loại (form có formData.fields, note có notes.sections, plan-map có image.hotspots, …). | Enum questionType/variant; DTO/Bean Validation cho từng variant. |
| **Ràng buộc nghiệp vụ** | Section 1–4; questionNumber trong khoảng; số câu/ô trong min/max; word limit; answerKey khớp với content (id trong answerKey tồn tại trong content). | Validation annotations + custom validator. |
| **AnswerKey nhất quán** | Với completion: mỗi blank (id) phải có trong answerKey. Matching: mỗi questionId có đúng một optionId. Multiple choice: single = 1 option, multiple = đúng số lượng. Plan/map: answerLabels khớp với hotspot/question id. | Service layer kiểm tra content vs answerKey. |
| **Plan/Map/Diagram** | Image có url, width, height; hotspots có x,y trong [0, width] và [0, height]; số lượng questions/hotspots nằm trong validation. | Custom validator. |

**Kết luận**: Toàn bộ validation chuẩn (schema + business rules + answerKey consistency) **nên nằm trên backend** để một client khác (ví dụ app khác gọi API) không thể gửi data sai. Client chỉ cần validation nhẹ cho UX (required field, format cơ bản).

### 2.2 Logic phức tạp có thể chuyển một phần sang backend

| Logic hiện tại (client) | Đề xuất |
|--------------------------|--------|
| **Sinh answerKey từ content** | Một số loại (note, table, form, sentence, short-answer) đều là “duyệt content và gom id → answer”. Có thể backend nhận `content` (+ meta) rồi **tự sinh answerKey** theo rule chuẩn, client chỉ gửi content. Giảm lỗi và duplicate logic. |
| **Chuẩn hóa ID** | questionNumber, id ô/blank hiện client tự tăng. Backend có thể **quy định/idempotent ID** (theo section + thứ tự) để tránh trùng, dễ merge. |
| **Aggregate answerKey theo section** | Hiện mỗi question mang answerKey riêng. Backend khi lưu test có thể **gộp theo section** (section1: { "11": "...", "12": "..." }) nếu model MongoDB cần. |

**Giảm tải client**: Client chỉ cần form nhập và gửi đúng DTO; backend validate + (tùy chọn) derive answerKey / normalize ID.

### 2.3 Persistence (MongoDB)

- **Lưu cả bài test** (giống full test builder): một document (hoặc vài collection tùy thiết kế) cho **Test** (metadata, sections, questions, answerKey per section, scoring, audio, …).
- **Có thể thêm**: Collection **Question** riêng (reuse giữa nhiều test), reference bằng ID. Backend quyết định normalise hay embed.
- **Upload ảnh**: Hiện Next.js có `/api/admin/upload-image` (ghi file). Backend Spring Boot có thể: (1) nhận file upload riêng, lưu storage (S3/disk), trả URL; (2) hoặc proxy từ client lên Next.js rồi chỉ lưu URL vào Mongo.

---

## 3. API đề xuất cho Spring Boot

Giả sử backend Java Spring Boot expose REST API; client (Next.js admin hoặc app khác) gọi để thêm/sửa test.

### 3.1 Lưu / cập nhật bài test (giống full test builder)

- **POST** `/api/tests` (hoặc `PUT` nếu có `testId`)
- **Body**: Cùng dạng payload hiện tại client gửi cho save-test:
  - `info`: `{ title, instructions, totalDuration, audioFiles: { section1..section4 } }`
  - `sections`: `[{ id, title, description, numberOfQuestions, duration, audioTime, questions: [ { meta, content, answerKey, scoring }, ... ] }]`
- **Backend**:
  1. Validate toàn bộ (schema từng question theo `meta.questionType` + `meta.variant`, business rules, answerKey khớp content).
  2. (Tùy chọn) Chuẩn hóa ID, derive answerKey cho từng question nếu client gửi thiếu.
  3. Map sang model MongoDB (Test + có thể Section/Question).
  4. Lưu MongoDB.
- **Response**: `201` + `{ id: testId }` hoặc `200` nếu cập nhật.

### 3.2 Lưu một câu hỏi đơn (optional)

- **POST** `/api/questions`  
- **Body**: Một `IELTSListeningQuestion` (meta, content, answerKey, scoring).  
- Dùng khi muốn “thư viện câu hỏi” rồi gắn vào test sau. Backend validate như trên rồi lưu collection Question.

### 3.3 Upload ảnh (plan/map/diagram)

- **POST** `/api/admin/upload-image` (multipart)  
- Backend lưu file (storage), trả **URL**. Client ghi `content.image.url` (và width/height nếu backend trả về hoặc client gửi kèm).

### 3.4 Lấy test / danh sách test

- **GET** `/api/tests` – list (filter, phân trang).  
- **GET** `/api/tests/{id}` – chi tiết một test (để hiển thị hoặc edit). Response format giống payload lưu (info + sections với questions đầy đủ).

---

## 4. Phân chia trách nhiệm Client vs Backend

| Phần | Giữ trên client (Next.js) | Chuyển sang backend (Spring Boot) |
|------|----------------------------|-----------------------------------|
| **UI / Form** | Toàn bộ form builder, chọn variant, nhập text, kéo thả hotspot, v.v. | — |
| **Validation nhẹ (UX)** | Required field, format cơ bản (số, thời gian), disable submit khi thiếu. | — |
| **Validation chuẩn** | Không (hoặc chỉ mirror nhẹ để báo lỗi sớm). | **Schema + business rules + answerKey consistency** cho từng question type. |
| **Sinh answerKey** | Có thể giữ (như hiện tại) để preview/export. | **Nên có**: backend nhận content, tự sinh answerKey theo rule để một nguồn sự thật. |
| **Lưu trữ** | Không lưu DB. Chỉ gọi API backend. | **Lưu MongoDB** (test, có thể question). |
| **Upload ảnh** | Form chọn file, gửi multipart. | Nhận file, lưu storage, trả URL (hoặc proxy Next.js rồi lưu URL). |
| **Authz** | Gửi token/session nếu cần. | Kiểm tra quyền (role) trước khi tạo/sửa test. |

---

## 5. Định dạng payload tham chiếu (để backend validate)

- **Question types và variants**: Xem `src/types/index.ts` và `public/data/questionType/README.md`.
- **Một câu hỏi**: `{ meta, content, answerKey, scoring }`. `answerKey`: `Record<string, string | string[]>` (string[] chỉ cho multiple_answers).
- **Một bài test**: `{ info: TestInfo, sections: TestSection[] }`. Mỗi section: `{ id, title, description, numberOfQuestions, duration, audioTime, questions: IELTSListeningQuestion[] }`.

Backend nên có DTO/entity map đúng các trường này và enum `questionType` / `variant` giống TypeScript để validate và lưu MongoDB nhất quán với app hiện tại.

---

## 6. MongoDB cho production: số collection và cách lưu

### 6.1 Gợi ý chuẩn production

| Collection | Mục đích | Lưu thế nào |
|------------|----------|-------------|
| **tests** | Một bài test IELTS (4 section, ~40 câu). Pattern truy vấn chính: “lấy full test theo id” để làm bài / chấm. | **1 document = 1 test**. Embed `info`, `sections` (mỗi section embed luôn `questions[]`). Mỗi question là object đầy đủ: `meta`, `content`, `answerKey`, `scoring`. Thêm `answerKeyBySection` (section1..section4) do backend gộp từ questions khi save (tiện cho chấm / báo cáo). |
| **questions** (tùy chọn) | Thư viện câu hỏi dùng lại cho nhiều test. | 1 document = 1 câu. Chỉ cần khi có tính năng “chọn câu từ ngân hàng” khi tạo test. Test lưu có thể: embed snapshot question **hoặc** lưu `questionId` reference và resolve khi load. |
| **media** (tùy chọn) | Metadata file đã upload (audio, ảnh). | 1 document = 1 file: `{ url, type: 'audio'|'image', filename, size, uploadedAt, uploadedBy }`. URL vẫn lưu trong `content` của question; collection này dùng để list/cleanup/audit. |
| **users** / **admins** (nếu có auth) | Người tạo/sửa test. | Chuẩn auth: `_id`, email, name, role. Test document có thêm `createdBy`, `updatedBy` (ObjectId ref). |

**Tối thiểu production**: **1 collection `tests`** là đủ (embed hết sections + questions trong một document).

**Mở rộng**: thêm **questions** nếu cần ngân hàng câu; **media** nếu cần quản lý file; **users** nếu cần phân quyền.

---

### 6.2 Schema chi tiết: collection `tests`

```json
{
  "_id": ObjectId,
  "status": "draft" | "published",
  "version": 1,
  "info": {
    "title": "string",
    "instructions": "string",
    "totalDuration": "string",
    "audioFiles": {
      "section1": "string (URL)",
      "section2": "string",
      "section3": "string",
      "section4": "string"
    }
  },
  "sections": [
    {
      "id": 1,
      "title": "string",
      "description": "string",
      "numberOfQuestions": 10,
      "duration": "string",
      "audioTime": { "start": "00:00", "end": "00:00" },
      "questions": [
        {
          "meta": {
            "questionType": "completion" | "matching" | "multiple_choice" | "plan_map_diagram" | "sentence_completion" | "short_answer",
            "variant": "string",
            "section": 1,
            "questionNumber": 11
          },
          "content": { ... },
          "answerKey": { "11": "answer1", "12": "answer2" },
          "scoring": { "points": 1 }
        }
      ]
    }
  ],
  "answerKeyBySection": {
    "section1": { "1": "...", "2": "..." },
    "section2": { "11": "...", "12": "..." },
    "section3": { ... },
    "section4": { ... }
  },
  "scoring": {
    "totalQuestions": 40,
    "pointsPerQuestion": 1,
    "maximumScore": 40,
    "bandConversion": { "40": "9.0", ... }
  },
  "createdAt": ISODate,
  "updatedAt": ISODate,
  "createdBy": ObjectId,
  "updatedBy": ObjectId
}
```

- **Lưu**: Khi POST/PUT test, backend validate xong gộp `answerKey` của từng question trong từng section thành `answerKeyBySection` (key = questionNumber/blank id, value = string hoặc string[]). Có thể thêm `scoring`, `bandConversion` mặc định nếu client chưa gửi.
- **Đọc**: GET test by `_id` → trả một document, frontend dùng luôn (đúng format hiện tại: info + sections với questions).

**Index đề xuất**:
- `_id` (mặc định).
- `status`, `createdAt` (để list test: filter draft/published, sort mới nhất).
- `createdBy` (nếu cần “test của tôi”).

---

### 6.3 Schema (tùy chọn): collection `questions`

Chỉ cần khi có **ngân hàng câu hỏi** (tạo câu một lần, gắn vào nhiều test).

```json
{
  "_id": ObjectId,
  "meta": { "questionType", "variant", "section": 0, "questionNumber": 0 },
  "content": { ... },
  "answerKey": { ... },
  "scoring": { "points": 1 },
  "createdAt": ISODate,
  "createdBy": ObjectId
}
```

- **Test dùng question bank**: Trong `sections[].questions[]` có thể lưu **snapshot** (embed full question khi tạo test) **hoặc** `{ "questionId": ObjectId, "questionNumber": 11 }` rồi khi GET test backend aggregate/populate để trả full question. Snapshot đơn giản hơn, ít join; reference tiết kiệm dung lượng và cập nhật câu một chỗ.

---

### 6.4 Kích thước document và giới hạn

- MongoDB document limit **16MB**. Một test ~40 câu, mỗi câu vài KB (content có thể lớn với plan/map image URL, hotspots, options) → thường vài trăm KB đến ~1–2MB/test. Nếu sau này content phình (nhiều media embed, text rất dài), có thể tách section hoặc question sang collection và reference.
- **Embed** sections + questions: ưu tiên cho “load full test một lần”; **reference** questions: ưu tiên khi cần reuse và cập nhật câu tập trung.

---

### 6.5 Tóm tắt nhanh

| Mức | Collections | Cách lưu |
|-----|-------------|----------|
| **Tối thiểu** | 1: `tests` | 1 document/test; embed `info`, `sections[]`, mỗi section embed `questions[]`; thêm `answerKeyBySection` (backend gộp khi save). |
| **Mở rộng** | + `questions` | Thư viện câu; test embed snapshot **hoặc** reference `questionId` + populate khi đọc. |
| **Đủ production** | + `media`, `users` | Media: metadata file upload; users: auth; test thêm `createdBy`/`updatedBy`. |

---

## 7. Tóm tắt chung

- **Validate chuẩn** (schema + business + answerKey): làm trên **backend**; client chỉ validate nhẹ cho UX.
- **Logic phức tạp** (derive answerKey, chuẩn hóa ID): nên **chuyển một phần sang backend** để giảm tải client và một nguồn sự thật.
- **Lưu bài test**: backend nhận payload giống full test builder hiện tại, validate rồi **lưu MongoDB**; API design trên đây tương thích với việc tích hợp Java Spring Boot gọi từ admin hoặc từ app khác.
- **Chuẩn production MongoDB**: tối thiểu **1 collection `tests`** (embed full test); tùy nhu cầu thêm **questions** (ngân hàng câu), **media** (metadata file), **users** (auth).

Source: **ABAOXOMTIEU**
