---
description: Tạo dàn ý (outline) chi tiết cho kịch bản storytelling YouTube
---

// turbo-all

# Tạo Dàn Ý Kịch Bản — 2 STEPS

> **Cập nhật (2026-03-19):**
> Tách thành 2 steps. Chỉ đọc rules CẦN cho outline — KHÔNG đọc writing-craft hay must-avoid (đó là cho viết script).
> Outline = tài liệu kỹ thuật chuẩn bị, KHÔNG phải tác phẩm sáng tạo.

## Quy trình:

### BƯỚC 0: CHUẨN BỊ

1. **Nhận input từ user:**
   - User cung cấp câu chuyện gốc (link, text, hoặc mô tả)
   - Hoặc file idea từ `Ideas/`

2. **Xác định Story Pattern:**
   - 🔥 FURY / 🧠 STRATEGY / 😂 COMEDY
   - ⚖️ Moral Dilemma / 💛 Heartwarming / 🔍 Mystery
   - Nếu HOA → đọc thêm `Story Patterns/[sub-genre].md`

> **CHỈ ĐỌC 2 files trước khi bắt đầu:**
> 1. `rules/core/story-prep.md` — Character Blueprint, Object, Forces, Hypocrisy (Step 1)
> 2. `rules/core/structure-and-technique.md` — Mini Arc, Therefore Test, Object System (Step 2)
>
> **KHÔNG ĐỌC ở bước này:**
> - ❌ `Cau truc final/` — đó là hướng dẫn viết script, đã nằm trong phase rules của `/viet-kich-ban`
> - ❌ `writing-craft.md` — cho viết script
> - ❌ `must-avoid-elements.md` — cho viết script
> - ❌ `hook-and-opening.md` — cho viết script
>
> *(Tham khảo nếu cần)* `lessons-from-writing.md`, `research_squampopulous_underdog.md`

---

### ===== STEP 1: STORY PREP + CHARACTER + INVENTORY =====

**Đọc:**
- `rules/core/story-prep.md` (~366 dòng)
- File idea (nếu có)
- `Story Patterns/[sub-genre].md` (nếu HOA)

**Làm:**

#### 1A. Story Preparation

- **Ticking Clock** — countdown/deadline của câu chuyện
- **Binary Forces** — X vs Y (core conflict)
- **Object** — vật thể cảm xúc, chọn loại theo pattern
- **Transitional State** — nhân vật đang ở trạng thái chuyển đổi nào
- **POV Audit** — "Góc nhìn này tốt nhất chưa?"
- **Promise-Break** (tùy chọn) — cơ hội villain hứa → phản bội?
- **Hypocrisy Angle** (khuyến khích cho HOA) — villain enforce rule mà bản thân vi phạm?

#### 1B. Character Blueprint (3 C's)

**Hero:**
- 3-5 traits + ít nhất 1 cặp interplay (mâu thuẫn/bổ sung)
- Flaw: trait gốc → extreme → flaw — gây vấn đề ở Part nào?
- Motivation: "Hero [hành động] vì [___]"

**Villain:**
- 3-5 traits + conviction (tin mình đúng)
- Flaw → conviction → iconic line pipeline
- Motivation: "Villain [hành động] vì bà ta TIN rằng [___]"

**Allies + Bystanders:** Liệt kê nhanh

#### 1C. Story Inventory Mining

Fill template (không bỏ sót tình tiết hay):

```markdown
## STORY INVENTORY: [Tên story]

### CHARACTERS
- Hero: [Tên, tuổi, nghề, hoàn cảnh đặc biệt]
  - Traits: / / / Flaw: / Motivation:
- Villain: [Ai, vai trò, quote ghê tởm nhất]
  - Traits: / / / Conviction: / Motivation:
- Allies: [Ai, lý do cá nhân]

### NUMBERS (≥3 con số cụ thể)
- Tiền: $___  |  Thời gian: ___  |  Số lượng: ___
- Contrast lớn nhất: $___ vs $___

### KEY OBJECTS & DOCUMENTS
- Vật tranh chấp: ___
- Emotional Object: ___
- Evidence Trail (STRATEGY): Doc 1 → Doc 2 → Doc 3 → Doc 4

### IRONY / CONTRAST (≥1)
- Ridiculous nhất: ___
- Good deed punished? ___

### DIALOGUE CALLBACK (BẮT BUỘC)
- Câu callback: "___"
- Lần 1 (gieo): Villain nói ở Part? — ngữ cảnh: ___
- Lần 2 (nuôi): Hero nhớ/dùng ở Part? — ngữ cảnh: ___
- Lần 3 (gặt): Hero nói lại ở Part? — ngữ cảnh: ___
- Hero Signature Line: "___" (hoặc NONE)

### TOP 3 VISUAL MOMENTS
1. [Mô tả cảnh — ai, ở đâu, đang làm gì]
2. [...]
3. [...]

### EMOTIONAL PEAK
- Viewer sẽ GASP: ___
- Đặt ở ~75-85% script

### DOUBLE-DOWN INJUSTICE (nếu có)
- Layer 1: ___  |  Layer 2: ___  |  Layer 3: ___

### COMEDY ENCORE (tùy chọn)
- Phù hợp? [có/không]  |  Scene: ___  |  Punchline: "___"
```

> Nếu Story Inventory thiếu >50% fields → idea chưa đủ chất liệu → research thêm.

→ **Dừng. Trình Story Prep + Inventory cho user xác nhận TRƯỚC KHI lên arc.**

---

### ===== STEP 2: ARC MAP + OUTLINE HOÀN CHỈNH =====

**Đọc:**
- `rules/core/structure-and-technique.md` (~374 dòng — Mini Arc, Therefore, Object System)
- `rules/outline-creator.md` (format đầu ra)

**Làm:**

#### 2A. Mini Arc Mapping

- Chia câu chuyện thành mini arcs (mỗi Part ≈ 1 arc)
- Viết **QUESTION** (mở arc) và **MINI CLIMAX** (đóng arc) cho mỗi Part
- Viết **→ THEREFORE:** giữa mỗi arc (lý do nhân quả)
- Kiểm tra **leo thang**: Mini Climax N+1 > Mini Climax N
- Mỗi Part có **Visual Notes:**

```markdown
### Part [X]: [Tên]
- Word budget: ~XXX từ (~X% tổng)
- Arc Question: ...
- Mini Climax: ...
- → THEREFORE: ...
- **Visual Notes:**
  - Key image: [mô tả cảnh dễ hình dung nhất]
  - Object close-up: [vật thể focal]
  - Emotion shot: [biểu cảm nhân vật]
```

#### 2B. Retention Hook Map

Map retention hooks theo timeline:

| Phút ước tính | Hook Type | Nội dung hook |
|---------------|-----------|---------------|
| 0:00-0:30 | Villain-First / Number Shock | [câu mở đầu gây sốc] |
| ~2:00 | Shock reveal | [bất công đầu tiên + con số] |
| ~4:00 | Open loop | [câu hỏi chưa trả lời] |
| ~6:00 | Escalation tease | "Nhưng đó chưa phải tệ nhất" |
| ~8:00 | Comedy beat / Relief | [humor hoặc narrator reaction] |
| ~10:00 | Double-down injustice | [stack bất công] |
| ... | ... | ... |

**Rule: Mỗi 90-120 giây ≥1 hook.** Khoảng trống >120s → thêm hook hoặc rút ngắn.

#### 2C. Emotional Ladder Verification

- [ ] Climax mạnh nhất ở **75-85% script** (không đầu, không cuối)?
- [ ] Scene đầu tiên = mild-moderate (entry-level)?
- [ ] ≥1 comedy/relief beat giữa 2 emotional peaks?
- [ ] Emotional variety? (anger + sadness + humor + shock)
- [ ] Victim hierarchy tối ưu? (elderly/children/disabled = max sympathy)

#### 2D. Character Blueprint Verification (3 C's)

- [ ] Hero ≥3 traits? ≥1 cặp interplay?
- [ ] Villain ≥3 traits? Traits tạo conviction?
- [ ] Hero flaw organic (từ extreme trait)?
- [ ] Villain flaw → conviction → iconic line?
- [ ] Traits được plan SHOW ≥2 lần trước climax?

#### 2E. Tạo file outline

- Format theo `rules/outline-creator.md`
- Gồm: Story Prep + Inventory + Mini Arc Map + Visual Notes + Retention Map + Emotional Ladder
- Lưu: `Dan Y/[PATTERN]/Outline-[slug]-V1.md`
- Nếu chỉnh sửa → tăng version: V2, V3...

→ **Trình outline hoàn chỉnh cho user duyệt.**

---

## So sánh: Cũ vs Mới

| | Cũ | Mới |
|--|---|-----|
| Rules đọc | 5 core files + pattern + lessons (~3,500+) | 2-3 files cần thiết (~700-1,100) |
| Steps | 1 pass lớn | 2 steps (prep → arc) |
| User duyệt | 1 lần cuối | 2 lần (sau prep, sau outline) |
| Không đọc | — | writing-craft, must-avoid, hook-opening (cho script) |

## Output:
- File dàn ý: `Dan Y/[PATTERN]/Outline-[slug]-V1.md`
- Gồm: Story Prep + Inventory + Mini Arc Map + Visual Notes + Retention Map + Emotional Ladder
- Sẵn sàng cho `/viet-kich-ban`
