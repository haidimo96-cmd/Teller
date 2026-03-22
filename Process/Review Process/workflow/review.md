---
description: Review kịch bản — rà soát và đánh giá chi tiết theo rules storytelling-scriptwriter, ĐÃ ADAPT theo nhóm pattern (FURY/STRATEGY/COMEDY)
---

// turbo-all

# 📝 Review Kịch Bản (V2 — Pattern-Adaptive Review)

## Mục đích:
Rà soát kịch bản đã viết, đối chiếu với **toàn bộ** rules trong `.agent/rules/`, đưa ra đánh giá chi tiết theo từng đầu mục và lưu kết quả vào folder `Review/`.

> **V2 Update:** Các đầu mục D, E, F giờ đây ADAPT theo nhóm pattern — không dùng 1 thước đo cho tất cả.

## Quy trình:

### Bước 1: Nhận file kịch bản từ user
- User mention file kịch bản từ folder `Kich Ban/EN/` hoặc `Kich Ban/VI/`
- Đọc toàn bộ nội dung file kịch bản

### Bước 2: Xác định nhóm pattern
- Xác định **HOA pattern** từ nội dung hoặc metadata kịch bản
- Chọn **NHÓM REVIEW** phù hợp:

```
🔥 FURY:     01-MC (solo), 04-Sympathetic Victim, 08-Foreclosure
🧠 STRATEGY: 02-Board Takeover, 03-Dissolve, 05-Legal Trap, 06-Property Rights, 07-Financial Fraud
😂 COMEDY:   09-Community Comedy, 01-MC (tone hài)
```

### Bước 3: Review 3 pha (mỗi pha đọc 1 file checklist nhỏ)

> **V3 Update:** Thay vì đọc 1 rulebook lớn → chia thành 3 pha.
> Mỗi pha chỉ đọc ~80-130 dòng checklist → agent focus sâu, không bỏ sót.

**Pha 1 — REVIEW HOOK:**
- Đọc `.agent/workflows/review-rulebook/hook-review.md`
- Rà soát phần Hook (từ đầu đến hết narrator transition vào P2)
- Focus: Hook 3-step, Villain Line, Macro Question, KT-H1→H10, teaser, narrator
- Cho điểm ⭐ + nhận xét + gợi ý sửa

**Pha 2 — REVIEW BODY:**
- Đọc **1 file** theo nhóm pattern:
  - 🔥 FURY → `.agent/workflows/review-rulebook/body-fury.md`
  - 🧠 STRATEGY → `.agent/workflows/review-rulebook/body-strategy.md`
  - 😂 COMEDY → `.agent/workflows/review-rulebook/body-comedy.md`
- Rà soát phần Body (P2-P9)
- Focus: Craft (KT1-KT16), Pacing, Mini Arcs, Pattern-specific (Climax/Cliffhanger), Character
- Cho điểm ⭐ + nhận xét + gợi ý sửa

**Pha 3 — FINAL REVIEW (format + consistency):**
- Đọc `.agent/workflows/review-rulebook/final-review.md`
- Rà soát TOÀN BỘ SCRIPT
- Focus: Format, Transitions, KT5 Motif, KT11 Numbers, KT12 Terminology, KT14 Dialogue Callback
- Anti-patterns quét toàn script
- Cho điểm ⭐ + nhận xét

### Bước 4: Rà soát kịch bản

Đánh giá kịch bản theo từng mục (từ 3 pha trên), mỗi mục cho:
- **Điểm số:** ⭐ (1-5 sao)
- **Nhận xét:** Cụ thể, có dẫn chứng câu/đoạn từ kịch bản
- **Vấn đề cần sửa:** Liệt kê rõ ràng (nếu có)
- **Gợi ý sửa:** Đề xuất cách fix cụ thể (nếu có)

---

# PHẦN 1: TIÊU CHÍ UNIVERSAL (áp dụng MỌI pattern)

## A. HOOK (Mở đầu) — Universal

- [ ] Đủ 3 bước (Context Lean → Scroll Stop → Contrarian Snapback)?
- [ ] Mở bằng xung đột/lời thoại phản diện (không mở bằng mô tả chung chung)?
- [ ] Staccato Sentences trong 30 giây đầu?
- [ ] Speed to Value (không intro, không "xin chào")?
- [ ] Hình ảnh đối lập rõ ràng?
- [ ] Reveal kế hoạch sớm → tạo Audience Complicity?
- [ ] **Nguồn gốc câu chuyện UNIQUE?** Không dùng formula rập khuôn như "Câu chuyện này xuất hiện trên mạng — và nó đã nổ"?
- [ ] **Narrator có bối cảnh cá nhân?** (lúc mấy giờ, đang làm gì, hook vào chi tiết CỤ THỂ nào)?
- [ ] **Metrics xen tự nhiên GIỮA đoạn?** (không front-loaded ở câu đầu)?

## B. MACRO QUESTION — Universal

- [ ] Có 2 câu hỏi lớn treo trong 20% đầu kịch bản?
- [ ] Câu hỏi 1 (HOW) — trả lời ở Climax/Resolution?
- [ ] Câu hỏi 2 (WHAT) — trả lời ở Twist/Reveal cuối?
- [ ] Breadcrumbs nuôi dưỡng xuyên suốt?

## C. LATDE (Kỹ thuật phân cảnh) — Universal

- [ ] Location: Mở cảnh bằng vị trí vật lý cụ thể?
- [ ] Action: Động từ hành động vật lý tạo đà?
- [ ] Thoughts: Suy nghĩ nội tâm thô, đời thường?
- [ ] Dialogue: ≤15% tổng từ? Max 3 câu liên tiếp? Action tags thay "said angrily"?
- [ ] Emotion: Show Don't Tell (không tính từ cảm xúc)?

## D0. MINI ARCS & THEREFORE — Universal

- [ ] Story chia thành mini arcs rõ ràng (mỗi phần có đầu-đỉnh-kết)?
- [ ] Mỗi mini arc có câu hỏi mở (QUESTION) và đỉnh nhỏ (MINI CLIMAX)?
- [ ] Mini climaxes leo thang dần (arc sau > arc trước)?
- [ ] Transitions giữa scenes/parts có nhân quả (THEREFORE), không phải "and then"?
- [ ] Mỗi đoạn 200-400 từ story đều TIẾN LÊN (không filler)?
- [ ] Emotional investment được build TRƯỚC action?

## G. VĂN PHONG & NHỊP ĐỘ — Universal

- [ ] Giọng kể phù hợp từng phân đoạn?
- [ ] KHÔNG có so sánh văn vở / ẩn dụ cầu kỳ?
- [ ] KHÔNG lặp scene đã kể ở Hook?
- [ ] Văn phong Reddit Mỹ: contractions, slang đời thường?
- [ ] Nhịp câu đa dạng (ngắn 3-8 / trung bình 10-20 / dài 25+)?
- [ ] Đoạn chậm không quá 150 từ liên tiếp?
- [ ] Breathe-Sprint-Breathe?
- [ ] Slow Motion trước 2-3 khoảnh khắc quan trọng?

### G2. KỸ THUẬT HÀNH VĂN KT6-KT16 — Universal

- [ ] **KT6 Staccato Discipline:** Câu cụt (1-5 từ) chỉ đứng SAU câu dài? Không có ≥3 câu cụt liên tiếp?
- [ ] **KT7 Emotion Efficiency:** Đoạn cảm xúc: 1 hình ảnh + 1 gut punch? Không chồng nhiều chi tiết giác quan?
- [ ] **KT8 Villain Sketch:** Villain có First-Impression Line (1 câu verdict ≤15 từ)? Có rapid-fire traits + 1 câu vạch mặt? Không tường thuật?
- [ ] **KT8C Villain Power Abuse Micro-Scenes:** Có ≥1 micro-scene villain bắt nạt/lạm quyền CỤ THỂ (bịt miệng công khai / trả đũa ngầm / gaslighting)? Có nạn nhân cụ thể (tên, tuổi)?
- [ ] **KT9 Supporting Cast:** Nhân vật phụ gom trong 1-2 câu + biệt danh chức năng?
- [ ] **KT10 Context for Payoff:** Chi tiết quan trọng có đủ ngữ cảnh để viewer hiểu vì sao đau?
- [ ] **KT11 Numeric Clarity:** Tất cả số viết bằng chữ số? Tiền dùng $X,XXX?
- [ ] **KT12 Terminology:** Mỗi khái niệm chỉ dùng 1 thuật ngữ xuyên suốt? Không lẫn lộn?
- [ ] **KT13 Emotional Pacing:** Backstory & moment cảm xúc có hơi thở? Không liệt kê nhanh? Có mini-scene?
- [ ] **KT14 Dialogue Callback:** Có ≥1 câu thoại xuyên suốt (villain nói → hero dùng lại ở climax)? Câu ≤15 từ? Power shift rõ ràng? Lần 3 trước công chúng?
- [ ] **KT14 Hero Signature Line** (tùy chọn): Có cụm từ đặc trưng hero lặp lại ≥3 lần? Weight thay đổi qua story?
- [ ] **KT15 Anaphora Leo Thang:** Có ≥1 đoạn lặp cùng cấu trúc 3 lần + tăng dần? Lần 3 mạnh nhất (có từ nối leo thang)? Max 1-2 lần/script?
- [ ] **KT16 Scene Opening Context:** Mở scene mới có 1-2 câu đặt viewer vào không gian + thời gian TRƯỚC hành động? Không staccato trống ở đầu scene?

### G3. KỸ THUẬT MỚI (từ Charlotte Dobre analysis) — Universal

- [ ] **Promise-Break** (tùy chọn): Có cơ hội villain hứa → phản bội? Đã áp dụng?
- [ ] **Contrast Karma** (tùy chọn): Resolution có 2 đoạn song song hero wins vs villain losses?
- [ ] **Specificity Shock Numbers:** Con số karma có 3 loại (Impact/Irony/Scale)? Có tạo contrast?
- [ ] **Transformation Arc** (tùy chọn): Hero thay đổi so với đầu story? Callback vulnerability?
- [ ] **Comedy Encore / Victory Lap** (STRATEGY/COMEDY): Có scene comedy sau resolution? Hero dùng leverage mới? ≤200 từ? Có punchline?
- [ ] **Hypocrisy Angle** (tùy chọn): Villain có enforce rule mà bản thân vi phạm? Reveal ở đúng thời điểm (P5-P6)?
- [ ] **Narrator Reframe** (tùy chọn): Có 1-3 câu narrator reframe sau payoff moments? Giọng calm observation?

### G4. CHARACTER DEPTH — 3 C's (Universal)

> *Nguồn: Hilary Layne "3 C's of Character Creation" (252K views) + Pro Screenwriters character techniques*

**COMPLEXITY (Phức tạp):**
- [ ] Hero có ≥3 traits rõ ràng được **SHOW** qua hành động (không chỉ TOLD)?
- [ ] Villain có ≥3 traits rõ ràng, không chỉ "evil vì evil"?
- [ ] Ít nhất 1 cặp traits có **INTERPLAY** (mâu thuẫn hoặc bổ sung) ở hero HOẶC villain?
- [ ] Hero flaw xuất phát từ **extreme trait** (organic, not random)?
- [ ] Villain flaw → **conviction** (villain TIN mình đúng) → Iconic Villain Line?
- [ ] Morally gray KHÔNG được dùng làm shortcut cho complexity?

**CONSISTENCY (Nhất quán):**
- [ ] Hero trait chính được **SHOW ≥2 lần** TRƯỚC climax (qua hành động/quyết định)?
- [ ] Villain trait chính được **SHOW ≥2 lần** TRƯỚC downfall?
- [ ] **"Same trait → Different results"?** (trait gây FAIL ở escalation + WIN ở climax?)
- [ ] Audience có thể **PREDICT** hành vi hero/villain dựa trên traits đã SHOW trước đó?

**MOTIVATION (Động lực):**
- [ ] Hero motivation xuất phát từ **TRAIT COMBINATION** (không random/external only)?
- [ ] Villain motivation xuất phát từ **CONVICTION** (extreme trait → blind spot)?
- [ ] Motivation drive hành động ở climax? (không phải "suddenly brave")

## H. TỔNG QUAN — Universal

- [ ] Word Count: 3.000–4.000 từ? Không kéo dài / thêm từ vô nghĩa?
- [ ] Phiên bản song ngữ: Có cả EN và VI?
- [ ] Ngôi thứ nhất? Văn xuôi liền mạch? Không tiêu đề/ghi chú kỹ thuật?

---

# PHẦN 2: TIÊU CHÍ THEO NHÓM PATTERN

> Chọn **MỘT** trong 3 bộ tiêu chí dưới đây.

---

## 🔥 NHÓM FURY — MC (solo), Sympathetic Victim, Foreclosure

> **Triết lý review:** Kịch bản phải khiến khán giả GHÉT villain, THƯƠNG hero, và HẢ HÊ khi justice đến.

### D-FURY. YẾU TỐ BỔ TRỢ

- [ ] **Emotional Object** xuất hiện đủ **5 giai đoạn**:
  1. Giới thiệu (gắn kỷ niệm/người đã mất)
  2. Bị đe dọa
  3. Bị phá hủy/tấn công
  4. Flashback (hồi tưởng moment đẹp)
  5. Tái sinh/khôi phục
- [ ] **Sensory Palette**: 2-3 chi tiết giác quan khác loại mỗi cảnh lớn (sờ, nghe, ngửi — không chỉ nhìn)?
- [ ] **Audience Complicity Zone**: Dùng "She didn't know" / "Đếm tội" hiệu quả?
  - [ ] Complicity zone ≥300 từ?
  - [ ] Khán giả biết điều villain không biết?
- [ ] **Fury build-up**: Villain escalation có tạo phẫn nộ tăng dần? 3+ tội ác cụ thể?
- [ ] **Villain Iconic Line**: Có ≥1 câu thoại villain đủ ghét để comment section quote?

### E-FURY. CLIMAX (6 Lớp)

- [ ] Lớp 1: **Đỉnh cao giả** — villain tự tin nhất, tưởng đã thắng?
- [ ] Lớp 2: **Công lý xuất hiện** — đảo chiều 180°, bằng chứng/ally trình?
- [ ] Lớp 3: **Quiet Beat** — 2-3 câu tĩnh, hít thở trước mic drop?
- [ ] Lớp 4: **Mic Drop** — 1 câu ≤15 từ, bình tĩnh, sát thương cao?
- [ ] Lớp 5: **Phản ứng dây chuyền** — cả phòng/cộng đồng bùng nổ?
- [ ] Lớp 6: **Villain tự hủy** — villain hành vi tự hại (kêu gào, chạy, thú tội)?

### F-FURY. MICRO-CLIFFHANGER

- [ ] Mỗi scene kết bằng cliffhanger?
- [ ] ≥50% là câu hỏi tu từ trực tiếp?
- [ ] ≥50% dùng **Dual Cliffhanger** (emotion + plot)?
- [ ] Tổng 5-7 cliffhanger (không nhồi nhét)?
- [ ] Max 1 release valve?
- [ ] Cliffhanger gây **tension/fury** — "Liệu villain có đi xa hơn nữa?"

---

## 🧠 NHÓM STRATEGY — Board Takeover, Dissolve, Legal Trap, Property Rights, Financial Fraud

> **Triết lý review:** Kịch bản phải khiến khán giả ADMIRE sự thông minh của hero, NỂ PHỤC cách checkmate, và CẢM THẤY satisfying khi villain thua.

### D-STRATEGY. YẾU TỐ BỔ TRỢ

- [ ] **Evidence Trail**: Bằng chứng được giới thiệu dần (≥3 mảnh), mỗi mảnh tăng weight?
  - [ ] Mảnh 1: Manh mối nhỏ (hero nghi ngờ)
  - [ ] Mảnh 2: Xác nhận (hero research thêm)
  - [ ] Mảnh 3: Smoking gun (bằng chứng knock-out)
- [ ] **Document as Weapon**: Mỗi document có **tên cụ thể** (không "giấy tờ" chung chung)? Gắn với 1 plot turn? Được giới thiệu trước khi dùng?
- [ ] **Research Journey credible**: Hero tìm qua nhiều bước? Không "Google 5 phút là xong"?
  - [ ] Có ≥2 nguồn khác nhau (county records, bylaws, luật sư, hàng xóm cũ)?
  - [ ] Có moment vấp ngã/bế tắc trước khi tìm ra?
- [ ] **Expert-proof Details**: Chi tiết pháp lý chính xác? Số code, tên luật, quy trình?
  - [ ] Không có logic hole mà luật sư/expert sẽ soi?
- [ ] **Ally System**: Có ally mạnh với vai trò cụ thể? (Không chỉ "hàng xóm ủng hộ")
  - [ ] Ally mang lại gì? (Chuyên môn, bằng chứng, kết nối, dũng cảm)
- [ ] **Villain Power Display**: Villain thể hiện quyền lực THỰC SỰ (phạt, kiện, đe dọa) — không chỉ "hàng xóm ghét"?

### E-STRATEGY. CLIMAX (Checkmate)

- [ ] Lớp 1: **Bối cảnh công khai** — cuộc họp HOA / phiên tòa / trước mặt tất cả?
- [ ] Lớp 2: **Villain last stand** — villain cố phản bác / thuê luật sư / đe dọa?
- [ ] Lớp 3: **Hero trình bằng chứng** — tuần tự, mỗi piece build lên piece trước?
- [ ] Lớp 4: **Checkmate moment** — 1 document/1 câu kết thúc tranh cãi, villain KHÔNG THỂ chối?
- [ ] Lớp 5: **Power shift** — villain mất quyền CỤ THỂ (chức, tiền, tự do)?
- [ ] Lớp 6: **Community validation** — cộng đồng xác nhận hero đúng (standing ovation, vote, applause)?

### F-STRATEGY. MICRO-CLIFFHANGER

- [ ] Mỗi scene kết bằng cliffhanger?
- [ ] ≥50% là **information-gap cliffhanger** — "Hero phát hiện gì tiếp theo?"
- [ ] Có ≥2 cliffhanger dạng **false defeat** — "Kế hoạch có bị đổ bể?"
- [ ] Tổng 5-7 cliffhanger?
- [ ] Cliffhanger gây **hồi hộp/tò mò** — "Liệu checkmate có hoạt động?"
- [ ] Có cliffhanger ngay trước climax — tension peak?

---

## 😂 NHÓM COMEDY — Community Comedy, MC (tone hài)

> **Triết lý review:** Kịch bản phải khiến khán giả CƯỜI, NỂ PHỤC sự sáng tạo, và SẢNG KHOÁI khi villain bẽ mặt.

### D-COMEDY. YẾU TỐ BỔ TRỢ

- [ ] **Running Gag / Recurring Visual**: Có 1 hình ảnh/hành động lặp lại ≥3 lần, mỗi lần FUNNIER?
  - [ ] Lần 1: Giới thiệu (gây cười nhẹ)
  - [ ] Lần 2: Biến tấu (cười to hơn)
  - [ ] Lần 3: Payoff (bùng nổ)
- [ ] **Escalation Loop Quality**: ≥2 vòng có đủ cấu trúc?
  - [ ] Mỗi vòng: Hero troll → Villain bịt → Hero adapt (funnier + bigger)?
  - [ ] Mỗi vòng funnier hơn vòng trước (kiểm tra: đọc lại có cười tăng dần không)?
  - [ ] "Whack-a-mole" effect — HOA đập 1 chỗ → mọc 3 chỗ?
- [ ] **Community Participation Arc**: Quá trình join có tự nhiên?
  - [ ] 1 hàng xóm → 3 → tipping point → cả khu?
  - [ ] Không phải "tất cả cùng join ngay"?
  - [ ] Mỗi hàng xóm join có lý do cá nhân?
- [ ] **Technically Correct**: Hero ĐÚNG LUẬT 100%? Villain KHÔNG CÓ CĂN CỨ phạt?
  - [ ] Đây là nguồn comedy — "technically, I'm not violating anything"
- [ ] **Villain Kiêu Ngạo**: Villain TỰ TIN ban đầu? Mỗi vòng càng tức, phản ứng càng quá đà?
  - [ ] Villain làm khán giả bực (kiêu ngạo) chứ không villain làm khán giả GHÉT (ghê tởm)?
- [ ] 🎭 **Flaw Escalation** *(TED-Ed)*: Villain có 1 flaw cốt lõi? Flaw được phóng đại thêm 1 bậc qua MỖI vòng?
  - [ ] VD: đo cỏ (vòng 1) → đo gnome (vòng 2) → lập Excel tracking (vòng 3)
- [ ] 🎭 **Opposite Reaction** *(TED-Ed)*: Mỗi lần Villain TĂNG sự nghiêm trọng → Hero TĂNG sự bình thản?
  - [ ] Villain hét → Hero nhấp cà phê? Tương phản tăng dần qua mỗi vòng?
- [ ] 🎭 **Incongruity Escalation** *(TED-Ed)*: Running Gag tăng SỰ BẤT HỢP LÝ (không chỉ tăng số lượng)?
  - [ ] VD: flamingo trên sân (hơi lạ) → flamingo mặc áo vest (rất lạ) → flamingo 8ft với biển HOA APPROVED (peak absurd)

### E-COMEDY. CLIMAX (Bẽ mặt + Celebration)

- [ ] Lớp 1: **Escalation peak** — vòng cuối cùng, scale lớn nhất (cả khu cùng hành động)?
- [ ] Lớp 2: **Villain overreact** — villain phản ứng quá đà, tự tạo spectacle?
- [ ] Lớp 3: **Public bẽ mặt** — cuộc họp / trước mặt cả khu → cả phòng CƯỜI (không phải silence sốc)?
- [ ] Lớp 4: **Punchline moment** — 1 câu/1 hành động đóng nắp, hài hước + satisfying?
- [ ] Lớp 5: **Villain exit** — villain rời đi (bán nhà, từ chức, lẩm bẩm bỏ đi) — KHÔNG bị hủy diệt?
- [ ] Lớp 6: **Celebration** — khu phố ăn mừng, thứ bị cấm thành biểu tượng, legacy moment?

### F-COMEDY. MICRO-CLIFFHANGER

- [ ] Mỗi vòng escalation kết bằng cliffhanger?
- [ ] ≥50% là **anticipation cliffhanger** — "Hero sẽ nghĩ ra gì tiếp?"
- [ ] Có ≥1 cliffhanger dạng **troll-fail** — "Lần này hero có thua?"
- [ ] Tổng 4-6 cliffhanger (comedy nhịp nhanh hơn, ít hơn FURY)?
- [ ] Cliffhanger gây **tò mò vui** — "Trời ơi, vòng này sẽ hài hơn?"
- [ ] KHÔNG dùng cliffhanger nặng/dark — tone phải nhẹ nhàng?

### G-COMEDY. KỸ THUẬT VIẾT HÀI *(TED-Ed)*

- [ ] 🎭 **Zig Zig Zag (Rule of Three ở cấp câu)**: Liệt kê dùng pattern 2 item bình thường + 1 item bất ngờ cuối?
  - [ ] VD: "Phạt vì cỏ dài. Phạt vì xe sai. Phạt vì thùng rác sai **shade of green**." — item 3 = absurd nhất
- [ ] 🎭 **Punch-End Rule**: Từ/cụm từ gây cười nhất ở VỊ TRÍ CUỐI câu?
  - [ ] ✅ "Bà ta đo cỏ. Hàng tuần. Bằng thước. **Tôi không đùa.**"
  - [ ] ❌ "Tôi không đùa — bà ta đo cỏ bằng thước hàng tuần."
- [ ] 🎭 **Keep It Lean**: Nhịp comedy nhanh? Câu ngắn? Không giải thích joke?
  - [ ] Villain setup MAX 2-3 câu? Reaction MAX 1-2 câu?
  - [ ] Không có đoạn chậm >100 từ liên tiếp (comedy pacing nhanh hơn FURY)?

---

# PHẦN 3: TỔNG KẾT

### Bước 5: Tổng kết

- **Điểm tổng**: ⭐/5
- **Top 3 điểm mạnh**
- **Top 3 điểm yếu** cần cải thiện ưu tiên
- **Verdict**: ✅ Đạt / ⚠️ Cần chỉnh sửa / ❌ Cần viết lại

### Bước 6: Lưu file review

- Tạo file review tại `Review/Review-[slug-kịch-bản]-V1.md`
- **Ví dụ:** Kịch bản `Script-hoa-brenda-mustang-EN-V1.md` → Review: `Review/Review-hoa-brenda-mustang-V1.md`
- Nếu review lại sau chỉnh sửa → tăng version: V2, V3...

---

## Input cần thiết:
- File kịch bản từ folder `Kich Ban/EN/` hoặc `Kich Ban/VI/` (format: `Script-[slug]-EN/VI-V1.md`)
- (Tùy chọn) Yêu cầu focus vào mục cụ thể nào đó

## Output:
- File review chi tiết trong folder `Review/` (format: `Review-[slug]-V1.md`)
- Tóm tắt kết quả review cho user trong chat

---

## Template file review:

```markdown
# 📝 REVIEW KỊCH BẢN: [Tên kịch bản]

**Ngày review:** [ngày]
**File gốc:** [đường dẫn file kịch bản]
**Word Count:** [số từ]
**Pattern:** [HOA pattern]
**Nhóm review:** [🔥 FURY / 🧠 STRATEGY / 😂 COMEDY]

---

## PHẦN 1: UNIVERSAL

### A. HOOK (Mở đầu) — ⭐⭐⭐⭐ (4/5)
[Nhận xét chi tiết, dẫn chứng cụ thể]

**✅ Đạt:**
- ...

**❌ Chưa đạt:**
- ...

**💡 Gợi ý sửa:**
- ...

---

### B. MACRO QUESTION — ⭐⭐⭐ (3/5)
[Tương tự...]

---

### C. LATDE — ⭐⭐⭐⭐ (4/5)
[Tương tự...]

---

### D0. MINI ARCS & THEREFORE — ⭐⭐⭐ (3/5)
[Tương tự...]

---

### G. VĂN PHONG & NHỊP ĐỘ — ⭐⭐⭐⭐ (4/5)
[Tương tự...]

---

### H. TỔNG QUAN — ⭐⭐⭐⭐ (4/5)
[Tương tự...]

---

## PHẦN 2: [🔥 FURY / 🧠 STRATEGY / 😂 COMEDY]-SPECIFIC

### D-[NHÓM]. YẾU TỐ BỔ TRỢ — ⭐⭐⭐ (3/5)
[Đánh giá theo checklist nhóm tương ứng]

---

### E-[NHÓM]. CLIMAX — ⭐⭐⭐⭐ (4/5)
[Đánh giá theo checklist nhóm tương ứng]

---

### F-[NHÓM]. MICRO-CLIFFHANGER — ⭐⭐⭐ (3/5)
[Đánh giá theo checklist nhóm tương ứng]

---

## 📊 TỔNG KẾT

| Phần | Đầu mục | Điểm |
|------|---------|------|
| Universal | A. Hook | ⭐⭐⭐⭐ |
| Universal | B. Macro Question | ⭐⭐⭐ |
| Universal | C. LATDE | ⭐⭐⭐⭐ |
| Universal | D0. Mini Arcs | ⭐⭐⭐ |
| Universal | G. Văn phong | ⭐⭐⭐⭐ |
| Universal | G4. Character Depth | ⭐⭐⭐ |
| Universal | H. Tổng quan | ⭐⭐⭐⭐ |
| [NHÓM] | D. Yếu tố bổ trợ | ⭐⭐⭐ |
| [NHÓM] | E. Climax | ⭐⭐⭐⭐ |
| [NHÓM] | F. Cliffhanger | ⭐⭐⭐ |

**Điểm tổng: ⭐⭐⭐⭐ (4/5)**

### 💪 Điểm mạnh:
1. ...
2. ...
3. ...

### ⚠️ Cần cải thiện:
1. ...
2. ...
3. ...

### Verdict: ⚠️ Cần chỉnh sửa
[Nhận xét tổng quan...]
```

---

## 📋 BẢNG TÓM TẮT: SO SÁNH 3 NHÓM REVIEW

| Đầu mục | 🔥 FURY | 🧠 STRATEGY | 😂 COMEDY |
|---------|---------|-------------|-----------|
| **D. Yếu tố bổ trợ** | Emotional Object 5 giai đoạn + Fury build-up + Villain Iconic Line | Evidence Trail 3 mảnh + Research Journey + Expert-proof | Running Gag 3 lần + Escalation Loop + Community Arc + Technically Correct + 🎭 Flaw Escalation + Opposite Reaction + Incongruity Escalation |
| **E. Climax** | 6 lớp: Đỉnh giả → Công lý → Quiet Beat → Mic Drop → Dây chuyền → Tự hủy | 6 lớp: Bối cảnh công khai → Last stand → Trình bằng chứng → Checkmate → Power shift → Validation | 6 lớp: Escalation peak → Villain overreact → Bẽ mặt → Punchline → Villain exit → Celebration |
| **F. Cliffhanger** | Tension/fury — "Villain có đi xa hơn?" ≥50% Dual, 5-7 cái | Information-gap — "Hero phát hiện gì?" ≥2 false defeat, 5-7 cái | Anticipation/vui — "Hero nghĩ ra gì tiếp?" ≥1 troll-fail, 4-6 cái |
| **G. Kỹ thuật viết** | (Universal: KT1-KT16) | (Universal: KT1-KT16) | (Universal: KT1-KT16) + 🎭 Zig Zig Zag + Punch-End + Keep It Lean |
| **Climax kết thúc bằng** | Villain TỰ HỦY | Villain MẤT QUYỀN | Villain BẼ MẶT rời đi |
| **Cliffhanger tone** | Nặng, căng | Hồi hộp, tò mò | Nhẹ nhàng, vui |

---

## Lưu ý quan trọng:
- **Xác định nhóm TRƯỚC** khi review — đừng dùng FURY checklist cho Comedy script
- Nếu kịch bản combo ≥2 patterns → chọn nhóm của pattern **DOMINANT** (chiếm nhiều từ nhất)
- Universal (A, B, C, D0, G, G4, H) luôn áp dụng — Pattern-specific (D, E, F) thay đổi theo nhóm
- Khi gợi ý sửa → gợi ý phải **phù hợp nhóm pattern**, không generic
