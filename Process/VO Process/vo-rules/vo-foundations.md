---
description: "Nguyên tắc nền tảng + Clean text + Chia file — Script Note VO (Phần 1/4)"
activation: manual
---
# 🎙️ SCRIPT NOTE — FOUNDATIONS (Phần 1/4)

> Chuyển kịch bản final (EN) → Các file .txt có audio tags → sẵn generate voice trên ElevenLabs Eleven v3.
> Output: folder `Process VO/`
>
> **Xem thêm:** Tags Reference → `vo-tags-reference.md` | Tagging Rules → `vo-tagging-rules.md` | Anti-patterns & QA → `vo-anti-patterns-qa.md`

---

# 1. NGUYÊN TẮC NỀN TẢNG

## 1.1. ElevenLabs v3 đọc MỌI THỨ trong text
- Bất kỳ chữ nào trong file → sẽ bị đọc thành tiếng
- Tags trong `[brackets]` → v3 hiểu là chỉ dẫn diễn xuất, KHÔNG đọc ra
- **Hệ quả:** Mọi metadata, heading, technical note, markdown phải XÓA SẠCH

## 1.2. Tags = gia vị, không phải nguyên liệu chính
- Text script = chính. Tags = hỗ trợ delivery
- Tags phải tạo được DYNAMICS (thay đổi cường độ) chứ không phải noise
- Quá ít tags → giọng phẳng, thiếu cảm xúc

## 1.3. Dual-Tag + Mid-Sentence Shift
- Tag đầu dòng = **2 từ kết hợp** [Emotion, Delivery Style] → set tone tổng
- Sau mỗi dấu chấm/dấu phẩy → **shift tag mới** kèm `,` hoặc `...` → tạo nhịp đọc sống động (⚠️ KHÔNG dùng `[short pause]`)
- Mỗi dòng có 2-4 tag shifts — KHÔNG giữ 1 tone suốt cả đoạn dài
- 1 scene = 1 tonal family. Tag shifts nên đi theo 1 HƯỚNG (leo thang / hạ nhiệt)

## 1.4. ⚠️ Tag = CẢM XÚC NARRATOR khi kể, KHÔNG phải mô tả text
> **Nguyên tắc quan trọng nhất.** Tag phải trả lời câu hỏi: **"Narrator ĐANG CẢM THẤY gì khi kể câu này?"** — không phải "text này nói về chủ đề gì?".

- ❌ SAI: Đoạn Patricia đo flamingo → `[analytical]` `[methodical]` (mô tả HÀNH ĐỘNG Patricia)
- ✅ ĐÚNG: Narrator thấy cảnh Patricia absurd → `[amused]` (cảm xúc NARRATOR)
- ❌ SAI: Backstory Victor → `[calm, matter-of-fact]` (tag trung tính cho đoạn cảm xúc nhất)
- ✅ ĐÚNG: Narrator đang kể phần thích nhất → `[tender]` `[intimate]` (narrator cũng xúc động)

**Quy trình đúng:**
1. Đọc câu → hỏi: narrator MUỐN story này TÁC ĐỘNG VIEWER thế nào?
2. Chọn tag = CÁCH narrator kể (giọng nào, cường độ nào, cảm xúc nào)
3. KHÔNG copy tag từ 1 pattern sang pattern khác (VD: FURY tags cho COMEDY = sai)

---

# 2. XỬ LÝ TEXT — CLEAN SCRIPT

## 2.1. XÓA hoàn toàn (sẽ bị ĐỌC ra nếu giữ)
- ❌ Metadata đầu file: Genre, Target Length, Duration, Audience, Tone, Viral Hooks
- ❌ Heading markdown: `## PART A:`, `---`, `# Title`
- ❌ Technical markers: `**[CLIFFHANGER: ...]**`, `**[CTA 1]**`, `**[PAYOFF PUNCHLINE — DELIVERED]**`, `**[MICRO-CTA]**`, `**[MID-STORY PUNCHLINE]**`
- ❌ Footnotes: Total words, Estimated duration, Retention techniques
- ❌ Markdown formatting: `**bold**`, `*italic*`, `##`, `---`, `>`

## 2.2. GIỮ NGUYÊN
- ✅ Toàn bộ narrative text
- ✅ Dialogue trong dấu ngoặc kép `"..."`
- ✅ Dấu câu tự nhiên (`.` `,` `—` `...` `!` `?`)

## 2.3. CHUYỂN ĐỔI
- CTA text → giữ nếu muốn đọc, xóa nếu không
  - Giữ: `"If you're enjoying this story — follow the channel..."` (đọc tự nhiên)
  - Xóa: `**[CTA 1]**: If you're enjoying...` (xóa marker, giữ text)
- Cliffhanger → xóa marker, text narrative đã có ở trên thì KHÔNG lặp
  - Nếu dòng cliffhanger = rhetorical question đã nằm trong narrative → xóa cả dòng
  - Nếu dòng cliffhanger = câu hỏi mới cho khán giả → chuyển thành text tự nhiên

---

# 3. CHIA FILE — PARTS

## 3.1. Naming Convention
```
Process VO/[slug]/
├── Part_A_-_[SECTION_NAME].txt
├── Part_B_-_[SECTION_NAME].txt
├── Part_C_-_[SECTION_NAME].txt
├── Part_D-1_-_[SECTION_NAME].txt  (nếu chia sub-part)
├── Part_D-2_-_[SECTION_NAME].txt
└── ...
```

Dùng subfolder theo tên kịch bản nếu nhiều video:
```
Process VO/hoa-karen-pride-lights/Part_A_-_HOOK.txt
Process VO/hoa-brenda-mustang/Part_A_-_HOOK.txt
```

## 3.2. Giới hạn mỗi file
- **Tối đa ~800 từ text thuần** (trước khi thêm tags)
- **Lý do:** ElevenLabs generate chất lượng + ổn định hơn với đoạn ngắn
- **Chia theo narrative beat tự nhiên** (không cắt giữa scene)

## 3.3. Chia thế nào
- Ưu tiên cắt ở: scene transitions, time skips, POV shifts
- KHÔNG cắt giữa: dialogue exchange, action sequence, emotional beat

---

# 3.5. Beat/Pause/Silence Positioning Guide

> *Nguồn: Competitor research — MeatCanyon 3.6M views. Ref: `Research/competitor-research-meatcanyon-hoa-2025.md`*
> ⚠️ Kỹ thuật này áp dụng ở bước Script Note/VO, KHÔNG phải bước viết kịch bản.

**Nguyên tắc vàng: Khoảnh khắc impact mạnh nhất = IM LẶNG nhất.**
KHÔNG hét ở emotional climax. Nói CHẬM, nói NHẸ, để silence.

**3 cấp độ im lặng và vị trí áp dụng:**

| Cấp độ | Kỹ thuật | Thời lượng | Khi nào dùng | Ví dụ |
|---------|----------|-----------|-------------|-------|
| **Beat** | `...` hoặc `,` | 0.5-1s | Giữa câu, tạo nhịp thở, trước reveal nhỏ | "She opened the letter... [quiet] Fourteen thousand dollars." |
| **Pause** | `...` + xuống dòng | 1-2s | Sau shock reveal, sau twist | "The HOA sold his house — for three thousand five hundred dollars." (xuống dòng) |
| **Silence** | `...` + xuống dòng + `[quiet]` | 2-3s | Sau emotional climax — LET IT BREATHE | "He came home to nothing..." (xuống dòng) [quiet] Nothing. |

**Vị trí bắt buộc phải có Pause/Silence:**

| Vị trí trong story | Loại | Tại sao |
|---------------------|------|----------|
| Sau Villain Iconic Line | Pause | Để viewer phẫn nộ |
| Sau Emotional Object bị xúc phạm | Silence | Xúc động cần thời gian |
| Sau con số shocking ($, ngày, tuổi) | Pause | Để viewer tiếp nhận |
| Trước big reveal / twist | Beat (`...`) | Build anticipation |
| Sau flashback/hồi tưởng | Pause | Chuyển mood từ warm → present |
| Sau climax chính (đỉnh điểm cảm xúc) | **Silence** | **Quan trọng nhất — LET IT BREATHE** |
| Sau punchline/mic drop | Silence | Để câu nói ngấm |
| Kết bài (trước CTA) | Pause | Emotional closure |

**Ví dụ từ Brenda Mustang script:**
```
Script gốc:   "Và con người này vừa gọi nó là phế liệu."
Script Note:  [tender] Và con người này vừa gọi nó là phế liệu...

[quiet]

Script gốc:   "Brenda."
Script Note:  ...

[cold] Brenda.

...

Script gốc:   "Yên tâm nhé bố. Không ai đụng vào nó được đâu."
Script Note:  ...

[intimate] Yên tâm nhé bố... [warm] Không ai đụng vào nó được đâu.
```
