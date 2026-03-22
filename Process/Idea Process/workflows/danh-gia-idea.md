---
description: Đánh giá idea câu chuyện trước khi lên dàn ý — scoring theo tiêu chí nghiên cứu từ 7 video viral (16M+ views), ĐÃ ADAPT theo từng nhóm HOA pattern
---

// turbo-all

# 🎯 Đánh Giá Idea Câu Chuyện (V2 — Pattern-Adaptive Scoring)

> **Mục đích:** Sàng lọc idea TRƯỚC KHI đầu tư thời gian lên dàn ý. Chỉ idea đạt ≥70/100 mới tiến hành `/tao-dan-y`.
>
> **V2 Update:** Hệ thống chấm điểm giờ đây ADAPT theo nhóm pattern — không dùng 1 thước đo cho tất cả.
>
> **⚠️ FILE NÀY GỒM 2 PHẦN:** Đọc cả file `danh-gia-idea-p2.md` để có đầy đủ quy trình (Bước 3-6, Red Flags, Output format, Bảng tóm tắt).

## Quy trình:

### Bước 1: Nhận input từ user
User cung cấp idea câu chuyện ở bất kỳ dạng nào:
- Mô tả tóm tắt (1-5 câu)
- Link Reddit/bài viết gốc
- Concept thô ("HOA bắt nạt cư dân về...")
- Nhân vật + xung đột cơ bản

### Bước 1.5: Xác định HOA Story Pattern
> **Lưu ý:** Kênh chỉ focus HOA stories. Mọi idea PHẢI liên quan đến Homeowners Association.

Xác định idea match **HOA pattern nào** (có thể combo ≥2):

| # | HOA Pattern | Dấu hiệu |
|---|-------------|----------|
| 1 | 🔧 **Malicious Compliance** | Dùng luật HOA chống lại chính HOA |
| 2 | 👑 **Board Takeover** | Bỏ phiếu bất tín nhiệm, đảo chính board |
| 3 | 💣 **Dissolve HOA** | Nuclear — xóa sổ hoàn toàn |
| 4 | 🎖️ **Sympathetic Victim** | Cựu chiến binh, bà góa, trẻ em bị HOA bắt nạt |
| 5 | 🕵️ **Legal Trap** | Expert-proof, dùng luật checkmate HOA |
| 6 | 🏡 **Property Rights** | Quyền sở hữu, grandfathered, non-HOA property |
| 7 | 💰 **Financial Fraud** | HOA board biển thủ, self-dealing scandal |
| 8 | 🏚️ **Foreclosure** | Cưỡng chế bất hợp pháp, mất nhà vì HOA |
| 9 | 😂 **Community Comedy** | Cộng đồng troll HOA bằng humor + sáng tạo |

→ Đọc `Story Patterns/[pattern].md` → nắm yêu cầu cụ thể
→ Đọc `Cau truc final/CAU-TRUC-FINAL-[FURY/STRATEGY/COMEDY].md` → nắm storytelling rules
→ Nếu idea KHÔNG liên quan HOA → TỪ CHỐI hoặc lưu `Ideas/_Archive-Non-HOA/`

---

### Bước 1.7 (MỚI): Xác định NHÓM PATTERN → Chọn bộ tiêu chí

Sau khi xác định pattern, chọn **NHÓM SCORING** phù hợp:

```
┌─────────────────────────────────────────────────────────────────────┐
│                    3 NHÓM SCORING                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  🔥 NHÓM FURY (Fury → Justice → Catharsis)                        │
│     Patterns: 01-Malicious Compliance (solo)                        │
│               04-Sympathetic Victim                                 │
│               08-Foreclosure Nightmare                              │
│     Cảm xúc chủ đạo: PHẪN NỘ → HẢ HÊ                            │
│     Vũ khí hero: Tuân thủ ác ý / Cộng đồng bảo vệ                │
│                                                                     │
│  🧠 NHÓM STRATEGY (Tension → Checkmate → Power Shift)             │
│     Patterns: 02-Board Takeover                                     │
│               03-Dissolve HOA                                       │
│               05-Legal Trap                                         │
│               06-Property Rights                                    │
│               07-Financial Fraud                                    │
│     Cảm xúc chủ đạo: HỒNG HỘP → NỂ PHỤC                         │
│     Vũ khí hero: Nghiên cứu pháp lý / Chiến lược dài hạn          │
│                                                                     │
│  😂 NHÓM COMEDY (Bực bội → Cười → Sảng khoái)                     │
│     Patterns: 09-Community Comedy                                   │
│               01-Malicious Compliance (khi tone hài > fury)         │
│     Cảm xúc chủ đạo: CƯỜI + TỰ HÀO                               │
│     Vũ khí hero: Sáng tạo + Humor + Cộng đồng                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

> **Lưu ý Malicious Compliance**: Nếu tone chủ đạo là fury/hả hê → NHÓM FURY. Nếu tone chủ đạo là funny/clever → NHÓM COMEDY. Xác định tone DỰA TRÊN idea, không dựa trên pattern name.
>
> **Lưu ý Combo Patterns**: Nếu idea combo ≥2 HOA patterns → chấm ở nhóm cho **ĐIỂM CAO NHẤT** + cộng thêm **+5 bonus** (tiềm năng đa dạng cảm xúc). VD: Sympathetic Victim + Malicious Compliance → thử cả FURY lẫn COMEDY, chọn nhóm điểm cao hơn.

---

### Bước 2: Chấm điểm UNIVERSAL + PATTERN-SPECIFIC

## 📊 PHẦN A: TIÊU CHÍ UNIVERSAL (60 điểm) — ÁP DỤNG CHO MỌI PATTERN

> Các tiêu chí này đã được chứng minh quyết định viral BẤT KỂ thể loại.

| # | Tiêu chí | Câu hỏi đánh giá | Điểm (0-10) | Hệ số |
|---|----------|-------------------|-------------|-------|
| U1 | **Tiêu đề hình ảnh cụ thể** | Có chi tiết CỤ THỂ tạo hình ảnh ngay? Title viết ra có WOW không? | /10 | x1 |
| U2 | **Topic universal** | Bất kỳ ai trên thế giới đều relate? (Family + Property > Workplace > Niche) | /10 | x1 |
| U3 | **Nhân vật chủ động** | Hero HÀNH ĐỘNG (không bị động chờ)? Hero có CHỌN cách phản kháng? | /10 | x1 |
| U4 | **WTF Concept** | Tóm tắt 1 câu → có gây "WTF, phải nghe!" không? | /10 | x1 |
| U5 | **Detail Mining Potential** *(MỚI)* | Có ≥3 con số cụ thể ($, ngày, tuổi)? Có ≥2 visual moments? Có quote khả thi? | /10 | x1 |
| U6 | **Comment Trigger** *(MỚI)* | Viewer sẽ share câu chuyện CÁ NHÂN tương tự? Có "What would YOU do?" moment? | /10 | x1 |

```
Tổng UNIVERSAL: /60
```

> **V3 Update (11/03/2026):** Thêm U5 + U6. Tổng Universal tăng /40 → /60. Pattern-Specific quy đổi → /40. Tổng vẫn = /100.
> *Nguồn: Competitor research — MeatCanyon "The Horrible Reality of HOAs" (3.6M views). Ref: `Research/competitor-research-meatcanyon-hoa-2025.md`*

---

## 📊 PHẦN B: TIÊU CHÍ THEO NHÓM PATTERN (60 điểm)

> Chọn **MỘT** trong 3 bộ tiêu chí dưới đây tùy thuộc nhóm pattern.

---

### 🔥 NHÓM FURY — Bộ tiêu chí cho Malicious Compliance (solo), Sympathetic Victim, Foreclosure

> **Triết lý:** Khán giả cần GHÉT villain và THƯƠNG hero. Fury càng mạnh → Catharsis càng lớn → Viral càng cao.

#### TIER S-FURY (Quyết định viral, hệ số x2)

| # | Tiêu chí | Câu hỏi đánh giá | Điểm (0-10) | Hệ số |
|---|----------|-------------------|-------------|-------|
| F-S1 | **Nhân vật gợi đồng cảm** | Hero thuộc nhóm yếu thế? (Trẻ em > Người già > Khuyết tật > Phụ nữ đơn thân > Đàn ông thường) | /10 | x2 |
| F-S2 | **Dual theme** | Có ≥2 chủ đề cảm xúc chồng nhau? (Phân biệt + Gia đình, Chiến tranh + Nhà, Bệnh tật + Nghèo) | /10 | x2 |

#### TIER A-FURY (Tạo khác biệt, hệ số x1.5)

| # | Tiêu chí | Câu hỏi đánh giá | Điểm (0-10) | Hệ số |
|---|----------|-------------------|-------------|-------|
| F-A1 | **Iconic Villain Line** | Villain có câu thoại đủ ngắn để nhớ, đủ GHÉT để quote? | /10 | x1.5 |
| F-A2 | **Villain ghê tởm** | Villain BIẾT nạn nhân yếu thế mà VẪN tấn công? Có ≥2 villains? | /10 | x1.5 |
| F-A3 | **Chuỗi escalation** | Villain leo thang ≥3 lần? Mỗi lần tệ hơn? | /10 | x1.5 |

#### TIER B-FURY (Tăng chất lượng, hệ số x1)

| # | Tiêu chí | Câu hỏi đánh giá | Điểm (0-10) | Hệ số |
|---|----------|-------------------|-------------|-------|
| F-B1 | **Vật thể cảm xúc** | Có vật thể cụ thể neo cảm xúc? (Cờ = bố, Vườn = chồng, Ramp = tự do) | /10 | x1 |
| F-B2 | **Community rally** | Cộng đồng có đứng lên bảo vệ? (≥3 hàng xóm hành động) | /10 | x1 |

```
Tổng FURY:
  F-S1 x2 + F-S2 x2                    = /40  (Tier S)
  F-A1 x1.5 + F-A2 x1.5 + F-A3 x1.5   = /45  (Tier A)
  F-B1 x1 + F-B2 x1                    = /20  (Tier B)
  Tổng gốc: /105
  Quy đổi → /40: (Tổng / 105) × 40
```

---

### 🧠 NHÓM STRATEGY — Bộ tiêu chí cho Board Takeover, Dissolve HOA, Legal Trap, Property Rights, Financial Fraud

> **Triết lý:** Khán giả cần ADMIRE sự thông minh của hero. Checkmate càng bất ngờ + expert-proof → Satisfying càng lớn → Comments càng nhiều.

#### TIER S-STRATEGY (Quyết định viral, hệ số x2)

| # | Tiêu chí | Câu hỏi đánh giá | Điểm (0-10) | Hệ số |
|---|----------|-------------------|-------------|-------|
| S-S1 | **Checkmate moment** | Có "1 câu/1 document" kết thúc cuộc chiến không thể chối cãi? | /10 | x2 |
| S-S2 | **Chi tiết pháp lý credible** | Expert có validate được? Luật/số code có chính xác? | /10 | x2 |

#### TIER A-STRATEGY (Tạo khác biệt, hệ số x1.5)

| # | Tiêu chí | Câu hỏi đánh giá | Điểm (0-10) | Hệ số |
|---|----------|-------------------|-------------|-------|
| S-A1 | **Chuỗi twist pháp lý** | Có ≥2 twists? (Phát hiện → Villain phản đòn → Hero checkmate) | /10 | x1.5 |
| S-A2 | **Villain có quyền lực thực** | Villain có chức vụ, cơ chế phạt, tiền? (Không chỉ hàng xóm ghét) | /10 | x1.5 |
| S-A3 | **Research journey** | Hero có quá trình tìm kiếm VẤT VẢ? (Nhiều bước, nhiều nguồn, đêm khuya) | /10 | x1.5 |

#### TIER B-STRATEGY (Tăng chất lượng, hệ số x1)

| # | Tiêu chí | Câu hỏi đánh giá | Điểm (0-10) | Hệ số |
|---|----------|-------------------|-------------|-------|
| S-B1 | **Liên minh/Ally** | Có ally mạnh? (Luật sư, hàng xóm expert, truyền thông) | /10 | x1 |
| S-B2 | **Hậu quả cụ thể cho villain** | Villain mất GÌ? (Chức, tiền, nhà, tự do) — càng cụ thể càng tốt | /10 | x1 |

```
Tổng STRATEGY:
  S-S1 x2 + S-S2 x2                    = /40  (Tier S)
  S-A1 x1.5 + S-A2 x1.5 + S-A3 x1.5   = /45  (Tier A)
  S-B1 x1 + S-B2 x1                    = /20  (Tier B)
  Tổng gốc: /105
  Quy đổi → /40: (Tổng / 105) × 40
```

---

### 😂 NHÓM COMEDY — Bộ tiêu chí cho Community Comedy, Malicious Compliance (tone hài)

> **Triết lý:** Khán giả cần CƯỜI và NỂ PHỤC sự sáng tạo. Shareability = "Phải kể cho bạn nghe!" Comedy có luật riêng — absurd là OK, credibility nhẹ hơn, nhưng escalation phải liên tục funnier.

#### TIER S-COMEDY (Quyết định viral, hệ số x2)

| # | Tiêu chí | Câu hỏi đánh giá | Điểm (0-10) | Hệ số |
|---|----------|-------------------|-------------|-------|
| C-S1 | **Visual comedy WTF** | Có hình ảnh hài hước CỤ THỂ mà kể ra là người nghe BẬT CƯỜI? (VD: "30 nhà cùng đặt gnome", "thùng rác thành tác phẩm nghệ thuật") | /10 | x2 |
| C-S2 | **Escalation Loop (≥2 vòng)** | Mỗi vòng có funnier + bigger + more people? Hero troll → Villain bịt → Hero troll cách mới → Community join? | /10 | x2 |

#### TIER A-COMEDY (Tạo khác biệt, hệ số x1.5)

| # | Tiêu chí | Câu hỏi đánh giá | Điểm (0-10) | Hệ số |
|---|----------|-------------------|-------------|-------|
| C-A1 | **Quotable Punchline** | Có câu chốt/punchline đủ hay để trở thành meme? | /10 | x1.5 |
| C-A2 | **Community tham gia** | Có ≥3 hàng xóm cùng tham gia hành động hài hước? Tipping point rõ ràng? | /10 | x1.5 |
| C-A3 | **Villain kiêu ngạo → bẽ mặt** | Villain TỰ TIN → càng cố sửa → càng thua → bẽ mặt công khai? | /10 | x1.5 |

#### TIER B-COMEDY (Tăng chất lượng, hệ số x1)

| # | Tiêu chí | Câu hỏi đánh giá | Điểm (0-10) | Hệ số |
|---|----------|-------------------|-------------|-------|
| C-B1 | **Technically correct** | Hero làm ĐÚNG LUẬT 100%? Villain không thể phạt? (Đây là nguồn comedy) | /10 | x1 |
| C-B2 | **Celebration/Legacy ending** | Kết có lễ hội? Thứ bị cấm thành biểu tượng? "Hàng năm khu phố tổ chức..."? | /10 | x1 |

```
Tổng COMEDY:
  C-S1 x2 + C-S2 x2                    = /40  (Tier S)
  C-A1 x1.5 + C-A2 x1.5 + C-A3 x1.5   = /45  (Tier A)
  C-B1 x1 + C-B2 x1                    = /20  (Tier B)
  Tổng gốc: /105
  Quy đổi → /40: (Tổng / 105) × 40
```

---

> **⚠️ TIẾP TỤC:** Đọc file `danh-gia-idea-p2.md` để xem Bước 3-6 (Red Flags, Tính điểm, Kết luận, Output format, Bảng tóm tắt).
