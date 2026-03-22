---
description: "Nguyên tắc chèn tags + Mật độ tags theo section — Script Note VO (Phần 3/4)"
activation: manual
---
# 🎙️ SCRIPT NOTE — TAGGING RULES (Phần 3/4)

> Cách chèn tags vào text: đầu dòng, mid-sentence, dialogue, pauses, breathing, CAPS, và narrator context analysis.
>
> **Xem thêm:** Foundations → `vo-foundations.md` | Tags Reference → `vo-tags-reference.md` | Anti-patterns & QA → `vo-anti-patterns-qa.md`

---

# 5. NGUYÊN TẮC CHÈN TAGS

## 5.1. Tag đầu dòng — ƯU TIÊN SINGLE-WORD, compound làm option
```
✅ TỐT NHẤT: [cold] "Take that rag down..."
✅ TỐT:      [cold] [thoughtful] "Take that rag down..."  (2 single tags liên tiếp)
⚠️ ĐƯỢC:     [cold, deliberate] "Take that rag down..."  (compound — kém hơn theo docs)
```
- MỖI dòng (paragraph/beat) = 1-2 tag ở đầu → set tone tổng thể
- **Ưu tiên 1 từ**: `[cold]`🟡, `[excited]`, `[thoughtful]` — ElevenLabs phản hồi tốt nhất
- **2 single tags liên tiếp** nếu cần nuance: `[cold] [thoughtful]` = cold nhưng suy tư
- Compound `[emotion, style]` = fallback nếu single tags không đủ diễn đạt
- **Tier 1 tags** (§4.1): luôn dùng official (VD: `[flatly]` thay `[deadpan]`, `[sarcastic]` thay `[wry]`)

## 5.2. Tag mid-sentence — Shift SAU MỖI dấu chấm / dấu phẩy

> **NGUYÊN TẮC MỚI:** Trong cùng 1 dòng, tag thay đổi SAU MỖI câu (sau dấu chấm/dấu phẩy) để tạo dynamics giọng đọc. Mỗi dòng có 2-4 tag shifts.

### Pattern chuẩn:
```
[TAG_đầu] Câu đầu tiên. [TAG_mới] Câu thứ hai, [TAG_mới] Câu thứ ba... [inhales]
```

### Ví dụ thực tế:
```
[cold] "Take that rag down... [tense] Right now, [calculating] or it's a hundred dollars a day until you do... [inhales]"
```
→ 3 câu = 3 tag khác nhau: `cold` → `tense` → `calculating`
→ Cường độ thay đổi: Lạnh → Căng → Tính toán

### Ví dụ thực tế (Hero Physical Reaction):
```
[reflective] My heart was pounding... [cold] Ears burning, [tense] fists clenched so tight my nails dug into my palms.
```
→ 3 câu ngắn, 3 tag khác nhau → nhịp dồn dập, mỗi câu TĂNG cường độ

### QUY TẮC mid-sentence tag:
- Đặt tag SAU dấu phẩy/ba chấm, TRƯỚC text mới: `, [tag mới] Text tiếp...` hoặc `... [tag mới] Text tiếp`
- KHÔNG đặt tag giữa 2 từ trong 1 câu: ❌ `She [cold] pointed at...`
- Tag mid-sentence = SINGLE WORD: `[calculating]`, `[ominous]`, `[amused]`
- `...` + Tag đi CẶP: `... [cold]` — tạo pause nhẹ rồi shift tone

## 5.3. Dialogue — Tag trước quote + shift giữa quote
```
[cold] "Take that rag down... [tense] Right now, [calculating] or it's a hundred dollars a day..."
```
- Dialogue DÀI: tag shift SAU MỖI câu trong quote (giống narrative)
- Dialogue NGẮN (1 câu): chỉ cần 1 tag đầu

### 🆕 Tag dialogue PHẢI phản ánh nhân vật + context (tier-aware):
- **Villain controlling**: `[cold]`🟡, `[flatly]`, `[calculating]`, `[deliberate]`
- **Villain vulnerable** (late-story): `[vulnerable]`🟠, `[genuine]`🟠, `[quiet]`🟡 ← villain EVOLVES
- **Hero emotional**: `[sad]`, `[crying]`, `[tender]`🟡
- **Hero trolling (COMEDY)**: `[playfully]`, `[knowing]`🟡, `[flatly]`
- **Child speaking**: `[excited]`, `[lighthearted]`
- **Sacred phrases**: `[intimate]`🟡 — lặp lại CÙNG tag mỗi lần (mirrored)

### 🆕 Character Evolution — Villain KHÔNG flat:
- Villain phải thay đổi tag theo arc: `[cold]`🟡 (mở) → `[vulnerable]`🟠 (giữa) → `[genuine]`🟠 (kết)
- Ví dụ Patricia: B-2 = `[cold] [deliberate]` → C-4 interview = `[vulnerable]` → E resign = `[genuine]`
- Không dùng CÙNG 1 FAMILY TAG cho villain từ đầu đến cuối

## 5.4. Pauses — CHỈ dùng punctuation (không pause tags) ⚠️

> **Lý do:** Eleven v3 KHÔNG có speed control. Mọi pause tag (`...` + xuống dòng, `[short pause]`, `[pause]`) đều làm v3 chậm rõ rệt.
> **Giải pháp:** Dùng punctuation thay thế — v3 đã xử lý pause tự nhiên qua dấu câu.

```
✅ ĐÚN G: "She pointed at the flag... [inhales] Then at my face."
✅ ĐÚN G: "Câu 1... [tag mới] Câu 2, [tag mới] Câu 3... [inhales]"
❌ SAI:  "She pointed [short pause] at the [short pause] flag."
❌ SAI:  "[long pause] [long pause] [long pause]"
❌ SAI:  "Câu 1. [long pause] [tag] Câu 2." (long pause QUÁ DÀI trên v3)
```

**Pattern pause (không pause tags):**
`,` (nhanh) → `...` (chậm hơn) → xuống dòng (chậm nhất) → `... [inhales]` (dramatic nhất)

**Vị trí pause hợp lý:**
- Sau reveal/shock: `...` + xuống dòng
- Sau action, trước dialogue: `...`
- Trước reveal / twist: `...`
- Scene transition: xuống dòng mới
- Cuối ý nhẹ: `...`
- Giữa chuỗi: `,`

## 5.5. Breathing — Đi cặp với pause cuối chuỗi
```
✅ ĐÚNG: "...until you do... [inhales]"  → cuối chuỗi
✅ ĐÚNG: "Page fourteen. Section B. [inhales] My eyes caught the header."
❌ SAI:  "I pay my dues. [inhales] I mow. [inhales] I bring trash in. [inhales]"
```
- `[inhales]` thường đi cuối chuỗi: `... [inhales]` → signal "chuẩn bị câu tiếp"
- `[inhales sharply]` chỉ dùng 1 lần trước BIG moment (thay `[inhales deeply]`)
- Tổng breathing tags: 3-5 / file

### ⚠️ QUY TẮC BỔ SUNG: Câu DÀI (>15 từ hoặc >100 ký tự) → BẮT BUỘC 1 breathing tag

Đặt **giữa câu** tại vị trí tự nhiên nhất: sau dấu phẩy, dấu gạch ngang, hoặc sau cụm từ hoàn chỉnh.

```
# ✅ ĐÚNG — câu dài có breathing tag giữa
"She had built her entire career on the HOA board — [exhales] twenty years of meetings, fines, and rules."
"He read the letter once, then twice, [sighs] and finally understood what they were really trying to take."
"Every single fine they issued, [exhales] every letter they sent, every threat they made — ILLEGAL."

# ❌ SAI — câu dài không có breathing tag
"She had built her entire career on the HOA board — twenty years of meetings, fines, and rules."
```

**Layering (kết hợp breathing + emotion):**
```
[nervous][stammers] — Vừa lo lắng vừa lắp bắp
[exhales sharply][angry] — Thở mạnh khi nổ giận
[inhales sharply][quiet] — Hít mạnh trước gut punch (🟡 Tier 2)
```

### 📊 Mật độ breathing theo độ dài đoạn

| Độ dài đoạn | Số breathing tags |
|-------------|-------------------|
| 1-3 câu ngắn (<15 từ mỗi câu) | 0 (không cần) |
| 1 câu dài (>15 từ) | 1 (bắt buộc giữa câu) |
| 2-3 câu dài | 1-2 |
| Đoạn 100-200 từ | 2-3 |

### ❌ KHÔNG bao giờ:
- Mở đầu đoạn văn bằng breathing tag thay emotion tag
- Dùng breathing tag ở câu bình thường ngắn (<15 từ)
- Thay thế pause tag bằng breathing tag
- Dùng quá 3 breathing tags trong 1 đoạn

## 5.6. CAPS Emphasis — Nhấn mạnh bằng IN HOA

> **Nguồn v3 docs:** *"Capitalization increases emphasis"*
> CAPS là kỹ thuật nhấn mạnh CHÍNH THỨC của Eleven v3 — dùng cho từ/cụm từ cần narrator nhấn giọng.

### Quy tắc chung:
```
✅ ĐÚNG: "permitted for UNRESTRICTED INSTALLATION" — keyword pháp lý
✅ ĐÚNG: "She was NOT sorry" — emphasis phủ định
✅ ĐÚNG: "It was a VERY long day" — nhấn mạnh trạng từ (ví dụ từ v3 docs)
✅ ĐÚNG: "EVERY fine they issued... ILLEGAL" — emphatic, dramatic
❌ SAI:  "SHE WALKED INTO THE ROOM AND SAT DOWN" — caps cả câu = mất hiệu lực
```

### Khi nào dùng CAPS:
- **Từ khóa pháp lý / số liệu:** `FORECLOSURE`, `ILLEGAL`, `FORTY-FIVE HUNDRED`
- **Từ phủ định nhấn mạnh:** `NOT`, `NEVER`, `NO`, `NOTHING`
- **Trạng từ nhấn mạnh:** `EVERY`, `STILL`, `ALWAYS`, `VERY`
- **Key reveals / twists:** `WRONG target`, `ABSOLUTE`, `ILLEGAL`
- **Narrator lên giọng / dramatic:** dùng CAPS cho 1-2 từ THEN CHỐT trong câu

### 🆕 Verb Emphasis — Câu mệnh lệnh / đe dọa / phẫn nộ / quyết liệt

> **Nguyên tắc:** Trong câu mang tính **khẳng định, quyết liệt, đe dọa, cau có, phẫn nộ** thì CAPS cả **ĐỘNG TỪ** lẫn **từ bổ ngữ then chốt** để tạo nhịp nhấn nhá.
>
> **Pattern:** `VERB ... từ thường ... COMPLEMENT` — narrator tự nhiên nhấn giọng ở 2 điểm.

```
# Câu mệnh lệnh / đe dọa (villain):
[cold] "TAKE that pole DOWN."
[cold] "REMOVE it or I'll FINE you every day."
[cold] "You have thirty days to COMPLY."
[cold] "Your three minutes are UP."

# Câu phẫn nộ / quyết liệt (hero/narrator):
[determined] "I am NOT BACKING DOWN."
[determined] "He REFUSED to take it DOWN."
[angry] "You can't TAKE my FLAG."
[determined] "We are going to FIGHT this."

# Câu khẳng định mạnh (narrator):
[cold] "She RUNS this neighborhood."
[ominous] "She has NO idea what she STARTED."
[dark] "And she has no idea what it COSTS her."
[awe] "EVERY fine they issued, ILLEGAL."
```

**Cách phân tích trước khi CAPS:**
1. Câu này mang tính gì? Mệnh lệnh? Đe dọa? Phẫn nộ? Quyết liệt? Khẳng định?
2. Nếu CÓ thì CAPS **động từ chính** + **1 từ bổ ngữ then chốt**
3. Nếu KHÔNG (câu mô tả, tường thuật thường) thì **KHÔNG CAPS**

### Giới hạn:
- **KHÔNG in hoa cả câu** — chỉ 1-3 từ THEN CHỐT trong câu
- **Mỗi part (~400-600 từ):** khuyến nghị 5-8 CAPS moments
- CAPS nên rải đều — KHÔNG dồn hết vào 1 đoạn
- Câu thường/mô tả thì KHÔNG CAPS dù có động từ mạnh

### Tổng hợp 5 loại CAPS:
```
# 1. Verb Emphasis (mệnh lệnh/đe dọa):
"TAKE that pole DOWN." "REMOVE it NOW."

# 2. Narrator emphatic (khẳng định/phẫn nộ):
"EVERY single fine, ILLEGAL." "She has NO idea." "He REFUSED."

# 3. Key number / legal reveal:
"Total: FORTY-FIVE HUNDRED dollars."

# 4. Dramatic emphasis:
"The law is ABSOLUTE." "They picked the WRONG target."

# 5. Breathing + CAPS (turning point):
[exhales sharply] FORECLOSURE. [inhales sharply] NOT today.
```

## 5.7. 🆕 NARRATOR CONTEXT ANALYSIS — Bước BẮT BUỘC trước khi gắn tag

> **TRƯỚC khi gắn tag bất kỳ đoạn nào, PHẢI trả lời 4 câu hỏi:**

### 4 câu hỏi bắt buộc:
1. **Context**: Đoạn này kể về gì? Tại sao nó quan trọng trong story?
2. **Narrator Mindset**: Narrator đang CẢM THẤY gì khi kể đoạn này? (vui? buồn? amused? angry? awed?)
3. **Tone**: Giọng kể chính xác — narrator nói CHO AI? (bạn bè? audience? bản thân?)
4. **Pacing**: Nhịp nhanh hay chậm? Đoạn này cần KHÔNG GIAN hay cần MOMENTUM?

### Ví dụ:
```
❌ KHÔNG phân tích:
Đoạn Victor backstory → `[calm, matter-of-fact]` → sai vì tag trung tính cho đoạn cảm xúc nhất

✅ CÓ phân tích:
Context: Victor gọi Rosa "Flamingo" 40 năm — TIM của câu chuyện
Narrator Mindset: "Đây là phần tôi muốn kể NHẤT" — narrator cũng xúc động
Tone: Thì thầm, intimate, như ông bà kể chuyện
Pacing: CHẬM NHẤT toàn story — mỗi câu cần không gian
→ Tags: [tender], [intimate], [warm, gentle], [quiet], [whispers]
```

### Cần đặc biệt chú ý các đoạn:
- **Sacred phrases** ("Buenos días, Flamingo"): dùng `[intimate]` — CÙNG tag mỗi lần lặp (mirrored)
- **Tonal shifts** (vui → buồn trong 1 câu): tag PHẢI shift theo — VD: `[amused]` → `[quiet]`
- **Punchlines** (comedy drops): dùng `[deadpan]` — delivery nghiêm nhưng content funny
- **Gut punches** ("Empty.", "Stops."): dùng `[quiet]` — 1 từ, 1 tag, im lặng

---

# 6. MẬT ĐỘ TAGS THEO SECTION

| Section | Tag shifts / dòng | Emotion intensity | Breathing | Pause pattern |
|---------|------------------|-------------------|-----------|---------------|
| **Hook** | 3-4 shifts | 🔴 Cao | 2-3 `[inhales]` | `...` + xuống dòng (1x) → `,` → `...` |
| **Background** | 2-3 shifts | 🟡 Trung bình | 0-1 | `...` chủ yếu |
| **Villain Intro** | 3-4 shifts | 🔴 Cao | 1 `[sighs]` | `...` + xuống dòng (1x) → `,` → `...` |
| **Escalation** | 3-5 shifts | 🟠 Tăng dần | 1-2 | `...` + xuống dòng (1x) → `,` → `...` dồn dập |
| **Twist/Reveal** | 4-5 shifts | 🔴🔴 Max | 1 `[inhales sharply]` | `...` + xuống dòng (1x) + `...` |
| **Climax** | 3-4 shifts | 🔴 Cao | 1 `[exhales sharply]` | `...` + xuống dòng (1x) → `...` |
| **Aftermath** | 2-3 shifts | 🟢 Hạ | 1 `[exhales]` | `...` chủ yếu |
| **Epilogue** | 1-2 shifts | 🟢 Ấm | 0-1 | `...` nhẹ |
| **CTA** | 1-2 shifts | 🟡 Conversational | 0 | `...` nhẹ |
