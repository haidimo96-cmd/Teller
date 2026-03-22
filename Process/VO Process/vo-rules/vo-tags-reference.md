---
description: "Danh sách tags chuẩn + Tonal Families + Pattern Tags — Script Note VO (Phần 2/4)"
activation: manual
---
# 🎙️ SCRIPT NOTE — TAGS REFERENCE (Phần 2/4)

> Danh sách đầy đủ audio tags, pause system, reaction tags, và pattern-specific tag palettes.
>
> **Xem thêm:** Foundations → `vo-foundations.md` | Tagging Rules → `vo-tagging-rules.md` | Anti-patterns & QA → `vo-anti-patterns-qa.md`

---

# 4. AUDIO TAGS — DANH SÁCH CHUẨN

## 4.0. ⚠️ Nguyên tắc tương thích ElevenLabs v3

> **Nguồn chính thức:** ElevenLabs docs + `elevenlabs_v3_tags.md`
> Danh sách tag chính thức là **NON-EXHAUSTIVE** — single-word descriptive adjectives CÓ THỂ hoạt động.
> Tuy nhiên, cần tuân thủ 3 quy tắc sau:

### QUY TẮC 1: Ưu tiên SINGLE-WORD tags
- ElevenLabs phản hồi tốt nhất với **1 từ đơn**: `[cold]`, `[excited]`, `[thoughtful]`
- Compound tags (2+ từ) như `[cold, deliberate]` → **kém hiệu quả hơn** theo docs
- **CÁCH LÀM:** Dùng single-word tag là chính. Nếu cần nuance, dùng 2 single tags liên tiếp:
  ```
  ✅ TỐT:  [cold] [thoughtful] "Take that rag down."
  ⚠️ ĐƯỢC: [cold, deliberate] "Take that rag down."  (compound — có thể kém hơn)
  ```

### QUY TẮC 1b: Hệ thống 3-Tier cho tags
> **Không phải tất cả custom tags đều giống nhau.** Dùng 3-tier system:
>
> - 🟢 **Tier 1 — ALWAYS OFFICIAL**: Custom tag có official alt TỐT HƠN hoặc BẰNG → **luôn dùng official**
> - 🟡 **Tier 2 — PREFER CUSTOM**: Custom tag có sắc thái KHÁC official alt → **ưu tiên custom**, fallback official nếu output kém
> - 🟠 **Tier 3 — TEST & DECIDE**: Cả 2 có thể OK → **test trên ElevenLabs** trước

### QUY TẮC 2: Hệ thống Pause — CHỈ dùng punctuation ⚠️

> **Lý do:** Eleven v3 KHÔNG có speed control. Nhịp nhanh phải đến từ text structure.
> Mọi dạng pause tag (`[long pause]`, `[short pause]`, `[pause]`) đều làm v3 **chậm rõ rệt**.
> Thay bằng punctuation: `,` (nhanh nhất) → `...` (chậm hơn) → xuống dòng (chậm nhất).

- ✅ `,` (dấu phẩy) — ngắt nhanh, giữ nhịp chảy
- ✅ `...` (dấu ba chấm) — khoảng lặng nhẹ, dramatic
- ✅ `—` (em dash) — ngắt abrupt, interruption
- ✅ Xuống dòng mới — tạo pause nhẹ
- ❌ ~~`[long pause]`~~ — **QUÁ DÀI trên v3** → dùng `...` + xuống dòng thay
- ❌ ~~`[short pause]`~~ — làm chậm nhịp
- ❌ ~~`[pause]`~~ — không có trong v3 docs
- ❌ ~~`[strategic pause]`~~ ~~`[calculated pause]`~~ — không có trong v3 docs

### QUY TẮC 3: Phân loại tag trước khi dùng
- 🟢 **OFFICIAL** = có trong docs → dùng thoải mái
- 🟡 **EXPERIMENTAL** = single-word adjective, có trong mục thử nghiệm docs → nên dùng, có thể hoạt động
- 🔵 **CUSTOM** = tự thêm dựa trên non-exhaustive principle → dùng được nhưng cần test output

## 4.1. Tag theo loại — Phân loại OFFICIAL / EXPERIMENTAL / CUSTOM

### 🟢 OFFICIAL — Chính thức từ ElevenLabs docs:
| Tag | Loại | Khi nào |
|-----|------|---------|
| `[surprised]` | Emotion | Bất ngờ, eureka |
| `[excited]` | Emotion | Hưng khởi, phấn khích |
| `[curious]` | Emotion | Tò mò |
| `[sarcastic]` | Emotion | Mỉa mai, châm biếm |
| `[thoughtful]` | Emotion | Trầm tư, suy ngẫm |
| `[sad]` | Emotion | Buồn |
| `[angry]` | Emotion | Tức giận |
| `[annoyed]` | Emotion | Khó chịu |
| `[whispers]` | Speech | Thì thầm — intimate/sacred moments |
| `[mischievously]` | Speech | Tinh nghịch, ranh mãnh |
| `[muttering]` | Speech | Lầm bầm — villain tức giận nhẹ |
| `[inhales]` | Breathing | Hít vào |
| `[inhales sharply]` | Breathing | Hít mạnh — trước big reveal |
| `[exhales]` | Breathing | Thở ra — relief |
| `[exhales sharply]` | Breathing | Thở mạnh — shock |
| `[sighs]` | Breathing | Thở dài — frustration |
| `[laughs]` | Laughter | Cười — comedy narrator |
| `[chuckles]` | Laughter | Cười khúc khích |
| `[clears throat]` | Body | Hắng giọng — trước formal speech |

### 🟡 EXPERIMENTAL — Trong docs mục thử nghiệm:
| Tag | Khi nào | Tier |
|-----|---------|------|
| `[calculating]` | Strategic moments | ✅ Dùng thoải mái |
| `[nervous]` | Lo lắng, bồn chồn | ✅ Dùng thoải mái |
| `[gentle]` | Nhẹ nhàng | ✅ Dùng thoải mái |
| `[dark]` | U tối | ✅ Dùng thoải mái |
| `[bitter]` | Cay đắng | ✅ Dùng thoải mái |
| `[urgent]` | Khẩn cấp | ✅ Dùng thoải mái |
| `[resigned]` | Chấp nhận, buông | ✅ Dùng thoải mái |
| `[haunted]` | Ám ảnh | ✅ Dùng thoải mái |
| `[slows down]` | Đọc chậm lại — backstory, sacred | ✅ Dùng thoải mái |
| `[rapid-fire]` | Đọc nhanh, dồn dập — montage | ✅ Dùng thoải mái |
| `[cold]` | Lạnh lùng đe dọa | 🟡 Tier 2 — GIỮ (`[flatly]` = khác nghĩa, boring) |
| `[ominous]` | Foreshadowing, điềm xấu | 🟡 Tier 2 — GIỮ (`[dramatic tone]` = 2 words, kém hơn) |
| `[tense]` | Căng thẳng không gian | 🟠 Tier 3 — TEST vs `[nervous]` |
| `[reflective]` | Suy ngẫm, nhìn lại | 🟠 Tier 3 — TEST vs `[thoughtful]` |
| `[determined]` | Quyết tâm, turning point | 🟠 Tier 3 — TEST vs `[deliberate]` |
| `[confident]` | Tự tin | 🟠 Tier 3 — TEST vs `[deliberate]` |

### 🔵 CUSTOM — Tự thêm (dựa trên non-exhaustive principle, cần test):

#### 🟢 Tier 1 — ALWAYS OFFICIAL (luôn dùng official, KHÔNG dùng custom):
| Custom tag | → Dùng tag này thay thế | Lý do |
|---|---|---|
| ~~`[deadpan]`~~ | → `[flatly]` | Gần nghĩa, cùng family |
| ~~`[wry]`~~ | → `[sarcastic]` | Gần nghĩa |
| ~~`[impressed]`~~ | → `[awe]` | Gần nghĩa |
| ~~`[emotional]`~~ | → `[sad]` | Gần nghĩa |
| ~~`[bright]`~~ | → `[excited]` | Gần nghĩa |
| ~~`[breaking]`~~ | → `[crying]` | Gần nghĩa |
| ~~`[playful]`~~ | → `[playfully]` | Cùng từ |
| ~~`[cutting]`~~ | → `[flatly]` | Gần nghĩa |
| ~~`[serious]`~~ | → `[matter-of-fact]` | Gần nghĩa |

#### 🟡 Tier 2 — PREFER CUSTOM (ưu tiên custom, fallback official nếu output kém):
| Tag (DÙNG) | Khi nào | Fallback nếu kém | Tại sao giữ |
|---|---|---|---|
| `[cold]` 🟡 | Villain lạnh lùng đe dọa | → `[flatly]` | cold = đe dọa, flatly = boring |
| `[intimate]` 🟡 | Sacred phrases, lời hứa | → `[whispers]` | intimate = thiêng liêng, thoughtful = suy tư |
| `[quiet]` 🟡 | Gut punch, silence | → `[whispers]` | quiet = im lặng, thoughtful = suy nghĩ |
| `[tender]` 🟡 | Yêu thương sâu, backstory | → `[wistful]` hoặc `[gentle]` | tender = love, wistful = regret |
| `[warm]` 🟡 | Ấm áp sâu, resolution | → `[lighthearted]` | warm = depth, lighthearted = nhẹ |
| `[knowing]` 🟡 | Giữ bí mật, foreshadow | → `[mischievously]` | knowing = passive, thoughtful = khác |
| `[ominous]` 🟡 | Foreshadowing, điềm xấu | → `[dramatic tone]` | ominous = single-word, tốt hơn |

#### 🟠 Tier 3 — TEST & DECIDE (cần test trên ElevenLabs):
| Tag | Khi nào | Official Alt | Ghi chú |
|---|---|---|---|
| `[heavy]` | Nặng nề, consequences | vs `[sad]` | heavy = physical weight, sad = emotion |
| `[vulnerable]` | Villain human moment | vs `[nervous]` | vulnerable = open, nervous = scared |
| `[amused]` | Narrator thấy vui | vs `[playfully]` | amused = passive, playfully = active |
| `[tense]` | Căng thẳng không gian | vs `[nervous]` | tense = space, nervous = person |
| `[determined]` | Quyết tâm | vs `[deliberate]` | Gần nghĩa — test |
| `[genuine]` | Bỏ mask, thành thật | vs `[thoughtful]` | genuine = honest, thoughtful = thinking |

#### Tags bổ sung (không có trong Tier system):
| Tag | Khi nào | Fallback |
|---|---|---|
| `[stammers]` | Lắp bắp, bối rối | → `[nervous]` |
| `[hesitates]` | Do dự, ngập ngừng | → `[nervous]` |
| `[wistful]` | Bâng khuâng, tiếc nuối | → `[sad]` |
| `[appalled]` | Kinh tởm, sốc | → `[angry]` |
| `[gulps]` | Nuốt nước bọt | → `[nervous]` |
| `[flatly]` | Tỉnh bơ | 🟢 OFFICIAL |

### Tonal Families (cập nhật theo 3-tier):
| Family | Tags | Ghi chú |
|--------|---------|---|
| **DARK/TENSE** | `[cold]`🟡, `[dark]`, `[ominous]`🟡, `[calculating]`, `[flatly]`, `[matter-of-fact]` | Tier 1: ~~serious~~→matter-of-fact, ~~cutting~~→flatly |
| **WARM/INTIMATE** | `[tender]`🟡, `[intimate]`🟡, `[gentle]`, `[warm]`🟡, `[quiet]`🟡, `[wistful]`, `[whispers]` | Tier 1: ~~bright~~→excited |
| **COMEDY** | `[flatly]`, `[sarcastic]`, `[playfully]`, `[knowing]`🟡, `[mischievously]` | Tier 1: ~~deadpan~~→flatly, ~~wry~~→sarcastic, ~~playful~~→playfully |
| **REFLECTIVE** | `[thoughtful]`, `[reflective]`, `[genuine]`🟠, `[quiet]`🟡, `[wistful]` | |
| **ENERGY** | `[excited]`, `[awe]`, `[curious]`, `[surprised]` | Tier 1: ~~impressed~~→awe, ~~bright~~→excited |
| **VULNERABLE** | `[gentle]`, `[nervous]`, `[sad]`, `[crying]`, `[vulnerable]`🟠, `[whispers]`, `[stammers]`, `[hesitates]`, `[gulps]` | Tier 1: ~~emotional~~→sad, ~~breaking~~→crying |
| **PACING** | `[slows down]`, `[rapid-fire]` | |

## 4.2. Hệ Thống Pause — KHÔNG dùng [short pause] / [pause] ⚠️

> **Nguồn: SKILL VO.** `[short pause]` và `[pause]` làm voice chậm và nghe cứng. Thay bằng punctuation tự nhiên.

| Mục tiêu | Dùng | KHÔNG dùng |
|----------|------|------------|
| Khoảng lặng dramatic | `...` + xuống dòng | |
| Ngắt nghỉ tự nhiên ngắn | Dấu phẩy `,` | ~~`[short pause]`~~ |
| Chuyển ý, suy nghĩ, weight | `...` (dấu ba chấm) | ~~`[pause]`~~ |
| Ngắt abrupt | `—` (em dash) | ~~`[calculated pause]`~~ |
| Pause nhẹ | Xuống dòng mới | ~~`[strategic pause]`~~ |
| Pause dài sau climax | `...` + xuống dòng + `[quiet]` | ~~`[long pause]`~~ |

### Pattern phổ biến nhất trong 1 dòng:
```
[TAG_đầu] Câu 1... [TAG_mới] Câu 2, [TAG_mới] Câu 3... [inhales]
```
→ `...` + dấu phẩy + `...` + thở = tạo nhịp TỰ NHIÊN

### Ví dụ chuyển đổi:
```
# ❌ CŨ — dùng [short pause] (nghe cứng)
"He stared at the letter. [short pause] Then read it again. [short pause] Foreclosure."

# ✅ MỚI — dùng ... và dấu phẩy (nghe tự nhiên)
"He stared at the letter... then read it again. Foreclosure."
"He stared at the letter, read it once, read it twice... Foreclosure."
```

### Bảng chuyển đổi từ rule cũ:
| Rule cũ (KHÔNG dùng nữa) | Rule mới |
|--------------------------|----------|
| `[strategic pause]` | `...` + xuống dòng |
| `[calculated pause]` | `...` hoặc `,` |
| `[short pause]` | `...` hoặc `,` |
| `[pause]` | `...` |
| `[long pause]` | `...` + xuống dòng |
| `[short pause] [inhales]` | `... [inhales]` |
| `[short pause] [tag]` | `, [tag]` hoặc `... [tag]` |
| `[long pause] [tag]` | xuống dòng + `[tag]` |

## 4.3. Reaction Tags (chèn giữa text) — 🟢 TẤT CẢ OFFICIAL
| Tag | Hiệu ứng | Vị trí thường gặp | Max / file |
|-----|----------|-------------------|----|
| `[inhales]` 🟢 | Hít vào — trước moment quan trọng | Cuối chuỗi: `... [inhales]` | 3-5 |
| `[inhales sharply]` 🟢 | Hít mạnh — trước BIG reveal | Đứng riêng trước câu climax | 1 (cả file) |
| `[exhales]` 🟢 | Thở ra — relief, release | Sau climax, resolution | 2-3 |
| `[exhales sharply]` 🟢 | Thở mạnh — shock, impact | Sau twist | 1-2 |
| `[sighs]` 🟢 | Thở dài — frustration, exhaustion | Background, aftermath | 1-2 |
| `[gasps]` 🟢 | Hít hơi mạnh — sốc, sợ | Sau twist, villain reveal | 0-1 |
| `[laughs]` / `[chuckles]` 🟢 | Cười — irony, comedy | Narrator commentary | 0-1 |
| `[giggles]` / `[snorts]` 🟢 | Cười khúc khích / khịt mũi | COMEDY pattern | 0-1 |
| `[clears throat]` 🟢 | Hắng giọng — before formal | Trước legal/formal speech | 0-1 |

## 4.4. Punctuation Effects (KHÔNG phải tags, nhưng ảnh hưởng delivery)
| Ký hiệu | Hiệu ứng | Ví dụ |
|----------|----------|-------|
| `...` | Pause + weight | "It was... over." |
| `CAPS` | Emphasis | "UNRESTRICTED installation" |
| `—` | Interruption/abrupt | "She didn't just—" |
| `!` | Energetic | "Done!" |
| `?` | Rising intonation | "Seriously?" |

## 4.5. 🆕 Tag Theo Nhóm Pattern — KHÔNG copy tag giữa patterns

> **Mỗi story pattern có PALETTE TAG RIÊNG.** Comedy story dùng comedy tags, Fury story dùng fury tags. KHÔNG lấy tag FURY gắn cho COMEDY.

### FURY pattern (Pride Lights, etc.) — Narrator GIẬN, hero bị xúc phạm:
| Đoạn | Tags chủ đạo (3-tier) |
|------|---------|
| Villain intro | `[cold]`🟡, `[dark]`, `[flatly]`, `[calculating]` |
| Hero reaction | `[nervous]`, `[quiet]`🟡, `[deliberate]` |
| Climax | `[cold]`🟡 `[deliberate]`, `[calculating]`, `[ominous]`🟡 |
| Sacred moments | `[tender]`🟡, `[intimate]`🟡, `[whispers]` |
| Narrator feel | Angry, righteous, outraged on behalf of hero |

### STRATEGY pattern (Dissolve, Board Takeover) — Narrator ADMIRE, hero thông minh:
| Đoạn | Tags chủ đạo (3-tier) |
|------|---------|
| Hero planning | `[calculating]`, `[knowing]`🟡, `[matter-of-fact]` |
| Evidence trail | `[awe]`, `[curious]`, `[excited]` |
| Climax | `[cold]`🟡 `[deliberate]`, `[excited]` |
| Narrator feel | Admiring, in awe of hero's intelligence |

### COMEDY pattern (Flamingo, Creative Trolling) — Narrator AMUSED, hero sáng tạo:
| Đoạn | Tags chủ đạo (3-tier) |
|------|---------|
| Villain absurd | `[playfully]`, `[sarcastic]`, `[flatly]` — not cold |
| Hero troll | `[playfully]`, `[knowing]`🟡, `[mischievously]` — not calculating |
| Backstory | `[tender]`🟡, `[intimate]`🟡, `[warm]`🟡 `[gentle]` — not matter-of-fact |
| Climax | `[quiet]`🟡, `[warm]`🟡, `[awe]` — not cold/dark |
| Narrator feel | Delighted, amused, moved, barely containing grin |

> ⚠️ **Test nhanh:** Đọc tag bạn chọn → narrator nghe có giống đang kể đúng LOẠI câu chuyện không? Nếu comedy villain mà sound like thriller villain → SAI.

## 4.6. 🆕 QUY TẮC STABILITY V3 (ElevenLabs UI)

> **Nguồn: SKILL VO.** Chọn mode trước khi generate voice.

| Mode | Dùng khi |
|------|----------|
| **Creative** | Script nhiều emotion tags, drama cao — FURY/COMEDY |
| **Natural** | Documentary, narrative cân bằng — STRATEGY |
| **Robust** | Script không có tags, cần ổn định |
