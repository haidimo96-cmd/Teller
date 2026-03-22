---
description: Viết kịch bản hoàn chỉnh từ file dàn ý có sẵn
---

// turbo-all

# Viết Kịch Bản Từ Dàn Ý — 4 STEPS

> **Kiến trúc cập nhật (2026-03-19):**
> Tách viết thành 4 steps — mỗi step đọc ÍT rules, focus 1 việc.
> Step 1-2: viết CẤU TRÚC bằng **TIẾNG VIỆT** (cái gì). Step 3: review HÀNH VĂN (tiếng Việt).
> Step 4: Sau khi user duyệt review OK → dịch sang tiếng Anh.
> Files chi tiết trong `rules/core/` giữ nguyên — dùng làm reference khi review.
>
> **🔑 NGUYÊN TẮC QUAN TRỌNG:** Luôn viết bằng TIẾNG VIỆT trước. Chỉ dịch sang tiếng Anh SAU KHI review đã được duyệt OK.

## Quy trình:

### BƯỚC 0: CHUẨN BỊ (chung cho cả 3 steps)

1. **Nhận file dàn ý từ user:**
   - User mention file dàn ý từ folder `Dan Y/`
   - Đọc toàn bộ nội dung file dàn ý
   - Xác định **PATTERN** từ header `PATTERN:` trong file dàn ý

2. **Mở 1 script hoàn chỉnh xem format:**
   - Mở 1 file script đã hoàn chỉnh trong `Kich Ban/VI/` (ưu tiên) hoặc `Kich Ban/EN/` → đọc 20 dòng đầu + 20 dòng cuối
   - Nắm format: **VĂN XUÔI LIỀN MẠCH**, chỉ `---`, không headers/labels/metadata
   - Đọc `rules/script-format-checklist.md` (ngắn, ~60 dòng)

---

### ===== STEP 1: VIẾT HOOK (P1) — TIẾNG VIỆT =====

**⚠️ NGÔN NGỮ: TIẾNG VIỆT**

**Đọc:**
- `rules/script-phases/phase-1-hook.md` (~55 dòng)
- Outline P1 (phần HOOK trong dàn ý)

**Viết (bằng tiếng Việt):**
- Reddit Synopsis (trong `<!-- PRODUCTION ONLY -->`) — viết bằng tiếng Việt
- Villain Confrontation Opening (KT-H10 nếu FURY)
- Narrator greeting + câu hỏi gợi mở + CTA follow
- ~400-600 từ

**Format:**
- Prose liền mạch. Không headers. Không labels.
- Reddit Synopsis → `---` → Thoại villain bắt đầu ngay

**Quy tắc Reddit Synopsis:**
- Format: `<!-- PRODUCTION ONLY -->` ... `<!-- END PRODUCTION ONLY -->`
- Viết như bài post thật trên Reddit, ngôi 1, casual, có twist
- 150-250 từ, tóm tắt toàn bộ câu chuyện nhưng KHÔNG spoil chi tiết hay nhất
- Tất cả patterns đều cần Reddit Synopsis

**Quy tắc Narrator:**
- Lời chào 1 câu, không giới thiệu tên kênh
- Nguồn gốc câu chuyện UNIQUE — kể bối cảnh CÁ NHÂN cách nhận chuyện, KHÔNG rập khuôn
- 2-3 câu hỏi gợi mở (max 2 câu liên tiếp)
- CTA nhẹ nhàng
- Transition vào P2

**Quy tắc Teaser (sau hook, trước narrator):**
- ❌ KHÔNG spoil danh tính bí mật, nghề, kết quả, phương pháp phản công
- ✅ Dùng 2-3 câu hỏi gợi mở, mỗi câu KHÁC cấu trúc, không lặp từ mở đầu
- ✅ Binary choice rất mạnh: "đó là X, hay Y?"

**1B. SUB-REVIEW HOOK:**
- Đọc `.agent/workflows/review-rulebook/hook-review.md`
- Rà soát hook theo checklist, **sửa trực tiếp** trước khi gửi user
- Focus: Hook 3-step, Villain Line, Macro Question, KT-H1→H10, teaser, narrator

→ **Dừng. Gửi hook (tiếng Việt) cho user duyệt.**

---

### ===== STEP 2: VIẾT BODY (P2-P9) — TIẾNG VIỆT =====

**⚠️ NGÔN NGỮ: TIẾNG VIỆT**

**Đọc:**
- **1 file phase-2-body theo pattern** (xác định từ dàn ý):
  - 🔥 FURY → `rules/script-phases/phase-2-body-fury.md`
  - 🧠 STRATEGY → `rules/script-phases/phase-2-body-strategy.md`
  - 😂 COMEDY → `rules/script-phases/phase-2-body-comedy.md`
- Outline P2-P9

**Viết (bằng tiếng Việt):**
- Setup (P2-P3): Origin + Villain
- Escalation (P4-P6): Destruction → Point of No Return → Build
- Climax + Ending (P7-P9): Showdown → Resolution → Closure
- ~3,500-4,500 từ

**Format:**
- Prose liền mạch. Chỉ `---` ngăn sections (chuyển bối cảnh/thời gian).
- Narrator nói tự nhiên TRONG dòng — không label
- CTA viết liền cuối — không tách block
- Tuân thủ tỷ lệ từ mỗi phân đoạn trong dàn ý

**Lời dẫn narrator BẮT BUỘC (viết sẵn, xen tự nhiên):**

| Vị trí | Nội dung |
|--------|----------|
| ~40-50% | **Engagement Pause** — vẽ tranh trước, rồi hỏi viewer câu hỏi LỰA CHỌN |
| ~50-60% | **Punchline giữa** — narrator tổng kết irony |
| Sau climax | **Punchline hồi đáp** — narrator đúc kết đối lập |
| Kết | **CTA cuối** — subscribe + teaser tập tiếp theo (cụ thể, KHÔNG sáo rỗng) |
| Kết | **Câu đóng** — callback hoặc memorable line |

**Visual Writing (AI visual + VO):**
- 1 Câu = 1 Hình — mỗi câu gợi 1 hình ảnh AI generate được
- Concrete nouns > abstract nouns
- Active verbs > passive verbs
- Object anchoring — mỗi scene có 1 vật thể focal point
- Character-in-space — nhân vật TRONG bối cảnh vật lý

**Villain Opening Line (3b-1):**
- Phải TRỊCH THƯỢNG, ngông cuồng, xúc phạm — KHÔNG bureaucratic lạnh
- Có ACTION VERB + đe doạ/khinh thường TRỰC TIẾP
- Khinh thường CÔNG SỨC hero cụ thể
- Test: Đọc câu villain đơn lẻ → không trigger cảm xúc → viết lại

**2B. SUB-REVIEW BODY:**
- Đọc **1 file** theo nhóm pattern:
  - 🔥 FURY → `.agent/workflows/review-rulebook/body-fury.md`
  - 🧠 STRATEGY → `.agent/workflows/review-rulebook/body-strategy.md`
  - 😂 COMEDY → `.agent/workflows/review-rulebook/body-comedy.md`
- Rà soát body theo checklist, **sửa trực tiếp** trước khi gửi user
- Focus: Craft (KT1-KT16), Pacing, Mini Arcs, Pattern-specific (Climax/Cliffhanger), Character

→ **Dừng. Gửi body (tiếng Việt) cho user duyệt nội dung + cấu trúc.**

---

### ===== STEP 3: GHÉP + FINAL REVIEW =====

> **Lưu ý:** Hook đã sub-review ở Step 1B. Body đã sub-review ở Step 2B.
> Step này chỉ check FORMAT, CONSISTENCY, và rules cần TOÀN BỘ SCRIPT.

**Đọc:**
- `.agent/workflows/review-rulebook/final-review.md`
- `rules/script-format-checklist.md` — Format
- `rules/script-wording-formula.md` — Bảng sửa lỗi từ ngữ VI

**Làm:**

**3A. GHÉP VI:**
- Ghép Hook (Step 1) + Body (Step 2) → 1 file liền mạch **tiếng Việt**
- Lưu: `Kich Ban/VI/[PATTERN]/Script-[slug]-VI-V1.md`

**3B. FINAL REVIEW theo `final-review.md`:**
- Check transitions giữa hook → P2 → P9 (mượt, không giật)
- Check format: prose liền, chỉ `---`, không headers/labels
- Full-script rules: KT5 Motif Callback, KT11 Numbers, KT12 Terminology, KT14 Dialogue Callback
- Anti-patterns quét toàn script
- Kiểm tra bảng sửa lỗi từ ngữ (`rules/script-wording-formula.md`)
- Sửa trực tiếp

**3C. ENCODING CHECK (VI):**
- Đọc lại file VI → kiểm tra encoding
- Nếu mojibake → chạy `python _tools/fix_encoding.py --fix --no-backup`

→ **Gửi script VI cho user duyệt.**
→ **🛑 DỪNG LẠI. KHÔNG tự động dịch sang tiếng Anh.**
→ **Chờ user xác nhận review OK + ra lệnh dịch EN mới tiếp tục Step 4.**

---

### ===== STEP 4: DỊCH SANG TIẾNG ANH (CHỈ KHI USER RA LỆNH) =====

> **⚠️ KHÔNG tự động chạy step này. Chỉ bắt đầu khi user nói "dịch EN", "chuyển sang tiếng Anh", hoặc tương tự.**

**Đọc:**
- File VI đã duyệt: `Kich Ban/VI/[PATTERN]/Script-[slug]-VI-V*.md`
- `rules/script-format-checklist.md`

**Làm:**

**4A. DỊCH VI → EN:**
- Dịch VI → EN (không dịch máy, **viết lại tự nhiên** bằng tiếng Anh)
- Giữ nguyên cấu trúc, lời dẫn narrator, format
- Đảm bảo dialogue tự nhiên bằng tiếng Anh (không dịch sát từng từ)
- Lưu: `Kich Ban/EN/[PATTERN]/Script-[slug]-EN-V1.md`

**4B. REVIEW NHANH EN:**
- Check tense consistency (present tense narration)
- Check dialogue tự nhiên bằng tiếng Anh
- Check format: prose liền, chỉ `---`, không headers/labels
- Sửa trực tiếp nếu có vấn đề

→ **Gửi script EN cho user duyệt.**

---

## Pacing & Sentence Guidelines (tham khảo nhanh)

| Context | Câu | Ví dụ |
|---------|-----|-------|
| Impact / shock | 2-5 từ | "She was twenty-one." |
| Shock + number | 3-8 từ | "Sold for $3,500." |
| Setup / context | 12-20 từ | "The family had just moved into their first home..." |
| Narrative flow | 15-25 từ | "When the letter arrived, she didn't open it for three days." |
| MAXIMUM | ≤30 từ | Dài hơn → BẮT BUỘC split |

Rhythm: `Long → Medium → SHORT. Repeat.`

---

## Tone Map (tham khảo nhanh)

| Phần | Tone |
|------|------|
| Hook | Provocative, stop the scroll |
| Setup | Conversational, relatable |
| Villain intro | Ominous, controlled anger |
| Escalation | Rising intensity, faster |
| **Emotional climax** | **QUIET, slow, deliberate** |
| Comedy beats | Wry, sarcastic |
| Closing | Reflective, empowering |

---

## Input cần thiết:
- File dàn ý từ folder `Dan Y/` (format: `Outline-[slug]-V1.md`)
- (Tùy chọn) Yêu cầu đặc biệt (thay đổi tone...)

## Output:
- **Step 1-3:** Kịch bản VI: `Kich Ban/VI/[PATTERN]/Script-[slug]-VI-V1.md` (viết trước, review trước)
- **Step 4 (khi user ra lệnh):** Kịch bản EN: `Kich Ban/EN/[PATTERN]/Script-[slug]-EN-V1.md`

## Quy trình ngôn ngữ:

> 🔑 **LUÔN viết tiếng Việt trước** → Review tiếng Việt → User duyệt OK → Chờ lệnh → Dịch sang tiếng Anh
> KHÔNG bao giờ tự động dịch EN mà không có lệnh từ user.

## Lưu ý format:

> **Script** = VĂN XUÔI LIỀN MẠCH, có lời dẫn narrator xen kẽ, KHÔNG tags, KHÔNG headers
> Script là file chính dùng cho cả Review, VO, và Title — không cần file Final riêng.
> Đọc `rules/script-format-checklist.md` TRƯỚC MỖI LẦN viết.

## ⚠️ ENCODING GUARD

> BẮT BUỘC cho mọi file tiếng Việt.
> Sau lưu → đọc lại → nếu mojibake → `python _tools/fix_encoding.py --fix --no-backup`
