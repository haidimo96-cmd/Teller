---
description: "Anti-patterns + Format đầu ra + QA Checklist — Script Note VO (Phần 4/4)"
activation: manual
---
# 🎙️ SCRIPT NOTE — ANTI-PATTERNS & QA (Phần 4/4)

> Các lỗi thường gặp cần tránh, format output chuẩn, và checklist kiểm tra chất lượng.
>
> **Xem thêm:** Foundations → `vo-foundations.md` | Tags Reference → `vo-tags-reference.md` | Tagging Rules → `vo-tagging-rules.md`

---

# 7. ANTI-PATTERNS — TUYỆT ĐỐI TRÁNH

## ❌ 7.1. Flat Line — 1 tag suốt cả dòng dài
```
❌ BAD:
[cold] "A plastic flamingo is not a decoration, Mrs. Martinez. It's a declaration of war on property values."
→ 2 câu cùng 1 tag, giọng phẳng, không dynamics

✅ GOOD:
[cold] "A plastic flamingo is not a decoration, Mrs. Martinez... [ominous] It's a declaration of war on property values... [inhales]"
→ 2 câu = 2 tag, có shift cường độ
```

## ❌ 7.2. Tag Soup — Tag shift trên CÂU LIỆT KÊ (không có tăng/giảm)
```
❌ BAD:
[cold] I'm a citizen... [tense] I pay dues, [calculating] I mow... [inhales] I bring trash in.
→ Nội dung liệt kê PHẲNG nhưng tag shift liên tục = giọng nhảy loạn

✅ GOOD:
[calm, matter-of-fact] I'm a law-abiding citizen. I pay my dues on time. I mow on schedule. I bring my trash cans in before dark... I'm that neighbor.
→ Nội dung liệt kê phẳng → giữ 1 tag, shift ở câu kết
```

**QUY TẮC:** Tag shift chỉ có ý nghĩa khi NỘI DUNG cũng leo thang/chuyển hướng.
- Nội dung LEO THANG → tag shift mỗi câu ✅
- Nội dung LIỆT KÊ PHẲNG → giữ 1 tag, shift ở câu kết ✅

## ❌ 7.3. Emotion Ping-Pong — Nhảy ngẫu nhiên KHÔNG theo arc
```
❌ BAD: [cold] Câu 1. [nervous] Câu 2. [excited] Câu 3. [sad] Câu 4.
→ cold → nervous → excited → sad = không có hướng, loạn

✅ GOOD: [cold] Câu 1... [tense] Câu 2, [ominous] Câu 3... [inhales]
→ cold → tense → ominous = LEO THANG theo 1 hướng
```

## ❌ 7.4. Metadata Bleed
```
❌ BAD: [calculating] What loophole was in the rulebook?  ← cliffhanger marker bị đọc
❌ BAD: [revealing] - ✅ Hook opens with shocking situation  ← checklist bị đọc
❌ BAD: [intense] EPILOGUE PUNCHLINE — DELIVERED  ← marker bị đọc
✅ GOOD: Xóa sạch tất cả dòng trên
```

## ❌ 7.5. Pause Stacking — Quá nhiều pauses KHÔNG có text xen giữa
```
❌ BAD: ... ... ... [inhales]  ← nhiều pauses liên tiếp, không text
❌ BAD: Câu 1. [short pause] [tag] Câu 2.  ← dùng [short pause] (đã loại bỏ)
✅ GOOD: Câu... [tag] Câu, [tag] Câu... [inhales]
→ Mỗi pause PHẢI có text + tag sau nó. Dùng `,` và `...` thay `[short pause]`
```

## ❌ 7.6. Tag mâu thuẫn context
```
❌ BAD: [happy] "You should be ASHAMED."  ← emotion ≠ content
❌ BAD: [excited] The house felt different. Quieter.  ← energy ≠ mood
✅ GOOD: [cold, disgusted] "You should be ASHAMED."
✅ GOOD: [reflective, quiet] The house felt different. Quieter.
```

## ❌ 7.7. Non-audio tags (v3 không hiểu)
```
❌ KHÔNG DÙNG: [standing], [grinning], [pacing], [nodding], [walking]
✅ DÙNG: Chỉ tags mô tả ÂM THANH / GIỌNG NÓI / CẢM XÚC
```

## ❌ 7.8. 🆕 Pattern Mismatch — Dùng tag sai nhóm pattern
```
❌ BAD (COMEDY story):
[cold, sharp] Patricia Caldwell stands on her porch at 8:47 AM, binoculars pressed to her eyes.
→ Narrator sounds ANGRY — nhưng đây là COMEDY, narrator phải AMUSED

✅ GOOD (COMEDY story):
[amused] Patricia Caldwell stands on her porch at 8:47 AM, binoculars pressed to her eyes.
→ Narrator thấy Patricia absurd, kể cho viewer cười cùng

❌ BAD (Backstory emotional):
[calm, matter-of-fact] Victor called Rosa "Flamingo" for 40 years.
→ Tag TRUNG TÍNH cho đoạn CẢM XÚC NHẤT = phẳng lì

✅ GOOD (Backstory emotional):
[tender] Victor called Rosa "Flamingo" for 40 years.
→ Narrator cũng xúc động khi kể — tag phản ánh điều đó
```

**QUY TẮC:** Trước khi dùng tag, hỏi: "Narrator kể kiểu COMEDY villain hay THRILLER villain? Hero troll playful hay hero ĐÁNH LẠI cold?" → Chọn tag family tương ứng.

## ❌ 7.9. 🆕 Flat Villain — Villain cùng 1 tag family suốt story
```
❌ BAD: Patricia = [cold, deliberate] từ đầu đến lúc resign
→ Flat, không có humanity

✅ GOOD: Patricia evolves:
  B-2: [cold, deliberate] (controlling)
  C-4: [vulnerable] (interview: "All I ever wanted...")
  E: [genuine] (resign: "I did want it to be beautiful")
→ 3 phases → villain human → story satisfying hơn
```

---

# 8. FORMAT ĐẦU RA

## Mỗi file .txt — Format với single-word tags + official pauses:
```
[tag] Câu đầu tiên... [tag mới] Câu thứ hai, [tag mới] Câu thứ ba... [inhales]

[tag] Câu đầu đoạn mới... [tag mới] Câu tiếp, [tag mới] Câu kết... [inhales]

[tag] "Dialogue câu 1... [tag shift] Dialogue câu 2, [tag shift] Dialogue câu 3... [inhales]"

[tag] Closing narrative... [tag mới] Câu kết section... [inhales]
```

## Ví dụ output chuẩn — FURY pattern (Pride Lights):
```
[cold] "Take that rag down... [tense] Right now, [calculating] Or it's a hundred dollars a day until you do... [inhales]"

[dark] That was my good morning... [thoughtful] Seven a.m., [cold] Saturday, barely awake, coffee not even brewed yet, and Karen — president of our HOA, queen of the clipboard, unelected dictator of all things beige — was standing at the foot of my front porch, [inhales] jabbing her citation pad at the small Pride flag hanging from my railing.

[cold] But she didn't stop there...

[tense] She stepped up onto my porch steps — onto my property — and leaned in close... [excited] Close enough that I could smell her cheap hand cream, [cold] She pointed at the flag... [inhales] Then at my face.

[thoughtful] "Let me be honest," she tilted her head closer... [thoughtful] "This lifestyle, [dark] What you do behind your four walls, I don't care... [inhales]" She waved her hand like she was shooing a fly... [calculating] "But you bring it outside, in front of families? [ominous] You should be ASHAMED... [inhales]"

[reflective] My heart was pounding... [cold] Ears burning, [tense] Fists clenched so tight my nails dug into my palms.

[calculating] She wasn't talking about the flag... [dark] She was talking about me, [tense] About who I am... [inhales] About my right to exist.
```

## Ví dụ output chuẩn — COMEDY pattern (Flamingo):
```
[amused] Patricia Caldwell stands on her porch at 8:47 AM on a Tuesday, binoculars pressed to her eyes... [amused] She's not birdwatching, [flatly] She's measuring...

[playfully] But what Patricia doesn't know — that flamingo has 200 friends... [mischievously] And they're ALL coming... [inhales]
```

---

# 9. QA CHECKLIST

## Clean Check:
- [ ] Không còn metadata đầu file?
- [ ] Không còn markdown headings / formatting?
- [ ] Không còn technical markers (`[CLIFFHANGER]`, `[CTA]`, `[PUNCHLINE]`)?
- [ ] Không còn footnotes / retention checklist cuối?
- [ ] Không còn ghi chú kỹ thuật nào sẽ bị đọc ra?

## Tag Quality:
- [ ] Mỗi dòng mở bằng single-word tag (hoặc 2 single tags liên tiếp)?
- [ ] Dialogue có tag trước quote? Dialogue dài có shift giữa quote?
- [ ] Mid-sentence tag shifts: mỗi dòng có 2-4 tag shifts (sau dấu chấm/phẩy)?
- [ ] Tag shifts đi theo 1 HƯỚNG (leo thang / hạ nhiệt), không ping-pong?
- [ ] **KHÔNG còn `[short pause]`?** Dùng `,` và `...` thay thế?
- [ ] **KHÔNG còn `[long pause]`?** Dùng `...` + xuống dòng thay thế?
- [ ] Breathing tags 3-5 / file? `[inhales]` đi cuối chuỗi: `... [inhales]`?
- [ ] CAPS 5-8 moments / part?
- [ ] Nội dung liệt kê phẳng → giữ 1 tag (không shift trên danh sách phẳng)?
- [ ] Không có Flat Line (1 tag suốt dòng dài nhiều câu)?
- [ ] Không có tag mâu thuẫn context?
- [ ] Không có non-audio tags (standing, grinning, pacing...)?
- [ ] **3-Tier compliance:** Tier 1 tags đã thay bằng official? (~~deadpan~~→flatly, ~~wry~~→sarcastic...)?
- [ ] Tier 2 tags (🟡) dùng custom: `[cold]`, `[intimate]`, `[quiet]`, `[tender]`, `[warm]`, `[knowing]`?

## 🆕 Context Quality:
- [ ] Tags phản ánh CẢM XÚC NARRATOR (§1.4), không chỉ mô tả text?
- [ ] Tags thuộc đúng NHÓM PATTERN (§4.5)? Comedy = comedy tags, Fury = fury tags?
- [ ] Villain có EVOLUTION (§7.9)? Không dùng cùng 1 tag family suốt story?
- [ ] Sacred phrases / motif phrases dùng CÙNG tag `[intimate]`🟡 mỗi lần lặp (mirrored)?

## 🆕 ElevenLabs Compatibility:
- [ ] **KHÔNG còn `[short pause]`, `[pause]`, `[strategic pause]`, `[long pause]`?**
- [ ] KHÔNG còn `[inhales deeply]`? (dùng `[inhales sharply]`)
- [ ] Ưu tiên single-word tags? Compound tags chỉ dùng khi thật cần?
- [ ] **Tier 1 tags đã thay hết?** (~~deadpan~~, ~~wry~~, ~~impressed~~, ~~emotional~~, ~~bright~~, ~~breaking~~, ~~playful~~, ~~cutting~~, ~~serious~~)
- [ ] Tier 3 tags (🟠) đã test trên ElevenLabs? (heavy, vulnerable, amused, tense, determined, genuine)

## File Check:
- [ ] Mỗi file ≤800 từ text thuần?
- [ ] Cắt file ở scene transition / beat tự nhiên?
- [ ] Naming đúng convention: `Part_[X]_-_[NAME].txt`?
- [ ] Encoding UTF-8?
