---
description: Chuyển kịch bản EN thành Script Note có audio tags cho ElevenLabs voice generation
---

// turbo-all

# 🎙️ Tạo Script Note (Voice-Over Ready)

> Chuyển kịch bản EN (từ `Kich Ban/EN/`) → Các file .txt có audio tags → sẵn generate voice trên ElevenLabs Eleven v3.
> Quy trình chia 3 PHASE: ĐỌC → CHUẨN BỊ → VIẾT.

## Input cần thiết:

- **File kịch bản EN** từ `Kich Ban/EN/[PATTERN]/Script-[slug]-EN-V*.md`
- File Kịch Bản = narrative text tinh khiết, chỉ có `---` ngắt section → bước Clean gần như bỏ qua
- (Tùy chọn) Yêu cầu đặc biệt (tone, voice name, speed)

---

# PHASE 1: ĐỌC & HIỂU — Narrator trở thành Storyteller

> **Mục đích:** Đọc kịch bản như NGƯỜI KỂ CHUYỆN, không phải như máy gắn tag.
> Không chạm vào tag nào ở phase này. Chỉ ĐỌC và CẢM.

### Bước 1: Đọc kịch bản + Đọc rules

- **Đọc 2 rule files:**
  - `.agent/rules/script-note-vo/vo-foundations.md` — nguyên tắc nền tảng + clean + chia file + Beat/Pause Guide
  - `.agent/rules/script-note-vo/vo-tags-reference.md` — danh sách tags + tonal families + pattern tags
- Đọc toàn bộ kịch bản EN từ đầu đến cuối
- Xác định: **pattern** (FURY/STRATEGY/COMEDY), các PART, emotional arc tổng

### Bước 2: Đọc lại lần 2 — Đọc như Storyteller

Đọc LẠI từ đầu, lần này hỏi ở MỖI đoạn:

> "Nếu tôi kể câu chuyện này cho bạn bè bên cốc cà phê — tôi sẽ kể đoạn này THẾ NÀO?"

Với mỗi section (HOOK, TRIGGER, ESCALATION...), ghi ra:

| Mục | Câu hỏi | VD (Flamingo HOOK) |
|-----|---------|-----|
| **Context** | Đoạn này kể về gì? Vai trò gì trong story? | Mở bài — hook viewer bằng absurdity |
| **Narrator Mindset** | Narrator ĐANG CẢM THẤY gì? | Amused — thấy tình huống ridiculous |
| **Tone** | Giọng cụ thể — như nói với ai? | Playful, gần cười, kể cho bạn nghe |
| **Pacing** | Nhanh / chậm / đứt? | Nhanh → chậm lại ở villain quote |
| **Contrast Points** | Tone ĐỔI ở đâu trong đoạn? | Amused → ominous (flamingo biến mất) |

### Bước 3: Map Emotional Arc toàn story

Tạo 1 bản đồ cảm xúc — KHÔNG cần quá chi tiết, chỉ cần:

**a) Narrator Emotional Journey:**
```
VD Flamingo:
HOOK:     amused → curious → ominous
GIFT:     warm → tender → intimate → ominous
THEFT:    wry → quiet → emotional → playful  
BREAKS:   heavy → breaking → determined → deadpan
JOINS:    quiet → excited → amused → knowing
EVOLVE:   knowing → amused → excited → amazed
MEDIA:    excited → vulnerable → ominous
CLIMAX:   serious → quiet → warm → amazed → genuine
LEGACY:   warm → amused → deadpan
EPILOGUE: tender → intimate → bright → determined → warm
```

**b) Villain Evolution Arc:**
```
VD Patricia:
Mở:  [cold] — controlling, clipboard, measuring
Giữa: [vulnerable] — "All I ever wanted was a nice neighborhood"
Kết:  [genuine] — "I did want it to be beautiful"
```

**c) Sacred Phrases / Motifs:**
```
VD: "Buenos días, Flamingo" → [intimate] — CÙNG tag mỗi lần lặp
```

**d) 8 Yếu Tố Giọng Đọc — Đánh dấu vị trí:**

| Yếu tố | Vị trí cụ thể trong kịch bản |
|---------|------------------------------|
| 🎵 Vocal Variety | Mỗi dòng — đã cover bởi tag shift rules |
| ⏱️ Pacing | Nhanh: montage days. Chậm: Victor backstory |
| 🤫 Strategic Silence | "Empty." / "Stops." / trước "I resign." |
| 💗 Emotional Authenticity | Victor backstory = tender. Rosa phone = breaking |
| 🔄 Tonal Contrast | "kidnapped a flamingo" (amused) → "Empty" (quiet) |
| 🌬️ Breath | `[inhales]` trước reveal. `[exhales]` sau resign |
| 📈 Crescendo/Decrescendo | Whack-a-mole = crescendo. "Buenos días" = decrescendo |
| 🤝 Intimacy | CTA + "Buenos días" + narrator asides |

---

# PHASE 2: CHUẨN BỊ — Clean + Split

> **Rule file tham khảo:** `vo-foundations.md` (§2-§3)

### Bước 4: Clean text

Theo rule §2 — XỬ LÝ TEXT:
- File Kịch Bản thường đã sạch, chỉ cần:
  - ⚠️ **Xóa toàn bộ block `<!-- PRODUCTION ONLY -->...<!-- END PRODUCTION ONLY -->`** (chứa Reddit Synopsis — text hiển thị màn hình, KHÔNG phải VO)
  - Xóa `---` (dấu ngắt section markdown)
  - Giữ nguyên narrative text + dialogue
  - Xử lý CTA text (giữ nếu đọc tự nhiên, xóa nếu dạng marker)

### Bước 5: Chia file theo PARTS

Theo rule §3 — CHIA FILE:
- Mỗi file .txt ≤800 từ text thuần
- Naming: `Process VO/[slug]/Part_[X]_-_[NAME].txt`
- Cắt ở scene transitions, không cắt giữa scene
- Tham khảo Emotional Arc Map (bước 3) để cắt đúng chỗ tonal shift tự nhiên

---

# PHASE 3: VIẾT — Gắn tag + Review

> **Rule files tham khảo:**
> - `.agent/rules/script-note-vo/vo-tagging-rules.md` — cách chèn tags (§5-§6)
> - `.agent/rules/script-note-vo/vo-anti-patterns-qa.md` — lỗi cần tránh + QA (§7-§9)
> - `.agent/rules/script-note-vo/vo-tags-reference.md` — tra cứu tag khi cần (§4)

### Bước 6: Viết từng file — Áp dụng tags theo Narrator Map

> **QUAN TRỌNG:** Mở Emotional Arc Map (bước 3) bên cạnh khi viết. Mỗi file = 1 phần của narrator journey.

Với mỗi file .txt, áp dụng theo thứ tự:

**a) Tag đầu dòng** (§5.1):
- Ưu tiên single-word: `[cold]`, `[tender]`, `[amused]`
- 2 single tags liên tiếp nếu cần nuance: `[cold] [thoughtful]`

**b) Tag mid-sentence** (§5.2):
- Sau mỗi dấu chấm: `... [tag mới]` — tạo pause tự nhiên
- Giữa chuỗi: `, [tag mới]` hoặc `... [tag mới]`
- Cuối dòng: `... [inhales]`
- Pattern: `Câu... [tag] Câu, [tag] Câu... [inhales]`

**c) Pause = punctuation tự nhiên** (§5.4 + SKILL VO):
- `...` + xuống dòng — sau reveal/shock (dramatic pause)
- `...` — chuyển ý, weight, dramatic
- `,` — ngắt nghỉ ngắn tự nhiên
- ⚠️ **KHÔNG dùng `[short pause]`** — làm voice cứng
- ⚠️ **KHÔNG dùng `[long pause]`** — quá dài trên v3

**d) Beat/Pause/Silence Positioning** (§3.5 trong `vo-foundations.md`):
- **Beat** (`...` / `,`): Giữa câu, trước reveal nhỏ
- **Pause** (`...` + xuống dòng): Sau shock reveal, sau twist
- **Silence** (`...` + xuống dòng + `[quiet]`): Sau emotional climax — LET IT BREATHE
- Đối chiếu với bảng "Vị trí bắt buộc" trong §3.5

**e) Dialogue tags** (§5.3):
- Villain evolve: check Arc Map → phase nào?
- Hero emotional vs. trolling: check Pattern
- Sacred phrases: dùng CÙNG tag mỗi lần

**f) CHECK 8 yếu tố giọng đọc** khi viết mỗi file:
- [ ] 🎵 Mỗi dòng có 2-4 vocal changes (tag shifts)?
- [ ] ⏱️ Pacing match content? Nhịp nhanh cho action, chậm cho emotion?
- [ ] 🤫 Có moment im lặng có chủ đích? (`...` + xuống dòng + câu ngắn đứng riêng) — đối chiếu với §3.5?
- [ ] 🤫 Emotional climax dùng QUIET tone + `...`? (KHÔNG hét ở peak)
- [ ] 💗 Tag = cảm xúc THẬT của narrator? Không phải mô tả text?
- [ ] 🔄 Có ít nhất 1 tonal contrast mạnh trong file?
- [ ] 🌬️ Breath tags đặt đúng điểm cảm xúc? (3-5/file)
- [ ] 📈 Tag shifts đi theo hướng (crescendo/decrescendo)? Không ping-pong?
- [ ] 🤝 Narrator có personality? Hay chỉ "present"?

### Bước 7: QA — Sau khi viết XONG tất cả files

Theo rule §9 trong `vo-anti-patterns-qa.md` — QA CHECKLIST:

**Clean Check** (6 items):
- [ ] Không còn metadata, headings, markers, footnotes?
- [ ] **Không còn block `<!-- PRODUCTION ONLY -->`?** (Reddit Synopsis phải bị xóa hoàn toàn)

**Tag Quality** (14 items):
- [ ] Single-word tags ưu tiên?
- [ ] **KHÔNG còn `[short pause]`?** Dùng `,` và `...` thay thế?
- [ ] **KHÔNG còn `[long pause]`?** Dùng `...` + xuống dòng thay?
- [ ] Nội dung liệt kê phẳng → giữ 1 tag?
- [ ] Không Flat Line, không tag mâu thuẫn?
- [ ] Custom tags (🔵) ưu tiên Official Alt (SKILL VO) khi output kém?

**Context Quality** (4 items):
- [ ] Tag = cảm xúc narrator (§1.4)?
- [ ] Đúng nhóm pattern (§4.5)?
- [ ] Villain evolution (§7.9)?
- [ ] Sacred phrases mirrored?

**ElevenLabs Compatibility** (5 items):
- [ ] KHÔNG còn `[short pause]`, `[pause]`, `[strategic pause]`, `[calculated pause]`?
- [ ] KHÔNG còn `[inhales deeply]`? Dùng `[inhales sharply]`
- [ ] Custom tags (🔵) có Official Alt (SKILL VO) nếu output kém?
- [ ] **KHÔNG còn `[long pause]`?** Dùng `...` + xuống dòng thay?

**File Check** (4 items):
- [ ] Mỗi file ≤800 từ? Naming đúng? UTF-8?

### Bước 8: Lưu files

- Output: `Process VO/[slug]/`
- Format: `.txt` (plain text, UTF-8)

---

## Tóm tắt 3 Phase:

```
PHASE 1: ĐỌC & HIỂU (Bước 1-3)
  ├── Đọc kịch bản + 2 rule files (vo-foundations + vo-tags-reference)
  ├── Đọc lại như storyteller → 5 câu hỏi mỗi section
  └── Map emotional arc + villain arc + sacred phrases + 8 yếu tố

PHASE 2: CHUẨN BỊ (Bước 4-5)
  ├── Clean text (ref: vo-foundations §2-§3)
  └── Chia file theo PARTS

PHASE 3: VIẾT & REVIEW (Bước 6-8)
  ├── Đọc 2 rule files (vo-tagging-rules + vo-anti-patterns-qa)
  ├── Gắn tags theo Narrator Map + 8 yếu tố checklist
  ├── QA (Clean + Tag + Context + Compatibility + File)
  └── Lưu files
```

## Output:
- Các file `.txt` trong folder `Process VO/[slug]/`
- Sẵn sàng paste vào ElevenLabs để generate voice
