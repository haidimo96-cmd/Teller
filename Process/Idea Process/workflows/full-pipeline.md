---
description: Pipeline đầy đủ từ Idea → Script → VO → Title. Chạy từng phase, dừng lại giữa mỗi phase để user duyệt.
---

// turbo-all

# 🚀 Full Pipeline — Idea → Script → VO → Title

> **Mục đích:** Chạy toàn bộ quy trình sản xuất 1 video trong 1 conversation.
> **Phạm vi:** 6 Phase.
> **Input:** Idea câu chuyện (mô tả, link Reddit, hoặc file Idea có sẵn).

---

## 📋 TỔNG QUAN PIPELINE

```
Phase 1: Đánh giá idea        → /danh-gia-idea + /danh-gia-idea-p2
Phase 2: Tạo dàn ý            → /tao-dan-y
Phase 3: Viết kịch bản EN+VI  → /viet-kich-ban
Phase 4: Review + Sửa         → /review
Phase 5: Tạo Script VO        → /tao-script-note
Phase 6: Tạo Title             → /tao-title
```

> ⚠️ **Mỗi Phase DỪNG LẠI để user duyệt trước khi sang Phase tiếp theo.**
> User nói "tiếp" / "next" / "ok" → chuyển Phase tiếp.
> User nói "sửa..." → sửa theo yêu cầu rồi hỏi lại trước khi sang Phase tiếp.

---

## PHASE 1 — 🧠 ĐÁNH GIÁ IDEA *(~20 phút)*

### Điều kiện tiên quyết:
- User cung cấp idea (mô tả, link, concept, hoặc file Idea có sẵn trong `Ideas/`)

### Thực hiện:
1. Chạy workflow `/danh-gia-idea` (Bước 1 → Bước 2)
2. Chạy workflow `/danh-gia-idea-p2` (Bước 3 → Bước 6)
3. Trình kết quả cho user:
   - Nhóm pattern: FURY / STRATEGY / COMEDY
   - Điểm Universal + Pattern-Specific
   - Điểm tổng /100
   - Red Flags (nếu có)
   - Verdict: ✅ Đạt (≥70) / ❌ Không đạt (<70)

### Quy tắc:
- Nếu điểm < 70 → thông báo user, HỎI có muốn tiếp tục hay chọn idea khác
- Nếu idea đã được đánh giá trước đó (có file trong `Ideas/`) → user có thể skip Phase này

### Output Phase 1:
- File idea (nếu chưa có): `Ideas/[Category]/Idea-[slug]-V1.md`
- Xác nhận pattern (FURY/STRATEGY/COMEDY)

### → DỪNG — Chờ user duyệt trước khi sang Phase 2.

---

## PHASE 2 — 📝 TẠO DÀN Ý *(~45 phút)*

### Điều kiện tiên quyết:
- Phase 1 đã pass (điểm ≥ 70 hoặc user chấp nhận)
- Đã xác định pattern

### Thực hiện:
1. Chạy workflow `/tao-dan-y` đầy đủ (Bước 1 → Bước 7)
2. Bao gồm:
   - Story Inventory Mining (không bỏ sót chi tiết)
   - Story Prep (Ticking Clock, Binary Forces, Object, Dialogue Callback...)
   - Mini Arc Mapping + THEREFORE test
   - Retention Hook Map
   - Emotional Ladder Verification
   - Character Blueprint (3 C's)

### Output Phase 2:
- File dàn ý: `Dan Y/[PATTERN]/Outline-[slug]-V1.md`
- Bao gồm: Story Inventory + Mini Arc Map + Visual Notes + Retention Map + Emotional Ladder

### → DỪNG — Trình dàn ý cho user review. Chờ duyệt.

---

## PHASE 3 — ✍️ VIẾT KỊCH BẢN *(~90 phút)*

### Điều kiện tiên quyết:
- Dàn ý đã được user duyệt

### Thực hiện:
1. Chạy workflow `/viet-kich-ban` đầy đủ (Bước 1 → Bước 5)
2. Bao gồm:
   - Đọc rules (5 files core + pattern)
   - Viết Script EN (~3,000-4,000 từ, văn xuôi liền mạch)
   - Reddit Synopsis (đầu file)
   - Lời dẫn narrator đầy đủ (10 đoạn — xem bảng bắt buộc trong `/viet-kich-ban`)
   - **BẮT BUỘC:** Mở `00-MASTER-SCHEDULE.md` để viết CTA cuối (teaser tập tiếp theo)
   - Self-Correction Checklist
3. Dịch sang Tiếng Việt
   - Giọng tự nhiên, không word-by-word
   - Giữ nguyên lời dẫn narrator

### Output Phase 3:
- Script EN: `Kich Ban/EN/[PATTERN]/Script-[slug]-EN-V1.md`
- Script VI: `Kich Ban/VI/[PATTERN]/Script-[slug]-VI-V1.md`

### → DỪNG — Chờ user duyệt trước khi review.

---

## PHASE 4 — 🔍 REVIEW + SỬA *(~45 phút)*

### Điều kiện tiên quyết:
- Script EN đã viết xong

### Thực hiện:
1. Chạy workflow `/review` trên file Script EN
   - Đánh giá Universal (A-H) + Pattern-Specific (D-F)
   - Cho điểm từng mục + điểm tổng
2. Trình kết quả review cho user
3. **Nếu Verdict = ⚠️ Cần chỉnh sửa:**
   - Đề xuất fixes cụ thể
   - Sau khi user duyệt → áp dụng fixes
   - Lưu Script sửa EN V2 + cập nhật Script VI V2
4. **Nếu Verdict = ✅ Đạt:** Chuyển sang Phase 5

### Output Phase 4:
- File review: `Review/Review-[slug]-V1.md`
- (Nếu sửa) Script EN V2: `Kich Ban/EN/[PATTERN]/Script-[slug]-EN-V2.md`
- (Nếu sửa) Script VI V2: `Kich Ban/VI/[PATTERN]/Script-[slug]-VI-V2.md`

### → DỪNG — Chờ user duyệt kết quả review + fixes trước khi sang Phase 5.

---

## PHASE 5 — 🎤 TẠO SCRIPT VO *(~45 phút)*

### Điều kiện tiên quyết:
- Script EN đã review xong (V1 hoặc V2)

### Thực hiện:
1. Chạy workflow `/tao-script-note` với input là file Script EN (phiên bản mới nhất)
   - Input: `Kich Ban/EN/[PATTERN]/Script-[slug]-EN-V[latest].md`
2. Bao gồm 3 Phase:
   - **PHASE 1 (ĐỌC):** Emotional Arc Map + Villain Evolution + Sacred Phrases + 8 Yếu Tố
   - **PHASE 2 (CHUẨN BỊ):** Clean text (xóa Reddit Synopsis block, xóa `---`) + Chia files (≤800 từ/file)
   - **PHASE 3 (VIẾT):** Gắn tags + QA Checklist
3. QA: Clean + Tag Quality + Context + ElevenLabs Compatibility + File Check

### Output Phase 5:
- Các file `.txt` trong `Process VO/[slug]/`
- Naming convention: `Part_[X]_-_[NAME].txt` (VD: `Part_1_-_HOOK.txt`, `Part_2_-_TRIGGER.txt`)
- Mỗi file ≤800 từ text thuần, UTF-8
- Sẵn sàng paste vào ElevenLabs

### → DỪNG — Chờ user duyệt VO files trước khi sang Phase 6.

---

## PHASE 6 — 🎬 TẠO TITLE *(~30 phút)*

### Điều kiện tiên quyết:
- Script EN đã review xong (V1 hoặc V2)

### Thực hiện:
1. Chạy workflow `/tao-title` với input là file Script EN (phiên bản mới nhất)
   - Input: `Kich Ban/EN/[PATTERN]/Script-[slug]-EN-V[latest].md`
2. Bao gồm:
   - Extract Key Elements từ Script
   - Generate 5 Title Options (5 formulas)
   - Analyze & Score (Psychology Deep-Dive)
   - Professional Checklist (A-E)
   - Recommend Top Pick
   - Gợi ý Thumbnail

### Output Phase 6:
- 5 gợi ý title + phân tích + recommendation (output trong conversation)
- Gợi ý thumbnail chi tiết (layout, text, nhân vật, màu, props)
- (Tùy chọn) Lưu title vào `Title/Title-[slug]-V1.md` nếu user yêu cầu

---

## ✅ PIPELINE HOÀN THÀNH

### Tóm tắt output sau 6 Phases:

| # | Phase | Output | Vị trí |
|---|-------|--------|--------|
| 1 | Đánh giá idea | File idea + điểm | `Ideas/[Category]/` |
| 2 | Dàn ý | Outline | `Dan Y/[PATTERN]/` |
| 3 | Kịch bản | Script EN + VI | `Kich Ban/EN/` + `Kich Ban/VI/` |
| 4 | Review | Review file + Script V2 (nếu sửa) | `Review/` + `Kich Ban/` |
| 5 | VO Script | Các file .txt | `Process VO/[slug]/` |
| 6 | Title | 5 gợi ý + Thumbnail | Conversation (hoặc `Title/`) |

### Các bước TIẾP THEO (ngoài pipeline này):
- [ ] Generate audio trên ElevenLabs từ VO files
- [ ] Tạo thumbnail trên Canva / AI
- [ ] Cập nhật `00-MASTER-SCHEDULE.md`
- [ ] Upload / Schedule trên YouTube Studio

---

## 🔀 SKIP RULES — User có thể skip Phase

| Trường hợp | Phase skip |
|-------------|-----------|
| Idea đã đánh giá (có file Idea) | Skip Phase 1 |
| Dàn ý đã có (có file Outline) | Skip Phase 1 + 2 |
| Script đã viết (có file Script) | Skip Phase 1 + 2 + 3 |
| Chỉ cần VO | Chỉ chạy Phase 5 |
| Chỉ cần Title | Chỉ chạy Phase 6 |

> Khi skip, user chỉ cần nói: "chạy full-pipeline từ Phase X" hoặc "chạy full-pipeline, đã có outline [file]"

---

## 📌 LƯU Ý QUAN TRỌNG

1. **VO Script dùng file Script EN**. Script EN đã là narrative text thuần — chỉ cần xóa Reddit Synopsis block + `---`.
2. **Title dùng file Script EN**.
3. **Mỗi Phase DỪNG LẠI** — không tự động chạy Phase tiếp. Chờ user confirm.
4. Nếu user muốn chạy nhanh (không dừng): nói "chạy full-pipeline auto" → chạy liên tục, chỉ dừng khi cần sửa.

## ⚠️ ENCODING GUARD — Áp dụng xuyên suốt Pipeline

> **BẮT BUỘC** sau MỖI lần lưu file có tiếng Việt (Script VI, Review VI, Outline VI, v.v.):

1. Đọc lại file vừa lưu bằng `view_file` — kiểm tra dòng đầu tiên
2. Nếu thấy ký tự lạ (`Ä'`, `á»`, `Ã¡`, `Æ°`) → file bị double-encoded
3. Chạy fix: `python _tools/fix_encoding.py --fix --no-backup`
4. Đọc lại lần nữa để xác nhận

> Script `_tools/fix_encoding.py` nằm trong thư mục `_tools/`. Tự động scan + fix tất cả file bị lỗi.
> Nếu tạo file bằng Python script → **BẮT BUỘC** dùng `encoding='utf-8'` trong `open()`.
