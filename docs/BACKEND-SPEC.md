# Đặc tả Backend IELTS Admin (Spring Boot + MongoDB)

Tài liệu đầy đủ để xây dựng backend chuẩn, phù hợp production, không quá phức tạp. Bổ sung chi tiết so với `ADMIN-BACKEND-INTEGRATION.md`.

---

## 1. Phạm vi và mục tiêu

- **Phạm vi**: API cho admin tạo/sửa bài test IELTS Listening; validate payload; lưu MongoDB.
- **Không bao gồm** (có thể thêm sau): auth đầy đủ, ngân hàng câu hỏi, versioning phức tạp, audit log chi tiết.
- **Stack gợi ý**: Java 17+, Spring Boot 3, Spring Data MongoDB, Bean Validation.

---

## 2. Collections MongoDB (tối thiểu)

| Collection | Mô tả | Document |
|------------|--------|----------|
| **tests** | Bài test (1 test = 1 document). | Embed `info`, `sections[]`, mỗi section embed `questions[]`. Thêm `answerKeyBySection`, `status`, `version`, `createdAt`, `updatedAt`. |

**Chỉ cần 1 collection** để bắt đầu. Thêm `users`, `media` khi cần auth và quản lý file.

---

## 3. Schema collection `tests`

```json
{
  "_id": "ObjectId",
  "status": "draft",
  "version": 1,
  "info": {
    "title": "string",
    "instructions": "string",
    "totalDuration": "string",
    "audioFiles": {
      "section1": "string",
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
            "questionType": "completion|matching|multiple_choice|plan_map_diagram|sentence_completion|short_answer",
            "variant": "string",
            "section": 1,
            "questionNumber": 11
          },
          "content": {},
          "answerKey": {},
          "scoring": { "points": 1 }
        }
      ]
    }
  ],
  "answerKeyBySection": {
    "section1": {},
    "section2": {},
    "section3": {},
    "section4": {}
  },
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

**Index**: `_id`; `status` + `updatedAt` (list test, filter draft/published).

---

## 4. API REST (chuẩn, đủ dùng)

### 4.1 Tạo bài test

- **POST** `/api/tests`
- **Request body**: `{ "info": {...}, "sections": [...] }` (giống payload client hiện tại).
- **Xử lý**:
  1. Validate toàn bộ (xem mục 5).
  2. Gộp answerKey từng section → `answerKeyBySection`.
  3. Set `status: "draft"`, `version: 1`, `createdAt`, `updatedAt`.
  4. Lưu vào `tests`.
- **Response**: `201 Created` + `{ "id": "<_id>" }`.
- **Lỗi**: `400` kèm danh sách lỗi validation (field + message).

### 4.2 Cập nhật bài test

- **PUT** `/api/tests/{id}`
- **Request body**: Cùng format với POST.
- **Xử lý**: Validate → merge/ghi đè document (giữ `_id`) → tăng `version`, cập nhật `updatedAt`, tính lại `answerKeyBySection`.
- **Response**: `200 OK` + `{ "id": "<_id>" }`.

### 4.3 Lấy một bài test

- **GET** `/api/tests/{id}`
- **Response**: `200` + document test (đủ để client hiển thị/edit). Format: `{ info, sections, ... }` (có thể bỏ `answerKeyBySection` nếu client chỉ cần từng question.answerKey).

### 4.4 Danh sách bài test

- **GET** `/api/tests?status=draft|published&page=0&size=20`
- **Response**: `200` + `{ "content": [...], "totalElements": n, "totalPages": p }`. Mỗi phần tử: `_id`, `info.title`, `status`, `updatedAt` (không cần embed full sections).

### 4.5 Upload ảnh (plan/map/diagram)

- **POST** `/api/admin/upload-image` (multipart/form-data, field `file`).
- **Xử lý**: Kiểm tra type (image/*), lưu file (disk hoặc S3), trả URL public.
- **Response**: `200` + `{ "url": "...", "width": number, "height": number }` (width/height optional, client có thể tự detect).

---

## 5. Validation (đủ chuẩn, không quá phức tạp)

### 5.1 Test-level

- `info.title`: không rỗng, max length 200.
- `info.instructions`, `info.totalDuration`: optional, max length hợp lý.
- `sections`: size 1–4; mỗi section có `id` 1–4, `questions` array (0–10 câu mỗi section hoặc theo nghiệp vụ).

### 5.2 Question-level (theo từng type)

- **meta**: `questionType` thuộc enum; `variant` thuộc enum tương ứng; `section` 1–4; `questionNumber` > 0.
- **content**: Cấu trúc tối thiểu theo type (ví dụ completion có `questionText`, `formData` hoặc `notes` hoặc `table`…; plan_map_diagram có `image.url`, `image.hotspots`, `questions`).
- **answerKey**: Map string → string hoặc string[] (multiple_answers). Key phải tồn tại trong content (blank id / question id).
- **scoring.points**: number, >= 0.

**Chi tiết từng variant**: Tham chiếu `src/types/index.ts` và `public/data/questionType/README.md`. Backend nên có DTO/class cho từng variant và validator riêng (hoặc một validator dispatch theo `questionType` + `variant`).

### 5.3 Ràng buộc đơn giản

- Completion: số key trong answerKey = số blank trong content.
- Matching: mỗi questionId trong questions có đúng một entry trong answer.matches / answerKey.
- Multiple choice single: answerKey có đúng 1 value; multiple: đúng số lượng (ví dụ 2).
- Plan/map/diagram: answerKey keys = hotspot id hoặc question id; image có url (và nên có width, height).

Không cần regex phức tạp hay rule IELTS chi tiết ngay từ đầu; ưu tiên đủ để tránh data hỏng.

---

## 6. Xử lý lỗi và response chuẩn

- **400 Bad Request**: Validation fail. Body: `{ "errors": [ { "field": "sections[0].questions[1].content", "message": "..." } ] }`.
- **404 Not Found**: Test id không tồn tại.
- **500 Internal Server Error**: Log, trả message chung (không lộ stack trace).

Dùng cùng một format envelope nếu cần: `{ "success": boolean, "data": {} | null, "errors": [] }`.

---

## 7. Bảo mật cơ bản

- CORS: Cho phép origin của frontend (Next.js).
- Upload: Giới hạn kích thước file (ví dụ 5MB), whitelist extension (jpg, png, webp).
- Sau này thêm auth: JWT hoặc session; PUT/POST/DELETE yêu cầu đăng nhập; GET list có thể filter theo user.

---

## 8. Tóm tắt checklist triển khai

1. Project Spring Boot + Spring Data MongoDB.
2. Entity/Document `Test` map với schema trên.
3. Repository `TestRepository` (MongoRepository).
4. DTO request: `CreateTestRequest` / `UpdateTestRequest` (info + sections).
5. Service: validate (gọi validator từng question), build `answerKeyBySection`, save.
6. Controller: POST/PUT/GET one/GET list + upload image.
7. Exception handler: trả 400/404/500 đúng format.
8. Index: `status`, `updatedAt`.

Tài liệu bổ sung: `ADMIN-BACKEND-INTEGRATION.md` (logic chuyển sang backend, phân chia client/backend, MongoDB mở rộng).

---

## 9. Client: auto-save draft (Next.js Test Builder)

Để tránh mất data khi refresh hoặc bấm nhầm, Test Builder có cơ chế **auto-save draft** trên client:

- **Lưu tự động**: Mỗi **30 giây** ghi `{ info, sections }` vào **localStorage** (key: `ielts-test-builder-draft`).
- **TTL 24h**: Mỗi lần ghi kèm `expiresAt = now + 24h`. Khi mở trang, nếu `expiresAt` đã qua thì **xóa draft** và không restore.
- **Restore**: Khi vào `/admin/test-builder`, đọc localStorage; nếu còn hạn thì khôi phục form từ draft và hiển thị thông báo "Draft restored...".
- **Xóa draft**: Sau khi **Save Test** thành công (gọi API save), client xóa draft trong localStorage.

Code: `src/lib/draft-storage.ts` (constants, `saveDraft`, `loadDraft`, `clearDraft`); `TestBuilder` dùng `setInterval` + `saveDraft`; page load draft và gọi `clearDraft` sau save thành công.

Source: **ABAOXOMTIEU**
