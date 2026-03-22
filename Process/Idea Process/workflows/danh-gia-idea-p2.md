---
description: Đánh giá idea câu chuyện — PHẦN 2 (Bước 3-6, Red Flags, Tính điểm, Output format, Bảng tóm tắt)
---

// turbo-all

# 🎯 Đánh Giá Idea — PHẦN 2 (Bước 3-6)

> **⚠️ ĐÂY LÀ PHẦN 2.** Đọc file `danh-gia-idea.md` trước để hiểu Bước 1-2 (Xác định pattern, Universal scoring, Pattern-specific scoring).

---

### Bước 3: Kiểm tra Red Flags (Trừ điểm)

> Red flags cũng ADAPT theo nhóm pattern. Một số red flags chỉ nghiêm trọng ở nhóm nhất định.

#### Red Flags UNIVERSAL (áp dụng cho mọi pattern):

| # | Red Flag | Câu hỏi kiểm tra | Trừ điểm |
|---|----------|-------------------|----------|
| R1 | **Cốt truyện tuyến tính** | Đoán được kết thúc từ đầu? Không có surprise? | -10 |
| R2 | **Nhân vật phẳng** | Hero/Villain không có chiều sâu? Quá đơn giản? | -8 |
| R3 | **Filler tiềm ẩn** | Có phần nào phải kéo dài vô nghĩa để đủ dài? | -5 |
| R4 | **Topic quá niche** | Chỉ 1 nhóm rất nhỏ mới hiểu? | -5 |

#### Red Flags theo nhóm:

##### 🔥 FURY-specific:

| # | Red Flag | Câu hỏi kiểm tra | Trừ điểm |
|---|----------|-------------------|----------|
| RF1 | **Nhân vật chịu đựng vô lý** | Hero chịu quá lâu mà không hành động? | -5 |
| RF2 | **Payoff không tương xứng** | Kết quả quá nhẹ so với build-up fury? | -5 |
| RF3 | **Thiếu vật thể cảm xúc** | Không có gì để neo cảm xúc khán giả? | -3 |
| RF4 | **Exploitation cảm xúc** | Quá mức "thêm mắm" → clickbait? | -5 |

##### 🧠 STRATEGY-specific:

| # | Red Flag | Câu hỏi kiểm tra | Trừ điểm |
|---|----------|-------------------|----------|
| RS1 | **Lỗ hổng logic lớn** | Hành vi pháp lý/chiến lược có hợp lý? Expert có soi được? | -8 |
| RS2 | **Checkmate quá dễ** | Hero Google 5 phút là xong? Thiếu research journey? | -5 |
| RS3 | **Quá "khô"** | Chỉ có pháp lý, hoàn toàn thiếu cảm xúc? | -5 |
| RS4 | **Villain quá ngu** | "Sao không kiểm tra trước?" → plot hole rõ ràng? | -5 |

##### 😂 COMEDY-specific:

| # | Red Flag | Câu hỏi kiểm tra | Trừ điểm |
|---|----------|-------------------|----------|
| RC1 | **Hài hước quá nhạt** | "Ờ... vui ha" → không viral? Không có WTF visual? | -8 |
| RC2 | **Mean-spirited** | Hero bắt nạt villain về cá nhân? Villain đáng thương? | -5 |
| RC3 | **Thiếu stakes** | "Chỉ là trò đùa, có gì gay cấn?" | -5 |
| RC4 | **Cả khu join quá nhanh** | Phi thực tế — ai cũng sợ HOA? | -3 |
| RC5 | **Lỗ hổng sức khỏe/an toàn** | Hành động hero gây hại sức khỏe cộng đồng? (VD: nuôi muỗi) | -5 |

---

### Bước 4: Tính điểm tổng

```
═══════════════════════════════════════════════════════
  TỔNG ĐIỂM = UNIVERSAL + PATTERN-SPECIFIC - RED FLAGS
═══════════════════════════════════════════════════════

PHẦN A — UNIVERSAL:
  U1 + U2 + U3 + U4 + U5 + U6 = /60

PHẦN B — PATTERN-SPECIFIC (chọn 1 trong 3):
  [FURY]     (Tổng gốc / 105) × 40 = /40
  [STRATEGY] (Tổng gốc / 105) × 40 = /40
  [COMEDY]   (Tổng gốc / 105) × 40 = /40

ĐIỂM CƠ BẢN = (A + B) = /100

RED FLAGS (Universal + Nhóm-specific):
  Trừ bớt theo phát hiện

ĐIỂM CUỐI CÙNG = Điểm cơ bản - Red Flag penalties
═══════════════════════════════════════════════════════
```

---

### Bước 5: Đưa ra kết luận

| Điểm | Kết luận | Hành động |
|------|----------|-----------|
| **≥80** | 🟢 **XUẤT SẮC** — Tiềm năng viral cao | → Tiến hành `/tao-dan-y` ngay |
| **70-79** | 🟡 **TỐT** — Solid, cần tinh chỉnh nhỏ | → Đề xuất cải thiện → `/tao-dan-y` |
| **50-69** | 🟠 **TRUNG BÌNH** — Cần sửa đổi đáng kể | → Liệt kê 3 điểm cần sửa |
| **<50** | 🔴 **YẾU** — Cần đổi idea hoặc refactor | → Đề xuất hướng cải thiện |

### Bước 5.5 (MỚI): Cross-check — Thử nhóm pattern khác?

> Nếu idea bị ≤50 điểm ở nhóm đã chọn → TỰ HỎI: "Idea này có phù hợp hơn ở nhóm khác không?"

Ví dụ:
- Idea "nuôi muỗi" chấm FURY = 15/100 (yếu) nhưng chấm COMEDY = 55/100 (trung bình, refactor được)
- Idea "MC tuân thủ luật" mà hero cực kỳ yếu thế → thử chấm FURY (Sympathetic Victim) thay vì COMEDY

→ Nếu cross-check cho điểm CAO HƠN → **Đề xuất đổi nhóm pattern** cho user.

### Bước 6: Đề xuất cải thiện (nếu <80 điểm)

Với mỗi tiêu chí điểm thấp, đưa ra **gợi ý cụ thể** phù hợp pattern.

Khi đề xuất, ưu tiên:
1. Tiêu chí Tier S (hệ số x2) trước — tác động lớn nhất
2. Red flags nghiêm trọng — loại bỏ rào cản
3. Gợi ý chuyển nhóm pattern nếu phù hợp hơn

---

## Output:

### File đánh giá (lưu vào `Ideas/[HOA-pattern]/Idea-hoa-[tên-idea]-V1.md`):

> **Chọn folder theo HOA pattern chính:**
> - `Malicious-Compliance/` — 🔧 Dùng luật HOA chống HOA
> - `Board-Takeover/` — 👑 Lật đổ ban quản trị
> - `Dissolve-HOA/` — 💣 Giải thể HOA
> - `Sympathetic-Victim/` — 🎖️ Nạn nhân yếu thế bị HOA bắt nạt
> - `Legal-Trap/` — 🕵️ Bẫy pháp lý checkmate
> - `Property-Rights/` — 🏡 Quyền sở hữu, grandfathered
> - `Financial-Fraud/` — 💰 Biển thủ quỹ HOA
> - `Foreclosure/` — 🏚️ Cưỡng chế bất hợp pháp
> - `Community-Comedy/` — 😂 Troll hài hước
>
> Nếu combo ≥2 HOA patterns → lưu vào folder pattern MẠNH NHẤT.
> Nếu idea KHÔNG liên quan HOA → `_Archive-Non-HOA/`

```markdown
# 🎯 ĐÁNH GIÁ IDEA: [Tên idea]

## Pattern: [tên pattern(s)]
## Nhóm scoring: [🔥 FURY / 🧠 STRATEGY / 😂 COMEDY]
## Tóm tắt idea: [1-3 câu]

## Phần A — Universal (/60):
[Bảng U1-U6 với điểm từng mục]

## Phần B — [NHÓM] Pattern-Specific (/40):
[Bảng Tier S/A/B với điểm từng mục theo nhóm đã chọn]

## Red Flags (Universal + [NHÓM]-specific):
[Danh sách red flags + điểm trừ]

## Tổng điểm: XX/100 — [Kết luận]

## Cross-check nhóm khác (nếu ≤50):
[Thử chấm nhanh ở nhóm khác nếu cần]

## Đề xuất cải thiện:
[Nếu cần]

## Quyết định:
- [ ] ✅ Tiến hành `/tao-dan-y`
- [ ] ⚠️ Cải thiện trước
- [ ] ❌ Đổi idea
```

---

## 📋 BẢNG TÓM TẮT: SO SÁNH 3 NHÓM SCORING

| Yếu tố | 🔥 FURY | 🧠 STRATEGY | 😂 COMEDY |
|---------|---------|-------------|-----------|
| **Tier S quyết định** | Empathy + Dual theme | Checkmate + Credibility | Visual comedy + Escalation loops |
| **Tier A khác biệt** | Villain ghê tởm + Escalation | Twist pháp lý + Research journey | Punchline + Community join |
| **Tier B chất lượng** | Vật thể + Community rally | Ally + Hậu quả villain | Technically correct + Celebration |
| **Red flag nguy hiểm nhất** | Hero bị động, Payoff nhẹ | Logic hole, Expert phản biện | Hài nhạt, Mean-spirited |
| **Hero kiểu** | Nạn nhân dũng cảm | Chiến lược gia | Nghệ sĩ troll sáng tạo |
| **Villain thua vì** | Fury cộng đồng + Justice | Checkmate pháp lý | Bẽ mặt xã hội |
| **Khán giả cảm thấy** | Phẫn nộ → Hả hê | Hồi hộp → Nể phục | Bực → Cười → Sảng khoái |

---

## Lưu ý quan trọng:
- Đây là bước **TRƯỚC** `/tao-dan-y` — KHÔNG viết dàn ý nếu chưa qua đánh giá
- Nếu user muốn tạo dàn ý ngay → **vẫn phải đánh giá nhanh**
- **MỘT idea có thể chấm ở ≥2 nhóm** nếu combo patterns — chọn nhóm cho ĐIỂM CAO NHẤT
- Khi idea combo ≥2 patterns → cộng thêm **+5 bonus** (tiềm năng đa dạng cảm xúc)
- Tier S luôn là **quyết định** — idea Tier S thấp thì Tier A/B cao cũng không cứu được
